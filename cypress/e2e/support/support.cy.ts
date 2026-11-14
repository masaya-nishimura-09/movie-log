import ja from "../../../src/i18n/dictionaries/ja.json";

const support = ja.support;

function choose(label: string) {
  cy.contains("label", label).click();
}

describe("応援", () => {
  beforeEach(() => {
    cy.login();
  });

  it("アカウントメニューから開ける", () => {
    cy.visit("/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.contains("[role=menuitem]", ja.header.support).click();
    cy.location("pathname").should("eq", "/ja/support");
  });

  it("金額を選ぶページを開ける", () => {
    cy.visit("/ja/support");
    cy.contains("h1", support.title).should("be.visible");
    for (const label of ["300円", "500円", "1,000円", support.custom]) {
      cy.contains("label", label).should("be.visible");
    }
    cy.get("#customAmount").should("not.exist");
    cy.contains(support.stripeNote).should("be.visible");
  });

  it("特定商取引法に基づく表記に移れる", () => {
    cy.visit("/ja/support");
    cy.contains("a", ja.legal.commerceLink).click();
    cy.location("pathname").should("eq", "/ja/commerce");
  });

  it("金額を選ばずに進むと、エラーを表示する", () => {
    cy.visit("/ja/support");
    cy.contains("button", support.submit).click();
    cy.contains(support.choiceRequired).should("be.visible");
    cy.location("pathname").should("eq", "/ja/support");
  });

  it("金額を指定すると入力欄を出し、範囲外や空ではエラーを表示する", () => {
    cy.visit("/ja/support");
    choose(support.custom);
    cy.get("#customAmount").should("be.visible");
    cy.contains(support.customAmountHint).should("be.visible");
    cy.contains("button", support.submit).click();
    cy.contains(support.customAmountRequired).should("be.visible");
    for (const value of ["99", "10001", "abc"]) {
      cy.get("#customAmount").clear().type(value);
      cy.contains("button", support.submit).click();
      cy.contains(support.customAmountOutOfRange).should("be.visible");
    }
  });

  it("金額を選んで進むと、支払いのあとのお礼のページを表示する", () => {
    cy.visit("/ja/support");
    choose("500円");
    cy.contains("button", support.submit).click();
    cy.location("pathname").should("eq", "/ja/support/thanks");
    cy.contains("h1", support.thanksTitle).should("be.visible");
    cy.contains("500円の応援を受け取りました").should("be.visible");
    cy.contains("a", support.thanksBack).click();
    cy.location("pathname").should("eq", "/ja/records");
  });

  it("金額を指定して進むと、お礼のページを表示する", () => {
    cy.visit("/ja/support");
    choose(support.custom);
    cy.get("#customAmount").type("１,２００");
    cy.contains("button", support.submit).click();
    cy.location("pathname").should("eq", "/ja/support/thanks");
    cy.contains("1,200円の応援を受け取りました").should("be.visible");
  });

  it("支払いの済んでいない URL でお礼のページを開くと、金額を選ぶページに戻す", () => {
    for (const query of ["", "?session_id=cs_test_unpaid"]) {
      cy.visit(`/ja/support/thanks${query}`);
      cy.location("pathname").should("eq", "/ja/support");
    }
  });

  it("支払いへ進む途中は、ボタンの文言を変えて回転するアイコンを出し、押せなくする", () => {
    cy.visit("/ja/support");
    choose("500円");
    cy.intercept({ method: "POST", url: "/ja/support" }, (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
    });
    cy.contains("button", support.submit).click();
    cy.contains("button", support.submitting)
      .should("be.disabled")
      .and("have.attr", "aria-busy", "true")
      .find("[data-spinner]")
      .should("be.visible");
    cy.location("pathname").should("eq", "/ja/support/thanks");
  });
});
