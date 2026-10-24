import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";
import type { Account } from "../../support/commands";

const list = ja.articleList;
const stamp = Date.now();
const recordA = `E2E 一覧A ${stamp}`;
const recordB = `E2E 一覧B ${stamp}`;

let account: Account;

function addArticle(recordTitle: string, title: string, text: string) {
  cy.visit("/ja/records");
  cy.contains("a", recordTitle).click();
  cy.createArticle(title, text);
}

function rows() {
  return cy.get("main ul > li");
}

function titles() {
  return rows().then(($rows) =>
    [...$rows].map((row) => row.querySelector("a span.font-bold")?.textContent),
  );
}

describe("記事の一覧", () => {
  before(() => {
    cy.register().then((created) => {
      account = created;
    });
    cy.createRecord(recordA);
    cy.createArticle("Apple 音の記事", "足音と扉の音");
    addArticle(recordA, "Banana 色の記事", "赤と青の使い方");
    cy.createRecord(recordB);
    cy.createArticle("Cherry 台詞の記事", "短い台詞が良い");
  });

  beforeEach(() => {
    cy.login(account);
    cy.viewport(1280, 800);
  });

  it("サイドバーの「記事」から、一覧に移る", () => {
    cy.visit("/ja/records");
    cy.contains(
      `nav[aria-label="${ja.bottomNav.label}"] a`,
      ja.bottomNav.articles,
    ).click();
    cy.location("pathname").should("eq", "/ja/articles");
    cy.get("h1").should("have.text", list.heading);
  });

  it("ホームと同じく、見出しと「N件中 M件を表示」を出す", () => {
    cy.visit("/ja/articles");
    cy.get("h1").should("have.text", list.heading);
    cy.contains("p", "3件中 3件を表示").should("be.visible");
  });

  it("Spotifyのように、列の見出しの行と、番号つきの行で並べる", () => {
    cy.visit("/ja/articles");
    for (const label of [
      list.columnIndex,
      list.columnTitle,
      list.columnRecord,
      list.columnCreatedAt,
      list.columnUpdatedAt,
    ]) {
      cy.contains("[aria-hidden=true] span", label).should("be.visible");
    }
    rows().should("have.length", 3);
    rows().eq(0).find("a > span").first().should("have.text", "1");
    rows().eq(2).find("a > span").first().should("have.text", "3");
  });

  it("各行に、ポスター、記事のタイトル、映画のタイトル、作成日、更新日を表示する", () => {
    cy.visit("/ja/articles");
    rows()
      .first()
      .within(() => {
        cy.contains("Cherry 台詞の記事").should("be.visible");
        cy.contains(recordB).should("be.visible");
        cy.contains("2020年").should("be.visible");
        cy.get("time:visible").should("have.length", 2);
        cy.get(`svg[aria-label="${ja.recordCard.noPoster}"]`).should("exist");
      });
  });

  it("年とポスターは、記事のタイトルではなく、映画の列に並ぶ", () => {
    cy.visit("/ja/articles");
    cy.contains("[aria-hidden=true] span", list.columnRecord).then(
      ($header) => {
        const filmLeft = $header[0]?.getBoundingClientRect().left ?? 0;
        rows()
          .first()
          .within(() => {
            cy.get("span:visible")
              .filter((_, el) => el.textContent === "Cherry 台詞の記事")
              .should("have.length", 1)
              .then(($title) => {
                expect($title[0]?.getBoundingClientRect().right).to.be.lessThan(
                  filmLeft,
                );
              });
            cy.get("span:visible")
              .filter((_, el) => el.textContent === "2020年")
              .should("have.length", 1)
              .then(($year) => {
                expect($year[0]?.getBoundingClientRect().left).to.be.at.least(
                  filmLeft,
                );
              });
            cy.get("span:visible")
              .filter((_, el) => el.textContent === recordB)
              .should("have.length", 1)
              .then(($film) => {
                expect($film[0]?.getBoundingClientRect().left).to.be.at.least(
                  filmLeft,
                );
              });
            cy.get(`svg[aria-label="${ja.recordCard.noPoster}"]:visible`)
              .should("have.length", 1)
              .then(($poster) => {
                expect($poster[0]?.getBoundingClientRect().left).to.be.at.least(
                  filmLeft - 1,
                );
              });
          });
      },
    );
  });

  it("既定では、更新の新しい順に並べる", () => {
    cy.visit("/ja/articles");
    titles().should("deep.equal", [
      "Cherry 台詞の記事",
      "Banana 色の記事",
      "Apple 音の記事",
    ]);
  });

  it("並び替えの選択で、順番が変わり、URLに入る", () => {
    cy.visit("/ja/articles");
    cy.get(`button[aria-label="${list.sort.label}"]`).click();
    cy.contains("[role=option]", list.sort.titleAsc).click();
    cy.location("search").should("eq", "?sort=titleAsc");
    titles().should("deep.equal", [
      "Apple 音の記事",
      "Banana 色の記事",
      "Cherry 台詞の記事",
    ]);
  });

  it("作成日の順にも並べ替えられる", () => {
    cy.visit("/ja/articles?sort=createdAtAsc");
    titles().should("deep.equal", [
      "Apple 音の記事",
      "Banana 色の記事",
      "Cherry 台詞の記事",
    ]);
    cy.visit("/ja/articles?sort=createdAtDesc");
    titles().should("deep.equal", [
      "Cherry 台詞の記事",
      "Banana 色の記事",
      "Apple 音の記事",
    ]);
    cy.visit("/ja/articles?sort=updatedAtAsc");
    titles().should("deep.equal", [
      "Apple 音の記事",
      "Banana 色の記事",
      "Cherry 台詞の記事",
    ]);
  });

  it("タイトルで検索できる", () => {
    cy.visit("/ja/articles");
    cy.get(`input[aria-label="${list.searchLabel}"]`).type("Banana{enter}");
    cy.location("search").should("eq", "?keyword=Banana");
    titles().should("deep.equal", ["Banana 色の記事"]);
    cy.contains("p", "3件中 1件を表示 ・ 絞り込み 1件").should("be.visible");
    cy.contains("a", '"Banana"').should("be.visible");
  });

  it("記事の検索のキーワードは、上のバーの鑑賞記録の検索欄には入らない", () => {
    cy.visit("/ja/articles");
    cy.get(`input[aria-label="${list.searchLabel}"]`).type("Banana{enter}");
    cy.location("search").should("eq", "?keyword=Banana");
    cy.get(`header input[aria-label="${ja.header.searchLabel}"]`).should(
      "have.value",
      "",
    );
    cy.get(`input[aria-label="${list.searchLabel}"]`).should(
      "have.value",
      "Banana",
    );
  });

  it("本文でも検索できる", () => {
    cy.visit("/ja/articles");
    cy.get(`input[aria-label="${list.searchLabel}"]`).type("赤と青{enter}");
    titles().should("deep.equal", ["Banana 色の記事"]);
    cy.get(`input[aria-label="${list.searchLabel}"]`)
      .clear()
      .type("扉の音{enter}");
    titles().should("deep.equal", ["Apple 音の記事"]);
  });

  it("映画で絞り込める", () => {
    cy.visit("/ja/articles");
    cy.contains("button", list.record).click();
    cy.contains("[role=radio]", recordA).click();
    cy.location("search").should("match", /^\?record=\d+$/);
    titles().should("deep.equal", ["Banana 色の記事", "Apple 音の記事"]);
    cy.contains("p", "3件中 2件を表示 ・ 絞り込み 1件").should("be.visible");
    cy.contains("a", recordA).should("be.visible");
  });

  it("絞り込みの選択をもう一度押すと、解除できる", () => {
    cy.visit("/ja/articles");
    cy.contains("button", list.record).click();
    cy.contains("[role=radio]", recordA).click();
    titles().should("have.length", 2);
    cy.contains("[role=radio]", recordA).click();
    titles().should("have.length", 3);
    cy.location("search").should("eq", "");
  });

  it("映画と検索を組み合わせられ、検索しても映画の絞り込みと並び替えが残る", () => {
    cy.visit("/ja/articles?sort=createdAtAsc");
    cy.contains("button", list.record).click();
    cy.contains("[role=radio]", recordA).click();
    cy.get(`input[aria-label="${list.searchLabel}"]`).type("音{enter}");
    cy.location("search").should("match", /sort=createdAtAsc/);
    cy.location("search").should("match", /record=\d+/);
    cy.location("search").should("match", /keyword=/);
    titles().should("deep.equal", ["Apple 音の記事"]);
    cy.contains("p", "3件中 1件を表示 ・ 絞り込み 2件").should("be.visible");
  });

  it("絞り込みの印を1つずつ外せ、すべて解除もできる", () => {
    cy.visit("/ja/articles");
    cy.contains("button", list.record).click();
    cy.contains("[role=radio]", recordA).click();
    cy.get(`input[aria-label="${list.searchLabel}"]`).type("音{enter}");
    titles().should("have.length", 1);
    cy.get(`a[aria-label='${list.remove.replace("{label}", '"音"')}']`).click();
    titles().should("have.length", 2);
    cy.get(
      `a[aria-label="${list.remove.replace("{label}", recordA)}"]`,
    ).click();
    titles().should("have.length", 3);
    cy.get(`input[aria-label="${list.searchLabel}"]`).type("音{enter}");
    cy.contains("a", list.clearAll).click();
    titles().should("have.length", 3);
    cy.location("search").should("eq", "");
  });

  it("条件に合う記事がないときは、その旨と、条件を解除するリンクを出す", () => {
    cy.visit("/ja/articles?keyword=zzzzzz");
    cy.contains(list.noMatch).should("be.visible");
    cy.get("main ul").should("not.exist");
    cy.contains("a", list.clearFilters).click();
    cy.location("search").should("eq", "");
    rows().should("have.length", 3);
  });

  it("不正な条件は、既定に戻して表示する", () => {
    cy.visit("/ja/articles?sort=scoreDesc&page=-1&record=abc");
    rows().should("have.length", 3);
    cy.contains("p", "3件中 3件を表示").should("be.visible");
  });

  it("行を押すと、その記事に移る", () => {
    cy.visit("/ja/articles");
    cy.contains("main ul > li a", "Banana 色の記事").click();
    cy.location("pathname").should(
      "match",
      /^\/ja\/records\/\d+\/articles\/\d+$/,
    );
    cy.get("article h1").should("have.text", "Banana 色の記事");
  });

  it("記事を開いて戻ると、検索と並び替えを入れたままの一覧にもどる", () => {
    cy.visit("/ja/articles?sort=titleAsc&keyword=%E9%9F%B3");
    titles().should("deep.equal", ["Apple 音の記事"]);
    cy.contains("main ul > li a", "Apple 音の記事").click();
    cy.location("pathname").should("match", /\/articles\/\d+$/);
    cy.get("main header a")
      .first()
      .should("contain.text", ja.articleDetail.backToList);
    cy.contains("header a", ja.articleDetail.backToList).click();
    cy.location("pathname").should("eq", "/ja/articles");
    cy.location("search").then((search) => {
      const params = new URLSearchParams(search);
      expect(params.get("sort")).to.eq("titleAsc");
      expect(params.get("keyword")).to.eq("音");
      expect([...params.keys()]).to.have.length(2);
    });
    titles().should("deep.equal", ["Apple 音の記事"]);
    cy.get(`input[aria-label="${list.searchLabel}"]`).should(
      "have.value",
      "音",
    );
  });

  it("絞り込まない一覧からでも、戻ると一覧にもどる(映画の詳細ではなく)", () => {
    cy.visit("/ja/articles");
    cy.contains("main ul > li a", "Cherry 台詞の記事").click();
    cy.contains("header a", ja.articleDetail.backToList).click();
    cy.location("pathname").should("eq", "/ja/articles");
    cy.location("search").should("eq", "");
  });

  it("映画の詳細から開いた記事では、戻ると映画の詳細にもどる", () => {
    cy.visit("/ja/records");
    cy.contains("a", recordA).click();
    cy.contains("main a", "Banana 色の記事").click();
    cy.contains("header a", ja.articleDetail.backToList).should("not.exist");
    cy.get("main header a").first().click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
  });

  it("戻る先に、このアプリの記事の一覧でない住所を入れても、無視して映画の詳細にもどる", () => {
    cy.visit("/ja/articles");
    cy.contains("main ul > li a", "Banana 色の記事").then(($a) => {
      const path = new URL($a.prop("href")).pathname;
      for (const from of [
        "https://evil.example/ja/articles",
        "//evil.example",
        "/ja/account",
        "/ja/records",
        "javascript:alert(1)",
      ]) {
        cy.visit(`${path}?from=${encodeURIComponent(from)}`);
        cy.get("article h1").should("have.text", "Banana 色の記事");
        cy.contains("header a", ja.articleDetail.backToList).should(
          "not.exist",
        );
        cy.get("main header a")
          .first()
          .should("have.attr", "href")
          .and("match", /^\/ja\/records\/\d+$/);
      }
    });
  });

  it("英語の画面では、見出し、列、並び替えが英語になる", () => {
    cy.visit("/en/articles");
    cy.get("h1").should("have.text", en.articleList.heading);
    cy.contains(
      "[aria-hidden=true] span",
      en.articleList.columnUpdatedAt,
    ).should("be.visible");
    cy.contains("p", "Showing 3 of 3").should("be.visible");
    cy.get(`button[aria-label="${en.articleList.sort.label}"]`).should(
      "be.visible",
    );
  });
});

describe("記事の一覧(記事がない・変化する)", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("記事のない人には、案内と、鑑賞記録へのリンクだけを出し、絞り込みは出さない", () => {
    cy.register();
    cy.visit("/ja/articles");
    cy.contains(list.emptyTitle).should("be.visible");
    cy.contains(list.emptyDescription).should("be.visible");
    cy.get("main ul").should("not.exist");
    cy.get(`input[aria-label="${list.searchLabel}"]`).should("not.exist");
    cy.contains("a", list.emptyAction).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("書いた記事が先頭に出て、編集すると先頭に来て、削除すると消える", () => {
    cy.register();
    const record = `E2E 一覧の変化 ${Date.now()}`;
    cy.createRecord(record);
    cy.createArticle("古い記事", "本文");
    addArticle(record, "新しい記事", "本文");
    cy.visit("/ja/articles");
    titles().should("deep.equal", ["新しい記事", "古い記事"]);

    cy.contains("main ul > li a", "古い記事").click();
    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.get("#title").clear().type("古い記事を直した");
    cy.contains("button", ja.articleForm.save).click();
    cy.location("pathname").should("match", /\/articles\/\d+$/);
    cy.visit("/ja/articles");
    titles().should("deep.equal", ["古い記事を直した", "新しい記事"]);

    cy.contains("main ul > li a", "新しい記事").click();
    cy.get(`button[aria-label="${ja.articleDetail.delete}"]`).click();
    cy.contains("button", ja.deleteArticle.confirm).click();
    cy.visit("/ja/articles");
    titles().should("deep.equal", ["古い記事を直した"]);
  });

  it("12件ごとに分かれ、ページを行き来でき、番号が続く", () => {
    cy.register();
    const record = `E2E 一覧のページ ${Date.now()}`;
    cy.createRecord(record);
    cy.createArticle("記事 01", "本文");
    for (let i = 2; i <= 13; i++) {
      addArticle(record, `記事 ${String(i).padStart(2, "0")}`, "本文");
    }
    cy.visit("/ja/articles?sort=createdAtAsc");
    cy.contains("p", "13件中 13件を表示").should("be.visible");
    rows().should("have.length", 12);
    cy.contains("nav span", "1 / 2").should("be.visible");
    cy.get(`a[aria-label="${ja.pagination.previous}"]`).should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.get(`a[aria-label="${ja.pagination.next}"]`).click();
    cy.location("search").should("eq", "?sort=createdAtAsc&page=2");
    rows().should("have.length", 1);
    rows().first().should("contain.text", "記事 13");
    rows().first().find("a > span").first().should("have.text", "13");
    cy.contains("nav span", "2 / 2").should("be.visible");
    cy.get(`a[aria-label="${ja.pagination.next}"]`).should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.get(`a[aria-label="${ja.pagination.previous}"]`).click();
    rows().should("have.length", 12);
    cy.visit("/ja/articles?sort=createdAtAsc&page=99");
    cy.contains("nav span", "2 / 2").should("be.visible");
  });
});

describe("記事の一覧(スマホ)", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.login(account);
  });

  it("下のナビに「記事」があり、押すと一覧に移り、現在の項目になる", () => {
    cy.visit("/ja/records");
    cy.get("nav.fixed a").should("have.length", 4);
    cy.contains("nav.fixed a", ja.bottomNav.articles).click();
    cy.location("pathname").should("eq", "/ja/articles");
    cy.contains("nav.fixed a", ja.bottomNav.articles).should(
      "have.attr",
      "aria-current",
      "page",
    );
    cy.contains("nav.fixed a", ja.bottomNav.records).should(
      "not.have.attr",
      "aria-current",
    );
  });

  it("サイドバーは、スマホでは出さない", () => {
    cy.viewport("iphone-x");
    cy.visit("/ja/records");
    cy.get(`nav[aria-label="${ja.bottomNav.label}"]`).should("not.be.visible");
  });

  it("行の左の数字は出さない", () => {
    cy.visit("/ja/articles");
    rows().first().should("be.visible");
    rows()
      .first()
      .find("span")
      .filter((_, el) => el.textContent === "1")
      .as("number");
    cy.get("@number").should("have.length", 1);
    cy.get("@number").should("not.be.visible");
  });

  it("列の見出しの行は出さず、1行目に記事のタイトルと更新日、2行目に小さなポスターと映画と年を出し、横にはみ出さない", () => {
    cy.visit("/ja/articles");
    cy.contains("[aria-hidden=true] span", list.columnTitle).should(
      "not.be.visible",
    );
    rows()
      .first()
      .within(() => {
        cy.get("span:visible")
          .filter((_, el) => el.textContent === "Cherry 台詞の記事")
          .should("have.length", 1)
          .then(($title) => {
            cy.get("time:visible").should("have.length", 1);
            cy.get("time:visible").then(($date) => {
              const title = $title[0]?.getBoundingClientRect();
              const date = $date[0]?.getBoundingClientRect();
              expect(date?.left).to.be.greaterThan(title?.right ?? 0);
              expect(
                Math.abs((date?.top ?? 0) - (title?.top ?? 0)),
              ).to.be.lessThan(12);
            });
            cy.contains("span:visible", `${recordB}`).then(($film) => {
              expect($film[0]?.getBoundingClientRect().top).to.be.greaterThan(
                $title[0]?.getBoundingClientRect().bottom ?? 0,
              );
              expect($film[0]?.textContent).to.contain("2020年");
            });
          });
        cy.get(`svg[aria-label="${ja.recordCard.noPoster}"]:visible`)
          .should("have.length", 1)
          .then(($poster) => {
            expect($poster[0]?.getBoundingClientRect().width).to.be.lessThan(
              30,
            );
          });
      });
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(
        Cypress.config("viewportWidth"),
      );
    });
  });

  it("検索の欄を出し、タイトルで検索できる", () => {
    cy.visit("/ja/articles");
    cy.get(`input[aria-label="${list.searchLabel}"]`).type("音{enter}");
    cy.location("search").should("eq", "?keyword=%E9%9F%B3");
    rows().should("have.length", 1);
  });

  it("絞り込みのシートに、並び替えと映画を出し、選ぶと絞り込まれる", () => {
    cy.visit("/ja/articles");
    cy.get(`button[aria-label="${list.filterOpen}"]`).click();
    cy.get("[role=dialog]").within(() => {
      cy.contains(list.sort.label).should("be.visible");
      cy.contains(list.record).should("be.visible");
      cy.contains("[role=radio]", recordA).click();
    });
    cy.location("search").should("match", /^\?record=\d+$/);
    cy.get("[role=dialog]").within(() => {
      cy.contains("button", "2件を表示").click();
    });
    rows().should("have.length", 2);
    cy.get(`button[aria-label="${list.filterOpen}"]`).should(
      "contain.text",
      "1",
    );
  });
});
