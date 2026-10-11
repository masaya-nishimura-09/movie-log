import ja from "../../../src/i18n/dictionaries/ja.json";

const detail = ja.recordDetail;

describe("記録の詳細", () => {
  beforeEach(() => {
    cy.login();
  });

  it("記録の内容をすべて表示する", () => {
    cy.visit("/ja/records/1");
    cy.get("h1:visible").should("have.text", "勝手にしやがれ");
    cy.get("main").within(() => {
      cy.contains("1960年").should("exist");
      cy.contains("90分").should("exist");
      cy.contains("フランス語").should("exist");
      cy.contains(
        new Intl.DisplayNames("ja", { type: "region" }).of("FR") ?? "FR",
      ).should("exist");
      cy.contains(ja.enums.platform.criterion_channel).should("exist");
      cy.contains(ja.enums.genre.drama).should("exist");
      cy.contains(ja.enums.moodTag.stylish).should("exist");
      cy.contains("ジャンプカットのテンポ").should("exist");
      cy.contains("dd", "Raoul Coutard")
        .prev("dt")
        .should("have.text", ja.enums.creditRole.cinematographer);
      cy.contains(detail.createdAt).should("exist");
      cy.contains(detail.updatedAt).should("exist");
    });
  });

  it("一覧のカードから詳細に移り、一覧にもどれる", () => {
    cy.visit("/ja/records");
    cy.get("main ul > li > a").first().click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.contains("a", detail.back).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("メモとクレジットがない記録では、追加のリンクから編集画面に移る", () => {
    cy.createRecord(`E2E 空の詳細 ${Date.now()}`);
    cy.contains(detail.memoEmpty).should("be.visible");
    cy.contains(detail.creditsEmpty).should("be.visible");
    cy.contains("a", detail.memoAdd).click();
    cy.location("pathname").should("match", /\/edit$/);
    cy.go("back");
    cy.contains("a", detail.creditsAdd).click();
    cy.location("pathname").should("match", /\/edit$/);
  });

  it("存在しない記録では、ページが見つからないことを表示する", () => {
    cy.visit("/ja/records/999999", { failOnStatusCode: false });
    cy.contains(ja.notFound.title).should("be.visible");
    cy.contains("a", ja.notFound.action).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("存在しない記録の編集画面でも、ページが見つからないことを表示する", () => {
    cy.visit("/ja/records/999999/edit", { failOnStatusCode: false });
    cy.contains(ja.notFound.title).should("be.visible");
  });
});
