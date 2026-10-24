import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";

const toc = `nav[aria-label="${ja.articleDetail.toc}"]`;
const editor = ja.articleEditor;

const headingsOfFirstArticle = [
  "観たきっかけ",
  "あらすじ(結末は書かない)",
  "編集の話",
  "街の中の撮影",
  "ミシェルの仕草",
  "部屋の中の長い場面",
  "ジャズの音楽",
  "書き留めておきたいこと",
];

describe("記事の目次", () => {
  beforeEach(() => {
    cy.login();
    cy.viewport(1280, 800);
  });

  it("見出しがある記事では、左に目次を表示し、見出しを順に並べる", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.get(toc).should("be.visible");
    cy.get(`${toc} a`).should("have.length", headingsOfFirstArticle.length);
    headingsOfFirstArticle.forEach((text, index) => {
      cy.get(`${toc} li`).eq(index).should("have.text", text);
      cy.get(`${toc} li a`)
        .eq(index)
        .should("have.attr", "href", `#section-${index + 1}`);
      cy.get(`#section-${index + 1}`).should("have.text", text);
    });
  });

  it("目次は本文より左にある", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.get(toc).then(($toc) => {
      cy.get("article h1").then(($title) => {
        expect($toc[0]?.getBoundingClientRect().right).to.be.lessThan(
          $title[0]?.getBoundingClientRect().left ?? 0,
        );
      });
    });
  });

  it("小見出しは、見出しより字下げして並べる", () => {
    cy.visit("/ja/records/3/articles/3");
    cy.get(`${toc} a[data-level="3"]`).should("have.length", 2);
    cy.get(`${toc} a[data-level="2"]`)
      .first()
      .then(($h2) => {
        cy.get(`${toc} a[data-level="3"]`)
          .first()
          .then(($h3) => {
            const padding = (element: HTMLElement) =>
              Number.parseFloat(getComputedStyle(element).paddingLeft);
            expect(padding($h3[0] as HTMLElement)).to.be.greaterThan(
              padding($h2[0] as HTMLElement),
            );
          });
      });
    cy.contains(`${toc} a`, "赤について").should(
      "have.attr",
      "data-level",
      "3",
    );
  });

  it("開いた直後は、先頭の項目が現在の項目になる", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.get(`${toc} a[aria-current="location"]`)
      .should("have.length", 1)
      .and("have.text", headingsOfFirstArticle[0]);
  });

  it("項目を押すと、その見出しまでスクロールし、現在の項目になる", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.contains(`${toc} a`, "編集の話").click();
    cy.get("#section-3").should(($heading) => {
      const top = $heading[0]?.getBoundingClientRect().top ?? -1;
      expect(top).to.be.greaterThan(40);
      expect(top).to.be.lessThan(260);
    });
    cy.contains(`${toc} a`, "編集の話").should(
      "have.attr",
      "aria-current",
      "location",
    );
    cy.get(`${toc} a[aria-current="location"]`).should("have.length", 1);
  });

  it("末尾の近くの項目を押しても、押した項目が現在の項目になる", () => {
    cy.visit("/ja/records/1/articles/1");
    for (const index of [
      headingsOfFirstArticle.length - 2,
      headingsOfFirstArticle.length - 1,
      headingsOfFirstArticle.length - 2,
    ]) {
      const text = headingsOfFirstArticle[index] ?? "";
      cy.contains(`${toc} a`, text).click();
      cy.wait(1200);
      cy.get(`#section-${index + 1}`).should(($heading) => {
        const rect = $heading[0]?.getBoundingClientRect();
        expect(rect?.top ?? -1).to.be.greaterThan(40);
        expect(rect?.bottom ?? Infinity).to.be.lessThan(
          Cypress.config("viewportHeight"),
        );
      });
      cy.contains(`${toc} a`, text).should(
        "have.attr",
        "aria-current",
        "location",
      );
      cy.get(`${toc} a[aria-current="location"]`).should("have.length", 1);
    }
  });

  it("項目を押した後に自分でスクロールすると、現在の項目がスクロールに合わせて変わる", () => {
    cy.visit("/ja/records/1/articles/1");
    const secondLast = headingsOfFirstArticle.length - 2;
    cy.contains(`${toc} a`, headingsOfFirstArticle[secondLast] ?? "").click();
    cy.wait(1200);
    cy.get(`#section-${secondLast + 1}`).then(($heading) => {
      let panel = $heading[0]?.parentElement ?? null;
      while (panel && getComputedStyle(panel).overflowY !== "auto") {
        panel = panel.parentElement;
      }
      cy.wrap(panel ?? window)
        .trigger("wheel", { deltaY: -400 })
        .then(() => {
          if (panel) panel.scrollTop = 0;
          else window.scrollTo(0, 0);
        });
    });
    cy.contains(`${toc} a`, headingsOfFirstArticle[0] ?? "").should(
      "have.attr",
      "aria-current",
      "location",
    );
  });

  it("本文の下に、余白を足さない", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.get("article").parent().parent().children().should("have.length", 1);
  });

  it("スクロールすると、現在の項目が切り替わる", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.get("#section-4").scrollIntoView();
    cy.contains(`${toc} a`, "街の中の撮影").should(
      "have.attr",
      "aria-current",
      "location",
    );
    cy.get("#section-8").scrollIntoView();
    cy.contains(`${toc} a`, "書き留めておきたいこと").should(
      "have.attr",
      "aria-current",
      "location",
    );
    cy.contains(`${toc} a`, "街の中の撮影").should(
      "not.have.attr",
      "aria-current",
    );
    cy.get("#section-2").scrollIntoView();
    cy.contains(`${toc} a`, "あらすじ(結末は書かない)").should(
      "have.attr",
      "aria-current",
      "location",
    );
  });

  it("スクロールしても、目次は画面に残る", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.get("#section-8").scrollIntoView();
    cy.get(toc).should(($toc) => {
      const rect = $toc[0]?.getBoundingClientRect();
      expect(rect?.top).to.be.greaterThan(0);
      expect(rect?.bottom).to.be.lessThan(800);
    });
  });

  it("見出しが2つの記事にも目次を表示する", () => {
    cy.visit("/ja/records/1/articles/2");
    cy.get(`${toc} a`).should("have.length", 2);
  });

  it("見出しのない記事には、目次を表示しない", () => {
    cy.visit("/ja/records/3/articles/4");
    cy.get("article h1").should("be.visible");
    cy.get(toc).should("not.exist");
  });

  it("モックの増やした記事(見出しが1つ)にも、左に目次を表示する", () => {
    cy.visit("/ja/records/2/articles/7");
    cy.get("article h1").should("have.text", "音の使い方についてのメモ");
    cy.get(`aside ${toc} a`)
      .should("have.length", 1)
      .and("have.text", "気づいたこと")
      .and("have.attr", "aria-current", "location");
    cy.get("aside").within(() => {
      cy.get('a[href="/ja/records/2"]').should("be.visible");
      cy.get(toc).should("be.visible");
    });
  });

  it("見出しが1つだけの記事にも目次を表示し、2つ目の見出しを足すと項目が増える", () => {
    cy.createRecord(`E2E 目次の出現 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get("#title").type("見出しの数");
    cy.get("[role=textbox]").click().type("一つ目の見出し");
    cy.get(`button[aria-label="${editor.heading}"]`).click();
    cy.get("[role=textbox]").type("{enter}本文");
    cy.contains("button", ja.articleForm.save).click();
    cy.location("pathname").should("match", /\/articles\/\d+$/);
    cy.get("#section-1").should("have.text", "一つ目の見出し");
    cy.get(`aside ${toc} a`).should("have.length", 1);
    cy.get(`aside ${toc} li`).eq(0).should("have.text", "一つ目の見出し");

    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.get("[role=textbox]").click().type("{ctrl+end}{enter}二つ目の見出し");
    cy.get(`button[aria-label="${editor.heading}"]`).click();
    cy.contains("button", ja.articleForm.save).click();
    cy.location("pathname").should("match", /\/articles\/\d+$/);
    cy.get(`aside ${toc} a`).should("have.length", 2);
    cy.get(`aside ${toc} li`).eq(1).should("have.text", "二つ目の見出し");
  });

  it("空の見出しは、目次に出さない", () => {
    cy.createRecord(`E2E 空の見出し ${Date.now()}`);
    cy.contains("a", ja.recordDetail.articlesAdd).click();
    cy.get("#title").type("空の見出し");
    cy.get("[role=textbox]").click();
    cy.get(`button[aria-label="${editor.heading}"]`).click();
    cy.get("[role=textbox]").type("{enter}本文");
    cy.contains("button", ja.articleForm.save).click();
    cy.location("pathname").should("match", /\/articles\/\d+$/);
    cy.get("article h1").should("be.visible");
    cy.get(toc).should("not.exist");
  });

  it("幅が1280px未満では、左の目次を表示せず、上のバーに目次のボタンを表示する", () => {
    cy.viewport(1100, 800);
    cy.visit("/ja/records/1/articles/1");
    cy.get("article h1").should("be.visible");
    cy.get(`aside ${toc}`).should("not.be.visible");
    cy.contains("button", ja.articleDetail.toc).should("be.visible");
  });

  it("スマホの幅でも、目次のボタンを表示し、横にはみ出さない", () => {
    cy.viewport("iphone-x");
    cy.visit("/ja/records/1/articles/1");
    cy.get("article h1").should("be.visible");
    cy.get(`aside ${toc}`).should("not.be.visible");
    cy.contains("button", ja.articleDetail.toc).should("be.visible");
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(
        Cypress.config("viewportWidth"),
      );
    });
  });

  it("1280px以上では、上のバーの目次のボタンを表示しない", () => {
    cy.visit("/ja/records/1/articles/1");
    cy.contains("button", ja.articleDetail.toc).should("not.be.visible");
  });

  it("編集画面には、目次を表示しない", () => {
    cy.visit("/ja/records/1/articles/1/edit");
    cy.get("#title").should("be.visible");
    cy.get(toc).should("not.exist");
  });

  it("英語の画面では、見出しの文言が英語になる", () => {
    cy.visit("/en/records/1/articles/1");
    cy.get(`nav[aria-label="${en.articleDetail.toc}"]`).should("be.visible");
    cy.contains(`nav h2`, en.articleDetail.toc).should("be.visible");
  });
});

const narrowViewports = [
  ["スマホ", 390, 844],
  ["タブレット", 1100, 800],
] as const;

for (const [name, width, height] of narrowViewports) {
  describe(`記事の目次(狭い画面: ${name})`, () => {
    const list = '[data-slot="popover-content"] nav';
    const button = () => cy.contains("button", ja.articleDetail.toc);
    const noScroll = { scrollBehavior: false } as const;

    beforeEach(() => {
      cy.login();
      cy.viewport(width, height);
    });

    it("スクロールしても、目次のバーは上に残る", () => {
      cy.visit("/ja/records/1/articles/1");
      cy.get("#section-6").scrollIntoView();
      button().should(($button) => {
        const rect = $button[0]?.getBoundingClientRect();
        expect(rect?.top).to.be.within(0, 170);
      });
    });

    it("ボタンを押すと、先頭に「ページの先頭へ」、続いて見出しの一覧が開く", () => {
      cy.visit("/ja/records/1/articles/1");
      button().should("have.attr", "aria-expanded", "false");
      button().click(noScroll);
      button().should("have.attr", "aria-expanded", "true");
      cy.contains("button", ja.articleDetail.tocTop).should("be.visible");
      cy.get(`${list} a`).should("have.length", headingsOfFirstArticle.length);
      headingsOfFirstArticle.forEach((text, index) => {
        cy.get(`${list} li`).eq(index).should("have.text", text);
      });
    });

    it("小見出しは、見出しより字下げして並べる", () => {
      cy.visit("/ja/records/3/articles/3");
      button().click(noScroll);
      cy.get(`${list} a[data-level="3"]`).should("have.length", 2);
      cy.get(`${list} a[data-level="2"]`)
        .first()
        .then(($h2) => {
          cy.get(`${list} a[data-level="3"]`)
            .first()
            .then(($h3) => {
              const padding = (element: HTMLElement) =>
                Number.parseFloat(getComputedStyle(element).paddingLeft);
              expect(padding($h3[0] as HTMLElement)).to.be.greaterThan(
                padding($h2[0] as HTMLElement),
              );
            });
        });
    });

    it("現在の見出しが、一覧の中で強調され、バーにも表示される", () => {
      cy.visit("/ja/records/1/articles/1");
      cy.get("#section-4").scrollIntoView();
      cy.contains("span", "街の中の撮影").should("be.visible");
      button().click(noScroll);
      cy.get(`${list} a[aria-current="location"]`)
        .should("have.length", 1)
        .and("have.text", "街の中の撮影");
    });

    it("項目を押すと、一覧が閉じて、その見出しが固定のバーの下に出る", () => {
      cy.visit("/ja/records/1/articles/1");
      button().click(noScroll);
      cy.contains(`${list} a`, "編集の話").click(noScroll);
      cy.wait(1200);
      cy.get(list).should("not.exist");
      button().should("have.attr", "aria-expanded", "false");
      button().then(($button) => {
        const barBottom =
          $button.parent()[0]?.getBoundingClientRect().bottom ?? 0;
        cy.get("#section-3").should(($heading) => {
          const top = $heading[0]?.getBoundingClientRect().top ?? -1;
          expect(top).to.be.at.least(barBottom);
          expect(top).to.be.lessThan(barBottom + 100);
        });
      });
      button().parent().should("contain.text", "編集の話");
    });

    it("最後の項目を押すと、その項目が現在の項目になる", () => {
      cy.visit("/ja/records/1/articles/1");
      button().click(noScroll);
      cy.contains(`${list} a`, "書き留めておきたいこと").click(noScroll);
      cy.wait(1200);
      button().parent().should("contain.text", "書き留めておきたいこと");
    });

    it("「ページの先頭へ」を押すと、先頭にもどり、一覧が閉じる", () => {
      cy.visit("/ja/records/1/articles/1");
      cy.get("#section-6").scrollIntoView();
      button().click(noScroll);
      cy.contains("button", ja.articleDetail.tocTop).click(noScroll);
      cy.get("article h1").should(($title) => {
        const rect = $title[0]?.getBoundingClientRect();
        expect(rect?.top).to.be.greaterThan(0);
        expect(rect?.bottom).to.be.lessThan(height);
      });
      button().should("have.attr", "aria-expanded", "false");
    });

    it("Escape を押すと、一覧が閉じる", () => {
      cy.visit("/ja/records/1/articles/1");
      button().click(noScroll);
      cy.get(`${list} a`).should("be.visible");
      cy.get("body").type("{esc}");
      button().should("have.attr", "aria-expanded", "false");
      cy.contains(`${list} a`, "編集の話").should("not.exist");
    });

    it("一覧の外を押すと、一覧が閉じる", () => {
      cy.visit("/ja/records/1/articles/1");
      button().click(noScroll);
      cy.get(`${list} a`).should("be.visible");
      cy.get("article h1").click({ force: true });
      button().should("have.attr", "aria-expanded", "false");
    });

    it("見出しのない記事には、目次のバーを出さない", () => {
      cy.visit("/ja/records/3/articles/4");
      cy.get("article h1").should("be.visible");
      cy.contains("button", ja.articleDetail.toc).should("not.exist");
    });

    it("英語の画面では、ボタンと先頭へもどる項目が英語になる", () => {
      cy.visit("/en/records/1/articles/1");
      cy.contains("button", en.articleDetail.toc).click();
      cy.contains("button", en.articleDetail.tocTop).should("be.visible");
    });
  });
}
