import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const cases = [
  {
    slug: "bair-hugger",
    mdl: "2666",
    focusedPath: "/lawsuits/bair-hugger/infection-records/",
    routeFile: "src/pages/lawsuits/bair-hugger/infection-records/index.astro"
  },
  {
    slug: "cook-ivc-filter",
    mdl: "2570",
    focusedPath: "/lawsuits/cook-ivc-filter/device-records/",
    routeFile: "src/pages/lawsuits/cook-ivc-filter/device-records/index.astro"
  },
  {
    slug: "exactech",
    mdl: "3044",
    focusedPath: "/lawsuits/exactech/recall-records/",
    routeFile: "src/pages/lawsuits/exactech/recall-records/index.astro"
  },
  {
    slug: "nec-baby-formula",
    mdl: "3026",
    focusedPath: "/lawsuits/nec-baby-formula/nicu-feeding-records/",
    routeFile: "src/pages/lawsuits/nec-baby-formula/nicu-feeding-records/index.astro"
  }
];
const supporting = JSON.parse(readFileSync(path.join(root, "src/data/supporting-guides.json"), "utf8"));
const nationalPage = readFileSync(path.join(root, "src/pages/lawsuits/[slug]/index.astro"), "utf8");

for (const item of cases) {
  const dataFile = path.join(root, `src/data/cases/${item.slug}.json`);
  const guideFile = path.join(root, `src/content/lawsuits/${item.slug}.md`);
  assert.ok(existsSync(dataFile), `missing case data: ${item.slug}`);
  assert.ok(existsSync(guideFile), `missing national guide: ${item.slug}`);
  assert.ok(existsSync(path.join(root, item.routeFile)), `missing focused route: ${item.focusedPath}`);

  const data = JSON.parse(readFileSync(dataFile, "utf8"));
  const guide = readFileSync(guideFile, "utf8");
  const focusedRoute = readFileSync(path.join(root, item.routeFile), "utf8");
  assert.equal(data.slug, item.slug, `wrong case slug in ${dataFile}`);
  assert.equal(data.litigation.mdlNumber, `MDL-${item.mdl}`, `wrong MDL number for ${item.slug}`);
  assert.match(guide, new RegExp(`^urlSlug:\\s*["']${item.slug}["']`, "m"));
  assert.ok(guide.includes(item.focusedPath), `national guide does not link to focused guide: ${item.slug}`);
  assert.ok(focusedRoute.includes("<SupportingGuide"), `focused route does not use SupportingGuide: ${item.slug}`);
  assert.ok(supporting.some((entry) => entry.caseSlug === item.slug && entry.path === item.focusedPath), `missing focused metadata: ${item.slug}`);
  assert.ok(nationalPage.includes(`${item.slug}:`) || nationalPage.includes(`"${item.slug}":`), `missing related-guide map: ${item.slug}`);
}

const category = readFileSync(path.join(root, "src/content/categories/product-liability.md"), "utf8");
for (const item of cases) assert.ok(category.includes(`- "${item.slug}"`), `product-liability category missing: ${item.slug}`);

const dist = path.join(root, "dist");
if (existsSync(dist)) {
  const sitemapFiles = ["sitemap.xml", "sitemap-0.xml"].map((name) => path.join(dist, name)).filter(existsSync);
  assert.ok(sitemapFiles.length > 0, "missing built sitemap");
  const sitemap = sitemapFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  for (const item of cases) {
    const pages = [
      [`lawsuits/${item.slug}/index.html`, `/lawsuits/${item.slug}/`],
      [`mdl/${item.mdl}/index.html`, `/mdl/${item.mdl}/`],
      [`${item.focusedPath.replace(/^\//, "")}index.html`, item.focusedPath]
    ];
    for (const [relativeFile, canonicalPath] of pages) {
      const htmlFile = path.join(dist, relativeFile);
      assert.ok(existsSync(htmlFile), `missing built page: ${canonicalPath}`);
      assert.ok(sitemap.includes(canonicalPath), `sitemap missing: ${canonicalPath}`);
      const html = readFileSync(htmlFile, "utf8");
      for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) JSON.parse(match[1]);
    }
    const mdlHtml = readFileSync(path.join(dist, `mdl/${item.mdl}/index.html`), "utf8");
    assert.ok(mdlHtml.includes(`href="${item.focusedPath}"`), `MDL tracker does not link to focused guide: ${item.slug}`);
  }
}

console.log(`Wave One validation passed for ${cases.length} case cluster(s).`);
