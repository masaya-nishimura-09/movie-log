import { describe, expect, it } from "vitest";
import { hasLocale, negotiateLocale } from "@/i18n/locales";

describe("hasLocale", () => {
  it("accepts only supported locales", () => {
    expect(hasLocale("ja")).toBe(true);
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("fr")).toBe(false);
    expect(hasLocale("")).toBe(false);
  });
});

describe("negotiateLocale", () => {
  it("picks the supported language with the highest quality", () => {
    expect(negotiateLocale("en;q=0.5,ja;q=0.9")).toBe("ja");
    expect(negotiateLocale("ja;q=0.5,en;q=0.9")).toBe("en");
  });

  it("ignores the region and the case", () => {
    expect(negotiateLocale("JA-JP")).toBe("ja");
  });

  it("skips unsupported languages", () => {
    expect(negotiateLocale("fr-FR,ja;q=0.3")).toBe("ja");
  });

  it("skips languages with a quality of zero", () => {
    expect(negotiateLocale("ja;q=0,en;q=0.1")).toBe("en");
  });

  it("falls back to English", () => {
    expect(negotiateLocale("fr-FR")).toBe("en");
    expect(negotiateLocale("")).toBe("en");
    expect(negotiateLocale(null)).toBe("en");
  });
});
