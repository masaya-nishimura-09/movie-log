import { describe, expect, it } from "vitest";
import { userResponseSchema } from "@/schemas/user/user";

describe("userResponseSchema", () => {
  it("returns the username and email", () => {
    expect(
      userResponseSchema.parse({
        username: "tester",
        email: "user@example.com",
        user_id: 1,
      }),
    ).toEqual({ username: "tester", email: "user@example.com" });
  });

  it("rejects an invalid email", () => {
    expect(
      userResponseSchema.safeParse({ username: "tester", email: "user" })
        .success,
    ).toBe(false);
  });
});
