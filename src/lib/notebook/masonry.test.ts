import { describe, expect, it } from "vitest";
import { masonry } from "@/lib/notebook/masonry";

const options = {
  width: 400,
  height: 600,
  gapX: 20,
  gapY: 20,
  frame: 0,
  minColumns: 3,
  maxColumns: 5,
};

describe("masonry", () => {
  it("uses the fewest columns that fit in the page", () => {
    const layout = masonry([1, 1, 1], options);
    expect(layout.columnWidth).toBe(120);
    expect(layout.items).toEqual([
      { left: 0, top: 0 },
      { left: 140, top: 0 },
      { left: 280, top: 0 },
    ]);
    expect(layout.height).toBe(120);
  });

  it("puts each photo under the shortest column so far", () => {
    const layout = masonry([0.5, 2, 2, 2], options);
    expect(layout.items.slice(3)).toEqual([{ left: 140, top: 80 }]);
    expect(layout.height).toBe(240);
  });

  it("adds the frame around each photo to its height", () => {
    const layout = masonry([1], { ...options, frame: 5 });
    expect(layout.height).toBe(120);
    expect(masonry([2], { ...options, frame: 5 }).height).toBe(65);
  });

  it("adds columns until every photo fits", () => {
    const tall = Array.from({ length: 10 }, () => 0.7);
    const layout = masonry(tall, options);
    expect(layout.columnWidth).toBe(85);
    expect(layout.height).toBeLessThanOrEqual(600);
  });

  it("stops at the maximum number of columns even when the photos do not fit", () => {
    const tall = Array.from({ length: 10 }, () => 0.2);
    const layout = masonry(tall, options);
    expect(layout.columnWidth).toBe(64);
    expect(layout.items).toHaveLength(10);
    expect(layout.height).toBeGreaterThan(600);
  });
});
