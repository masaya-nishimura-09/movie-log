import type { UserResponse } from "@/schemas/user/user";

type MockAccount = UserResponse & {
  user_id: string;
  password: string;
  verified: boolean;
  pendingEmail?: string;
  resetRequested?: boolean;
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
  pendingEmail: ___,
  resetRequested: ____,
  ...user
}: MockAccount) {
  return user;
}

function encodeToken(prefix: string, email: string): string {
  return `${prefix}${Buffer.from(email).toString("base64url")}`;
}

function decodeToken(prefix: string, token: unknown): string | undefined {
  if (typeof token !== "string" || !token.startsWith(prefix)) {
    return undefined;
  }
  return Buffer.from(token.slice(prefix.length), "base64url").toString();
}

const verificationTokenPrefix = "mock-verify-";
const emailChangeTokenPrefix = "mock-email-change-";
const passwordResetTokenPrefix = "mock-password-reset-";

export function mockVerificationToken(email: string): string {
  return encodeToken(verificationTokenPrefix, email);
}

export function emailFromVerificationToken(token: unknown): string | undefined {
  return decodeToken(verificationTokenPrefix, token);
}

export function mockEmailChangeToken(email: string): string {
  return encodeToken(emailChangeTokenPrefix, email);
}

export function emailFromEmailChangeToken(token: unknown): string | undefined {
  return decodeToken(emailChangeTokenPrefix, token);
}

export function mockPasswordResetToken(email: string): string {
  return encodeToken(passwordResetTokenPrefix, email);
}

export function emailFromPasswordResetToken(
  token: unknown,
): string | undefined {
  return decodeToken(passwordResetTokenPrefix, token);
}
