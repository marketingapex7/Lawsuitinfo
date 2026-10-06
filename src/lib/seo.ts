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
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    dateModified,
    author: {
      "@type": "Organization",
      name: site.name,
      url: site.url
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url
    }
  };
  if (datePublished) schema.datePublished = datePublished;
  return schema;
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
  "Bard Hernia Mesh": "Hernia Mesh",
  "Bard PowerPort": "Bard PowerPort",
  "Paraquat Parkinson's": "Paraquat",
  "Depo-Provera": "Depo-Provera",
  "Hair Relaxer": "Hair Relaxer",
  "Talcum Powder": "Talcum Powder",
  "Paragard IUD": "Paragard",
  "Social Media Addiction": "Social Media"
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

// The month in each title comes from the page's own lastUpdated date, so a title
// never claims a newer update than the page actually received.
export function lawsuitSeoTitle(lawsuit: string, lastUpdated?: string) {
  const m = monthYear(lastUpdated);
  const titles: Record<string, string> = {
    "AFFF Firefighting Foam": `AFFF Lawsuit Update ${m}: MDL 2873 Status`,
    "Bard Hernia Mesh": `Hernia Mesh Lawsuit Update ${m}`,
    "Bard PowerPort": `Bard PowerPort Lawsuit Update ${m}`,
    "Camp Lejeune Water Contamination": `Camp Lejeune Lawsuit Update ${m}`,
    "Depo-Provera": `Depo-Provera Lawsuit Update ${m}`,
    "Hair Relaxer": `Hair Relaxer Lawsuit Update ${m}`,
    "Ozempic / GLP-1": `Ozempic Lawsuit Update ${m}: MDL 3094`,
    "Paragard IUD": `Paragard Lawsuit Update ${m}: MDL 2974`,
    "Paraquat Parkinson's": `Paraquat Lawsuit Update ${m}: MDL 3004`,
    "Roundup Cancer": `Roundup Lawsuit Update ${m}: Settlement`,
    "Social Media Addiction": `Social Media Lawsuit Update ${m}`,
    "Suboxone Tooth Decay": `Suboxone Lawsuit Update ${m}: MDL 3092`,
    "Talcum Powder": `Talcum Powder Lawsuit Update ${m}`
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

export function monthYear(date?: string) {
  if (!date) return "2026";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}

export function lawsuitMetaDescription(lawsuit: string, primaryInjury: string, lastUpdated?: string) {
  const period = monthYear(lastUpdated);
  const descriptions: Record<string, string> = {
    "AFFF Firefighting Foam":
      `${period} AFFF lawsuit update: MDL 2873 status, PFAS claims, water-system settlements, personal-injury deadlines, and state pages.`,
    "Bard Hernia Mesh":
      `${period} Bard hernia mesh lawsuit update: MDL-2846 status, pending cases, alleged mesh injuries, evidence, settlement posture, and deadlines.`,
    "Bard PowerPort":
      `${period} Bard PowerPort lawsuit update: MDL-3081 status, catheter fracture and migration claims, records, settlement posture, and deadlines.`,
    "Camp Lejeune Water Contamination":
      `${period} Camp Lejeune update: closed filing deadline, Elective Option payouts, pending claims, settlement status, and state guides.`,
    "Depo-Provera":
      `${period} Depo-Provera lawsuit update: meningioma MDL status, expert hearing dates, trial schedule, records, deadlines, and state guides.`,
    "Hair Relaxer":
      `${period} hair relaxer lawsuit update: MDL-3060 status, uterine and ovarian cancer claims, records, settlement posture, and deadlines.`,
    "Ozempic / GLP-1":
      `${period} Ozempic lawsuit update: GLP-1 MDL status, pending Rule 702 ruling, alleged stomach injury claims, eligibility, and state guides.`,
    "Paragard IUD":
      `${period} Paragard IUD lawsuit update: MDL-2974 status, device-breakage claims, bellwether trials, eligibility, deadlines, and state guides.`,
    "Paraquat Parkinson's":
      `${period} Paraquat lawsuit update: Parkinson's MDL status, confidential settlement administration, exposure proof, deadlines, and state pages.`,
    "Roundup Cancer":
      `${period} Roundup lawsuit update: class settlement approval status, Durnell preemption ruling, opt-out trials, MDL status, and deadlines.`,
    "Social Media Addiction":
      `${period} social media addiction lawsuit update: Meta state AG settlement, MDL 3047 status, teen injury claims, school-district trial, and deadlines.`,
    "Suboxone Tooth Decay":
      `${period} Suboxone lawsuit update: dental injury MDL status, core discovery schedule, records, deadlines, and state guides.`,
    "Talcum Powder":
      `${period} talcum powder lawsuit update: J&J ovarian cancer and mesothelioma claims, MDL-2738 status, failed bankruptcies, verdicts, and state guides.`
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
