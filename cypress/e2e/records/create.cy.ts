import ja from "../../../src/i18n/dictionaries/ja.json";
import { notebookContent } from "../../support/commands";
import { formDate, weekdayDate } from "../../support/text";

const form = ja.recordForm;

const next = () => cy.contains("button:visible", form.next).click();
const save = () => cy.contains("button:visible", form.save).click();
const position = () => cy.get("[aria-live]:visible").first();

describe("記録の作成", () => {
  beforeEach(() => {
    cy.login();
  });

  it("見開きを2つ入力して保存すると、詳細画面に移る", () => {
    const title = `E2E 作成 ${Date.now()}`;
    cy.visit("/ja/records/new");
    position().should("contain.text", form.spreadBasics);
    cy.createRecord(title);
    cy.get("h1:visible").should("contain.text", title);
    cy.contains(ja.enums.platform.netflix).should("be.visible");
  });

  it("書く画面では、ヘッダーの記録を追加を出さない", () => {
    cy.visit("/ja/records/new");
    cy.contains("header a", ja.header.newRecord).should("not.be.visible");
  });

  it("すべての項目を入力して保存すると、詳細画面にすべて表示される", () => {
    const title = `E2E 全項目 ${Date.now()}`;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    cy.visit("/ja/records/new");
    cy.get("#title").type(title);
    cy.contains("button", form.yesterday).click();
    cy.get("#watchedAt").should("have.text", formDate(yesterday));
    cy.get('input[name=score][value="3"]').check({ force: true });
    cy.pickChoice("platform", ja.enums.platform.hulu);
    cy.pickChoice("moodTags", ja.enums.moodTag.moving);
    cy.pickChoice("moodTags", ja.enums.moodTag.dark);
    cy.get("input[type=file]:not([multiple])").selectFile(
      "cypress/fixtures/poster.png",
      { force: true },
    );
    cy.get("input[name=posterUrl]")
      .invoke("val")
      .should("match", /^https:\/\/mock\.invalid\/posters\//);

    cy.get("#originalTitle").type("Story of Your Life");
    cy.get("#releaseYear").type("2016");
    cy.get("#runtime").type("116");
    cy.get(`button[aria-label="${form.language}"]`).click();
    cy.contains("[role=option]", "英語 en").click();
    cy.get("#countries").type("us{enter}");
    cy.get("#countries").type("カナダ{enter}");
    cy.get("#countries").type("CA{enter}");
    cy.get("input[name=countries]").should("have.length", 2);
    cy.get(
      `button[aria-label="${form.removeCountry.replace("{name}", "カナダ")}"]`,
    ).click();
    cy.pickChoice("genres", ja.enums.genre.drama);
    cy.pickChoice("genres", ja.enums.genre.science_fiction);
    cy.contains("button", form.addCredit).click();
    cy.get(`input[aria-label="${form.personName}"]`)
      .eq(0)
      .type("Denis Villeneuve");
    cy.contains("button", form.addCredit).click();
    cy.get(`button[aria-label="${form.creditRole}"]`).eq(1).click();
    cy.contains("[role=option]", ja.enums.creditRole.cast).click();
    cy.get(`input[aria-label="${form.personName}"]`).eq(1).type("Amy Adams");
    cy.contains("button", form.addCredit).click();
    cy.get(`input[aria-label="${form.personName}"]`).eq(2).type("削除する行");
    cy.get(`button[aria-label="${form.removeCredit}"]`).eq(2).click();
    cy.get(`input[aria-label="${form.personName}"]`).should("have.length", 2);
    cy.get("#overview").type("言語学者が宇宙からの来訪者と対話する。");
    next();

    position().should("contain.text", form.spreadNote);
    cy.get("[role=textbox]").click().type("言語学者が主人公の SF");
    save();

    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("h1:visible").should("contain.text", title);
    cy.get("main").within(() => {
      cy.contains(weekdayDate(yesterday)).should("exist");
      cy.contains(ja.enums.platform.hulu).should("exist");
      cy.contains("2016年").should("exist");
      cy.contains("116分").should("exist");
      cy.contains("英語").should("exist");
      cy.contains("アメリカ合衆国").should("exist");
      cy.contains("カナダ").should("not.exist");
      cy.contains(ja.enums.moodTag.moving).should("exist");
      cy.contains(ja.enums.moodTag.dark).should("exist");
      cy.contains("言語学者が主人公の SF").should("exist");
      cy.contains("Story of Your Life").should("exist");
      cy.contains("言語学者が宇宙からの来訪者と対話する。").should("exist");
      cy.contains(ja.enums.genre.science_fiction).should("exist");
      cy.contains("dd", "Denis Villeneuve")
        .prev("dt")
        .should("have.text", ja.recordDetail.directors);
      cy.contains("dd", "Amy Adams")
        .prev("dt")
        .should("have.text", ja.recordDetail.cast);
      cy.contains("削除する行").should("not.exist");
      cy.get("img[src^='https://mock.invalid/posters/']").should("exist");
    });
  });

  it("スクラップのページで画像を貼ると、保存した記録に添付される", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics(`E2E 新規添付 ${Date.now()}`);
    cy.get("#releaseYear").type("2020");
    next();
    cy.get("form input[type=file][multiple]").selectFile(
      [
        "cypress/fixtures/poster.png",
        "cypress/fixtures/not-image.txt",
        "cypress/fixtures/poster.png",
      ],
      { force: true },
    );
    cy.contains("[role=alert]", form.attachmentsInvalid).should("be.visible");
    cy.get("form li img").should("have.length", 2);
    cy.contains(
      form.scrapCount.replace("{count}", "2").replace("{max}", "10"),
    ).should("be.visible");
    cy.get(
      `button[aria-label="${form.attachmentRemove.replace("{number}", "2")}"]`,
    ).click();
    cy.get("form li img").should("have.length", 1);
    save();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.turnNotebookToEnd();
    cy.get(`${notebookContent} img[src^='data:image/png']`).should(
      "have.length",
      1,
    );
  });

  it("画像は10枚までしか貼れない", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics(`E2E 新規添付上限 ${Date.now()}`);
    cy.get("#releaseYear").type("2020");
    next();
    cy.get("form input[type=file][multiple]").selectFile(
      Array.from({ length: 11 }, () => "cypress/fixtures/poster.png"),
      { force: true },
    );
    cy.contains(
      "[role=alert]",
      form.attachmentsLimit.replace("{max}", "10"),
    ).should("be.visible");
    cy.get("form li img").should("have.length", 10);
    cy.get("form input[type=file][multiple]").should("not.exist");
  });

  it("タイトルの候補を選ぶと、映画の情報とポスターが自動で入る", () => {
    cy.visit("/ja/records/new");
    cy.get("#title").type("勝手に");
    cy.contains("[role=option]", "勝手にしやがれ").click();
    cy.get("#title").should("have.value", "勝手にしやがれ");
    cy.contains(form.titleSelected).should("be.visible");
    cy.get("#originalTitle").should("have.value", "À bout de souffle");
    cy.get("#overview").invoke("val").should("contain", "自動車泥棒のミシェル");
    cy.get("#releaseYear").should("have.value", "1960");
    cy.get("#runtime").should("have.value", "90");
    cy.get(`button[aria-label="${form.language}"]`).should(
      "contain.text",
      "fr",
    );
    cy.get("input[name=countries]").should("have.value", "FR");
    cy.get("input[name=genres][value=drama]").should("exist");
    cy.get("input[name='credits.0.personName']").should(
      "have.value",
      "ジャン＝リュック・ゴダール",
    );
    cy.get("input[name=posterUrl]")
      .invoke("val")
      .should("match", /^https:\/\/image\.tmdb\.org\//);
  });

  it("ポスターを外すと、貼る枠に戻る", () => {
    cy.visit("/ja/records/new");
    cy.get("#title").type("勝手に");
    cy.contains("[role=option]", "勝手にしやがれ").click();
    cy.get(`button[aria-label="${form.posterRemove}"]`).click();
    cy.get("input[name=posterUrl]").should("have.value", "");
    cy.contains(form.posterAdd).should("be.visible");
  });

  it("カレンダーから観た日を選べる", () => {
    const first = new Date();
    first.setDate(1);
    cy.visit("/ja/records/new");
    cy.get("#watchedAt").click();
    cy.get("[role=dialog]").contains("button", /^1$/).click();
    cy.get("#watchedAt").should("have.text", formDate(first));
  });

  it("「今日」を押すと観た日が今日になる", () => {
    cy.visit("/ja/records/new");
    cy.contains("button", form.yesterday).click();
    cy.contains("button", form.today)
      .click()
      .should("have.attr", "aria-pressed", "true");
    cy.get("#watchedAt").should("have.text", formDate(new Date()));
  });

  it("観た場所は1つ選ぶとポップアップが閉じ、雰囲気はいくつでも選べる", () => {
    cy.visit("/ja/records/new");
    cy.pickChoice("platform", ja.enums.platform.mubi);
    cy.get("[data-field=platform]").should(
      "contain.text",
      ja.enums.platform.mubi,
    );
    cy.get("input[name=platform]").should("have.value", "mubi");
    cy.pickChoice("moodTags", ja.enums.moodTag.poignant);
    cy.pickChoice("moodTags", ja.enums.moodTag.minimal);
    cy.get("input[name=moodTags]").should("have.length", 2);
    cy.pickChoice("moodTags", ja.enums.moodTag.minimal);
    cy.get("input[name=moodTags]").should("have.length", 1);
  });

  it("戻るで前の見開きに戻ると、入力した内容が残っている", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("戻るテスト", { score: 2 });
    cy.get("#releaseYear").type("2020");
    next();
    position().should("contain.text", form.spreadNote);
    cy.contains("button:visible", form.back).click();
    position().should("contain.text", form.spreadBasics);
    cy.get("#title").should("have.value", "戻るテスト");
  });

  it("未入力の項目があると次へ進めず、欄の下に理由、上に項目の数を出す", () => {
    cy.visit("/ja/records/new");
    next();
    position().should("contain.text", form.spreadBasics);
    cy.contains(form.errors.title).should("be.visible");
    cy.contains(form.errors.score).should("be.visible");
    cy.contains(form.errors.platform).should("be.visible");
    cy.contains(form.errors.releaseYear).should("be.visible");
    cy.contains(form.missingCount.replace("{count}", "4")).should("be.visible");
    cy.focused().should("have.id", "title");
  });

  it("公開年が範囲外だと次へ進めず、公開年の欄に移る", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("公開年テスト", { score: 3 });
    cy.get("#releaseYear").type("1800");
    next();
    position().should("contain.text", form.spreadBasics);
    cy.contains(form.errors.releaseYear).should("be.visible");
    cy.focused().should("have.id", "releaseYear");
  });

  it("スマホでは4つのページを順に進み、ページごとに確かめる", () => {
    cy.viewport(390, 844);
    cy.visit("/ja/records/new");
    position().should("contain.text", `1 / 4 ・ ${form.pageBasics}`);
    next();
    cy.contains(form.errors.title).should("be.visible");
    cy.contains(form.errors.releaseYear).should("not.exist");
    cy.fillRecordBasics("スマホテスト", { score: 3 });
    next();
    position().should("contain.text", `2 / 4 ・ ${form.pageMovie}`);
    next();
    cy.contains(form.errors.releaseYear).should("be.visible");
    cy.get("#releaseYear").type("2020");
    next();
    position().should("contain.text", `3 / 4 ・ ${form.pageNote}`);
    next();
    position().should("contain.text", `4 / 4 ・ ${form.pageScrap}`);
    cy.contains("button:visible", form.back).click();
    position().should("contain.text", `3 / 4 ・ ${form.pageNote}`);
  });

  it("画像以外のファイルはポスターにできない", () => {
    cy.visit("/ja/records/new");
    cy.get("input[type=file]:not([multiple])").selectFile(
      {
        contents: "cypress/fixtures/not-image.txt",
        fileName: "not-image.png",
        mimeType: "text/plain",
      },
      { force: true },
    );
    cy.contains("[role=alert]", form.posterUploadError).should("be.visible");
    cy.get("input[name=posterUrl]").should("have.value", "");
  });

  it("国名でも国コードでもない入力は、制作国に追加されない", () => {
    cy.visit("/ja/records/new");
    cy.get("#countries").type("1x{enter}");
    cy.get("#countries").should("have.value", "1x");
    cy.contains("[role=alert]", form.countryNotFound).should("be.visible");
    cy.get("input[type=hidden][name=countries]").should("not.exist");
    cy.get("#countries").clear().type("ドイツ{enter}");
    cy.contains("[role=alert]", form.countryNotFound).should("not.exist");
    cy.get("input[name=countries]").should("have.value", "DE");
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
    cy.contains(form.suggestionManual).should("be.visible");
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

  it("言語を「不明」にすると、詳細画面に言語を出さない", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics(`E2E 言語不明 ${Date.now()}`, { score: 3 });
    cy.get("#releaseYear").type("2000");
    cy.get(`button[aria-label="${form.language}"]`).click();
    cy.contains("[role=option]", `${form.languageUnknown} und`).click();
    next();
    save();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("h1:visible").should("contain.text", "E2E 言語不明");
    cy.get("main").should("not.contain", form.languageUnknown);
  });

  it("アップロード中は、アップロード中と表示する", () => {
    cy.visit("/ja/records/new");
    cy.intercept({ method: "POST", url: "/ja/records/new" }, (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
    });
    cy.get("input[type=file]:not([multiple])").selectFile(
      "cypress/fixtures/poster.png",
      { force: true },
    );
    cy.contains(form.uploadingPoster).should("be.visible");
    cy.get("input[type=file]:not([multiple])").should("be.disabled");
    cy.get("input[name=posterUrl]")
      .invoke("val")
      .should("match", /^https:\/\/mock\.invalid\/posters\//);
  });

  it("5MB を超える画像はアップロードできない", () => {
    cy.visit("/ja/records/new");
    cy.get("input[type=file]:not([multiple])").selectFile(
      {
        contents: Cypress.Buffer.alloc(5 * 1024 * 1024 + 1),
        fileName: "large.png",
        mimeType: "image/png",
      },
      { force: true },
    );
    cy.contains("[role=alert]", form.posterUploadError).should("be.visible");
    cy.get("input[name=posterUrl]").should("have.value", "");
  });

  it("サーバーで不正と判定された項目があると、そのページに戻る", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("ページに戻るテスト", { score: 3 });
    cy.get("#releaseYear").type("2000");
    next();
    cy.get("input[name=language]").invoke("val", "");
    save();
    position().should("contain.text", form.spreadBasics);
    cy.contains(form.errors.language).should("be.visible");
    cy.contains(form.missingCount.replace("{count}", "1")).should("be.visible");
  });

  it("保存に失敗すると、エラーを表示する", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics("__error__", { score: 3 });
    cy.get("#releaseYear").type("2000");
    next();
    save();
    cy.contains("[role=alert]", form.unexpectedError).should("be.visible");
    cy.location("pathname").should("eq", "/ja/records/new");
  });

  it("保存中は、ボタンを保存中にして回転するアイコンを出し、押せなくする", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics(`E2E 作成中 ${Date.now()}`, { score: 3 });
    cy.get("#releaseYear").type("2020");
    next();
    cy.intercept({ method: "POST", url: "/ja/records/new" }, (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
    });
    save();
    cy.contains("button:visible", form.saving)
      .should("be.disabled")
      .and("have.attr", "aria-busy", "true")
      .find("[data-spinner]")
      .should("be.visible");
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
  });
});
