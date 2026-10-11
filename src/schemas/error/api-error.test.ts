import { describe, expect, it } from "vitest";
import { apiErrorResponseSchema } from "@/schemas/error/api-error";

describe("apiErrorResponseSchema", () => {
  it("accepts a known error code", () => {
    expect(
      apiErrorResponseSchema.parse({ code: "UNAUTHENTICATED", message: "x" }),
    ).toEqual({ code: "UNAUTHENTICATED", message: "x" });
  });

  it("rejects an unknown error code", () => {
    expect(
      apiErrorResponseSchema.safeParse({ code: "UNKNOWN", message: "x" })
        .success,
    ).toBe(false);
  });
});
