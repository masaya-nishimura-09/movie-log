import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";
import { publicPaths } from "../../../src/lib/auth/public-paths";
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

  for (const page of publicPaths) {
    it(`/ja${page} に、正規の URL と各言語の URL を書く`, () => {
      cy.visit(`/ja${page}`);
      cy.get("link[rel=canonical]")
        .should("have.length", 1)
        .and("have.attr", "href")
        .and("match", new RegExp(`/ja${page}$`));
      cy.get("link[rel=alternate][hreflang=ja]")
        .should("have.attr", "href")
        .and("match", new RegExp(`/ja${page}$`));
      cy.get("link[rel=alternate][hreflang=en]")
        .should("have.attr", "href")
        .and("match", new RegExp(`/en${page}$`));
      cy.get("link[rel=alternate][hreflang=x-default]")
        .should("have.attr", "href")
        .and("match", new RegExp(`^https?://[^/]+${page}$`));
    });
  }

  it("/en のページには、英語の URL を正規の URL として書く", () => {
    cy.visit("/en/about");
    cy.get("link[rel=canonical]")
      .should("have.attr", "href")
      .and("match", /\/en\/about$/);
  });

  it("メールから開く画面には、正規の URL と各言語の URL を書かない", () => {
    cy.visit("/ja/verify-email?token=wrong-token");
    cy.get("link[rel=alternate][hreflang]").should("not.exist");
    cy.get("link[rel=canonical]").should("not.exist");
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
