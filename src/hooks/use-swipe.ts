import { type PointerEvent, useRef } from "react";

const swipeDistance = 50;

export function useSwipe(onPrev?: () => void, onNext?: () => void) {
  const start = useRef<number>(undefined);

  const onPointerDown = (event: PointerEvent) => {
    const fromInside = event.currentTarget.contains(event.target as Node);
    start.current =
      event.pointerType !== "mouse" && fromInside ? event.clientX : undefined;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (start.current === undefined) return;
    const distance = event.clientX - start.current;
    start.current = undefined;
    if (distance > swipeDistance) onPrev?.();
    if (distance < -swipeDistance) onNext?.();
  };

  return { onPointerDown, onPointerUp };
}
