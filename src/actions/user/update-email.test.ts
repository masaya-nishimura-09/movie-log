import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const updateEmail = vi.fn();
const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath }));

vi.mock("@/api/user/update-email", () => ({ updateEmail }));

const { updateEmailAction } = await import("@/actions/user/update-email");

function form(fields: Record<string, string> = {}) {
  const data = new FormData();
  const values = {
    email: "user@example.com",
    password: "password",
    ...fields,
  };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  updateEmail.mockResolvedValue(undefined);
});

describe("updateEmailAction", () => {
  it("updates the email with the current password", async () => {
    await expect(updateEmailAction(undefined, form())).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(updateEmail).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("returns field errors for invalid input", async () => {
    const result = await updateEmailAction(
      undefined,
      form({ email: "user", password: "short" }),
    );
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(updateEmail).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(409, "USER_ALREADY_EXISTS"), "userAlreadyExists"],
    [new ApiError(400, "INVALID_CURRENT_PASSWORD"), "invalidCurrentPassword"],
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      updateEmail.mockRejectedValue(error);
      await expect(updateEmailAction(undefined, form())).resolves.toEqual({
        success: false,
        messageKey,
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  }

  it("rethrows errors that are not API errors", async () => {
    updateEmail.mockRejectedValue(new Error("network"));
    await expect(updateEmailAction(undefined, form())).rejects.toThrow(
      "network",
    );
  });
});
