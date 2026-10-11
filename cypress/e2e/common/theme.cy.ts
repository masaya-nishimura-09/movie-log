import ja from "../../../src/i18n/dictionaries/ja.json";

describe("テーマ", () => {
  beforeEach(() => {
    cy.login();
  });

  it("切り替えるとダークテーマになり、再読み込みしても保たれる", () => {
    cy.visit("/ja/records");
    cy.get("html").should("not.have.class", "dark");
    cy.get(`button[aria-label="${ja.header.themeToggle}"]`).click();
    cy.get("html").should("have.class", "dark");
    cy.reload();
    cy.get("html").should("have.class", "dark");
    cy.get(`button[aria-label="${ja.header.themeToggle}"]`).click();
    cy.get("html").should("not.have.class", "dark");
  });
});
