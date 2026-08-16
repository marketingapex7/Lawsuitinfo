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
      "Ozempic Lawsuit Update: August 2026",
      "Has there been an Ozempic settlement?",
      "Who may qualify for an Ozempic lawsuit?",
      "What evidence can support an Ozempic lawsuit review?",
      "What is the Ozempic lawsuit statute of limitations?",
    ],
    forbidden: ['id="evidence"', 'id="deadlines"', 'id="eligibility"'],
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
    required: [
      "What is the AFFF firefighting foam lawsuit?",
      "AFFF Firefighting Foam Lawsuit Update: August 2026",
      "Who may qualify for an AFFF lawsuit?",
      "AFFF lawsuit settlement status",
      "PFAS and AFFF records commonly reviewed",
      "AFFF lawsuit deadline considerations",
      'href="/settlements/"',
      'href="/deadlines/"',
      'href="/mdl-statistics/"',
    ],
    forbidden: ['id="evidence"', 'id="settlement"', 'id="deadlines"', 'id="eligibility"'],
  },
  {
    file: ["dist", "lawsuits", "roundup", "index.html"],
    required: [
      "What is the Roundup lawsuit?",
      "Roundup Cancer Lawsuit Update: August 2026",
      "Who may qualify for a Roundup lawsuit?",
      "What proof do you need for a Roundup lawsuit?",
      "When will Roundup settlements be paid?",
      "What is the deadline to file a Roundup lawsuit?",
      'href="/settlements/"',
      'href="/deadlines/"',
      'href="/mdl-statistics/"',
    ],
    forbidden: ['id="evidence"', 'id="settlement"', 'id="deadlines"'],
  },
  {
    file: ["dist", "lawsuits", "paraquat", "index.html"],
    required: [
      "Paraquat Parkinson's Lawsuit Update: August 2026",
      "Paraquat lawsuit qualifications",
      "Are Paraquat lawsuit settlement amounts public?",
      "What Paraquat exposure records may matter?",
      "Paraquat lawsuit deadline considerations",
      'href="/settlements/"',
      'href="/deadlines/"',
      'href="/mdl-statistics/"',
    ],
    forbidden: ['id="settlement"', 'id="deadlines"', 'id="eligibility"'],
  },
  {
    file: ["dist", "lawsuits", "talcum-powder", "index.html"],
    required: ["What is the talcum powder lawsuit?"],
  },
  {
    file: ["dist", "lawsuits", "suboxone", "index.html"],
    required: [
      "Updated August 16, 2026",
      "What is the Suboxone tooth decay lawsuit?",
      "Suboxone tooth decay lawsuit eligibility",
      "Suboxone lawsuit settlement status",
      "Dental records usually reviewed",
      "Suboxone lawsuit deadline considerations",
      'href="/settlements/"',
      'href="/deadlines/"',
      'href="/mdl-statistics/"',
    ],
    forbidden: ['id="evidence"', 'id="settlement"', 'id="deadlines"', 'id="eligibility"', 'href="#settlement"'],
    exactOccurrences: [
      { text: "What is the buprenorphine tooth decay lawsuit?", count: 1 },
      { text: 'id="suboxone-settlement-status"', count: 1 },
      { text: 'href="#suboxone-settlement-status"', count: 2 },
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

const stateMetadataChecks = [
  {
    file: ["dist", "lawsuits", "depo-provera", "pennsylvania", "index.html"],
    title: "Pennsylvania Depo-Provera Lawsuit: MDL & Deadlines",
    description: "Pennsylvania Depo-Provera lawsuit guide covering MDL 3140 status, meningioma records, state-court context, and filing-deadline factors.",
  },
  {
    file: ["dist", "lawsuits", "depo-provera", "north-carolina", "index.html"],
    title: "North Carolina Depo-Provera Lawsuit: MDL & Deadlines",
    description: "North Carolina Depo-Provera lawsuit guide covering MDL 3140 status, meningioma records, and state deadline and product-repose issues.",
  },
  {
    file: ["dist", "lawsuits", "depo-provera", "delaware", "index.html"],
    title: "Delaware Depo-Provera Lawsuit: State Cases & MDL",
    description: "Delaware Depo-Provera lawsuit guide covering coordinated state cases, MDL 3140 status, meningioma records, and filing-deadline factors.",
  },
  {
    file: ["dist", "lawsuits", "ozempic", "california", "index.html"],
    title: "California Ozempic Lawsuit: GLP-1 Claims & Deadlines",
    description: "California Ozempic lawsuit guide covering GLP-1 injury allegations, MDL 3094 status, medical records, and state filing-deadline factors.",
    required: ["3,928 pending actions as of August 3, 2026"],
    forbidden: ["3,763 pending cases as of June 1, 2026"],
  },
  {
    file: ["dist", "lawsuits", "paraquat", "pennsylvania", "index.html"],
    title: "Pennsylvania Paraquat Lawsuit: Exposure & Deadlines",
    description: "Pennsylvania Paraquat lawsuit guide covering Parkinson's allegations, MDL 3004 status, exposure records, and state filing-deadline factors.",
  },
  {
    file: ["dist", "lawsuits", "roundup", "pennsylvania", "index.html"],
    title: "Pennsylvania Roundup Lawsuit: Verdicts & Deadlines",
    description: "Pennsylvania Roundup lawsuit guide covering lymphoma allegations, notable state verdicts, MDL 2741 status, records, and deadline factors.",
  },
  {
    file: ["dist", "lawsuits", "roundup", "missouri", "index.html"],
    title: "Missouri Roundup Lawsuit: Settlement & Deadlines",
    description: "Missouri Roundup lawsuit guide covering the proposed class settlement, MDL 2741 status, lymphoma records, and state deadline factors.",
  },
  {
    file: ["dist", "lawsuits", "social-media", "texas", "index.html"],
    title: "Texas Social Media Lawsuit: Teen Claims & Deadlines",
    description: "Texas social media lawsuit guide covering teen mental-health allegations, MDL 3047 status, platform-use records, and deadline factors.",
    required: ["3,137 pending actions as of August 3, 2026"],
    forbidden: ["2,664 pending cases as of June 1, 2026", "2,664 cases were pending as of June 1, 2026"],
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

function decodeHtml(value) {
  return value
    ?.replaceAll("&amp;", "&")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"');
}

for (const check of stateMetadataChecks) {
  const filePath = path.join(process.cwd(), ...check.file);
  let html;
  try {
    html = await readOutput(filePath);
  } catch (error) {
    failures.push(`${check.file.join("/")}: could not read output (${error.message})`);
    continue;
  }

  const title = decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1]);
  const description = decodeHtml(html.match(/<meta name="description" content="([^"]+)"/i)?.[1]);
  if (title !== check.title) failures.push(`${check.file.join("/")}: expected title ${JSON.stringify(check.title)}, found ${JSON.stringify(title)}`);
  if (description !== check.description) failures.push(`${check.file.join("/")}: expected description ${JSON.stringify(check.description)}, found ${JSON.stringify(description)}`);
  if ((title?.length ?? 0) > 62) failures.push(`${check.file.join("/")}: title exceeds 62 characters`);
  if ((description?.length ?? 0) > 155) failures.push(`${check.file.join("/")}: description exceeds 155 characters`);
  for (const expected of check.required ?? []) {
    if (!html.includes(expected)) failures.push(`${check.file.join("/")}: missing current state fact ${JSON.stringify(expected)}`);
  }
  for (const stale of check.forbidden ?? []) {
    if (html.includes(stale)) failures.push(`${check.file.join("/")}: contains stale state fact ${JSON.stringify(stale)}`);
  }
  for (const href of ['/settlements/', '/deadlines/', '/mdl-statistics/']) {
    if (!html.includes(`href="${href}"`)) failures.push(`${check.file.join("/")}: missing tracker link ${href}`);
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
