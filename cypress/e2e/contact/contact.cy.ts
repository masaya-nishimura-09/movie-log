import ja from "../../../src/i18n/dictionaries/ja.json";

const contact = ja.contact;

describe("お問い合わせ", () => {
  it("送信すると、受け付けたことを表示する", () => {
    cy.visit("/ja/contact");
    cy.get("#email").type("user@example.com");
    cy.get("#message").type("E2E テストからの送信です");
    cy.contains("button", contact.submit).click();
    cy.contains(contact.successTitle).should("be.visible");
    cy.contains(contact.successText).should("be.visible");
  });

  it("内容が空だとエラーを表示する", () => {
    cy.visit("/ja/contact");
    cy.get("#email").type("user@example.com");
    cy.contains("button", contact.submit).click();
    cy.contains(contact.messageRequired).should("be.visible");
  });

  it("メールアドレスの形式が正しくないとエラーを表示する", () => {
    cy.visit("/ja/contact");
    cy.get("#email").type("not-an-email");
    cy.get("#message").type("本文");
    cy.contains("button", contact.submit).click();
    cy.contains(contact.invalidEmail).should("be.visible");
  });

  it("内容の文字数を表示し、上限を超えて入力できない", () => {
    cy.visit("/ja/contact");
    cy.get("#message").type("あいう");
    cy.contains("3 / 2000").should("be.visible");
    cy.get("#message").should("have.attr", "maxlength", "2000");
  });

  it("ログインしていなくても開ける", () => {
    cy.visit("/ja/contact");
    cy.location("pathname").should("eq", "/ja/contact");
  });

  it("アカウントメニューからお問い合わせを開ける", () => {
    cy.login();
    cy.visit("/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.contains("[role=menuitem]", ja.header.contact).click();
    cy.location("pathname").should("eq", "/ja/contact");
  });

  it("戻るを押すと、前の画面に戻る", () => {
    cy.visit("/ja/terms");
    cy.contains("a", ja.legal.contactLabel).click();
    cy.location("pathname").should("eq", "/ja/contact");
    cy.contains("a", contact.back).click();
    cy.location("pathname").should("eq", "/ja/terms");
  });

  it("直接開いたときは、戻るでトップページに移る", () => {
    cy.visit("/ja/contact");
    cy.contains("a", contact.back).click();
    cy.location("pathname").should("eq", "/ja");
  });

  it("上限を超えた内容を送ると、エラーを表示する", () => {
    cy.visit("/ja/contact");
    cy.get("#email").type("user@example.com");
    cy.get("#message").type("a");
    cy.get("#message").then(([element]) => {
      (element as HTMLTextAreaElement).value = "a".repeat(2001);
    });
    cy.contains("button", contact.submit).click();
    cy.contains(contact.messageTooLong).should("be.visible");
  });

  it("エラーになっても、入力した内容が残る", () => {
    cy.visit("/ja/contact");
    cy.get("#email").type("not-an-email");
    cy.get("#message").type("消えてほしくない本文");
    cy.contains("button", contact.submit).click();
    cy.contains(contact.invalidEmail).should("be.visible");
    cy.get("#email").should("have.value", "not-an-email");
    cy.get("#message").should("have.value", "消えてほしくない本文");
  });
});
