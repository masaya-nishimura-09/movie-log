import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";
import { jsonBody } from "@/api/client/request-json";
import {
  toUsernameRequest,
  type UsernameInput,
} from "@/schemas/user/user-input";

export async function updateUsername(input: UsernameInput): Promise<void> {
  await apiFetch(
    "/users/username",
    z.unknown(),
    jsonBody(toUsernameRequest(input), "PUT"),
  );
}
