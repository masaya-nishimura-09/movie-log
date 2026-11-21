import { ArrowRight, FileText, ListFilter, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/atoms/button";
import { CoverSpine } from "@/components/atoms/cover-spine";
import { CoverTexture } from "@/components/atoms/cover-texture";
import { Logo } from "@/components/atoms/logo";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { phrases } from "@/components/atoms/phrases";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/style/cn";
import {
  coverSurface,
  onCover,
  paperCard,
  ruledLines,
} from "@/lib/style/paper";

type LandingProps = {
  lang: Locale;
  dict: Dictionary;
};

const featureIcons = [FileText, ListFilter, Search];

function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-semibold text-paper-label text-xs tracking-[0.24em] dark:text-link",
        className,
      )}
    >
      {children}
    </p>
  );
}

function Shot({
  src,
  alt,
  width,
  height,
  eager,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  eager?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      unoptimized
      className={cn(
        "block h-auto w-full rounded-[10px] drop-shadow-[0_24px_36px_rgb(10_41_71/0.18)] md:rounded-[14px]",
        className,
      )}
    />
  );
}

function Phone({
  src,
  alt,
  eager,
  className,
}: {
  src: string;
  alt: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] bg-(--navy) p-1.75 shadow-[0_20px_36px_rgb(10_41_71/0.28)] md:rounded-[30px] md:p-2",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={780}
        height={1688}
        loading={eager ? "eager" : "lazy"}
        unoptimized
        className="block h-auto w-full rounded-[21px] md:rounded-[22px]"
      />
    </div>
  );
}

export function Landing({ lang, dict }: LandingProps) {
  const l = dict.landing;
  const loginHref = `/${lang}/login`;
  const registerHref = `/${lang}/register`;
  const sectionTitle =
    "mt-2.5 font-bold font-display text-2xl leading-normal md:mt-3.5 md:text-[34px] md:leading-[1.45]";
  const bodyText =
    "mt-3 text-[14px] text-foreground-sub leading-[1.85] md:mt-4 md:text-[15px] md:leading-[1.9]";
  const footerLinks = [
    { href: `/${lang}/about`, label: dict.about.link },
    { href: `/${lang}/terms`, label: dict.register.termsLink },
    { href: `/${lang}/privacy`, label: dict.register.privacyLink },
    { href: `/${lang}/commerce`, label: dict.legal.commerceLink },
    { href: `/${lang}/contact`, label: dict.contact.link },
  ];

  return (
    <main className="flex flex-1 flex-col bg-background text-foreground">
      <header className="border-b">
        <div
          className={cn(
            "app-container",
            "flex h-14 items-center gap-2 md:h-17",
          )}
        >
          <Logo name={dict.brand.name} className="h-8 md:h-10" />
          <div className="flex-1" />
          <Link
            href={loginHref}
            className="px-1.5 text-[13px] text-foreground hover:text-link md:px-2 md:text-sm"
          >
            {l.login}
          </Link>
          <Link
            href={registerHref}
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 px-3 text-[13px] md:h-10 md:px-4 md:text-sm",
            )}
          >
            <span className="md:hidden">{l.registerShort}</span>
            <span className="hidden md:inline">{l.start}</span>
          </Link>
        </div>
      </header>

      <section
        className={cn(
          "app-container",
          "grid items-center gap-9 pt-10 pb-12 md:pt-18 md:pb-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14",
        )}
      >
        <div>
          <Eyebrow>{l.eyebrow}</Eyebrow>
          <h1 className="mt-3 font-bold font-display text-[32px] leading-[1.4] md:mt-4 md:text-[46px] md:leading-[1.35] md:tracking-[0.01em]">
            {l.headlineBefore}
            {l.headlineBefore && <br />}
            <span className="break-keep">
              {l.headlineLead}
              <wbr />
              <span className="bg-[linear-gradient(transparent_62%,rgb(201_164_106/0.45)_62%)]">
                {l.headlineMarked}
              </span>
              {l.headlineAfter}
            </span>
          </h1>
          <p className={cn(bodyText, "max-w-105 md:mt-6 md:text-base")}>
            {phrases(l.lead)}
          </p>
          <div className="mt-6 flex flex-col gap-2.5 md:mt-8 md:flex-row md:gap-3">
            <Link
              href={registerHref}
              className={cn(buttonVariants({ size: "lg" }), "md:px-5.5")}
            >
              {l.start}
              <ArrowRight aria-hidden />
            </Link>
            <Link
              href={loginHref}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {l.login}
            </Link>
          </div>
          <p className="mt-3 text-center text-muted-foreground text-xs md:mt-4 md:text-left">
            {l.badge}
          </p>
        </div>
        <div className="relative lg:pb-14">
          <Shot
            src={`/landing/detail-${lang}.webp`}
            alt={l.heroAlt}
            width={1440}
            height={900}
            eager
            className="hidden lg:block"
          />
          <Phone
            src={`/landing/detail-mobile-${lang}.webp`}
            alt={l.heroMobileAlt}
            eager
            className="mx-auto w-57.5 lg:absolute lg:-right-6 lg:bottom-0 lg:w-42"
          />
        </div>
      </section>

      <section className="border-t py-12 md:py-24">
        <div className="app-container">
          <div className="max-w-160 md:mx-auto md:text-center">
            <Eyebrow>{l.contents.eyebrow}</Eyebrow>
            <h2 className={sectionTitle}>{phrases(l.contents.title)}</h2>
            <p className={bodyText}>{phrases(l.contents.text)}</p>
          </div>
          <div className="mt-7 grid items-end gap-10 md:mt-12 lg:grid-cols-[minmax(0,1fr)_220px]">
            <Shot
              src={`/landing/list-${lang}.webp`}
              alt={l.contents.alt}
              width={1440}
              height={900}
              className="hidden lg:block"
            />
            <Phone
              src={`/landing/list-mobile-${lang}.webp`}
              alt={l.contents.mobileAlt}
              className="mx-auto w-57.5 lg:w-55"
            />
          </div>
        </div>
      </section>

      <section
        className={cn(
          "app-container",
          "border-t py-12 md:border-t-0 md:pt-26 md:pb-24",
        )}
      >
        <div className="max-w-160">
          <Eyebrow>{l.featuresEyebrow}</Eyebrow>
          <h2 className={sectionTitle}>{phrases(l.featuresTitle)}</h2>
        </div>
        <div className="mt-7.5 grid gap-6.5 md:mt-12 md:grid-cols-3 md:gap-7">
          {l.features.map((feature, index) => {
            const Icon = featureIcons[index] ?? FileText;
            return (
              <article
                key={feature.title}
                className={cn(
                  paperCard,
                  ruledLines,
                  "px-5 pt-5.5 pb-5 shadow-[0_8px_18px_rgb(10_41_71/0.1)] md:px-7 md:pt-7 md:pb-7",
                )}
              >
                <MaskingTape className="w-16 md:w-20" />
                <div className="flex h-7 items-center justify-between">
                  <span className="font-bold text-paper-label text-xs tracking-[0.1em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    className="hidden size-5 text-primary md:block"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </div>
                <h3 className="font-bold font-display text-base leading-7 md:mt-7 md:text-lg">
                  {phrases(feature.title)}
                </h3>
                <p className="text-[13px] text-foreground-sub leading-7 md:text-sm">
                  {phrases(feature.text)}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className={cn(
          "app-container",
          "grid items-center gap-6 border-t py-12 md:border-t-0 md:pb-26 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14",
        )}
      >
        <div className="lg:order-last">
          <Eyebrow>{l.noteEyebrow}</Eyebrow>
          <h2 className={cn(sectionTitle, "md:text-[30px] md:leading-normal")}>
            {phrases(l.note.title)}
          </h2>
          <p className={bodyText}>{phrases(l.note.text)}</p>
        </div>
        <Shot
          src={`/landing/note-${lang}.webp`}
          alt={l.note.alt}
          width={1440}
          height={900}
        />
      </section>

      <section className="bg-(--navy) py-13 text-(--beige) md:py-26 dark:bg-[color-mix(in_oklab,var(--navy)_70%,black)]">
        <div
          className={cn(
            "app-container",
            "grid items-center gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14",
          )}
        >
          <div>
            <Eyebrow className="text-[#c9a46a] dark:text-[#c9a46a]">
              {l.recommendEyebrow}
            </Eyebrow>
            <h2
              className={cn(
                sectionTitle,
                "text-[22px] leading-[1.6] md:text-[30px] md:leading-[1.55]",
              )}
            >
              {phrases(l.recommend.title)}
            </h2>
            <p className={cn(bodyText, "text-[#d9cfbb]")}>
              {phrases(l.recommend.text)}
            </p>
          </div>
          <div className="aspect-1140/600 overflow-hidden rounded-[10px] shadow-[0_20px_36px_rgb(0_0_0/0.45)] md:aspect-1140/520 md:rounded-[14px]">
            <Image
              src={`/landing/recommend-${lang}.webp`}
              alt={l.recommend.alt}
              width={1440}
              height={900}
              unoptimized
              className="block size-full object-cover object-top-left md:object-top"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-13 md:px-8 md:py-28">
        <div
          className={cn(
            coverSurface,
            "relative mx-auto flex max-w-140 flex-col justify-center overflow-hidden px-6 pt-11 pb-10 pl-8 text-center text-(--paper) md:min-h-180 md:px-14 md:py-16",
          )}
        >
          <CoverSpine />
          <CoverTexture />
          <div className={cn("relative", onCover)}>
            <Logo name={dict.brand.name} className="mx-auto h-10.5 md:h-13" />
          </div>
          <h2 className="relative mt-4.5 font-bold font-display text-[21px] leading-[1.55] md:mt-6 md:text-[28px] md:leading-normal">
            {phrases(l.closingTitle)}
          </h2>
          <p className="relative mx-auto mt-3 max-w-120 text-[#ecd9bc] text-[13px] leading-[1.85] md:mt-3.5 md:text-sm md:leading-[1.9]">
            {phrases(l.closingText)}
          </p>
          <div className="relative mt-5.5 flex flex-col justify-center gap-2.5 md:mt-7 md:flex-row md:gap-3">
            <Link
              href={registerHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-(--paper) px-6 font-bold text-[#5f3f27] text-[15px] outline-none hover:bg-white focus-visible:ring-(--beige) focus-visible:ring-2"
            >
              {l.start}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={loginHref}
              className="inline-flex h-12 items-center justify-center rounded-[10px] px-5 font-medium text-(--beige) text-[15px] shadow-[inset_0_0_0_1px_rgb(243_228_201/0.4)] outline-none hover:bg-white/10 focus-visible:ring-(--beige) focus-visible:ring-2"
            >
              {l.login}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div
          className={cn(
            "app-container",
            "flex flex-col gap-4 pt-7 pb-9 md:flex-row md:flex-wrap md:items-center md:gap-6 md:pt-8 md:pb-10",
          )}
        >
          <Logo name={dict.brand.name} className="h-7 md:h-8" />
          <nav className="flex flex-col md:flex-row md:flex-wrap md:gap-x-5.5 md:gap-y-1.5">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-[13px] text-foreground-sub hover:text-foreground md:py-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden flex-1 md:block" />
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {dict.brand.name}
          </p>
        </div>
      </footer>
    </main>
  );
}
