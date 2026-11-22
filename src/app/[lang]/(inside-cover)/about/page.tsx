import type { Metadata } from "next";
import Image from "next/image";
import { phrases } from "@/components/atoms/phrases";
import { BackButton } from "@/components/molecules/back-button";
import { CardPocket } from "@/components/molecules/card-pocket";
import { InsideCoverScreen } from "@/components/organisms/inside-cover-screen";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternates } from "@/lib/seo/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return { title: dict.about.title, alternates: alternates(lang, "/about") };
}

export default async function AboutPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  const cards = [
    { href: `/${lang}/terms`, label: dict.register.termsLink },
    { href: `/${lang}/privacy`, label: dict.register.privacyLink },
    { href: `/${lang}/commerce`, label: dict.legal.commerceLink },
    { href: `/${lang}/contact`, label: dict.contact.link },
    { href: `/${lang}/support`, label: dict.support.title },
  ];

  return (
    <InsideCoverScreen
      homeHref={`/${lang}`}
      brandName={dict.brand.name}
      title={dict.about.title}
      description={phrases(dict.metadata.description)}
      pocket={<CardPocket cards={cards} label={dict.about.legalHeading} />}
      credits={
        <section>
          <h2 className="mb-1.5 font-semibold text-[10px] text-[rgb(241_227_200/0.6)] leading-4 tracking-[0.2em]">
            {dict.about.creditsHeading}
          </h2>
          <Image
            src="/tmdb-logo.svg"
            alt="TMDB"
            width={273}
            height={36}
            unoptimized
            className="mx-auto h-3 w-auto opacity-80"
          />
          <p className="mt-1.5 text-[10px] text-[rgb(241_227_200/0.6)] leading-4">
            {dict.about.tmdbNotice}
          </p>
        </section>
      }
      footer={
        <BackButton fallbackHref={`/${lang}/records`} label={dict.about.back} />
      }
    />
  );
}
