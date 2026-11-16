"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { verifyEmailChange } from "@/api/user/verify-email-change";

export async function verifyEmailChangeAction(
  token: string,
  _previous: ActionResult<null> | undefined,
  _formData: FormData,
): Promise<ActionResult<null>> {
  try {
    await verifyEmailChange(token);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.code === "INVALID_VERIFICATION_TOKEN" ||
        error.code === "INVALID_INPUT")
    ) {
      return { success: false, messageKey: "invalidToken" };
    }
    if (error instanceof ApiError && error.code === "USER_ALREADY_EXISTS") {
      return { success: false, messageKey: "emailTaken" };
    }
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }
  revalidatePath("/", "layout");
  return { success: true, data: null };
}
