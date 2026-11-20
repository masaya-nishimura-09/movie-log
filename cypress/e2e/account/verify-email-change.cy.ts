import ja from "../../../src/i18n/dictionaries/ja.json";
import {
  type Account,
  emailChangeToken,
  newAccount,
  verificationToken,
} from "../../support/commands";
import { fill } from "../../support/text";

const account = ja.account;
const t = ja.verifyEmailChange;

function section() {
  return cy
    .contains("section h2", account.emailTitle)
    .closest("section")
    .find("form");
}

function requestChange(newEmail: string, password: string) {
  cy.visit("/ja/account");
  cy.get("#email").clear().type(newEmail);
  cy.get("#emailPassword").type(password);
  section().contains("button", account.save).click();
  section()
    .find("output")
    .should("have.text", fill(account.emailChangeSent, { email: newEmail }));
}

function registerVerified(user: Account) {
  cy.registerUnverified(user);
  cy.visit(`/ja/verify-email?token=${verificationToken(user.email)}`);
  cy.contains("button", ja.verifyEmail.submit).click();
  cy.contains("h1", ja.verifyEmail.doneTitle).should("be.visible");
}

describe("メールアドレスの変更の確認", () => {
  it("確認画面を開いただけでは切り替わらない", () => {
    cy.register().then(({ email, password }) => {
      const newEmail = `open-${email}`;
      requestChange(newEmail, password);
      cy.visit(`/ja/verify-email-change?token=${emailChangeToken(newEmail)}`);
      cy.contains("h1", t.title).should("be.visible");
      cy.contains(t.description).should("be.visible");
      cy.visit("/ja/account");
      cy.get("#email").should("have.value", email);
    });
  });

  it("ログインしていなくても確認でき、ログイン画面への案内を出す", () => {
    cy.register().then(({ email, password }) => {
      const newEmail = `out-${email}`;
      requestChange(newEmail, password);
      cy.clearCookies();
      cy.visit(`/ja/verify-email-change?token=${emailChangeToken(newEmail)}`);
      cy.contains("button", t.submit).click();
      cy.contains("h1", t.doneTitle).should("be.visible");
      cy.contains(t.doneText).should("be.visible");
      cy.contains("a", t.toAccount).should("not.exist");
      cy.contains("a", t.toLogin).click();
      cy.location("pathname").should("eq", "/ja/login");
      cy.get("#email").type(newEmail);
      cy.get("#password").type(password);
      cy.contains("button", ja.login.submit).click();
      cy.location("pathname").should("eq", "/ja/records");
    });
  });

  it("使ったリンクをもう一度使うと、リンクが無効と表示する", () => {
    cy.register().then(({ email, password }) => {
      const newEmail = `twice-${email}`;
      requestChange(newEmail, password);
      const path = `/ja/verify-email-change?token=${emailChangeToken(newEmail)}`;
      cy.visit(path);
      cy.contains("button", t.submit).click();
      cy.contains("h1", t.doneTitle).should("be.visible");
      cy.visit(path);
      cy.contains("button", t.submit).click();
      cy.contains("h1", t.invalidTitle).should("be.visible");
      cy.contains(t.invalidText).should("be.visible");
      cy.contains("a", t.toAccount).should("have.attr", "href", "/ja/account");
    });
  });

  it("確認までの間にほかの人がそのアドレスを使い始めると、その旨を表示してアドレスは変えない", () => {
    cy.register().then(({ email, password }) => {
      const other = newAccount("taken");
      requestChange(other.email, password);
      registerVerified(other);
      cy.visit(
        `/ja/verify-email-change?token=${emailChangeToken(other.email)}`,
      );
      cy.contains("button", t.submit).click();
      cy.contains("h1", t.emailTakenTitle).should("be.visible");
      cy.contains(t.emailTakenText).should("be.visible");
      cy.contains("a", t.toAccount).click();
      cy.get("#email").should("have.value", email);
    });
  });

  it("トークンが違うと、ボタンを押した後にリンクが無効と表示する", () => {
    cy.visit("/ja/verify-email-change?token=wrong-token");
    cy.contains("button", t.submit).click();
    cy.contains("h1", t.invalidTitle).should("be.visible");
    cy.contains("a", t.toLogin).should("have.attr", "href", "/ja/login");
  });

  it("トークンがないと、ボタンを出さずにリンクが無効と表示する", () => {
    cy.visit("/ja/verify-email-change");
    cy.contains("h1", t.invalidTitle).should("be.visible");
    cy.contains("button", t.submit).should("not.exist");
  });

  it("確認中は、ボタンを確認中にして回転するアイコンを出し、押せなくする", () => {
    cy.register().then(({ email, password }) => {
      const newEmail = `pending-${email}`;
      requestChange(newEmail, password);
      cy.visit(`/ja/verify-email-change?token=${emailChangeToken(newEmail)}`);
      cy.intercept(
        { method: "POST", url: "/ja/verify-email-change*" },
        (req) => {
          req.on("response", (res) => {
            res.setDelay(1500);
          });
        },
      );
      cy.contains("button", t.submit).click();
      cy.contains("button", t.submitting)
        .should("be.disabled")
        .and("have.attr", "aria-busy", "true")
        .find("[data-spinner]")
        .should("be.visible");
      cy.contains("h1", t.doneTitle).should("be.visible");
    });
  });

  it("確認メールを送ったあとに保存し直して失敗すると、案内を消してエラーを出す", () => {
    cy.register().then(({ email, password }) => {
      requestChange(`again-${email}`, password);
      cy.get("#email").clear().type(`again2-${email}`);
      cy.get("#emailPassword").type("wrong-password");
      section().contains("button", account.save).click();
      section()
        .find("[role=alert]")
        .should("have.text", account.invalidCurrentPassword);
      section().find("output").should("not.exist");
    });
  });

  it("検索エンジンに載せず、リンク元を送らない", () => {
    cy.visit("/ja/verify-email-change?token=wrong-token");
    cy.get("meta[name=robots]").should("have.attr", "content", "noindex");
    cy.get("meta[name=referrer]").should("have.attr", "content", "no-referrer");
  });
});
