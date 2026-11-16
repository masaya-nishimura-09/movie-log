import { describe, expect, it } from "vitest";
import {
  emailFromEmailChangeToken,
  emailFromVerificationToken,
  mockAccounts,
  mockEmailChangeToken,
  mockVerificationToken,
  toUserResponse,
} from "@/api/mock/mock-user";

describe("mockAccounts", () => {
  it("starts with the verified demo account", () => {
    expect(mockAccounts[0]).toMatchObject({
      user_id: "1",
      email: "demo@example.com",
      password: "password",
      verified: true,
    });
  });
});

describe("toUserResponse", () => {
  it("removes the password, the verification state and the pending email", () => {
    expect(
      toUserResponse({
        user_id: "1",
        username: "tester",
        email: "user@example.com",
        password: "secret",
        verified: false,
        pendingEmail: "new@example.com",
      }),
    ).toEqual({ user_id: "1", username: "tester", email: "user@example.com" });
  });
});

describe("mockVerificationToken", () => {
  it("encodes the email so that it can be read back", () => {
    const token = mockVerificationToken("user@example.com");
    expect(token).toBe("mock-verify-dXNlckBleGFtcGxlLmNvbQ");
    expect(emailFromVerificationToken(token)).toBe("user@example.com");
  });

  it("returns undefined for a token in another format", () => {
    expect(emailFromVerificationToken("other")).toBeUndefined();
    expect(emailFromVerificationToken(undefined)).toBeUndefined();
  });
});

describe("mockEmailChangeToken", () => {
  it("encodes the new email so that it can be read back", () => {
    const token = mockEmailChangeToken("new@example.com");
    expect(token).toBe("mock-email-change-bmV3QGV4YW1wbGUuY29t");
    expect(emailFromEmailChangeToken(token)).toBe("new@example.com");
  });

  it("does not read a token for another purpose", () => {
    expect(
      emailFromEmailChangeToken(mockVerificationToken("new@example.com")),
    ).toBeUndefined();
    expect(
      emailFromVerificationToken(mockEmailChangeToken("new@example.com")),
    ).toBeUndefined();
  });
});
