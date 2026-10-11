import { describe, expect, it } from "vitest";
import {
  contactInputSchema,
  contactMessageMaxLength,
} from "@/schemas/contact/contact";

function messageErrors(message: string) {
  const result = contactInputSchema.safeParse({
    email: "user@example.com",
    message,
  });
  return result.success ? [] : result.error.issues.map((i) => i.message);
}

describe("contactInputSchema", () => {
  it("trims the message", () => {
    expect(
      contactInputSchema.parse({ email: "user@example.com", message: "  Hi  " })
        .message,
    ).toBe("Hi");
  });

  it("rejects a message with only spaces", () => {
    expect(messageErrors("   ")).toEqual(["messageRequired"]);
  });

  it("accepts a message up to the maximum length", () => {
    expect(messageErrors("a".repeat(contactMessageMaxLength))).toEqual([]);
    expect(messageErrors("a".repeat(contactMessageMaxLength + 1))).toEqual([
      "messageTooLong",
    ]);
  });
});
