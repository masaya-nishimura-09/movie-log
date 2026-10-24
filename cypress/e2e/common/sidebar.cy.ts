import ja from "../../../src/i18n/dictionaries/ja.json";

const nav = ja.nav;
const sidebar = `nav[aria-label="${nav.label}"]`;

const mainItems = `${sidebar} > div:first-child a`;

function item(label: string) {
  return cy.contains(mainItems, label);
}

describe("サイドバー", () => {
  beforeEach(() => {
    cy.login();
    cy.viewport(1280, 800);
  });

  it("ホーム、記録する、鑑賞記録、記事を同じ形で並べ、文字をアイコンの横に出す", () => {
    cy.visit("/ja/records");
    cy.get(mainItems).then(($links) => {
      expect([...$links].map((link) => link.textContent)).to.deep.equal([
        nav.home,
        nav.newRecord,
        nav.records,
        nav.articles,
      ]);
      const heights = [...$links].map(
        (link) => link.getBoundingClientRect().height,
      );
      expect(new Set(heights).size).to.eq(1);
      expect(heights[0]).to.eq(44);
      const [first] = $links;
      const icon = first?.querySelector("span")?.getBoundingClientRect();
      const box = first?.getBoundingClientRect();
      expect(icon?.top ?? 0).to.be.greaterThan(box?.top ?? 0);
      expect(icon?.bottom ?? 0).to.be.lessThan(box?.bottom ?? 0);
    });
  });

  it("各項目から、それぞれのページに移る", () => {
    cy.visit("/ja/records");
    item(nav.articles).click();
    cy.location("pathname").should("eq", "/ja/articles");
    item(nav.records).click();
    cy.location("pathname").should("eq", "/ja/records");
    item(nav.newRecord).click();
    cy.location("pathname").should("eq", "/ja/records/new");
    item(nav.home).click();
    cy.location("pathname").should("eq", "/ja/home");
  });

  for (const [path, label] of [
    ["/ja/home", nav.home],
    ["/ja/records", nav.records],
    ["/ja/records/1", nav.records],
    ["/ja/records/1/edit", nav.records],
    ["/ja/articles", nav.articles],
    ["/ja/records/1/articles/1", nav.articles],
    ["/ja/records/1/articles/1/edit", nav.articles],
    ["/ja/records/new", nav.newRecord],
  ] as const) {
    it(`${path} では「${label}」だけが現在の項目になる`, () => {
      cy.visit(path);
      cy.get(`${sidebar} a[aria-current="page"]`)
        .should("have.length", 1)
        .and("contain.text", label);
    });
  }

  it("アカウント設定では、現在の項目がない", () => {
    cy.visit("/ja/account");
    cy.get(`${sidebar} a[aria-current="page"]`).should("not.exist");
  });

  it("上のバーには、記事と記録するのリンクや、サイドバーの開閉ボタンを出さない", () => {
    cy.visit("/ja/records");
    cy.get("header")
      .first()
      .within(() => {
        cy.contains("a", nav.articles).should("not.exist");
        cy.contains("a", nav.newRecord).should("not.exist");
        cy.get("button[aria-controls]").should("not.exist");
      });
  });

  it("1024px 未満では、アイコンだけを出し、文字は読み上げ用に残す", () => {
    cy.viewport(800, 800);
    cy.visit("/ja/records");
    cy.get(mainItems).each(($link) => {
      expect($link.text()).not.to.eq("");
      cy.wrap($link).find("span").first().should("be.visible");
      cy.wrap($link).find("span").last().should("have.class", "sr-only");
    });
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(800);
    });
  });

  it("1024px 以上では、検索欄の左端を枠の左端に揃える", () => {
    for (const width of [1280, 1600]) {
      cy.viewport(width, 800);
      cy.visit("/ja/records");
      cy.get("header form").then(($form) => {
        cy.get("main").should(($main) => {
          expect($form[0]?.getBoundingClientRect().left).to.eq(
            $main[0]?.getBoundingClientRect().left,
          );
        });
      });
    }
  });

  it("下端に、このアプリについてとお問い合わせをアイコン付きで置き、アイコンの左端をロゴと揃える", () => {
    cy.visit("/ja/records");
    for (const [label, path] of [
      [ja.header.about, "/ja/about"],
      [ja.header.contact, "/ja/contact"],
    ] as const) {
      cy.contains(`${sidebar} a`, label)
        .should("have.attr", "href", path)
        .then(($link) => {
          cy.get("main").then(($main) => {
            expect($link[0]?.getBoundingClientRect().bottom).to.be.greaterThan(
              ($main[0]?.getBoundingClientRect().bottom ?? 0) - 80,
            );
          });
        });
    }
    cy.get("header a svg").then(($logo) => {
      cy.contains(`${sidebar} a`, ja.header.about).then(($link) => {
        const icon = $link[0]?.querySelector("svg");
        expect(icon).to.exist;
        expect(icon?.getBoundingClientRect().left).to.be.closeTo(
          $logo[0]?.getBoundingClientRect().left ?? 0,
          1,
        );
      });
    });
  });

  it("1024px 以上では、アカウントメニューにこのアプリについてとお問い合わせを出さない", () => {
    cy.visit("/ja/records");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.contains("[role=menuitem]", ja.header.account).should("be.visible");
    cy.contains("[role=menuitem]", ja.header.about).should("not.be.visible");
    cy.contains("[role=menuitem]", ja.header.contact).should("not.be.visible");
  });

  it("768〜1023px では、下端のリンクを出さず、アカウントメニューから開ける", () => {
    cy.viewport(800, 800);
    cy.visit("/ja/records");
    cy.contains(`${sidebar} a`, ja.header.about).should("not.be.visible");
    cy.get(`[aria-label="${ja.header.accountMenu}"]`).click();
    cy.contains("[role=menuitem]", ja.header.about).should("be.visible");
    cy.contains("[role=menuitem]", ja.header.contact).should("be.visible");
  });

  it("スマホでは表示せず、ハンバーガーを出す", () => {
    cy.viewport("iphone-x");
    cy.visit("/ja/records");
    cy.get(sidebar).should("not.be.visible");
    cy.get(`button[aria-label="${ja.header.openMenu}"]`).should("be.visible");
  });

  it("英語の画面でも表示する", () => {
    cy.visit("/en/records");
    cy.contains("nav a", "Articles").should("be.visible");
  });
});
