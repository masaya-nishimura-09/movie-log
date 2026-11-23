import type { Metadata } from "next";
import { startSupportAction } from "@/actions/support/start-support";
import { TextLink } from "@/components/atoms/text-link";
import { BackButton } from "@/components/molecules/back-button";
import { SupportDesk } from "@/components/organisms/support-desk";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.support.title };
}

export default async function SupportPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <SupportDesk
      action={startSupportAction.bind(null, lang)}
      dict={dict.support}
      notes={
        <TextLink
          href={`/${lang}/commerce`}
          className="mt-3 inline-block text-[12px]"
        >
          {dict.legal.commerceLink}
        </TextLink>
      }
      footer={
        <BackButton
          fallbackHref={`/${lang}/records`}
          label={dict.support.back}
        />
      }
    />
  );
}
