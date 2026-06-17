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
  "Depo-Provera": "Depo-Provera",
  "Talcum Powder": "Talcum Powder"
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
  const titles: Record<string, string> = {
    "AFFF Firefighting Foam": "AFFF Lawsuit Update 2026: PFAS Settlement & Claims",
    "Camp Lejeune Water Contamination": "Camp Lejeune Lawsuit Update 2026: Payouts & Status",
    "Depo-Provera": "Depo-Provera Lawsuit Update 2026: Brain Tumor MDL",
    "Ozempic / GLP-1": "Ozempic Lawsuit Update 2026: MDL Status & Eligibility",
    "Paraquat Parkinson's": "Paraquat Lawsuit Update 2026: Settlement & Claims",
    "Roundup Cancer": "Roundup Lawsuit Update 2026: Settlement & Deadlines",
    "Suboxone Tooth Decay": "Suboxone Lawsuit Update 2026: Dental Injury MDL",
    "Talcum Powder": "Talcum Powder Lawsuit Update 2026: MDL & Verdicts"
  };
  return titles[lawsuit] ?? `${shortLawsuitName(lawsuit)} Lawsuit: Status & Deadlines`;
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
  return text.length > META_MAX
    ? `${text.slice(0, META_MAX - 3).replace(/\s+\S*$/, "").replace(/[,:;]\s*$/, "")}.`
    : text;
}

export function lawsuitMetaDescription(lawsuit: string, primaryInjury: string) {
  const descriptions: Record<string, string> = {
    "AFFF Firefighting Foam":
      "June 2026 AFFF lawsuit update: PFAS MDL status, public water settlements, personal injury claims, deadlines, evidence, and state pages.",
    "Camp Lejeune Water Contamination":
      "June 2026 Camp Lejeune update: closed filing deadline, Elective Option payouts, pending claims, settlement status, and state guides.",
    "Depo-Provera":
      "June 2026 Depo-Provera lawsuit update: meningioma MDL status, expert hearing dates, trial schedule, records, deadlines, and state guides.",
    "Ozempic / GLP-1":
      "June 2026 Ozempic lawsuit update: GLP-1 MDL status, Rule 702 schedule, alleged stomach injury claims, eligibility, and state guides.",
    "Paraquat Parkinson's":
      "June 2026 Paraquat lawsuit update: Parkinson's MDL status, confidential settlement administration, exposure proof, deadlines, and state pages.",
    "Roundup Cancer":
      "June 2026 Roundup lawsuit update: settlement status, non-Hodgkin lymphoma claims, Supreme Court issue, deadlines, and state guides.",
    "Suboxone Tooth Decay":
      "June 2026 Suboxone lawsuit update: dental injury MDL status, core discovery schedule, records, deadlines, and state guides.",
    "Talcum Powder":
      "June 2026 talcum powder lawsuit update: J&J ovarian cancer and mesothelioma claims, MDL-2738 status, failed bankruptcies, verdicts, and state guides."
  };
  if (descriptions[lawsuit]) return fitMetaDescription(descriptions[lawsuit], " for research.");
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
