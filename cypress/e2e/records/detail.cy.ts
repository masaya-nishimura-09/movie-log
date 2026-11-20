import ja from "../../../src/i18n/dictionaries/ja.json";
import { notebookContent } from "../../support/commands";

const detail = ja.recordDetail;

const position = () => cy.get("[aria-live]:visible");
const nextButton = () =>
  cy.get(`button[aria-label="${detail.nextPage}"]:visible`);
const prevButton = () =>
  cy.get(`button[aria-label="${detail.prevPage}"]:visible`);
const page = () => cy.get(notebookContent);

function swipe(from: number, to: number) {
  cy.get("main .touch-pan-y")
    .trigger("pointerdown", { pointerType: "touch", clientX: from })
    .trigger("pointerup", { pointerType: "touch", clientX: to });
}

describe("記録の詳細", () => {
  beforeEach(() => {
    cy.login();
  });

  it("表紙のページに、ポスター、題名、観た日、観た場所、スコア、雰囲気、映画情報、記録した日時を書く", () => {
    cy.visit("/ja/records/1");
    page()
      .first()
      .within(() => {
        cy.get("h1").should("have.text", "勝手にしやがれ");
        cy.contains("À bout de souffle").should("be.visible");
        cy.contains("dt", detail.watchedAt)
          .next("dd")
          .should("have.text", "2026/08/16(日)");
        cy.contains("dt", detail.platform)
          .next("dd")
          .should("have.text", ja.enums.platform.criterion_channel);
        cy.contains("dt", detail.score)
          .next("dd")
          .find("[role=img]")
          .should("have.attr", "aria-label", "5点中4点");
        cy.contains("dt", detail.moodTags)
          .next("dd")
          .should(
            "have.text",
            `${ja.enums.moodTag.stylish}・${ja.enums.moodTag.refreshing}`,
          );
        cy.contains("h2", detail.movieInfo).should("be.visible");
        cy.contains("dt", detail.released)
          .next("dd")
          .should("have.text", "1960年 · 90分");
        cy.contains("dt", detail.production)
          .next("dd")
          .should("have.text", "フランス · フランス語");
        cy.contains("dt", detail.genres)
          .next("dd")
          .should("contain", ja.enums.genre.drama);
        cy.contains("dt", detail.directors)
          .next("dd")
          .should("have.text", "ジャン＝リュック・ゴダール");
        cy.contains("dt", detail.cast)
          .next("dd")
          .should("contain", "ジャン＝ポール・ベルモンド");
      });
    cy.contains("section[aria-label]", `${detail.createdAt} 2026/08/`).should(
      "be.visible",
    );
    cy.turnNotebookTo("自動車泥棒のミシェル").should("be.visible");
  });

  it("映画情報には監督と出演だけを書き、脚本や撮影は書かない", () => {
    cy.visit("/ja/records/2");
    cy.contains(notebookContent, "ブリジット・バルドー").should("be.visible");
    page().first().should("not.contain", "Alberto Moravia");
    page().first().should("not.contain", "Raoul Coutard");
  });

  it("表紙のあとにノート、最後にスクラップのページが続く", () => {
    cy.visit("/ja/records/1");
    cy.turnNotebookTo("観たきっかけ")
      .find("h2")
      .should("contain", "観たきっかけ");
    cy.turnNotebookTo("最後の場面は").should("be.visible");
    cy.turnNotebookToEnd();
    page()
      .last()
      .find(
        `button[aria-label^="${detail.attachmentOpen.split("{number}")[0]}"]`,
      )
      .should("have.length", 4);
    nextButton().should("be.disabled");
  });

  it("広い画面では見開きで、ボタンと矢印キーで2ページずつめくり、端ではめくれない", () => {
    cy.visit("/ja/records/1");
    position()
      .invoke("text")
      .should("match", /^1–2 \/ \d+$/);
    page().should("have.length", 2);
    prevButton().should("be.disabled");
    nextButton().click();
    position()
      .invoke("text")
      .should("match", /^3–4 \/ \d+$/);
    prevButton().click();
    position()
      .invoke("text")
      .should("match", /^1–2 \//);
    cy.get("body").type("{rightArrow}");
    position()
      .invoke("text")
      .should("match", /^3–4 \//);
    cy.get("body").type("{leftArrow}");
    position()
      .invoke("text")
      .should("match", /^1–2 \//);
    position()
      .invoke("text")
      .then((text) => {
        const total = Number(text.split("/")[1]);
        for (let i = 0; i < Math.ceil(total / 2); i++) {
          cy.get("body").type("{rightArrow}");
        }
        position()
          .invoke("text")
          .should("match", new RegExp(`${total}$`));
        nextButton().should("be.disabled");
      });
  });

  it("ページ数が奇数なら、最後の見開きの右のページは白紙にする", () => {
    cy.visit("/ja/records/6");
    position().should("have.text", "1 / 1");
    page().should("have.length", 1);
    cy.get("main section[aria-label]").should("have.length", 1);
    nextButton().should("be.disabled");
  });

  it("スマホでは1ページずつ、下のボタンとスワイプでめくる", () => {
    cy.viewport(390, 844);
    cy.visit("/ja/records/1");
    position()
      .invoke("text")
      .should("match", /^1 \/ \d+$/);
    page().should("have.length", 1);
    nextButton().click();
    position().invoke("text").should("match", /^2 \//);
    prevButton().click();
    position().invoke("text").should("match", /^1 \//);
    swipe(300, 100);
    position().invoke("text").should("match", /^2 \//);
    swipe(300, 280);
    position().invoke("text").should("match", /^2 \//);
    swipe(100, 300);
    position().invoke("text").should("match", /^1 \//);
  });

  it("ノートも添付もない記録は、表紙だけのノートにする", () => {
    cy.createRecord(`E2E 表紙だけ ${Date.now()}`);
    position().should("have.text", "1 / 1");
    prevButton().should("be.disabled");
    nextButton().should("be.disabled");
  });

  describe("ポスター", () => {
    const posterButton = () =>
      cy.get(`main button[aria-label="${detail.posterOpen}"]:visible`);

    it("ポスターを押すと大きく表示し、閉じるで戻る", () => {
      cy.visit("/ja/records/1");
      posterButton().click();
      cy.get("[role=dialog]").within(() => {
        cy.contains("h2", "勝手にしやがれ").should("be.visible");
        cy.get("img[src*='image.tmdb.org']").should("be.visible");
        cy.get("button").contains(detail.attachmentClose).click({
          force: true,
        });
      });
      cy.get("[role=dialog]").should("not.exist");
    });

    it("Escape キーで閉じ、開いているあいだは矢印キーでページをめくらない", () => {
      cy.visit("/ja/records/1");
      posterButton().click();
      cy.get("[role=dialog]").should("be.visible");
      cy.focused().type("{rightArrow}");
      position()
        .invoke("text")
        .should("match", /^1–2 \//);
      cy.focused().type("{esc}");
      cy.get("[role=dialog]").should("not.exist");
    });

    it("ポスターがない記録では、ポスターを押せない", () => {
      cy.createRecord(`E2E ポスターなし ${Date.now()}`);
      cy.get("main h1:visible").should("contain", "E2E ポスターなし");
      posterButton().should("not.exist");
    });
  });

  describe("スクラップ", () => {
    const openScrap = (number: number) => {
      cy.turnNotebookToEnd();
      cy.get(
        `button[aria-label="${detail.attachmentOpen.replace("{number}", String(number))}"]:visible`,
      ).click();
    };

    it("押すと大きく表示し、閉じるで戻る。詳細画面では削除できない", () => {
      cy.visit("/ja/records/1");
      openScrap(2);
      cy.get("[role=dialog]").within(() => {
        cy.contains("2 / 4").should("be.visible");
        cy.get("img[src*='pamphlet-2']").should("be.visible");
        cy.get(`button[aria-label="${detail.attachmentDelete}"]`).should(
          "not.exist",
        );
        cy.get("button").contains(detail.attachmentClose).click({
          force: true,
        });
      });
      cy.get("[role=dialog]").should("not.exist");
    });

    it("左右のボタンと矢印キーで前後のスクラップに移り、端ではボタンを押せない", () => {
      cy.visit("/ja/records/1");
      openScrap(1);
      const prev = () =>
        cy.get(`button[aria-label="${detail.attachmentPrev}"]`);
      const next = () =>
        cy.get(`button[aria-label="${detail.attachmentNext}"]`);
      cy.contains("[role=dialog]", "1 / 4").should("be.visible");
      prev().should("be.disabled");
      next().click();
      cy.contains("[role=dialog]", "2 / 4").should("be.visible");
      cy.get("body").type("{rightArrow}{rightArrow}");
      cy.contains("[role=dialog]", "4 / 4").should("be.visible");
      next().should("be.disabled");
      prev().click();
      cy.contains("[role=dialog]", "3 / 4").should("be.visible");
      cy.get("body").type("{leftArrow}");
      cy.contains("[role=dialog]", "2 / 4").should("be.visible");
    });

    it("スマホでも、下のボタンで前後のスクラップに移る", () => {
      cy.viewport(390, 844);
      cy.visit("/ja/records/1");
      openScrap(1);
      cy.get(`button[aria-label="${detail.attachmentNext}"]`)
        .should("be.visible")
        .click();
      cy.contains("[role=dialog]", "2 / 4").should("be.visible");
    });
  });

  it("編集のボタンで編集画面に移る", () => {
    cy.visit("/ja/records/1");
    cy.contains("a", detail.edit).click();
    cy.location("pathname").should("eq", "/ja/records/1/edit");
  });

  it("スマホでも、目次へ、編集、削除の文字を出す", () => {
    cy.viewport(390, 844);
    cy.visit("/ja/records/1");
    cy.contains("a", detail.back).should("be.visible");
    cy.contains("a", detail.edit).should("be.visible");
    cy.contains("button", detail.delete).should("be.visible");
  });

  it("一覧のカードから詳細に移り、目次へで一覧にもどれる", () => {
    cy.visit("/ja/records");
    cy.get("main ul > li > a").first().click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.contains("a", detail.back).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  describe("戻る先", () => {
    it("検索を入れた一覧から開いて戻ると、同じ検索の一覧に戻る", () => {
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

    it("2ページ目から開いて戻ると、2ページ目に戻る", () => {
      cy.visit("/ja/records?page=2");
      cy.get("main ul > li > a").first().click();
      cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
      cy.contains("a", detail.back).click();
      cy.location("pathname").should("eq", "/ja/records");
      cy.location("search").should("eq", "?page=2");
    });

    it("絞り込みのない一覧から開くと、住所に余計な印を付けず、戻ると一覧に戻る", () => {
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

    it("戻る先に、このアプリの記録の一覧でない住所を入れても、無視して一覧に戻る", () => {
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
