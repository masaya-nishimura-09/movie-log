import type { Metadata } from "next";
import { LegalDocument } from "@/components/organisms/legal-document";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.privacy.title };
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
      contactPending={legal.contactPending}
      backLabel={legal.back}
      backHref={`/${lang}/about`}
    />
  );
}
