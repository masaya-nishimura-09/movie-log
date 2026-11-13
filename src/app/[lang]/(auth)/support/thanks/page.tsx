import { ArrowLeft, CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/atoms/button";
import { phrases } from "@/components/atoms/phrases";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { logError } from "@/lib/log/logger";
import { cn } from "@/lib/style/cn";
import { getCompletedSupportAmount } from "@/lib/support/stripe-checkout";
import { interpolate } from "@/lib/text/interpolate";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.support.thanksTitle };
}

async function completedAmount(
  sessionId: string | undefined,
): Promise<number | null> {
  if (!sessionId) return null;
  try {
    return await getCompletedSupportAmount(sessionId);
  } catch (error) {
    logError("warn", "support_session_check_failed", error);
    return null;
  }
}

export default async function SupportThanksPage({
  searchParams,
}: PageProps<"/[lang]/support/thanks">) {
  const [lang, dict, params] = await Promise.all([
    getLocale(),
    getDictionary(),
    searchParams,
  ]);
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : undefined;
  const amount = await completedAmount(sessionId);
  if (amount === null) redirect(`/${lang}/support`);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <CircleCheck className="mb-1 size-10 text-primary" aria-hidden />
        <h1 className="font-bold text-2xl text-foreground">
          {dict.support.thanksTitle}
        </h1>
        <div className="text-balance text-[13px] text-foreground-sub leading-relaxed">
          <p>
            {phrases(
              interpolate(dict.support.thanksText, {
                amount: interpolate(dict.support.amount, {
                  amount: amount.toLocaleString("ja-JP"),
                }),
              }),
            )}
          </p>
          <p>{phrases(dict.support.thanksUse)}</p>
        </div>
      </div>
      <Link
        href={`/${lang}/records`}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        <ArrowLeft aria-hidden />
        {dict.support.thanksBack}
      </Link>
    </div>
  );
}
