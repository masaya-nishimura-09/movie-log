import ja from "../../../src/i18n/dictionaries/ja.json";

describe("記録が0件のとき", () => {
  it("まだ記録がないことと、はじめての記録へのボタンを表示する", () => {
    cy.register();
    cy.visit("/ja/records");
    cy.contains(ja.emptyState.title).should("be.visible");
    cy.contains(ja.emptyState.description).should("be.visible");
    cy.contains(/件中 \d+件を表示/).should("not.exist");
    cy.get(`button[aria-label="${ja.recordSort.label}"]`).should("not.exist");
    cy.contains("a", ja.emptyState.action).click();
    cy.location("pathname").should("eq", "/ja/records/new");
  });

  it("記録を作ると、一覧に表示される", () => {
    cy.register();
    const title = `E2E 初めての記録 ${Date.now()}`;
    cy.createRecord(title);
    cy.visit("/ja/records");
    cy.contains("1件中 1件を表示").should("be.visible");
    cy.get("main ul > li > a").should("have.length", 1);
    const date = new Intl.DateTimeFormat("ja", {
      month: "numeric",
      day: "numeric",
    }).format(new Date());
    cy.get(`[aria-label="${ja.recordCard.noPoster}"]`)
      .closest("a")
      .should("contain.text", title)
      .and("contain.text", date)
      .click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get(`[aria-label="${ja.recordCard.noPoster}"]`).should("exist");
    cy.contains("h1", title).should("exist");
  });
});

describe("ほかのユーザーの記録", () => {
  it("一覧に表示されず、詳細と編集の画面も開けない", () => {
    cy.register();
    cy.visit("/ja/records");
    cy.contains(ja.emptyState.title).should("be.visible");
    cy.visit("/ja/records/1", { failOnStatusCode: false });
    cy.contains(ja.notFound.title).should("be.visible");
    cy.visit("/ja/records/1/edit", { failOnStatusCode: false });
    cy.contains(ja.notFound.title).should("be.visible");
  });
});
