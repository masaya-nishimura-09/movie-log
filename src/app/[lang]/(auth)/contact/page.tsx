import type { Metadata } from "next";
import { sendContactAction } from "@/actions/contact/send-contact";
import { BackButton } from "@/components/molecules/back-button";
import { ContactForm } from "@/components/organisms/contact-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { turnstileSiteKey } from "@/lib/turnstile/verify-turnstile";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.contact.title };
}

export default async function ContactPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl text-foreground">
          {dict.contact.title}
        </h1>
        <p className="text-[13px] text-foreground-sub leading-relaxed">
          {dict.contact.intro}
        </p>
      </header>
      <ContactForm
        lang={lang}
        siteKey={turnstileSiteKey()}
        action={sendContactAction.bind(null, lang)}
        dict={dict.contact}
        counterTemplate={dict.characterCount}
      />
      <BackButton
        fallbackHref={`/${lang}`}
        label={dict.contact.back}
        className="self-center"
      />
    </div>
  );
}
