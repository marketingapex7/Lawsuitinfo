// Generates state-guide markdown files for newly added cases.
// Usage: node scripts/add-case-states.mjs
// Idempotent: overwrites only the state guides for the cases configured below.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const lastUpdated = "2026-06-11";

const limitations = JSON.parse(
  readFileSync(join(root, "src/data/states/limitations.json"), "utf8")
);

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

// Indefinite article for a state name ("a" / "an"). Vowel-initial state names
// (e.g. Illinois, Ohio) take "an" — avoids ungrammatical "a Illinois".
const art = (s) => (/^[aeiou]/i.test(s.name) ? "an" : "a");

const cases = [
  {
    lawsuit: "Ozempic / GLP-1",
    slug: "ozempic",
    title: (s) => `Ozempic Lawsuit in ${s.name} (GLP-1 Claims)`,
    category: "Defective Drug",
    categorySlug: "defective-drugs",
    status: "Active / Investigating",
    primaryInjury: "Gastroparesis and severe gastrointestinal injuries",
    description: (s) =>
      `Information for ${s.name} residents researching Ozempic and GLP-1 lawsuits: gastroparesis and bowel-injury allegations, MDL-3094 status, eligibility factors, records, and ${s.name} filing deadlines.`,
    exposureContext: (s) =>
      `${s.name} residents may have been prescribed Ozempic, Wegovy, Rybelsus, Saxenda, Mounjaro, Zepbound, or Trulicity through endocrinologists, primary care practices, weight-management clinics, telehealth services, or hospital systems across the state.`,
    overview: (s) =>
      `<p>${s.name} residents with GLP-1 injury claims are generally not limited to ${s.name} state court. Most filed cases are transferred into the federal multidistrict litigation, <strong>MDL-3094</strong>, before Judge Karen S. Marston in the Eastern District of Pennsylvania, which held 3,763 pending cases as of June 1, 2026.</p>
<p>${s.name} law still matters: the state's filing deadline, damages rules, and procedural law can shape an individual claim even when the case is litigated in the MDL.</p>`,
    eligibilityBullets: (s) => [
      `Documented use of a GLP-1 medication (prescription and pharmacy records from ${s.name} providers).`,
      "A diagnosis such as gastroparesis, ileus, or bowel obstruction — commonly supported by a gastric emptying study, endoscopy, imaging, or hospitalization records.",
      "Injury timing consistent with medication use.",
      `Filing within the deadline that applies to the claim under ${s.name} law.`
    ],
    process: (s, lim) =>
      `<p>Most ${s.name} GLP-1 cases are filed in or transferred to MDL-3094 in the Eastern District of Pennsylvania for coordinated proceedings. The court has scheduled Rule 702 expert-admissibility hearings for September 10–18, 2026 (Case Management Order No. 32); bellwether trial dates have not yet been set. ${s.name}'s general personal injury limitations period is ${lim.piYears} years (${lim.citation}), but accrual and discovery-rule questions are fact-specific for injuries that develop during ongoing medication use.</p>`,
    faqs: (s, lim) => [
      [`What is the Ozempic lawsuit in ${s.name} about?`, `Lawsuits allege GLP-1 medications such as Ozempic can cause gastroparesis, ileus, and bowel obstruction, and that warnings were inadequate. ${s.name} residents' cases are generally transferred into federal MDL-3094 for coordinated proceedings. Defendants dispute the allegations.`],
      [`Can ${art(s)} ${s.name} resident join the Ozempic MDL?`, `Possibly. Cases filed by ${s.name} residents in federal court are routinely transferred into MDL-3094 in the Eastern District of Pennsylvania. Whether an individual claim is filed there depends on case strategy and individual facts.`],
      [`What is the Ozempic lawsuit statute of limitations in ${s.name}?`, `${s.name}'s general personal injury period is ${lim.piYears} years (${lim.citation}). ${lim.discoveryNote || "Accrual rules vary."} Only a lawyer can confirm the deadline for a specific situation.`],
      [`Which drugs are included for ${s.name} claimants?`, "Filed cases involve Ozempic, Wegovy, Rybelsus, and Saxenda (Novo Nordisk) and Mounjaro, Zepbound, and Trulicity (Eli Lilly). Both diabetes and weight-loss prescriptions appear among filed cases."],
      [`What records matter most for ${art(s)} ${s.name} claim?`, "Prescription and pharmacy records, gastroenterology records, gastric emptying study results, hospitalization records, and imaging or endoscopy reports are commonly requested first."],
      ["Has there been an Ozempic settlement?", "No. As of June 2026 no settlement program exists in the GLP-1 litigation. The Rule 702 hearings set for September 10-18, 2026 and the rulings that follow are the next events expected to shape settlement posture. Bellwether trial dates have not been set, and no outcome is guaranteed."],
      ["Is Ozempic recalled?", "No. GLP-1 medications remain FDA-approved and on the market. The litigation concerns warnings and alleged injuries, not availability. Medication decisions belong with a licensed healthcare professional."],
      ["Does this page provide legal advice?", "No. This page is general legal information for research purposes only and does not create an attorney-client relationship."]
    ]
  },
  {
    lawsuit: "Camp Lejeune Water Contamination",
    slug: "camp-lejeune",
    title: (s) => `Camp Lejeune Claims for ${s.name} Residents`,
    category: "Toxic Exposure",
    categorySlug: "toxic-exposure",
    status: "Active — Filing Deadline Passed",
    primaryInjury: "Cancers and other illnesses linked to contaminated water",
    description: (s) =>
      `Information for ${s.name} residents with Camp Lejeune claims: the closed CLJA deadline, Elective Option settlement payouts, pending claim status, and how claims proceed in the Eastern District of North Carolina.`,
    exposureContext: (s) =>
      `${s.name} is home to veterans, military family members, and former civilian workers who served or lived at Marine Corps Base Camp Lejeune between 1953 and 1987. Exposure occurred at the base in North Carolina — where a claimant lives today, including ${s.name}, does not change eligibility or where the claim is decided.`,
    overview: (s) =>
      `<p>Camp Lejeune claims are federal statutory claims under the Camp Lejeune Justice Act, decided exclusively in the <strong>U.S. District Court for the Eastern District of North Carolina</strong> — regardless of whether the claimant lives in ${s.name} or anywhere else.</p>
<p><strong>The CLJA filing window closed on August 10, 2024.</strong> This page is for ${s.name} residents whose claims were filed in time: roughly 407,000 administrative claims and 3,744 lawsuits remain in process. Per DOJ figures dated May 15, 2026, more than $876 million in settlements had been offered and approximately $665 million paid.</p>`,
    eligibilityBullets: (s) => [
      "A claim filed with the Navy (or a lawsuit filed in E.D.N.C.) on or before August 10, 2024.",
      "Documented presence at Camp Lejeune for at least 30 cumulative days between August 1, 1953 and December 31, 1987.",
      "A qualifying diagnosis — Elective Option tiers cover kidney, liver, and bladder cancers, leukemia, non-Hodgkin lymphoma, multiple myeloma, Parkinson's disease, kidney disease, and systemic sclerosis.",
      `Updated medical records from ${s.name} providers, which affect settlement tier placement and offer values.`
    ],
    process: (s) =>
      `<p>${s.name} residents do not file or appear in ${s.name} courts for these claims. Pending administrative claims are reviewed by the Navy JAG Tort Claims Unit; unresolved claims proceed in the Eastern District of North Carolina, where Track 1 bellwether trials are underway in 2026. Elective Option offers — tiered at roughly $100,000 to $450,000 plus $100,000 for qualifying wrongful-death claims — continue to be extended weekly.</p>`,
    faqs: (s) => [
      [`Can ${art(s)} ${s.name} resident still file a Camp Lejeune claim?`, "Generally no. The CLJA two-year window closed on August 10, 2024, and new claims are generally barred no matter what state the claimant lives in. Anyone with unusual circumstances should ask a lawyer directly rather than assume a filing right exists."],
      [`What happens to ${art(s)} ${s.name} resident's pending claim?`, "It stays active. Filed administrative claims continue through Navy review and the Elective Option program, and filed lawsuits continue in the Eastern District of North Carolina. Where the claimant lives does not affect the queue."],
      ["How much are Camp Lejeune settlements paying?", "Elective Option offers are tiered at roughly $100,000 to $450,000 by diagnosis and exposure duration, plus $100,000 for qualifying wrongful-death claims. Per DOJ figures dated May 15, 2026, more than $876 million had been offered and approximately $665 million paid. Individual amounts vary."],
      [`Why is the case in North Carolina if I live in ${s.name}?`, "The Camp Lejeune Justice Act gives exclusive jurisdiction to the Eastern District of North Carolina because the exposure occurred at the base. Claimants generally do not need to travel; their lawyers litigate in that court."],
      ["Do state filing deadlines apply to Camp Lejeune claims?", "No. The CLJA set its own federal deadline — August 10, 2024 — which has passed. State statutes of limitations do not control these claims."],
      ["Does a settlement affect VA benefits?", "Elective Option settlements are not reduced by VA benefit offsets, per DOJ guidance. Recoveries outside that program — litigated judgments or other settlements — may be subject to the CLJA's offset for certain VA, Medicare, or Medicaid payments made for the same harm. Ongoing VA health care and disability status are not taken away by settling."],
      ["What should pending claimants do now?", "Confirm the claim is on record, keep medical records current, respond quickly to document requests, and have counsel compare any Elective Option offer against realistic litigated values before deciding."],
      ["Does this page provide legal advice?", "No. This page is general legal information for research purposes only and does not create an attorney-client relationship."]
    ]
  },
  {
    lawsuit: "Talcum Powder",
    slug: "talcum-powder",
    title: (s) => `Talcum Powder Lawsuit in ${s.name} (Ovarian Cancer & Mesothelioma)`,
    category: "Product Liability",
    categorySlug: "product-liability",
    status: "Active / Investigating",
    primaryInjury: "Ovarian cancer and mesothelioma",
    description: (s) =>
      `Information for ${s.name} residents researching Johnson & Johnson talcum powder lawsuits: ovarian cancer and mesothelioma allegations, MDL-2738 status, eligibility factors, records, and ${s.name} filing deadlines.`,
    exposureContext: (s) =>
      `${s.name} residents may have used talc-based powders such as Johnson's Baby Powder or Shower to Shower for personal hygiene over many years before an ovarian cancer or mesothelioma diagnosis.`,
    overview: (s) =>
      `<p>${s.name} residents with talcum powder claims are generally not limited to ${s.name} state court. Most federal ovarian-cancer cases are coordinated in the multidistrict litigation, <strong>MDL-2738</strong>, before Judge Michael A. Shipp in the U.S. District Court for the District of New Jersey, which held about 68,029 pending actions as of June 1, 2026 — the largest active MDL by pending actions.</p>
<p>${s.name} law still matters: the state's filing deadline, discovery rule, damages rules, and procedural law can shape an individual claim even when the case is litigated in the MDL or in state court.</p>`,
    eligibilityBullets: (s) => [
      `Use of a talc-based powder (brand, approximate years, and frequency) by ${s.name} residents or their families.`,
      "A diagnosis of ovarian cancer or mesothelioma confirmed by pathology and oncology records.",
      "Diagnosis timing and use history that line up for review.",
      `Filing within the deadline that applies to the claim under ${s.name} law.`
    ],
    process: (s, lim) =>
      `<p>Most ${s.name} federal talc cases are filed in or transferred to MDL-2738 in the District of New Jersey for coordinated proceedings, while many ovarian-cancer and mesothelioma cases are also tried in state courts. Johnson & Johnson's three "Texas Two-Step" bankruptcy attempts were all rejected — most recently on March 31, 2025 — so cases are again proceeding in the trial system. ${s.name}'s personal injury limitations period is ${lim.piYears} years (${lim.citation}), but accrual and discovery-rule questions are fact-specific for cancers diagnosed years after talc use.</p>`,
    faqs: (s, lim) => [
      [`What is the talcum powder lawsuit in ${s.name} about?`, `Lawsuits allege Johnson & Johnson talc-based powders caused ovarian cancer or asbestos-linked mesothelioma and that warnings were inadequate. ${s.name} residents' federal ovarian-cancer cases are generally coordinated in MDL-2738 in the District of New Jersey. Defendants dispute the allegations.`],
      [`Can ${art(s)} ${s.name} resident file a talcum powder lawsuit?`, `Possibly. ${s.name} residents with documented talc use and an ovarian cancer or mesothelioma diagnosis may be able to file in federal court (transferred into MDL-2738) or in state court. Whether a claim qualifies depends on product use, diagnosis, timing, records, and ${s.name} law.`],
      [`What is the talcum powder lawsuit statute of limitations in ${s.name}?`, `${s.name}'s personal injury period is ${lim.piYears} years (${lim.citation}). ${lim.discoveryNote || "Accrual rules vary."} Because cancer is often diagnosed years after use, only a lawyer can confirm the deadline for a specific situation.`],
      [`Which products are involved for ${s.name} claimants?`, "Claims focus on talc-based powders, including Johnson's Baby Powder and Shower to Shower. Johnson & Johnson stopped selling talc-based Baby Powder in North America in 2020 and worldwide in 2023, switching to a cornstarch formula."],
      [`What records matter most for ${art(s)} ${s.name} claim?`, "Product-use history (brand, years, frequency), pathology and biopsy reports, oncology and surgical records, and the diagnosis date are commonly requested first. Purchase records, photos, or witness statements can help show product use."],
      ["Has there been a talcum powder settlement?", "No global settlement exists. Johnson & Johnson's three 'Texas Two-Step' bankruptcy attempts were all rejected, most recently on March 31, 2025. Cases are proceeding in the MDL and state courts, and no amount is guaranteed for any individual claim."],
      ["Is talcum powder still sold?", "Johnson & Johnson stopped selling talc-based Johnson's Baby Powder in North America in 2020 and worldwide in 2023, replacing it with a cornstarch-based product. The litigation concerns past use and alleged injuries."],
      ["Does this page provide legal advice?", "No. This page is general legal information for research purposes only and does not create an attorney-client relationship."]
    ]
  },
  {
    lawsuit: "Social Media Addiction",
    slug: "social-media",
    title: (s) => `Social Media Lawsuit in ${s.name} (Teen Mental-Health Claims)`,
    category: "Product Liability",
    categorySlug: "product-liability",
    status: "Active / Investigating",
    primaryInjury: "Adolescent mental-health harms",
    description: (s) =>
      `Information for ${s.name} families researching the social media addiction lawsuits: MDL-3047 status, teen mental-health allegations against Meta, TikTok, Snap, and YouTube, eligibility, records, and ${s.name} filing deadlines.`,
    exposureContext: (s) =>
      `${s.name} children and teens may have used Instagram, Facebook, TikTok, Snapchat, or YouTube heavily during adolescence before developing mental-health harms now being reviewed in the litigation.`,
    overview: (s) =>
      `<p>${s.name} families with social media injury claims are generally not limited to ${s.name} state court. Most federal cases are transferred into the multidistrict litigation, <strong>MDL-3047</strong>, before Judge Yvonne Gonzalez Rogers in the Northern District of California, which held 2,664 pending cases as of June 1, 2026; a parallel California state-court proceeding (JCCP 5255) handles many individual cases.</p>
<p>${s.name} law still matters: the state's filing deadline — including rules that pause the clock while a claimant is a minor — plus its damages and procedural law can shape an individual claim even when the case is litigated in the MDL.</p>`,
    eligibilityBullets: (s) => [
      `A child or teen in ${s.name} who used Instagram, Facebook, TikTok, Snapchat, or YouTube.`,
      "A documented mental-health harm — such as depression, anxiety, an eating disorder, self-harm, or a suicide attempt — during or after a period of heavy use.",
      "Medical or treatment records connecting the harm to the period of use.",
      `Filing within the deadline that applies under ${s.name} law, accounting for rules that pause deadlines for minors.`
    ],
    process: (s, lim) =>
      `<p>Most ${s.name} social media injury cases are filed in or transferred to MDL-3047 in the Northern District of California, while many individual cases also proceed in the California JCCP (JCCP 5255). Bellwether trials are underway in 2026, and there is no global settlement. ${s.name}'s general personal injury limitations period is ${lim.piYears} years (${lim.citation}), but many states pause that clock while a claimant is a minor — a fact-specific question for ${s.name} claims.</p>`,
    faqs: (s, lim) => [
      [`What is the social media lawsuit in ${s.name} about?`, `Lawsuits allege Meta (Instagram, Facebook), TikTok, Snapchat, and YouTube were designed to be addictive to young users and caused mental-health harms, and that families were not adequately warned. ${s.name} residents' federal cases are generally transferred into MDL-3047; many also proceed in the California JCCP. The companies dispute the allegations.`],
      [`Can ${art(s)} ${s.name} family join the social media MDL?`, `Possibly. Cases filed by ${s.name} residents in federal court are generally transferred into MDL-3047 in the Northern District of California, and some cases proceed instead in the California state-court JCCP. Where a claim is filed depends on strategy and individual facts.`],
      [`What is the statute of limitations for ${art(s)} ${s.name} social media claim?`, `${s.name}'s general personal injury period is ${lim.piYears} years (${lim.citation}). ${lim.discoveryNote || "Accrual rules vary."} Many states also pause the deadline while a claimant is a minor, so only a lawyer can confirm the deadline for a specific situation.`],
      [`Which companies are involved for ${s.name} claimants?`, "The main defendants are Meta (Instagram, Facebook), TikTok/ByteDance, Snap (Snapchat), and Google/YouTube. Which companies are relevant depends on which platforms the young person actually used."],
      [`What records matter most for ${art(s)} ${s.name} claim?`, "Records of which platforms were used and at what ages, plus mental-health diagnosis, therapy, hospitalization, or school records connecting the harm to the period of use, are commonly reviewed first."],
      ["Has there been a social media settlement?", "No global settlement exists as of June 2026. Some defendants have reached confidential settlements in individual bellwether cases, and a California bellwether returned a $6 million verdict against Meta and YouTube in March 2026. No amount is guaranteed for any individual claim."],
      ["Is this page legal or medical advice?", "No. This page is general legal information for research only and is not medical advice. If you or someone you know is in crisis, you can call or text the 988 Suicide & Crisis Lifeline (U.S.)."]
    ]
  },
  {
    lawsuit: "Paragard IUD",
    slug: "paragard",
    title: (s) => `Paragard IUD Lawsuit in ${s.name} (Device Breakage Claims)`,
    category: "Product Liability",
    categorySlug: "product-liability",
    status: "Active / Investigating",
    primaryInjury: "Device breakage on removal and removal surgery",
    description: (s) =>
      `Information for ${s.name} residents researching Paragard IUD lawsuits: MDL-2974 status, allegations the device breaks on removal, eligibility, evidence, and ${s.name} filing deadlines.`,
    exposureContext: (s) =>
      `${s.name} residents may have had a Paragard copper IUD that broke during removal, leaving fragments that required imaging or additional procedures to remove.`,
    overview: (s) =>
      `<p>${s.name} residents with Paragard claims are generally not limited to ${s.name} state court. Most federal cases are transferred into the multidistrict litigation, <strong>MDL-2974</strong>, before Judge Leigh Martin May in the U.S. District Court for the Northern District of Georgia, which held about 4,071 pending cases as of June 1, 2026.</p>
<p>${s.name} law still matters: the state's filing deadline, discovery rule, damages rules, and procedural law can shape an individual claim even when the case is litigated in the MDL.</p>`,
    eligibilityBullets: (s) => [
      `A Paragard copper IUD used by ${s.name} residents that broke or fractured during removal.`,
      "Records identifying the device as Paragard and an operative note describing the breakage.",
      "Documentation of retained fragments, migration, or surgery to remove them.",
      `Filing within the deadline that applies to the claim under ${s.name} law.`
    ],
    process: (s, lim) =>
      `<p>Most ${s.name} Paragard cases are filed in or transferred to MDL-2974 in the Northern District of Georgia for coordinated proceedings. The first bellwether trial ended in a defense verdict for Teva in February 2026, and additional bellwether trials are scheduled in 2026; no global settlement exists. ${s.name}'s personal injury limitations period is ${lim.piYears} years (${lim.citation}), but accrual and discovery-rule questions can be fact-specific when breakage is discovered at the time of removal.</p>`,
    faqs: (s, lim) => [
      [`What is the Paragard lawsuit in ${s.name} about?`, `Lawsuits allege the Paragard copper IUD can break during removal, leaving fragments that may require surgery, and that the makers failed to warn. ${s.name} residents' federal cases are generally transferred into MDL-2974 in the Northern District of Georgia. Teva and CooperSurgical dispute the allegations.`],
      [`Can ${art(s)} ${s.name} resident file a Paragard lawsuit?`, `Possibly. ${s.name} residents whose Paragard IUD broke on removal, with records documenting the breakage and any follow-up procedures, may be able to file in federal court (transferred into MDL-2974). Whether a claim qualifies depends on the device records, injury, timing, and ${s.name} law.`],
      [`What is the statute of limitations for ${art(s)} ${s.name} Paragard claim?`, `${s.name}'s personal injury period is ${lim.piYears} years (${lim.citation}). ${lim.discoveryNote || "Accrual rules vary."} Only a lawyer can confirm the deadline for a specific situation.`],
      [`What records matter most for ${art(s)} ${s.name} claim?`, "Insertion and removal records, anything identifying the device as Paragard, the operative report describing the breakage, imaging locating retained fragments, and records of any surgery to remove them are commonly requested first."],
      ["Has there been a Paragard settlement?", "No. There is no global settlement, and the first bellwether trial ended in a defense verdict for Teva in February 2026. Additional bellwether trials are scheduled in 2026, and no amount is guaranteed for any individual claim."],
      ["Is Paragard still on the market?", "Yes. Paragard remains an FDA-approved copper IUD that is still marketed. The lawsuits concern alleged breakage on removal and warnings, not a market withdrawal. Contraception decisions belong with a healthcare professional."],
      ["Does this page provide legal advice?", "No. This page is general legal information for research purposes only and does not create an attorney-client relationship."]
    ]
  }
];

function yamlEscape(value) {
  return value.replace(/"/g, '\\"');
}

function buildFile(c, s) {
  const lim = limitations[s.slug];
  const faqs = c.faqs(s, lim)
    .map(
      ([q, a]) => `  -\n    question: "${yamlEscape(q)}"\n    answer: "${yamlEscape(a)}"`
    )
    .join("\n");
  const bullets = c.eligibilityBullets(s).map((b) => `<li>${b}</li>`).join("\n");

  return `---
title: "${yamlEscape(c.title(s))}"
description: "${yamlEscape(c.description(s))}"
lawsuit: "${yamlEscape(c.lawsuit)}"
lawsuitSlug: "${c.slug}"
state: "${s.name}"
stateSlug: "${s.slug}"
stateAbbr: "${s.abbr}"
category: "${c.category}"
categorySlug: "${c.categorySlug}"
status: "${yamlEscape(c.status)}"
primaryInjury: "${yamlEscape(c.primaryInjury)}"
exposureContext: "${yamlEscape(c.exposureContext(s))}"
lastUpdated: "${lastUpdated}"
lastReviewed: "${lastUpdated}"
faqs:
${faqs}
---

<section id="state-overview">
<h2>What ${s.name} residents should know</h2>
${c.overview(s)}
</section>

<section id="eligibility">
<h2>Possible eligibility factors</h2>
<ul>
${bullets}
</ul>
</section>

<section id="filing-process">
<h2>How ${s.name} claims proceed</h2>
${c.process(s, lim)}
</section>
`;
}

const outDir = join(root, "src/content/state-guides");
mkdirSync(outDir, { recursive: true });
// Optional CLI filter: `node scripts/add-case-states.mjs <slug>` regenerates only
// that case's state guides, so re-running never clobbers other cases' pages.
const onlySlug = process.argv[2];
const selectedCases = onlySlug ? cases.filter((c) => c.slug === onlySlug) : cases;
if (onlySlug && selectedCases.length === 0) {
  console.error(`No case with slug "${onlySlug}" found in add-case-states.mjs`);
  process.exit(1);
}
let written = 0;
for (const c of selectedCases) {
  for (const s of states) {
    const file = join(outDir, `${c.slug}-${s.slug}.md`);
    writeFileSync(file, buildFile(c, s));
    written += 1;
  }
}
console.log(`Wrote ${written} state guides for ${selectedCases.map((c) => c.slug).join(", ")}`);
