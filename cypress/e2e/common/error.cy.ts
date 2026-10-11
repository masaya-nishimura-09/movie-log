import ja from "../../../src/i18n/dictionaries/ja.json";

describe("読み込みエラー", () => {
  beforeEach(() => {
    cy.login();
  });

  it("API がエラーを返すと、読み込めなかったことを表示する", () => {
    cy.visit("/ja/records?q=__error__", { failOnStatusCode: false });
    cy.contains(ja.errorPage.title).should("be.visible");
    cy.contains(ja.errorPage.description).should("be.visible");
  });

  it("もう一度読み込むを押すと、もう一度読み込む", () => {
    cy.visit("/ja/records");
    cy.get(`input[aria-label="${ja.header.searchLabel}"]:visible`).type(
      "__error__{enter}",
    );
    cy.contains(ja.errorPage.title).should("be.visible");
    cy.intercept("GET", "/ja/records*").as("reload");
    cy.contains("button", ja.errorPage.retry).click();
    cy.wait("@reload");
    cy.contains(ja.errorPage.title).should("be.visible");
  });

  it("エラーの画面からほかの画面に移れる", () => {
    cy.visit("/ja/records?q=__error__", { failOnStatusCode: false });
    cy.contains(ja.errorPage.title).should("be.visible");
    cy.get(`input[aria-label="${ja.header.searchLabel}"]:visible`)
      .clear()
      .type("勝手にしやがれ{enter}");
    cy.contains(ja.errorPage.title).should("not.exist");
    cy.get("main ul > li > a").should("have.length.at.least", 1);
  });
});
