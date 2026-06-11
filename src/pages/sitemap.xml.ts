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

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

export async function GET() {
  const lawsuits = await getCollection("lawsuits");
  const stateGuides = await getCollection("state-guides");
  const categories = await getCollection("categories");

  // Hub pages inherit the newest content date — they re-render whenever any guide updates.
  const newestContentDate = [
    ...lawsuits.map((entry) => entry.data.lastUpdated),
    ...stateGuides.map((entry) => entry.data.lastUpdated)
  ]
    .sort()
    .at(-1);

  const entries: SitemapEntry[] = [
    { loc: "/", lastmod: newestContentDate },
    { loc: "/lawsuits/", lastmod: newestContentDate },
    { loc: "/states/", lastmod: newestContentDate },
    { loc: "/editorial-policy/" },
    { loc: "/legal-disclaimer/" },
    { loc: "/advertising-disclosure/" },
    { loc: "/contact/" },
    ...categories.map((category) => ({
      loc: `/categories/${entrySlug(category)}/`,
      lastmod: category.data.lastUpdated
    })),
    ...lawsuits.map((lawsuit) => ({
      loc: `/lawsuits/${entrySlug(lawsuit)}/`,
      lastmod: lawsuit.data.lastUpdated
    })),
    ...stateGuides.map((guide) => ({
      loc: `/lawsuits/${guide.data.lawsuitSlug}/${guide.data.stateSlug}/`,
      lastmod: guide.data.lastUpdated
    }))
  ];

  const urls = entries
    .map((entry) => ({ ...entry, loc: absolute(entry.loc) }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${xmlEscape(url.loc)}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ""}
  </url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
