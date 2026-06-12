import { site } from "./site";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function absoluteUrl(pathname: string) {
  return new URL(pathname, site.url).toString();
}

export function webPageSchema(
  title: string,
  description: string,
  url: string,
  speakableSelectors?: string[]
) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url
  };
  if (speakableSelectors && speakableSelectors.length > 0) {
    schema.speakable = {
      "@type": "SpeakableSpecification",
      cssSelector: speakableSelectors
    };
  }
  return schema;
}

export type DatasetVariable = {
  name: string;
  value: string;
};

export function datasetSchema({
  name,
  description,
  url,
  dateModified,
  variables
}: {
  name: string;
  description: string;
  url: string;
  dateModified?: string;
  variables?: DatasetVariable[];
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url,
    creator: {
      "@type": "Organization",
      name: site.name,
      url: site.url
    },
    isAccessibleForFree: true
  };
  if (dateModified) schema.dateModified = dateModified;
  if (variables && variables.length > 0) {
    schema.variableMeasured = variables.map((variable) => ({
      "@type": "PropertyValue",
      name: variable.name,
      value: variable.value
    }));
  }
  return schema;
}

export function articleSchema({
  title,
  description,
  url,
  dateModified,
  datePublished
}: {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    dateModified,
    datePublished: datePublished ?? dateModified,
    author: {
      "@type": "Organization",
      name: site.name
    },
    publisher: {
      "@type": "Organization",
      name: site.name
    }
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description
  };
}

// Short, search-aligned display names for use in <title> tags (the full
// frontmatter name stays in H1s and body copy).
const TITLE_NAMES: Record<string, string> = {
  "Camp Lejeune Water Contamination": "Camp Lejeune",
  "Ozempic / GLP-1": "Ozempic",
  "Roundup Cancer": "Roundup",
  "Suboxone Tooth Decay": "Suboxone",
  "AFFF Firefighting Foam": "AFFF",
  "Paraquat Parkinson's": "Paraquat",
  "Depo-Provera": "Depo-Provera"
};

export function shortLawsuitName(lawsuit: string): string {
  return TITLE_NAMES[lawsuit] ?? lawsuit;
}

// Append the brand only when the result stays within SERP-safe length (~62
// chars); otherwise return the keyword-led core alone so it isn't truncated.
export function composeTitle(core: string): string {
  const branded = `${core} | ${site.name}`;
  return branded.length <= 62 ? branded : core;
}

export function lawsuitSeoTitle(lawsuit: string) {
  return `${shortLawsuitName(lawsuit)} Lawsuit: Status & Deadlines`;
}

export function stateGuideSeoTitle(lawsuit: string, state: string) {
  return `${shortLawsuitName(lawsuit)} Lawsuit in ${state}: Deadlines & Status`;
}

function metaInjury(primaryInjury: string) {
  const value = primaryInjury.toLowerCase();
  if (value.includes("pfas")) return "PFAS-related cancer and disease";
  if (value.includes("tooth")) return "severe tooth decay and dental damage";
  if (value.includes("parkinson")) return "Parkinson's disease";
  if (value.includes("non-hodgkin")) return "non-Hodgkin lymphoma";
  if (value.includes("meningioma")) return "meningioma brain tumors";
  return value.replace(/\bpfas\b/g, "PFAS");
}

const META_MAX = 155;

function fitMetaDescription(description: string, shortSuffix: string) {
  let text = description.replace(/\s+/g, " ").trim();
  if (text.length > META_MAX) {
    text = text
      .replace("records, ", "")
      .replace("eligibility factors", "eligibility")
      .replace("litigation status", "status");
  }
  if (text.length < 148) {
    const base = text.endsWith(".") ? text.slice(0, -1) : text;
    for (const suffix of [shortSuffix, " for residents.", " for research.", " locally."]) {
      if (`${base}${suffix}`.length >= 148 && `${base}${suffix}`.length <= META_MAX) {
        text = `${base}${suffix}`;
        break;
      }
    }
  }
  return text.length > META_MAX ? `${text.slice(0, META_MAX - 3).replace(/\s+\S*$/, "")}.` : text;
}

export function lawsuitMetaDescription(lawsuit: string, primaryInjury: string) {
  const injury = metaInjury(primaryInjury);
  return fitMetaDescription(
    `${lawsuit} lawsuit guide covering alleged ${injury}, eligibility factors, status, deadlines, evidence, and 10 state pages.`,
    " for research."
  );
}

export function stateGuideMetaDescription(lawsuit: string, state: string, primaryInjury: string) {
  const injury = metaInjury(primaryInjury);
  return fitMetaDescription(
    `${state} ${lawsuit} lawsuit guide covering alleged ${injury}, eligibility factors, records, deadlines, and state context.`,
    " for local residents."
  );
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
