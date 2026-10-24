import ja from "../../../src/i18n/dictionaries/ja.json";
import { fill } from "../../support/text";

const article = ja.articleDetail;
const dialog = ja.deleteArticle;

describe("記事の削除", () => {
  beforeEach(() => {
    cy.login();
  });

  it("確認のダイアログに、タイトルを表示する", () => {
    cy.createRecord(`E2E 記事削除の説明 ${Date.now()}`);
    cy.createArticle("消す記事");
    cy.get(`button[aria-label="${article.delete}"]`).click();
    cy.get("[role=alertdialog]").should(
      "contain.text",
      fill(dialog.description, { title: "消す記事" }),
    );
  });

  it("確認して削除すると、記録の詳細にもどり、一覧から消える", () => {
    cy.createRecord(`E2E 記事削除 ${Date.now()}`);
    cy.createArticle("消える記事");
    cy.get(`button[aria-label="${article.delete}"]`).click();
    cy.contains("[role=alertdialog]", dialog.title)
      .contains("button", dialog.confirm)
      .click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.contains("main a", "消える記事").should("not.exist");
    cy.contains(ja.recordDetail.articlesEmpty).should("be.visible");
  });

  it("記事一覧から開いて削除すると、同じ検索の一覧にもどる", () => {
    const title = `E2E 一覧から削除 ${Date.now()}`;
    cy.createRecord(`${title} の記録`);
    cy.createArticle(title);
    cy.visit(`/ja/articles?keyword=${encodeURIComponent(title)}`);
    cy.contains("main ul > li a", title).click();
    cy.get(`button[aria-label="${article.delete}"]`).click();
    cy.contains("[role=alertdialog]", dialog.title)
      .contains("button", dialog.confirm)
      .click();
    cy.location("pathname").should("eq", "/ja/articles");
    cy.location("search").should("contain", "keyword=");
    cy.contains("main ul > li a", title).should("not.exist");
  });

  it("ほかの記事は残る", () => {
    cy.createRecord(`E2E 記事削除の残り ${Date.now()}`);
    cy.createArticle("残る記事");
    cy.contains("header a", "E2E 記事削除の残り").click();
    cy.createArticle("消す記事");
    cy.get(`button[aria-label="${article.delete}"]`).click();
    cy.contains("button", dialog.confirm).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.contains("main a", "残る記事").should("be.visible");
    cy.contains("main a", "消す記事").should("not.exist");
  });

  it("やめるを押すと削除しない", () => {
    cy.createRecord(`E2E 記事削除をやめる ${Date.now()}`);
    cy.createArticle("消さない記事");
    cy.get(`button[aria-label="${article.delete}"]`).click();
    cy.contains("button", dialog.cancel).click();
    cy.get("[role=alertdialog]").should("not.exist");
    cy.get("h1:visible").should("have.text", "消さない記事");
  });

  it("すでに削除された記事をもう一度削除しても、記録の詳細に移る", () => {
    cy.createRecord(`E2E 記事の二重削除 ${Date.now()}`);
    cy.createArticle("二重に消す記事");
    cy.get(`a[aria-label="${article.edit}"]`).click();
    cy.go("back");
    cy.get(`button[aria-label="${article.delete}"]`).click();
    cy.contains("button", dialog.confirm).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.go("back");
    cy.location("pathname").should(
      "match",
      /^\/ja\/records\/\d+\/articles\/\d+$/,
    );
    cy.get(`button[aria-label="${article.delete}"]`).click();
    cy.contains("button", dialog.confirm).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("[role=alert]").should("not.exist");
  });

  it("削除に失敗すると、ダイアログにエラーを表示する", () => {
    cy.createRecord(`E2E 記事削除の失敗 ${Date.now()}`);
    cy.createArticle("__delete_error__");
    cy.get(`button[aria-label="${article.delete}"]`).click();
    cy.contains("button", dialog.confirm).click();
    cy.get("[role=alertdialog]")
      .contains("[role=alert]", dialog.unexpectedError)
      .should("be.visible");
  });

  it("記録を削除すると、その記事も開けなくなる", () => {
    cy.createRecord(`E2E 記録と記事の削除 ${Date.now()}`);
    cy.createArticle("記録と一緒に消える記事");
    cy.location("pathname").then((articlePath) => {
      cy.contains("header a", "E2E 記録と記事の削除").click();
      cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
      cy.contains("button", ja.deleteRecord.confirm).click();
      cy.location("pathname").should("eq", "/ja/records");
      cy.visit(articlePath, { failOnStatusCode: false });
      cy.contains(ja.notFound.title).should("be.visible");
    });
  });
});
