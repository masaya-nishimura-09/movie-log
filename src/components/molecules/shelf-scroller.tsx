"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/atoms/button";

type ShelfScrollerProps = {
  heading: ReactNode;
  more?: ReactNode;
  prevLabel: string;
  nextLabel: string;
  children: ReactNode;
};

export function ShelfScroller({
  heading,
  more,
  prevLabel,
  nextLabel,
  children,
}: ShelfScrollerProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setCanPrev(list.scrollLeft > 1);
    setCanNext(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    update();
    list.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const scrollByPage = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({
      left: direction * list.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        {heading}
        <div className="flex shrink-0 items-center gap-3">
          {more}
          <div className="hidden gap-1.5 md:flex">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={prevLabel}
              disabled={!canPrev}
              onClick={() => scrollByPage(-1)}
            >
              <ChevronLeft aria-hidden />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={nextLabel}
              disabled={!canNext}
              onClick={() => scrollByPage(1)}
            >
              <ChevronRight aria-hidden />
            </Button>
          </div>
        </div>
      </div>
      <ul
        ref={listRef}
        className="-mx-4 flex snap-x scroll-px-4 gap-3.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:-mx-7 md:scroll-px-7 md:px-7"
      >
        {children}
      </ul>
    </section>
  );
}
