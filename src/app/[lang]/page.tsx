import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Landing } from "@/components/organisms/landing";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { refreshTokenCookie } from "@/lib/auth/token-cookies";

export default async function Page() {
  const [lang, dict, store] = await Promise.all([
    getLocale(),
    getDictionary(),
    cookies(),
  ]);
  if (store.get(refreshTokenCookie)?.value) redirect(`/${lang}/records`);

  return <Landing lang={lang} dict={dict} />;
}
