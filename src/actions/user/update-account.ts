"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { endSession, startSession } from "@/actions/auth/session";
import { ApiError } from "@/api/client/api-error";
import { updateUser } from "@/api/user/update-user";
import type { Locale } from "@/i18n/locales";
import { userInputSchema } from "@/schemas/user/user-input";

export async function updateAccountAction(
  lang: Locale,
  _previous: ActionResult<null> | undefined,
  formData: FormData,
): Promise<ActionResult<null>> {
  const input = userInputSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!input.success) {
    return {
      success: false,
      messageKey: "invalidInput",
      errors: z.flattenError(input.error).fieldErrors,
    };
  }

  try {
    await updateUser(input.data);
  } catch (error) {
    if (error instanceof ApiError && error.code === "USER_ALREADY_EXISTS") {
      return { success: false, messageKey: "userAlreadyExists" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }

  try {
    await startSession(input.data);
  } catch {
    await endSession();
    redirect(`/${lang}/login`);
  }
  return { success: true, data: null };
}
