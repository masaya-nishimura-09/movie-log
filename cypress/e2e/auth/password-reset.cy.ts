import ja from "../../../src/i18n/dictionaries/ja.json";
import { newAccount, passwordResetToken } from "../../support/commands";
import { fill } from "../../support/text";

const forgot = ja.forgotPassword;
const resend = ja.resendPasswordReset;
const reset = ja.resetPassword;

function cooldown(seconds: number) {
  return fill(resend.cooldown, { seconds });
}

function requestReset(email: string) {
  cy.visit("/ja/forgot-password");
  cy.get("#email").type(email);
  cy.contains("button", forgot.submit).click();
  cy.contains("h1", forgot.sentTitle).should("be.visible");
}

function loginWith(email: string, password: string) {
  cy.visit("/ja/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.contains("button", ja.login.submit).click();
}

describe("パスワードの再設定の申し込み", () => {
  it("ログイン画面のリンクから申し込みの画面に移れる", () => {
    cy.visit("/ja/login");
    cy.contains("a", ja.login.forgotPassword).click();
    cy.location("pathname").should("eq", "/ja/forgot-password");
    cy.contains("h1", forgot.title).should("be.visible");
    cy.contains("a", forgot.toLogin).click();
    cy.location("pathname").should("eq", "/ja/login");
  });

  it("送るとメールを送ったことと入力したアドレスを表示し、60秒たつまで再送できない", () => {
    cy.visit("/ja/forgot-password");
    cy.clock();
    cy.get("#email").type("nobody@example.com");
    cy.contains("button", forgot.submit).click();
    cy.contains("h1", forgot.sentTitle).should("be.visible");
    cy.contains(fill(forgot.sentText, { email: "nobody@example.com" })).should(
      "be.visible",
    );
    cy.contains(forgot.sentNote).should("be.visible");
    cy.contains("button", cooldown(60)).should("be.disabled");
    for (let seconds = 59; seconds > 0; seconds--) {
      cy.tick(1000);
      cy.contains("button", cooldown(seconds)).should("be.disabled");
    }
    cy.tick(1000);
    cy.contains("button", resend.resend).should("be.enabled").click();
    cy.get("output").contains(resend.resent).should("be.visible");
    cy.contains("button", cooldown(60)).should("be.disabled");
  });

  it("確認が済んでいないアドレスでも、同じくメールを送ったと表示する", () => {
    cy.registerUnverified().then(({ email }) => {
      requestReset(email);
      cy.contains(fill(forgot.sentText, { email })).should("be.visible");
      cy.get("[role=alert]").should("not.exist");
    });
  });

  it("アドレスの形式が正しくないと、エラーを表示する", () => {
    cy.visit("/ja/forgot-password");
    cy.get("#email").type("not-an-email");
    cy.contains("button", forgot.submit).click();
    cy.contains(forgot.emailError).should("be.visible");
  });

  it("回数の制限にかかると、その旨を表示する", () => {
    cy.visit("/ja/forgot-password");
    cy.get("#email").type("__too_many__@example.com");
    cy.contains("button", forgot.submit).click();
    cy.get("[role=alert]").should("have.text", forgot.tooManyRequests);
  });

  it("送信に失敗すると、その旨を表示する", () => {
    cy.visit("/ja/forgot-password");
    cy.get("#email").type("__error__@example.com");
    cy.contains("button", forgot.submit).click();
    cy.get("[role=alert]").should("have.text", forgot.unexpectedError);
  });

  it("送信中は、ボタンを送信中にして回転するアイコンを出し、押せなくする", () => {
    cy.visit("/ja/forgot-password");
    cy.get("#email").type("nobody@example.com");
    cy.intercept({ method: "POST", url: "/ja/forgot-password" }, (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
    });
    cy.contains("button", forgot.submit).click();
    cy.contains("button", forgot.submitting)
      .should("be.disabled")
      .and("have.attr", "aria-busy", "true")
      .find("[data-spinner]")
      .should("be.visible");
    cy.contains("h1", forgot.sentTitle).should("be.visible");
  });
});

describe("パスワードの再設定", () => {
  it("メールのリンクから新しいパスワードを設定すると、新しいパスワードでだけログインできる", () => {
    cy.register().then(({ email, password }) => {
      cy.clearCookies();
      requestReset(email);
      cy.visit(`/ja/reset-password?token=${passwordResetToken(email)}`);
      cy.contains("h1", reset.title).should("be.visible");
      cy.get("#password").type("new-password-789");
      cy.contains("button", reset.submit).click();
      cy.contains("h1", reset.doneTitle).should("be.visible");
      cy.contains(reset.doneText).should("be.visible");
      cy.contains("a", reset.toLogin).click();
      cy.location("pathname").should("eq", "/ja/login");
      cy.get("#email").type(email);
      cy.get("#password").type(password);
      cy.contains("button", ja.login.submit).click();
      cy.get("[role=alert]").should("have.text", ja.login.invalidCredentials);
      loginWith(email, "new-password-789");
      cy.location("pathname").should("eq", "/ja/records");
    });
  });

  it("ログイン中のブラウザで再設定すると、このブラウザのログインも解除する", () => {
    cy.register().then(({ email }) => {
      requestReset(email);
      cy.visit(`/ja/reset-password?token=${passwordResetToken(email)}`);
      cy.get("#password").type("new-password-789");
      cy.contains("button", reset.submit).click();
      cy.contains("h1", reset.doneTitle).should("be.visible");
      cy.getCookie("access_token").should("be.null");
      cy.getCookie("refresh_token").should("be.null");
      cy.visit("/ja/records");
      cy.location("pathname").should("eq", "/ja/login");
    });
  });

  it("画面を開いただけでは変わらず、使ったリンクをもう一度使うと無効と表示する", () => {
    cy.register().then(({ email, password }) => {
      cy.clearCookies();
      requestReset(email);
      const path = `/ja/reset-password?token=${passwordResetToken(email)}`;
      cy.visit(path);
      loginWith(email, password);
      cy.location("pathname").should("eq", "/ja/records");
      cy.clearCookies();
      cy.visit(path);
      cy.get("#password").type("new-password-789");
      cy.contains("button", reset.submit).click();
      cy.contains("h1", reset.doneTitle).should("be.visible");
      cy.visit(path);
      cy.get("#password").type("another-pass-012");
      cy.contains("button", reset.submit).click();
      cy.contains("h1", reset.invalidTitle).should("be.visible");
      cy.contains(reset.invalidText).should("be.visible");
      cy.contains("a", reset.toRequest).click();
      cy.location("pathname").should("eq", "/ja/forgot-password");
    });
  });

  it("申し込まれていないトークンでは、送った後にリンクが無効と表示する", () => {
    const { email } = newAccount("noreset");
    cy.visit(`/ja/reset-password?token=${passwordResetToken(email)}`);
    cy.get("#password").type("new-password-789");
    cy.contains("button", reset.submit).click();
    cy.contains("h1", reset.invalidTitle).should("be.visible");
  });

  it("トークンがないと、入力欄を出さずにリンクが無効と表示する", () => {
    cy.visit("/ja/reset-password");
    cy.contains("h1", reset.invalidTitle).should("be.visible");
    cy.get("#password").should("not.exist");
  });

  it("新しいパスワードの形式が正しくないと、エラーを表示する", () => {
    cy.visit("/ja/reset-password?token=any-token");
    cy.get("#password").type("short");
    cy.contains("button", reset.submit).click();
    cy.contains(reset.passwordError).should("be.visible");
    cy.contains("h1", reset.title).should("be.visible");
  });

  it("変更中は、ボタンを変更中にして回転するアイコンを出し、押せなくする", () => {
    cy.visit("/ja/reset-password?token=any-token");
    cy.get("#password").type("new-password-789");
    cy.intercept({ method: "POST", url: "/ja/reset-password*" }, (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
    });
    cy.contains("button", reset.submit).click();
    cy.contains("button", reset.submitting)
      .should("be.disabled")
      .and("have.attr", "aria-busy", "true")
      .find("[data-spinner]")
      .should("be.visible");
    cy.contains("h1", reset.invalidTitle).should("be.visible");
  });

  it("検索エンジンに載せず、リンク元を送らない", () => {
    cy.visit("/ja/reset-password?token=any-token");
    cy.get("meta[name=robots]").should("have.attr", "content", "noindex");
    cy.get("meta[name=referrer]").should("have.attr", "content", "no-referrer");
    cy.visit("/ja/forgot-password");
    cy.get("meta[name=robots]").should("have.attr", "content", "noindex");
  });
});
