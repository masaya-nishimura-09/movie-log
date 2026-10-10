import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { sendContactAction } from "@/actions/contact/send-contact";
import { buttonVariants } from "@/components/atoms/button";
import { ContactForm } from "@/components/organisms/contact-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.contact.title };
}

export default async function ContactPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  const siteKey =
    process.env.USE_MOCK === "true"
      ? undefined
      : process.env.TURNSTILE_SITE_KEY;

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
        siteKey={siteKey}
        action={sendContactAction}
        dict={dict.contact}
        counterTemplate={dict.characterCount}
      />
      <Link
        href={`/${lang}/about`}
        className={cn(buttonVariants({ variant: "outline" }), "self-center")}
      >
        <ArrowLeft aria-hidden />
        {dict.contact.back}
      </Link>
    </div>
  );
}
