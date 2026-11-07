import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ja from "@/i18n/dictionaries/ja.json";
import { toRecordsCsv } from "@/lib/export/records-csv";
import type { MovieRecord } from "@/schemas/record/record";

const record: MovieRecord = {
  recordId: "1",
  title: "メッセージ",
  originalTitle: "Arrival",
  overview: "言語学者が宇宙船と対話する。",
  releaseYear: 2016,
  runtime: 116,
  genres: ["drama", "science_fiction"],
  countries: ["US"],
  language: "en",
  credits: [
    { personName: "Denis Villeneuve", creditRole: "director" },
    { personName: "Amy Adams", creditRole: "cast" },
  ],
  posterUrl: "https://example.com/a.jpg",
  watchedAt: "2026-10-01T12:00:00Z",
  platform: "netflix",
  score: 5,
  moodTags: ["moving", "tense"],
  memo: "",
  createdAt: "2026-10-01T12:00:00Z",
  updatedAt: "2026-10-01T12:00:00Z",
};

function rows(csv: string): string[] {
  return csv.replace(/^﻿/, "").trimEnd().split("\r\n");
}

beforeEach(() => {
  vi.stubEnv("TZ", "Asia/Tokyo");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("toRecordsCsv", () => {
  it("starts with a BOM so that spreadsheet apps read it as UTF-8", () => {
    expect(toRecordsCsv([], "ja", ja).startsWith("﻿")).toBe(true);
  });

  it("writes the header in the screen's language", () => {
    expect(rows(toRecordsCsv([], "ja", ja))).toEqual([
      "タイトル,原題,鑑賞日,プラットフォーム,スコア,雰囲気タグ,公開年,上映時間,ジャンル,製作国,言語,クレジット,あらすじ,メモ,ポスター画像のURL",
    ]);
  });

  it("writes one row per record with readable labels instead of codes", () => {
    const [, row] = rows(toRecordsCsv([record], "ja", ja));
    expect(row).toBe(
      [
        "メッセージ",
        "Arrival",
        "2026-10-01",
        "Netflix",
        "5",
        "感動系 / 緊張感系",
        "2016",
        "116",
        "ドラマ / SF",
        "アメリカ合衆国",
        "英語",
        "監督: Denis Villeneuve / キャスト: Amy Adams",
        "言語学者が宇宙船と対話する。",
        "",
        "https://example.com/a.jpg",
      ].join(","),
    );
  });

  it("leaves the release year and runtime empty when they are unknown", () => {
    const [, row] = rows(
      toRecordsCsv([{ ...record, releaseYear: 0, runtime: 0 }], "ja", ja),
    );
    expect(row?.split(",").slice(6, 8)).toEqual(["", ""]);
  });

  it("quotes values with commas, quotes and line breaks", () => {
    const csv = toRecordsCsv([{ ...record, memo: 'a,b "c"\r\nd' }], "ja", ja);
    expect(csv).toContain(',"a,b ""c""\r\nd",');
  });

  it("keeps the order of the records", () => {
    const csv = toRecordsCsv(
      [
        { ...record, title: "一つ目" },
        { ...record, title: "二つ目" },
      ],
      "ja",
      ja,
    );
    expect(csv.indexOf("一つ目")).toBeLessThan(csv.indexOf("二つ目"));
  });
});
