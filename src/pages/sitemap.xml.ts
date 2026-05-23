import { getCollection } from "astro:content";
import { entrySlug } from "@lib/content";
import { site } from "@lib/site";

export const prerender = true;

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absolute(path: string) {
  return new URL(path, site.url).href;
}

export async function GET() {
  const lawsuits = await getCollection("lawsuits");
  const stateGuides = await getCollection("state-guides");
  const categories = await getCollection("categories");

  const staticPages = [
    "/",
    "/lawsuits/",
    "/states/",
    "/editorial-policy/",
    "/legal-disclaimer/",
    "/advertising-disclosure/",
    "/contact/"
  ];

  const urls = [
    ...staticPages,
    ...categories.map((category) => `/categories/${entrySlug(category)}/`),
    ...lawsuits.map((lawsuit) => `/lawsuits/${entrySlug(lawsuit)}/`),
    ...stateGuides.map((guide) => `/lawsuits/${guide.data.lawsuitSlug}/${guide.data.stateSlug}/`)
  ]
    .map(absolute)
    .sort((a, b) => a.localeCompare(b));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${xmlEscape(url)}</loc>
  </url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
