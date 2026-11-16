import en from "../../src/i18n/dictionaries/en.json";
import ja from "../../src/i18n/dictionaries/ja.json";

export const demoAccount = { email: "demo@example.com", password: "password" };

export type Account = { username: string; email: string; password: string };

function mockToken(prefix: string, email: string): string {
  const encoded = Cypress.Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${prefix}${encoded}`;
}

export function verificationToken(email: string): string {
  return mockToken("mock-verify-", email);
}

export function emailChangeToken(email: string): string {
  return mockToken("mock-email-change-", email);
}

export function passwordResetToken(email: string): string {
  return mockToken("mock-password-reset-", email);
}

export function newAccount(prefix = "tester"): Account {
  const id = `${Date.now()}${Cypress._.random(1000, 9999)}`;
  return {
    username: `${prefix}${id}`,
    email: `${prefix}${id}@example.com`,
    password: "password123",
  };
}

type RecordBasicsOptions = {
  score?: number;
  platform?: keyof typeof ja.enums.platform;
  lang?: "ja" | "en";
};

declare global {
  namespace Cypress {
    interface Chainable {
      login(account?: { email: string; password: string }): Chainable<void>;
      register(): Chainable<Account>;
      registerUnverified(account?: Account): Chainable<Account>;
      createRecord(title: string): Chainable<void>;
      fillRecordBasics(
        title: string,
        options?: RecordBasicsOptions,
      ): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (account = demoAccount) => {
  cy.session([account.email, account.password], () => {
    cy.visit("/ja/login");
    cy.get("#email").type(account.email);
    cy.get("#password").type(account.password, { log: false });
    cy.contains("button", ja.login.submit).click();
    cy.location("pathname").should("eq", "/ja/records");
  });
});

Cypress.Commands.add("registerUnverified", (account = newAccount()) => {
  cy.visit("/ja/register");
  cy.get("#username").type(account.username);
  cy.get("#email").type(account.email);
  cy.get("#password").type(account.password, { log: false });
  cy.get("input[name=agreedToTerms]").check();
  cy.contains("button", ja.register.submit).click();
  cy.contains("h1", ja.register.sentTitle).should("be.visible");
  return cy.wrap(account);
});

Cypress.Commands.add("register", () => {
  cy.registerUnverified().then((account) => {
    cy.visit(`/ja/verify-email?token=${verificationToken(account.email)}`);
    cy.contains("button", ja.verifyEmail.submit).click();
    cy.contains("h1", ja.verifyEmail.doneTitle).should("be.visible");
    cy.visit("/ja/login");
    cy.get("#email").type(account.email);
    cy.get("#password").type(account.password, { log: false });
    cy.contains("button", ja.login.submit).click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.wrap(account);
  });
});

Cypress.Commands.add(
  "fillRecordBasics",
  (title, { score = 3, platform = "netflix", lang = "ja" } = {}) => {
    const t = lang === "en" ? en : ja;
    cy.get("#title").type(title);
    cy.get(`[role=radiogroup][aria-label="${t.recordForm.score}"]`)
      .contains("label", String(score))
      .click();
    cy.contains("label", t.enums.platform[platform]).click();
  },
);

Cypress.Commands.add("createRecord", (title) => {
  cy.visit("/ja/records/new");
  cy.fillRecordBasics(title, { score: 4 });
  cy.contains("button", ja.recordForm.next).click();
  cy.get("#releaseYear").type("2020");
  cy.contains("button", ja.recordForm.next).click();
  cy.contains("button", ja.recordForm.save).click();
  cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
});
