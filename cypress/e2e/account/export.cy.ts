import { strFromU8, unzipSync } from "fflate";
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
      `${Cypress.config("downloadsFolder")}/cinelier-records-${today}.csv`,
    ).then((csv: string) => {
      const lines = csv.replace(/^﻿/, "").trimEnd().split("\r\n");
      expect(lines).to.have.length(2);
      expect(lines[0]).to.match(/^タイトル,原題,鑑賞日,/);
      expect(lines[1]).to.contain(title);
      expect(lines[1]).to.contain(ja.enums.platform.netflix);
    });
  });

  it("記事を書き出すと、記事ごとのMarkdownファイルをまとめたZIPをダウンロードする", () => {
    cy.register();
    const title = `E2E 記事の書き出し ${Date.now()}`;
    cy.createRecord(title);
    cy.createArticle("書き出す記事", "書き出す本文");
    cy.contains("header a", title).click();
    cy.createArticle("二本目の記事", "二本目の本文");
    cy.visit("/ja/account");
    cy.contains("button", account.exportArticlesAction).click();
    const today = new Date().toLocaleDateString("sv-SE");
    cy.readFile(
      `${Cypress.config("downloadsFolder")}/cinelier-articles-${today}.zip`,
      null,
    ).then((zip: Uint8Array) => {
      const files = unzipSync(new Uint8Array(zip));
      expect(Object.keys(files)).to.deep.equal([
        `${today} 書き出す記事.md`,
        `${today} 二本目の記事.md`,
      ]);
      const markdown = strFromU8(
        files[`${today} 書き出す記事.md`] ?? new Uint8Array(),
      );
      expect(markdown).to.match(/^# 書き出す記事\n\n/);
      expect(markdown).to.contain(`- ${account.exportMovie}: ${title}`);
      expect(markdown).to.contain(`- ${account.exportCreatedAt}: ${today}`);
      expect(markdown).to.contain("書き出す本文");
    });
  });
});
