let lastPath: string | undefined;
let visits = 0;

export function recordVisit(path: string) {
  if (path === lastPath) return;
  lastPath = path;
  visits += 1;
}

export function hasInAppHistory() {
  return visits > 1;
}
