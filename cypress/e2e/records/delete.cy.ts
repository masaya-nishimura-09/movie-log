import ja from "../../../src/i18n/dictionaries/ja.json";
import { fill } from "../../support/text";

describe("記録の削除", () => {
  beforeEach(() => {
    cy.login();
  });

  it("確認のダイアログに、タイトルと視聴日を表示する", () => {
    const title = `E2E 削除の説明 ${Date.now()}`;
    cy.createRecord(title);
    cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
    const date = new Intl.DateTimeFormat("ja", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    cy.get("[role=alertdialog]").should(
      "contain.text",
      fill(ja.deleteRecord.description, { title, date }),
    );
  });

  it("確認して削除すると、一覧から消える", () => {
    const title = `E2E 削除 ${Date.now()}`;
    cy.createRecord(title);
    cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
    cy.contains("[role=alertdialog]", ja.deleteRecord.title)
      .contains("button", ja.deleteRecord.confirm)
      .click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.visit(`/ja/records?q=${encodeURIComponent(title)}`);
    cy.contains(ja.recordList.noMatch).should("be.visible");
  });

  it("やめるを押すと削除しない", () => {
    const title = `E2E 削除取り消し ${Date.now()}`;
    cy.createRecord(title);
    cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
    cy.contains("button", ja.deleteRecord.cancel).click();
    cy.get("[role=alertdialog]").should("not.exist");
    cy.get("h1:visible").should("have.text", title);
  });

  it("すでに削除された記録をもう一度削除しても、一覧に移る", () => {
    cy.createRecord(`E2E 二重削除 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.edit).click();
    cy.go("back");
    cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
    cy.contains("button", ja.deleteRecord.confirm).click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.go("back");
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
    cy.contains("button", ja.deleteRecord.confirm).click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.get("[role=alert]").should("not.exist");
  });

  it("削除に失敗すると、ダイアログにエラーを表示する", () => {
    cy.visit("/ja/records/new");
    cy.get("#title").type(`E2E 削除失敗 ${Date.now()}`);
    cy.get(`[role=radiogroup][aria-label="${ja.recordForm.score}"]`)
      .contains("label", "3")
      .click();
    cy.contains("label", ja.enums.platform.netflix).click();
    cy.contains("button", ja.recordForm.next).click();
    cy.get("#releaseYear").type("2000");
    cy.contains("button", ja.recordForm.next).click();
    cy.get("#memo").type("__delete_error__");
    cy.contains("button", ja.recordForm.save).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
    cy.contains("button", ja.deleteRecord.confirm).click();
    cy.get("[role=alertdialog]")
      .contains("[role=alert]", ja.deleteRecord.unexpectedError)
      .should("be.visible");
  });
});
