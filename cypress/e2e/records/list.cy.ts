import ja from "../../../src/i18n/dictionaries/ja.json";

const filter = ja.recordFilter;
const list = ja.recordList;

function cards() {
  return cy.get("main ul > li > a");
}

function cardTitle(card: HTMLElement) {
  return card.querySelector("span[class*='line-clamp-']")?.textContent ?? "";
}

function cardYear(card: HTMLElement) {
  const meta = card.querySelector("span.truncate.min-w-0")?.textContent;
  const placeholder = card.querySelector(".bg-header > span")?.textContent;
  return Number((meta ?? placeholder ?? "").split(" · ")[0]);
}

const scorePrefix = ja.recordCard.score.replace("{score}", "");

function cardWatchedAt(card: HTMLElement) {
  return card.querySelector("time")?.getAttribute("datetime") ?? "";
}

function cardScore(card: HTMLElement) {
  const label = card
    .querySelector(`[aria-label^='${scorePrefix}']`)
    ?.getAttribute("aria-label");
  return Number(label?.replace(scorePrefix, ""));
}

function removeLabel(label: string) {
  return filter.remove.replace("{label}", label);
}

function openFilter(label: string) {
  cy.contains("main button", label).click();
  return cy.get("[role=dialog]");
}

describe("記録の一覧", () => {
  const title = `E2E 一覧 ${Date.now()}`;

  before(() => {
    cy.login();
    cy.createRecord(title);
  });

  beforeEach(() => {
    cy.login();
  });

  it("件数と、鑑賞日が新しい順の一覧を表示する", () => {
    cy.visit("/ja/records");
    cy.contains("h1", list.heading).should("be.visible");
    cy.contains(/^\d+件中 \d+件を表示$/).should("be.visible");
    cards().should("have.length", 12);
    cards().then((items) => {
      const dates = [...items].map(cardWatchedAt);
      expect(dates).to.deep.eq([...dates].sort().reverse());
    });
  });

  it("並べ替え：鑑賞日が古い順", () => {
    cy.visit("/ja/records");
    cy.get(`button[aria-label="${ja.recordSort.label}"]:visible`).click();
    cy.contains("[role=option]", ja.recordSort.watchedAtAsc).click();
    cy.location("search").should("eq", "?sort=watchedAtAsc");
    cards().then((items) => {
      const dates = [...items].map(cardWatchedAt);
      expect(dates).to.deep.eq([...dates].sort());
    });
  });

  it("並べ替え：スコアが高い順", () => {
    cy.visit("/ja/records");
    cy.get(`button[aria-label="${ja.recordSort.label}"]:visible`).click();
    cy.contains("[role=option]", ja.recordSort.scoreDesc).click();
    cy.location("search").should("eq", "?sort=scoreDesc");
    cards().then((items) => {
      const scores = [...items].map(cardScore);
      expect(scores).to.deep.eq([...scores].sort((a, b) => b - a));
    });
  });

  it("並べ替え：公開年が新しい順", () => {
    cy.visit("/ja/records");
    cy.get(`button[aria-label="${ja.recordSort.label}"]:visible`).click();
    cy.contains("[role=option]", ja.recordSort.releaseYearDesc).click();
    cy.location("search").should("eq", "?sort=releaseYearDesc");
    cards().then((items) => {
      const years = [...items].map(cardYear);
      expect(years).to.deep.eq([...years].sort((a, b) => b - a));
    });
  });

  it("並べ替え：タイトル順", () => {
    cy.visit("/ja/records");
    cy.get(`button[aria-label="${ja.recordSort.label}"]:visible`).click();
    cy.contains("[role=option]", ja.recordSort.titleAsc).click();
    cy.location("search").should("eq", "?sort=titleAsc");
    cards().then((items) => {
      const titles = [...items].map(cardTitle);
      expect(titles).to.deep.eq(
        [...titles].sort((a, b) => a.localeCompare(b, "ja")),
      );
    });
  });

  it("並べ替え：鑑賞日が新しい順に戻すと、URL から sort が消える", () => {
    cy.visit("/ja/records?sort=titleAsc");
    cy.get(`button[aria-label="${ja.recordSort.label}"]:visible`).click();
    cy.contains("[role=option]", ja.recordSort.watchedAtDesc).click();
    cy.location("search").should("eq", "");
  });

  it("ページ送りで次のページと前のページに移れる", () => {
    cy.visit("/ja/records");
    cy.get(`a[aria-label="${ja.pagination.previous}"]`).should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cards()
      .first()
      .then(([card]) => {
        const firstTitle = cardTitle(card);
        cy.get(`a[aria-label="${ja.pagination.next}"]`).click();
        cy.location("search").should("eq", "?page=2");
        cy.contains(/^2 \/ \d+$/).should("be.visible");
        cards()
          .first()
          .then(([next]) => expect(cardTitle(next)).not.to.eq(firstTitle));
        cy.get(`a[aria-label="${ja.pagination.previous}"]`).click();
        cy.location("search").should("eq", "");
        cy.contains(/^1 \/ \d+$/).should("be.visible");
      });
  });

  it("最後のページでは次のページに進めない", () => {
    cy.visit("/ja/records?page=999");
    cy.get(`a[aria-label="${ja.pagination.next}"]`).should(
      "have.attr",
      "aria-disabled",
      "true",
    );
  });

  it("タイトルで検索すると、一致する記録だけを表示し、条件を外せる", () => {
    cy.visit("/ja/records");
    cy.get(`input[aria-label="${ja.header.searchLabel}"]:visible`).type(
      `${title}{enter}`,
    );
    cy.location("search").should("contain", "q=");
    cards().should("have.length", 1);
    cy.contains("1件を表示 ・ 絞り込み 1件").should("be.visible");
    cy.get(`a[aria-label='${removeLabel(`"${title}"`)}']`).click();
    cy.location("search").should("eq", "");
  });

  it("スコアで絞り込むと、そのスコアの記録だけを表示する", () => {
    cy.visit("/ja/records");
    openFilter(filter.score).contains("a", /^4$/).click();
    cy.location("search").should("eq", "?score=4");
    cards().each(([card]) => expect(cardScore(card)).to.eq(4));
    cy.contains("main button", `${filter.score} 4`).should("be.visible");
    cy.get(`a[aria-label="${removeLabel(`${filter.score} 4`)}"]`).click();
    cy.location("search").should("eq", "");
  });

  it("同じスコアをもう一度選ぶと、絞り込みが外れる", () => {
    cy.visit("/ja/records?score=4");
    openFilter(`${filter.score} 4`).contains("a", /^4$/).click();
    cy.location("search").should("eq", "");
  });

  it("プラットフォームで絞り込むと、そのプラットフォームの記録だけを表示する", () => {
    cy.visit("/ja/records");
    openFilter(filter.platform)
      .contains("[role=radio]", ja.enums.platform.netflix)
      .click();
    cy.location("search").should("eq", "?platform=netflix");
    cy.get(
      `button[aria-label="${filter.platform}: ${ja.enums.platform.netflix}"]`,
    ).should("be.visible");
    cards().each(([card]) =>
      expect(card.textContent).to.contain(ja.enums.platform.netflix),
    );
  });

  it("雰囲気タグで絞り込むと、すべてのタグを含む記録だけを表示する", () => {
    cy.visit("/ja/records");
    openFilter(filter.moodTag).contains("a", ja.enums.moodTag.stylish).click();
    cy.location("search").should("eq", "?mood=stylish");
    cy.get("[role=dialog]").contains("a", ja.enums.moodTag.refreshing).click();
    cy.location("search").should("eq", "?mood=stylish&mood=refreshing");
    cy.contains("main button", filter.moodTag).should("contain.text", "2");
    cards().first().click();
    cy.get("main").within(() => {
      cy.contains(ja.enums.moodTag.stylish).should("exist");
      cy.contains(ja.enums.moodTag.refreshing).should("exist");
    });
  });

  it("雰囲気タグをもう一度押すと、そのタグだけ外れる", () => {
    cy.visit("/ja/records?mood=stylish&mood=refreshing");
    openFilter(filter.moodTag).contains("a", ja.enums.moodTag.stylish).click();
    cy.location("search").should("eq", "?mood=refreshing");
  });

  it("ジャンルで絞り込むと、すべてのジャンルを含む記録だけを表示する", () => {
    cy.visit("/ja/records");
    openFilter(filter.genre).contains("a", ja.enums.genre.drama).click();
    cy.location("search").should("eq", "?genre=drama");
    cy.get("[role=dialog]").contains("a", ja.enums.genre.crime).click();
    cy.location("search").should("eq", "?genre=drama&genre=crime");
    cards().first().click();
    cy.get("main").within(() => {
      cy.contains(ja.enums.genre.drama).should("exist");
      cy.contains(ja.enums.genre.crime).should("exist");
    });
  });

  it("すべて解除を押すと、並べ替えを残して条件をすべて外す", () => {
    cy.visit("/ja/records?sort=titleAsc&score=4&platform=netflix&q=E2E");
    cy.contains("絞り込み 3件").should("be.visible");
    cy.contains("a", filter.clearAll).click();
    cy.location("search").should("eq", "?sort=titleAsc");
  });

  it("一致する記録がないと、その旨と条件の解除を表示する", () => {
    cy.visit(`/ja/records?q=${encodeURIComponent("該当しないタイトル")}`);
    cy.contains(list.noMatch).should("be.visible");
    cy.contains("a", list.clearFilters).click();
    cy.location("search").should("eq", "");
    cards().should("have.length", 12);
  });

  it("URL の不正な条件は無視する", () => {
    cy.visit("/ja/records?score=9&platform=unknown&sort=unknown&page=0");
    cards().should("have.length", 12);
    cy.contains(/^1 \/ \d+$/).should("be.visible");
  });
});
