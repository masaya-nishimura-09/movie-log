import ja from "../../../src/i18n/dictionaries/ja.json";
import { demoAccount } from "../../support/commands";

const account = ja.account;

function loginWith(email: string, password: string) {
  cy.visit("/ja/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.contains("button", ja.login.submit).click();
}

describe("アカウント設定", () => {
  it("今の表示名とメールアドレスが入った状態で開く", () => {
    cy.login();
    cy.visit("/ja/account");
    cy.get("#username").should("have.value", "Demo User");
    cy.get("#email").should("have.value", demoAccount.email);
    cy.get("#password").should("have.value", "");
  });

  it("表示名を変えて保存すると、保存したことを表示する", () => {
    cy.register().then(({ username, password }) => {
      cy.visit("/ja/account");
      cy.get("#username").clear().type(`${username}-renamed`);
      cy.get("#password").type(password);
      cy.contains("button", account.save).click();
      cy.contains(account.saved).should("be.visible");
      cy.reload();
      cy.get("#username").should("have.value", `${username}-renamed`);
    });
  });

  it("メールアドレスとパスワードを変えると、新しい内容でログインできる", () => {
    cy.register().then(({ email, password }) => {
      const newEmail = `new-${email}`;
      const newPassword = "new-password-456";
      cy.visit("/ja/account");
      cy.get("#email").clear().type(newEmail);
      cy.get("#password").type(newPassword);
      cy.contains("button", account.save).click();
      cy.contains(account.saved).should("be.visible");

      cy.clearCookies();
      loginWith(email, password);
      cy.get("[role=alert]").should("have.text", ja.login.invalidCredentials);
      loginWith(newEmail, newPassword);
      cy.location("pathname").should("eq", "/ja/records");
    });
  });

  it("ほかの人が使っているメールアドレスには変えられない", () => {
    cy.register().then(({ password }) => {
      cy.visit("/ja/account");
      cy.get("#email").clear().type(demoAccount.email);
      cy.get("#password").type(password);
      cy.contains("button", account.save).click();
      cy.get("[role=alert]").should("have.text", account.userAlreadyExists);
    });
  });

  it("入力の形式が正しくないと、項目ごとにエラーを表示する", () => {
    cy.login();
    cy.visit("/ja/account");
    cy.get("#username").clear();
    cy.get("#email").clear().type("not-an-email");
    cy.get("#password").type("short");
    cy.contains("button", account.save).click();
    cy.contains(account.usernameError).should("be.visible");
    cy.contains(account.emailError).should("be.visible");
    cy.contains(account.passwordError).should("be.visible");
  });

  it("取り消すを押すと、入力を元に戻す", () => {
    cy.login();
    cy.visit("/ja/account");
    cy.get("#username").clear().type("変更中の名前");
    cy.contains("button", account.cancel).click();
    cy.get("#username").should("have.value", "Demo User");
  });

  it("もどるを押すと、記録の一覧に移る", () => {
    cy.login();
    cy.visit("/ja/account");
    cy.get(`a[aria-label="${account.back}"]`).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("アカウントメニューからアカウント設定を開ける", () => {
    cy.login();
    cy.visit("/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.contains("[role=menuitem]", ja.header.account).click();
    cy.location("pathname").should("eq", "/ja/account");
  });
});

describe("退会", () => {
  it("退会するとログインできなくなる", () => {
    cy.register().then(({ email, password }) => {
      cy.visit("/ja/account");
      cy.contains("button", account.withdrawAction).click();
      cy.contains("[role=alertdialog]", account.withdrawConfirmTitle)
        .contains("button", account.withdrawConfirm)
        .click();
      cy.location("pathname").should("eq", "/ja/register");
      loginWith(email, password);
      cy.get("[role=alert]").should("have.text", ja.login.invalidCredentials);
    });
  });

  it("やめるを押すと退会しない", () => {
    cy.register().then(() => {
      cy.visit("/ja/account");
      cy.contains("button", account.withdrawAction).click();
      cy.contains("button", account.withdrawCancel).click();
      cy.get("[role=alertdialog]").should("not.exist");
      cy.reload();
      cy.location("pathname").should("eq", "/ja/account");
    });
  });
});
