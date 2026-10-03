import { cache } from "react";
import { apiFetch } from "@/api/client/api-fetch";
import { type User, userResponseSchema } from "@/schemas/user/user";

export const getCurrentUser = cache(async (): Promise<User> => {
  return apiFetch("/users/", userResponseSchema);
});
