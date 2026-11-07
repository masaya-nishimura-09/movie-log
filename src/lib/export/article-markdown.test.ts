import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  articleFiles,
  articleToMarkdown,
  contentToMarkdown,
} from "@/lib/export/article-markdown";
import type { Article } from "@/schemas/article/article";

const text = (value: string, marks: string[] = []) => ({
  type: "text",
  text: value,
  ...(marks.length > 0 ? { marks: marks.map((type) => ({ type })) } : {}),
});
const paragraph = (...content: object[]) => ({ type: "paragraph", content });
const item = (...content: object[]) => ({ type: "listItem", content });
const doc = (...content: object[]) => ({ type: "doc", content });

describe("contentToMarkdown", () => {
  it("converts headings and paragraphs, separated by blank lines", () => {
    expect(
      contentToMarkdown(
        doc(
          { type: "heading", attrs: { level: 2 }, content: [text("編集")] },
          { type: "heading", attrs: { level: 3 }, content: [text("音")] },
          paragraph(text("本文")),
        ),
      ),
    ).toBe("## 編集\n\n### 音\n\n本文");
  });

  it("converts bold, italic and both", () => {
    expect(
      contentToMarkdown(
        doc(
          paragraph(
            text("a"),
            text("b", ["bold"]),
            text("c", ["italic"]),
            text("d", ["bold", "italic"]),
          ),
        ),
      ),
    ).toBe("a**b***c****d***");
  });

  it("converts a hard break to a line break", () => {
    expect(
      contentToMarkdown(
        doc(paragraph(text("1行目"), { type: "hardBreak" }, text("2行目"))),
      ),
    ).toBe("1行目  \n2行目");
  });

  it("converts bullet and ordered lists, keeping the start number and nesting", () => {
    expect(
      contentToMarkdown(
        doc({
          type: "bulletList",
          content: [
            item(paragraph(text("一つ目"))),
            item(paragraph(text("二つ目")), {
              type: "orderedList",
              attrs: { start: 3 },
              content: [item(paragraph(text("中")))],
            }),
          ],
        }),
      ),
    ).toBe("- 一つ目\n- 二つ目\n  3. 中");
  });

  it("converts a blockquote with several paragraphs", () => {
    expect(
      contentToMarkdown(
        doc({
          type: "blockquote",
          content: [paragraph(text("引用1")), paragraph(text("引用2"))],
        }),
      ),
    ).toBe("> 引用1\n>\n> 引用2");
  });

  it("drops empty paragraphs", () => {
    expect(
      contentToMarkdown(
        doc(paragraph(text("a")), { type: "paragraph" }, paragraph(text("b"))),
      ),
    ).toBe("a\n\nb");
  });

  it("escapes characters that Markdown would treat as formatting", () => {
    expect(
      contentToMarkdown(
        doc(
          paragraph(text("a*b_c [d] `e` \\f")),
          paragraph(text("# 見出しではない")),
          paragraph(text("- 箇条書きではない")),
          paragraph(text("1. 番号ではない")),
          paragraph(text("> 引用ではない")),
        ),
      ),
    ).toBe(
      [
        "a\\*b\\_c \\[d\\] \\`e\\` \\\\f",
        "\\# 見出しではない",
        "\\- 箇条書きではない",
        "\\1. 番号ではない",
        "\\> 引用ではない",
      ].join("\n\n"),
    );
  });
});

describe("articleToMarkdown and articleFiles", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "Asia/Tokyo");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const article = (overrides: Partial<Article> = {}): Article => ({
    articleId: "1",
    title: "2回目",
    record: {
      recordId: "3",
      title: "勝手にしやがれ",
      releaseYear: 1960,
      posterUrl: "",
    },
    content: doc(paragraph(text("本文"))),
    createdAt: "2026-10-04T12:00:00Z",
    updatedAt: "2026-10-05T16:00:00Z",
    ...overrides,
  });
  const labels = {
    movie: "映画",
    createdAt: "作成日",
    updatedAt: "更新日",
    releaseYear: "{year}年",
  };

  it("writes the title, the film, the dates in local time and the body", () => {
    expect(articleToMarkdown(article(), labels)).toBe(
      [
        "# 2回目",
        "",
        "- 映画: 勝手にしやがれ ・ 1960年",
        "- 作成日: 2026-10-04",
        "- 更新日: 2026-10-06",
        "",
        "本文",
        "",
      ].join("\n"),
    );
  });

  it("omits the release year when it is unknown and the body when it is empty", () => {
    const markdown = articleToMarkdown(
      article({
        record: { ...article().record, releaseYear: 0 },
        content: doc(),
      }),
      labels,
    );
    expect(markdown).toContain("- 映画: 勝手にしやがれ\n");
    expect(markdown.endsWith("- 更新日: 2026-10-06\n")).toBe(true);
  });

  it("makes one file per article, named by its created date and title", () => {
    const files = articleFiles(
      [article({ title: "一本目" }), article({ title: "二本目" })],
      labels,
    );
    expect(files.map((file) => file.name)).toEqual([
      "2026-10-04 一本目.md",
      "2026-10-04 二本目.md",
    ]);
    expect(files[1]?.text).toMatch(/^# 二本目\n/);
  });

  it("replaces characters that file names cannot hold and trims long titles", () => {
    const [file] = articleFiles(
      [article({ title: ` ../a/b:c*d?"e"<f>|g  ${"長".repeat(100)}` })],
      labels,
    );
    expect(file?.name).toMatch(/^2026-10-04 a b c d e f g 長+\.md$/);
    expect(file?.name.length).toBeLessThanOrEqual(
      "2026-10-04 ".length + 80 + ".md".length,
    );
  });

  it("numbers files whose names would collide", () => {
    const files = articleFiles(
      [article(), article(), article({ title: "2回目".toUpperCase() })],
      labels,
    );
    expect(files.map((file) => file.name)).toEqual([
      "2026-10-04 2回目.md",
      "2026-10-04 2回目 (2).md",
      "2026-10-04 2回目 (3).md",
    ]);
  });

  it("returns no files for no articles", () => {
    expect(articleFiles([], labels)).toEqual([]);
  });
});
