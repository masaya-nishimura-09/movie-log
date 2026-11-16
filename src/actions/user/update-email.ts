"use server";

import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { updateEmail } from "@/api/user/update-email";
import type { Locale } from "@/i18n/locales";
import { emailChangeInputSchema } from "@/schemas/user/user-input";

export async function updateEmailAction(
  lang: Locale,
  _previous: ActionResult<{ email: string }> | undefined,
  formData: FormData,
): Promise<ActionResult<{ email: string }>> {
  const input = emailChangeInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!input.success) {
    return invalidInput(input.error);
  }

  try {
    await updateEmail(input.data, lang);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.code === "INVALID_CURRENT_PASSWORD"
    ) {
      return { success: false, messageKey: "invalidCurrentPassword" };
    }
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }
  return { success: true, data: { email: input.data.email } };
}
