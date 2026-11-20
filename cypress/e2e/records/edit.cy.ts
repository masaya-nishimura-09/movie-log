import ja from "../../../src/i18n/dictionaries/ja.json";
import { notebookContent } from "../../support/commands";
import { weekdayDate } from "../../support/text";

const form = ja.recordForm;

const position = () => cy.get("[aria-live]:visible").first();
const toNote = () => cy.contains("button:visible", form.toNote).click();
const saveChanges = () =>
  cy.contains("button:visible", form.saveChanges).click();
const openEdit = () => {
  cy.contains("a", ja.recordDetail.edit).click();
  cy.location("pathname").should("match", /\/edit$/);
};

function createWithScraps(title: string, count: number) {
  cy.visit("/ja/records/new");
  cy.fillRecordBasics(title);
  cy.get("#releaseYear").type("2020");
  cy.contains("button:visible", form.next).click();
  cy.get("form input[type=file][multiple]").selectFile(
    Array.from({ length: count }, () => "cypress/fixtures/poster.png"),
    { force: true },
  );
  cy.contains("button:visible", form.save).click();
  cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
}

describe("記録の編集", () => {
  beforeEach(() => {
    cy.login();
  });

  it("今の内容が入った状態で開き、記録した日時を出す", () => {
    const title = `E2E 編集の初期値 ${Date.now()}`;
    cy.createRecord(title);
    openEdit();
    cy.get("#title").should("have.value", title);
    cy.get('input[name=score][value="4"]').should("be.checked");
    cy.get("input[name=platform]").should("have.value", "netflix");
    cy.get("#releaseYear").should("have.value", "2020");
    cy.contains(form.recordedLabel).should("be.visible");
    cy.contains(form.updatedLabel).should("be.visible");
    position().should("contain.text", form.editing);
  });

  it("原題、あらすじ、ポスターも、今の内容が入った状態で開く", () => {
    cy.visit("/ja/records/1/edit");
    cy.get("#originalTitle").should("have.value", "À bout de souffle");
    cy.get("#overview").invoke("val").should("contain", "自動車泥棒のミシェル");
    cy.get("input[name=posterUrl]")
      .invoke("val")
      .should("match", /^https:\/\/image\.tmdb\.org\//);
  });

  it("すべての項目を変えて保存すると、詳細画面に反映される", () => {
    const title = `E2E 編集 ${Date.now()}`;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    cy.createRecord(title);
    openEdit();

    cy.get("#title").clear().type(`${title} 改`);
    cy.contains("button", form.yesterday).click();
    cy.get('input[name=score][value="2"]').check({ force: true });
    cy.pickChoice("platform", ja.enums.platform.hulu);
    cy.pickChoice("moodTags", ja.enums.moodTag.tense);
    cy.get("input[type=file]:not([multiple])").selectFile(
      "cypress/fixtures/poster.png",
      { force: true },
    );
    cy.get("#originalTitle").clear().type("The Matrix");
    cy.get("#overview").clear().type("仮想現実から目覚める話。");
    cy.get("#releaseYear").clear().type("1999");
    cy.get("#runtime").clear().type("136");
    cy.get(`button[aria-label="${form.language}"]`).click();
    cy.contains("[role=option]", "英語 en").click();
    cy.get("#countries").type("us{enter}");
    cy.pickChoice("genres", ja.enums.genre.action);
    cy.contains("button", form.addCredit).click();
    cy.get(`input[aria-label="${form.personName}"]`)
      .first()
      .type("Lana Wachowski");
    toNote();
    position().should("contain.text", form.spreadNote);
    cy.get("[role=textbox]").click().type("2回目に観たときの感想");
    saveChanges();

    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("h1:visible").should("contain.text", `${title} 改`);
    cy.get("main").within(() => {
      cy.contains(weekdayDate(yesterday)).should("exist");
      cy.contains(ja.enums.platform.hulu).should("exist");
      cy.contains("1999年").should("exist");
      cy.contains("136分").should("exist");
      cy.contains("英語").should("exist");
      cy.contains(ja.enums.moodTag.tense).should("exist");
      cy.contains("2回目に観たときの感想").should("exist");
      cy.get("img[src^='https://mock.invalid/posters/']").should("exist");
      cy.contains("The Matrix").should("exist");
      cy.contains("仮想現実から目覚める話。").should("exist");
      cy.contains(ja.enums.genre.action).should("exist");
      cy.contains("dd", "Lana Wachowski").should("exist");
    });
  });

  it("1つ目の見開きのままでも、変更を保存できる", () => {
    const title = `E2E すぐ保存 ${Date.now()}`;
    cy.createRecord(title);
    openEdit();
    cy.get("#title").clear().type(`${title} 改`);
    saveChanges();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("h1:visible").should("contain.text", `${title} 改`);
  });

  it("キャンセルを押すと、変更せずに詳細画面に戻る", () => {
    const title = `E2E 編集取り消し ${Date.now()}`;
    cy.createRecord(title);
    openEdit();
    cy.get("#title").clear().type("変更しないタイトル");
    cy.contains("a:visible", form.cancel).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("h1:visible").should("contain.text", title);
  });

  it("記録に戻るで、詳細画面に戻る", () => {
    cy.visit("/ja/records/1/edit");
    cy.contains("a", form.backToRecord).click();
    cy.location("pathname").should("eq", "/ja/records/1");
  });

  it("クレジットとジャンルを外して保存すると、詳細画面から消える", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics(`E2E 外す ${Date.now()}`, { score: 3 });
    cy.get("#releaseYear").type("2001");
    cy.pickChoice("genres", ja.enums.genre.drama);
    cy.contains("button", form.addCredit).click();
    cy.get(`input[aria-label="${form.personName}"]`).first().type("外す監督");
    cy.contains("button:visible", form.next).click();
    cy.contains("button:visible", form.save).click();
    cy.contains("dd", "外す監督").should("exist");

    openEdit();
    cy.pickChoice("genres", ja.enums.genre.drama);
    cy.get(`button[aria-label="${form.removeCredit}"]`).first().click();
    saveChanges();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("main").contains("外す監督").should("not.exist");
    cy.get("main").contains(ja.enums.genre.drama).should("not.exist");
  });

  it("クレジットが5人以上あると、5人目からはまとめて開いて編集する", () => {
    cy.visit("/ja/records/1/edit");
    cy.get(`input[aria-label="${form.personName}"]:visible`).should(
      "have.length",
      4,
    );
    cy.contains("button", form.moreCredits.split("{count}")[0]).click();
    cy.get("[data-slot=popover-content]").within(() => {
      cy.contains(form.creditsTitle).should("be.visible");
      cy.get(`input[aria-label="${form.personName}"]`).should("have.length", 7);
      cy.get(`input[aria-label="${form.personName}"]`).last().clear();
      cy.get(`input[aria-label="${form.personName}"]`).last().type("最後の人");
      cy.contains("button", form.done).click();
    });
    cy.get("input[name='credits.6.personName']").should(
      "have.value",
      "最後の人",
    );
  });

  it("貼ってある画像を外し、新しい画像を足して保存すると、詳細画面に反映される", () => {
    createWithScraps(`E2E 編集添付 ${Date.now()}`, 1);
    openEdit();
    toNote();
    cy.get("form li img").should("have.length", 1);
    cy.get(
      `button[aria-label="${form.attachmentRemove.replace("{number}", "1")}"]`,
    ).click();
    cy.get("form li img").should("have.length", 0);
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
    saveChanges();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.turnNotebookToEnd();
    cy.get(`${notebookContent} img[src^='data:image/png']`).should(
      "have.length",
      2,
    );
  });

  it("貼ってある画像も含めて10枚までしか貼れない", () => {
    createWithScraps(`E2E 編集添付上限 ${Date.now()}`, 3);
    openEdit();
    toNote();
    cy.get("form li img").should("have.length", 3);
    cy.get("form input[type=file][multiple]").selectFile(
      Array.from({ length: 8 }, () => "cypress/fixtures/poster.png"),
      { force: true },
    );
    cy.contains(
      "[role=alert]",
      form.attachmentsLimit.replace("{max}", "10"),
    ).should("be.visible");
    cy.get("form li img").should("have.length", 10);
    cy.get("form input[type=file][multiple]").should("not.exist");
  });

  it("画像を外してもキャンセルすると、添付は変わらない", () => {
    createWithScraps(`E2E 編集添付取り消し ${Date.now()}`, 1);
    openEdit();
    toNote();
    cy.get(
      `button[aria-label="${form.attachmentRemove.replace("{number}", "1")}"]`,
    ).click();
    cy.contains("button:visible", form.back).click();
    cy.contains("a:visible", form.cancel).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.turnNotebookToEnd();
    cy.get(`${notebookContent} img[src^='data:image/png']`).should(
      "have.length",
      1,
    );
  });

  it("ノートへ進むとき、1つ目の見開きにエラーがあると進まずに欄の下に理由を出す", () => {
    cy.createRecord(`E2E 見開きのエラー ${Date.now()}`);
    openEdit();
    cy.get("#releaseYear").clear().type("1800");
    toNote();
    cy.contains(form.errors.releaseYear).should("be.visible");
    position().should("contain.text", form.spreadBasics);
    cy.get("#releaseYear").clear().type("2000");
    toNote();
    position().should("contain.text", form.spreadNote);
  });
});

describe("記録の編集（サーバー側の検証と失敗）", () => {
  beforeEach(() => {
    cy.login();
  });

  it("画面の制限を越えた値を送ると、15項目すべてのエラーを表示する", () => {
    cy.createRecord(`E2E 全エラー ${Date.now()}`);
    openEdit();
    cy.get("#title").clear();
    cy.get("#releaseYear").clear().type("1800");
    cy.get("#runtime").clear().type("1441");
    cy.get("#title")
      .closest("form")
      .then(([element]) => {
        const formElement = element as HTMLFormElement;
        const set = (name: string, value: string) => {
          const input = formElement.querySelector<HTMLInputElement>(
            `input[name="${name}"]`,
          );
          if (input) input.value = value;
        };
        const add = (name: string, value: string) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          formElement.append(input);
        };
        set("watchedAt", "2999-01-01");
        set("language", "");
        set("posterUrl", "ftp://example.com/poster.jpg");
        set("originalTitle", "a".repeat(256));
        add("credits.0.creditRole", "director");
        add("credits.0.personName", "a".repeat(101));
        for (const input of formElement.querySelectorAll<HTMLInputElement>(
          "input[name=score]",
        )) {
          input.checked = false;
        }
        for (const input of formElement.querySelectorAll<HTMLInputElement>(
          "input[name=platform]",
        )) {
          input.remove();
        }
        set(
          "note",
          JSON.stringify({
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "a".repeat(100 * 1024) }],
              },
            ],
          }),
        );
        const overview =
          formElement.querySelector<HTMLTextAreaElement>("#overview");
        if (overview) overview.value = "a".repeat(2001);
        add("countries", "usa");
        add("genres", "unknown");
        add("moodTags", "unknown");
      });
    saveChanges();
    cy.contains(form.missingCount.replace("{count}", "15")).should(
      "be.visible",
    );
    for (const message of Object.values(form.errors)) {
      cy.contains(message).should("exist");
    }
  });

  it("保存に失敗すると、エラーを表示する", () => {
    cy.createRecord(`E2E 編集失敗 ${Date.now()}`);
    openEdit();
    cy.get("#title").clear().type("__error__");
    saveChanges();
    cy.contains("[role=alert]", form.unexpectedError).should("be.visible");
  });

  it("開いている間に削除された記録を保存すると、削除されていることを表示する", () => {
    cy.createRecord(`E2E 削除済みを保存 ${Date.now()}`);
    openEdit();
    cy.contains("a:visible", form.cancel).click();
    cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
    cy.contains("[role=alertdialog] button", ja.deleteRecord.confirm).click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.go(-2);
    cy.location("pathname").should("match", /\/edit$/);
    toNote();
    cy.get("[role=textbox]").click().type("削除後の保存");
    saveChanges();
    cy.contains("[role=alert]", form.notFound).should("be.visible");
  });

  it("保存中は、ボタンを保存中にして回転するアイコンを出し、押せなくする", () => {
    cy.createRecord(`E2E 保存中 ${Date.now()}`);
    openEdit();
    cy.location("pathname").then((path) => {
      cy.intercept({ method: "POST", url: path }, (req) => {
        req.on("response", (res) => {
          res.setDelay(1500);
        });
      });
    });
    saveChanges();
    cy.contains("button:visible", form.saving)
      .should("be.disabled")
      .and("have.attr", "aria-busy", "true")
      .find("[data-spinner]")
      .should("be.visible");
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
  });
});
