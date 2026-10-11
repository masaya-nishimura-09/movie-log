import ja from "../../../src/i18n/dictionaries/ja.json";
import { demoAccount } from "../../support/commands";

function login(password: string) {
  cy.visit("/ja/login");
  cy.get("#email").type(demoAccount.email);
  cy.get("#password").type(password);
  cy.contains("button", ja.login.submit).click();
}

function register(username: string) {
  cy.visit("/ja/register");
  cy.get("#username").type(username);
  cy.get("#email").type(`failure-${Date.now()}@example.com`);
  cy.get("#password").type("password123");
  cy.get("input[name=agreedToTerms]").check();
  cy.contains("button", ja.register.submit).click();
}

describe("API の失敗", () => {
  it("ログイン：回数制限にかかると、その旨を表示する", () => {
    login("__too_many__");
    cy.get("[role=alert]").should("have.text", ja.login.tooManyRequests);
  });

  it("ログイン：サーバーエラーでは、ログインできなかったことを表示する", () => {
    login("__error__");
    cy.get("[role=alert]").should("have.text", ja.login.unexpectedError);
  });

  it("新規登録：回数制限にかかると、その旨を表示する", () => {
    register("__too_many__");
    cy.get("[role=alert]").should("have.text", ja.register.tooManyRequests);
  });

  it("新規登録：サーバーエラーでは、登録できなかったことを表示する", () => {
    register("__error__");
    cy.get("[role=alert]").should("have.text", ja.register.unexpectedError);
  });

  it("アカウント設定：サーバーエラーでは、保存できなかったことを表示する", () => {
    cy.register().then(({ password }) => {
      cy.visit("/ja/account");
      cy.get("#username").clear().type("__error__");
      cy.get("#password").type(password);
      cy.contains("button", ja.account.save).click();
      cy.get("[role=alert]").should("have.text", ja.account.unexpectedError);
    });
  });

  it("退会：サーバーエラーでは、退会できなかったことを表示する", () => {
    register("__withdraw_error__");
    cy.location("pathname").should("eq", "/ja/records");
    cy.visit("/ja/account");
    cy.contains("button", ja.account.withdrawAction).click();
    cy.contains("button", ja.account.withdrawConfirm).click();
    cy.contains("[role=alert]", ja.account.withdrawFailed).should("be.visible");
    cy.location("pathname").should("eq", "/ja/account");
  });
});
