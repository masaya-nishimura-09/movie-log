export function isResourceId(value: string): boolean {
  return /^[1-9]\d*$/.test(value);
}
