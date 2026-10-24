import { describe, expect, it } from "vitest";
import {
  articleInputSchema,
  contentRequiredMessage,
  toArticleRequest,
  toCreateArticleRequest,
} from "@/schemas/article/article-input";

const validInput = {
  title: "感想",
  content: {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "本文" }] }],
  },
};

function issuePaths(input: Record<string, unknown>) {
  const result = articleInputSchema.safeParse({ ...validInput, ...input });
  return result.success ? [] : result.error.issues.map((i) => i.path[0]);
}

describe("articleInputSchema", () => {
  it("accepts a valid input", () => {
    expect(articleInputSchema.parse(validInput)).toEqual(validInput);
  });

  it("requires a title", () => {
    expect(issuePaths({ title: "" })).toEqual(["title"]);
  });

  it("accepts a title of 255 characters and rejects 256", () => {
    expect(issuePaths({ title: "あ".repeat(255) })).toEqual([]);
    expect(issuePaths({ title: "あ".repeat(256) })).toEqual(["title"]);
  });

  it("requires a content object", () => {
    expect(issuePaths({ content: undefined })).toEqual(["content"]);
    expect(issuePaths({ content: null })).toEqual(["content"]);
    expect(issuePaths({ content: "text" })).toEqual(["content"]);
  });

  it("requires the content to be a document", () => {
    expect(issuePaths({ content: { type: "paragraph" } })).toEqual(["content"]);
    expect(issuePaths({ content: {} })).toEqual(["content"]);
  });

  it("requires some text in the content", () => {
    const messages = (content: unknown) => {
      const result = articleInputSchema.safeParse({ ...validInput, content });
      return result.success ? [] : result.error.issues.map((i) => i.message);
    };
    expect(messages({ type: "doc" })).toEqual([contentRequiredMessage]);
    expect(
      messages({
        type: "doc",
        content: [
          { type: "paragraph" },
          { type: "paragraph", content: [{ type: "text", text: "  " }] },
          { type: "paragraph", content: [{ type: "hardBreak" }] },
        ],
      }),
    ).toEqual([contentRequiredMessage]);
    expect(
      messages({
        type: "doc",
        content: [
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "a" }] },
                ],
              },
            ],
          },
        ],
      }),
    ).toEqual([]);
  });

  it("rejects a content over 100 kilobytes", () => {
    const content = (text: string) => ({
      type: "doc",
      content: [{ type: "text", text }],
    });
    const overhead = new TextEncoder().encode(
      JSON.stringify(content("")),
    ).length;
    const max = 100 * 1024 - overhead;
    expect(issuePaths({ content: content("a".repeat(max)) })).toEqual([]);
    expect(issuePaths({ content: content("a".repeat(max + 1)) })).toEqual([
      "content",
    ]);
  });
});

describe("toArticleRequest", () => {
  it("builds the request body", () => {
    expect(toArticleRequest(validInput)).toEqual({
      title: "感想",
      content: validInput.content,
    });
  });
});

describe("toCreateArticleRequest", () => {
  it("adds the record ID to the request body", () => {
    expect(toCreateArticleRequest("7", validInput)).toEqual({
      record_id: "7",
      title: "感想",
      content: validInput.content,
    });
  });
});
