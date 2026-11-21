import { beforeEach, describe, expect, it, vi } from "vitest";

const set = vi.fn();
const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT ${url}`);
});

vi.mock("next/headers", () => ({ cookies: async () => ({ set }) }));
vi.mock("next/navigation", () => ({ redirect }));

const { changeLocaleAction } = await import("@/actions/locale/change-locale");

describe("changeLocaleAction", () => {
  beforeEach(() => {
    set.mockClear();
    redirect.mockClear();
  });

  it("saves the language and opens the same page in it", async () => {
    await expect(changeLocaleAction("en", "/account")).rejects.toThrow(
      "NEXT_REDIRECT /en/account",
    );
    expect(set).toHaveBeenCalledWith("NEXT_LOCALE", "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  });

  it("ignores an unknown language or a path to another site", async () => {
    await changeLocaleAction("fr", "/account");
    await changeLocaleAction("en", "//evil.example");
    await changeLocaleAction("en", "https://evil.example");
    expect(set).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
