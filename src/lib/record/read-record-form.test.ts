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
