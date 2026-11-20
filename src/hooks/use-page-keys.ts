import { useEffect } from "react";

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    target.closest(
      "input, textarea, select, [contenteditable='true'], [role='dialog'], [role='alertdialog'], [role='listbox'], [role='menu']",
    ) !== null
  );
}

export function usePageKeys(onPrev?: () => void, onNext?: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTyping(event.target)) return;
      if (event.key === "ArrowLeft") onPrev?.();
      if (event.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onPrev, onNext]);
}
