"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "@/api/auth/logout";
import type { Locale } from "@/i18n/locales";
import { endSession } from "@/lib/auth/session";
import { refreshTokenCookie } from "@/lib/auth/token-cookies";

export async function logoutAction(lang: Locale): Promise<void> {
  const store = await cookies();
  const refreshToken = store.get(refreshTokenCookie)?.value;
  if (refreshToken) {
    await logout(refreshToken).catch(() => undefined);
  }
  await endSession();
  redirect(`/${lang}/login`);
}
