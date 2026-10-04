import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function NotFound() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <main className="shell flex flex-1 items-center justify-center bg-sidebar px-4 py-10">
      <div className="shell-inset flex w-full justify-center">
        <EmptyState
          title={dict.notFound.title}
          description={dict.notFound.description}
          action={
            <Link href={`/${lang}/records`} className={buttonVariants()}>
              {dict.notFound.action}
            </Link>
          }
        />
      </div>
    </main>
  );
}
