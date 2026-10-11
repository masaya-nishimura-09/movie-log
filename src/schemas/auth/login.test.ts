import { describe, expect, it } from "vitest";
import { loginInputSchema } from "@/schemas/auth/login";

function messages(input: Record<string, unknown>) {
  const result = loginInputSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.message);
}

describe("loginInputSchema", () => {
  it("accepts a valid email and password", () => {
    expect(
      messages({ email: "user@example.com", password: "password" }),
    ).toEqual([]);
  });

  it("returns the dictionary keys of the errors", () => {
    expect(messages({ email: "user", password: "password" })).toEqual([
      "invalidEmail",
    ]);
    expect(messages({ email: "user@example.com", password: "short" })).toEqual([
      "invalidPassword",
    ]);
    expect(
      messages({ email: "user@example.com", password: "a".repeat(73) }),
    ).toEqual(["invalidPassword"]);
    expect(
      messages({ email: "user@example.com", password: "pass word" }),
    ).toEqual(["invalidPassword"]);
  });
});
