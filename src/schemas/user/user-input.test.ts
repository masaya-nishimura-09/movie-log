import { describe, expect, it } from "vitest";
import { toUserRequest, userInputSchema } from "@/schemas/user/user-input";

const validInput = {
  username: "tester",
  email: "user@example.com",
  password: "password1!",
};

describe("userInputSchema", () => {
  it("accepts a valid input", () => {
    expect(userInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts a password of 8 to 72 characters", () => {
    const parse = (password: string) =>
      userInputSchema.safeParse({ ...validInput, password }).success;
    expect(parse("a".repeat(8))).toBe(true);
    expect(parse("a".repeat(72))).toBe(true);
    expect(parse("a".repeat(7))).toBe(false);
    expect(parse("a".repeat(73))).toBe(false);
  });

  it("rejects a password with spaces or full-width characters", () => {
    const parse = (password: string) =>
      userInputSchema.safeParse({ ...validInput, password }).success;
    expect(parse("pass word1")).toBe(false);
    expect(parse("ｐａｓｓｗｏｒｄ１")).toBe(false);
  });
});

describe("toUserRequest", () => {
  it("sends the username as name", () => {
    expect(toUserRequest(validInput)).toEqual({
      name: "tester",
      email: "user@example.com",
      password: "password1!",
    });
  });
});
