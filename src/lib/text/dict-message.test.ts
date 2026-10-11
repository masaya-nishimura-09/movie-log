import { describe, expect, it } from "vitest";
import { dictMessage } from "@/lib/text/dict-message";

describe("dictMessage", () => {
  const dict = { saved: "保存しました", nested: { a: "b" } };

  it("returns the message of the key", () => {
    expect(dictMessage(dict, "saved")).toBe("保存しました");
  });

  it("returns undefined for a missing key, a non-string value or no key", () => {
    expect(dictMessage(dict, "unknown")).toBeUndefined();
    expect(dictMessage(dict, "nested")).toBeUndefined();
    expect(dictMessage(dict, undefined)).toBeUndefined();
  });
});
