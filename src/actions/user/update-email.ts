"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { updateEmail } from "@/api/user/update-email";
import { emailChangeInputSchema } from "@/schemas/user/user-input";

export async function updateEmailAction(
  _previous: ActionResult<null> | undefined,
  formData: FormData,
): Promise<ActionResult<null>> {
  const input = emailChangeInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!input.success) {
    return invalidInput(input.error);
  }

  try {
    await updateEmail(input.data);
  } catch (error) {
    if (error instanceof ApiError && error.code === "USER_ALREADY_EXISTS") {
      return { success: false, messageKey: "userAlreadyExists" };
    }
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
  revalidatePath("/", "layout");
  return { success: true, data: null };
}
