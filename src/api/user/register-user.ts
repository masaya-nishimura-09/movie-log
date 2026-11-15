import { z } from "zod";
import { jsonBody, requestJson } from "@/api/client/request-json";
import type { Locale } from "@/i18n/locales";
import { toUserRequest, type UserInput } from "@/schemas/user/user-input";

export async function registerUser(
  input: UserInput,
  lang: Locale,
): Promise<void> {
  await requestJson(
    `/users/register?language=${lang}`,
    z.unknown(),
    jsonBody(toUserRequest(input)),
  );
}
