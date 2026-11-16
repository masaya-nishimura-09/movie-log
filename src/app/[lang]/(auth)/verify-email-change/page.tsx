import type { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyEmailChangeAction } from "@/actions/user/verify-email-change";
import { Logo } from "@/components/atoms/logo";
import { VerifyTokenForm } from "@/components/organisms/verify-token-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import {
  accessTokenCookie,
  refreshTokenCookie,
} from "@/lib/auth/token-cookies";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.verifyEmailChange.title,
    robots: { index: false },
    referrer: "no-referrer",
  };
}

export default async function VerifyEmailChangePage({
  searchParams,
}: PageProps<"/[lang]/verify-email-change">) {
  const [lang, dict, params, store] = await Promise.all([
    getLocale(),
    getDictionary(),
    searchParams,
    cookies(),
  ]);
  const token = typeof params.token === "string" ? params.token : "";
  const t = dict.verifyEmailChange;
  const loggedIn =
    store.has(accessTokenCookie) || store.has(refreshTokenCookie);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Logo name={dict.brand.name} className="h-18" />
      </div>
      <VerifyTokenForm
        action={verifyEmailChangeAction.bind(null, token)}
        hasToken={token !== ""}
        dict={t}
        failureScreens={{
          emailTaken: { title: t.emailTakenTitle, text: t.emailTakenText },
        }}
        next={
          loggedIn
            ? { href: `/${lang}/account`, label: t.toAccount }
            : { href: `/${lang}/login`, label: t.toLogin }
        }
      />
    </div>
  );
}
