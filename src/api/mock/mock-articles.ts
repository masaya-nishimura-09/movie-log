import type { MockArticle } from "@/api/mock/mock-article-factory";
import { defaultArticles } from "@/api/mock/mock-articles-default";
import { demoArticles } from "@/api/mock/mock-articles-demo";
import { extraArticles } from "@/api/mock/mock-articles-extra";

const demo = process.env.MOCK_DATASET === "demo";

const manyArticlesRecord = Array.from({ length: 6 }, () => 7);

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

const initialArticles: MockArticle[] = demo
  ? [
      ...demoArticles,
      ...extraArticles(
        [...range(2, 10), ...manyArticlesRecord],
        demoArticles.length + 1,
      ),
    ]
  : [
      ...defaultArticles,
      ...extraArticles(
        [...range(2, 24), ...manyArticlesRecord],
        defaultArticles.length + 1,
      ),
    ];

const store = globalThis as { mockArticles?: MockArticle[] };
store.mockArticles ??= initialArticles;
export const mockArticles = store.mockArticles;
