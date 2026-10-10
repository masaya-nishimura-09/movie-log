import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { Logo } from "@/components/atoms/logo";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/style/cn";

type LandingProps = {
  lang: Locale;
  dict: Dictionary;
};

function Screenshot({
  src,
  mobileSrc,
  alt,
  side,
  priority,
}: {
  src: string;
  mobileSrc: string;
  alt: string;
  side: "left" | "right";
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[20px] bg-(--sage) p-3 md:rounded-[28px] md:p-5",
        side === "right" ? "md:pr-10 md:pb-10" : "md:pb-10 md:pl-10",
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={900}
        priority={priority}
        unoptimized
        sizes="(min-width: 1024px) 560px, 100vw"
        className="h-auto w-full rounded-[8px] shadow-[0_24px_48px_-24px_rgb(0_0_0/0.6)]"
      />
      <div
        className={cn(
          "absolute bottom-2 w-[26%] rounded-[12px] bg-(--navy) p-0.5 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.7)] md:bottom-4 md:w-[21%] md:rounded-[16px] md:p-1",
          side === "right"
            ? "right-2 md:right-4"
            : "right-2 md:right-auto md:left-4",
        )}
      >
        <Image
          src={mobileSrc}
          alt=""
          width={780}
          height={1688}
          priority={priority}
          unoptimized
          sizes="140px"
          className="h-auto w-full rounded-[10px] md:rounded-[12px]"
        />
      </div>
    </div>
  );
}

export function Landing({ lang, dict }: LandingProps) {
  const l = dict.landing;
  const loginHref = `/${lang}/login`;
  const registerHref = `/${lang}/register`;

  return (
    <main className="shell flex flex-1 flex-col bg-sidebar text-foreground">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Logo name={dict.brand.name} />
        <nav className="flex items-center gap-2">
          <Link
            href={loginHref}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {l.login}
          </Link>
          <Link
            href={registerHref}
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            {l.start}
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_1.15fr] lg:py-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-balance font-bold text-4xl leading-tight md:text-5xl">
            {l.headline}
          </h1>
          <p className="text-foreground-sub text-lg leading-relaxed">
            {l.lead}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={registerHref}
              className={buttonVariants({ size: "lg" })}
            >
              {l.start}
            </Link>
            <Link
              href={loginHref}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {l.login}
            </Link>
          </div>
        </div>
        <Screenshot
          src={`/landing/list-${lang}.webp`}
          mobileSrc={`/landing/list-mobile-${lang}.webp`}
          alt={l.listAlt}
          side="right"
          priority
        />
      </section>

      <section className="shell-inset mx-auto grid w-full max-w-6xl gap-4 px-6 py-6 md:grid-cols-3">
        {l.features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-2 rounded-[18px] bg-card p-6"
          >
            <h2 className="font-bold text-card-foreground text-lg">
              {feature.title}
            </h2>
            <p className="text-foreground-sub text-sm leading-relaxed">
              {feature.text}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.15fr_1fr] lg:py-16">
        <Screenshot
          src={`/landing/detail-${lang}.webp`}
          mobileSrc={`/landing/detail-mobile-${lang}.webp`}
          alt={l.detailAlt}
          side="left"
        />
        <div className="flex flex-col gap-6">
          <p className="text-balance font-bold text-2xl leading-snug">
            {l.closing}
          </p>
          <Link
            href={registerHref}
            className={cn(buttonVariants({ size: "lg" }), "self-start")}
          >
            {l.start}
          </Link>
        </div>
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-8 text-foreground-sub text-xs">
        <Link href={`/${lang}/about`} className="font-medium hover:underline">
          {dict.about.link}
        </Link>
        <Link href={`/${lang}/terms`} className="font-medium hover:underline">
          {dict.register.termsLink}
        </Link>
        <Link href={`/${lang}/privacy`} className="font-medium hover:underline">
          {dict.register.privacyLink}
        </Link>
      </footer>
    </main>
  );
}
