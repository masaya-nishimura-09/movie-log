import { describe, expect, it } from "vitest";
import {
  buildLanguageOptions,
  languageName,
} from "@/lib/record/language-options";

describe("languageName", () => {
  it("returns the language name in the display locale", () => {
    expect(languageName("ja", "fr", "不明")).toBe("フランス語");
    expect(languageName("en", "fr", "Unknown")).toBe("French");
  });

  it("returns the unknown label for und", () => {
    expect(languageName("ja", "und", "不明")).toBe("不明");
  });
});

describe("buildLanguageOptions", () => {
  it("lists the common languages with their codes, ending with und", () => {
    const options = buildLanguageOptions("ja", "ja", "不明");
    expect(options).toHaveLength(16);
    expect(options[0]).toEqual({ value: "ja", label: "日本語 ja" });
    expect(options.at(-1)).toEqual({ value: "und", label: "不明 und" });
  });

  it("adds the current language first when it is not in the list", () => {
    const options = buildLanguageOptions("en", "nl", "Unknown");
    expect(options).toHaveLength(17);
    expect(options[0]).toEqual({ value: "nl", label: "Dutch nl" });
  });
});
