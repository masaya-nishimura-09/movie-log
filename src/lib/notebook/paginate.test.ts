import { describe, expect, it } from "vitest";
import { paginate } from "@/lib/notebook/paginate";

const block = (height: number, advance = height) => ({ height, advance });

describe("paginate", () => {
  it("puts blocks on one page while they fit", () => {
    expect(paginate([block(100), block(200), block(260)], 560)).toEqual([
      [0, 1, 2],
    ]);
  });

  it("moves a block that does not fit to the next page", () => {
    expect(paginate([block(300), block(200), block(100)], 560)).toEqual([
      [0, 1],
      [2],
    ]);
  });

  it("ignores the trailing margin of the last block on a page", () => {
    expect(paginate([block(280, 308), block(252, 280)], 560)).toEqual([[0, 1]]);
  });

  it("gives a block taller than a page its own page", () => {
    expect(paginate([block(100), block(900), block(100)], 560)).toEqual([
      [0],
      [1],
      [2],
    ]);
  });

  it("moves a heading to the next page when the block after it does not fit", () => {
    const heading = { height: 28, advance: 28, keepWithNext: true };
    expect(paginate([block(476), heading, block(84)], 560)).toEqual([
      [0],
      [1, 2],
    ]);
  });

  it("keeps a heading on the page when the block after it fits", () => {
    const heading = { height: 28, advance: 28, keepWithNext: true };
    expect(paginate([block(476), heading, block(56)], 560)).toEqual([
      [0, 1, 2],
    ]);
  });

  it("returns no pages for no blocks", () => {
    expect(paginate([], 560)).toEqual([]);
  });
});
