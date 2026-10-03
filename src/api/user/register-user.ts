import { z } from "zod";
import { jsonBody, requestJson } from "@/api/client/request-json";
import { toUserRequest, type UserInput } from "@/schemas/user/user-input";

export async function registerUser(input: UserInput): Promise<void> {
  await requestJson(
    "/users/register",
    z.unknown(),
    jsonBody(toUserRequest(input)),
  );
}
