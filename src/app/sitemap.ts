import type { MetadataRoute } from "next";
import { locales } from "@/i18n/locales";
import { publicPaths } from "@/lib/auth/public-paths";
import { siteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.flatMap((path) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
    );
    return locales.map((locale) => ({
      url: languages[locale] as string,
      alternates: { languages },
    }));
  });
}
