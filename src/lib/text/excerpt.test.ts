import { describe, expect, it } from "vitest";
import { firstSentence } from "@/lib/text/excerpt";

describe("firstSentence", () => {
  it("takes the text up to the first full stop, question or exclamation mark", () => {
    expect(firstSentence("終電の場面がいい。全部を語っている。")).toBe(
      "終電の場面がいい。",
    );
    expect(firstSentence("Is it? Yes.")).toBe("Is it?");
    expect(firstSentence("最高！また観る")).toBe("最高！");
  });

  it("stops at the end of the first line", () => {
    expect(firstSentence("  一行目\n二行目")).toBe("一行目");
  });

  it("keeps a text without a stop as it is", () => {
    expect(firstSentence("句点なし")).toBe("句点なし");
    expect(firstSentence("")).toBe("");
  });

  it("cuts a long sentence at 80 characters", () => {
    const result = firstSentence("あ".repeat(100));
    expect(Array.from(result)).toHaveLength(81);
    expect(result.endsWith("…")).toBe(true);
  });
});
