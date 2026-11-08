import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";
import { demoAccount } from "../../support/commands";

describe("言語", () => {
  const cases: [string, string][] = [
    ["ja,en;q=0.8", "/ja"],
    ["en-US,en;q=0.9", "/en"],
    ["fr-FR,ja;q=0.5", "/ja"],
    ["fr-FR", "/en"],
  ];

  for (const [acceptLanguage, path] of cases) {
    it(`Accept-Language が ${acceptLanguage} なら ${path} に移る`, () => {
      cy.visit("/", { headers: { "Accept-Language": acceptLanguage } });
      cy.location("pathname").should("eq", path);
    });
  }

  it("言語のない URL には、言語を付けて移る", () => {
    cy.visit("/about", { headers: { "Accept-Language": "ja" } });
    cy.location("pathname").should("eq", "/ja/about");
  });

  it("英語の画面でログインから記録の操作まで使える", () => {
    cy.visit("/en/login");
    cy.get("#email").type(demoAccount.email);
    cy.get("#password").type(demoAccount.password);
    cy.contains("button", en.login.submit).click();
    cy.location("pathname").should("eq", "/en/records");
    cy.contains("h1", en.recordList.heading).should("be.visible");

    const title = `E2E English ${Date.now()}`;
    cy.visit("/en/records/new");
    cy.fillRecordBasics(title, { score: 4, lang: "en" });
    cy.contains("button", en.recordForm.next).click();
    cy.get("#releaseYear").type("2020");
    cy.contains("button", en.recordForm.next).click();
    cy.contains("button", en.recordForm.save).click();
    cy.location("pathname").should("match", /^\/en\/records\/\d+$/);
    cy.get("h1:visible").should("have.text", title);
    cy.contains("a", en.recordDetail.edit).should("be.visible");
  });

  it("英語の画面では、英語のエラーを表示する", () => {
    cy.visit("/en/login");
    cy.get("#email").type(demoAccount.email);
    cy.get("#password").type("wrong-password");
    cy.contains("button", en.login.submit).click();
    cy.get("[role=alert]").should("have.text", en.login.invalidCredentials);
  });

  it("html の lang 属性が画面の言語になる", () => {
    cy.visit("/ja/login");
    cy.get("html").should("have.attr", "lang", "ja");
    cy.visit("/en/login");
    cy.get("html").should("have.attr", "lang", "en");
  });

  it("ページのタイトルが画面の言語になる", () => {
    cy.visit("/ja/about");
    cy.title().should("contain", ja.about.title);
    cy.visit("/en/about");
    cy.title().should("contain", en.about.title);
  });
});
