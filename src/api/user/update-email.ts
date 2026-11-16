import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";
import { jsonBody } from "@/api/client/request-json";
import type { Locale } from "@/i18n/locales";
import type { EmailChangeInput } from "@/schemas/user/user-input";

export async function updateEmail(
  input: EmailChangeInput,
  lang: Locale,
): Promise<void> {
  await apiFetch(
    `/users/email?language=${lang}`,
    z.unknown(),
    jsonBody(input, "PUT"),
  );
}
