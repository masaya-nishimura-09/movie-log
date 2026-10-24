import ja from "../../../src/i18n/dictionaries/ja.json";
import { demoAccount } from "../../support/commands";

describe("ログイン", () => {
  it("正しいメールアドレスとパスワードでログインできる", () => {
    cy.visit("/ja/login");
    cy.get("#email").type(demoAccount.email);
    cy.get("#password").type(demoAccount.password);
    cy.contains("button", ja.login.submit).click();
    cy.location("pathname").should("eq", "/ja/home");
    cy.contains("h1", ja.home.heading).should("be.visible");
  });

  it("パスワードが違うとエラーを表示する", () => {
    cy.visit("/ja/login");
    cy.get("#email").type(demoAccount.email);
    cy.get("#password").type("wrong-password");
    cy.contains("button", ja.login.submit).click();
    cy.get("[role=alert]").should("have.text", ja.login.invalidCredentials);
    cy.location("pathname").should("eq", "/ja/login");
    cy.get("#email").should("have.value", demoAccount.email);
  });

  it("登録されていないメールアドレスではエラーを表示する", () => {
    cy.visit("/ja/login");
    cy.get("#email").type("nobody@example.com");
    cy.get("#password").type(demoAccount.password);
    cy.contains("button", ja.login.submit).click();
    cy.get("[role=alert]").should("have.text", ja.login.invalidCredentials);
  });

  it("メールアドレスとパスワードの形式が正しくないと、項目ごとにエラーを表示する", () => {
    cy.visit("/ja/login");
    cy.get("#email").type("not-an-email");
    cy.get("#password").type("short");
    cy.contains("button", ja.login.submit).click();
    cy.contains(ja.login.invalidEmail).should("be.visible");
    cy.contains(ja.login.invalidPassword).should("be.visible");
  });

  it("パスワードの表示と非表示を切り替えられる", () => {
    cy.visit("/ja/login");
    cy.get("#password")
      .type("password")
      .should("have.attr", "type", "password");
    cy.get(`button[aria-label="${ja.passwordInput.show}"]`).click();
    cy.get("#password").should("have.attr", "type", "text");
    cy.get(`button[aria-label="${ja.passwordInput.hide}"]`).click();
    cy.get("#password").should("have.attr", "type", "password");
  });

  it("新規登録の画面に移れる", () => {
    cy.visit("/ja/login");
    cy.contains("a", ja.login.toRegister).click();
    cy.location("pathname").should("eq", "/ja/register");
  });

  it("ログインしていないとログインが必要な画面からログイン画面に移る", () => {
    for (const path of [
      "/ja/records",
      "/ja/records/new",
      "/ja/records/1",
      "/ja/records/1/edit",
      "/ja/account",
    ]) {
      cy.visit(path);
      cy.location("pathname").should("eq", "/ja/login");
    }
  });
});
