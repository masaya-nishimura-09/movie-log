import ja from "../../../src/i18n/dictionaries/ja.json";
import { longDate } from "../../support/text";

const form = ja.recordForm;

describe("記録の編集", () => {
  beforeEach(() => {
    cy.login();
  });

  it("今の内容が入った状態で開く", () => {
    const title = `E2E 編集の初期値 ${Date.now()}`;
    cy.createRecord(title);
    cy.contains("a", ja.recordDetail.edit).click();
    cy.get("#title").should("have.value", title);
    cy.get(`[role=radiogroup][aria-label="${form.score}"]`)
      .contains("label", "4")
      .find("input")
      .should("be.checked");
    cy.contains("label", ja.enums.platform.netflix)
      .find("input")
      .should("be.checked");
    cy.get("#releaseYear").should("have.value", "2020");
  });

  it("すべての項目を変えて保存すると、詳細画面に反映される", () => {
    const title = `E2E 編集 ${Date.now()}`;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    cy.createRecord(title);
    cy.contains("a", ja.recordDetail.edit).click();
    cy.location("pathname").should("match", /\/edit$/);

    cy.get("#title").clear().type(`${title} 改`);
    cy.contains("button", form.yesterday).click();
    cy.get(`[role=radiogroup][aria-label="${form.score}"]`)
      .contains("label", "2")
      .click();
    cy.contains("label", ja.enums.platform.hulu).click();
    cy.get("#releaseYear").clear().type("1999");
    cy.get("#runtime").clear().type("136");
    cy.get(`button[aria-label="${form.language}"]`).click();
    cy.contains("[role=option]", "英語 en").click();
    cy.get("#countries").type("us{enter}");
    cy.contains("label", ja.enums.genre.action).click();
    cy.get("input[name='credits.0.personName']").type("Lana Wachowski");
    cy.get("#posterUrl").clear().type("https://example.com/poster.jpg");
    cy.contains("label", ja.enums.moodTag.tense).click();
    cy.get("#memo").type("2回目に観たときの感想");
    cy.contains("button", form.saveChanges).click();

    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("h1:visible").should("have.text", `${title} 改`);
    cy.get("main").within(() => {
      cy.contains(longDate(yesterday)).should("exist");
      cy.contains(ja.enums.platform.hulu).should("exist");
      cy.contains("1999年").should("exist");
      cy.contains("136分").should("exist");
      cy.contains("英語").should("exist");
      cy.contains(ja.enums.genre.action).should("exist");
      cy.contains(ja.enums.moodTag.tense).should("exist");
      cy.contains("2回目に観たときの感想").should("exist");
      cy.contains("dd", "Lana Wachowski").should("exist");
      cy.get("img[src='https://example.com/poster.jpg']").should("exist");
    });
  });

  it("サーバーで不正と判定された項目は、エラーを表示する", () => {
    cy.createRecord(`E2E 編集エラー ${Date.now()}`);
    cy.contains("a", ja.recordDetail.edit).click();
    cy.get("#releaseYear").clear().type("1800");
    cy.get("#posterUrl").clear().type("ftp://example.com/poster.jpg");
    cy.contains("button", form.saveChanges).click();
    cy.contains("[role=alert]", form.invalidInput).should("be.visible");
    cy.contains(form.errors.releaseYear).should("be.visible");
    cy.contains(form.errors.posterUrl).should("be.visible");
    cy.location("pathname").should("match", /\/edit$/);
  });

  it("取り消すを押すと、変更せずに詳細画面にもどる", () => {
    const title = `E2E 編集取り消し ${Date.now()}`;
    cy.createRecord(title);
    cy.contains("a", ja.recordDetail.edit).click();
    cy.get("#title").clear().type("変更しないタイトル");
    cy.contains("a", form.cancel).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.get("h1:visible").should("have.text", title);
  });

  it("クレジットとジャンルを外して保存すると、詳細画面から消える", () => {
    cy.visit("/ja/records/new");
    cy.fillRecordBasics(`E2E 外す ${Date.now()}`, { score: 3 });
    cy.contains("button", form.next).click();
    cy.get("#releaseYear").type("2001");
    cy.contains("label", ja.enums.genre.drama).click();
    cy.get("input[name='credits.0.personName']").type("外す監督");
    cy.contains("button", form.next).click();
    cy.contains("button", form.save).click();
    cy.contains("dd", "外す監督").should("exist");

    cy.contains("a", ja.recordDetail.edit).click();
    cy.contains("label", ja.enums.genre.drama).click();
    cy.get(`button[aria-label="${form.removeCredit}"]`).first().click();
    cy.contains("button", form.saveChanges).click();
    cy.location("pathname").should("match", /^\/ja\/records\/\d+$/);
    cy.contains(ja.recordDetail.creditsEmpty).should("be.visible");
    cy.get("main").contains(ja.enums.genre.drama).should("not.exist");
  });
});

describe("記録の編集（サーバー側の検証と失敗）", () => {
  beforeEach(() => {
    cy.login();
  });

  it("画面の制限を越えた値を送ると、13項目すべてのエラーを表示する", () => {
    cy.createRecord(`E2E 全エラー ${Date.now()}`);
    cy.contains("a", ja.recordDetail.edit).click();
    cy.get("#title").clear();
    cy.get("#releaseYear").clear().type("1800");
    cy.get("#runtime").clear().type("1441");
    cy.get("#posterUrl").clear().type("ftp://example.com/poster.jpg");
    cy.get("input[name='credits.0.personName']").type("a");
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
        set("credits.0.personName", "a".repeat(101));
        for (const input of formElement.querySelectorAll<HTMLInputElement>(
          "input[name=score], input[name=platform]",
        )) {
          input.checked = false;
        }
        const memo = formElement.querySelector<HTMLTextAreaElement>("#memo");
        if (memo) memo.value = "a".repeat(1001);
        add("countries", "usa");
        add("genres", "unknown");
        add("moodTags", "unknown");
      });
    cy.contains("button", form.saveChanges).click();
    cy.contains("[role=alert]", form.invalidInput).should("be.visible");
    for (const message of Object.values(form.errors)) {
      cy.contains(message).should("exist");
    }
  });

  it("保存に失敗すると、エラーを表示する", () => {
    cy.createRecord(`E2E 編集失敗 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.edit).click();
    cy.get("#title").clear().type("__error__");
    cy.contains("button", form.saveChanges).click();
    cy.contains("[role=alert]", form.unexpectedError).should("be.visible");
  });

  it("開いている間に削除された記録を保存すると、削除されていることを表示する", () => {
    cy.createRecord(`E2E 削除済みを保存 ${Date.now()}`);
    cy.contains("a", ja.recordDetail.edit).click();
    cy.location("pathname").should("match", /\/edit$/);
    cy.contains("a", form.cancel).click();
    cy.get(`button[aria-label="${ja.recordDetail.delete}"]`).click();
    cy.contains("button", ja.deleteRecord.confirm).click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.go(-2);
    cy.location("pathname").should("match", /\/edit$/);
    cy.get("#memo").type("削除後の保存");
    cy.contains("button", form.saveChanges).click();
    cy.contains("[role=alert]", form.notFound).should("be.visible");
  });
});
