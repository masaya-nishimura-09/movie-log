import { describe, expect, it } from "vitest";
import { errorPages, fieldPage, spreadOf } from "@/lib/record/field-page";

describe("fieldPage", () => {
  it("puts the poster and moods on the first page with the basics", () => {
    expect(fieldPage("title")).toBe(0);
    expect(fieldPage("posterUrl")).toBe(0);
    expect(fieldPage("moodTags")).toBe(0);
  });

  it("puts the film information on the second page and the note on the third", () => {
    expect(fieldPage("releaseYear")).toBe(1);
    expect(fieldPage("credits")).toBe(1);
    expect(fieldPage("note")).toBe(2);
  });

  it("treats a field without a page as the first page", () => {
    expect(fieldPage("unknown")).toBe(0);
  });
});

describe("errorPages", () => {
  it("returns no pages when there are no errors", () => {
    expect(errorPages(undefined)).toEqual([]);
    expect(errorPages({})).toEqual([]);
  });

  it("returns each page with an error once, in order", () => {
    expect(
      errorPages({ note: ["x"], releaseYear: ["x"], runtime: ["x"] }),
    ).toEqual([1, 2]);
  });
});

describe("spreadOf", () => {
  it("pairs the pages into spreads", () => {
    expect([0, 1, 2, 3].map(spreadOf)).toEqual([0, 0, 1, 1]);
  });
});
