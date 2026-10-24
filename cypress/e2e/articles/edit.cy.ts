import ja from "../../../src/i18n/dictionaries/ja.json";

const form = ja.articleForm;
const editor = ja.articleEditor;

function body() {
  return cy.get("[role=textbox]");
}

describe("記事の編集", () => {
  beforeEach(() => {
    cy.login();
  });

  it("今の内容が入った状態で開く", () => {
    cy.visit("/ja/records/1/articles/1/edit");
    cy.get("h1:visible").should("have.text", form.editTitle);
    cy.get("#title").should("have.value", "ジャンプカットが生んだ速度");
    body().within(() => {
      cy.contains("h2", "編集の話").should("be.visible");
      cy.contains("ul li", "カットのつなぎ目").should("exist");
      cy.contains("ul li", "台詞の間").should("exist");
      cy.contains("ul li", "街の音").should("exist");
      cy.contains(
        "blockquote",
        "映画は、撮り方よりも、切り方で決まる。",
      ).should("exist");
    });
  });

  it("記事のページの編集から、編集画面に移る", () => {
    cy.visit("/ja/records/1/articles/2");
    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.location("pathname").should("eq", "/ja/records/1/articles/2/edit");
  });

  it("タイトルと本文を変えて保存すると、記事のページに反映される", () => {
    cy.createRecord(`E2E 記事の編集 ${Date.now()}`);
    cy.createArticle("編集前のタイトル", "編集前の本文");
    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.get("#title").should("have.value", "編集前のタイトル");
    body().should("contain.text", "編集前の本文");

    cy.get("#title").clear().type("編集後のタイトル");
    body().click().type("{selectall}編集後の本文{selectall}");
    cy.get(`button[aria-label="${editor.bold}"]`).click();
    cy.contains("button", form.save).click();

    cy.location("pathname").should(
      "match",
      /^\/ja\/records\/\d+\/articles\/\d+$/,
    );
    cy.get("h1:visible").should("have.text", "編集後のタイトル");
    cy.get("article").within(() => {
      cy.contains("strong", "編集後の本文").should("be.visible");
      cy.contains("編集前の本文").should("not.exist");
    });
  });

  it("記事一覧から開いて保存すると、もどるで同じ検索の一覧にもどる", () => {
    const title = `E2E 一覧から編集 ${Date.now()}`;
    cy.createRecord(`${title} の記録`);
    cy.createArticle(title);
    cy.visit(`/ja/articles?keyword=${encodeURIComponent(title)}`);
    cy.contains("main ul > li a", title).click();
    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.get("#title").clear().type(`${title} 改`);
    cy.contains("button", form.save).click();
    cy.location("pathname").should(
      "match",
      /^\/ja\/records\/\d+\/articles\/\d+$/,
    );
    cy.contains("a", ja.articleDetail.backToList).click();
    cy.location("pathname").should("eq", "/ja/articles");
    cy.location("search").should("contain", "keyword=");
    cy.contains("main a", `${title} 改`).should("be.visible");
  });

  it("保存すると、一覧のタイトルも変わる", () => {
    cy.createRecord(`E2E 一覧の更新 ${Date.now()}`);
    cy.createArticle("古いタイトル");
    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.get("#title").clear().type("新しいタイトル");
    cy.contains("button", form.save).click();
    cy.contains("header a", "E2E 一覧の更新").click();
    cy.contains("main a", "新しいタイトル").should("be.visible");
    cy.contains("main a", "古いタイトル").should("not.exist");
  });

  it("タイトルを空にして保存すると、エラーを表示して画面に残る", () => {
    cy.createRecord(`E2E 編集の空タイトル ${Date.now()}`);
    cy.createArticle("消すタイトル");
    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.get("#title").clear();
    cy.contains("button", form.save).click();
    cy.contains("[role=alert]", form.invalidInput).should("be.visible");
    cy.contains(form.errors.title).should("be.visible");
    cy.location("pathname").should("match", /\/edit$/);
  });

  it("サーバーのエラーでは、保存できなかったことを表示する", () => {
    cy.createRecord(`E2E 編集の失敗 ${Date.now()}`);
    cy.createArticle("失敗する記事");
    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.get("#title").clear().type("__error__");
    cy.contains("button", form.save).click();
    cy.contains("[role=alert]", form.unexpectedError).should("be.visible");
    cy.location("pathname").should("match", /\/edit$/);
  });

  it("やめるを押すと、変更せずに記事のページにもどる", () => {
    cy.createRecord(`E2E 編集をやめる ${Date.now()}`);
    cy.createArticle("変えない記事", "変えない本文");
    cy.get(`a[aria-label="${ja.articleDetail.edit}"]`).click();
    cy.get("#title").clear().type("変更しないタイトル");
    cy.contains("a", form.cancel).click();
    cy.location("pathname").should(
      "match",
      /^\/ja\/records\/\d+\/articles\/\d+$/,
    );
    cy.get("h1:visible").should("have.text", "変えない記事");
  });

  it("上のバーの戻るで、記事のページにもどる", () => {
    cy.visit("/ja/records/1/articles/1/edit");
    cy.get(`header a[aria-label="${form.back}"]`).click();
    cy.location("pathname").should("eq", "/ja/records/1/articles/1");
  });
});
