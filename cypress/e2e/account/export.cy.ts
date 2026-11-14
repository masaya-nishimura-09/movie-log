import { strFromU8, unzipSync } from "fflate";
import ja from "../../../src/i18n/dictionaries/ja.json";

const account = ja.account;

describe("データの書き出し", () => {
  it("記録をCSVで書き出すと、見出しと記録の行が入ったCSVをダウンロードする", () => {
    cy.register();
    const title = `E2E 書き出し ${Date.now()}`;
    cy.createRecord(title);
    cy.visit("/ja/account");
    cy.contains("h2", account.exportTitle).should("be.visible");
    cy.intercept({ method: "POST", url: "/ja/account" }, (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
    });
    cy.contains("button", account.exportAction).click();
    cy.contains("button", account.exporting)
      .should("have.attr", "aria-busy", "true")
      .find("[data-spinner]")
      .should("be.visible");
    cy.contains("button", account.exportNotesAction).should("be.disabled");
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

  it("ノートを書き出すと、ノートのある記録ごとのMarkdownファイルをまとめたZIPをダウンロードする", () => {
    cy.register();
    const title = `E2E ノートの書き出し ${Date.now()}`;
    cy.visit("/ja/records/new");
    cy.fillRecordBasics(title);
    cy.contains("button", ja.recordForm.next).click();
    cy.get("#releaseYear").type("2020");
    cy.contains("button", ja.recordForm.next).click();
    cy.get("[role=textbox]").click().type("書き出す本文");
    cy.contains("button", ja.recordForm.save).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.createRecord(`E2E ノートなし ${Date.now()}`);
    cy.visit("/ja/account");
    cy.contains("button", account.exportNotesAction).click();
    const today = new Date().toLocaleDateString("sv-SE");
    cy.readFile(
      `${Cypress.config("downloadsFolder")}/cinelier-notes-${today}.zip`,
      null,
    ).then((zip: Uint8Array) => {
      const files = unzipSync(new Uint8Array(zip));
      expect(Object.keys(files)).to.deep.equal([`${today} ${title}.md`]);
      const markdown = strFromU8(
        files[`${today} ${title}.md`] ?? new Uint8Array(),
      );
      expect(markdown).to.match(new RegExp(`^# ${title} ・ 2020年\n\n`));
      expect(markdown).to.contain(`- ${ja.recordForm.watchedAt}: ${today}`);
      expect(markdown).to.contain("書き出す本文");
    });
  });
});
