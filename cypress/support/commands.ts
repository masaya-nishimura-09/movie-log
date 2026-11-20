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

const pageContent =
  "section[aria-label] [data-slot=page-body] > :not([aria-hidden])";

export const notebookContent =
  "main section[aria-label]:visible [data-slot=page-body] > :not([aria-hidden])";

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
      pickChoice(field: string, label: string): Chainable<void>;
      turnNotebookTo(text: string): Chainable<JQuery<HTMLElement>>;
      turnNotebookToEnd(): Chainable<void>;
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

Cypress.Commands.add("pickChoice", (field, label) => {
  cy.get(`[data-field="${field}"]:visible`).click();
  cy.contains("button[aria-pressed]:visible", label).click();
  cy.get("body").then(($body) => {
    if (
      $body.find("[data-slot=popover-content]:visible, [role=dialog]:visible")
        .length > 0
    ) {
      cy.get("body").type("{esc}");
    }
  });
});

Cypress.Commands.add(
  "fillRecordBasics",
  (title, { score = 3, platform = "netflix", lang = "ja" } = {}) => {
    const t = lang === "en" ? en : ja;
    cy.get("#title").type(title);
    cy.get(`input[name=score][value="${score}"]`).check({ force: true });
    cy.pickChoice("platform", t.enums.platform[platform]);
  },
);

Cypress.Commands.add("createRecord", (title) => {
  cy.visit("/ja/records/new");
  cy.fillRecordBasics(title, { score: 4 });
  cy.get("#releaseYear").type("2020");
  cy.contains("button:visible", ja.recordForm.next).click();
  cy.contains("button:visible", ja.recordForm.save).click();
  cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
});

Cypress.Commands.add("turnNotebookTo", (text) => {
  cy.get("[aria-live]:visible").should("not.be.empty");
  const look = (): void => {
    cy.get("main").then(($main) => {
      const shown = $main
        .find(pageContent)
        .toArray()
        .some(
          (page) =>
            page.getClientRects().length > 0 &&
            page.textContent?.includes(text),
        );
      if (shown) return;
      cy.get("[aria-live]:visible")
        .invoke("text")
        .then((before) => {
          cy.get(`button[aria-label="${ja.recordDetail.nextPage}"]:visible`)
            .should("be.enabled")
            .click();
          cy.get("[aria-live]:visible").should("not.have.text", before);
          look();
        });
    });
  };
  look();
  return cy.contains(notebookContent, text);
});

Cypress.Commands.add("turnNotebookToEnd", () => {
  const step = (): void => {
    cy.get("[aria-live]:visible")
      .invoke("text")
      .should("match", /\/ \d+$/)
      .then((label) => {
        const [shown, total] = label.split(" / ");
        const last = Number(shown?.split("–").at(-1));
        if (last >= Number(total)) return;
        cy.get(`button[aria-label="${ja.recordDetail.nextPage}"]:visible`)
          .should("be.enabled")
          .click();
        cy.get("[aria-live]:visible").should("not.have.text", label);
        step();
      });
  };
  step();
});
