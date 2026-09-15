import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const today = new Date("2026-09-15T12:00:00Z");
const warnings = [];
const errors = [];
const files = (await readdir(path.join(root, "src", "data", "cases"))).filter((name) => name.endsWith(".json"));

for (const name of files) {
  const file = path.join(root, "src", "data", "cases", name);
  const data = JSON.parse(await readFile(file, "utf8"));
  const age = Math.floor((today - new Date(`${data.dataAsOf}T12:00:00Z`)) / 86400000);
  if (age > 45) errors.push(`${name}: case record is ${age} days old`);
  if (data.litigation.mdlNumber && !data.pendingCounts.some((entry) => entry.primary && entry.date >= "2026-09-01")) errors.push(`${name}: current MDL count not reviewed in September`);
  for (const entry of data.keyDates ?? []) {
    if (entry.date < "2026-09-15" && entry.status === "scheduled") warnings.push(`${name}: ${entry.date} scheduled event needs outcome review`);
  }
}

const contentDirs = [path.join(root, "src", "content", "lawsuits"), path.join(root, "src", "content", "state-guides")];
for (const dir of contentDirs) {
  for (const name of (await readdir(dir)).filter((item) => item.endsWith(".md"))) {
    const content = await readFile(path.join(dir, name), "utf8");
    const lastUpdated = content.match(/^lastUpdated:\s*["']?([^"'\r\n]+)/m)?.[1]?.trim();
    if (lastUpdated) {
      const age = Math.floor((today - new Date(`${lastUpdated}T12:00:00Z`)) / 86400000);
      if (age > 45) warnings.push(`${name}: visible content update is ${age} days old`);
    }
    if (/\b(?:June|July|August) 2026\b[^\n]{0,100}\b(?:upcoming|scheduled|will occur|will begin|remains scheduled)\b/i.test(content)) warnings.push(`${name}: review older month with future language`);
    if (/\b2025\b[^\n]{0,80}\b(?:current|latest|this year)\b/i.test(content)) warnings.push(`${name}: older year appears near current-status language`);
  }
}

warnings.forEach((warning) => console.warn(`Freshness warning: ${warning}`));
if (errors.length) {
  errors.forEach((error) => console.error(`Freshness error: ${error}`));
  process.exit(1);
}
console.log(`Freshness check passed for ${files.length} case records (${warnings.length} review warning${warnings.length === 1 ? "" : "s"}).`);
