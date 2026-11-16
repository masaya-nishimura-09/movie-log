import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const verifyEmailChange = vi.fn();
const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/api/user/verify-email-change", () => ({ verifyEmailChange }));

const { verifyEmailChangeAction } = await import(
  "@/actions/user/verify-email-change"
);

beforeEach(() => {
  vi.clearAllMocks();
  verifyEmailChange.mockResolvedValue(undefined);
});

describe("verifyEmailChangeAction", () => {
  it("sends the token, succeeds and refreshes the shown email", async () => {
    await expect(
      verifyEmailChangeAction("token-value", undefined, new FormData()),
    ).resolves.toEqual({ success: true, data: null });
    expect(verifyEmailChange).toHaveBeenCalledWith("token-value");
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  const cases = [
    [new ApiError(400, "INVALID_VERIFICATION_TOKEN"), "invalidToken"],
    [new ApiError(400, "INVALID_INPUT"), "invalidToken"],
    [new ApiError(409, "USER_ALREADY_EXISTS"), "emailTaken"],
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      verifyEmailChange.mockRejectedValue(error);
      await expect(
        verifyEmailChangeAction("token-value", undefined, new FormData()),
      ).resolves.toEqual({ success: false, messageKey });
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  }

  it("rethrows errors that are not API errors", async () => {
    verifyEmailChange.mockRejectedValue(new Error("network"));
    await expect(
      verifyEmailChangeAction("token-value", undefined, new FormData()),
    ).rejects.toThrow("network");
  });
});
