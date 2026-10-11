"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import type { Locale } from "@/i18n/locales";
import { accessTokenCookie, readJwtUserId } from "@/lib/auth/token-cookies";
import { sendContactMail } from "@/lib/contact/send-contact-mail";
import { logError } from "@/lib/log/logger";
import { verifyTurnstile } from "@/lib/turnstile/verify-turnstile";
import { contactInputSchema, honeypotField } from "@/schemas/contact/contact";

const useMock = process.env.USE_MOCK === "true";

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
    return {
      success: false,
      messageKey: "invalidInput",
      errors: z.flattenError(input.error).fieldErrors,
    };
  }

  if (useMock) return { success: true, data: null };

  const turnstileFailure = await verifyTurnstile(formData);
  if (turnstileFailure) return { success: false, messageKey: turnstileFailure };

  try {
    const accessToken = (await cookies()).get(accessTokenCookie)?.value;
    await sendContactMail(input.data, {
      lang,
      userId: accessToken ? readJwtUserId(accessToken) : undefined,
      receivedAt: new Date(),
    });
  } catch (error) {
    logError("error", "contact_send_failed", error);
    return { success: false, messageKey: "unexpectedError" };
  }
  return { success: true, data: null };
}
