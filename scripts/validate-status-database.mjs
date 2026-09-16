import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const errors = [];
const casesDir = path.join(root, "src", "data", "cases");
const caseFiles = (await readdir(casesDir)).filter((name) => name.endsWith(".json"));
const cases = await Promise.all(caseFiles.map(async (name) => JSON.parse(await readFile(path.join(casesDir, name), "utf8"))));

for (const item of cases) {
  if (item.dataAsOf < "2026-09-01") errors.push(`${item.slug}: dataAsOf is older than September 2026`);
  if (!item.statusVerifiedOn) errors.push(`${item.slug}: missing statusVerifiedOn`);
  if (!Array.isArray(item.updates) || item.updates.length < 3) errors.push(`${item.slug}: fewer than three verified monthly updates`);
  const primaries = item.pendingCounts.filter((entry) => entry.primary);
  if (item.litigation.mdlNumber && primaries.length !== 1) errors.push(`${item.slug}: expected one primary MDL count`);
  if (primaries[0] && primaries[0].date !== "2026-09-01") errors.push(`${item.slug}: primary count is not September 1, 2026`);
}

const expectedFiles = [
  "src/components/CaseStatusOverview.astro",
  "src/pages/updates.astro",
  "src/pages/mdl/[mdlNumber].astro",
  "src/lib/tracking.ts",
  "scripts/check-freshness.mjs"
];
for (const relative of expectedFiles) {
  try { await readFile(path.join(root, relative)); } catch { errors.push(`missing ${relative}`); }
}

if (errors.length) {
  console.error("Status database validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Status database validation passed for ${cases.length} case records.`);
