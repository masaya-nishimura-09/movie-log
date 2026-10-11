import ja from "../../../src/i18n/dictionaries/ja.json";

describe("このアプリについて", () => {
  it("クレジットと TMDB の表記を表示する", () => {
    cy.visit("/ja/about");
    cy.contains(ja.about.creditsHeading).should("be.visible");
    cy.contains(ja.about.tmdbNotice).should("be.visible");
  });

  it("利用規約とプライバシーポリシーに移れる", () => {
    cy.visit("/ja/about");
    cy.contains("a", ja.register.termsLink).click();
    cy.location("pathname").should("eq", "/ja/terms");
    cy.visit("/ja/about");
    cy.contains("a", ja.register.privacyLink).click();
    cy.location("pathname").should("eq", "/ja/privacy");
  });

  it("ログインした状態で戻るを押すと、記録の一覧に移る", () => {
    cy.login();
    cy.visit("/ja/about");
    cy.contains("a", ja.about.back).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("アカウントメニューから開ける", () => {
    cy.login();
    cy.visit("/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.contains("[role=menuitem]", ja.header.about).click();
    cy.location("pathname").should("eq", "/ja/about");
  });

  it("ログイン画面と新規登録の画面から開ける", () => {
    for (const path of ["/ja/login", "/ja/register"]) {
      cy.visit(path);
      cy.contains("a", ja.about.link).click();
      cy.location("pathname").should("eq", "/ja/about");
    }
  });
});
