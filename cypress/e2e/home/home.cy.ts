import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";

describe("ホーム", () => {
  beforeEach(() => {
    cy.login();
  });

  it("見出しとページのタイトルを表示する", () => {
    cy.visit("/ja/home");
    cy.contains("h1", ja.home.heading).should("be.visible");
    cy.title().should("eq", `${ja.home.heading} | ${ja.metadata.title}`);
  });

  it("上のバーのロゴから、ホームに移る", () => {
    cy.visit("/ja/records");
    cy.get("header a").first().click();
    cy.location("pathname").should("eq", "/ja/home");
  });

  it("英語の画面でも表示する", () => {
    cy.visit("/en/home");
    cy.contains("h1", en.home.heading).should("be.visible");
  });
});
