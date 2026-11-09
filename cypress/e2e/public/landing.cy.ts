import ja from "../../../src/i18n/dictionaries/ja.json";

describe("トップページ", () => {
  it("見出しと説明を表示する", () => {
    cy.visit("/ja");
    cy.contains("h1", ja.landing.headline).should("be.visible");
    cy.contains(ja.landing.lead).should("be.visible");
    for (const feature of ja.landing.features) {
      cy.contains(feature.title).should("exist");
    }
  });

  it("登録して始めるから新規登録の画面に移る", () => {
    cy.visit("/ja");
    cy.contains("a", ja.landing.start).click();
    cy.location("pathname").should("eq", "/ja/register");
  });

  it("ログインからログインの画面に移る", () => {
    cy.visit("/ja");
    cy.contains("a", ja.landing.login).click();
    cy.location("pathname").should("eq", "/ja/login");
  });

  it("フッターから各ページに移れる", () => {
    const links: [string, string][] = [
      [ja.about.link, "/ja/about"],
      [ja.register.termsLink, "/ja/terms"],
      [ja.register.privacyLink, "/ja/privacy"],
      [ja.contact.link, "/ja/contact"],
    ];
    for (const [label, path] of links) {
      cy.visit("/ja");
      cy.get("footer").contains("a", label).click();
      cy.location("pathname").should("eq", path);
    }
  });

  it("ノート、気分での絞り込み、最後の呼びかけの順に、説明を並べる", () => {
    cy.visit("/ja");
    cy.contains(ja.landing.closing).should("exist");
    cy.document().then((doc) => {
      const top = (text: string) =>
        [...doc.querySelectorAll("h2, p")]
          .find((el) => el.textContent === text)
          ?.getBoundingClientRect().top ?? 0;
      expect(top(ja.landing.note.title)).to.be.lessThan(
        top(ja.landing.recommend.title),
      );
      expect(top(ja.landing.recommend.title)).to.be.lessThan(
        top(ja.landing.closing),
      );
    });
  });

  it("ログインしていると記録の一覧に移る", () => {
    cy.login();
    cy.visit("/ja");
    cy.location("pathname").should("eq", "/ja/records");
  });
});
