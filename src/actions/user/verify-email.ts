"use server";

import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { verifyEmail } from "@/api/user/verify-email";

export async function verifyEmailAction(
  token: string,
  _previous: ActionResult<null> | undefined,
  _formData: FormData,
): Promise<ActionResult<null>> {
  try {
    await verifyEmail(token);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.code === "INVALID_VERIFICATION_TOKEN" ||
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
  return { success: true, data: null };
}
