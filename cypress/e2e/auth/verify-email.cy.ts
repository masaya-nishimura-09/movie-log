import ja from "../../../src/i18n/dictionaries/ja.json";
import {
  type Account,
  newAccount,
  verificationToken,
} from "../../support/commands";
import { fill } from "../../support/text";

const resend = ja.resendVerification;

function loginWith({ email, password }: Pick<Account, "email" | "password">) {
  cy.visit("/ja/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.contains("button", ja.login.submit).click();
}

function cooldown(seconds: number) {
  return fill(resend.cooldown, { seconds });
}

function waitCooldown(from: number) {
  for (let seconds = from - 1; seconds > 0; seconds--) {
    cy.tick(1000);
    cy.contains("button", cooldown(seconds)).should("be.disabled");
  }
  cy.tick(1000);
}

describe("メールアドレスの確認", () => {
  it("確認画面を開いただけでは確認されず、ボタンを押すと確認が済んでログインできる", () => {
    cy.registerUnverified().then((account) => {
      cy.visit(`/ja/verify-email?token=${verificationToken(account.email)}`);
      cy.contains("h1", ja.verifyEmail.title).should("be.visible");
      cy.contains(ja.verifyEmail.description).should("be.visible");
      loginWith(account);
      cy.get("[role=alert]").should("have.text", ja.login.emailNotVerified);

      cy.visit(`/ja/verify-email?token=${verificationToken(account.email)}`);
      cy.contains("button", ja.verifyEmail.submit).click();
      cy.contains("h1", ja.verifyEmail.doneTitle).should("be.visible");
      cy.contains(ja.verifyEmail.doneText).should("be.visible");
      cy.contains("a", ja.verifyEmail.toLogin).click();
      cy.location("pathname").should("eq", "/ja/login");
      cy.get("#email").type(account.email);
      cy.get("#password").type(account.password);
      cy.contains("button", ja.login.submit).click();
      cy.location("pathname").should("eq", "/ja/records");
    });
  });

  it("確認が済んだリンクをもう一度使うと、リンクが無効と表示する", () => {
    cy.register().then((account) => {
      cy.clearCookies();
      cy.visit(`/ja/verify-email?token=${verificationToken(account.email)}`);
      cy.contains("button", ja.verifyEmail.submit).click();
      cy.contains("h1", ja.verifyEmail.invalidTitle).should("be.visible");
      cy.contains(ja.verifyEmail.invalidText).should("be.visible");
      cy.contains("a", ja.verifyEmail.toLogin).should(
        "have.attr",
        "href",
        "/ja/login",
      );
    });
  });

  it("トークンが違うと、ボタンを押した後にリンクが無効と表示する", () => {
    cy.visit("/ja/verify-email?token=wrong-token");
    cy.contains("button", ja.verifyEmail.submit).click();
    cy.contains("h1", ja.verifyEmail.invalidTitle).should("be.visible");
  });

  it("トークンがないと、ボタンを出さずにリンクが無効と表示する", () => {
    cy.visit("/ja/verify-email");
    cy.contains("h1", ja.verifyEmail.invalidTitle).should("be.visible");
    cy.contains("button", ja.verifyEmail.submit).should("not.exist");
  });

  it("確認中は、ボタンを確認中にして回転するアイコンを出し、押せなくする", () => {
    cy.registerUnverified().then((account) => {
      cy.visit(`/ja/verify-email?token=${verificationToken(account.email)}`);
      cy.intercept({ method: "POST", url: "/ja/verify-email*" }, (req) => {
        req.on("response", (res) => {
          res.setDelay(1500);
        });
      });
      cy.contains("button", ja.verifyEmail.submit).click();
      cy.contains("button", ja.verifyEmail.submitting)
        .should("be.disabled")
        .and("have.attr", "aria-busy", "true")
        .find("[data-spinner]")
        .should("be.visible");
      cy.contains("h1", ja.verifyEmail.doneTitle).should("be.visible");
    });
  });

  it("ログインしていても確認画面を開ける", () => {
    cy.login();
    cy.visit("/ja/verify-email?token=wrong-token");
    cy.location("pathname").should("eq", "/ja/verify-email");
    cy.contains("button", ja.verifyEmail.submit).should("be.visible");
  });

  it("検索エンジンに載せず、リンク元を送らない", () => {
    cy.visit("/ja/verify-email?token=wrong-token");
    cy.get("meta[name=robots]").should("have.attr", "content", "noindex");
    cy.get("meta[name=referrer]").should("have.attr", "content", "no-referrer");
  });
});

describe("確認メールの再送（登録後の画面）", () => {
  it("登録直後は60秒間押せず、過ぎると押せて、押すと再送したと表示してまた60秒押せなくなる", () => {
    cy.visit("/ja/register");
    cy.clock();
    const account = newAccount();
    cy.get("#username").type(account.username);
    cy.get("#email").type(account.email);
    cy.get("#password").type(account.password);
    cy.get("input[name=agreedToTerms]").check();
    cy.contains("button", ja.register.submit).click();
    cy.contains("button", cooldown(60)).should("be.disabled");
    waitCooldown(60);
    cy.contains("button", resend.resend).should("be.enabled").click();
    cy.get("output").contains(resend.resent).should("be.visible");
    cy.contains("button", cooldown(60)).should("be.disabled");
  });
});

describe("確認メールの再送（ログイン画面）", () => {
  it("確認前にログインすると、確認が済んでいないと表示して再送ボタンを出す", () => {
    cy.registerUnverified().then((account) => {
      loginWith(account);
      cy.get("[role=alert]").should("have.text", ja.login.emailNotVerified);
      cy.location("pathname").should("eq", "/ja/login");
      cy.contains("button", resend.resend).should("be.enabled");
    });
  });

  it("確認前でもパスワードが違うときは、パスワードの誤りを表示して再送ボタンを出さない", () => {
    cy.registerUnverified().then((account) => {
      loginWith({ email: account.email, password: "wrong-password" });
      cy.get("[role=alert]").should("have.text", ja.login.invalidCredentials);
      cy.contains("button", resend.resend).should("not.exist");
    });
  });

  it("再送すると再送したと表示し、60秒間押せなくなる。もう一度ログインしても押せないまま", () => {
    cy.registerUnverified().then((account) => {
      loginWith(account);
      cy.contains("button", resend.resend).should("be.enabled");
      cy.clock();
      cy.contains("button", resend.resend).click();
      cy.get("output").contains(resend.resent).should("be.visible");
      cy.contains("button", cooldown(60)).should("be.disabled");
      cy.contains("button", ja.login.submit).click();
      cy.get("[role=alert]").should("have.text", ja.login.emailNotVerified);
      cy.contains("button", cooldown(60)).should("be.disabled");
      waitCooldown(60);
      cy.contains("button", resend.resend).should("be.enabled");
    });
  });

  it("再送した後、別のエラーで再送ボタンが消えても、60秒たつまでは押せないまま", () => {
    cy.registerUnverified().then((account) => {
      loginWith(account);
      cy.contains("button", resend.resend).should("be.enabled");
      cy.clock();
      cy.contains("button", resend.resend).click();
      cy.contains("button", cooldown(60)).should("be.disabled");
      cy.get("#password").clear().type("wrong-password");
      cy.contains("button", ja.login.submit).click();
      cy.get("[role=alert]").should("have.text", ja.login.invalidCredentials);
      cy.contains("button", cooldown(60)).should("not.exist");
      cy.tick(5000);
      cy.get("#password").clear().type(account.password);
      cy.contains("button", ja.login.submit).click();
      cy.get("[role=alert]").should("have.text", ja.login.emailNotVerified);
      cy.contains("button", cooldown(55)).should("be.disabled");
    });
  });

  it("登録した直後に同じ画面のリンクからログイン画面に移っても、60秒たつまでは再送できない", () => {
    cy.registerUnverified().then((account) => {
      cy.contains("a", ja.register.sentToLogin).click();
      cy.location("pathname").should("eq", "/ja/login");
      cy.get("#email").type(account.email);
      cy.get("#password").type(account.password);
      cy.contains("button", ja.login.submit).click();
      cy.get("[role=alert]").should("have.text", ja.login.emailNotVerified);
      cy.contains("button", resend.resend).should("not.exist");
      cy.get("button[disabled]").contains(
        new RegExp(fill(resend.cooldown, { seconds: "\\d+" })),
      );
    });
  });

  it("再送中は、ボタンを再送中にして回転するアイコンを出し、押せなくする", () => {
    cy.registerUnverified().then((account) => {
      loginWith(account);
      cy.contains("button", resend.resend).should("be.enabled");
      cy.intercept({ method: "POST", url: "/ja/login" }, (req) => {
        req.on("response", (res) => {
          res.setDelay(1500);
        });
      });
      cy.contains("button", resend.resend).click();
      cy.contains("button", resend.resending)
        .should("be.disabled")
        .and("have.attr", "aria-busy", "true")
        .find("[data-spinner]")
        .should("be.visible");
      cy.get("output").contains(resend.resent).should("be.visible");
    });
  });

  it("回数の制限にかかると、その旨を表示する", () => {
    const account = { ...newAccount(), email: "__too_many__@example.com" };
    cy.registerUnverified(account);
    loginWith(account);
    cy.contains("button", resend.resend).click();
    cy.contains("[role=alert]", resend.tooManyRequests).should("be.visible");
    cy.contains("button", resend.resend).should("be.enabled");
  });

  it("再送に失敗すると、その旨を表示する", () => {
    const account = { ...newAccount(), email: "__error__@example.com" };
    cy.registerUnverified(account);
    loginWith(account);
    cy.contains("button", resend.resend).click();
    cy.contains("[role=alert]", resend.resendFailed).should("be.visible");
  });
});
