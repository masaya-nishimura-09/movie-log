import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots", () => {
  it("allows the site and disallows the signed-in pages of every locale", () => {
    expect(robots().rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/ja/records", "/ja/account", "/en/records", "/en/account"],
    });
  });

  it("points to the sitemap", () => {
    expect(robots().sitemap).toBe("http://localhost:3000/sitemap.xml");
  });
});
