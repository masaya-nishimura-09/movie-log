import { describe, expect, it } from "vitest";
import {
  emailFromVerificationToken,
  mockAccounts,
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
  it("removes the password and the verification state", () => {
    expect(
      toUserResponse({
        user_id: "1",
        username: "tester",
        email: "user@example.com",
        password: "secret",
        verified: false,
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
