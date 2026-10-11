import { beforeEach, describe, expect, it, vi } from "vitest";
import en from "@/i18n/dictionaries/en.json";
import ja from "@/i18n/dictionaries/ja.json";

const rootLang = vi.fn<() => Promise<string>>();

vi.mock("next/root-params", () => ({ lang: () => rootLang() }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));

const { getDictionary, getLocale } = await import("@/i18n/get-dictionary");

beforeEach(() => {
  rootLang.mockReset();
});

describe("getLocale", () => {
  it("returns the locale of the URL", async () => {
    rootLang.mockResolvedValue("ja");
    await expect(getLocale()).resolves.toBe("ja");
  });

  it("shows not found for an unsupported locale", async () => {
    rootLang.mockResolvedValue("fr");
    await expect(getLocale()).rejects.toThrow("NOT_FOUND");
  });
});

describe("getDictionary", () => {
  it("returns the dictionary of the locale", async () => {
    rootLang.mockResolvedValue("ja");
    await expect(getDictionary()).resolves.toEqual(ja);
    rootLang.mockResolvedValue("en");
    await expect(getDictionary()).resolves.toEqual(en);
  });
});

describe("dictionaries", () => {
  it("have the same keys in Japanese and English", () => {
    const keys = (value: unknown, prefix = ""): string[] =>
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? Object.entries(value).flatMap(([key, child]) =>
            keys(child, `${prefix}${key}.`),
          )
        : [prefix];
    expect(keys(en).sort()).toEqual(keys(ja).sort());
  });
});
