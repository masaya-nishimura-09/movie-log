"use server";

import { headers } from "next/headers";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { sendContactMail } from "@/lib/contact/send-contact-mail";
import { verifyTurnstile } from "@/lib/contact/verify-turnstile";
import { logError } from "@/lib/log/logger";
import { contactInputSchema, honeypotField } from "@/schemas/contact/contact";

const useMock = process.env.USE_MOCK === "true";

export async function sendContactAction(
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

  try {
    const token = String(formData.get("cf-turnstile-response") ?? "");
    const remoteIp = (await headers()).get("x-real-ip") ?? undefined;
    if (token === "" || !(await verifyTurnstile(token, remoteIp))) {
      return { success: false, messageKey: "verificationFailed" };
    }
    await sendContactMail(input.data);
  } catch (error) {
    logError("error", "contact_send_failed", error);
    return { success: false, messageKey: "unexpectedError" };
  }
  return { success: true, data: null };
}
