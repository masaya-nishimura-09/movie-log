import ja from "../../../src/i18n/dictionaries/ja.json";

const documents = [
  { path: "/ja/terms", document: ja.legal.terms },
  { path: "/ja/privacy", document: ja.legal.privacy },
];

describe("利用規約とプライバシーポリシー", () => {
  for (const { path, document } of documents) {
    describe(document.title, () => {
      it("タイトル、最終更新日、すべての条項を表示する", () => {
        cy.visit(path);
        cy.contains("h1", document.title).should("be.visible");
        cy.contains(ja.legal.updated).should("be.visible");
        for (const section of document.sections) {
          cy.contains(section.h).should("exist");
        }
      });

      it("お問い合わせフォームに移れる", () => {
        cy.visit(path);
        cy.contains("a", ja.legal.contactLabel).click();
        cy.location("pathname").should("eq", "/ja/contact");
      });

      it("戻るを押すと、このアプリについてに移る", () => {
        cy.visit(path);
        cy.contains("a", ja.legal.back).click();
        cy.location("pathname").should("eq", "/ja/about");
      });
    });
  }
});
