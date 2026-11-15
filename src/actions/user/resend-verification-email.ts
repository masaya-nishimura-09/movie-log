"use server";

import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { resendVerificationEmail } from "@/api/user/resend-verification-email";
import { hasLocale, type Locale } from "@/i18n/locales";

export async function resendVerificationEmailAction(
  lang: Locale,
  email: string,
): Promise<ActionResult<null>> {
  const input = z.email().safeParse(email);
  if (!hasLocale(lang) || !input.success) {
    return { success: false, messageKey: "resendFailed" };
  }

  try {
    await resendVerificationEmail(input.data, lang);
  } catch (error) {
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: "resendFailed" };
    }
    throw error;
  }
  return { success: true, data: null };
}
