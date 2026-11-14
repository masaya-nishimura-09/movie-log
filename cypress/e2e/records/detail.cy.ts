import ja from "../../../src/i18n/dictionaries/ja.json";

const detail = ja.recordDetail;

describe("記録の詳細", () => {
  beforeEach(() => {
    cy.login();
  });

  function openMovieTab() {
    cy.contains("[role=tab]", detail.tabMovie).click();
  }

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
      cy.contains(ja.enums.moodTag.stylish).should("exist");
      cy.contains("h2", "観たきっかけ").should("exist");
      cy.contains(detail.createdAt).should("exist");
      cy.contains(detail.updatedAt).should("exist");
      openMovieTab();
      cy.contains("À bout de souffle").should("exist");
      cy.contains("自動車泥棒のミシェル").should("exist");
      cy.contains(ja.enums.genre.drama).should("exist");
      cy.contains("dd", "Raoul Coutard")
        .prev("dt")
        .should("have.text", ja.enums.creditRole.cinematographer);
    });
  });

  it("最初は記録のタブを開き、タブで記録と映画情報を切り替える", () => {
    cy.visit("/ja/records/1");
    cy.contains("[role=tab]", detail.tabRecord).should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.contains("main h2", detail.note).should("be.visible");
    cy.contains("main h2", detail.credits).should("not.exist");
    openMovieTab();
    cy.contains("[role=tab]", detail.tabMovie).should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.contains("main h2", detail.credits).should("be.visible");
    cy.contains("main h2", detail.note).should("not.exist");
    cy.contains("[role=tab]", detail.tabRecord).click();
    cy.contains("main h2", detail.note).should("be.visible");
  });

  for (const [name, viewport] of [
    ["広い画面", [1280, 800]],
    ["スマホ", [390, 844]],
  ] as const) {
    it(`記録のタブは雰囲気、ノート、添付の順、映画情報のタブは原題、あらすじ、ジャンル、クレジットの順に並ぶ(${name})`, () => {
      cy.viewport(viewport[0], viewport[1]);
      cy.visit("/ja/records/1");
      const tops = (labels: string[]) =>
        cy.get("main h2").then(($headings) =>
          labels.map((label) => {
            const heading = [...$headings].find((h) => h.textContent === label);
            expect(heading, label).to.exist;
            return heading?.getBoundingClientRect().top ?? 0;
          }),
        );
      const inOrder = (values: number[]) =>
        expect(values).to.deep.equal([...values].sort((a, b) => a - b));
      cy.get("main h1:visible").then(($title) => {
        const title = $title[0]?.getBoundingClientRect().top ?? 0;
        tops([detail.moodTags, detail.note, detail.attachments]).then(
          (values) => inOrder([title, ...values]),
        );
      });
      openMovieTab();
      tops([
        detail.originalTitle,
        detail.overview,
        ja.recordForm.genres,
        detail.credits,
      ]).then(inOrder);
    });
  }

  describe("ポスター", () => {
    const posterButton = () =>
      cy.get(`main button[aria-label="${detail.posterOpen}"]`);

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

    it("Escape キーで閉じる", () => {
      cy.visit("/ja/records/1");
      posterButton().click();
      cy.get("[role=dialog]").should("be.visible");
      cy.focused().type("{esc}");
      cy.get("[role=dialog]").should("not.exist");
    });

    it("ポスターがない記録では、ポスターを押せない", () => {
      cy.createRecord(`E2E ポスターなし ${Date.now()}`);
      cy.get("main h1:visible").should("contain", "E2E ポスターなし");
      posterButton().should("not.exist");
    });
  });

  describe("添付", () => {
    const section = () =>
      cy.contains("main h2", detail.attachments).closest("section");
    const thumbnails = () =>
      section().find(
        `button[aria-label^="${detail.attachmentOpen.split("{number}")[0]}"]`,
      );

    it("添付を縮小画像で並べ、押すと大きく表示し、閉じるで戻る", () => {
      cy.visit("/ja/records/1");
      thumbnails().should("have.length", 4);
      section()
        .find(
          `button[aria-label="${detail.attachmentOpen.replace("{number}", "2")}"]`,
        )
        .click();
      cy.get("[role=dialog]").within(() => {
        cy.contains("2 / 4").should("be.visible");
        cy.get("img[src*='pamphlet-2']").should("be.visible");
        cy.get(`button`).contains(detail.attachmentClose).click({
          force: true,
        });
      });
      cy.get("[role=dialog]").should("not.exist");
    });

    it("左右のボタンと矢印キーで前後の添付に移り、端ではボタンを押せない", () => {
      cy.visit("/ja/records/1");
      section()
        .find(
          `button[aria-label="${detail.attachmentOpen.replace("{number}", "1")}"]`,
        )
        .click();
      const prev = () =>
        cy.get(`button[aria-label="${detail.attachmentPrev}"]`);
      const next = () =>
        cy.get(`button[aria-label="${detail.attachmentNext}"]`);
      cy.contains("[role=dialog]", "1 / 4").should("be.visible");
      prev().should("be.disabled");
      next().click();
      cy.contains("[role=dialog]", "2 / 4").should("be.visible");
      cy.get("[role=dialog] img[src*='pamphlet-2']").should("be.visible");
      cy.get("body").type("{rightArrow}{rightArrow}");
      cy.contains("[role=dialog]", "4 / 4").should("be.visible");
      next().should("be.disabled");
      prev().click();
      cy.contains("[role=dialog]", "3 / 4").should("be.visible");
      cy.get("body").type("{leftArrow}");
      cy.contains("[role=dialog]", "2 / 4").should("be.visible");
    });

    it("スマホでも、下のボタンで前後の添付に移る", () => {
      cy.viewport(390, 844);
      cy.visit("/ja/records/1");
      section()
        .find(
          `button[aria-label="${detail.attachmentOpen.replace("{number}", "1")}"]`,
        )
        .click();
      cy.get(`button[aria-label="${detail.attachmentNext}"]`)
        .should("be.visible")
        .click();
      cy.contains("[role=dialog]", "2 / 4").should("be.visible");
    });

    it("画像を添付して表示し、削除すると消える", () => {
      cy.createRecord(`E2E 添付 ${Date.now()}`);
      section().contains(detail.attachmentsAdd).should("be.visible");
      section()
        .find("input[type=file]")
        .selectFile("cypress/fixtures/poster.png", { force: true });
      thumbnails().should("have.length", 1).first().click();
      cy.get(`button[aria-label="${detail.attachmentNext}"]`).should(
        "not.exist",
      );
      cy.get("[role=dialog]").within(() => {
        cy.contains("1 / 1").should("be.visible");
        cy.get("img[src^='data:image/png']").should("be.visible");
        cy.get(`button[aria-label="${detail.attachmentDelete}"]`).click();
      });
      cy.get("[role=alertdialog]").within(() => {
        cy.contains(ja.deleteAttachment.title).should("be.visible");
        cy.contains("button", ja.deleteAttachment.confirm).click();
      });
      cy.get("[role=dialog]").should("not.exist");
      thumbnails().should("have.length", 0);
      section().contains(detail.attachmentsAdd).should("be.visible");
    });

    it("削除中は、ボタンを削除中にし、大きく表示した画面も閉じない", () => {
      cy.createRecord(`E2E 添付削除中 ${Date.now()}`);
      section()
        .find("input[type=file]")
        .selectFile("cypress/fixtures/poster.png", { force: true });
      thumbnails().should("have.length", 1).first().click();
      cy.get(`[role=dialog] button[aria-label="${detail.attachmentDelete}"]`)
        .should("be.visible")
        .click();
      cy.location("pathname").then((path) => {
        cy.intercept({ method: "POST", url: path }, (req) => {
          req.on("response", (res) => {
            res.setDelay(1500);
          });
        });
      });
      cy.contains(
        "[role=alertdialog] button",
        ja.deleteAttachment.confirm,
      ).click();
      cy.contains("[role=alertdialog] button", ja.deleteAttachment.deleting)
        .should("be.disabled")
        .and("have.attr", "aria-busy", "true")
        .find("[data-spinner]")
        .should("be.visible");
      cy.get("[role=dialog]")
        .contains("button", detail.attachmentClose)
        .should("be.disabled");
      cy.get("body").type("{esc}");
      cy.get("[role=alertdialog]").should("be.visible");
      cy.get("[role=dialog]").should("not.exist");
      thumbnails().should("have.length", 0);
    });

    it("削除の確認でキャンセルすると、添付は残る", () => {
      cy.createRecord(`E2E 添付やめる ${Date.now()}`);
      section()
        .find("input[type=file]")
        .selectFile("cypress/fixtures/poster.png", { force: true });
      thumbnails().should("have.length", 1).first().click();
      cy.get(
        `[role=dialog] button[aria-label="${detail.attachmentDelete}"]`,
      ).click();
      cy.contains(
        "[role=alertdialog] button",
        ja.deleteAttachment.cancel,
      ).click();
      cy.get("[role=alertdialog]").should("not.exist");
      cy.contains("[role=dialog]", "1 / 1").should("be.visible");
    });

    it("添付は10枚までで、上限に達すると追加の枠を出さない", () => {
      cy.createRecord(`E2E 添付上限 ${Date.now()}`);
      section()
        .find("input[type=file]")
        .selectFile(
          Array.from({ length: 11 }, () => "cypress/fixtures/poster.png"),
          { force: true },
        );
      thumbnails().should("have.length", 10);
      cy.contains(
        "[role=alert]",
        detail.attachmentsLimit.replace("{max}", "10"),
      ).should("be.visible");
      section().find("input[type=file]").should("not.exist");
    });

    it("画像でないファイルは添付せず、エラーを表示する", () => {
      cy.createRecord(`E2E 添付エラー ${Date.now()}`);
      section()
        .find("input[type=file]")
        .selectFile("cypress/fixtures/not-image.txt", { force: true });
      cy.contains("[role=alert]", detail.attachmentsUploadError).should(
        "be.visible",
      );
      thumbnails().should("have.length", 0);
    });
  });

  it("添付の (i) を押すと、説明を出す", () => {
    cy.visit("/ja/records/1");
    cy.get(
      `button[aria-label="${detail.infoLabel.replace("{name}", detail.attachments)}"]`,
    ).click();
    cy.contains(detail.attachmentsInfo).should("be.visible");
    cy.get("body").type("{esc}");
    cy.contains(detail.attachmentsInfo).should("not.exist");
  });

  it("一覧のカードから詳細に移り、一覧にもどれる", () => {
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

  it("長いノートは冒頭だけを表示し、続きを読むで全文を広げ、閉じるで戻す", () => {
    cy.visit("/ja/records/1");
    const toggle = () => cy.contains("main button", /^(続きを読む|閉じる)$/);
    const body = () =>
      toggle()
        .invoke("attr", "aria-controls")
        .then((id) => cy.get(`[id="${id}"]`));
    const height = (check: (value: number) => void) =>
      body().should(($body) => check($body[0]?.clientHeight ?? 0));
    toggle()
      .should("have.text", detail.noteReadMore)
      .and("have.attr", "aria-expanded", "false");
    height((value) => expect(value).to.eq(256));
    toggle().click();
    toggle()
      .should("have.text", detail.noteShowLess)
      .and("have.attr", "aria-expanded", "true");
    height((value) => expect(value).to.be.greaterThan(256));
    body().contains("h2", "街の中の撮影").should("be.visible");
    toggle().click();
    height((value) => expect(value).to.eq(256));
  });

  it("ノート、あらすじ、クレジットがない記録では、追加のリンクから編集画面のその欄のタブに移る", () => {
    cy.createRecord(`E2E 空の詳細 ${Date.now()}`);
    cy.contains(detail.noteEmpty).should("be.visible");
    const selectedTab = (label: string) =>
      cy
        .contains("[role=tab]", label)
        .should("have.attr", "aria-selected", "true");
    cy.contains("a", detail.noteAdd).click();
    cy.location("pathname").should("match", /\/edit$/);
    cy.location("search").should("eq", "?tab=impression");
    selectedTab(ja.recordForm.stepImpression);
    cy.get("[role=textbox]").should("be.visible");
    cy.go("back");
    openMovieTab();
    cy.contains("main h2", detail.originalTitle).should("not.exist");
    cy.contains(detail.overviewEmpty).should("be.visible");
    cy.contains(detail.creditsEmpty).should("be.visible");
    cy.contains("a", detail.overviewAdd).click();
    cy.location("pathname").should("match", /\/edit$/);
    cy.location("search").should("eq", "?tab=movie");
    selectedTab(ja.recordForm.stepMovieInfo);
    cy.get("#overview").should("be.visible");
    cy.go("back");
    openMovieTab();
    cy.contains("a", detail.creditsAdd).click();
    cy.location("pathname").should("match", /\/edit$/);
    cy.location("search").should("eq", "?tab=movie");
    selectedTab(ja.recordForm.stepMovieInfo);
    cy.get("input[name='credits.0.personName']").should("be.visible");
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
