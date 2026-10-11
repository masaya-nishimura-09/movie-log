import { describe, expect, it } from "vitest";
import { mockAccounts, toUserResponse } from "@/api/mock/mock-user";

describe("mockAccounts", () => {
  it("starts with the demo account", () => {
    expect(mockAccounts[0]).toMatchObject({
      user_id: "1",
      email: "demo@example.com",
      password: "password",
    });
  });
});

describe("toUserResponse", () => {
  it("removes the password", () => {
    expect(
      toUserResponse({
        user_id: "1",
        username: "tester",
        email: "user@example.com",
        password: "secret",
      }),
    ).toEqual({ user_id: "1", username: "tester", email: "user@example.com" });
  });
});
