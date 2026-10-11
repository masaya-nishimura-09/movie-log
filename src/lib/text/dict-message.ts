export function dictMessage(
  dict: Record<string, unknown>,
  key: string | undefined,
): string | undefined {
  const value = key === undefined ? undefined : dict[key];
  return typeof value === "string" ? value : undefined;
}
