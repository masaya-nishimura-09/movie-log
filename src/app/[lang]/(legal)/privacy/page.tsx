import type { Metadata } from "next";
import { LegalDocument } from "@/components/organisms/legal-document";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternates } from "@/lib/seo/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: dict.legal.privacy.title,
    alternates: alternates(lang, "/privacy"),
  };
}

export default async function PrivacyPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  const { legal } = dict;

  return (
    <LegalDocument
      title={legal.privacy.title}
      intro={legal.privacy.intro}
      sections={legal.privacy.sections}
      updatedLabel={legal.updatedLabel}
      updated={legal.updated}
      contactLabel={legal.contactLabel}
      contactHref={`/${lang}/contact`}
      backLabel={legal.back}
      backHref={`/${lang}/about`}
    />
  );
}
