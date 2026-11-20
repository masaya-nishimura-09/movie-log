import { describe, expect, it } from "vitest";
import { alternates, languageUrls } from "@/lib/seo/alternates";

describe("languageUrls", () => {
  it("returns the URL of each language and the URL without a language", () => {
    expect(languageUrls("/about")).toEqual({
      ja: "http://localhost:3000/ja/about",
      en: "http://localhost:3000/en/about",
      "x-default": "http://localhost:3000/about",
    });
  });

  it("uses the site URL as the default for the top page", () => {
    expect(languageUrls("")).toEqual({
      ja: "http://localhost:3000/ja",
      en: "http://localhost:3000/en",
      "x-default": "http://localhost:3000",
    });
  });
});

describe("alternates", () => {
  it("sets the canonical URL to the page in the current language", () => {
    expect(alternates("ja", "/privacy")).toEqual({
      canonical: "http://localhost:3000/ja/privacy",
      languages: languageUrls("/privacy"),
    });
  });
});
