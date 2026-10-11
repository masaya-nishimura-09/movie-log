import { beforeEach, describe, expect, it, vi } from "vitest";

let history: typeof import("@/lib/navigation/in-app-history");

beforeEach(async () => {
  vi.resetModules();
  history = await import("@/lib/navigation/in-app-history");
});

describe("in-app history", () => {
  it("has no history on the first page", () => {
    history.recordVisit("/ja/contact");
    expect(history.hasInAppHistory()).toBe(false);
  });

  it("has history after moving to another page", () => {
    history.recordVisit("/ja/about");
    history.recordVisit("/ja/contact");
    expect(history.hasInAppHistory()).toBe(true);
  });

  it("does not count the same page twice in a row", () => {
    history.recordVisit("/ja/contact");
    history.recordVisit("/ja/contact");
    expect(history.hasInAppHistory()).toBe(false);
  });
});
