import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const checks = {
  "ozempic.md": [
    "Who may qualify for the Ozempic lawsuit?",
    "What evidence can support an Ozempic lawsuit review?",
    "paed.uscourts.gov",
  ],
  "paraquat.md": [
    "Are Paraquat lawsuit settlement amounts public?",
    "Master Settlement Agreement",
    "ilsd.uscourts.gov",
  ],
  "camp-lejeune.md": [
    "How are Camp Lejeune settlements paid?",
    "July 17, 2026",
    "justice.gov/civil/camp-lejeune-justice-act-claims",
  ],
  "roundup.md": [
    "Roundup Cancer Lawsuit Update: July 2026",
    "What proof do you need for a Roundup lawsuit?",
    "supremecourt.gov",
  ],
};

const failures = [];
const contentDir = path.join(process.cwd(), "src", "content", "lawsuits");

for (const [fileName, required] of Object.entries(checks)) {
  const filePath = path.join(contentDir, fileName);
  let content;

  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    failures.push(`${fileName}: could not read source (${error.message})`);
    continue;
  }

  for (const expected of required) {
    if (!content.includes(expected)) {
      failures.push(`${fileName}: missing ${JSON.stringify(expected)}`);
    }
  }
}

if (failures.length) {
  console.error("DataForSEO lawsuit refresh validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`DataForSEO lawsuit refresh validation passed across ${Object.keys(checks).length} hubs.`);
