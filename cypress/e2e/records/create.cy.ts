import ja from "../../../src/i18n/dictionaries/ja.json";
import { longDate } from "../../support/text";

const form = ja.recordForm;

describe("記録の作成", () => {
  beforeEach(() => {
    cy.login();
  });

  it("ほかの一番上のページと同じく、戻るのバーを出さず、同じ位置に見出しを出す", () => {
    cy.visit("/ja/records");
    cy.get("h1:visible").then(($listHeading) => {
      const list = $listHeading[0]?.getBoundingClientRect();
      cy.visit("/ja/records/new");
      cy.get(`main a[aria-label="${form.back}"]`).should("not.exist");
      cy.get("h1:visible")
        .should("have.text", form.createTitle)
        .then(($heading) => {
          const heading = $heading[0]?.getBoundingClientRect();
          expect(heading?.left).to.eq(list?.left);
          expect(heading?.top).to.eq(list?.top);
        });
    });
  });

  it("3つのステップを入力して保存すると、詳細画面に移る", () => {
    const title = `E2E 作成 ${Date.now()}`;
    cy.createRecord(title);
    cy.get("h1:visible").should("have.text", title);
    cy.contains(ja.enums.platform.netflix).should("be.visible");
  });

  it("すべての項目を入力して保存すると、詳細画面にすべて表示される", () => {
    const title = `E2E 全項目 ${Date.now()}`;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    cy.visit("/ja/records/new");
    cy.get("#title").type(title);
    cy.contains("button", form.yesterday).click();
    cy.get("#watchedAt").should("have.text", longDate(yesterday));
    cy.get(`[role=radiogroup][aria-label="${form.score}"]`)
      .contains("label", "3")
      .click();
    cy.contains("label", ja.enums.platform.hulu).click();
    cy.contains("button", form.next).click();

    cy.get("#releaseYear").type("2016");
    cy.get("#runtime").clear().type("116");
    cy.get(`button[aria-label="${form.language}"]`).click();
    cy.contains("[role=option]", "英語 en").click();
    cy.get("#countries").type("us{enter}");
    cy.get("#countries").type("ca{enter}");
    cy.get("#countries").type("CA{enter}");
    cy.contains("li", "CA").find("button").click();
    cy.contains("label", ja.enums.genre.drama).click();
    cy.contains("label", ja.enums.genre.science_fiction).click();
    cy.get("input[name='credits.0.personName']").type("Denis Villeneuve");
    cy.contains("button", form.addCredit).click();
    cy.get(`button[aria-label="${form.creditRole}"]`).eq(1).click();
    cy.contains("[role=option]", ja.enums.creditRole.cast).click();
    cy.get("input[name='credits.1.personName']").type("Amy Adams");
    cy.contains("button", form.addCredit).click();
    cy.get("input[name='credits.2.personName']").type("削除する行");
    cy.get(`button[aria-label="${form.removeCredit}"]`).eq(2).click();
    cy.get("input[name='credits.2.personName']").should("not.exist");
    cy.get("input[type=file]").selectFile("cypress/fixtures/poster.png", {
      force: true,
    });
    cy.get("#posterUrl")
      .invoke("val")
      .should("match", /^https:\/\/mock\.invalid\/posters\//);
    cy.contains("button", form.next).click();

    cy.contains("label", ja.enums.moodTag.moving).click();
    cy.contains("label", ja.enums.moodTag.dark).click();
    cy.get("#memo").type("言語学者が主人公の SF");
    cy.contains("button", form.save).click();

    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("h1:visible").should("have.text", title);
    cy.get("main").within(() => {
      cy.contains(longDate(yesterday)).should("exist");
      cy.contains(ja.enums.platform.hulu).should("exist");
      cy.contains("2016年").should("exist");
      cy.contains("116分").should("exist");
      cy.contains("英語").should("exist");
      cy.contains(
        new Intl.DisplayNames("ja", { type: "region" }).of("US") ?? "US",
      ).should("exist");
      cy.contains(ja.enums.genre.drama).should("exist");
      cy.contains(ja.enums.genre.science_fiction).should("exist");
      cy.contains(ja.enums.moodTag.moving).should("exist");
      cy.contains(ja.enums.moodTag.dark).should("exist");
      cy.contains("言語学者が主人公の SF").should("exist");
      cy.contains("dd", "Denis Villeneuve")
        .prev("dt")
        .should("have.text", ja.enums.creditRole.director);
      cy.contains("dd", "Amy Adams")
        .prev("dt")
        .should("have.text", ja.enums.creditRole.cast);
      cy.contains("削除する行").should("not.exist");
      cy.get("img[src^='https://mock.invalid/posters/']").should("exist");
    });
  });

  it("タイトルの候補を選ぶと、映画の情報が自動で入る", () => {
    cy.visit("/ja/records/new");
    cy.get("#title").type("勝手に");
    cy.contains("[role=option]", "勝手にしやがれ").click();
    cy.get("#title").should("have.value", "勝手にしやがれ");
    cy.get(`[role=radiogroup][aria-label="${form.score}"]`)
      .contains("label", "5")
      .click();
    cy.contains("label", ja.enums.platform.netflix).click();
    cy.contains("button", form.next).click();
    cy.get("#releaseYear").should("have.value", "1960");
    cy.get("#runtime").should("have.value", "90");
    cy.get(`button[aria-label="${form.language}"]`).should(
      "contain.text",
      "fr",
    );
    cy.contains("li", "FR").should("exist");
    cy.contains("label", ja.enums.genre.drama)
      .find("input")
      .should("be.checked");
    cy.get("input[name='credits.0.personName']").should(
      "have.value",
      "ジャン＝リュック・ゴダール",
    );
    cy.get("#posterUrl")
      .invoke("val")
      .should("match", /^https:\/\/image\.tmdb\.org\//);
  });

  it("カレンダーから視聴日を選べる", () => {
    const first = new Date();
    first.setDate(1);
    cy.visit("/ja/records/new");
    cy.get("#watchedAt").click();
    cy.get("[role=dialog]").contains("button", /^1$/).click();
    cy.get("#watchedAt").should("have.text", longDate(first));
  });

  it("「今日」を押すと視聴日が今日になる", () => {
    cy.visit("/ja/records/new");
    cy.contains("button", form.yesterday).click();
    cy.contains("button", form.today).click();
    cy.get("#watchedAt").should("have.text", longDate(new Date()));
  });

  it("もどるで前のステップに戻ると、入力した内容が残っている", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("戻るテスト", { score: 2 });
    cy.contains("button", form.next).click();
    cy.get("li[aria-current=step]").should("contain.text", form.stepMovieInfo);
    cy.contains("button", form.back).click();
    cy.get("li[aria-current=step]").should("contain.text", form.stepBasics);
    cy.get("#title").should("have.value", "戻るテスト");
  });

  it("タイトルが空のままでは次のステップに進めない", () => {
    cy.visit("/ja/records/new");
    cy.contains("button", form.next).click();
    cy.get("li[aria-current=step]").should("contain.text", form.stepBasics);
    cy.get("#title:invalid").should("exist");
  });

  it("スコアとプラットフォームを選ばないと次のステップに進めない", () => {
    cy.visit("/ja/records/new");
    cy.get("#title").type("未選択テスト");
    cy.contains("button", form.next).click();
    cy.get("li[aria-current=step]").should("contain.text", form.stepBasics);
  });

  it("公開年が範囲外だと次のステップに進めない", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("公開年テスト", { score: 3 });
    cy.contains("button", form.next).click();
    cy.get("#releaseYear").type("1800");
    cy.contains("button", form.next).click();
    cy.get("li[aria-current=step]").should("contain.text", form.stepMovieInfo);
    cy.get("#releaseYear:invalid").should("exist");
  });

  it("画像以外のファイルはアップロードできない", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("アップロードテスト", { score: 3 });
    cy.contains("button", form.next).click();
    cy.get("input[type=file]").selectFile(
      {
        contents: "cypress/fixtures/not-image.txt",
        fileName: "not-image.png",
        mimeType: "text/plain",
      },
      { force: true },
    );
    cy.contains("[role=alert]", form.posterUploadError).should("be.visible");
    cy.get("#posterUrl").should("have.value", "");
  });

  it("英字2文字でない国コードは追加されない", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("国コードテスト", { score: 3 });
    cy.contains("button", form.next).click();
    cy.get("#countries").type("1x{enter}");
    cy.get("#countries").should("have.value", "1x");
    cy.get("input[type=hidden][name=countries]").should("not.exist");
  });
});

describe("記録の作成（候補とアップロード）", () => {
  beforeEach(() => {
    cy.login();
  });

  it("候補を矢印キーで選び、Enter で決められる", () => {
    cy.visit("/ja/records/new");
    cy.get("#title").type("軽");
    cy.get("[role=listbox]").should("not.exist");
    cy.get("#title").type("蔑");
    cy.get(`[role=listbox][aria-label="${form.movieSuggestions}"]`).should(
      "exist",
    );
    cy.get("[role=option]").should("have.length.at.least", 1);
    cy.get("#title").type("{downArrow}");
    cy.get("[role=option]")
      .first()
      .should("have.attr", "aria-selected", "true");
    cy.get("#title").type("{upArrow}");
    cy.get("[role=option]").last().should("have.attr", "aria-selected", "true");
    cy.get("#title").type("{downArrow}{enter}");
    cy.get("[role=listbox]").should("not.exist");
    cy.get("#title").should("have.value", "軽蔑");
  });

  it("Esc とフォーカスを外すと、候補が閉じる", () => {
    cy.visit("/ja/records/new");
    cy.get("#title").type("軽蔑");
    cy.get("[role=listbox]").should("exist");
    cy.get("#title").type("{esc}");
    cy.get("[role=listbox]").should("not.exist");
    cy.get("#title").type(" ");
    cy.get("[role=listbox]").should("exist");
    cy.get("#title").blur();
    cy.get("[role=listbox]").should("not.exist");
  });

  it("候補がないタイトルでは、候補を表示しない", () => {
    cy.visit("/ja/records/new");
    cy.get("#title").type("該当しない映画のタイトル");
    cy.wait(600);
    cy.get("[role=listbox]").should("not.exist");
  });

  it("言語を「不明」にすると、詳細画面に不明と表示する", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics(`E2E 言語不明 ${Date.now()}`, { score: 3 });
    cy.contains("button", form.next).click();
    cy.get("#releaseYear").type("2000");
    cy.get(`button[aria-label="${form.language}"]`).click();
    cy.contains("[role=option]", `${form.languageUnknown} und`).click();
    cy.contains("button", form.next).click();
    cy.contains("button", form.save).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("main").contains(form.languageUnknown).should("exist");
  });

  it("アップロード中は、アップロード中と表示する", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("アップロード中テスト", { score: 3 });
    cy.contains("button", form.next).click();
    cy.intercept({ method: "POST", url: "/ja/records/new" }, (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
    });
    cy.get("input[type=file]").selectFile("cypress/fixtures/poster.png", {
      force: true,
    });
    cy.contains(form.uploadingPoster).should("be.visible");
    cy.get("input[type=file]").should("be.disabled");
    cy.contains(form.uploadPoster).should("be.visible");
  });

  it("5MB を超える画像はアップロードできない", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("大きい画像テスト", { score: 3 });
    cy.contains("button", form.next).click();
    cy.get("input[type=file]").selectFile(
      {
        contents: Cypress.Buffer.alloc(5 * 1024 * 1024 + 1),
        fileName: "large.png",
        mimeType: "image/png",
      },
      { force: true },
    );
    cy.contains("[role=alert]", form.posterUploadError).should("be.visible");
    cy.get("#posterUrl").should("have.value", "");
  });

  it("サーバーで不正と判定された項目があると、そのステップに戻る", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("ステップに戻るテスト", { score: 3 });
    cy.contains("button", form.next).click();
    cy.get("#releaseYear").type("2000");
    cy.contains("button", form.next).click();
    cy.get("input[name=language]").invoke("val", "");
    cy.contains("button", form.save).click();
    cy.get("li[aria-current=step]").should("contain.text", form.stepMovieInfo);
    cy.contains(form.errors.language).should("be.visible");
    cy.contains("[role=alert]", form.invalidInput).should("be.visible");
  });

  it("保存に失敗すると、エラーを表示する", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("__error__", { score: 3 });
    cy.contains("button", form.next).click();
    cy.get("#releaseYear").type("2000");
    cy.contains("button", form.next).click();
    cy.contains("button", form.save).click();
    cy.contains("[role=alert]", form.unexpectedError).should("be.visible");
    cy.location("pathname").should("eq", "/ja/records/new");
  });
});
