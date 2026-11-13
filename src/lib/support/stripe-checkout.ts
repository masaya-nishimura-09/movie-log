import Stripe from "stripe";
import type { Locale } from "@/i18n/locales";
import { siteUrl, useMock } from "@/lib/env";

const mockSessionPrefix = "cs_mock_";

function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function createSupportCheckoutUrl(
  amount: number,
  lang: Locale,
  productName: string,
): Promise<string> {
  if (useMock) {
    return `/${lang}/support/thanks?session_id=${mockSessionPrefix}${amount}`;
  }
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "jpy",
          unit_amount: amount,
          product_data: { name: productName },
        },
      },
    ],
    locale: lang,
    success_url: `${siteUrl}/${lang}/support/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${lang}/support`,
  });
  if (!session.url) throw new Error("Checkout Session has no URL");
  return session.url;
}

export async function getCompletedSupportAmount(
  sessionId: string,
): Promise<number | null> {
  if (useMock) {
    const amount = sessionId.match(/^cs_mock_(\d+)$/)?.[1];
    return amount ? Number(amount) : null;
  }
  const session = await stripe().checkout.sessions.retrieve(sessionId);
  return session.status === "complete" ? session.amount_total : null;
}
