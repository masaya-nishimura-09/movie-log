"use server";

import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { resetPassword } from "@/api/user/reset-password";
import { endSession } from "@/lib/auth/session";
import { passwordResetInputSchema } from "@/schemas/user/user-input";

export async function resetPasswordAction(
  token: string,
  _previous: ActionResult<null> | undefined,
  formData: FormData,
): Promise<ActionResult<null>> {
  const input = passwordResetInputSchema.safeParse({
    password: formData.get("password"),
  });
  if (!input.success) {
    return invalidInput(input.error);
  }

  try {
    await resetPassword(token, input.data.password);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.code === "INVALID_PASSWORD_RESET_TOKEN" ||
        error.code === "INVALID_INPUT")
    ) {
      return { success: false, messageKey: "invalidToken" };
    }
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }
  await endSession();
  return { success: true, data: null };
}
