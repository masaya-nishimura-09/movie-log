"use server";

import { redirect } from "next/navigation";
import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { registerUser } from "@/api/user/register-user";
import type { Locale } from "@/i18n/locales";
import { startSession } from "@/lib/auth/session";
import { verifyTurnstile } from "@/lib/turnstile/verify-turnstile";
import { userInputSchema } from "@/schemas/user/user-input";

export async function registerAction(
  lang: Locale,
  _previous: ActionResult<never> | undefined,
  formData: FormData,
): Promise<ActionResult<never>> {
  const input = userInputSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!input.success) {
    return invalidInput(input.error);
  }
  if (formData.get("agreedToTerms") !== "on") {
    return { success: false, messageKey: "termsNotAgreed" };
  }

  const turnstileFailure = await verifyTurnstile(formData);
  if (turnstileFailure) return { success: false, messageKey: turnstileFailure };

  try {
    await registerUser(input.data);
  } catch (error) {
    if (error instanceof ApiError && error.code === "USER_ALREADY_EXISTS") {
      return { success: false, messageKey: "userAlreadyExists" };
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
    await startSession(input.data);
  } catch {
    redirect(`/${lang}/login`);
  }
  redirect(`/${lang}/records`);
}
