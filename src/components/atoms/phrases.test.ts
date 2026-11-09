import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Phrases } from "@/components/atoms/phrases";

function render(text: string) {
  return renderToStaticMarkup(createElement(Phrases, null, text));
}

describe("Phrases", () => {
  it("puts a line break opportunity between Japanese phrases and keeps each phrase whole", () => {
    expect(render("観た映画を、1本ずつノートに。")).toBe(
      '<span class="wrap-anywhere break-keep">観た<wbr/>映画を、<wbr/>1本ずつ<wbr/>ノートに。</span>',
    );
  });

  it("leaves text without Japanese as it is", () => {
    expect(render("One note for every film you watch.")).toBe(
      "One note for every film you watch.",
    );
  });

  it("leaves a single phrase as it is", () => {
    expect(render("ノート")).toBe("ノート");
  });
});
