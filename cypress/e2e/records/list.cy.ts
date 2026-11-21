import ja from "../../../src/i18n/dictionaries/ja.json";

const filter = ja.recordFilter;
const list = ja.recordList;
const turner = ja.recordDetail;

function cards() {
  return cy.get("main ol a:visible");
}

function cardTitle(card: HTMLElement) {
  return card.querySelector("span.truncate")?.textContent ?? "";
}

function cardYear(card: HTMLElement) {
  const meta = card.querySelector("span[class*='lg:inline']")?.textContent;
  return Number.parseInt(meta ?? "", 10) || 0;
}

function cardWatchedAt(card: HTMLElement) {
  return card.querySelector("time")?.getAttribute("datetime") ?? "";
}

function cardScore(card: HTMLElement) {
  const label = card
    .querySelector("[role=img][aria-label$='点']")
    ?.getAttribute("aria-label");
  return Number(label?.match(/(\d+)点$/)?.[1]);
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
    cy.contains(/^全\d+本$/).should("be.visible");
    cards().should("have.length", 8);
    cards().then((items) => {
      const dates = [...items].map(cardWatchedAt);
      expect(dates).to.deep.eq([...dates].sort().reverse());
    });
  });

  it("検索は、タイトルだけでなくノートの文字でも探す", () => {
    cy.visit(`/ja/records?q=${encodeURIComponent("観たきっかけ")}`);
    cards().should("have.length.at.least", 1);
    cy.contains("main ol a:visible", "勝手にしやがれ").should("exist");
  });

  it("ホームと記事の古い URL は、記録の一覧と記録の詳細に移る", () => {
    for (const [from, to] of [
      ["/ja/home", "/ja/records"],
      ["/ja/articles", "/ja/records"],
      ["/ja/records/1/articles/1", "/ja/records/1"],
      ["/ja/records/1/articles/new", "/ja/records/1"],
    ]) {
      cy.visit(from);
      cy.location("pathname").should("eq", to);
    }
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

  it("ページ送りのボタンと矢印キーで、次と前のページに移れる", () => {
    cy.visit("/ja/records");
    cy.get(`button[aria-label="${turner.prevPage}"]:visible`).should(
      "be.disabled",
    );
    cy.contains(":visible", /^1 \/ \d+$/).should("be.visible");
    cards()
      .first()
      .then(([card]) => {
        const firstTitle = cardTitle(card);
        cy.get(`a[aria-label="${turner.nextPage}"]:visible`).click();
        cy.location("search").should("eq", "?page=2");
        cy.contains(":visible", /^2 \/ \d+$/).should("be.visible");
        cards()
          .first()
          .then(([next]) => expect(cardTitle(next)).not.to.eq(firstTitle));
        cy.get(`a[aria-label="${turner.prevPage}"]:visible`).click();
        cy.location("search").should("eq", "");
        cy.get("body").type("{rightArrow}");
        cy.location("search").should("eq", "?page=2");
        cy.get("body").type("{leftArrow}");
        cy.location("search").should("eq", "");
      });
  });

  it("最後のページでは次のページに進めない", () => {
    cy.visit("/ja/records?page=999");
    cy.get(`button[aria-label="${turner.nextPage}"]:visible`).should(
      "be.disabled",
    );
  });

  it("スマホでは1ページずつで、下のボタンとスワイプでめくる", () => {
    cy.viewport(390, 844);
    cy.visit("/ja/records");
    cy.contains(":visible", /^1 \/ \d+$/).should("be.visible");
    cy.get(`a[aria-label="${turner.nextPage}"]:visible`).click();
    cy.location("search").should("eq", "?page=2");
    cy.get("main .touch-pan-y")
      .trigger("pointerdown", { pointerType: "touch", clientX: 100 })
      .trigger("pointerup", { pointerType: "touch", clientX: 300 });
    cy.location("search").should("eq", "");
  });

  it("鑑賞日の順では月ごと、スコア順では星の数ごとに章を分ける", () => {
    cy.visit("/ja/records");
    cy.contains("main h2:visible", /^\d{4}年\d{1,2}月$/).should("be.visible");
    cy.visit("/ja/records?sort=scoreDesc");
    cy.get("main h2:visible [role=img]")
      .first()
      .should("have.attr", "aria-label", "5点中5点");
  });

  it("タイトルで検索すると、一致する記録だけを表示し、条件を外せる", () => {
    cy.visit("/ja/records");
    cy.get(`input[aria-label="${ja.header.searchLabel}"]:visible`).type(
      `${title}{enter}`,
    );
    cy.location("search").should("contain", "q=");
    cards().should("have.length", 1);
    cy.contains(/^全\d+本中 1本$/).should("be.visible");
    cy.contains("main", list.filtering).should("be.visible");
    cy.get(`a[aria-label='${removeLabel(`"${title}"`)}']:visible`).click();
    cy.location("search").should("eq", "");
  });

  it("スコアで絞り込むと、そのスコアの記録だけを表示する", () => {
    cy.visit("/ja/records");
    openFilter(filter.score).contains("a", /^4$/).click();
    cy.location("search").should("eq", "?score=4");
    cards().each(([card]) => expect(cardScore(card)).to.eq(4));
    cy.contains("main button", `${filter.score}：★4`).should("be.visible");
    cy.get(
      `a[aria-label="${removeLabel(`${filter.score} 4`)}"]:visible`,
    ).click();
    cy.location("search").should("eq", "");
  });

  it("同じスコアをもう一度選ぶと、絞り込みが外れる", () => {
    cy.visit("/ja/records?score=4");
    openFilter(`${filter.score}：★4`).contains("a", /^4$/).click();
    cy.location("search").should("eq", "");
  });

  it("鑑賞方法で絞り込むと、その鑑賞方法の記録だけを表示する", () => {
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
    cy.contains(list.filtering).should("be.visible");
    cy.contains("a:visible", filter.clearAll).click();
    cy.location("search").should("eq", "?sort=titleAsc");
  });

  it("一致する記録がないと、その旨と条件の解除を表示する", () => {
    cy.visit(`/ja/records?q=${encodeURIComponent("該当しないタイトル")}`);
    cy.contains(list.noMatch).should("be.visible");
    cy.contains(list.noMatchHint).should("be.visible");
    cy.contains("a:visible", list.clearFilters).click();
    cy.location("search").should("eq", "");
    cards().should("have.length", 8);
  });

  it("URL の不正な条件は無視する", () => {
    cy.visit("/ja/records?score=9&platform=unknown&sort=unknown&page=0");
    cards().should("have.length", 8);
    cy.contains(":visible", /^1 \/ \d+$/).should("be.visible");
  });
});
