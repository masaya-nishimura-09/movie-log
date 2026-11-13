import type { Metadata } from "next";
import { LegalDocument } from "@/components/organisms/legal-document";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.commerce.title };
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
