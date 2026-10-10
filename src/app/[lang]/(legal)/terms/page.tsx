import type { Metadata } from "next";
import { LegalDocument } from "@/components/organisms/legal-document";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.terms.title };
}

export default async function TermsPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  const { legal } = dict;

  return (
    <LegalDocument
      title={legal.terms.title}
      intro={legal.terms.intro}
      sections={legal.terms.sections}
      updatedLabel={legal.updatedLabel}
      updated={legal.updated}
      contactLabel={legal.contactLabel}
      contactHref={`/${lang}/contact`}
      backLabel={legal.back}
      backHref={`/${lang}/about`}
    />
  );
}
