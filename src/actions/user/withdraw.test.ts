import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const deleteUser = vi.fn();
const endSession = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT ${url}`);
  },
}));
vi.mock("@/api/user/delete-user", () => ({ deleteUser }));
vi.mock("@/actions/auth/session", () => ({ endSession }));

const { withdrawAction } = await import("@/actions/user/withdraw");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("withdrawAction", () => {
  it("deletes the user, ends the session and moves to register", async () => {
    deleteUser.mockResolvedValue(undefined);
    await expect(withdrawAction("en")).rejects.toThrow("REDIRECT /en/register");
    expect(endSession).toHaveBeenCalled();
  });

  it("returns withdrawFailed and keeps the session on an API error", async () => {
    deleteUser.mockRejectedValue(new ApiError(500, "INTERNAL_SERVER_ERROR"));
    await expect(withdrawAction("ja")).resolves.toEqual({
      success: false,
      messageKey: "withdrawFailed",
    });
    expect(endSession).not.toHaveBeenCalled();
  });

  it("rethrows errors that are not API errors", async () => {
    deleteUser.mockRejectedValue(new Error("network"));
    await expect(withdrawAction("ja")).rejects.toThrow("network");
  });
});
