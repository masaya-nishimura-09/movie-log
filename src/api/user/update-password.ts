import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";
import { jsonBody } from "@/api/client/request-json";
import {
  type PasswordChangeInput,
  toPasswordChangeRequest,
} from "@/schemas/user/user-input";

export async function updatePassword(
  input: PasswordChangeInput,
): Promise<void> {
  await apiFetch(
    "/users/password",
    z.unknown(),
    jsonBody(toPasswordChangeRequest(input), "PUT"),
  );
}
