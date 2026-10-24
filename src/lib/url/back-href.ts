import { buildHref } from "@/lib/url/build-href";

export const fromKey = "from";

const origin = "http://local.invalid";
const maxLength = 2000;

export function safeFromHref(
  value: string | string[] | undefined,
  allowedPaths: string | string[],
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || raw === "" || raw.length > maxLength) {
    return undefined;
  }
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return undefined;
  }
  let url: URL;
  try {
    url = new URL(raw, origin);
  } catch {
    return undefined;
  }
  if (url.origin !== origin || ![allowedPaths].flat().includes(url.pathname)) {
    return undefined;
  }
  return `${url.pathname}${url.search}`;
}

export function withFrom(href: string, from: string | undefined): string {
  return from === undefined ? href : buildHref(href, { [fromKey]: from });
}

export function pathOf(href: string): string {
  return href.split("?")[0] ?? href;
}
