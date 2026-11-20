import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { phrases } from "@/components/atoms/phrases";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternates } from "@/lib/seo/alternates";
import { cn } from "@/lib/style/cn";

export async function generateMetadata(): Promise<Metadata> {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return { title: dict.about.title, alternates: alternates(lang, "/about") };
}

export default async function AboutPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  const links = [
    { href: `/${lang}/terms`, label: dict.register.termsLink },
    { href: `/${lang}/privacy`, label: dict.register.privacyLink },
    { href: `/${lang}/commerce`, label: dict.legal.commerceLink },
    { href: `/${lang}/contact`, label: dict.contact.link },
    { href: `/${lang}/support`, label: dict.support.title },
  ];
  const label = "font-semibold text-paper-label text-xs leading-7";

  return (
    <div className="flex flex-col">
      <h1 className="font-bold font-display text-lg leading-7">
        {dict.about.title}
      </h1>
      <p className="text-[13px] text-foreground-sub leading-7">
        {phrases(dict.metadata.description)}
      </p>
      <nav className="mt-7">
        <h2 className={label}>{dict.about.legalHeading}</h2>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex h-7 items-center justify-between rounded-sm text-sm outline-none hover:text-link focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
                <ChevronRight className="size-3.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="mt-7">
        <h2 className={label}>{dict.about.creditsHeading}</h2>
        <Image
          src="/tmdb-logo.svg"
          alt="TMDB"
          width={273}
          height={36}
          unoptimized
          className="my-1.75 h-3.5 w-auto"
        />
        <p className="text-[11px] text-foreground-sub leading-7">
          {dict.about.tmdbNotice}
        </p>
      </section>
      <Link
        href={`/${lang}/records`}
        className={cn(buttonVariants({ variant: "outline" }), "mt-3.5 w-full")}
      >
        {dict.about.back}
      </Link>
    </div>
  );
}
