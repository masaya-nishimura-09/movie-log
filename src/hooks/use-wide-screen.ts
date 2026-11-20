import { useSyncExternalStore } from "react";

export const wideQuery = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(wideQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useWideScreen(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(wideQuery).matches,
    () => null,
  );
}
