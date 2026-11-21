"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasLocale, localeCookie } from "@/i18n/locales";

export async function changeLocaleAction(locale: string, path: string) {
  if (!hasLocale(locale) || !path.startsWith("/") || path.startsWith("//")) {
    return;
  }
  (await cookies()).set(localeCookie, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  redirect(`/${locale}${path}`);
}
