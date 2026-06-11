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

export async function GET() {
  const lawsuits = await getCollection("lawsuits");
  const stateGuides = await getCollection("state-guides");

  const items = [
    ...lawsuits.map((entry) => ({
      title: entry.data.title,
      url: `${site.url}/lawsuits/${entrySlug(entry)}/`,
      description: entry.data.description,
      date: entry.data.lastUpdated
    })),
    ...stateGuides.map((guide) => ({
      title: guide.data.title,
      url: `${site.url}/lawsuits/${guide.data.lawsuitSlug}/${guide.data.stateSlug}/`,
      description: guide.data.description,
      date: guide.data.lastUpdated
    }))
  ]
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    .slice(0, 50);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(`${site.name} — Lawsuit Status Updates`)}</title>
    <link>${site.url}/</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(site.description)}</description>
    <language>en-us</language>
${items.map((item) => `    <item>
      <title>${xmlEscape(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${new Date(`${item.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${xmlEscape(item.description)}</description>
    </item>`).join("\n")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
