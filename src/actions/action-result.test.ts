import { describe, expect, it } from "vitest";
import { z } from "zod";
import { invalidInput } from "@/actions/action-result";

describe("invalidInput", () => {
  it("returns the field errors of a validation error", () => {
    const result = z
      .object({ email: z.email("invalidEmail"), name: z.string().min(1) })
      .safeParse({ email: "user", name: "" });
    if (result.success) throw new Error("expected a validation error");
    expect(invalidInput(result.error)).toEqual({
      success: false,
      messageKey: "invalidInput",
      errors: {
        email: ["invalidEmail"],
        name: [expect.any(String)],
      },
    });
  });
});
