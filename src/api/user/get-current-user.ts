import { mockRecords } from "@/api/record/mock-records";
import type { User } from "@/schemas/user/user";

export async function getCurrentUser(): Promise<User> {
  return {
    username: "まさや",
    email: "m.nishimura@example.com",
    recordCount: mockRecords.length,
  };
}
