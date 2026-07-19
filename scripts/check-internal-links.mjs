import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDirectory = path.join(root, "dist");
const broken = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }
  return files;
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function pageUrl(file) {
  const relative = path.relative(outputDirectory, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return "https://internal.test/";
  if (relative.endsWith("/index.html")) return `https://internal.test/${relative.slice(0, -10)}`;
  return `https://internal.test/${relative}`;
}

function targetCandidates(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }
  const relative = decoded.replace(/^\/+/, "");
  if (!relative) return [path.join(outputDirectory, "index.html")];
  if (path.extname(relative)) return [path.join(outputDirectory, relative)];
  return [
    path.join(outputDirectory, relative, "index.html"),
    path.join(outputDirectory, `${relative}.html`)
  ];
}

const htmlFiles = (await walk(outputDirectory)).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const hrefs = [...html.matchAll(/\shref=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let url;
    try {
      url = new URL(href.replaceAll("&amp;", "&"), pageUrl(file));
    } catch {
      broken.push(`${path.relative(root, file)} -> invalid URL ${href}`);
      continue;
    }
    if (url.origin !== "https://internal.test") continue;
    const candidates = targetCandidates(url.pathname);
    let found = false;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        found = true;
        break;
      }
    }
    if (!found) broken.push(`${path.relative(root, file)} -> ${href}`);
  }
}

if (broken.length) {
  console.error(`Internal-link validation failed with ${broken.length} broken link(s):`);
  for (const item of broken) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Internal-link validation passed across ${htmlFiles.length} HTML pages.`);
