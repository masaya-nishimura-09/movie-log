import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function NotFound() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <EmptyState
        title={dict.notFound.title}
        description={dict.notFound.description}
        action={
          <Link href={`/${lang}/records`} className={buttonVariants()}>
            {dict.notFound.action}
          </Link>
        }
      />
    </main>
  );
}
