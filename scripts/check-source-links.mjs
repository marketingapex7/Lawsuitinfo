import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const directory = path.join(root, "src", "data", "cases");
const urls = new Set();
for (const name of (await readdir(directory)).filter((file) => file.endsWith(".json"))) {
  const data = JSON.parse(await readFile(path.join(directory, name), "utf8"));
  for (const source of data.sources ?? []) urls.add(source.url);
  for (const entry of data.pendingCounts ?? []) if (entry.sourceUrl) urls.add(entry.sourceUrl);
  for (const entry of data.settlements ?? []) if (entry.sourceUrl) urls.add(entry.sourceUrl);
  for (const entry of data.keyDates ?? []) if (entry.sourceUrl) urls.add(entry.sourceUrl);
  for (const entry of data.updates ?? []) if (entry.sourceUrl) urls.add(entry.sourceUrl);
}

let broken = 0;
let blocked = 0;
for (const url of urls) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(12000), headers: { "user-agent": "LawsuitStatusGuide source verifier" } });
    if (response.status === 404 || response.status === 410) { console.error(`Broken source (${response.status}): ${url}`); broken++; }
    else if (!response.ok) blocked++;
  } catch { blocked++; }
}
console.log(`Checked ${urls.size} unique source URLs: ${broken} broken, ${blocked} blocked or inconclusive.`);
if (broken) process.exit(1);
