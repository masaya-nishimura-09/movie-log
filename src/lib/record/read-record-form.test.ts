import { describe, expect, it } from "vitest";
import { readRecordForm } from "@/lib/record/read-record-form";

function formData(entries: [string, string][]): FormData {
  const data = new FormData();
  for (const [key, value] of entries) data.append(key, value);
  return data;
}

describe("readRecordForm", () => {
  it("reads single values, lists and defaults", () => {
    const values = readRecordForm(
      formData([
        ["title", "Arrival"],
        ["genres", "drama"],
        ["genres", "science_fiction"],
        ["posterUrl", "  https://example.com/a.jpg  "],
      ]),
    );
    expect(values).toMatchObject({
      title: "Arrival",
      watchedAt: "",
      runtime: "0",
      genres: ["drama", "science_fiction"],
      countries: [],
      posterUrl: "https://example.com/a.jpg",
    });
  });

  it("trims the original title and keeps the overview as written", () => {
    const values = readRecordForm(
      formData([
        ["originalTitle", "  Story of Your Life  "],
        ["overview", "  Linguists meet aliens.\n"],
      ]),
    );
    expect(values).toMatchObject({
      originalTitle: "Story of Your Life",
      overview: "  Linguists meet aliens.\n",
    });
    expect(readRecordForm(formData([]))).toMatchObject({
      originalTitle: "",
      overview: "",
    });
  });

  it("reads the note as a document, and as no note when it has no text", () => {
    const content = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "本文" }] },
      ],
    };
    expect(
      readRecordForm(formData([["note", JSON.stringify(content)]])).note,
    ).toEqual(content);
    expect(
      readRecordForm(
        formData([
          [
            "note",
            JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] }),
          ],
        ]),
      ).note,
    ).toBeNull();
    expect(readRecordForm(formData([])).note).toBeNull();
    expect(readRecordForm(formData([["note", "{"]])).note).toBeUndefined();
  });

  it("orders credits by their index and drops rows without a name", () => {
    const values = readRecordForm(
      formData([
        ["credits.10.personName", "Amy Adams"],
        ["credits.10.creditRole", "cast"],
        ["credits.2.personName", " Denis Villeneuve "],
        ["credits.2.creditRole", "director"],
        ["credits.5.personName", "  "],
        ["credits.5.creditRole", "writer"],
      ]),
    );
    expect(values.credits).toEqual([
      { personName: "Denis Villeneuve", creditRole: "director" },
      { personName: "Amy Adams", creditRole: "cast" },
    ]);
  });
});
