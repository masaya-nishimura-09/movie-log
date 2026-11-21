import ja from "../../../src/i18n/dictionaries/ja.json";

describe("トップページ", () => {
  it("見出しと説明を表示する", () => {
    cy.visit("/ja");
    const l = ja.landing;
    cy.contains(
      "h1",
      `${l.headlineBefore}${l.headlineLead}${l.headlineMarked}${l.headlineAfter}`,
    ).should("be.visible");
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

  it("スマホでは、ヘッダーの登録ボタンを短い文字にする", () => {
    cy.viewport(390, 844);
    cy.visit("/ja");
    cy.get("header")
      .contains("a", ja.landing.registerShort)
      .should("be.visible")
      .and("have.attr", "href", "/ja/register");
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
      [ja.legal.commerceLink, "/ja/commerce"],
      [ja.contact.link, "/ja/contact"],
    ];
    for (const [label, path] of links) {
      cy.visit("/ja");
      cy.get("footer").contains("a", label).click();
      cy.location("pathname").should("eq", path);
    }
  });

  it("目次、特長、ノート、気分での絞り込み、最後の呼びかけの順に、説明を並べる", () => {
    cy.visit("/ja");
    cy.contains(ja.landing.closingTitle).should("exist");
    cy.document().then((doc) => {
      const top = (text: string) =>
        [...doc.querySelectorAll("h2, p")]
          .find((el) => el.textContent === text)
          ?.getBoundingClientRect().top ?? 0;
      expect(top(ja.landing.contents.title)).to.be.lessThan(
        top(ja.landing.featuresTitle),
      );
      expect(top(ja.landing.featuresTitle)).to.be.lessThan(
        top(ja.landing.note.title),
      );
      expect(top(ja.landing.note.title)).to.be.lessThan(
        top(ja.landing.recommend.title),
      );
      expect(top(ja.landing.recommend.title)).to.be.lessThan(
        top(ja.landing.closingTitle),
      );
    });
  });

  it("ログインしていると記録の一覧に移る", () => {
    cy.login();
    cy.visit("/ja");
    cy.location("pathname").should("eq", "/ja/records");
  });
});
