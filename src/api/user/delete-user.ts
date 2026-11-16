import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";
import type { Locale } from "@/i18n/locales";

export async function deleteUser(lang: Locale): Promise<void> {
  await apiFetch(`/users/?language=${lang}`, z.unknown(), {
    method: "DELETE",
  });
}
