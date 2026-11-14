import ja from "../../../src/i18n/dictionaries/ja.json";
import { demoAccount } from "../../support/commands";

const account = ja.account;

function loginWith(email: string, password: string) {
  cy.visit("/ja/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.contains("button", ja.login.submit).click();
}

function section(title: string) {
  return cy.contains("form", title);
}

describe("アカウント設定", () => {
  it("今の表示名とメールアドレスが入った状態で開く", () => {
    cy.login();
    cy.visit("/ja/account");
    cy.get("#username").should("have.value", "Demo User");
    cy.get("#email").should("have.value", demoAccount.email);
    cy.get("#emailPassword").should("have.value", "");
    cy.get("#oldPassword").should("have.value", "");
    cy.get("#newPassword").should("have.value", "");
  });

  it("表示名を変えて保存すると、保存したことを表示する", () => {
    cy.register().then(({ username }) => {
      cy.visit("/ja/account");
      cy.get("#username").clear().type(`${username}-renamed`);
      section(account.usernameTitle).contains("button", account.save).click();
      cy.contains(account.saved).should("be.visible");
      cy.get("#username").should("have.value", `${username}-renamed`);
      cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
      cy.contains(`${username}-renamed`).should("be.visible");
      cy.reload();
      cy.get("#username").should("have.value", `${username}-renamed`);
    });
  });

  it("表示名が空だと、エラーを表示する", () => {
    cy.login();
    cy.visit("/ja/account");
    cy.get("#username").clear();
    section(account.usernameTitle).contains("button", account.save).click();
    cy.contains(account.usernameError).should("be.visible");
  });

  it("メールアドレスを変えると、新しいメールアドレスでログインできる", () => {
    cy.register().then(({ email, password }) => {
      const newEmail = `new-${email}`;
      cy.visit("/ja/account");
      cy.get("#email").clear().type(newEmail);
      cy.get("#emailPassword").type(password);
      section(account.emailTitle).contains("button", account.save).click();
      cy.contains(account.saved).should("be.visible");
      cy.get("#emailPassword").should("have.value", "");

      cy.clearCookies();
      loginWith(email, password);
      cy.get("[role=alert]").should("have.text", ja.login.invalidCredentials);
      loginWith(newEmail, password);
      cy.location("pathname").should("eq", "/ja/records");
    });
  });

  it("現在のパスワードが違うと、メールアドレスを変えられない", () => {
    cy.register().then(() => {
      cy.visit("/ja/account");
      cy.get("#email").clear().type("other@example.com");
      cy.get("#emailPassword").type("wrong-password");
      section(account.emailTitle).contains("button", account.save).click();
      cy.get("[role=alert]").should(
        "have.text",
        account.invalidCurrentPassword,
      );
    });
  });

  it("ほかの人が使っているメールアドレスには変えられない", () => {
    cy.register().then(({ password }) => {
      cy.visit("/ja/account");
      cy.get("#email").clear().type(demoAccount.email);
      cy.get("#emailPassword").type(password);
      section(account.emailTitle).contains("button", account.save).click();
      cy.get("[role=alert]").should("have.text", account.userAlreadyExists);
    });
  });

  it("メールアドレスの形式が正しくないと、エラーを表示する", () => {
    cy.login();
    cy.visit("/ja/account");
    cy.get("#email").clear().type("not-an-email");
    cy.get("#emailPassword").type("short");
    section(account.emailTitle).contains("button", account.save).click();
    cy.contains(account.emailError).should("be.visible");
    cy.contains(account.passwordError).should("be.visible");
  });

  it("パスワードを変えると、新しいパスワードでログインできる", () => {
    cy.register().then(({ email, password }) => {
      const newPassword = "new-password-456";
      cy.visit("/ja/account");
      cy.get("#oldPassword").type(password);
      cy.get("#newPassword").type(newPassword);
      section(account.passwordTitle).contains("button", account.save).click();
      cy.contains(account.saved).should("be.visible");
      cy.get("#oldPassword").should("have.value", "");
      cy.get("#newPassword").should("have.value", "");

      cy.clearCookies();
      loginWith(email, password);
      cy.get("[role=alert]").should("have.text", ja.login.invalidCredentials);
      loginWith(email, newPassword);
      cy.location("pathname").should("eq", "/ja/records");
    });
  });

  it("現在のパスワードが違うと、パスワードを変えられない", () => {
    cy.register().then(() => {
      cy.visit("/ja/account");
      cy.get("#oldPassword").type("wrong-password");
      cy.get("#newPassword").type("new-password-456");
      section(account.passwordTitle).contains("button", account.save).click();
      cy.get("[role=alert]").should(
        "have.text",
        account.invalidCurrentPassword,
      );
    });
  });

  it("パスワードの形式が正しくないと、項目ごとにエラーを表示する", () => {
    cy.login();
    cy.visit("/ja/account");
    cy.get("#oldPassword").type("short");
    cy.get("#newPassword").type("short");
    section(account.passwordTitle).contains("button", account.save).click();
    cy.get("[role=alert]")
      .should("have.length", 2)
      .and("contain.text", account.passwordError);
  });

  it("キャンセルを押すと、入力を元に戻す", () => {
    cy.login();
    cy.visit("/ja/account");
    cy.get("#username").clear().type("変更中の名前");
    cy.contains("button", account.cancel).click();
    cy.get("#username").should("have.value", "Demo User");
  });

  it("戻るを押すと、記録の一覧に移る", () => {
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

  it("キャンセルを押すと退会しない", () => {
    cy.register().then(() => {
      cy.visit("/ja/account");
      cy.contains("button", account.withdrawAction).click();
      cy.contains("[role=alertdialog] button", account.withdrawCancel).click();
      cy.get("[role=alertdialog]").should("not.exist");
      cy.reload();
      cy.location("pathname").should("eq", "/ja/account");
    });
  });

  it("保存中は、ボタンを保存中にして回転するアイコンを出し、押せなくする", () => {
    cy.register().then(({ username }) => {
      cy.visit("/ja/account");
      cy.get("#username").clear().type(`${username}-pending`);
      cy.intercept({ method: "POST", url: "/ja/account" }, (req) => {
        req.on("response", (res) => {
          res.setDelay(1500);
        });
      });
      section(account.usernameTitle).contains("button", account.save).click();
      section(account.usernameTitle)
        .contains("button", account.saving)
        .should("be.disabled")
        .and("have.attr", "aria-busy", "true")
        .find("[data-spinner]")
        .should("be.visible");
      cy.contains(account.saved).should("be.visible");
    });
  });

  it("退会中は、ボタンを退会処理中にして回転するアイコンを出し、ダイアログを閉じない", () => {
    cy.register().then(() => {
      cy.visit("/ja/account");
      cy.intercept({ method: "POST", url: "/ja/account" }, (req) => {
        req.on("response", (res) => {
          res.setDelay(1500);
        });
      });
      cy.contains("button", account.withdrawAction).click();
      cy.contains("[role=alertdialog] button", account.withdrawConfirm).click();
      cy.contains("[role=alertdialog] button", account.withdrawing)
        .should("be.disabled")
        .and("have.attr", "aria-busy", "true")
        .find("[data-spinner]")
        .should("be.visible");
      cy.contains("[role=alertdialog] button", account.withdrawCancel).should(
        "be.disabled",
      );
      cy.get("body").type("{esc}");
      cy.get("[role=alertdialog]").should("be.visible");
      cy.location("pathname").should("eq", "/ja/register");
    });
  });
});
