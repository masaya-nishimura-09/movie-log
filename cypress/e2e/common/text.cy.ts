import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";
import { demoAccount } from "../../support/commands";
import { fill, pattern, shows } from "../../support/text";

const locales = [
  ["ja", ja],
  ["en", en],
] as const;

for (const [lang, t] of locales) {
  describe(`画面の文言（${lang}）`, () => {
    it("トップページ", () => {
      cy.visit(`/${lang}`);
      cy.title().should("eq", t.metadata.title);
      cy.get("meta[name=description]").should(
        "have.attr",
        "content",
        t.metadata.description,
      );
      shows(
        t.landing.headline,
        t.landing.lead,
        t.landing.start,
        t.landing.login,
        t.landing.recommend.title,
        t.landing.recommend.text,
        t.landing.closing,
        t.about.link,
        t.register.termsLink,
        t.register.privacyLink,
        t.contact.link,
      );
      for (const feature of t.landing.features)
        shows(feature.title, feature.text);
      for (const alt of [
        t.landing.listAlt,
        t.landing.detailAlt,
        t.landing.recommend.alt,
      ]) {
        cy.get(`img[alt="${alt}"]`).should("exist");
      }
    });

    it("ログイン", () => {
      cy.visit(`/${lang}/login`);
      cy.title().should("eq", `${t.login.submit} | ${t.metadata.title}`);
      shows(
        t.brand.name,
        t.brand.tagline,
        t.login.email,
        t.login.password,
        t.login.passwordHint,
        t.login.submit,
        t.login.toRegisterPrompt,
        t.login.toRegister,
        t.about.link,
      );
    });

    it("新規登録", () => {
      cy.visit(`/${lang}/register`);
      shows(
        t.register.title,
        t.register.description,
        t.register.username,
        t.register.email,
        t.register.password,
        t.register.passwordHint,
        fill(t.register.agreeTerms, { terms: t.register.termsLink }),
        fill(t.register.privacyNote, { privacy: t.register.privacyLink }),
        t.register.submit,
        t.register.toLoginPrompt,
        t.register.toLogin,
        fill(t.characterCount, { current: 0, max: 100 }),
      );
    });

    it("お問い合わせ", () => {
      cy.visit(`/${lang}/contact`);
      shows(
        t.contact.title,
        t.contact.intro,
        t.contact.email,
        t.contact.emailHint,
        t.contact.message,
        t.contact.submit,
        t.contact.back,
        fill(t.characterCount, { current: 0, max: 2000 }),
      );
    });

    it("このアプリについて", () => {
      cy.visit(`/${lang}/about`);
      shows(
        t.brand.tagline,
        t.about.creditsHeading,
        t.about.tmdbNotice,
        t.register.termsLink,
        t.register.privacyLink,
        t.about.back,
      );
    });

    for (const [path, document] of [
      ["terms", t.legal.terms],
      ["privacy", t.legal.privacy],
    ] as const) {
      it(`${document.title}の全文`, () => {
        cy.visit(`/${lang}/${path}`);
        shows(
          document.title,
          `${t.legal.updatedLabel}: ${t.legal.updated}`,
          document.intro,
          t.legal.contactLabel,
          t.legal.back,
        );
        for (const section of document.sections) {
          shows(section.h, ...section.p);
        }
      });
    }

    describe("ログイン後の画面", () => {
      beforeEach(() => {
        cy.login(demoAccount);
      });

      it("記録の一覧とヘッダー", () => {
        cy.visit(`/${lang}/records?score=5`);
        cy.title().should(
          "eq",
          `${t.recordList.heading} | ${t.metadata.title}`,
        );
        shows(t.recordList.heading, t.bottomNav.newRecord);
        cy.contains(
          pattern(`${t.recordList.summary} ・ ${t.recordList.activeFilters}`),
        ).should("exist");
        cy.get(`input[placeholder="${t.header.searchPlaceholder}"]`).should(
          "exist",
        );
        for (const label of [
          t.header.themeToggle,
          t.header.accountMenu,
          t.recordSort.label,
        ]) {
          cy.get(`[aria-label="${label}"]`).should("exist");
        }
        shows(
          t.recordFilter.platform,
          t.recordFilter.moodTag,
          t.recordFilter.genre,
          `${t.recordFilter.score} 5`,
          t.recordFilter.clearAll,
        );
        cy.get(
          `[aria-label="${fill(t.recordFilter.remove, { label: `${t.recordFilter.score} 5` })}"]`,
        ).should("exist");
        cy.get(`[aria-label="${t.header.accountMenu}"]`).click();
        shows(
          t.header.account,
          t.header.about,
          t.header.contact,
          t.header.logout,
        );
      });

      it("ページ送り", () => {
        cy.visit(`/${lang}/records`);
        cy.contains(pattern(t.pagination.status)).should("exist");
        cy.get(`[aria-label="${t.pagination.previous}"]`).should("exist");
        cy.get(`[aria-label="${t.pagination.next}"]`).should("exist");
      });

      it("一致する記録がないとき", () => {
        cy.visit(`/${lang}/records?q=no-match-title`);
        shows(t.recordList.noMatch, t.recordList.clearFilters);
      });

      it("記録の詳細", () => {
        cy.visit(`/${lang}/records/1`);
        shows(
          t.recordDetail.scoreCaption,
          t.recordDetail.memo,
          t.recordDetail.credits,
          t.recordDetail.watchedAt,
          t.recordDetail.platform,
          t.recordDetail.createdAt,
          t.recordDetail.updatedAt,
          t.recordDetail.back,
          t.recordDetail.edit,
          t.recordForm.releaseYear,
          t.recordForm.runtime,
          t.recordForm.countries,
          t.recordForm.language,
          fill(t.recordDetail.releaseYear, { year: 1960 }),
          fill(t.recordDetail.runtime, { minutes: 90 }),
        );
        cy.get(
          `[aria-label="${fill(t.recordCard.score, { score: 4 })}"]`,
        ).should("exist");
        cy.get(`button[aria-label="${t.recordDetail.delete}"]`).click();
        shows(
          t.deleteRecord.title,
          t.deleteRecord.cancel,
          t.deleteRecord.confirm,
        );
      });

      it("記録の作成の3つのステップ", () => {
        cy.visit(`/${lang}/records/new`);
        shows(
          t.recordForm.createTitle,
          t.recordForm.stepBasics,
          t.recordForm.stepMovieInfo,
          t.recordForm.stepImpression,
          t.recordForm.title,
          t.recordForm.titleHint,
          t.recordForm.watchedAt,
          t.recordForm.today,
          t.recordForm.yesterday,
          t.recordForm.score,
          t.recordForm.scoreHint,
          t.recordForm.platform,
          t.recordForm.next,
          fill(t.characterCount, { current: 0, max: 255 }),
        );
        cy.get(`[title="${t.recordForm.required}"]`).should("exist");
        cy.fillRecordBasics("Arrival", { score: 3, lang });
        cy.contains("button", t.recordForm.next).click();
        shows(
          t.recordForm.movieInfoHint,
          t.recordForm.releaseYear,
          fill(t.recordForm.releaseYearHint, {
            max: new Date().getFullYear() + 5,
          }),
          t.recordForm.runtime,
          t.recordForm.runtimeUnit,
          t.recordForm.runtimeHint,
          t.recordForm.language,
          t.recordForm.languageHint,
          t.recordForm.countries,
          t.recordForm.genres,
          t.recordForm.genresHint,
          t.recordForm.credits,
          t.recordForm.creditsHint,
          t.recordForm.addCredit,
          t.recordForm.posterUrl,
          t.recordForm.uploadPoster,
          t.recordForm.back,
        );
        for (const placeholder of [
          t.recordForm.countriesPlaceholder,
          t.recordForm.personName,
          t.recordForm.posterUrlPlaceholder,
        ]) {
          cy.get(`input[placeholder="${placeholder}"]`).should("exist");
        }
        for (const label of [
          t.recordForm.creditRole,
          t.recordForm.removeCredit,
        ]) {
          cy.get(`[aria-label="${label}"]`).should("exist");
        }
        cy.get("#countries").type("jp{enter}");
        cy.get(
          `[aria-label="${fill(t.recordForm.removeCountry, {
            name:
              new Intl.DisplayNames(lang, { type: "region" }).of("JP") ?? "JP",
          })}"]`,
        ).should("exist");
        cy.get("#releaseYear").type("2016");
        cy.contains("button", t.recordForm.next).click();
        shows(
          t.recordForm.impressionHeading,
          t.recordForm.optional,
          t.recordForm.moodTags,
          t.recordForm.moodTagsHint,
          t.recordForm.memo,
          t.recordForm.save,
          fill(t.characterCount, { current: 0, max: 1000 }),
        );
      });

      it("記録の編集", () => {
        cy.visit(`/${lang}/records/1/edit`);
        shows(
          t.recordForm.editTitle,
          t.recordForm.watchSection,
          t.recordForm.movieSection,
          t.recordForm.stepImpression,
          t.recordForm.cancel,
          t.recordForm.saveChanges,
        );
      });

      it("アカウント設定と退会の確認", () => {
        cy.visit(`/${lang}/account`);
        shows(
          t.account.title,
          t.account.notice,
          t.account.username,
          t.account.email,
          t.account.usernameTitle,
          t.account.emailTitle,
          t.account.passwordTitle,
          t.account.currentPassword,
          t.account.currentPasswordHint,
          t.account.newPassword,
          t.account.passwordHint,
          t.account.cancel,
          t.account.save,
          t.account.withdrawTitle,
          t.account.withdrawDescription,
          t.account.withdrawAction,
        );
        cy.contains("button", t.account.withdrawAction).click();
        cy.get("[role=alertdialog]").within(() => {
          shows(
            t.account.withdrawConfirmTitle,
            t.account.withdrawDescription,
            t.account.withdrawCancel,
            t.account.withdrawConfirm,
          );
        });
      });

      it("ページが見つからないとき", () => {
        cy.visit(`/${lang}/records/999999`, { failOnStatusCode: false });
        shows(t.notFound.title, t.notFound.description, t.notFound.action);
      });

      it("読み込みエラー", () => {
        cy.visit(`/${lang}/records?q=__error__`, { failOnStatusCode: false });
        shows(t.errorPage.title, t.errorPage.description, t.errorPage.retry);
      });
    });

    it("記録が0件のとき", () => {
      cy.register();
      cy.visit(`/${lang}/records`);
      shows(t.emptyState.title, t.emptyState.description, t.emptyState.action);
    });

    it("スマホの下のナビと、絞り込みのシート", () => {
      cy.viewport("iphone-x");
      cy.login(demoAccount);
      cy.visit(`/${lang}/records`);
      shows(t.bottomNav.records, t.bottomNav.newRecord, t.bottomNav.account);
      cy.get(`[aria-label="${t.header.openSearch}"]`).should("exist");
      cy.get(`button[aria-label="${t.recordFilter.open}"]`).click();
      cy.get("[role=dialog]").within(() => {
        shows(
          t.recordFilter.title,
          t.recordFilter.clearAll,
          t.recordSort.label,
          t.recordFilter.score,
          t.recordFilter.platform,
          t.recordFilter.moodTag,
          t.recordFilter.genre,
          fill(t.recordFilter.showAllPlatforms, {
            count: Object.keys(t.enums.platform).length,
          }),
        );
        cy.contains("button", pattern(t.recordFilter.showResults)).should(
          "exist",
        );
      });
    });
  });
}
