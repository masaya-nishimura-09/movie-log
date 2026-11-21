import type { Metadata } from "next";
import { verifyEmailAction } from "@/actions/user/verify-email";
import { VerifyTokenForm } from "@/components/organisms/verify-token-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.verifyEmail.title,
    robots: { index: false },
    referrer: "no-referrer",
  };
}

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<"/[lang]/verify-email">) {
  const [lang, dict, params] = await Promise.all([
    getLocale(),
    getDictionary(),
    searchParams,
  ]);
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <div className="flex flex-col gap-6">
      <VerifyTokenForm
        action={verifyEmailAction.bind(null, token)}
        hasToken={token !== ""}
        dict={dict.verifyEmail}
        next={{ href: `/${lang}/login`, label: dict.verifyEmail.toLogin }}
      />
    </div>
  );
}
