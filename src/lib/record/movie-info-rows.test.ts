import { describe, expect, it } from "vitest";
import ja from "@/i18n/dictionaries/ja.json";
import { movieInfoRows } from "@/lib/record/movie-info-rows";
import type { MovieRecord } from "@/schemas/record/record";

const record: MovieRecord = {
  recordId: "1",
  title: "九番ホームの灯",
  originalTitle: "",
  overview: "",
  releaseYear: 2019,
  runtime: 98,
  genres: ["drama", "mystery"],
  countries: ["JP"],
  language: "ja",
  credits: [
    { personName: "水無瀬 遥", creditRole: "director" },
    { personName: "久世 蓮", creditRole: "cast" },
    { personName: "織部 凪", creditRole: "cast" },
    { personName: "三田 晶", creditRole: "composer" },
  ],
  posterUrl: "",
  watchedAt: "2026-09-27T12:00:00Z",
  platform: "mubi",
  score: 4,
  moodTags: [],
  createdAt: "2026-09-27T14:00:00Z",
  updatedAt: "2026-09-27T14:00:00Z",
};

describe("movieInfoRows", () => {
  it("lists the release, production, genres, directors and cast", () => {
    expect(movieInfoRows("ja", record, ja)).toEqual([
      { key: "released", label: "公開", value: "2019年 · 98分" },
      { key: "production", label: "制作", value: "日本 · 日本語" },
      { key: "genres", label: "ジャンル", value: "ドラマ、ミステリー" },
      { key: "directors", label: "監督", value: "水無瀬 遥" },
      { key: "cast", label: "出演", value: "久世 蓮、織部 凪" },
    ]);
  });

  it("leaves out the rows that have no value", () => {
    expect(
      movieInfoRows(
        "ja",
        {
          ...record,
          releaseYear: 0,
          runtime: 0,
          genres: [],
          countries: [],
          language: "",
          credits: [],
        },
        ja,
      ),
    ).toEqual([]);
  });

  it("keeps the year when the runtime is unknown", () => {
    expect(movieInfoRows("ja", { ...record, runtime: 0 }, ja)[0]).toEqual({
      key: "released",
      label: "公開",
      value: "2019年",
    });
  });
});
