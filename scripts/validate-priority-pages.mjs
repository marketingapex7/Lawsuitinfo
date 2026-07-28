import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const checks = [
  {
    file: ["dist", "lawsuits", "ozempic", "index.html"],
    required: [
      "What is the Ozempic and GLP-1 lawsuit?",
      'href="/settlements/"',
      'href="/deadlines/"',
      'href="/mdl-statistics/"',
    ],
  },
  {
    file: ["dist", "lawsuits", "depo-provera", "index.html"],
    required: ["What is the Depo-Provera lawsuit?"],
  },
  {
    file: ["dist", "lawsuits", "camp-lejeune", "index.html"],
    required: ["What is the Camp Lejeune lawsuit?"],
  },
  {
    file: ["dist", "lawsuits", "afff-pfas", "index.html"],
    required: ["What is the AFFF firefighting foam lawsuit?"],
  },
  {
    file: ["dist", "lawsuits", "roundup", "index.html"],
    required: ["What is the Roundup lawsuit?"],
  },
  {
    file: ["dist", "lawsuits", "talcum-powder", "index.html"],
    required: ["What is the talcum powder lawsuit?"],
  },
  {
    file: ["dist", "lawsuits", "suboxone", "index.html"],
    required: [
      "Updated July 28, 2026",
      "What is the Suboxone tooth decay lawsuit?",
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
    required: [
      "AFFF MDL 2873 update",
      "Suboxone dental-injury MDL 3092",
      'href="/lawsuits/afff-pfas/#latest-update"',
    ],
  },
  {
    file: ["dist", "deadlines", "index.html"],
    required: [
      "Roundup filing-deadline guide",
      'href="/lawsuits/afff-pfas/#afff-deadlines"',
      'href="/lawsuits/roundup/#roundup-deadline-questions"',
    ],
  },
  {
    file: ["dist", "settlements", "index.html"],
    required: [
      'href="/lawsuits/afff-pfas/#afff-settlement-status"',
      'href="/lawsuits/camp-lejeune/#camp-lejeune-elective-option"',
      'href="/lawsuits/suboxone/#suboxone-settlement-status"',
    ],
  },
  {
    file: ["dist", "lawsuits", "afff-pfas", "colorado", "index.html"],
    required: [
      "current national AFFF Firefighting Foam lawsuit update",
      'href="/lawsuits/afff-pfas/#latest-update"',
    ],
  },
];

const failures = [];
const outputCache = new Map();

async function readOutput(filePath) {
  if (!outputCache.has(filePath)) {
    outputCache.set(filePath, await readFile(filePath, "utf8"));
  }
  return outputCache.get(filePath);
}

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listHtmlFiles(entryPath) : entryPath.endsWith(".html") ? [entryPath] : [];
  }));
  return nested.flat();
}

for (const check of checks) {
  const filePath = path.join(process.cwd(), ...check.file);
  let content;

  try {
    content = await readOutput(filePath);
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

const htmlFiles = await listHtmlFiles(path.join(process.cwd(), "dist"));
for (const sourcePath of htmlFiles) {
  const source = await readOutput(sourcePath);
  const links = source.matchAll(/href="\/lawsuits\/([^/"?#]+)\/#([^"]+)"/g);

  for (const [, slug, fragment] of links) {
    const targetPath = path.join(process.cwd(), "dist", "lawsuits", slug, "index.html");
    let target;

    try {
      target = await readOutput(targetPath);
    } catch (error) {
      failures.push(`${path.relative(process.cwd(), sourcePath)}: could not read fragment target ${slug} (${error.message})`);
      continue;
    }

    const idCount = target.split(`id="${fragment}"`).length - 1;
    if (idCount !== 1) {
      failures.push(
        `${path.relative(process.cwd(), sourcePath)}: /lawsuits/${slug}/#${fragment} resolves to ${idCount} matching ids`,
      );
    }
  }

  const samePageLinks = source.matchAll(/href="#([^"]+)"/g);
  for (const [, fragment] of samePageLinks) {
    const idCount = source.split(`id="${fragment}"`).length - 1;
    if (idCount !== 1) {
      failures.push(
        `${path.relative(process.cwd(), sourcePath)}: #${fragment} resolves to ${idCount} matching ids`,
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
