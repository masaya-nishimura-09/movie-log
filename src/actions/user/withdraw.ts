"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { deleteUser } from "@/api/user/delete-user";
import type { Locale } from "@/i18n/locales";
import { endSession } from "@/lib/auth/session";

export async function withdrawAction(
  lang: Locale,
): Promise<ActionResult<never>> {
  try {
    await deleteUser();
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "withdrawFailed" };
    }
    throw error;
  }
  await endSession();
  redirect(`/${lang}/register`);
}
