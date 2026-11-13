import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";

describe("スマホの画面", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.login();
  });

  const newRecord = `a[aria-label="${ja.header.newRecord}"]`;

  it("ヘッダーに、ロゴ、検索、記録を追加、テーマ、アカウントを並べる", () => {
    cy.visit("/ja/records");
    cy.get("nav.fixed").should("not.exist");
    cy.get("header")
      .first()
      .within(() => {
        cy.get('a[href="/ja/records"]').should("be.visible");
        cy.get("a:visible, button:visible").then(($items) => {
          expect(
            [...$items].map((item) =>
              item.getAttribute("href") === "/ja/records"
                ? "logo"
                : item.getAttribute("aria-label"),
            ),
          ).to.deep.equal([
            "logo",
            ja.header.openSearch,
            ja.header.newRecord,
            ja.header.themeToggle,
            ja.header.accountMenu,
          ]);
        });
      });
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(375);
    });
  });

  it("ヘッダーの＋で記録の作成に移り、ロゴで一覧に戻る", () => {
    cy.visit("/ja/records/1");
    cy.get(newRecord).click();
    cy.location("pathname").should("eq", "/ja/records/new");
    cy.get('header a[href="/ja/records"]').first().click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("検索と絞り込みのシートの閉じるボタンを、画面の言語で読み上げる", () => {
    for (const [lang, dict, opener] of [
      ["ja", ja, ja.header.openSearch],
      ["ja", ja, ja.recordFilter.open],
      ["en", en, en.header.openSearch],
    ] as const) {
      cy.visit(`/${lang}/records`);
      cy.get(`button[aria-label="${opener}"]`).click();
      cy.get("[role=dialog] button .sr-only").should(
        "have.text",
        dict.header.close,
      );
    }
  });

  it("アカウントメニューからアカウント設定に移れる", () => {
    cy.visit("/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.contains("[role=menuitem]", ja.header.account).click();
    cy.location("pathname").should("eq", "/ja/account");
  });

  it("768px 以上では、＋のアイコンではなく、文字付きの記録を追加ボタンを出す", () => {
    cy.viewport(800, 800);
    cy.visit("/ja/records");
    cy.get(newRecord).should("not.be.visible");
    cy.contains("header a", ja.header.newRecord).should("be.visible");
  });

  it("検索のシートからタイトルで検索できる", () => {
    cy.visit("/ja/records");
    cy.get(`input[aria-label="${ja.header.searchLabel}"]:visible`).should(
      "not.exist",
    );
    cy.get(`button[aria-label="${ja.header.openSearch}"]`).click();
    cy.get(`[role=dialog] input[aria-label="${ja.header.searchLabel}"]`).type(
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
