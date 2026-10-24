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

  for (const [name, viewport] of [
    ["広い画面", [1280, 800]],
    ["スマホ", [390, 844]],
  ] as const) {
    it(`映画の情報、クレジット、メモ、記事の順に並ぶ(${name})`, () => {
      cy.viewport(viewport[0], viewport[1]);
      cy.visit("/ja/records/1");
      const top = (label: string) =>
        cy
          .contains("main h2", new RegExp(`^${label}$`))
          .then(($h) => $h[0]?.getBoundingClientRect().top ?? 0);
      cy.get("main h1:visible").then(($title) => {
        const title = $title[0]?.getBoundingClientRect().top ?? 0;
        top(detail.credits).then((credits) => {
          top(detail.memo).then((memo) => {
            top(detail.articles).then((articles) => {
              expect(title).to.be.lessThan(credits);
              expect(credits).to.be.lessThan(memo);
              expect(memo).to.be.lessThan(articles);
            });
          });
        });
      });
    });
  }

  it("一覧のカードから詳細に移り、一覧にもどれる", () => {
    cy.visit("/ja/records");
    cy.get("main ul > li > a").first().click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.contains("a", detail.back).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  describe("戻る先", () => {
    it("検索を入れた一覧から開いて戻ると、同じ検索の一覧にもどる", () => {
      cy.visit("/ja/records?q=%E5%8B%9D%E6%89%8B");
      cy.get("main ul > li > a").should("have.length.at.least", 1);
      cy.contains("main ul > li > a", "勝手にしやがれ").click();
      cy.location("pathname").should("eq", "/ja/records/1");
      cy.contains("a", detail.back).click();
      cy.location("pathname").should("eq", "/ja/records");
      cy.location("search").should("eq", "?q=%E5%8B%9D%E6%89%8B");
      cy.get("main ul > li > a").each(([card]) =>
        expect(card.textContent).to.contain("勝手にしやがれ"),
      );
    });

    it("2ページ目から開いて戻ると、2ページ目にもどる", () => {
      cy.visit("/ja/records?page=2");
      cy.get("main ul > li > a").first().click();
      cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
      cy.contains("a", detail.back).click();
      cy.location("pathname").should("eq", "/ja/records");
      cy.location("search").should("eq", "?page=2");
    });

    it("絞り込みのない一覧から開くと、住所に余計な印を付けず、戻ると一覧にもどる", () => {
      cy.visit("/ja/records");
      cy.get("main ul > li > a")
        .first()
        .should("have.attr", "href")
        .and("match", /^\/ja\/records\/\d+$/);
      cy.get("main ul > li > a").first().click();
      cy.contains("a", detail.back).click();
      cy.location("pathname").should("eq", "/ja/records");
      cy.location("search").should("eq", "");
    });

    it("戻る先に、このアプリの記録の一覧でない住所を入れても、無視して一覧にもどる", () => {
      for (const from of [
        "https://evil.example/ja/records",
        "//evil.example",
        "/ja/account",
        "/ja/articles",
        "javascript:alert(1)",
      ]) {
        cy.visit(`/ja/records/1?from=${encodeURIComponent(from)}`);
        cy.contains("a", detail.back).should(
          "have.attr",
          "href",
          "/ja/records",
        );
      }
    });
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
