"use server";

import { redirect } from "next/navigation";
import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { getCurrentUser } from "@/api/user/get-current-user";
import { updatePassword } from "@/api/user/update-password";
import type { Locale } from "@/i18n/locales";
import { endSession, startSession } from "@/lib/auth/session";
import { passwordChangeInputSchema } from "@/schemas/user/user-input";

export async function updatePasswordAction(
  lang: Locale,
  _previous: ActionResult<null> | undefined,
  formData: FormData,
): Promise<ActionResult<null>> {
  const input = passwordChangeInputSchema.safeParse({
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!input.success) {
    return invalidInput(input.error);
  }

  let email: string;
  try {
    ({ email } = await getCurrentUser());
    await updatePassword(input.data);
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

  try {
    await startSession({ email, password: input.data.newPassword });
  } catch {
    await endSession();
    redirect(`/${lang}/login`);
  }
  return { success: true, data: null };
}
