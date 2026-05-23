import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const lastUpdated = "2026-05-20";

const states = [
  { name: "Illinois", slug: "illinois", abbr: "IL" },
  { name: "Missouri", slug: "missouri", abbr: "MO" },
  { name: "Texas", slug: "texas", abbr: "TX" },
  { name: "Florida", slug: "florida", abbr: "FL" },
  { name: "California", slug: "california", abbr: "CA" },
  { name: "North Carolina", slug: "north-carolina", abbr: "NC" },
  { name: "Georgia", slug: "georgia", abbr: "GA" },
  { name: "Ohio", slug: "ohio", abbr: "OH" },
  { name: "Pennsylvania", slug: "pennsylvania", abbr: "PA" },
  { name: "Michigan", slug: "michigan", abbr: "MI" }
];

const lawsuits = [
  {
    lawsuit: "Depo-Provera",
    title: "Depo-Provera Lawsuit Guide",
    slug: "depo-provera",
    category: "Defective Drug",
    categorySlug: "defective-drugs",
    status: "Active / Investigating",
    primaryInjury: "Meningioma brain tumors",
    claimDescription: "meningioma brain tumor allegations",
    caseType: "Prescription drug injury claim",
    affected: "People who used Depo-Provera and later received a meningioma diagnosis.",
    product: "Depo-Provera birth control injections",
    allegation: "Lawsuits allege that long-term use of Depo-Provera may be associated with meningioma brain tumors and that users were not adequately warned about the risk.",
    injurySummary: "Claims may involve meningioma diagnosis, brain tumor treatment, surgery, radiation, neurological symptoms, and related medical costs.",
    exposureContext: "State residents may have received Depo-Provera through OB/GYN offices, primary care practices, public health clinics, pharmacies, and other clinical settings.",
    injuries: ["Meningioma", "Brain tumor diagnosis", "Surgery", "Radiation treatment", "Neurological symptoms"],
    evidence: ["Prescription records", "Injection dates", "OB/GYN or clinic records", "Brain imaging reports", "Pathology or neurology records", "Surgery and radiation records"],
    faqs: [
      ["What is the Depo-Provera lawsuit about?", "Lawsuits allege that some users developed meningioma brain tumors after Depo-Provera use and that warnings may have been inadequate."],
      ["Does a Depo-Provera diagnosis mean I have a claim?", "No. Eligibility depends on individual facts, records, timing, diagnosis, and applicable law."],
      ["What records may matter most?", "Prescription history, injection dates, medical records, imaging reports, pathology reports, and treatment records may be important."],
      ["Are defendants disputing the allegations?", "Defendants generally may dispute liability, causation, damages, or whether warnings were adequate."],
      ["Is there a guaranteed settlement?", "No settlement is guaranteed, and settlement status may change as cases develop."],
      ["Can state law affect my claim?", "Yes. Filing deadlines and claim evaluation may depend on state law and individual facts."],
      ["Should I stop medication based on this page?", "No. Medical decisions should be discussed with a licensed healthcare professional."],
      ["Can a lawyer review my records?", "A lawyer reviewing these claims can explain what records are needed and whether your facts may support a claim."]
    ]
  },
  {
    lawsuit: "Suboxone Tooth Decay",
    title: "Suboxone Tooth Decay Lawsuit Guide",
    slug: "suboxone",
    category: "Defective Drug",
    categorySlug: "defective-drugs",
    status: "Active / Investigating",
    primaryInjury: "Severe dental injuries",
    claimDescription: "severe tooth decay and dental injury allegations",
    caseType: "Prescription drug dental injury claim",
    affected: "People who used Suboxone film or tablets and later experienced serious dental injury.",
    product: "Suboxone medication-assisted treatment products",
    allegation: "Lawsuits allege that Suboxone film or tablets may be linked to severe tooth decay and that warnings about dental risks were not adequate for some users.",
    injurySummary: "Claims may involve severe tooth decay, tooth loss, cavities, dental extractions, gum damage, and dental restoration costs.",
    exposureContext: "State residents may have received Suboxone through addiction treatment providers, medication-assisted treatment programs, clinics, pharmacies, and prescribing physicians.",
    injuries: ["Severe tooth decay", "Tooth loss", "Cavities", "Dental extractions", "Gum damage", "Dental restoration costs"],
    evidence: ["Prescription records", "Treatment program records", "Dental records before and after use", "Extraction records", "Restoration invoices", "Photographs or dental imaging"],
    faqs: [
      ["What is the Suboxone tooth decay lawsuit about?", "Lawsuits allege that some users suffered severe dental injuries after Suboxone use and that warnings may have been inadequate."],
      ["What dental injuries may be involved?", "Claims may involve decay, tooth loss, cavities, extractions, gum damage, and restoration costs."],
      ["Do I automatically qualify if I used Suboxone?", "No. Eligibility depends on records, timing, injury severity, and individual facts."],
      ["What records should I collect?", "Prescription records, pharmacy records, treatment records, dental charts, invoices, and imaging may be useful."],
      ["Is this page medical advice?", "No. Medical or treatment decisions should be discussed with a healthcare professional."],
      ["Can defendants dispute the claims?", "Yes. Defendants may dispute causation, warnings, damages, or other issues."],
      ["Are settlements guaranteed?", "No. Settlement status can change and there is no guaranteed result."],
      ["Can state deadlines matter?", "Yes. State filing deadlines may affect whether a claim can be pursued."]
    ]
  },
  {
    lawsuit: "AFFF Firefighting Foam",
    title: "AFFF Firefighting Foam Lawsuit Guide",
    slug: "afff-firefighting-foam",
    category: "Toxic Exposure",
    categorySlug: "toxic-exposure",
    status: "Active / Investigating",
    primaryInjury: "PFAS exposure-related cancer and disease claims",
    claimDescription: "kidney cancer, testicular cancer, thyroid disease, ulcerative colitis, and other PFAS exposure-related claims",
    injuryExperiencePhrase: "kidney cancer, testicular cancer, thyroid disease, ulcerative colitis, or another condition being reviewed in PFAS-related AFFF claims",
    caseType: "Toxic exposure injury claim",
    affected: "People with significant AFFF or PFAS exposure history and a related diagnosis.",
    product: "Aqueous film-forming firefighting foam and PFAS chemicals",
    allegation: "Lawsuits allege that AFFF firefighting foam containing PFAS chemicals exposed firefighters, military personnel, workers, and communities to substances linked in claims to serious disease.",
    injurySummary: "Claims may involve kidney cancer, testicular cancer, thyroid disease, ulcerative colitis, and other PFAS exposure-related allegations.",
    exposureContext: "State residents may have encountered AFFF or PFAS through fire departments, airports, military bases, industrial facilities, training areas, or water contamination.",
    injuries: ["Kidney cancer", "Testicular cancer", "Thyroid disease", "Ulcerative colitis", "PFAS exposure-related claims"],
    evidence: ["Employment records", "Firefighting or military service records", "Training site history", "Water testing records", "Medical diagnosis records", "Pathology reports"],
    faqs: [
      ["What is the AFFF lawsuit about?", "Lawsuits allege that PFAS-containing firefighting foam exposed people to chemicals linked in claims to cancers and other diseases."],
      ["Who may be affected?", "Firefighters, airport workers, military personnel, industrial workers, and residents near contaminated sites may have relevant exposure histories."],
      ["What injuries are commonly discussed?", "Claims often discuss kidney cancer, testicular cancer, thyroid disease, ulcerative colitis, and PFAS exposure-related conditions."],
      ["What records may help?", "Employment, service, training, exposure, water testing, diagnosis, and pathology records may be useful."],
      ["Does exposure alone prove a claim?", "No. Claims depend on exposure history, diagnosis, timing, causation evidence, and applicable law."],
      ["Are defendants disputing these cases?", "Defendants may dispute exposure, causation, warnings, liability, and damages."],
      ["Is there a guaranteed settlement?", "No. Outcomes depend on the legal process and individual facts."],
      ["Can state law still matter?", "Yes. Deadlines and claim evaluation may depend on state law even when cases are coordinated nationally."]
    ]
  },
  {
    lawsuit: "Paraquat Parkinson's",
    title: "Paraquat Parkinson's Lawsuit Guide",
    slug: "paraquat",
    category: "Toxic Exposure",
    categorySlug: "toxic-exposure",
    status: "Active / Investigating",
    primaryInjury: "Parkinson's disease",
    claimDescription: "Parkinson's disease allegations",
    caseType: "Pesticide exposure injury claim",
    affected: "People with paraquat exposure history who later developed Parkinson's disease.",
    product: "Paraquat herbicide products",
    allegation: "Lawsuits allege that paraquat exposure may be associated with Parkinson's disease and that users were not adequately warned about neurological risks.",
    injurySummary: "Claims may involve Parkinson's disease, neurological symptoms, agricultural exposure history, and pesticide applicator exposure.",
    exposureContext: "State residents may have encountered paraquat through farms, crop handling, pesticide application, agricultural work, mixing, loading, or nearby work activities.",
    injuries: ["Parkinson's disease", "Neurological symptoms", "Agricultural exposure history", "Pesticide applicator exposure"],
    evidence: ["Agricultural employment records", "Pesticide applicator records", "Purchase or use records", "Medical diagnosis records", "Neurology records", "Exposure history notes"],
    faqs: [
      ["What is the Paraquat lawsuit about?", "Lawsuits allege that paraquat exposure may be linked to Parkinson's disease and that warnings may have been inadequate."],
      ["Who may have relevant exposure?", "Agricultural workers, pesticide applicators, mixers, loaders, and people working near application may have relevant histories."],
      ["Does Parkinson's disease prove a claim?", "No. Eligibility depends on exposure, diagnosis, timing, records, and applicable law."],
      ["What records may help?", "Employment, applicator, purchase, exposure, medical, and neurology records may be useful."],
      ["Are defendants disputing the allegations?", "Defendants may dispute exposure, causation, warnings, liability, and damages."],
      ["Are settlements guaranteed?", "No. There is no guaranteed settlement or result."],
      ["Can state deadlines matter?", "Yes. Deadlines vary and can depend on diagnosis date, discovery date, exposure history, and other facts."],
      ["Should medical decisions be based on this page?", "No. Medical decisions should be made with a healthcare professional."]
    ]
  },
  {
    lawsuit: "Roundup Cancer",
    title: "Roundup Cancer Lawsuit Guide",
    slug: "roundup",
    category: "Toxic Exposure",
    categorySlug: "toxic-exposure",
    status: "Active / Investigating",
    primaryInjury: "Non-Hodgkin lymphoma",
    claimDescription: "non-Hodgkin lymphoma allegations",
    caseType: "Herbicide exposure injury claim",
    affected: "People with glyphosate exposure history who later developed non-Hodgkin lymphoma.",
    product: "Roundup and glyphosate-based herbicide products",
    allegation: "Lawsuits allege that glyphosate-based Roundup exposure may be associated with non-Hodgkin lymphoma and that warnings were inadequate.",
    injurySummary: "Claims may involve non-Hodgkin lymphoma, glyphosate exposure, agricultural work, landscaping, or groundskeeping exposure.",
    exposureContext: "State residents may have encountered Roundup through agricultural use, residential use, landscaping, groundskeeping, parks, schools, golf courses, or similar settings.",
    injuries: ["Non-Hodgkin lymphoma", "Glyphosate exposure", "Agricultural exposure", "Landscaping or groundskeeping exposure"],
    evidence: ["Product use history", "Employment or groundskeeping records", "Purchase records", "Medical diagnosis records", "Oncology records", "Treatment records"],
    faqs: [
      ["What is the Roundup lawsuit about?", "Lawsuits allege that glyphosate-based Roundup exposure may be linked to non-Hodgkin lymphoma and that warnings were inadequate."],
      ["What injury is commonly involved?", "Roundup claims commonly involve non-Hodgkin lymphoma allegations."],
      ["Who may have relevant exposure?", "Agricultural workers, landscapers, groundskeepers, homeowners, and others with repeated product exposure may have relevant histories."],
      ["Do I qualify if I used Roundup?", "Not automatically. Eligibility depends on exposure details, diagnosis, timing, records, and applicable law."],
      ["What records may help?", "Use records, purchase records, employment records, diagnosis records, oncology records, and treatment records may be useful."],
      ["Are defendants disputing claims?", "Defendants may dispute causation, warnings, exposure, liability, or damages."],
      ["Is a settlement guaranteed?", "No. Settlement status and outcomes vary."],
      ["Do state deadlines matter?", "Yes. Filing deadlines vary by state and depend on individual facts."]
    ]
  }
];

function yamlScalar(value) {
  return JSON.stringify(value);
}

function yamlValue(value, indent = 0) {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value
      .map((item) => {
        if (typeof item === "object") {
          const nested = Object.entries(item)
            .map(([key, nestedValue]) => yamlPair(key, nestedValue, indent + 2))
            .join("\n");
          return `${pad}-\n${nested}`;
        }
        return `${pad}- ${yamlScalar(item)}`;
      })
      .join("\n");
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, nestedValue]) => yamlPair(key, nestedValue, indent))
      .join("\n");
  }
  return yamlScalar(value);
}

function yamlPair(key, value, indent = 0) {
  const pad = " ".repeat(indent);
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return `${pad}${key}:\n${yamlValue(value, indent + 2)}`;
  }
  return `${pad}${key}: ${yamlScalar(value)}`;
}

function frontmatter(data) {
  return `---\n${Object.entries(data)
    .map(([key, value]) => yamlPair(key, value, 0))
    .join("\n")}\n---\n\n`;
}

function faqObjects(items) {
  return items.map(([question, answer]) => ({ question, answer }));
}

function lowerInjuryPhrase(item) {
  return item.primaryInjury.charAt(0).toLowerCase() + item.primaryInjury.slice(1);
}

function claimDescription(item) {
  return item.claimDescription ?? `${lowerInjuryPhrase(item)} allegations`;
}

function injuryExperiencePhrase(item) {
  return item.injuryExperiencePhrase ?? lowerInjuryPhrase(item);
}

function hubBody(item) {
  return `<section id="overview">
<h2>What the lawsuit is about</h2>
<p>${item.allegation}</p>
<p>Claims may involve ${item.product}. Plaintiffs claim they experienced injuries after use or exposure, while defendants generally dispute allegations, causation, liability, or damages. No page on this site can determine whether a person qualifies for a claim.</p>
</section>

<section id="status">
<h2>Current litigation status</h2>
<p>${item.lawsuit} claims are listed here as ${item.status.toLowerCase()}. Some claims may be coordinated nationally, including through federal multidistrict litigation where applicable, while others may be evaluated through different legal processes.</p>
<p>Litigation status can change. This guide should be read as a general case-status overview rather than a real-time court docket.</p>
</section>

<section id="eligibility">
<h2>Who may be affected</h2>
<ul>
<li>People with documented use of or exposure to ${item.product}.</li>
<li>People later diagnosed with ${injuryExperiencePhrase(item)}.</li>
<li>People who can identify approximate dates, locations, providers, employers, or exposure circumstances.</li>
<li>Families evaluating possible wrongful death issues should ask a lawyer how state law may apply.</li>
</ul>
</section>
`;
}

function stateBody(item, state) {
  return `<section id="state-overview">
<h2>What ${state.name} residents should know</h2>
<p>${state.name} residents are not necessarily limited to filing only in ${state.name} state court. Many mass tort claims may be evaluated by national firms, filed in federal court, coordinated through MDL proceedings, or handled through another legal process.</p>
<p>State law may still matter for deadlines, damages, claim evaluation, and certain procedural issues.</p>
</section>

<section id="eligibility">
<h2>Possible eligibility factors</h2>
<p>${state.name} residents may want to speak with a lawyer if they used or were exposed to ${item.product} and later experienced ${injuryExperiencePhrase(item)}.</p>
<ul>
<li>Use, prescription, employment, service, or exposure history.</li>
<li>Medical diagnosis and treatment records.</li>
<li>Approximate dates of use, exposure, diagnosis, and treatment.</li>
<li>Information about prior conditions, alternative exposures, or other facts a lawyer may need to evaluate.</li>
</ul>
</section>

<section id="deadlines">
<h2>${state.name} deadline considerations</h2>
<p>Filing deadlines may depend on diagnosis date, discovery date, exposure history, state law, wrongful death issues, and other facts. This page does not provide legal advice or deadline calculations.</p>
</section>
`;
}

function write(path, content) {
  writeFileSync(join(root, path), content, "utf8");
}

mkdirSync(join(root, "src/content/lawsuits"), { recursive: true });
mkdirSync(join(root, "src/content/state-guides"), { recursive: true });
mkdirSync(join(root, "src/content/categories"), { recursive: true });

for (const item of lawsuits) {
  const injuryLower = lowerInjuryPhrase(item);
  const fm = {
    title: item.title,
    description: `Plain-English guide to ${item.lawsuit} lawsuits, ${claimDescription(item)}, current case status, eligibility factors, and state-specific resources.`,
    lawsuit: item.lawsuit,
    slug: item.slug,
    category: item.category,
    categorySlug: item.categorySlug,
    status: item.status,
    primaryInjury: item.primaryInjury,
    caseType: item.caseType,
    affected: item.affected,
    evidence: item.evidence,
    injuries: item.injuries,
    timeline: [
      { label: "Product use or exposure", detail: `Claim evaluation usually starts with records showing use of or exposure to ${item.product}.` },
      { label: "Diagnosis and treatment", detail: `Medical records can help connect the timeline between alleged exposure and ${injuryExperiencePhrase(item)}.` },
      { label: "Claim review", detail: "A lawyer may compare the exposure and diagnosis timeline with the current litigation posture, filing deadlines, and available evidence." }
    ],
    lastUpdated,
    lastReviewed: lastUpdated,
    sponsorStatus: "available",
    faqs: faqObjects(item.faqs)
  };
  write(`src/content/lawsuits/${item.slug}.md`, frontmatter(fm) + hubBody(item));

  for (const state of states) {
    const article = ["Illinois", "Ohio"].includes(state.name) ? "an" : "a";
    const sfm = {
      title: `${item.lawsuit} Lawsuit in ${state.name}`,
      description: `Information for ${state.name} residents researching ${item.lawsuit} lawsuits, ${claimDescription(item)}, possible eligibility factors, records, deadlines, and legal options.`,
      lawsuit: item.lawsuit,
      lawsuitSlug: item.slug,
      state: state.name,
      stateSlug: state.slug,
      stateAbbr: state.abbr,
      category: item.category,
      categorySlug: item.categorySlug,
      status: item.status,
      primaryInjury: item.primaryInjury,
      exposureContext: item.exposureContext,
      lastUpdated,
      lastReviewed: lastUpdated,
      sponsorStatus: "available",
      faqs: faqObjects([
        [`What is the ${item.lawsuit} lawsuit in ${state.name} about?`, `This guide explains general information for ${state.name} residents researching ${item.lawsuit} claims involving ${claimDescription(item)}.`],
        [`Can ${article} ${state.name} resident join a national lawsuit?`, `Possibly. Many mass tort claims are evaluated nationally or coordinated through federal proceedings, but the path depends on individual facts.`],
        [`Do ${state.name} deadlines matter?`, `Yes. Filing deadlines may depend on state law, diagnosis date, discovery date, exposure history, and other facts.`],
        ["What records should I gather?", "Medical records, exposure or use records, pharmacy records, employment records, treatment invoices, and diagnosis documents may help a lawyer review a claim."],
        ["Does this page provide legal advice?", "No. This page is general legal information only and does not create an attorney-client relationship."],
        ["Is a settlement guaranteed?", "No. No settlement, claim value, or outcome is guaranteed."],
        [`Can defendants dispute ${item.lawsuit} claims?`, "Yes. Defendants may dispute causation, warnings, liability, damages, or other issues."],
        ["What should I ask a lawyer first?", "Ask whether they are reviewing the claim type, what records they need, how deadlines apply, and whether the case would be handled locally, nationally, or through an MDL."]
      ])
    };
    write(`src/content/state-guides/${item.slug}-${state.slug}.md`, frontmatter(sfm) + stateBody(item, state));
  }
}

const categories = [
  {
    title: "Defective Drug Lawsuit Guides",
    name: "Defective Drugs",
    slug: "defective-drugs",
    description: "Medication-focused lawsuit guides involving alleged injuries, warnings, treatment records, and state-specific legal context.",
    lawsuitSlugs: ["depo-provera", "suboxone"],
    body: "This category includes lawsuit guides involving prescription or clinical drug products. Claims may focus on alleged warnings, injury patterns, medical records, and individual use history."
  },
  {
    title: "Toxic Exposure Lawsuit Guides",
    name: "Toxic Exposure",
    slug: "toxic-exposure",
    description: "Toxic exposure lawsuit guides involving chemicals, pesticides, PFAS, herbicides, cancer claims, and neurological injury allegations.",
    lawsuitSlugs: ["afff-firefighting-foam", "paraquat", "roundup"],
    body: "This category includes claims involving alleged exposure to chemicals, pesticides, herbicides, PFAS, or other substances. Exposure history and medical diagnosis records are usually central to review."
  },
  {
    title: "Product Liability Lawsuit Guides",
    name: "Product Liability",
    slug: "product-liability",
    description: "A broad category page linking all launch injury lawsuit guides while the product liability library expands.",
    lawsuitSlugs: lawsuits.map((item) => item.slug),
    body: "This MVP category links to all launch guides. Future versions can separate drug, device, consumer product, and exposure claims as the library grows."
  }
];

for (const category of categories) {
  write(
    `src/content/categories/${category.slug}.md`,
    frontmatter({
      title: category.title,
      description: category.description,
      slug: category.slug,
      name: category.name,
      lawsuitSlugs: category.lawsuitSlugs,
      lastUpdated
    }) + `<p>${category.body}</p>\n`
  );
}

console.log(`Generated ${lawsuits.length} lawsuit guides, ${lawsuits.length * states.length} state guides, and ${categories.length} category pages.`);
