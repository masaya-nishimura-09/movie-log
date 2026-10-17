import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const updateUsername = vi.fn();
const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath }));

vi.mock("@/api/user/update-username", () => ({ updateUsername }));

const { updateUsernameAction } = await import("@/actions/user/update-username");

function form(username = "tester") {
  const data = new FormData();
  data.set("username", username);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  updateUsername.mockResolvedValue(undefined);
});

describe("updateUsernameAction", () => {
  it("updates the username", async () => {
    await expect(updateUsernameAction(undefined, form())).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(updateUsername).toHaveBeenCalledWith({ username: "tester" });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("returns field errors for an empty username", async () => {
    const result = await updateUsernameAction(undefined, form(""));
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(updateUsername).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns unexpectedError for an API error", async () => {
    updateUsername.mockRejectedValue(
      new ApiError(500, "INTERNAL_SERVER_ERROR"),
    );
    await expect(updateUsernameAction(undefined, form())).resolves.toEqual({
      success: false,
      messageKey: "unexpectedError",
    });
  });

  it("rethrows errors that are not API errors", async () => {
    updateUsername.mockRejectedValue(new Error("network"));
    await expect(updateUsernameAction(undefined, form())).rejects.toThrow(
      "network",
    );
  });
});
