"use client";

import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { ScrapPhoto } from "@/components/molecules/scrap-photo";
import { useImageRatios } from "@/hooks/use-image-ratios";
import { type MasonryLayout, masonry } from "@/lib/notebook/masonry";
import { cn } from "@/lib/style/cn";

type ScrapBoardProps = {
  photos: { id: string; imageUrl: string; label: string }[];
  wide: boolean;
  onOpen: (index: number) => void;
  className?: string;
  style?: CSSProperties;
};

const spacing = {
  wide: { gapX: 20, gapY: 36, frame: 7, minColumns: 3, maxColumns: 5 },
  narrow: { gapX: 14, gapY: 26, frame: 6, minColumns: 2, maxColumns: 2 },
};

function availableHeight(list: HTMLElement): number {
  const body = list.closest<HTMLElement>("[data-slot=page-body]");
  if (!body) return Number.POSITIVE_INFINITY;
  const style = getComputedStyle(body);
  return (
    body.clientHeight -
    Number.parseFloat(style.paddingTop) -
    Number.parseFloat(style.paddingBottom) -
    Number.parseFloat(getComputedStyle(list).paddingTop)
  );
}

export function ScrapBoard({
  photos,
  wide,
  onOpen,
  className,
  style,
}: ScrapBoardProps) {
  const ratios = useImageRatios(photos.map((photo) => photo.imageUrl));
  const listRef = useRef<HTMLUListElement>(null);
  const [layout, setLayout] = useState<MasonryLayout | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !ratios) return;
    const body = list.closest<HTMLElement>("[data-slot=page-body]") ?? list;
    const run = () =>
      setLayout(
        masonry(ratios, {
          ...(wide ? spacing.wide : spacing.narrow),
          width: list.clientWidth,
          height: availableHeight(list),
        }),
      );
    run();
    const observer = new ResizeObserver(run);
    observer.observe(body);
    return () => observer.disconnect();
  }, [ratios, wide]);

  return (
    <ul
      ref={listRef}
      style={{ ...style, height: layout ? layout.height : undefined }}
      className={cn(
        "relative pt-1.5 lg:pt-0",
        !layout && "columns-2 gap-x-3.5 lg:columns-3 lg:gap-x-5",
        className,
      )}
    >
      {photos.map((photo, index) => {
        const item = layout?.items[index];
        return (
          <li
            key={photo.id}
            style={
              item && layout
                ? { left: item.left, top: item.top, width: layout.columnWidth }
                : undefined
            }
            className={cn(
              item ? "absolute" : "mb-6.5 break-inside-avoid lg:mb-9",
            )}
          >
            <ScrapPhoto
              imageUrl={photo.imageUrl}
              label={photo.label}
              ratio={ratios?.[index]}
              onOpen={() => onOpen(index)}
            />
          </li>
        );
      })}
    </ul>
  );
}
