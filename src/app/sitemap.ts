import type { MetadataRoute } from "next";
import { locales } from "@/i18n/locales";
import { publicPaths } from "@/lib/auth/public-paths";
import { languageUrls } from "@/lib/seo/alternates";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.flatMap((path) => {
    const languages = languageUrls(path);
    return locales.map((locale) => ({
      url: languages[locale],
      alternates: { languages },
    }));
  });
}
