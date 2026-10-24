import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";

const home = ja.home;

function shelf(title: string) {
  return cy.contains("main section", title);
}

describe("ホーム", () => {
  beforeEach(() => {
    cy.login();
  });

  it("見出しとページのタイトルを表示する", () => {
    cy.visit("/ja/home");
    cy.contains("h1", home.heading).should("be.visible");
    cy.title().should("eq", `${home.heading} | ${ja.metadata.title}`);
  });

  it("上のバーのロゴから、ホームに移る", () => {
    cy.visit("/ja/records");
    cy.get("header a").first().click();
    cy.location("pathname").should("eq", "/ja/home");
  });

  it("最近の記録を12本まで並べ、すべて見るで一覧に移る", () => {
    cy.visit("/ja/home");
    shelf(home.recent).within(() => {
      cy.get("li a").should("have.length.within", 1, 12);
      cy.contains("a", home.seeAll).click();
    });
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("棚の横のボタンで左右に動かせ、端ではそのボタンを押せない", () => {
    const fill = (template: string) => template.replace("{title}", home.recent);
    cy.visit("/ja/home");
    shelf(home.recent).within(() => {
      cy.get(`button[aria-label="${fill(home.shelfPrev)}"]`).should(
        "be.disabled",
      );
      cy.get(`button[aria-label="${fill(home.shelfNext)}"]`)
        .should("be.enabled")
        .click();
      cy.get("ul").its("0.scrollLeft").should("be.greaterThan", 0);
      cy.get(`button[aria-label="${fill(home.shelfPrev)}"]`)
        .should("be.enabled")
        .click();
      cy.get("ul").its("0.scrollLeft").should("eq", 0);
    });
  });

  it("スマホでは、棚の横のボタンを出さない", () => {
    cy.viewport("iphone-x");
    cy.visit("/ja/home");
    shelf(home.recent)
      .find(
        `button[aria-label="${home.shelfNext.replace("{title}", home.recent)}"]`,
      )
      .should("not.be.visible");
  });

  it("最近の記録のカードから、記録の詳細に移る", () => {
    cy.visit("/ja/home");
    shelf(home.recent).find("li a").first().click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
  });

  it("最近書いた記事を4件並べ、記事のページと記事の一覧に移れる", () => {
    cy.visit("/ja/home");
    shelf(home.recentArticles).within(() => {
      cy.get("li a").should("have.length", 4);
      cy.get("li a").first().click();
    });
    cy.location("pathname").should(
      "match",
      /^\/ja\/records\/\d+\/articles\/\d+$/,
    );
    cy.visit("/ja/home");
    shelf(home.recentArticles).contains("a", home.seeAll).click();
    cy.location("pathname").should("eq", "/ja/articles");
  });

  it("雰囲気で選ぶに、記録の多い雰囲気タグの棚を3つまで並べ、すべて見るでその絞り込みに移る", () => {
    cy.visit("/ja/home");
    shelf(home.moods).find("h3").should("have.length.within", 1, 3);
    shelf(home.moods)
      .find("section")
      .first()
      .contains("a", home.seeAll)
      .click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.location("search").should("match", /^\?mood=\w+$/);
  });

  const reminder = "main section:first-of-type";

  it("一番上に「過去の記録から」として、記録を2本、鑑賞日と一文を添えて出す", () => {
    cy.visit("/ja/home");
    cy.get(reminder).find("h2").should("have.text", home.reminderHeading);
    cy.get(reminder).within(() => {
      cy.get("a[href^='/ja/records/']")
        .should("have.length", 2)
        .each(($card) => {
          expect($card.text()).to.match(/\d{4}年\d{1,2}月\d{1,2}日に鑑賞/);
          expect($card.find("span.border-l-2")).to.have.length(1);
        });
    });
  });

  it("同じ日のうちは、開き直しても同じ記録を出す", () => {
    cy.visit("/ja/home");
    cy.get(`${reminder} a[href^='/ja/records/']`).then(($cards) => {
      const hrefs = [...$cards].map((card) => card.getAttribute("href"));
      cy.reload();
      cy.get(`${reminder} a[href^='/ja/records/']`).should(($again) => {
        expect(
          [...$again].map((card) => card.getAttribute("href")),
        ).to.deep.equal(hrefs);
      });
    });
  });

  it("ほかの気分で探すから、その雰囲気タグの絞り込みに移る", () => {
    cy.visit("/ja/home");
    cy.contains(home.otherMoods).parent().find("a").first().click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.location("search").should("match", /^\?mood=\w+$/);
  });

  it("記録がないと、棚の代わりに記録するへの案内を出す", () => {
    cy.register();
    cy.visit("/ja/home");
    cy.contains(home.emptyTitle).should("be.visible");
    cy.contains("main section", home.recent).should("not.exist");
    cy.contains("main a", ja.nav.newRecord).click();
    cy.location("pathname").should("eq", "/ja/records/new");
  });

  it("英語の画面でも表示する", () => {
    cy.visit("/en/home");
    cy.contains("h1", en.home.heading).should("be.visible");
    cy.contains("h2", en.home.recent).should("be.visible");
  });
});
