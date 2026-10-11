import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const createRecord = vi.fn();
const updateRecord = vi.fn();

vi.mock("next/navigation", () => import("@/test/next-navigation"));
vi.mock("@/api/record/create-record", () => ({ createRecord }));
vi.mock("@/api/record/update-record", () => ({ updateRecord }));

const { createRecordAction, updateRecordAction } = await import(
  "@/actions/record/save-record"
);

function form(fields: Record<string, string | string[]> = {}) {
  const values: Record<string, string | string[]> = {
    title: "Arrival",
    watchedAt: "2026-10-01T12:00:00Z",
    score: "5",
    platform: "netflix",
    releaseYear: "2016",
    runtime: "116",
    genres: ["drama"],
    language: "en",
    "credits.0.personName": "Amy Adams",
    "credits.0.creditRole": "cast",
    memo: "",
    ...fields,
  };
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    for (const item of [value].flat()) data.append(key, item);
  }
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-11T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createRecordAction", () => {
  it("creates the record from the form and moves to it", async () => {
    createRecord.mockResolvedValue({ recordId: "42" });
    await expect(createRecordAction("en", undefined, form())).rejects.toThrow(
      "REDIRECT /en/records/42",
    );
    expect(createRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Arrival",
        score: 5,
        releaseYear: 2016,
        runtime: 116,
        genres: ["drama"],
        credits: [{ personName: "Amy Adams", creditRole: "cast" }],
      }),
    );
    expect(updateRecord).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const result = await createRecordAction(
      "ja",
      undefined,
      form({ title: "", watchedAt: "2026-10-12T00:00:00Z", score: "6" }),
    );
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(
      Object.keys(result.success ? {} : (result.errors ?? {})).sort(),
    ).toEqual(["score", "title", "watchedAt"]);
    expect(createRecord).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(404, "RECORD_NOT_FOUND"), "notFound"],
    [new ApiError(400, "INVALID_INPUT"), "invalidInput"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      createRecord.mockRejectedValue(error);
      await expect(
        createRecordAction("ja", undefined, form()),
      ).resolves.toEqual({ success: false, messageKey });
    });
  }

  it("rethrows errors that are not API errors", async () => {
    createRecord.mockRejectedValue(new Error("network"));
    await expect(createRecordAction("ja", undefined, form())).rejects.toThrow(
      "network",
    );
  });
});

describe("updateRecordAction", () => {
  it("updates the record and moves to it", async () => {
    updateRecord.mockResolvedValue({ recordId: "7" });
    await expect(
      updateRecordAction("ja", "7", undefined, form()),
    ).rejects.toThrow("REDIRECT /ja/records/7");
    expect(updateRecord).toHaveBeenCalledWith(
      "7",
      expect.objectContaining({ title: "Arrival" }),
    );
    expect(createRecord).not.toHaveBeenCalled();
  });

  it("returns notFound when the record was deleted", async () => {
    updateRecord.mockRejectedValue(new ApiError(404, "RECORD_NOT_FOUND"));
    await expect(
      updateRecordAction("ja", "7", undefined, form()),
    ).resolves.toEqual({ success: false, messageKey: "notFound" });
  });
});
