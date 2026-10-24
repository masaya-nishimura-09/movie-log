import { useCallback, useEffect, useRef, useState } from "react";

const tolerance = 8;

const userScrollEvents = ["wheel", "touchstart", "keydown", "mousedown"];

function scrollParent(element: HTMLElement): HTMLElement | null {
  for (
    let parent = element.parentElement;
    parent;
    parent = parent.parentElement
  ) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll") return parent;
  }
  return null;
}

function scrollMarginTop(element: HTMLElement): number {
  return Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

function isAtBottom(parent: HTMLElement | null): boolean {
  if (parent) {
    return parent.scrollTop + parent.clientHeight >= parent.scrollHeight - 2;
  }
  const root = document.documentElement;
  return window.scrollY + window.innerHeight >= root.scrollHeight - 2;
}

export function useArticleToc(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);
  const selected = useRef(false);

  const select = useCallback((id: string) => {
    selected.current = true;
    setActiveId(id);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (selected.current) return;
      const elements = ids.flatMap((id) => {
        const element = document.getElementById(id);
        return element ? [{ id, element }] : [];
      });
      const first = elements[0];
      if (!first) return;
      const parent = scrollParent(first.element);
      const scrolled = parent ? parent.scrollTop : window.scrollY;
      if (scrolled > 0 && isAtBottom(parent)) {
        setActiveId(elements[elements.length - 1]?.id);
        return;
      }
      const top = parent ? parent.getBoundingClientRect().top : 0;
      let current = first.id;
      for (const { id, element } of elements) {
        if (
          element.getBoundingClientRect().top <=
          top + scrollMarginTop(element) + tolerance
        ) {
          current = id;
        }
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    const onUserScroll = () => {
      selected.current = false;
    };
    update();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    for (const type of userScrollEvents) {
      window.addEventListener(type, onUserScroll, true);
    }
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      for (const type of userScrollEvents) {
        window.removeEventListener(type, onUserScroll, true);
      }
    };
  }, [ids]);

  const jump = useCallback(
    (id: string): boolean => {
      const element = document.getElementById(id);
      if (!element) return false;
      element.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      select(id);
      return true;
    },
    [select],
  );

  const jumpToTop = useCallback(() => {
    const first = ids[0];
    if (first === undefined) return;
    const element = document.getElementById(first);
    const parent = element ? scrollParent(element) : null;
    (parent ?? window).scrollTo({ top: 0, behavior: scrollBehavior() });
    select(first);
  }, [ids, select]);

  return { activeId, jump, jumpToTop };
}
