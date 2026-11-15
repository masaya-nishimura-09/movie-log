import ja from "../../../src/i18n/dictionaries/ja.json";
import {
  demoAccount,
  newAccount,
  verificationToken,
} from "../../support/commands";

describe("新規登録", () => {
  it("登録すると、確認メールを送ったことと入力したアドレスを表示し、ログインした状態にはならない", () => {
    cy.registerUnverified().then((account) => {
      cy.location("pathname").should("eq", "/ja/register");
      cy.contains(account.email).should("be.visible");
      cy.contains(ja.register.sentNote).should("be.visible");
      cy.getCookie("access_token").should("be.null");
      cy.contains("a", ja.register.sentToLogin).click();
      cy.location("pathname").should("eq", "/ja/login");
    });
  });

  it("確認が済むとログインでき、登録した内容がアカウント設定に出る", () => {
    cy.register().then((account) => {
      cy.visit("/ja/account");
      cy.get("#username").should("have.value", account.username);
      cy.get("#email").should("have.value", account.email);
    });
  });

  it("登録済みのアドレスでも、新しいアドレスと同じく確認メールを送ったと表示する", () => {
    cy.visit("/ja/register");
    cy.get("#username").type("tester");
    cy.get("#email").type(demoAccount.email);
    cy.get("#password").type("password123");
    cy.get("input[name=agreedToTerms]").check();
    cy.contains("button", ja.register.submit).click();
    cy.contains("h1", ja.register.sentTitle).should("be.visible");
    cy.contains(demoAccount.email).should("be.visible");
    cy.get("[role=alert]").should("not.exist");
  });

  it("確認前に同じアドレスで登録し直すと、後の表示名とパスワードになる", () => {
    const first = newAccount("again");
    const second = {
      ...first,
      username: `${first.username}-2`,
      password: "second-pass",
    };
    cy.registerUnverified(first);
    cy.registerUnverified(second);
    cy.visit(`/ja/verify-email?token=${verificationToken(first.email)}`);
    cy.contains("button", ja.verifyEmail.submit).click();
    cy.contains("h1", ja.verifyEmail.doneTitle).should("be.visible");
    cy.login(second);
    cy.visit("/ja/account");
    cy.get("#username").should("have.value", second.username);
  });

  it("利用規約に同意しないとエラーを表示する", () => {
    cy.visit("/ja/register");
    cy.get("#username").type("tester");
    cy.get("#email").type("not-agreed@example.com");
    cy.get("#password").type("password123");
    cy.contains("button", ja.register.submit).click();
    cy.get("[role=alert]").should("have.text", ja.register.termsNotAgreed);
  });

  it("入力の形式が正しくないと、項目ごとにエラーを表示する", () => {
    cy.visit("/ja/register");
    cy.get("#email").type("not-an-email");
    cy.get("#password").type("パスワード12345");
    cy.get("input[name=agreedToTerms]").check();
    cy.contains("button", ja.register.submit).click();
    cy.contains(ja.register.usernameError).should("be.visible");
    cy.contains(ja.register.emailError).should("be.visible");
    cy.contains(ja.register.passwordError).should("be.visible");
  });

  it("表示名の文字数を表示する", () => {
    cy.visit("/ja/register");
    cy.get("#username").type("tester");
    cy.contains("6 / 100").should("be.visible");
  });

  it("利用規約とプライバシーポリシーへのリンクがある", () => {
    cy.visit("/ja/register");
    cy.contains("a", ja.register.termsLink).should(
      "have.attr",
      "href",
      "/ja/terms",
    );
    cy.contains("a", ja.register.privacyLink).should(
      "have.attr",
      "href",
      "/ja/privacy",
    );
  });

  it("ログインの画面に移れる", () => {
    cy.visit("/ja/register");
    cy.contains("a", ja.register.toLogin).click();
    cy.location("pathname").should("eq", "/ja/login");
  });

  it("登録中は、ボタンを登録中にして回転するアイコンを出し、押せなくする", () => {
    const id = `${Date.now()}`;
    cy.visit("/ja/register");
    cy.get("#username").type(`pending${id}`);
    cy.get("#email").type(`pending${id}@example.com`);
    cy.get("#password").type("password123");
    cy.get("input[name=agreedToTerms]").check();
    cy.intercept({ method: "POST", url: "/ja/register" }, (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
    });
    cy.contains("button", ja.register.submit).click();
    cy.contains("button", ja.register.submitting)
      .should("be.disabled")
      .and("have.attr", "aria-busy", "true")
      .find("[data-spinner]")
      .should("be.visible");
    cy.contains("h1", ja.register.sentTitle).should("be.visible");
  });
});
