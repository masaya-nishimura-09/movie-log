import ja from "../../../src/i18n/dictionaries/ja.json";

describe("スマホの画面", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.login();
  });

  const menu = `button[aria-label="${ja.header.openMenu}"]`;
  const drawer = "[role=dialog]";

  it("下のバーを出さない", () => {
    cy.visit("/ja/records");
    cy.get("nav.fixed").should("not.exist");
  });

  it("ハンバーガーで、すべての項目が並ぶメニューを開き、現在の項目を強調する", () => {
    cy.visit("/ja/records");
    cy.get(drawer).should("not.exist");
    cy.get(menu).click();
    cy.get(drawer).within(() => {
      for (const label of [
        ja.nav.home,
        ja.nav.newRecord,
        ja.nav.records,
        ja.nav.articles,
        ja.header.about,
        ja.header.contact,
      ]) {
        cy.contains("a", label).should("be.visible");
      }
      cy.get('a[aria-current="page"]')
        .should("have.length", 1)
        .and("contain.text", ja.nav.records);
    });
  });

  it("項目を押すと、そのページに移り、メニューが閉じる", () => {
    cy.visit("/ja/records");
    for (const [label, path] of [
      [ja.nav.newRecord, "/ja/records/new"],
      [ja.nav.articles, "/ja/articles"],
      [ja.nav.home, "/ja/home"],
      [ja.nav.records, "/ja/records"],
    ] as const) {
      cy.get(menu).click();
      cy.get(drawer).contains("a", label).click();
      cy.location("pathname").should("eq", path);
      cy.get(drawer).should("not.exist");
    }
  });

  it("閉じるボタンと Escape でメニューを閉じる", () => {
    cy.visit("/ja/records");
    cy.get(menu).click();
    cy.get(drawer).find("button").contains("Close").click({ force: true });
    cy.get(drawer).should("not.exist");
    cy.get(menu).click();
    cy.get("body").type("{esc}");
    cy.get(drawer).should("not.exist");
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("アカウントメニューからアカウント設定に移れる", () => {
    cy.visit("/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.contains("[role=menuitem]", ja.header.account).click();
    cy.location("pathname").should("eq", "/ja/account");
  });

  it("768px 以上では、ハンバーガーを出さない", () => {
    cy.viewport(800, 800);
    cy.visit("/ja/records");
    cy.get(menu).should("not.be.visible");
  });

  it("検索のシートからタイトルで検索できる", () => {
    cy.visit("/ja/records");
    cy.get(`input[aria-label="${ja.header.searchLabel}"]:visible`).should(
      "not.exist",
    );
    cy.get(`button[aria-label="${ja.header.openSearch}"]`).click();
    cy.get(`input[aria-label="${ja.header.searchLabel}"]:visible`).type(
      "勝手にしやがれ{enter}",
    );
    cy.location("search").should("contain", "q=");
    cy.get("main ul > li > a").should("have.length.at.least", 1);
    cy.get("main ul > li > a").each(([card]) =>
      expect(card.textContent).to.contain("勝手にしやがれ"),
    );
  });

  it("絞り込みのシートで条件を選び、結果を表示できる", () => {
    cy.visit("/ja/records");
    cy.get(`button[aria-label="${ja.recordFilter.open}"]`).click();
    cy.get("[role=dialog]").within(() => {
      cy.contains("a", /^4$/).click();
    });
    cy.location("search").should("eq", "?score=4");
    cy.get("[role=dialog]").within(() => {
      cy.contains(
        "summary",
        ja.recordFilter.showAllPlatforms.replace(
          "{count}",
          String(Object.keys(ja.enums.platform).length),
        ),
      ).click();
      cy.contains("[role=radio]", ja.enums.platform.hulu).should("be.visible");
      cy.contains("[role=radio]", ja.enums.platform.netflix).click();
    });
    cy.location("search").should("eq", "?score=4&platform=netflix");
    cy.get("[role=dialog]")
      .contains("button", /件を表示$/)
      .click();
    cy.get("[role=dialog]").should("not.exist");
    cy.get(`button[aria-label="${ja.recordFilter.open}"]`).should(
      "contain.text",
      "2",
    );
  });

  it("絞り込みのシートで並べ替えられる", () => {
    cy.visit("/ja/records");
    cy.get(`button[aria-label="${ja.recordFilter.open}"]`).click();
    cy.get(`[role=dialog] button[aria-label="${ja.recordSort.label}"]`).click();
    cy.contains("[role=option]", ja.recordSort.titleAsc).click();
    cy.location("search").should("eq", "?sort=titleAsc");
  });

  it("絞り込みのシートのすべて解除で、条件をすべて外す", () => {
    cy.visit("/ja/records?score=4&mood=stylish");
    cy.get(`button[aria-label="${ja.recordFilter.open}"]`).click();
    cy.get("[role=dialog]").contains("a", ja.recordFilter.clearAll).click();
    cy.location("search").should("eq", "");
  });

  it("記録の作成では、ステップの番号を表示する", () => {
    cy.visit("/ja/records/new");
    const progress = ja.recordForm.stepProgress
      .replace("{current}", "1")
      .replace("{total}", "3");
    cy.contains(`${progress} ・ ${ja.recordForm.stepBasics}`).should(
      "be.visible",
    );
  });

  it("詳細画面では、スマホ用の見出しを表示する", () => {
    cy.visit("/ja/records/1");
    cy.get("h1:visible").should("have.text", "勝手にしやがれ");
  });
});
