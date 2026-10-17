"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { updateUsername } from "@/api/user/update-username";
import { usernameInputSchema } from "@/schemas/user/user-input";

export async function updateUsernameAction(
  _previous: ActionResult<null> | undefined,
  formData: FormData,
): Promise<ActionResult<null>> {
  const input = usernameInputSchema.safeParse({
    username: formData.get("username"),
  });
  if (!input.success) {
    return invalidInput(input.error);
  }

  try {
    await updateUsername(input.data);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }
  revalidatePath("/", "layout");
  return { success: true, data: null };
}
