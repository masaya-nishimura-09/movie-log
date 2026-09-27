export type QueryValues = Record<string, string | string[] | undefined>;

export function buildHref(pathname: string, values: QueryValues): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined && item !== "") params.append(key, item);
    }
  }
  const query = params.toString();
  return query === "" ? pathname : `${pathname}?${query}`;
}

export function toggleValue(
  values: QueryValues,
  key: string,
  value: string,
): QueryValues {
  const current = values[key];
  const list = current === undefined ? [] : [current].flat();
  const next = list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
  return { ...values, [key]: next, page: undefined };
}
