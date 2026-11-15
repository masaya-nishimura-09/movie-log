import type { UserResponse } from "@/schemas/user/user";

type MockAccount = UserResponse & {
  user_id: string;
  password: string;
  verified: boolean;
};

const initialAccounts: MockAccount[] = [
  {
    user_id: "1",
    username: "Demo User",
    email: "demo@example.com",
    password: "password",
    verified: true,
  },
];

const store = globalThis as { mockAccounts?: MockAccount[] };
store.mockAccounts ??= initialAccounts;
export const mockAccounts = store.mockAccounts;

export function toUserResponse({
  password: _,
  verified: __,
  ...user
}: MockAccount) {
  return user;
}

const verificationTokenPrefix = "mock-verify-";

export function mockVerificationToken(email: string): string {
  return `${verificationTokenPrefix}${Buffer.from(email).toString("base64url")}`;
}

export function emailFromVerificationToken(token: unknown): string | undefined {
  if (typeof token !== "string" || !token.startsWith(verificationTokenPrefix)) {
    return undefined;
  }
  return Buffer.from(
    token.slice(verificationTokenPrefix.length),
    "base64url",
  ).toString();
}
