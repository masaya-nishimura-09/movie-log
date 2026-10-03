"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { startSession } from "@/actions/auth/session";
import { ApiError } from "@/api/client/api-error";
import type { Locale } from "@/i18n/locales";
import { loginInputSchema } from "@/schemas/auth/login";

export async function loginAction(
  lang: Locale,
  _previous: ActionResult<never> | undefined,
  formData: FormData,
): Promise<ActionResult<never>> {
  const input = loginInputSchema.safeParse({
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
    await startSession(input.data);
  } catch (error) {
    if (error instanceof ApiError && error.code === "INVALID_CREDENTIALS") {
      return { success: false, messageKey: "invalidCredentials" };
    }
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    return { success: false, messageKey: "unexpectedError" };
  }
  redirect(`/${lang}/records`);
}
