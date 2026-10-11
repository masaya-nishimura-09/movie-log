import { describe, expect, it } from "vitest";
import ja from "@/i18n/dictionaries/ja.json";
import { fieldError } from "@/lib/record/field-error";

describe("fieldError", () => {
  it("returns the message of a field with an error", () => {
    expect(fieldError({ title: ["too_small"] }, ja.recordForm, "title")).toBe(
      ja.recordForm.errors.title,
    );
  });

  it("returns undefined for a field without an error", () => {
    expect(
      fieldError({ title: ["too_small"] }, ja.recordForm, "memo"),
    ).toBeUndefined();
    expect(fieldError(undefined, ja.recordForm, "title")).toBeUndefined();
  });
});
