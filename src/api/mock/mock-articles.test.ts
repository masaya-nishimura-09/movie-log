import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoRecordsEn } from "@/api/mock/mock-records-demo-en";
import { demoRecordsJa } from "@/api/mock/mock-records-demo-ja";
import { initialRecordsEn } from "@/api/mock/mock-records-en";
import { initialRecordsJa } from "@/api/mock/mock-records-ja";
import { articleResponseSchema } from "@/schemas/article/article";
import { articleInputSchema } from "@/schemas/article/article-input";

async function load(dataset: string, language: string) {
  const store = globalThis as Record<string, unknown>;
  delete store.mockArticles;
  vi.resetModules();
  vi.stubEnv("MOCK_DATASET", dataset);
  vi.stubEnv("MOCK_LANGUAGE", language);
  return (await import("@/api/mock/mock-articles")).mockArticles;
}

beforeEach(() => {
  vi.unstubAllEnvs();
});

const cases = [
  ["default", "ja", initialRecordsJa],
  ["default", "en", initialRecordsEn],
  ["demo", "ja", demoRecordsJa],
  ["demo", "en", demoRecordsEn],
] as const;

describe("mockArticles", () => {
  for (const [dataset, language, records] of cases) {
    describe(`${dataset} ${language}`, () => {
      const dataset_ = dataset === "demo" ? "demo" : "";

      it("has articles that the response schema accepts once the record is added", async () => {
        const articles = await load(dataset_, language);
        expect(articles.length).toBeGreaterThan(0);
        for (const { record_id, ...rest } of articles) {
          expect(
            articleResponseSchema.safeParse({
              ...rest,
              record: {
                record_id,
                title: "映画",
                release_year: 2000,
                poster_url: "",
              },
            }).success,
          ).toBe(true);
        }
      });

      it("has articles that the input schema accepts", async () => {
        for (const article of await load(dataset_, language)) {
          expect(
            articleInputSchema.safeParse({
              title: article.title,
              content: article.content,
            }).success,
          ).toBe(true);
        }
      });

      it("gives every article a unique ID and a record of the same dataset", async () => {
        const articles = await load(dataset_, language);
        const ids = articles.map((a) => a.article_id);
        expect(new Set(ids).size).toBe(ids.length);
        const recordIds = records.map((r) => r.record_id);
        for (const article of articles) {
          expect(recordIds).toContain(article.record_id);
        }
      });
    });
  }

  it("has articles for several records in the demo datasets", async () => {
    for (const language of ["ja", "en"]) {
      const articles = await load("demo", language);
      expect(new Set(articles.map((a) => a.record_id)).size).toBeGreaterThan(2);
      expect(
        articles.some((a) => JSON.stringify(a.content).length > 3000),
      ).toBe(true);
    }
  });

  it("keeps the two articles of record 1 in the default dataset that the E2E tests use", async () => {
    const articles = await load("", "");
    expect(
      articles.filter((a) => a.record_id === "1").map((a) => a.article_id),
    ).toEqual(["1", "2"]);
  });

  it("has enough articles for the list to take four pages of 12", async () => {
    for (const [dataset, language] of [
      ["", "ja"],
      ["", "en"],
      ["demo", "ja"],
      ["demo", "en"],
    ] as const) {
      const articles = await load(dataset, language);
      expect(articles.length).toBeGreaterThan(36);
    }
  });

  it("spreads the extra articles over several records but not over record 1", async () => {
    const articles = await load("", "");
    const extras = articles.slice(6);
    expect(new Set(extras.map((a) => a.record_id)).size).toBeGreaterThan(10);
    expect(extras.some((a) => a.record_id === "1")).toBe(false);
  });

  it("gives the extra articles sequential IDs after the base ones", async () => {
    const articles = await load("", "");
    expect(articles.map((a) => a.article_id)).toEqual(
      articles.map((_, i) => String(i + 1)),
    );
  });

  it("keeps the words the search tests rely on out of the extra articles", async () => {
    const articles = await load("", "ja");
    const text = JSON.stringify(articles.slice(6));
    for (const word of ["バルセロナ", "ダイナマイト", "ジャンプカット"]) {
      expect(text).not.toContain(word);
    }
  });
});
