import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { Logo } from "@/components/atoms/logo";
import { TextLink } from "@/components/atoms/text-link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.about.title };
}

export default async function AboutPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1>
          <Logo name={dict.brand.name} className="h-8" />
        </h1>
        <p className="text-[13px] text-foreground-sub">{dict.brand.tagline}</p>
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="font-bold text-muted-foreground text-xs tracking-[0.08em]">
          {dict.about.creditsHeading}
        </h2>
        <Image
          src="/tmdb-logo.svg"
          alt="TMDB"
          width={273}
          height={36}
          unoptimized
          className="h-3.5 w-auto self-start"
        />
        <p className="text-[13px] text-foreground-sub leading-relaxed">
          {dict.about.tmdbNotice}
        </p>
      </section>
      <nav className="flex flex-col gap-2">
        <TextLink href={`/${lang}/terms`} className="self-start text-sm">
          {dict.register.termsLink}
        </TextLink>
        <TextLink href={`/${lang}/privacy`} className="self-start text-sm">
          {dict.register.privacyLink}
        </TextLink>
      </nav>
      <Link
        href={`/${lang}/records`}
        className={cn(buttonVariants({ variant: "outline" }), "self-center")}
      >
        <ArrowLeft aria-hidden />
        {dict.about.back}
      </Link>
    </div>
  );
}
