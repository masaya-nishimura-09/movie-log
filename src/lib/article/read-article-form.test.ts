import { describe, expect, it } from "vitest";
import { readArticleForm } from "@/lib/article/read-article-form";

function formData(entries: [string, string][]): FormData {
  const data = new FormData();
  for (const [key, value] of entries) data.append(key, value);
  return data;
}

describe("readArticleForm", () => {
  it("reads the title and parses the content JSON", () => {
    expect(
      readArticleForm(
        formData([
          ["title", "感想"],
          ["content", '{"type":"doc","content":[]}'],
        ]),
      ),
    ).toEqual({ title: "感想", content: { type: "doc", content: [] } });
  });

  it("defaults the title to an empty string", () => {
    expect(readArticleForm(formData([["content", "{}"]])).title).toBe("");
  });

  it("leaves the content undefined when it is missing or not JSON", () => {
    expect(readArticleForm(formData([])).content).toBeUndefined();
    expect(
      readArticleForm(formData([["content", "{broken"]])).content,
    ).toBeUndefined();
  });

  it("keeps a JSON null as null", () => {
    expect(readArticleForm(formData([["content", "null"]])).content).toBeNull();
  });
});
