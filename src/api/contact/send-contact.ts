import { z } from "zod";
import { jsonBody, requestJson } from "@/api/client/request-json";
import type { Locale } from "@/i18n/locales";
import type { ContactInput } from "@/schemas/contact/contact";

export async function sendContact(
  input: ContactInput,
  lang: Locale,
): Promise<void> {
  await requestJson(`/contacts?language=${lang}`, z.unknown(), jsonBody(input));
}
