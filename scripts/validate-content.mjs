import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const errors = [];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value) {
  if (!datePattern.test(value ?? "")) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function report(file, message) {
  errors.push(`${path.relative(root, file)}: ${message}`);
}

async function validateCaseData() {
  const directory = path.join(root, "src", "data", "cases");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json"));
  const slugs = new Set();

  for (const name of files) {
    const file = path.join(directory, name);
    const data = JSON.parse(await readFile(file, "utf8"));

    if (!data.slug || slugs.has(data.slug)) report(file, `missing or duplicate slug "${data.slug ?? ""}"`);
    slugs.add(data.slug);

    if (!isValidDate(data.dataAsOf)) report(file, `invalid dataAsOf date "${data.dataAsOf ?? ""}"`);

    const pendingDates = (data.pendingCounts ?? []).map((entry) => entry.date);
    for (const date of pendingDates) {
      if (!isValidDate(date)) report(file, `invalid pending-count date "${date}"`);
    }
    const newestPendingDate = [...pendingDates].sort().at(-1);
    if (newestPendingDate && data.dataAsOf < newestPendingDate) {
      report(file, `dataAsOf ${data.dataAsOf} predates pending-count source ${newestPendingDate}`);
    }

    const primaryCounts = (data.pendingCounts ?? []).filter((entry) => entry.primary);
    if (primaryCounts.length > 1) report(file, "more than one pending count is marked primary");
    for (const entry of primaryCounts) {
      if (!entry.sourceUrl) report(file, `primary pending count dated ${entry.date} has no sourceUrl`);
    }

    const keyDates = data.keyDates ?? [];
    const sortedDates = keyDates.map((entry) => entry.date).sort();
    if (keyDates.map((entry) => entry.date).join("|") !== sortedDates.join("|")) {
      report(file, "keyDates are not in chronological order");
    }
    for (const entry of keyDates) {
      if (!isValidDate(entry.date)) report(file, `invalid key date "${entry.date}"`);
      const text = `${entry.label ?? ""} ${entry.detail ?? ""}`;
      if (
        entry.date < data.dataAsOf &&
        /\b(?:upcoming|imminent|is scheduled for|remains scheduled|will (?:take place|occur|begin))\b/i.test(text)
      ) {
        report(file, `past key date ${entry.date} still uses future-facing language: "${entry.label}"`);
      }
    }

    if (!(data.sources ?? []).length) report(file, "has no case-level sources");
    for (const source of data.sources ?? []) {
      if (!/^https:\/\//.test(source.url ?? "")) report(file, `source must use HTTPS: "${source.url ?? ""}"`);
    }
  }
}

async function validateContentDates() {
  const directories = [
    path.join(root, "src", "content", "lawsuits"),
    path.join(root, "src", "content", "state-guides")
  ];
  const today = new Date().toISOString().slice(0, 10);

  for (const directory of directories) {
    const files = (await readdir(directory)).filter((file) => file.endsWith(".md"));
    for (const name of files) {
      const file = path.join(directory, name);
      const content = await readFile(file, "utf8");
      for (const field of ["lastUpdated", "lastReviewed"]) {
        const value = content.match(new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)`, "m"))?.[1]?.trim();
        if (!isValidDate(value)) report(file, `${field} is missing or invalid`);
        else if (value > today) report(file, `${field} ${value} is in the future`);
      }
    }
  }
}

async function validateNationalGuideFreshness() {
  const caseDirectory = path.join(root, "src", "data", "cases");
  const guideDirectory = path.join(root, "src", "content", "lawsuits");
  const files = (await readdir(caseDirectory)).filter((file) => file.endsWith(".json"));

  for (const name of files) {
    const file = path.join(caseDirectory, name);
    const data = JSON.parse(await readFile(file, "utf8"));
    const candidates = (await readdir(guideDirectory)).filter((guide) => guide.endsWith(".md"));
    let matched = false;

    for (const guideName of candidates) {
      const guideFile = path.join(guideDirectory, guideName);
      const content = await readFile(guideFile, "utf8");
      const urlSlug = content.match(/^urlSlug:\s*["']?([^"'\r\n]+)/m)?.[1]?.trim();
      const inferredSlug = guideName.replace(/\.md$/, "");
      if ((urlSlug ?? inferredSlug) !== data.slug) continue;

      matched = true;
      const lastUpdated = content.match(/^lastUpdated:\s*["']?([^"'\r\n]+)/m)?.[1]?.trim();
      if (lastUpdated < data.dataAsOf) {
        report(guideFile, `lastUpdated ${lastUpdated} predates case data ${data.dataAsOf}`);
      }
      break;
    }

    if (!matched) report(file, `no national lawsuit guide found for slug "${data.slug}"`);
  }
}

await validateCaseData();
await validateContentDates();
await validateNationalGuideFreshness();

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Content validation passed.");
