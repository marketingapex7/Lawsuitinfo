import { getCollection } from "astro:content";
import { entrySlug } from "@lib/content";
import { site, states } from "@lib/site";

export const prerender = true;

export async function GET() {
  const lawsuits = (await getCollection("lawsuits")).sort((a, b) =>
    a.data.lawsuit.localeCompare(b.data.lawsuit)
  );
  const stateGuides = await getCollection("state-guides");
  const categories = await getCollection("categories");

  const lawsuitLines = lawsuits.map((entry) => {
    const url = `${site.url}/lawsuits/${entrySlug(entry)}/`;
    return `- [${entry.data.title}](${url}): Status: ${entry.data.status}. Primary alleged injury: ${entry.data.primaryInjury}. Last updated ${entry.data.lastUpdated}.`;
  });

  const stateLines = states.map((state) => {
    const guides = stateGuides
      .filter((guide) => guide.data.stateSlug === state.slug)
      .sort((a, b) => a.data.lawsuit.localeCompare(b.data.lawsuit));
    const links = guides
      .map((guide) => `[${guide.data.lawsuit}](${site.url}/lawsuits/${guide.data.lawsuitSlug}/${guide.data.stateSlug}/)`)
      .join(", ");
    return `- [${state.name} lawsuit hub](${site.url}/states/${state.slug}/): ${links}`;
  });

  const body = `# ${site.name}

> ${site.description}

${site.name} (${site.url}) publishes plain-English status guides for active U.S. mass tort and injury litigation. Every guide covers current case status, alleged injuries, evidence commonly reviewed, settlement posture, deadline context, and state-specific filing considerations. Each page shows a visible "last updated" date and is refreshed as dockets and litigation news change. Content is informational only, is not legal advice, and does not create an attorney-client relationship.

## Lawsuit guides

${lawsuitLines.join("\n")}

## State-specific guides

${stateLines.join("\n")}

## Categories

${categories.map((category) => `- [${category.data.name}](${site.url}/categories/${entrySlug(category)}/)`).join("\n")}

## Policies and contact

- [Editorial policy](${site.url}/editorial-policy/): how guides are researched, sourced, and updated
- [Legal disclaimer](${site.url}/legal-disclaimer/): informational content only, not legal advice
- [Advertising disclosure](${site.url}/advertising-disclosure/)
- [Contact](${site.url}/contact/)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
