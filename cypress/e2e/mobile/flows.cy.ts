import ja from "../../../src/i18n/dictionaries/ja.json";
import { demoAccount } from "../../support/commands";

const form = ja.recordForm;

describe("スマホの画面での操作", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
  });

  it("ログインできる", () => {
    cy.visit("/ja/login");
    cy.get("#email").type(demoAccount.email);
    cy.get("#password").type(demoAccount.password);
    cy.contains("button", ja.login.submit).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("新規登録できる", () => {
    cy.register();
    cy.contains(ja.emptyState.title).should("be.visible");
  });

  it("記録を作成、編集、削除できる", () => {
    cy.login();
    const title = `E2E スマホ ${Date.now()}`;
    cy.visit("/ja/records/new");
    cy.fillRecordBasics(title, { score: 4 });
    cy.contains("button", form.next).click();
    cy.contains(
      form.stepProgress.replace("{current}", "2").replace("{total}", "3"),
    ).should("be.visible");
    cy.get("#releaseYear").type("2020");
    cy.contains("button", form.next).click();
    cy.contains("button", form.save).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("h1:visible").should("have.text", title);

    cy.get(`a[href$="/edit"]:visible`).first().click();
    cy.get("#memo").type("スマホで編集");
    cy.contains("button", form.saveChanges).click();
    cy.contains("スマホで編集").should("be.visible");

    cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
    cy.contains("button", ja.deleteRecord.confirm).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("アカウントの表示名を変更できる", () => {
    cy.register().then(({ username, password }) => {
      cy.get("nav").contains("a", ja.bottomNav.account).click();
      cy.get("#username").clear().type(`${username}-mobile`);
      cy.get("#password").type(password);
      cy.contains("button", ja.account.save).click();
      cy.contains(ja.account.saved).should("be.visible");
    });
  });

  it("お問い合わせを送信できる", () => {
    cy.visit("/ja/contact");
    cy.get("#email").type("user@example.com");
    cy.get("#message").type("スマホからの送信");
    cy.contains("button", ja.contact.submit).click();
    cy.contains(ja.contact.successTitle).should("be.visible");
  });

  it("ログアウトできる", () => {
    cy.visit("/ja/login");
    cy.get("#email").type(demoAccount.email);
    cy.get("#password").type(demoAccount.password);
    cy.contains("button", ja.login.submit).click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.contains("[role=menuitem]", ja.header.logout).click();
    cy.location("pathname").should("eq", "/ja/login");
  });
});
