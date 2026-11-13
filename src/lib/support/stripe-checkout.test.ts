import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const retrieve = vi.fn();

vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { retrieve } };
  },
}));

async function load(useMock = false) {
  vi.resetModules();
  vi.stubEnv("USE_MOCK", useMock ? "true" : "false");
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_dummy");
  return (await import("@/lib/support/stripe-checkout"))
    .getCompletedSupportAmount;
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getCompletedSupportAmount", () => {
  it("returns the amount of a completed Checkout Session", async () => {
    retrieve.mockResolvedValue({ status: "complete", amount_total: 500 });
    const get = await load();
    expect(await get("cs_test_1")).toBe(500);
    expect(retrieve).toHaveBeenCalledWith("cs_test_1");
  });

  it("returns null for a Checkout Session that is not completed", async () => {
    const get = await load();
    for (const status of ["open", "expired"]) {
      retrieve.mockResolvedValue({ status, amount_total: 500 });
      expect(await get("cs_test_1")).toBeNull();
    }
  });

  it("reads the amount from a mock session ID in mock mode", async () => {
    const get = await load(true);
    expect(await get("cs_mock_500")).toBe(500);
    expect(retrieve).not.toHaveBeenCalled();
  });

  it("returns null for any other session ID in mock mode", async () => {
    const get = await load(true);
    for (const id of ["cs_test_1", "cs_mock_", "cs_mock_abc", "cs_mock_500x"]) {
      expect(await get(id)).toBeNull();
    }
    expect(retrieve).not.toHaveBeenCalled();
  });
});
