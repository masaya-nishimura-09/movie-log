import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { getMoodCounts } = await import("@/api/record/get-mood-counts");

describe("getMoodCounts", () => {
  it("gets /records/mood-counts", async () => {
    const counts = [{ moodTag: "moving", count: 2 }];
    apiFetch.mockResolvedValue(counts);
    await expect(getMoodCounts()).resolves.toEqual(counts);
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/records/mood-counts");
  });
});
