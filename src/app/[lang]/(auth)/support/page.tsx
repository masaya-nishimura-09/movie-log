import type { Metadata } from "next";
import { startSupportAction } from "@/actions/support/start-support";
import { phrases } from "@/components/atoms/phrases";
import { TextLink } from "@/components/atoms/text-link";
import { BackButton } from "@/components/molecules/back-button";
import { SupportForm } from "@/components/organisms/support-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.support.title };
}

export default async function SupportPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col">
        <h1 className="font-bold font-display text-foreground text-lg leading-7">
          {dict.support.title}
        </h1>
        <div className="text-[13px] text-foreground-sub leading-7">
          <p>{phrases(dict.support.intro)}</p>
          <p>{phrases(dict.support.introRequest)}</p>
        </div>
      </header>
      <SupportForm
        action={startSupportAction.bind(null, lang)}
        dict={dict.support}
      />
      <TextLink href={`/${lang}/commerce`} className="self-center text-[13px]">
        {dict.legal.commerceLink}
      </TextLink>
      <BackButton
        fallbackHref={`/${lang}/records`}
        label={dict.support.back}
        className="self-center"
      />
    </div>
  );
}
