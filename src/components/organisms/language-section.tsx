"use client";

import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { ChoiceChip } from "@/components/atoms/choice-chip";
import { AccountSection } from "@/components/molecules/account-section";
import { NotebookLoading } from "@/components/organisms/notebook-loading";
import type { Dictionary } from "@/i18n/get-dictionary";
import { type Locale, locales } from "@/i18n/locales";

const languageNames: Record<Locale, string> = { ja: "日本語", en: "English" };

type LanguageSectionProps = {
  lang: Locale;
  action: (locale: string, path: string) => Promise<void>;
  dict: Dictionary["account"];
};

export function LanguageSection({ lang, action, dict }: LanguageSectionProps) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const change = (next: Locale) => {
    window.scrollTo(0, 0);
    startTransition(() => action(next, pathname.slice(`/${lang}`.length)));
  };

  return (
    <AccountSection
      title={dict.languageTitle}
      description={dict.languageDescription}
    >
      <fieldset className="flex gap-2.5" disabled={pending}>
        <legend className="sr-only">{dict.languageTitle}</legend>
        {locales.map((locale) => (
          <ChoiceChip
            key={locale}
            type="radio"
            name="language"
            value={locale}
            lang={locale}
            shape="block"
            size="lg"
            className="max-w-40"
            checked={locale === lang}
            onChange={() => change(locale)}
          >
            {languageNames[locale]}
          </ChoiceChip>
        ))}
      </fieldset>
      {pending && (
        <div className="fixed inset-x-0 top-(--app-header-height) bottom-0 z-40 overflow-hidden bg-background">
          <NotebookLoading />
        </div>
      )}
    </AccountSection>
  );
}
