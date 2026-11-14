import ja from "../../../src/i18n/dictionaries/ja.json";
import { demoAccount } from "../../support/commands";

describe("ログアウト", () => {
  it("ログアウトするとログイン画面に移り、記録の一覧を開けなくなる", () => {
    cy.visit("/ja/login");
    cy.get("#email").type(demoAccount.email);
    cy.get("#password").type(demoAccount.password);
    cy.contains("button", ja.login.submit).click();
    cy.location("pathname").should("eq", "/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.intercept({ method: "POST", url: "/ja/records" }, (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
    });
    cy.contains("[role=menuitem]", ja.header.logout).click();
    cy.contains("[role=menuitem]", ja.header.loggingOut)
      .should("have.attr", "aria-busy", "true")
      .find("[data-spinner]")
      .should("be.visible");
    cy.location("pathname").should("eq", "/ja/login");
    cy.getCookie("access_token").should("be.null");
    cy.getCookie("refresh_token").should("be.null");
    cy.visit("/ja/records");
    cy.location("pathname").should("eq", "/ja/login");
  });
});
