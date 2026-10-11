import ja from "../../../src/i18n/dictionaries/ja.json";

const form = ja.recordForm;

describe("選択肢がすべて表示される", () => {
  beforeEach(() => {
    cy.login();
  });

  it("作成フォーム：プラットフォーム、ジャンル、役割、雰囲気タグ", () => {
    cy.visit("/ja/records/new");
    for (const label of Object.values(ja.enums.platform)) {
      cy.contains("label", label).should("exist");
    }
    for (const score of ["1", "2", "3", "4", "5"]) {
      cy.get(`[role=radiogroup][aria-label="${form.score}"]`)
        .contains("label", score)
        .should("exist");
    }
    cy.fillRecordBasics("選択肢テスト", { score: 3 });
    cy.contains("button", form.next).click();
    for (const label of Object.values(ja.enums.genre)) {
      cy.contains("label", label).should("exist");
    }
    cy.get(`button[aria-label="${form.creditRole}"]`).first().click();
    for (const label of Object.values(ja.enums.creditRole)) {
      cy.contains("[role=option]", label).should("exist");
    }
    cy.get("body").type("{esc}");
    cy.get("#releaseYear").type("2000");
    cy.contains("button", form.next).click();
    for (const label of Object.values(ja.enums.moodTag)) {
      cy.contains("label", label).should("exist");
    }
  });

  it("作成フォーム：言語の選択肢", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("言語テスト", { score: 3 });
    cy.contains("button", form.next).click();
    cy.get(`button[aria-label="${form.language}"]`).click();
    const names = new Intl.DisplayNames("ja", { type: "language" });
    for (const code of [
      "ja",
      "en",
      "fr",
      "de",
      "it",
      "es",
      "pt",
      "ru",
      "ko",
      "zh",
      "hi",
      "th",
      "fa",
      "sv",
      "da",
    ]) {
      cy.contains("[role=option]", `${names.of(code)} ${code}`).should("exist");
    }
    cy.contains("[role=option]", `${form.languageUnknown} und`).should("exist");
  });

  it("絞り込み：スコア、プラットフォーム、雰囲気タグ、ジャンル、並べ替え", () => {
    cy.visit("/ja/records");
    cy.contains("main button", ja.recordFilter.score).click();
    for (const score of ["1", "2", "3", "4", "5"]) {
      cy.get("[role=dialog]").contains("a", new RegExp(`^${score}$`));
    }
    cy.get("body").type("{esc}");
    cy.contains("main button", ja.recordFilter.platform).click();
    for (const label of Object.values(ja.enums.platform)) {
      cy.get("[role=dialog]").contains("[role=radio]", label).should("exist");
    }
    cy.get("body").type("{esc}");
    cy.contains("main button", ja.recordFilter.moodTag).click();
    for (const label of Object.values(ja.enums.moodTag)) {
      cy.get("[role=dialog]").contains("a", label).should("exist");
    }
    cy.get("body").type("{esc}");
    cy.contains("main button", ja.recordFilter.genre).click();
    for (const label of Object.values(ja.enums.genre)) {
      cy.get("[role=dialog]").contains("a", label).should("exist");
    }
    cy.get("body").type("{esc}");
    cy.get(`button[aria-label="${ja.recordSort.label}"]:visible`).click();
    for (const sort of [
      ja.recordSort.watchedAtDesc,
      ja.recordSort.watchedAtAsc,
      ja.recordSort.scoreDesc,
      ja.recordSort.releaseYearDesc,
      ja.recordSort.titleAsc,
    ]) {
      cy.contains("[role=option]", sort).should("exist");
    }
  });

  it("どのプラットフォームでも絞り込める", () => {
    for (const platform of Object.keys(ja.enums.platform)) {
      cy.visit(`/ja/records?platform=${platform}`);
      cy.get(
        `button[aria-label="${ja.recordFilter.platform}: ${
          ja.enums.platform[platform as keyof typeof ja.enums.platform]
        }"]`,
      ).should("exist");
    }
  });
});
