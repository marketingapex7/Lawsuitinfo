import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const checks = [
  {
    file: ["dist", "lawsuits", "suboxone", "index.html"],
    required: [
      "Updated July 28, 2026",
    ],
    forbidden: ['id="settlement"', 'href="#settlement"'],
    exactOccurrences: [
      { text: "What is the buprenorphine tooth decay lawsuit?", count: 1 },
      { text: 'id="suboxone-settlement-status"', count: 1 },
      { text: 'href="#suboxone-settlement-status"', count: 1 },
    ],
  },
  {
    file: ["dist", "categories", "defective-drugs", "index.html"],
    required: ["Suboxone tooth-decay lawsuit guide"],
  },
  {
    file: ["dist", "categories", "toxic-exposure", "index.html"],
    required: ["AFFF MDL 2873 update", "Roundup deadlines and settlement status"],
  },
  {
    file: ["dist", "mdl-statistics", "index.html"],
    required: ["AFFF MDL 2873 update", "Suboxone dental-injury MDL 3092"],
  },
  {
    file: ["dist", "deadlines", "index.html"],
    required: ["Roundup filing-deadline guide"],
  },
];

const failures = [];

for (const check of checks) {
  const filePath = path.join(process.cwd(), ...check.file);
  let content;

  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    failures.push(`${check.file.join("/")}: could not read output (${error.message})`);
    continue;
  }

  for (const expected of check.required ?? []) {
    if (!content.includes(expected)) {
      failures.push(`${check.file.join("/")}: missing ${JSON.stringify(expected)}`);
    }
  }

  for (const unexpected of check.forbidden ?? []) {
    if (content.includes(unexpected)) {
      failures.push(`${check.file.join("/")}: still contains ${JSON.stringify(unexpected)}`);
    }
  }

  for (const expected of check.exactOccurrences ?? []) {
    const actual = content.split(expected.text).length - 1;
    if (actual !== expected.count) {
      failures.push(
        `${check.file.join("/")}: expected ${JSON.stringify(expected.text)} ${expected.count} time(s), found ${actual}`,
      );
    }
  }
}

if (failures.length) {
  console.error("Priority-page validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Priority-page validation passed across ${checks.length} pages.`);
