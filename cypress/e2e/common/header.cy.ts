import ja from "../../../src/i18n/dictionaries/ja.json";

const header = () => cy.get("header").first();

describe("ヘッダー", () => {
  beforeEach(() => {
    cy.login();
    cy.viewport(1280, 800);
  });

  it("サイドバーを出さず、ロゴ、検索欄、記録する、テーマ、アカウントを並べる", () => {
    cy.visit("/ja/records");
    cy.get("aside, nav[aria-label]").should("not.exist");
    header().within(() => {
      cy.get('a[href="/ja/records"]').should("be.visible");
      cy.get(`input[aria-label="${ja.header.searchLabel}"]`).should(
        "be.visible",
      );
      cy.contains("a", ja.header.newRecord).should("be.visible");
      cy.get(`button[aria-label="${ja.header.themeToggle}"]`).should(
        "be.visible",
      );
      cy.get(`[aria-label="${ja.header.accountMenu}"]`).should("be.visible");
    });
  });

  it("記録するで記録の作成に移り、ロゴで一覧に戻る", () => {
    cy.visit("/ja/records/1");
    header().contains("a", ja.header.newRecord).click();
    cy.location("pathname").should("eq", "/ja/records/new");
    header().find('a[href="/ja/records"]').click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("アカウントメニューに、アカウント設定、このアプリについて、お問い合わせ、ログアウトを並べる", () => {
    cy.visit("/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.get("[role=menuitem]").then(($items) => {
      expect([...$items].map((item) => item.textContent)).to.deep.equal([
        ja.header.account,
        ja.header.about,
        ja.header.contact,
        ja.header.support,
        ja.header.logout,
      ]);
    });
    cy.contains("[role=menuitem]", ja.header.account).click();
    cy.location("pathname").should("eq", "/ja/account");
  });

  it("本文の枠は、左右の余白をそろえる", () => {
    for (const width of [800, 1280, 1600]) {
      cy.viewport(width, 800);
      cy.visit("/ja/records");
      cy.get("main").should(($main) => {
        const box = $main[0]?.getBoundingClientRect();
        expect(box?.left).to.eq(width - (box?.right ?? 0));
      });
    }
  });

  it("英語の画面でも表示する", () => {
    cy.visit("/en/records");
    header().contains("a", "Log").should("be.visible");
  });
});
