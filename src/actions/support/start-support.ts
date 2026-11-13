"use server";

import { redirect } from "next/navigation";
import { type ActionResult, invalidInput } from "@/actions/action-result";
import { getDictionaryFor } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { logError } from "@/lib/log/logger";
import { createSupportCheckoutUrl } from "@/lib/support/stripe-checkout";
import { supportInputSchema } from "@/schemas/support/support";

export async function startSupportAction(
  lang: Locale,
  _previous: ActionResult<never> | undefined,
  formData: FormData,
): Promise<ActionResult<never>> {
  const input = supportInputSchema.safeParse({
    choice: formData.get("choice") ?? undefined,
    customAmount: String(formData.get("customAmount") ?? ""),
  });
  if (!input.success) return invalidInput(input.error);

  let url: string;
  try {
    const dict = await getDictionaryFor(lang);
    url = await createSupportCheckoutUrl(
      input.data.amount,
      lang,
      dict.support.productName,
    );
  } catch (error) {
    logError("error", "support_checkout_failed", error);
    return { success: false, messageKey: "unexpectedError" };
  }
  redirect(url);
}
