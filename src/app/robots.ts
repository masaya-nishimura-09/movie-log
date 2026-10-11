import type { MetadataRoute } from "next";
import { locales } from "@/i18n/locales";
import { siteUrl } from "@/lib/env";

const privatePaths = ["/records", "/account"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: locales.flatMap((locale) =>
        privatePaths.map((path) => `/${locale}${path}`),
      ),
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
