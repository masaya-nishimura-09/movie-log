import en from "../../../src/i18n/dictionaries/en.json";
import ja from "../../../src/i18n/dictionaries/ja.json";
import {
  demoAccount,
  emailChangeToken,
  newAccount,
  passwordResetToken,
  verificationToken,
} from "../../support/commands";
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
        t.landing.note.title,
        t.landing.note.text,
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
        t.landing.note.alt,
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
        t.login.forgotPassword,
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

    it("確認メールを送った画面と、確認前のログイン", () => {
      const account = newAccount(`text${lang}`);
      cy.visit(`/${lang}/register`);
      cy.get("#username").type(account.username);
      cy.get("#email").type(account.email);
      cy.get("#password").type(account.password);
      cy.get("input[name=agreedToTerms]").check();
      cy.contains("button", t.register.submit).click();
      shows(
        t.register.sentTitle,
        fill(t.register.sentText, { email: account.email }),
        t.register.sentNote,
        fill(t.resendVerification.cooldown, { seconds: 60 }),
        t.register.sentToLogin,
      );
      cy.visit(`/${lang}/login`);
      cy.get("#email").type(account.email);
      cy.get("#password").type(account.password);
      cy.contains("button", t.login.submit).click();
      shows(t.login.emailNotVerified, t.resendVerification.resend);
    });

    it("メールアドレスの確認", () => {
      cy.visit(`/${lang}/verify-email?token=wrong-token`);
      cy.title().should("eq", `${t.verifyEmail.title} | ${t.metadata.title}`);
      shows(
        t.verifyEmail.title,
        t.verifyEmail.description,
        t.verifyEmail.submit,
      );
      cy.contains("button", t.verifyEmail.submit).click();
      shows(
        t.verifyEmail.invalidTitle,
        t.verifyEmail.invalidText,
        t.verifyEmail.toLogin,
      );
    });

    it("メールアドレスの確認が済んだ画面", () => {
      const account = newAccount(`done${lang}`);
      cy.registerUnverified(account);
      cy.visit(
        `/${lang}/verify-email?token=${verificationToken(account.email)}`,
      );
      cy.contains("button", t.verifyEmail.submit).click();
      shows(
        t.verifyEmail.doneTitle,
        t.verifyEmail.doneText,
        t.verifyEmail.toLogin,
      );
    });

    it("メールアドレスの変更の確認", () => {
      cy.visit(`/${lang}/verify-email-change?token=wrong-token`);
      cy.title().should(
        "eq",
        `${t.verifyEmailChange.title} | ${t.metadata.title}`,
      );
      shows(
        t.verifyEmailChange.title,
        t.verifyEmailChange.description,
        t.verifyEmailChange.submit,
      );
      cy.contains("button", t.verifyEmailChange.submit).click();
      shows(
        t.verifyEmailChange.invalidTitle,
        t.verifyEmailChange.invalidText,
        t.verifyEmailChange.toLogin,
      );
    });

    it("メールアドレスの変更の案内と、変更が済んだ画面", () => {
      cy.register().then(({ email, password }) => {
        const newEmail = `text-${lang}-${email}`;
        cy.visit(`/${lang}/account`);
        cy.get("#email").clear().type(newEmail);
        cy.get("#emailPassword").type(password);
        cy.contains("form", t.account.emailTitle)
          .contains("button", t.account.save)
          .click();
        shows(fill(t.account.emailChangeSent, { email: newEmail }));
        cy.visit(
          `/${lang}/verify-email-change?token=${emailChangeToken(newEmail)}`,
        );
        cy.contains("button", t.verifyEmailChange.submit).click();
        shows(
          t.verifyEmailChange.doneTitle,
          t.verifyEmailChange.doneText,
          t.verifyEmailChange.toAccount,
        );
      });
    });

    it("変更先のアドレスがほかの人に使われていたとき", () => {
      cy.register().then(({ password }) => {
        const other = newAccount(`taken${lang}`);
        cy.visit(`/${lang}/account`);
        cy.get("#email").clear().type(other.email);
        cy.get("#emailPassword").type(password);
        cy.contains("form", t.account.emailTitle)
          .contains("button", t.account.save)
          .click();
        shows(fill(t.account.emailChangeSent, { email: other.email }));
        cy.registerUnverified(other);
        cy.visit(`/ja/verify-email?token=${verificationToken(other.email)}`);
        cy.contains("button", ja.verifyEmail.submit).click();
        cy.contains("h1", ja.verifyEmail.doneTitle);
        cy.visit(
          `/${lang}/verify-email-change?token=${emailChangeToken(other.email)}`,
        );
        cy.contains("button", t.verifyEmailChange.submit).click();
        shows(
          t.verifyEmailChange.emailTakenTitle,
          t.verifyEmailChange.emailTakenText,
        );
      });
    });

    it("パスワードの再設定の申し込みと、メールを送った画面", () => {
      cy.visit(`/${lang}/forgot-password`);
      cy.title().should(
        "eq",
        `${t.forgotPassword.title} | ${t.metadata.title}`,
      );
      shows(
        t.forgotPassword.title,
        t.forgotPassword.description,
        t.forgotPassword.email,
        t.forgotPassword.submit,
        t.forgotPassword.toLogin,
      );
      cy.get("#email").type("nobody@example.com");
      cy.contains("button", t.forgotPassword.submit).click();
      shows(
        t.forgotPassword.sentTitle,
        fill(t.forgotPassword.sentText, { email: "nobody@example.com" }),
        t.forgotPassword.sentNote,
        fill(t.resendPasswordReset.cooldown, { seconds: 60 }),
        t.forgotPassword.toLogin,
      );
    });

    it("新しいパスワードの設定", () => {
      cy.visit(`/${lang}/reset-password?token=any-token`);
      cy.title().should("eq", `${t.resetPassword.title} | ${t.metadata.title}`);
      shows(
        t.resetPassword.title,
        t.resetPassword.description,
        t.resetPassword.password,
        t.resetPassword.passwordHint,
        t.resetPassword.submit,
      );
      cy.get("#password").type("new-password-789");
      cy.contains("button", t.resetPassword.submit).click();
      shows(
        t.resetPassword.invalidTitle,
        t.resetPassword.invalidText,
        t.resetPassword.toRequest,
      );
    });

    it("パスワードを変更した画面", () => {
      cy.register().then(({ email }) => {
        cy.visit(`/${lang}/forgot-password`);
        cy.get("#email").type(email);
        cy.contains("button", t.forgotPassword.submit).click();
        cy.contains("h1", t.forgotPassword.sentTitle);
        cy.visit(`/${lang}/reset-password?token=${passwordResetToken(email)}`);
        cy.get("#password").type("new-password-789");
        cy.contains("button", t.resetPassword.submit).click();
        shows(
          t.resetPassword.doneTitle,
          t.resetPassword.doneText,
          t.resetPassword.toLogin,
        );
      });
    });

    it("退会の完了", () => {
      cy.visit(`/${lang}/withdrawn`);
      cy.title().should("eq", `${t.withdrawn.title} | ${t.metadata.title}`);
      shows(t.withdrawn.title, t.withdrawn.text, t.withdrawn.toTop);
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
        t.legal.commerceLink,
        t.about.back,
      );
    });

    for (const [path, document] of [
      ["terms", t.legal.terms],
      ["privacy", t.legal.privacy],
      ["commerce", t.legal.commerce],
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
        shows(
          t.recordList.contents,
          t.recordList.heading,
          t.recordList.filtering,
          t.header.newRecord,
        );
        cy.contains(pattern(t.recordList.filteredSummary)).should("exist");
        cy.contains(pattern(t.recordList.resultCount)).should("exist");
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
          fill(t.recordFilter.selected, {
            label: t.recordFilter.score,
            value: "★5",
          }),
          t.recordFilter.clearAll,
        );
        cy.get(
          `[aria-label="${fill(t.recordFilter.remove, { label: "★5" })}"]`,
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
        cy.contains(pattern(t.recordList.summary)).should("exist");
        cy.contains(pattern(t.recordDetail.pagePosition)).should("exist");
        cy.get(`[aria-label="${t.recordDetail.prevPage}"]`).should("exist");
        cy.get(`[aria-label="${t.recordDetail.nextPage}"]`).should("exist");
      });

      it("一致する記録がないとき", () => {
        cy.visit(`/${lang}/records?q=no-match-title`);
        shows(
          t.recordList.noMatch,
          t.recordList.noMatchHint,
          t.recordList.clearFilters,
        );
      });

      it("記録の詳細", () => {
        cy.visit(`/${lang}/records/1`);
        shows(
          t.recordDetail.watchedAt,
          t.recordDetail.platform,
          t.recordDetail.score,
          t.recordDetail.moodTags,
          t.recordDetail.movieInfo,
          t.recordDetail.released,
          t.recordDetail.production,
          t.recordDetail.genres,
          t.recordDetail.directors,
          t.recordDetail.cast,
          t.recordDetail.overview,
          t.recordDetail.createdAt,
          t.recordDetail.back,
          t.recordDetail.edit,
          fill(t.recordDetail.releaseYear, { year: 1960 }),
          fill(t.recordDetail.runtime, { minutes: 90 }),
        );
        cy.contains(pattern(t.recordDetail.pageSpread)).should("exist");
        cy.get(`[aria-label="${t.recordDetail.prevPage}"]`).should("exist");
        cy.get(`[aria-label="${t.recordDetail.nextPage}"]`).should("exist");
        cy.get(
          `[aria-label="${fill(t.recordDetail.pageLabel, { page: 1 })}"]`,
        ).should("exist");
        cy.get(
          `[aria-label="${fill(t.recordDetail.scoreValue, { score: 4 })}"]`,
        ).should("exist");
        cy.get(`[aria-label="${t.recordDetail.posterOpen}"]`).should("exist");
        cy.get(`button[aria-label="${t.recordDetail.delete}"]`).click();
        shows(
          t.deleteRecord.title,
          t.deleteRecord.cancel,
          t.deleteRecord.confirm,
        );
      });

      it("記録の作成の2つの見開き", () => {
        cy.visit(`/${lang}/records/new`);
        shows(
          t.recordForm.createTitle,
          t.recordForm.spreadBasics,
          t.recordForm.title,
          t.recordForm.titleHint,
          t.recordForm.posterAdd,
          t.recordForm.posterDrop,
          t.recordForm.watchedAt,
          t.recordForm.today,
          t.recordForm.yesterday,
          t.recordForm.score,
          t.recordForm.platform,
          t.recordForm.moodTags,
          t.recordForm.movieInfo,
          t.recordForm.movieInfoHint,
          t.recordForm.originalTitle,
          t.recordForm.releaseYear,
          t.recordForm.runtime,
          t.recordForm.runtimeUnit,
          t.recordForm.countries,
          t.recordForm.language,
          t.recordForm.genres,
          t.recordForm.credits,
          t.recordForm.addCredit,
          t.recordForm.overview,
          t.recordForm.cancel,
          t.recordForm.next,
        );
        for (const placeholder of [
          t.recordForm.titlePlaceholder,
          t.recordForm.originalTitlePlaceholder,
          t.recordForm.releaseYearPlaceholder,
          t.recordForm.runtimePlaceholder,
          t.recordForm.countriesPlaceholder,
          t.recordForm.overviewPlaceholder,
        ]) {
          cy.get(`[placeholder="${placeholder}"]`).should("exist");
        }
        cy.get(
          `[aria-label="${fill(t.recordForm.scoreStar, { score: 1 })}"]`,
        ).should("exist");
        cy.get("#countries").type("jp{enter}");
        cy.get(
          `[aria-label="${fill(t.recordForm.removeCountry, {
            name:
              new Intl.DisplayNames(lang, { type: "region" }).of("JP") ?? "JP",
          })}"]`,
        ).should("exist");
        cy.contains("button", t.recordForm.addCredit).click();
        for (const label of [
          t.recordForm.creditRole,
          t.recordForm.removeCredit,
          t.recordForm.personName,
        ]) {
          cy.get(`[aria-label="${label}"]`).should("exist");
        }
        cy.fillRecordBasics("Arrival", { score: 3, lang });
        cy.get("#releaseYear").type("2016");
        cy.contains("button:visible", t.recordForm.next).click();
        shows(
          t.recordForm.spreadNote,
          t.recordForm.note,
          fill(t.noteEditor.charCount, { count: 0 }),
          t.recordForm.scrap,
          fill(t.recordForm.scrapCount, { count: 0, max: 10 }),
          t.recordForm.attachmentsAdd,
          t.recordForm.attachmentsDrop,
          t.recordForm.back,
          t.recordForm.save,
        );
        for (const label of [
          t.noteEditor.heading,
          t.noteEditor.subheading,
          t.noteEditor.bold,
          t.noteEditor.italic,
          t.noteEditor.bulletList,
          t.noteEditor.orderedList,
          t.noteEditor.blockquote,
        ]) {
          cy.get(`[aria-label="${label}"]`).should("exist");
        }
      });

      it("記録の編集", () => {
        cy.visit(`/${lang}/records/1/edit`);
        shows(
          t.recordForm.editTitle,
          t.recordForm.spreadBasics,
          t.recordForm.editing.trim(),
          t.recordForm.backToRecord,
          t.recordForm.recordedLabel,
          t.recordForm.updatedLabel,
          t.recordForm.cancel,
          t.recordForm.toNote,
          t.recordForm.saveChanges,
          fill(t.recordForm.moreCredits, {
            count: 3,
            roles: t.enums.creditRole.cast,
          }),
        );
        cy.get(`[aria-label="${t.recordForm.posterRemove}"]`).should("exist");
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

    it("スマホのヘッダーと、絞り込みのシート", () => {
      cy.viewport("iphone-x");
      cy.login(demoAccount);
      cy.visit(`/${lang}/records`);
      cy.get(`a[aria-label="${t.header.newRecord}"]`).should("be.visible");
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
