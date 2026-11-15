import { z } from "zod";
import { jsonBody, requestJson } from "@/api/client/request-json";
import type { Locale } from "@/i18n/locales";

export async function resendVerificationEmail(
  email: string,
  lang: Locale,
): Promise<void> {
  await requestJson(
    `/users/verify-email/resend?language=${lang}`,
    z.unknown(),
    jsonBody({ email }),
  );
}
