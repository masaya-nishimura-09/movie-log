import type { Metadata } from "next";
import { LegalDocument } from "@/components/organisms/legal-document";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternates } from "@/lib/seo/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: dict.legal.commerce.title,
    alternates: alternates(lang, "/commerce"),
  };
}

export default async function CommercePage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  const { legal } = dict;

  return (
    <LegalDocument
      title={legal.commerce.title}
      intro={legal.commerce.intro}
      sections={legal.commerce.sections}
      updatedLabel={legal.updatedLabel}
      updated={legal.updated}
      contactLabel={legal.contactLabel}
      contactHref={`/${lang}/contact`}
      backLabel={legal.back}
      backHref={`/${lang}/about`}
    />
  );
}
