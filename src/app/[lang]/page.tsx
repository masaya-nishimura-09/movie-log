import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Landing } from "@/components/organisms/landing";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { refreshTokenCookie } from "@/lib/auth/token-cookies";
import { alternates } from "@/lib/seo/alternates";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternates(await getLocale(), "") };
}

export default async function Page() {
  const [lang, dict, store] = await Promise.all([
    getLocale(),
    getDictionary(),
    cookies(),
  ]);
  if (store.get(refreshTokenCookie)?.value) redirect(`/${lang}/records`);

  return <Landing lang={lang} dict={dict} />;
}
