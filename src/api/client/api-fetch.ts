import { cookies, headers as requestHeaders } from "next/headers";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { ApiError } from "@/api/client/api-error";
import { requestJson } from "@/api/client/request-json";
import { localeHeader } from "@/i18n/locales";
import { accessTokenCookie } from "@/lib/auth/token-cookies";

export async function apiFetch<T extends z.ZodType>(
  path: string,
  schema: T,
  init: RequestInit = {},
): Promise<z.output<T>> {
  const headers = new Headers(init.headers);
  const token = (await cookies()).get(accessTokenCookie)?.value;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    return await requestJson(path, schema, { ...init, headers });
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.code === "INVALID_ACCESS_TOKEN" ||
        error.code === "UNAUTHENTICATED")
    ) {
      const locale = (await requestHeaders()).get(localeHeader);
      redirect(locale ? `/${locale}/login` : "/login");
    }
    throw error;
  }
}
