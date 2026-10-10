import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/app/providers";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a2947",
};

export async function generateMetadata(): Promise<Metadata> {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: {
      default: dict.metadata.title,
      template: `%s | ${dict.metadata.title}`,
    },
    description: dict.metadata.description,
    openGraph: {
      type: "website",
      siteName: dict.brand.name,
      title: dict.metadata.title,
      description: dict.metadata.description,
      locale: lang === "ja" ? "ja_JP" : "en_US",
      images: [
        {
          url: `/og/og-${lang}.jpg`,
          width: 1200,
          height: 630,
          alt: dict.landing.listAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <html
      lang={await getLocale()}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        notoSansJP.variable,
        poppins.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
