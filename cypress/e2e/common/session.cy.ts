import ja from "../../../src/i18n/dictionaries/ja.json";

describe("ログインの状態", () => {
  beforeEach(() => {
    cy.login();
  });

  it("アクセストークンがなくても、リフレッシュトークンで自動的に更新する", () => {
    cy.clearCookie("access_token");
    cy.visit("/ja/records");
    cy.location("pathname").should("eq", "/ja/records");
    cy.getCookie("access_token").should("not.be.null");
  });

  it("アクセストークンの期限が切れていても、自動的に更新する", () => {
    const encode = (value: object) =>
      btoa(JSON.stringify(value))
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "");
    const expired = `${encode({ alg: "none" })}.${encode({ sub: "1", exp: 1 })}.mock`;
    cy.setCookie("access_token", expired);
    cy.visit("/ja/records");
    cy.location("pathname").should("eq", "/ja/records");
    cy.getCookie("access_token").its("value").should("not.eq", expired);
  });

  it("リフレッシュトークンが無効だと、ログイン画面に移る", () => {
    cy.clearCookie("access_token");
    cy.setCookie("refresh_token", "invalid");
    cy.visit("/ja/records");
    cy.location("pathname").should("eq", "/ja/login");
  });
});

describe("存在しないページ", () => {
  it("ログインしていると、ページが見つからないことを表示する", () => {
    cy.login();
    cy.visit("/ja/unknown-page", { failOnStatusCode: false });
    cy.contains(ja.notFound.title).should("be.visible");
  });

  it("ログインしていないと、ログイン画面に移る", () => {
    cy.visit("/ja/unknown-page", { failOnStatusCode: false });
    cy.location("pathname").should("eq", "/ja/login");
  });
});
