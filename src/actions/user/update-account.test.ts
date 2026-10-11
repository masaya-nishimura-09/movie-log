import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const updateUser = vi.fn();
const startSession = vi.fn();
const endSession = vi.fn();

vi.mock("next/navigation", () => import("@/test/next-navigation"));
vi.mock("@/api/user/update-user", () => ({ updateUser }));
vi.mock("@/lib/auth/session", () => ({ startSession, endSession }));

const { updateAccountAction } = await import("@/actions/user/update-account");

function form(fields: Record<string, string> = {}) {
  const data = new FormData();
  const values = {
    username: "tester",
    email: "user@example.com",
    password: "password",
    ...fields,
  };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

const user = {
  username: "tester",
  email: "user@example.com",
  password: "password",
};

beforeEach(() => {
  vi.clearAllMocks();
  updateUser.mockResolvedValue(undefined);
  startSession.mockResolvedValue(undefined);
});

describe("updateAccountAction", () => {
  it("updates the user and logs in again with the new values", async () => {
    await expect(updateAccountAction("ja", undefined, form())).resolves.toEqual(
      {
        success: true,
        data: null,
      },
    );
    expect(updateUser).toHaveBeenCalledWith(user);
    expect(startSession).toHaveBeenCalledWith(user);
  });

  it("ends the session and moves to login when logging in again fails", async () => {
    startSession.mockRejectedValue(new Error("failed"));
    await expect(updateAccountAction("en", undefined, form())).rejects.toThrow(
      "REDIRECT /en/login",
    );
    expect(endSession).toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const result = await updateAccountAction(
      "ja",
      undefined,
      form({ username: "", email: "user", password: "short" }),
    );
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(updateUser).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(409, "USER_ALREADY_EXISTS"), "userAlreadyExists"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      updateUser.mockRejectedValue(error);
      await expect(
        updateAccountAction("ja", undefined, form()),
      ).resolves.toEqual({ success: false, messageKey });
      expect(startSession).not.toHaveBeenCalled();
    });
  }

  it("rethrows errors that are not API errors", async () => {
    updateUser.mockRejectedValue(new Error("network"));
    await expect(updateAccountAction("ja", undefined, form())).rejects.toThrow(
      "network",
    );
  });
});
