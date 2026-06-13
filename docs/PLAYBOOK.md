# Lawsuit Status Guide — Build Playbook

How to add, expand, and maintain mass tort content on this site without breaking the rules that keep it ranking and out of trouble. **Read the YMYL accuracy rules first** — they apply to every change in this document.

---

## YMYL accuracy rules (non-negotiable)

This is legal content covered by Google's "Your Money or Your Life" treatment. Every change must satisfy all of these:

1. **Primary sources for every figure.** Pending case counts come from the JPML monthly statistics PDF; court orders come from the court's own MDL page (`{court}.uscourts.gov`); settlement amounts come from court-approved settlement administration sites, the DOJ, or final-approval orders. Industry blogs are leads, not sources.
2. **Final post-appeal verdict numbers only.** When citing a verdict, use the amount that stood after appeal — never the intermediate trial-court figure. (Example: Johnson v. Monsanto = ~$20.5M after the 2020 California Court of Appeal reduction, not the $289M jury award and not the $78.5M trial-court remittitur.)
3. **Hearing vs. trial — say which.** A Rule 702 / Daubert hearing is never a trial. State this explicitly when both are scheduled.
4. **Date-qualify absence claims and tie them to records reviewed.** Never say "no state action has been identified" without naming what you checked (e.g., "a review of the [State] Legislature's bill-tracking system and the [State] AG news archive as of mid-2026 did not surface…"). The Sources line must include those record URLs.
5. **The Sources line substantiates the claims above it.** A generic `Sources: JPML; USDA` line does not substantiate "Bayer settled in 2026." Each non-obvious claim needs a source that actually backs it.
6. **Panel and prose must agree.** If the LitigationDataPanel headline says 3,909 pending cases, the body prose cannot say "approximately 3,500." If you bump `lastUpdated`, the body must reflect the change.
7. **Dismissed defendants come off the defendants list.** When a court dismisses a defendant, edit the case JSON's `defendants` array. Keep the dismissal as a note in `phaseDetail` if it's relevant to readers.
8. **Defendants dispute the claims.** Neutral framing throughout: "lawsuits allege X; defendants dispute the allegations." Never "the product caused" — "the product is alleged to have caused."
9. **No legal advice; no marketing.** Never "you may be entitled to," never settlement calculators or guaranteed payout ranges.

A PR that breaks any of these will get blocked by review.

---

## What's already automated

| You change… | These re-render automatically |
|---|---|
| `src/data/cases/{slug}.json` | The `LitigationDataPanel` on `/lawsuits/{slug}/` (MDL number, court, judge, pending counts, settlements, key dates, primary sources) |
| `src/content/lawsuits/{slug}.md` | The full case hub page (`/lawsuits/{slug}/`), TOC, FAQ schema, sitemap entry, llms.txt entry, RSS feed |
| `src/content/state-guides/{slug}-{state}.md` | The case×state page (`/lawsuits/{slug}/{state}/`), sitemap, llms.txt, parent state hub, parent case hub's state-link section |
| `src/content/categories/{slug}.md` | The category page (`/categories/{slug}/`) |
| `src/data/states/limitations.json` | The `StateLimitationsCard` on every state guide, plus the SOL block on every per-state hub |

Sitemap `lastmod`, `/llms.txt`, `/feed.xml`, `Dataset` schema on state hubs, `Speakable` schema, and breadcrumbs are all derived from the content collections. No manual updates needed when adding content.

---

## How to add a new tort (case)

The end state: a new `/lawsuits/{slug}/` hub + 10 `/lawsuits/{slug}/{state}/` pages, all rendering the litigation data panel, all in sitemap, llms.txt, feed, and category pages.

### 1. Verify the facts (research stage)

Gather and write down — with primary source URLs — at least:

- **MDL number, official name, transferee court, current presiding judge, date established** (JPML transfer order date).
- **Current pending action count** (JPML's most recent monthly statistics PDF — extract the count directly from the PDF table; do not use aggregators).
- **Defendants** (active only — confirm dismissed defendants and remove them).
- **Phase** in one line + 2–3 sentence detail. Be specific about whether the next event is a hearing or a trial.
- **Settlement status** with source. If "none," state that explicitly.
- **3–5 key dates** — past milestones + upcoming court events. Each must have a primary source.
- The court's MDL orders page URL, the relevant scheduling-order PDF, and any high-impact appellate decisions.

### 2. Create the case data record

`src/data/cases/{slug}.json`. Schema in `src/lib/caseData.ts` (Zod-validated at build time). Match the existing examples (`roundup.json`, `camp-lejeune.json`, `ozempic.json` are good templates):

```jsonc
{
  "slug": "tort-slug",
  "caseName": "Display name (used in panel header)",
  "litigation": {
    "type": "Federal MDL",
    "mdlNumber": "MDL-XXXX",
    "mdlName": "Official JPML name",
    "court": "U.S. District Court, ...",
    "courtShort": "X.D. XX",
    "judge": "Judge Name",
    "established": "YYYY-MM-DD"
  },
  "phase": "One-line phase",
  "phaseDetail": "2–3 sentences. Hearing vs. trial called out explicitly.",
  "pendingCounts": [
    {
      "date": "2026-06-01",
      "count": 1234,
      "scope": "Pending actions in MDL-XXXX",
      "source": "JPML MDL Statistics Report, June 1, 2026",
      "sourceUrl": "https://www.jpml.uscourts.gov/sites/jpml/files/...",
      "primary": true
    }
  ],
  "defendants": ["Defendant A", "Defendant B"],
  "settlements": [
    {
      "label": "Plain-language label",
      "status": "active | pending approval | none | final approved",
      "detail": "What was paid/agreed, when, by whom — with figures.",
      "source": "Display name of source",
      "sourceUrl": "https://..."
    }
  ],
  "keyDates": [
    { "date": "YYYY-MM-DD", "label": "Event", "detail": "..." }
  ],
  "deadlineOverride": "Optional. Use ONLY when state SOLs don't control (e.g., Camp Lejeune CLJA window closed Aug 10 2024). Override appears on every state page and suppresses the state SOL block.",
  "sources": [
    { "name": "JPML — pending MDL dockets", "url": "https://www.jpml.uscourts.gov/pending-mdls-0" },
    { "name": "Court MDL orders page", "url": "https://..." }
  ],
  "dataAsOf": "2026-MM-DD"
}
```

Notes:
- `primary: true` on a pendingCount marks the headline number. If two counts share the same date and none is `primary`, the panel falls back to the first-by-array-order. Always flag the headline.
- `pendingCounts` can include multiple records (e.g., federal MDL + parallel state cases). Label `scope` clearly so they don't look interchangeable.
- `sourceUrl` is required for any volatile figure (dollar amounts, case counts).

### 3. Write the case hub content

`src/content/lawsuits/{slug}.md`. Frontmatter schema in `src/content.config.ts`. Copy a clean recent example like `ozempic.md` for the shape — the field list is enforced.

Required body sections (IDs are referenced by the TOC in `src/pages/lawsuits/[slug]/index.astro`):
- `#overview` — what the lawsuit alleges (neutral framing)
- `#latest-update` — date-stamped current developments, lead with the single most important event
- `#status` — one-paragraph current phase
- `#eligibility` — who may be affected
- `#sources-status-notes` — closing note + primary source links

Other IDs (`#injuries`, `#evidence`, `#timeline`, `#settlement`, `#deadlines`, `#states`) are rendered automatically from frontmatter arrays; you don't need to author them in the body.

If you want extra TOC entries for tort-specific topics (e.g., `#ozempic-bellwether-trials`), add the section in the body AND splice it into the TOC in `src/pages/lawsuits/[slug]/index.astro` (search for the existing `if (slug === "ozempic") { … }` blocks).

### 4. Generate the 10 state guides

Add a config block for the new case to `scripts/add-case-states.mjs`, following the existing entries (`ozempic`, `camp-lejeune`). Each entry supplies:
- `title(s)` — the per-state title
- `description(s)` — per-state meta description
- `exposureContext(s)` — state-specific exposure language
- `overview(s)` — what state residents should know
- `eligibilityBullets(s)` — list of factors a lawyer reviews
- `process(s, lim)` — how state cases proceed (referencing the federal MDL where relevant)
- `faqs(s, lim)` — 6–8 FAQs

Then run from the repo root:

```sh
node scripts/add-case-states.mjs
```

It writes all 10 `src/content/state-guides/{slug}-{state}.md` files. Re-running is safe (the generator overwrites; commit before rerunning if you've hand-edited).

### 5. Add the case to a category

Edit `src/content/categories/{category-slug}.md`:
- Add the new case slug to `lawsuitSlugs`.
- Bump `lastUpdated`.

### 6. Build + verify

```sh
npm install        # if you haven't already
npx astro build
```

Build must be green. Then grep `dist/lawsuits/{slug}/index.html` for the headline number and the panel:

```sh
grep -o 'Litigation Data' dist/lawsuits/{slug}/index.html        # → 1
grep -o '"@type":"Article"' dist/lawsuits/{slug}/index.html      # → present
```

Spot-check one state page (`dist/lawsuits/{slug}/california/index.html`) for the LitigationDataPanel + StateLimitationsCard.

### 7. Open the PR

PR title: `Add {tort}: case database record + hub + 10 state guides`. PR body: list the verified sources, the JPML PDF date used, and the JPML-confirmed headline count. **Include the verification trail** — that's the YMYL signal the reviewer (and Google) needs.

---

## How to add state coverage to an existing case

If you're expanding beyond the 10 launch states (`src/lib/site.ts` → `states` array), you also need to:

1. Add the new state to the `states` array in `src/lib/site.ts` (name, slug, abbr, federal courts).
2. Add the new state to `src/data/states/limitations.json` (years + statutory citation + discoveryNote + reposeNote).
3. Add the same state entry to `scripts/add-case-states.mjs`'s top-level `states` array.
4. Run `node scripts/add-case-states.mjs` to generate state guides for every existing case in that state.
5. The per-state hub at `/states/{state}/` is fully programmatic and will appear automatically once any state-guides exist for that slug.

---

## How to de-duplicate the per-state pages for an existing tort

The legacy per-state guides for the 5 originally-launched torts shared near-identical bodies (the audit flagged this as doorway-page risk). The dedup pattern, proven on Roundup in PR #7:

1. **Build a per-tort dedup config** at `src/data/state-dedup/{tortSlug}.json` using the shape documented in `scripts/dedup-state-pages.mjs`. Every claim in the `body` HTML must be backed by an entry in `sources`. Read the YMYL accuracy rules at the top of this document before writing the config.
2. **Run** `node scripts/dedup-state-pages.mjs {tortSlug}`. The script is idempotent.
3. Build + spot-check: each `dist/lawsuits/{tortSlug}/{state}/index.html` should now have a `<section id="state-{tortSlug}-context">` with state-specific content + a Sources line.
4. Ship the PR with the verification trail. Expect a strict review on every cited claim.

When researching state facts for the dedup config:
- It is fine — and expected — for many states to have no notable in-state verdict for a given tort. Frame those honestly (agricultural/exposure context + venue context + cited absence-of-evidence record search). Do not fabricate verdicts.
- The reviewer will check whether the Sources line actually substantiates the specific claims. Don't pad with JPML + USDA when the claim is about a state bill.

---

## How to update existing case data (the freshness loop)

Until the auto-update pipeline lands, this is a manual monthly task:

1. **Download the new JPML PDF** (e.g., `Pending_MDL_Dockets_By_Actions_Pending-YYYY-MM-DD.pdf` from `jpml.uscourts.gov`).
2. **Extract the per-MDL counts** for the cases on the site (run `pdftotext -layout` on the PDF, grep by MDL number).
3. **Update each case's `pendingCounts` array** in `src/data/cases/{slug}.json` — add a new entry with the new date + count, mark it `primary: true`, and mark the prior `primary: true` entry as a non-primary historical record (so the panel still shows the latest count but the page retains comparison history).
4. **Bump `dataAsOf` to today's date** in each case JSON.
5. **Reconcile the prose.** If a "Latest update" paragraph cites the old count, edit it. If a key-date has passed (e.g., a Daubert hearing happened), move it to the past and add the next event. Panel/prose contradictions are a P1.
6. **Bump `lastUpdated`** on the case markdown if you edited prose. Leave `lastReviewed` alone unless you also did a content-quality review.

---

## How to update the site stack (the boring stuff)

- **AI-crawler allowlist:** `src/pages/robots.txt.ts` → `aiCrawlers` array.
- **Sitemap behavior:** `src/pages/sitemap.xml.ts`. Hub pages inherit the newest content date; policy pages intentionally omit lastmod (no honest change date).
- **llms.txt structure:** `src/pages/llms.txt.ts`.
- **RSS feed:** `src/pages/feed.xml.ts`.
- **Site-wide schema (Dataset, Speakable, Article, FAQPage):** `src/lib/seo.ts` + `src/layouts/BaseLayout.astro`. Page-specific extras go through the `extraSchemas` prop.
- **Title length cap:** `composeTitle()` in `src/lib/seo.ts` — appends the brand only if total stays ≤62 chars.
- **Meta description cap:** `META_MAX = 155` in `src/lib/seo.ts`. Don't raise it without a rebuild check across all pages.

---

## Production reality check (what only the owner can do)

Some things live in dashboards, not the repo:

- **www → apex redirect** is a Cloudflare dashboard task (proxied DNS CNAME for `www` + a Redirect Rule using the "Redirect from WWW to Root" template). The `public/_redirects` file cannot do this — Cloudflare Pages doesn't support hostname sources in `_redirects` (that's Netlify syntax).
- **DataForSEO credit top-ups** happen in the DataForSEO dashboard; the API key lives in the Hyperagent skill credential config, not in the repo.
- **Google Search Console sitemap submission** after major content changes.

---

## When in doubt

- Look at the most recent similar PR before doing the same kind of change. The Roundup state-dedup pattern (PR #7) is the canonical example for state-page content depth; the Ozempic/Camp Lejeune pair (PR #2) is the canonical example for adding a new tort.
- The Working Memory document for this project (Thread Context Doc) holds the running list of corrections from review and the carry-forward rules. When in doubt, read it.
- Build green is the floor, not the ceiling. The reviewer reads the rendered HTML and asks whether each specific claim is substantiated by the Sources line. So should you.
