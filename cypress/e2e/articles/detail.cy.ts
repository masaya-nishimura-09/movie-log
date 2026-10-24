import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";

const detail = ja.recordDetail;
const articleLinks = 'main a[href*="/articles/"]:not([href*="/articles/new"])';
const article = ja.articleDetail;

describe("記事の閲覧", () => {
  beforeEach(() => {
    cy.login();
  });

  it("記録の詳細に、記事のタイトルを一覧する", () => {
    cy.visit("/ja/records/1");
    cy.contains("h2", detail.articles).should("be.visible");
    cy.get("main").within(() => {
      cy.contains("a", "ジャンプカットが生んだ速度")
        .should("have.attr", "href", "/ja/records/1/articles/1")
        .and("be.visible");
      cy.contains("a", "二度目に観て気づいたこと")
        .should("have.attr", "href", "/ja/records/1/articles/2")
        .and("be.visible");
    });
  });

  it("3件より多い記録では、更新の新しい3件だけを並べ、「もっと見る」を出す", () => {
    cy.visit("/ja/records/7");
    cy.contains("h2", detail.articles).should("be.visible");
    cy.get(articleLinks).should("have.length", 3);
    cy.get(articleLinks)
      .first()
      .should("contain.text", "観終わってから何日か考えたこと");
    cy.contains("a", detail.articlesMore).should("be.visible");
  });

  it("3件以下の記録(2件)には、「もっと見る」を出さない", () => {
    cy.visit("/ja/records/1");
    cy.get(articleLinks).should("have.length.at.least", 2);
    cy.contains("a", detail.articlesMore).should("not.exist");
  });

  it("「もっと見る」を押すと、その映画で絞り込んだ記事の一覧に移り、その映画の記事を全部出す", () => {
    cy.visit("/ja/records/7");
    cy.contains("a", detail.articlesMore).click();
    cy.location("pathname").should("eq", "/ja/articles");
    cy.location("search").should("eq", "?record=7");
    cy.get("h1").should("have.text", ja.articleList.heading);
    cy.contains("p", /^\d+件中 (\d+)件を表示 ・ 絞り込み 1件$/).then(($p) => {
      const total = Number(/^(\d+)件中/.exec($p.text())?.[1]);
      const shown = Number(/中 (\d+)件/.exec($p.text())?.[1]);
      expect(shown).to.be.greaterThan(3);
      expect(shown).to.be.lessThan(total);
      cy.get("main ul > li").should("have.length", Math.min(shown, 12));
    });
    cy.get("main ul > li").each(($row) => {
      expect($row.text()).to.contain("オール・アバウト・マイ・マザー");
    });
    cy.contains("a", "オール・アバウト・マイ・マザー").should("be.visible");
  });

  it("ちょうど3件の記録には出さず、4件目を書くと出す(3件のまま)", () => {
    const record = `E2E 件数の境目 ${Date.now()}`;
    cy.createRecord(record);
    const write = (title: string) => {
      cy.contains("a", detail.articlesAdd).click();
      cy.get("#title").type(title);
      cy.get("[role=textbox]").click().type("本文");
      cy.contains("button", ja.articleForm.save).click();
      cy.location("pathname").should("match", /\/articles\/\d+$/);
      cy.contains("header a", record).click();
    };
    for (let i = 1; i <= 3; i++) write(`境目の記事 ${i}`);
    cy.get(articleLinks).should("have.length", 3);
    cy.contains("a", detail.articlesMore).should("not.exist");

    write("境目の記事 4");
    cy.get(articleLinks).should("have.length", 3);
    cy.contains("main a", "境目の記事 4").should("be.visible");
    cy.contains("main a", "境目の記事 1").should("not.exist");
    cy.contains("a", detail.articlesMore).click();
    cy.location("search").should("match", /^\?record=\d+$/);
    cy.contains("p", /件中 4件を表示 ・ 絞り込み 1件$/).should("be.visible");
    cy.get("main ul > li").should("have.length", 4);
  });

  it("スマホでも「もっと見る」を出し、横にはみ出さない", () => {
    cy.viewport("iphone-x");
    cy.visit("/ja/records/7");
    cy.contains("a", detail.articlesMore).scrollIntoView().should("be.visible");
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(
        Cypress.config("viewportWidth"),
      );
    });
  });

  it("英語の画面では、ボタンが英語になる", () => {
    cy.visit("/en/records/7");
    cy.contains("a", en.recordDetail.articlesMore).should("be.visible");
  });

  it("記事のある記録では、記事の欄に作成のリンクがある", () => {
    cy.visit("/ja/records/1");
    cy.contains("a", detail.articlesAdd).click();
    cy.location("pathname").should("eq", "/ja/records/1/articles/new");
  });

  it("記事のない記録では、記事がないことと作成のリンクを表示する", () => {
    cy.createRecord(`E2E 記事なし ${Date.now()}`);
    cy.contains(detail.articlesEmpty).should("be.visible");
    cy.contains("a", detail.articlesAdd).should("be.visible");
  });

  it("一覧から記事を開くと、タイトル、日時、本文を表示する", () => {
    cy.visit("/ja/records/1");
    cy.contains("a", "ジャンプカットが生んだ速度").click();
    cy.location("pathname").should("eq", "/ja/records/1/articles/1");
    cy.get("h1:visible").should("have.text", "ジャンプカットが生んだ速度");
    cy.get("main").within(() => {
      cy.contains(article.createdAt).should("be.visible");
      cy.contains(article.updatedAt).should("be.visible");
      cy.contains("h2", "編集の話").should("be.visible");
      cy.contains("p", "場面を飛ばす編集が").should("be.visible");
      cy.contains("ul li", "カットのつなぎ目").should("be.visible");
      cy.contains("ul li", "台詞の間").should("be.visible");
      cy.contains(
        "blockquote",
        "映画は、撮り方よりも、切り方で決まる。",
      ).should("be.visible");
    });
  });

  it("上のバーに、記録のタイトルの戻るリンク、編集、削除がある", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.contains("header a", "勝手にしやがれ").should("be.visible");
    cy.get(`header a[aria-label="${article.edit}"]`).should(
      "have.attr",
      "href",
      "/ja/records/1/articles/1/edit",
    );
    cy.get(`header button[aria-label="${article.delete}"]`).should(
      "be.visible",
    );
  });

  it("戻るリンクで、記録の詳細にもどる", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.contains("header a", "勝手にしやがれ").click();
    cy.location("pathname").should("eq", "/ja/records/1");
  });

  it("検索した記録一覧から記録、記事と進んでも、戻るを2回押すと同じ検索の一覧にもどる", () => {
    cy.visit("/ja/records?q=%E5%8B%9D%E6%89%8B");
    cy.contains("main ul > li > a", "勝手にしやがれ").click();
    cy.location("pathname").should("eq", "/ja/records/1");
    cy.get(articleLinks).first().click();
    cy.location("pathname").should(
      "match",
      /^\/ja\/records\/1\/articles\/\d+$/,
    );
    cy.contains("header a", "勝手にしやがれ").click();
    cy.location("pathname").should("eq", "/ja/records/1");
    cy.contains("a", detail.back).click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.location("search").should("eq", "?q=%E5%8B%9D%E6%89%8B");
  });

  it("検索した記録一覧から開いた記録で記事を作っても、戻るを2回押すと同じ検索の一覧にもどる", () => {
    const title = `E2E 戻る先 ${Date.now()}`;
    cy.createRecord(title);
    cy.location("pathname").then((recordPath) => {
      cy.visit(`/ja/records?q=${encodeURIComponent(title)}`);
      cy.contains("main ul > li > a", title).click();
      cy.location("pathname").should("eq", recordPath);
      cy.createArticle("戻る先の記事");
      cy.contains("header a", title).click();
      cy.location("pathname").should("eq", recordPath);
      cy.contains("a", detail.back).click();
      cy.location("pathname").should("eq", "/ja/records");
      cy.location("search").should("contain", "q=");
    });
  });

  it("記事の戻る先に、ほかの記録を入れても無視する", () => {
    cy.visit(
      `/ja/records/1/articles/1?from=${encodeURIComponent("/ja/records/2")}`,
    );
    cy.contains("header a", "勝手にしやがれ").should(
      "have.attr",
      "href",
      "/ja/records/1",
    );
  });

  it("存在しない記事では、ページが見つからないことを表示する", () => {
    cy.visit("/ja/records/1/articles/999999", { failOnStatusCode: false });
    cy.contains(ja.notFound.title).should("be.visible");
  });

  it("別の記録の記事のURLでは、ページが見つからないことを表示する", () => {
    cy.visit("/ja/records/2/articles/1", { failOnStatusCode: false });
    cy.contains(ja.notFound.title).should("be.visible");
  });

  it("存在しない記事の編集画面でも、ページが見つからないことを表示する", () => {
    cy.visit("/ja/records/1/articles/999999/edit", {
      failOnStatusCode: false,
    });
    cy.contains(ja.notFound.title).should("be.visible");
  });

  it("別の記録の記事の編集画面でも、ページが見つからないことを表示する", () => {
    cy.visit("/ja/records/2/articles/1/edit", { failOnStatusCode: false });
    cy.contains(ja.notFound.title).should("be.visible");
  });

  it("存在しない記録の記事の作成画面では、ページが見つからないことを表示する", () => {
    cy.visit("/ja/records/999999/articles/new", { failOnStatusCode: false });
    cy.contains(ja.notFound.title).should("be.visible");
  });

  it("ID が数字でない URL でも、ページが見つからないことを表示する", () => {
    for (const path of [
      "/ja/records/abc",
      "/ja/records/abc/articles/new",
      "/ja/records/1/articles/abc",
      "/ja/records/1/articles/abc/edit",
    ]) {
      cy.visit(path, { failOnStatusCode: false });
      cy.contains(ja.notFound.title).should("be.visible");
    }
  });

  it("英語の画面でも、記事の欄、記事のページ、作成画面を表示する", () => {
    cy.visit("/en/records/1");
    cy.contains("h2", en.recordDetail.articles).should("be.visible");
    cy.contains("a", en.recordDetail.articlesAdd).should("be.visible");
    cy.contains("main a", "ジャンプカットが生んだ速度").click();
    cy.location("pathname").should("eq", "/en/records/1/articles/1");
    cy.contains(en.articleDetail.createdAt).should("be.visible");
    cy.get(`header a[aria-label="${en.articleDetail.edit}"]`).click();
    cy.get("h1:visible").should("have.text", en.articleForm.editTitle);
    cy.contains("button", en.articleForm.save).should("be.visible");
    cy.contains("a", en.articleForm.cancel).should("be.visible");
    cy.get(`button[aria-label="${en.articleEditor.bold}"]`).should(
      "be.visible",
    );
  });

  describe("どの記録の記事かを示すカード", () => {
    const card = (selector: string) =>
      cy.get(`${selector} a[href="/ja/records/1"]`);

    it("広い画面では、左の目次の上に、ポスターとタイトルと公開年を表示する", () => {
      cy.viewport(1280, 800);
      cy.visit("/ja/records/1/articles/1");
      card("aside").should("be.visible").and("contain.text", "勝手にしやがれ");
      card("aside").should("contain.text", "1960年");
      card("aside").find("img").should("exist");
      card("aside")
        .find('[role="img"][aria-label^="スコア"]')
        .should("not.exist");
      card("aside").then(($card) => {
        cy.get("aside nav").then(($toc) => {
          expect($card[0]?.getBoundingClientRect().bottom).to.be.lessThan(
            $toc[0]?.getBoundingClientRect().top ?? 0,
          );
        });
      });
    });

    it("広い画面では、記事の上には、同じカードを重ねて出さない", () => {
      cy.viewport(1280, 800);
      cy.visit("/ja/records/1/articles/1");
      card("article").should("not.be.visible");
      card("aside").should("be.visible");
    });

    it("カードを押すと、記録の詳細に移る", () => {
      cy.viewport(1280, 800);
      cy.visit("/ja/records/1/articles/1");
      card("aside").click();
      cy.location("pathname").should("eq", "/ja/records/1");
    });

    it("狭い画面では、記事のタイトルの上に表示する", () => {
      cy.viewport("iphone-x");
      cy.visit("/ja/records/1/articles/1");
      card("article")
        .should("be.visible")
        .and("contain.text", "勝手にしやがれ");
      card("aside").should("not.be.visible");
      card("article").then(($card) => {
        cy.get("article h1").then(($title) => {
          expect($card[0]?.getBoundingClientRect().bottom).to.be.at.most(
            $title[0]?.getBoundingClientRect().top ?? 0,
          );
        });
      });
    });

    it("見出しのない記事でも、広い画面では、左の欄にカードを表示し、記事の上には重ねて出さない", () => {
      cy.viewport(1280, 800);
      cy.visit("/ja/records/3/articles/4");
      cy.get('aside a[href="/ja/records/3"]')
        .should("be.visible")
        .and("contain.text", "気狂いピエロ");
      cy.get('article a[href="/ja/records/3"]').should("not.be.visible");
      cy.get("aside nav").should("not.exist");
    });

    it("見出しのない記事でも、狭い画面では、記事のタイトルの上に表示する", () => {
      cy.viewport("iphone-x");
      cy.visit("/ja/records/3/articles/4");
      cy.get('article a[href="/ja/records/3"]')
        .should("be.visible")
        .and("contain.text", "気狂いピエロ");
      cy.get('aside a[href="/ja/records/3"]').should("not.be.visible");
    });

    it("左の欄は、目次を含めて、画面の高さに収まる", () => {
      cy.viewport(1280, 800);
      cy.visit("/ja/records/1/articles/1");
      cy.get("#section-8").scrollIntoView();
      cy.get("aside").should(($aside) => {
        const rect = $aside[0]?.getBoundingClientRect();
        expect(rect?.top).to.be.greaterThan(0);
        expect(rect?.bottom).to.be.at.most(800);
      });
    });

    it("ポスターのない記録では、ポスター未登録の表示を出す", () => {
      cy.createRecord(`E2E ポスターなし ${Date.now()}`);
      cy.createArticle("ポスターのない記録の記事");
      cy.get(
        `a[href^="/ja/records/"] svg[aria-label="${ja.recordCard.noPoster}"]`,
      ).should("exist");
    });
  });
});
