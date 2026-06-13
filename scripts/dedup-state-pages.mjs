#!/usr/bin/env node
/**
 * dedup-state-pages.mjs
 *
 * Replace the generic "state-overview" + "eligibility" boilerplate on per-state
 * lawsuit guides with verified, state-specific content so the pages stop being
 * near-duplicates of each other.
 *
 * Usage:
 *   node scripts/dedup-state-pages.mjs <tortSlug>
 *   node scripts/dedup-state-pages.mjs roundup
 *
 * The script reads the per-tort dedup config from
 *   src/data/state-dedup/{tortSlug}.json
 * which holds a hand-curated, source-verified payload per state (see SHAPE
 * below). It then mutates the matching markdown files in src/content/state-guides/.
 *
 * Idempotent: if a state file already has the inserted section, it is skipped.
 *
 * IMPORTANT — YMYL accuracy checklist (read before editing any dedup config):
 *   1. Every verdict figure must be the FINAL post-appeal amount (not the
 *      intermediate trial-court number).
 *   2. Every claim that names a date, dollar amount, court, judge, statute,
 *      or appellate ruling must have a primary or credible-secondary source
 *      URL listed in `sources`.
 *   3. "No state action" / absence claims must be reworded as an
 *      absence-of-evidence statement tied to the specific records reviewed
 *      (state legislature bill-search + state AG news) and those records
 *      must appear in `sources`.
 *   4. The `sources` list must substantiate the *claims actually made* in the
 *      `body` HTML, not just generic background material.
 *   5. Hearing vs. trial must be stated explicitly; never describe a Daubert
 *      hearing as a trial.
 *
 * SHAPE of src/data/state-dedup/{tortSlug}.json:
 *   {
 *     "_meta": { "tortSlug": "roundup", "tortName": "Roundup Cancer" },
 *     "states": {
 *       "california": {
 *         "stateName": "California",
 *         "article": "a" | "an",    // "an" for Ohio, Illinois, Arkansas, etc.
 *         "h2": "What stands out about Roundup litigation in California?",
 *         "body": "<p>...verified state-specific HTML...</p>",
 *         "sources": [
 *           { "label": "Source name", "url": "https://..." }
 *         ],
 *         "faqs": [
 *           { "question": "...", "answer": "..." },
 *           { "question": "...", "answer": "..." }
 *         ]
 *       }
 *     }
 *   }
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const REVIEW_DATE = "2026-06-13"; // bump per dedup batch
const STATE_GUIDES_DIR = join(ROOT, "src/content/state-guides");

// Marker = the last line of the boilerplate "state-overview" section that is
// identical across every legacy state guide. We anchor the insertion here so
// the unique section appears immediately after the boilerplate intro.
const INSERT_MARKER = [
  "<p>State law may still matter for deadlines, damages, claim evaluation, and certain procedural issues.</p>",
  "</section>"
].join("\n");

const A = `target="_blank" rel="noopener noreferrer"`;

function renderSection({ h2, body, sources }) {
  const sourcesHtml = sources.length === 0
    ? ""
    : `\n<p class="mt-4 text-sm text-muted"><strong>Sources:</strong> ${sources
        .map((s) => `<a href="${s.url}" ${A}>${s.label}</a>`)
        .join("; ")}.</p>`;
  return `<section id="state-${"current".replace("current", "tort")}-context">
<h2>${h2}</h2>
${body.trim()}${sourcesHtml}
</section>`;
}

// We use a stable section id of "state-roundup-context" historically; keep it
// per-tort so multiple dedup runs on the same file don't collide.
function sectionId(tortSlug) {
  return `state-${tortSlug}-context`;
}

function renderSectionWithId({ tortSlug, h2, body, sources }) {
  const sourcesHtml = sources.length === 0
    ? ""
    : `\n<p class="mt-4 text-sm text-muted"><strong>Sources:</strong> ${sources
        .map((s) => `<a href="${s.url}" ${A}>${s.label}</a>`)
        .join("; ")}.</p>`;
  return `<section id="${sectionId(tortSlug)}">
<h2>${h2}</h2>
${body.trim()}${sourcesHtml}
</section>`;
}

function renderFaqYaml(faqs) {
  return faqs
    .map((f) => `  -\n    question: "${escapeYaml(f.question)}"\n    answer: "${escapeYaml(f.answer)}"`)
    .join("\n");
}

function escapeYaml(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function genericFaqBlock({ tortName, stateName, article }) {
  return [
    `  -`,
    `    question: "What is the ${tortName} lawsuit in ${stateName} about?"`,
    `    answer: "This guide explains general information for ${stateName} residents researching ${tortName} claims involving non-Hodgkin lymphoma allegations."`,
    `  -`,
    `    question: "Can ${article} ${stateName} resident join a national lawsuit?"`,
    `    answer: "Possibly. Many mass tort claims are evaluated nationally or coordinated through federal proceedings, but the path depends on individual facts."`
  ].join("\n");
}

function applyOne({ tortSlug, tortName, stateSlug, payload }) {
  const filename = `${tortSlug}-${stateSlug}.md`;
  const filePath = join(STATE_GUIDES_DIR, filename);
  let text;
  try {
    text = readFileSync(filePath, "utf8");
  } catch (e) {
    return { stateSlug, status: "missing-file", filePath };
  }

  if (text.includes(`id="${sectionId(tortSlug)}"`)) {
    return { stateSlug, status: "already-deduped" };
  }

  if (text.split(INSERT_MARKER).length - 1 !== 1) {
    return { stateSlug, status: "marker-not-found-or-ambiguous" };
  }

  // 1) Insert the unique section immediately after the boilerplate intro.
  const newSection = renderSectionWithId({
    tortSlug,
    h2: payload.h2,
    body: payload.body,
    sources: payload.sources || []
  });
  text = text.replace(INSERT_MARKER, `${INSERT_MARKER}\n\n${newSection}`);

  // 2) Replace the two generic FAQs (if present) with state-specific ones.
  const generic = genericFaqBlock({
    tortName,
    stateName: payload.stateName,
    article: payload.article || "a"
  });
  if (text.includes(generic)) {
    text = text.replace(generic, renderFaqYaml(payload.faqs || []));
  } else {
    // The boilerplate FAQ block may have been edited; do not silently mangle
    // the file. Skip FAQ replacement and warn.
    return doneWith(filePath, text, REVIEW_DATE, { stateSlug, status: "section-inserted-faqs-skipped" });
  }

  return doneWith(filePath, text, REVIEW_DATE, { stateSlug, status: "ok" });
}

function doneWith(filePath, text, reviewDate, result) {
  // Bump lastUpdated + lastReviewed to today's dedup date.
  text = text.replace(/lastUpdated: "[^"]*"/, `lastUpdated: "${reviewDate}"`);
  text = text.replace(/lastReviewed: "[^"]*"/, `lastReviewed: "${reviewDate}"`);
  writeFileSync(filePath, text);
  return result;
}

function main() {
  const tortSlug = process.argv[2];
  if (!tortSlug) {
    console.error("Usage: node scripts/dedup-state-pages.mjs <tortSlug>");
    process.exit(2);
  }
  const configPath = join(ROOT, "src/data/state-dedup", `${tortSlug}.json`);
  let config;
  try {
    config = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (e) {
    console.error(`ERROR: cannot read ${configPath}: ${e.message}`);
    process.exit(2);
  }
  const tortName = config._meta?.tortName || tortSlug;
  const states = config.states || {};
  const stateSlugs = Object.keys(states);
  if (stateSlugs.length === 0) {
    console.error("ERROR: config has no states");
    process.exit(2);
  }
  console.log(`Deduping ${stateSlugs.length} ${tortSlug} state pages…`);
  let ok = 0;
  let skipped = 0;
  let bad = 0;
  for (const stateSlug of stateSlugs) {
    const result = applyOne({
      tortSlug,
      tortName,
      stateSlug,
      payload: states[stateSlug]
    });
    if (result.status === "ok") {
      ok += 1;
      console.log(`  [ok]      ${tortSlug}-${stateSlug}.md`);
    } else if (result.status === "already-deduped") {
      skipped += 1;
      console.log(`  [skip]    ${tortSlug}-${stateSlug}.md  (already deduped)`);
    } else if (result.status === "section-inserted-faqs-skipped") {
      ok += 1;
      console.log(`  [partial] ${tortSlug}-${stateSlug}.md  (section inserted; FAQ block changed — left FAQs alone)`);
    } else {
      bad += 1;
      console.log(`  [WARN]    ${tortSlug}-${stateSlug}.md  ${result.status}`);
    }
  }
  console.log(`\nUpdated: ${ok}   Skipped: ${skipped}   Warnings: ${bad}`);
  if (bad > 0) process.exit(1);
}

main();
