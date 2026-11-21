export type MasonryOptions = {
  width: number;
  height: number;
  gapX: number;
  gapY: number;
  frame: number;
  minColumns: number;
  maxColumns: number;
};

export type MasonryItem = { left: number; top: number };

export type MasonryLayout = {
  columnWidth: number;
  height: number;
  items: MasonryItem[];
};

function place(
  ratios: number[],
  count: number,
  options: MasonryOptions,
): MasonryLayout {
  const columnWidth = (options.width - options.gapX * (count - 1)) / count;
  const imageWidth = columnWidth - options.frame * 2;
  const heights = Array.from({ length: count }, () => 0);
  const items = ratios.map((ratio) => {
    const column = heights.indexOf(Math.min(...heights));
    const top = heights[column] ?? 0;
    heights[column] =
      top + imageWidth / ratio + options.frame * 2 + options.gapY;
    return { left: column * (columnWidth + options.gapX), top };
  });
  const height = Math.max(0, ...heights.map((h) => h - options.gapY));
  return { columnWidth, height, items };
}

export function masonry(
  ratios: number[],
  options: MasonryOptions,
): MasonryLayout {
  let count = options.minColumns;
  let layout = place(ratios, count, options);
  while (layout.height > options.height && count < options.maxColumns) {
    count++;
    layout = place(ratios, count, options);
  }
  return layout;
}
