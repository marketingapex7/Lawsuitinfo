import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const failures = [];
const sourceClassificationPath = pathToFileURL(path.join(root, "src", "lib", "sourceClassification.ts")).href;
const { isOfficialSourceUrl } = await import(sourceClassificationPath);

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function directories(relativePath) {
  const entries = await readdir(path.join(root, relativePath), { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

function count(content, pattern) {
  return [...content.matchAll(pattern)].length;
}

function sectionHtml(content, heading) {
  const start = content.indexOf(heading);
  if (start < 0) return "";
  const nextSection = content.indexOf("<section", start + heading.length);
  return content.slice(start, nextSection < 0 ? content.length : nextSection);
}

const expectedLawsuitSlugs = [
  "afff-pfas", "bard-powerport", "camp-lejeune", "depo-provera", "hair-relaxer",
  "hernia-mesh", "ozempic", "paragard", "paraquat", "roundup", "social-media",
  "suboxone", "talcum-powder",
];
const lawsuitSlugs = await directories(path.join("dist", "lawsuits"));
const renderedHubs = [...lawsuitSlugs].sort();
if (JSON.stringify(renderedHubs) !== JSON.stringify([...expectedLawsuitSlugs].sort())) {
  failures.push(`expected exactly 13 lawsuit hubs; found ${renderedHubs.join(", ")}`);
}
const caseDataDirectory = path.join("src", "data", "cases");
const caseDataFiles = (await readdir(path.join(root, caseDataDirectory))).filter((file) => file.endsWith(".json"));
const caseDataBySlug = new Map();
for (const file of caseDataFiles) {
  const caseData = JSON.parse(await read(path.join(caseDataDirectory, file)));
  caseDataBySlug.set(caseData.slug, caseData);
}
for (const slug of expectedLawsuitSlugs) {
  const caseData = caseDataBySlug.get(slug);
  if (!caseData) {
    failures.push(`${slug}: missing structured case data`);
    continue;
  }
  for (const settlement of caseData.settlements ?? []) {
    if (settlement.sourceUrl && !isOfficialSourceUrl(settlement.sourceUrl)) {
      failures.push(`${slug}: settlement data must cite an official source (${settlement.sourceUrl ?? "missing sourceUrl"})`);
    }
  }
}

for (const slug of expectedLawsuitSlugs) {
  const relativePath = path.join("dist", "lawsuits", slug, "index.html");
  let html;
  try {
    html = await read(relativePath);
  } catch (error) {
    failures.push(`${relativePath}: missing or unreadable hub output (${error.message})`);
    continue;
  }

  const h1Count = count(html, /<h1(?:\s[^>]*)?>/g);
  if (h1Count !== 1) failures.push(`${relativePath}: expected one h1, found ${h1Count}`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) failures.push(`${relativePath}: duplicate ids: ${duplicateIds.join(", ")}`);

  const tocNavs = [...html.matchAll(/<nav[^>]*data-page-toc[^>]*>[\s\S]*?<\/nav>/g)];
  if (!tocNavs.length) failures.push(`${relativePath}: missing marked page TOC`);
  for (const tocNav of tocNavs) {
    const tocLinks = [...tocNav[0].matchAll(/href="#([^"]+)"/g)].map((link) => link[1]);
    const duplicateTocLinks = [...new Set(tocLinks.filter((id, index) => tocLinks.indexOf(id) !== index))];
    if (duplicateTocLinks.length) {
      failures.push(`${relativePath}: duplicate TOC targets: ${duplicateTocLinks.join(", ")}`);
    }

    const tocLabels = [...tocNav[0].matchAll(/href="#[^"]+">([^<]+)<\/a>/g)].map((link) => link[1].trim());
    const duplicateTocLabels = [...new Set(tocLabels.filter((label, index) => tocLabels.indexOf(label) !== index))];
    if (duplicateTocLabels.length) {
      failures.push(`${relativePath}: duplicate TOC labels: ${duplicateTocLabels.join(", ")}`);
    }
  }

  const statusMatch = html.match(/<section[^>]*data-latest-status[^>]*>[\s\S]*?<\/section>/);
  if (!statusMatch) {
    failures.push(`${relativePath}: missing latest-status summary`);
  } else if (!/data-official-source/.test(statusMatch[0])) {
    failures.push(`${relativePath}: latest-status summary has no official-source link`);
  }

  for (const anchor of html.matchAll(/<a[^>]*data-official-source[^>]*>/g)) {
    const href = anchor[0].match(/href="([^"]+)"/)?.[1];
    if (!isOfficialSourceUrl(href)) {
      failures.push(`${relativePath}: secondary or invalid URL marked official (${href ?? "missing href"})`);
    }
  }

  for (const component of ["litigation_data", "source_update_log"]) {
    const componentMatch = html.match(new RegExp(`<[^>]+data-component-location="${component}"[\\s\\S]*?(?:<\/aside>|<\/section>)`));
    if (!componentMatch || !componentMatch[0].includes("data-official-source")) {
      failures.push(`${relativePath}: ${component} has no instrumented official-source link`);
    }
  }
}

try {
  const analyticsPath = pathToFileURL(path.join(root, "src", "lib", "analytics.ts")).href;
  const { trackEvent } = await import(analyticsPath);
  if (!isOfficialSourceUrl("https://www.jpml.uscourts.gov/pending-mdls-0")) failures.push("official-source classifier rejected JPML");
  if (!isOfficialSourceUrl("https://www.weedkillerclass.com/")) failures.push("official-source classifier rejected official settlement administrator");
  if (isOfficialSourceUrl("https://www.law.com/example")) failures.push("official-source classifier accepted a secondary publisher");
  const calls = [];
  const originalWindow = globalThis.window;
  globalThis.window = { gtag: (...args) => calls.push(args) };

  trackEvent("contact_click", {
    page_path: "/contact/",
    link_label: undefined,
    email: "must-not-pass@example.com",
    arbitrary: "must-not-pass",
  });
  trackEvent("not_allowed", { page_path: "/ignored/" });

  if (calls.length !== 1) failures.push(`analytics helper: expected one allowed gtag call, found ${calls.length}`);
  const [command, eventName, params] = calls[0] ?? [];
  if (command !== "event" || eventName !== "contact_click") {
    failures.push("analytics helper: allowed event did not use the gtag event contract");
  }
  if (JSON.stringify(params) !== JSON.stringify({ page_path: "/contact/" })) {
    failures.push(`analytics helper: unsafe or undefined parameters escaped filtering (${JSON.stringify(params)})`);
  }

  delete globalThis.window;
  trackEvent("qualified_read", { page_path: "/safe-noop/" });
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
} catch (error) {
  failures.push(`src/lib/analytics.ts: analytics behavior unavailable (${error.message})`);
}

for (const [file, marker] of [
  [path.join("dist", "mdl-statistics", "index.html"), "data-monthly-change-summary"],
  [path.join("dist", "settlements", "index.html"), "data-monthly-change-summary"],
]) {
  const html = await read(file);
  if (!html.includes(marker)) failures.push(`${file}: missing monthly change summary`);
}

const deadlinesHtml = await read(path.join("dist", "deadlines", "index.html"));
const upcoming = sectionHtml(deadlinesHtml, "Upcoming Public Dates");
const today = new Date().toISOString().slice(0, 10);
for (const [, date] of upcoming.matchAll(/(?:datetime="|text-muted">)(\d{4}-\d{2}-\d{2})/g)) {
  if (date < today) failures.push(`dist/deadlines/index.html: past date ${date} appears as upcoming`);
}

if (failures.length) {
  console.error("Traffic-improvement validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Traffic-improvement validation passed across ${expectedLawsuitSlugs.length} lawsuit hubs.`);
