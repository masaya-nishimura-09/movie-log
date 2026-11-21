export type BlockSize = {
  height: number;
  advance: number;
  keepWithNext?: boolean;
};

export function paginate(blocks: BlockSize[], capacity: number): number[][] {
  const pages: number[][] = [];
  let page: number[] = [];
  let used = 0;
  blocks.forEach((block, index) => {
    const next = blocks[index + 1];
    const needed =
      block.keepWithNext && next ? block.advance + next.height : block.height;
    if (page.length > 0 && used + needed > capacity) {
      pages.push(page);
      page = [];
      used = 0;
    }
    page.push(index);
    used += block.advance;
  });
  if (page.length > 0) pages.push(page);
  return pages;
}
