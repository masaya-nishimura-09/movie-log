import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { publicPaths } from "@/lib/auth/public-paths";

describe("sitemap", () => {
  it("lists every public path in every locale", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toHaveLength(publicPaths.length * 2);
    expect(urls).toContain("http://localhost:3000/ja");
    expect(urls).toContain("http://localhost:3000/en");
    expect(urls).toContain("http://localhost:3000/ja/about");
    expect(urls).toContain("http://localhost:3000/en/privacy");
  });

  it("does not list signed-in pages", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.includes("/records"))).toBe(false);
    expect(urls.some((url) => url.includes("/account"))).toBe(false);
  });

  it("links each page to its other language", () => {
    const about = sitemap().find(
      (entry) => entry.url === "http://localhost:3000/ja/about",
    );
    expect(about?.alternates?.languages).toEqual({
      ja: "http://localhost:3000/ja/about",
      en: "http://localhost:3000/en/about",
    });
  });
});
