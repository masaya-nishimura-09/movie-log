import { describe, expect, it } from "vitest";
import { countryCode } from "@/lib/record/country-code";

describe("countryCode", () => {
  it("accepts a two-letter code in either case", () => {
    expect(countryCode("jp", "ja")).toBe("JP");
    expect(countryCode("FR", "en")).toBe("FR");
  });

  it("finds the code from a country name in the given language", () => {
    expect(countryCode("日本", "ja")).toBe("JP");
    expect(countryCode("france", "en")).toBe("FR");
  });

  it("returns the current ISO code for an old or alias code and name", () => {
    expect(countryCode("UK", "en")).toBe("GB");
    expect(countryCode("DD", "en")).toBe("DE");
    expect(countryCode("ドイツ", "ja")).toBe("DE");
    expect(countryCode("Germany", "en")).toBe("DE");
    expect(countryCode("Vietnam", "en")).toBe("VN");
  });

  it("does not accept regions that are not countries", () => {
    expect(countryCode("EU", "en")).toBeUndefined();
    expect(countryCode("UN", "en")).toBeUndefined();
    expect(countryCode("QO", "en")).toBeUndefined();
  });

  it("returns undefined for an unknown name or an empty value", () => {
    expect(countryCode("どこか", "ja")).toBeUndefined();
    expect(countryCode("  ", "ja")).toBeUndefined();
    expect(countryCode("ZZ", "ja")).toBeUndefined();
  });
});
