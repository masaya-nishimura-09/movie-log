import { describe, expect, it } from "vitest";
import { tokenPairResponseSchema } from "@/schemas/auth/token";

describe("tokenPairResponseSchema", () => {
  it("converts the tokens to camelCase", () => {
    expect(
      tokenPairResponseSchema.parse({
        access_token: "access",
        refresh_token: "refresh",
      }),
    ).toEqual({ accessToken: "access", refreshToken: "refresh" });
  });

  it("rejects a response without a token", () => {
    expect(
      tokenPairResponseSchema.safeParse({ access_token: "access" }).success,
    ).toBe(false);
  });
});
