import type { Metadata } from "next";
import { sendContactAction } from "@/actions/contact/send-contact";
import { BackButton } from "@/components/molecules/back-button";
import { ContactForm } from "@/components/organisms/contact-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternates } from "@/lib/seo/alternates";
import { turnstileSiteKey } from "@/lib/turnstile/verify-turnstile";

export async function generateMetadata(): Promise<Metadata> {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: dict.contact.title,
    alternates: alternates(lang, "/contact"),
  };
}

export default async function ContactPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <div className="flex flex-col gap-7">
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
