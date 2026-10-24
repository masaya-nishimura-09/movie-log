import ja from "../../../src/i18n/dictionaries/ja.json";
import { fill } from "../../support/text";

const form = ja.articleForm;
const editor = ja.articleEditor;

function body() {
  return cy.get("[role=textbox]");
}

describe("記事の作成", () => {
  beforeEach(() => {
    cy.login();
  });

  it("記録の詳細から、作成画面に移る", () => {
    cy.createRecord(`E2E 記事の作成 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.location("pathname").should("match", /\/articles\/new$/);
    cy.get("h1:visible").should("have.text", form.createTitle);
    cy.get("#title").should("have.value", "");
    body().should("have.text", "");
  });

  it("タイトルと本文を入れて保存すると、記事のページに移る", () => {
    const record = `E2E 記事の保存 ${Date.now()}`;
    cy.createRecord(record);
    cy.createArticle("初めての記事", "ラストが良かった");
    cy.get("h1:visible").should("have.text", "初めての記事");
    cy.contains("p", "ラストが良かった").should("be.visible");
  });

  it("保存した記事が、記録の詳細の一覧に出る", () => {
    cy.createRecord(`E2E 記事の一覧 ${Date.now()}`);
    cy.createArticle("一覧に出る記事");
    cy.contains("header a", "E2E 記事の一覧").click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.contains("main a", "一覧に出る記事").should("be.visible");
    cy.contains(ja.recordDetail.articlesEmpty).should("not.exist");
  });

  it("同じ記録に、記事を続けて作れる", () => {
    cy.createRecord(`E2E 記事を複数 ${Date.now()}`);
    cy.createArticle("一つ目の記事");
    cy.contains("header a", "E2E 記事を複数").click();
    cy.createArticle("二つ目の記事");
    cy.contains("header a", "E2E 記事を複数").click();
    cy.contains("main a", "一つ目の記事").should("be.visible");
    cy.contains("main a", "二つ目の記事").should("be.visible");
  });

  it("ツールバーには、7つの書式のボタンがある", () => {
    cy.createRecord(`E2E ツールバー ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get(`[role=toolbar][aria-label="${editor.toolbar}"] button`).should(
      "have.length",
      7,
    );
    for (const label of [
      editor.bold,
      editor.italic,
      editor.heading,
      editor.subheading,
      editor.bulletList,
      editor.orderedList,
      editor.blockquote,
    ]) {
      cy.get(`button[aria-label="${label}"]`).should("be.visible");
    }
  });

  it("書式のボタンの状態が、カーソルの位置に合わせて変わる", () => {
    cy.createRecord(`E2E 書式の状態 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    const bold = `button[aria-label="${editor.bold}"]`;
    cy.get(bold).should("have.attr", "aria-pressed", "false");
    body().click().type("文字");
    cy.get(bold).click();
    cy.get(bold).should("have.attr", "aria-pressed", "true");
    cy.get(bold).click();
    cy.get(bold).should("have.attr", "aria-pressed", "false");
  });

  it("太字、斜体、見出し、小見出し、箇条書き、番号付き、引用を書き、記事のページに反映される", () => {
    cy.createRecord(`E2E 書式 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get("#title").type("書式の記事");

    body().click().type("見出しの行");
    cy.get(`button[aria-label="${editor.heading}"]`).click();
    body().type("{enter}小見出しの行");
    cy.get(`button[aria-label="${editor.subheading}"]`).click();
    body().type("{enter}");
    cy.get(`button[aria-label="${editor.bold}"]`).click();
    body().type("太字");
    cy.get(`button[aria-label="${editor.bold}"]`).click();
    cy.get(`button[aria-label="${editor.italic}"]`).click();
    body().type("斜体");
    cy.get(`button[aria-label="${editor.italic}"]`).click();
    body().type("{enter}箇条書きの項目");
    cy.get(`button[aria-label="${editor.bulletList}"]`).click();
    body().type("{enter}{enter}番号付きの項目");
    cy.get(`button[aria-label="${editor.orderedList}"]`).click();
    body().type("{enter}{enter}引用の行");
    cy.get(`button[aria-label="${editor.blockquote}"]`).click();

    body().within(() => {
      cy.get("h2").should("have.text", "見出しの行");
      cy.get("h3").should("have.text", "小見出しの行");
      cy.get("strong").should("have.text", "太字");
      cy.get("em").should("have.text", "斜体");
      cy.get("ul li").should("have.text", "箇条書きの項目");
      cy.get("ol li").should("have.text", "番号付きの項目");
      cy.get("blockquote").should("have.text", "引用の行");
    });

    cy.contains("button", form.save).click();
    cy.location("pathname").should("match", /\/articles\/\d+$/);
    cy.get("article").within(() => {
      cy.get("h2").should("have.text", "見出しの行");
      cy.get("h3").should("have.text", "小見出しの行");
      cy.get("strong").should("have.text", "太字");
      cy.get("em").should("have.text", "斜体");
      cy.get("ul li").should("have.text", "箇条書きの項目");
      cy.get("ol li").should("have.text", "番号付きの項目");
      cy.get("blockquote").should("have.text", "引用の行");
    });
  });

  it("タイトルの文字数を数える", () => {
    cy.createRecord(`E2E 文字数 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.contains(fill(ja.characterCount, { current: 0, max: 255 })).should(
      "be.visible",
    );
    cy.get("#title").type("あいう");
    cy.contains(fill(ja.characterCount, { current: 3, max: 255 })).should(
      "be.visible",
    );
    cy.get("#title").should("have.attr", "maxlength", "255");
  });

  it("タイトルが空のまま保存すると、エラーを表示して画面に残る", () => {
    cy.createRecord(`E2E 空のタイトル ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    body().click().type("本文だけ");
    cy.contains("button", form.save).click();
    cy.contains("[role=alert]", form.invalidInput).should("be.visible");
    cy.contains(form.errors.title).should("be.visible");
    cy.location("pathname").should("match", /\/articles\/new$/);
    body().should("contain.text", "本文だけ");
  });

  it("本文が空のまま保存すると、エラーを表示して画面に残る", () => {
    cy.createRecord(`E2E 空の本文 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get("#title").type("本文なし");
    cy.contains("button", form.save).click();
    cy.contains(form.errors.contentRequired).should("be.visible");
    cy.location("pathname").should("match", /\/articles\/new$/);
  });

  it("本文を書いてから消して保存しても、空の本文としてエラーになる", () => {
    cy.createRecord(`E2E 消した本文 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get("#title").type("消した本文");
    body().click().type("消す{selectall}{backspace}");
    cy.contains("button", form.save).click();
    cy.contains(form.errors.contentRequired).should("be.visible");
    cy.location("pathname").should("match", /\/articles\/new$/);
  });

  it("本文が長すぎると、エラーを表示して画面に残る", () => {
    cy.createRecord(`E2E 長い本文 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get("#title").type("長い記事");
    body().click();
    cy.document().then((doc) => {
      doc.execCommand("insertText", false, "a".repeat(110 * 1024));
    });
    cy.contains("button", form.save).click();
    cy.contains("[role=alert]", form.invalidInput).should("be.visible");
    cy.contains(form.errors.content).should("be.visible");
    cy.location("pathname").should("match", /\/articles\/new$/);
  });

  it("サーバーのエラーでは、保存できなかったことを表示する", () => {
    cy.createRecord(`E2E 保存の失敗 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get("#title").type("__error__");
    body().click().type("本文");
    cy.contains("button", form.save).click();
    cy.contains("[role=alert]", form.unexpectedError).should("be.visible");
    cy.location("pathname").should("match", /\/articles\/new$/);
  });

  it("やめるを押すと、保存せずに記録の詳細にもどる", () => {
    cy.createRecord(`E2E 作成をやめる ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get("#title").type("保存しない記事");
    cy.contains("a", form.cancel).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.contains(ja.recordDetail.articlesEmpty).should("be.visible");
  });

  it("上のバーの戻るで、記録の詳細にもどる", () => {
    cy.createRecord(`E2E 作成から戻る ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get(`header a[aria-label="${form.back}"]`).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
  });
});
