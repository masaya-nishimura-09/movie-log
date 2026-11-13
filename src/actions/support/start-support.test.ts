import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT ${url}`);
});
const create = vi.fn();

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/i18n/get-dictionary", () => ({
  getDictionaryFor: async () => ({
    support: { productName: "Cinelier への応援" },
  }),
}));
vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { create } };
  },
}));

async function load(useMock = false) {
  vi.resetModules();
  vi.stubEnv("USE_MOCK", useMock ? "true" : "false");
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_dummy");
  vi.stubEnv("SITE_URL", "https://cinelier.example");
  return (await import("@/actions/support/start-support")).startSupportAction;
}

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  create.mockResolvedValue({
    url: "https://checkout.stripe.com/c/pay/cs_test",
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("startSupportAction", () => {
  it("creates a Checkout Session for the chosen amount in yen and moves to it", async () => {
    const action = await load();
    await expect(
      action("ja", undefined, form({ choice: "500" })),
    ).rejects.toThrow(
      "NEXT_REDIRECT https://checkout.stripe.com/c/pay/cs_test",
    );
    expect(create).toHaveBeenCalledWith({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "jpy",
            unit_amount: 500,
            product_data: { name: "Cinelier への応援" },
          },
        },
      ],
      locale: "ja",
      success_url:
        "https://cinelier.example/ja/support/thanks?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://cinelier.example/ja/support",
    });
  });

  it("uses the amount entered for a custom choice", async () => {
    const action = await load();
    await expect(
      action(
        "en",
        undefined,
        form({ choice: "custom", customAmount: "１,２００" }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(create.mock.calls[0]?.[0].line_items[0].price_data.unit_amount).toBe(
      1200,
    );
  });

  it("returns field errors without calling Stripe", async () => {
    const action = await load();
    expect(await action("ja", undefined, form({}))).toMatchObject({
      success: false,
      errors: { choice: ["choiceRequired"] },
    });
    expect(
      await action(
        "ja",
        undefined,
        form({ choice: "custom", customAmount: "" }),
      ),
    ).toMatchObject({ errors: { customAmount: ["customAmountRequired"] } });
    for (const customAmount of ["99", "10001", "abc", "100.5"]) {
      expect(
        await action("ja", undefined, form({ choice: "custom", customAmount })),
      ).toMatchObject({ errors: { customAmount: ["customAmountOutOfRange"] } });
    }
    expect(create).not.toHaveBeenCalled();
  });

  it("returns unexpectedError when Stripe fails", async () => {
    create.mockRejectedValue(new Error("down"));
    const action = await load();
    expect(await action("ja", undefined, form({ choice: "300" }))).toEqual({
      success: false,
      messageKey: "unexpectedError",
    });
  });

  it("moves straight to the thanks page in mock mode", async () => {
    const action = await load(true);
    await expect(
      action("ja", undefined, form({ choice: "1000" })),
    ).rejects.toThrow(
      "NEXT_REDIRECT /ja/support/thanks?session_id=cs_mock_1000",
    );
    expect(create).not.toHaveBeenCalled();
  });
});
