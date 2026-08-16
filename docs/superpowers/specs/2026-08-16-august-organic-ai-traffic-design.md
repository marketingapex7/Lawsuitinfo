# August 2026 Organic and AI Traffic Improvements — Design

## Goal

Increase qualified Google Search and generative-AI visibility for lawsuitstatusguide.com by improving factual freshness, priority-page clarity, tracker usefulness, mobile navigation, internal linking, and analytics measurement without changing existing URLs or weakening the site's YMYL safeguards.

## Evidence and success criteria

The August 1–14, 2026 exports establish the baseline:

- 2,745 Google Search impressions and 17 clicks.
- Week-two impressions increased from 1,291 to 1,454, clicks increased from 5 to 12, CTR increased from 0.39% to 0.83%, and weighted position improved from 50.8 to 42.2.
- Google Search generative-AI impressions increased from 51 to 106 week over week.
- The five priority hubs are Ozempic, Roundup, Paraquat, AFFF/PFAS, and Suboxone.
- The three tracker opportunities are MDL statistics, settlements, and deadlines.
- GA4 reported 30 Organic Search sessions, 11 AI Assistant sessions, 16 Direct sessions, and no configured key events.

The PR is successful when it preserves all current URLs and canonicals, builds cleanly, presents current source-backed data consistently, produces clearer status-first priority pages, prevents stale upcoming dates, emits documented GA4 events, and passes the repository's existing and new validations.

## Scope

This work is delivered on `seo/august-traffic-improvements` as one draft pull request with four reviewable commits:

1. Shared page structure, editorial policy, analytics instrumentation, and validation.
2. Official-source freshness updates across all 13 structured lawsuit records and their dependent prose.
3. Search- and AI-aligned consolidation of the five priority lawsuit hubs.
4. Tracker enhancements and targeted state-page metadata/internal-link improvements.

## Non-goals

- No new lawsuit or state pages.
- No URL, slug, canonical, redirect, sitemap-route, or deployment-host changes.
- No CMS, database, client framework, or new runtime dependency.
- No named attorney, medical reviewer, or individual author until a real person has agreed and their qualifications are verified.
- No settlement calculator, predicted payout, eligibility promise, legal advice, or marketing claim.
- No production merge or deployment by Codex; delivery stops at a verified draft PR.
- No claim about the outcome of the scheduled August 19, 2026 Roundup hearing before an official result exists.

## Architecture and data flow

Structured case facts continue to live in `src/data/cases/*.json`. These records remain the source for litigation panels, tracker rows, Dataset schema, and generated date/count summaries. Lawsuit Markdown in `src/content/lawsuits/*.md` supplies explanatory prose and frontmatter. Shared Astro components render status summaries, navigation, and analytics consistently.

Data flows as follows:

1. Official primary sources establish current facts.
2. A case JSON record preserves historical counts and identifies the newest verified primary count.
3. Repeated prose in the matching lawsuit Markdown is reconciled with the structured record.
4. Shared components and tracker pages render the structured state.
5. Existing validators plus new traffic-improvement validators inspect source data and generated HTML.
6. The PR description records a human-auditable fact/source reconciliation table.

## Shared lawsuit-page changes

### Latest status summary

Add a reusable `LatestStatusSummary.astro` component directly below the lawsuit-page introduction. It consumes the existing case-data type and renders:

- current litigation phase;
- newest official pending count and date;
- settlement posture;
- next verified public court date, when one exists; and
- direct source links.

The existing full `LitigationDataPanel` remains in the page aside. The summary is an answer-first orientation layer, not a second independent data source.

If case data is unavailable, the page continues to render without the summary. Missing sources or malformed volatile data remain build-validation failures under the existing case-data rules.

### Headings and navigation

Render the visible H1 as a clear lawsuit label, adding “Lawsuit” only when the configured display name does not already contain it. Preserve the existing SEO title, frontmatter display name, URL, and canonical.

Retain the current desktop sticky TOC. Add an accessible mobile `details/summary` TOC using the same item list. Generate the list through a helper that removes duplicate IDs and duplicate labels while preserving the intended order.

Eliminate duplicate settlement/deadline entries caused by tort-specific insertions overlapping generic generated sections. Do not remove distinct, useful content solely because two sections cover adjacent intent.

### Editorial methodology

Expand `src/pages/editorial-policy.astro` to document:

- primary-source hierarchy;
- volatile-fact and monthly-count review rules;
- panel/prose reconciliation;
- neutral allegation/defense framing;
- correction handling;
- the distinction between “last updated” and “last reviewed”;
- prohibition on advancing dates without substantive review; and
- the present organization-level authorship model.

The page must not imply attorney or medical review.

## Analytics design

Keep the existing GA4 property and base configuration. Add a small, dependency-free analytics helper that no-ops when `gtag` is unavailable.

Emit these events:

- `contact_click` for mailto and other explicit contact actions;
- `official_source_click` for outbound primary-source links from litigation panels, status summaries, source logs, and trackers;
- `qualified_read` once per page when the visitor has remained for at least 60 seconds and reached at least 50% document depth.

Event parameters are limited to non-sensitive page and link metadata such as page path, destination host, component location, case slug, and link label. No query text, medical information, form content, or personal data is collected.

The PR checklist will explain that GA4 dashboard configuration is required to mark chosen events as key events. Repository code cannot perform that dashboard action.

## Structured-data freshness workflow

Refresh all 13 case records from the newest available official sources as of the research date.

For each case:

1. Use the newest official JPML pending-MDL report for the federal pending count when applicable.
2. Verify court, judge, active defendants, phase, settlements, and public dates through court pages, orders, DOJ/FDA materials, or official settlement administrators.
3. Add the new pending-count record and mark it primary; retain prior records as history.
4. Update `dataAsOf` only to the date supported by the reviewed sources.
5. Reconcile repeated numbers, dates, and posture statements in the lawsuit Markdown.
6. Update `lastUpdated` only when substantive content changes.
7. Update `lastReviewed` only after the required content-quality review.
8. Leave any unverified fact and its date unchanged and disclose the limitation in the PR.

Secondary articles may identify a lead but cannot substantiate a volatile legal fact.

## Priority-hub content changes

For Ozempic, Roundup, Paraquat, AFFF/PFAS, and Suboxone:

- Preserve verified useful copy.
- Lead `#latest-update` with the most important current development and exact source date.
- Consolidate overlapping update/status and settlement sections.
- Provide concise direct answers for demonstrated query groups: current status, settlement posture, eligibility factors, evidence/records, deadlines, and class-action-versus-MDL distinctions where relevant.
- Keep neutral defendant-dispute language.
- Strengthen contextual links to the MDL, settlement, and deadline trackers.
- Avoid creating companion pages for low-volume query variants.

For Roundup, describe the August 19 hearing only as scheduled until an official outcome exists. Create a follow-up GitHub issue for post-hearing verification.

## Tracker changes

### MDL statistics

Keep the statically generated table. Add a “What changed this month” section computed from each MDL's current and immediately prior pending-count records. Explain increases, decreases, and unchanged counts without implying merits or outcomes.

### Settlements

Add a concise current-month summary generated from verified settlement-status records. Preserve conservative language distinguishing public-water, class, administrative, individual, and no-announced-program postures.

### Deadlines

Replace the hard-coded `2026-06-19` comparison date with a build-time UTC date. A validation must fail if an item rendered under “Upcoming Public Dates” predates that date. State limitation warnings remain general information, not deadline calculations.

## Targeted state-page changes

Do not broadly rewrite state content. Add optional SEO title and meta-description overrides to the state-guide schema and template if the existing frontmatter does not already support them.

Apply overrides only to pages supported by the August 2026 Search Console evidence, including Depo-Provera Pennsylvania, Paraquat Pennsylvania, Ozempic California, Roundup Pennsylvania, and other equally supported top-ten/zero-click pages confirmed during implementation.

Each override must identify the page's actual state-specific value without promising eligibility or using unsupported deadline claims. Add contextual internal links only where the destination directly answers the user's likely intent.

## Validation and error handling

The complete verification gate is:

- `npm ci`
- `git diff --check`
- `npm run build`
- existing content, DataForSEO, priority-page, and internal-link validators;
- new validation for one H1, unique generated section IDs, unique TOC entries, status-summary source links, allowed analytics event names, and no past upcoming dates;
- generated-HTML checks for all 13 hubs and the three trackers;
- schema, canonical, sitemap, RSS, `llms.txt`, and robots checks;
- desktop and mobile visual checks for the five priority hubs, three trackers, and targeted state pages.

Analytics failures caused by blocked scripts are silent and never block page functionality. Missing or contradictory legal sources block the related content update rather than falling back to an unsupported claim.

## Delivery and rollback

The draft PR will contain four coherent commits matching the scope order. Each commit must build independently or clearly state if it depends on a prior commit in the same branch.

The PR description will include:

- export-derived rationale;
- files and page groups changed;
- a fact/source reconciliation table;
- verification commands and results;
- GA4 dashboard steps;
- the post–August 19 Roundup follow-up issue; and
- known limitations.

No merge or production deployment is included. Commit separation provides rollback points for shared templates, structured data, priority content, and targeted state/tracker changes.
