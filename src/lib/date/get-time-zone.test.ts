import { describe, expect, it, vi } from "vitest";

const get = vi.fn();

vi.mock("next/headers", () => ({ cookies: async () => ({ get }) }));

const { getTimeZone } = await import("@/lib/date/get-time-zone");

describe("getTimeZone", () => {
  it("reads the time zone from the cookie", async () => {
    get.mockReturnValue({ value: "Europe/Paris" });
    await expect(getTimeZone()).resolves.toBe("Europe/Paris");
    expect(get).toHaveBeenCalledWith("tz");
  });

  it("falls back to Asia/Tokyo without a valid cookie", async () => {
    get.mockReturnValue(undefined);
    await expect(getTimeZone()).resolves.toBe("Asia/Tokyo");
    get.mockReturnValue({ value: "nowhere" });
    await expect(getTimeZone()).resolves.toBe("Asia/Tokyo");
  });
});
