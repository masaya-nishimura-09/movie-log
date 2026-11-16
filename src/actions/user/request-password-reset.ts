"use server";

import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { requestPasswordReset } from "@/api/user/request-password-reset";
import { hasLocale, type Locale } from "@/i18n/locales";
import { passwordResetRequestInputSchema } from "@/schemas/user/user-input";

async function send(
  email: string,
  lang: Locale,
  failedKey: string,
): Promise<ActionResult<{ email: string }>> {
  try {
    await requestPasswordReset(email, lang);
  } catch (error) {
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: failedKey };
    }
    throw error;
  }
  return { success: true, data: { email } };
}

export async function requestPasswordResetAction(
  lang: Locale,
  _previous: ActionResult<{ email: string }> | undefined,
  formData: FormData,
): Promise<ActionResult<{ email: string }>> {
  const input = passwordResetRequestInputSchema.safeParse({
    email: formData.get("email"),
  });
  if (!input.success) {
    return invalidInput(input.error);
  }
  return send(input.data.email, lang, "unexpectedError");
}

export async function resendPasswordResetAction(
  lang: Locale,
  email: string,
): Promise<ActionResult<null>> {
  const input = passwordResetRequestInputSchema.safeParse({ email });
  if (!hasLocale(lang) || !input.success) {
    return { success: false, messageKey: "resendFailed" };
  }
  const result = await send(input.data.email, lang, "resendFailed");
  return result.success ? { success: true, data: null } : result;
}
