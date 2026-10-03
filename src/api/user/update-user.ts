import { z } from "zod";
import { apiFetch } from "@/api/client/api-fetch";
import { jsonBody } from "@/api/client/request-json";
import { toUserRequest, type UserInput } from "@/schemas/user/user-input";

export async function updateUser(input: UserInput): Promise<void> {
  await apiFetch("/users/", z.unknown(), jsonBody(toUserRequest(input), "PUT"));
}
