"use server";

import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { sendContact } from "@/api/contact/send-contact";
import type { Locale } from "@/i18n/locales";
import { logError } from "@/lib/log/logger";
import { verifyTurnstile } from "@/lib/turnstile/verify-turnstile";
import { contactInputSchema, honeypotField } from "@/schemas/contact/contact";

export async function sendContactAction(
  lang: Locale,
  _previous: ActionResult<null> | undefined,
  formData: FormData,
): Promise<ActionResult<null>> {
  if (String(formData.get(honeypotField) ?? "") !== "") {
    return { success: true, data: null };
  }

  const input = contactInputSchema.safeParse({
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!input.success) {
    return invalidInput(input.error);
  }

  const turnstileFailure = await verifyTurnstile(formData);
  if (turnstileFailure) return { success: false, messageKey: turnstileFailure };

  try {
    await sendContact(input.data, lang);
  } catch (error) {
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    logError("error", "contact_send_failed", error);
    return { success: false, messageKey: "unexpectedError" };
  }
  return { success: true, data: null };
}
