import { type NextRequest, NextResponse } from "next/server";
import { refreshTokens } from "@/api/auth/refresh-tokens";
import { ApiError } from "@/api/client/api-error";
import {
  type Locale,
  localeHeader,
  locales,
  negotiateLocale,
} from "@/i18n/locales";
import {
  accessTokenCookie,
  isTokenExpired,
  refreshTokenCookie,
  tokenCookies,
} from "@/lib/auth/token-cookies";

const publicPaths = [
  "",
  "/login",
  "/register",
  "/about",
  "/terms",
  "/privacy",
  "/contact",
];

function redirectToLogin(request: NextRequest, locale: Locale) {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/login`;
  url.search = "";
  return NextResponse.redirect(url);
}

function next(request: NextRequest, locale: Locale) {
  request.headers.set(localeHeader, locale);
  return NextResponse.next({ request: { headers: request.headers } });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (!locale) {
    const negotiated = negotiateLocale(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${negotiated}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const path = pathname.slice(`/${locale}`.length);
  if (publicPaths.includes(path)) return next(request, locale);

  const accessToken = request.cookies.get(accessTokenCookie)?.value;
  if (accessToken && !isTokenExpired(accessToken)) {
    return next(request, locale);
  }

  const refreshToken = request.cookies.get(refreshTokenCookie)?.value;
  if (!refreshToken) return redirectToLogin(request, locale);

  try {
    const cookies = tokenCookies(await refreshTokens(refreshToken));
    for (const { name, value } of cookies) request.cookies.set(name, value);
    const response = next(request, locale);
    for (const cookie of cookies) response.cookies.set(cookie);
    return response;
  } catch (error) {
    if (error instanceof ApiError) return redirectToLogin(request, locale);
    throw error;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
