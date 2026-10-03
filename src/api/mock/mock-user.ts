import type { UserResponse } from "@/schemas/user/user";

type MockAccount = UserResponse & { user_id: string; password: string };

const initialAccounts: MockAccount[] = [
  {
    user_id: "1",
    username: "Demo User",
    email: "demo@example.com",
    password: "password",
  },
];

const store = globalThis as { mockAccounts?: MockAccount[] };
store.mockAccounts ??= initialAccounts;
export const mockAccounts = store.mockAccounts;

export function toUserResponse({ password: _, ...user }: MockAccount) {
  return user;
}
