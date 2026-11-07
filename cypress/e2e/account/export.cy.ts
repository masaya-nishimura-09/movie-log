import ja from "../../../src/i18n/dictionaries/ja.json";

const account = ja.account;

describe("データの書き出し", () => {
  it("鑑賞記録をCSVで書き出すと、見出しと記録の行が入ったCSVをダウンロードする", () => {
    cy.register();
    const title = `E2E 書き出し ${Date.now()}`;
    cy.createRecord(title);
    cy.visit("/ja/account");
    cy.contains("h2", account.exportTitle).should("be.visible");
    cy.contains("button", account.exportAction).click();
    const today = new Date().toLocaleDateString("sv-SE");
    cy.readFile(
      `${Cypress.config("downloadsFolder")}/cinestamp-records-${today}.csv`,
    ).then((csv: string) => {
      const lines = csv.replace(/^﻿/, "").trimEnd().split("\r\n");
      expect(lines).to.have.length(2);
      expect(lines[0]).to.match(/^タイトル,原題,鑑賞日,/);
      expect(lines[1]).to.contain(title);
      expect(lines[1]).to.contain(ja.enums.platform.netflix);
    });
  });
});
