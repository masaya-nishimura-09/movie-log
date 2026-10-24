import ja from "../../../src/i18n/dictionaries/ja.json";

describe("スマホの画面での記事の操作", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.login();
  });

  it("記事を作成、編集、削除できる", () => {
    cy.createRecord(`E2E スマホの記事 ${Date.now()}`);
    cy.createArticle("スマホの記事", "スマホで書いた本文");
    cy.get("h1:visible").should("have.text", "スマホの記事");

    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.get("#title").clear().type("スマホで直した記事");
    cy.contains("button", ja.articleForm.save).click();
    cy.get("h1:visible").should("have.text", "スマホで直した記事");

    cy.get(`button[aria-label="${ja.articleDetail.delete}"]`).click();
    cy.contains("button", ja.deleteArticle.confirm).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.contains(ja.recordDetail.articlesEmpty).should("be.visible");
  });

  it("ツールバーの7つのボタンが、画面からはみ出さず操作できる", () => {
    cy.visit("/ja/records/1/articles/new");
    cy.get("[role=toolbar] button").each(($button) => {
      cy.wrap($button).should("be.visible");
      const right = $button[0]?.getBoundingClientRect().right ?? 0;
      expect(right).to.be.at.most(Cypress.config("viewportWidth"));
    });
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(
        Cypress.config("viewportWidth"),
      );
    });
  });
});
