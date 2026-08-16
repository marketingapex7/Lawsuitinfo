# August 2026 Organic and AI Traffic Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve qualified organic and Google generative-AI traffic by refreshing all structured case data, clarifying priority hubs and trackers, improving mobile navigation, and adding privacy-safe analytics events.

**Architecture:** Keep `src/data/cases/*.json` as the single source for volatile litigation facts and derive status summaries and tracker changes from it. Extend the existing Astro content/template system with small static components and build-time validators; preserve every URL and avoid new dependencies.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS 4, Markdown content collections, Node validation scripts, GA4 `gtag`.

## Global Constraints

- Preserve all existing URLs, slugs, canonicals, and redirects.
- Use primary official sources for every volatile legal figure or event.
- Do not imply attorney or medical review.
- Do not advance `lastUpdated`, `lastReviewed`, or `dataAsOf` without the review defined in the design.
- Do not describe the scheduled August 19, 2026 Roundup hearing as completed before an official result exists.
- Add no runtime dependency, CMS, database, or client framework.
- Stop at a verified draft pull request; do not merge or deploy.

---

### Task 1: Add the traffic-improvement validation harness

**Files:**
- Create: `scripts/validate-traffic-improvements.mjs`
- Modify: `package.json`
- Test: generated `dist/` HTML plus source files

**Interfaces:**
- Consumes: Astro build output in `dist/`, `src/pages/deadlines.astro`, and `src/lib/analytics.ts`.
- Produces: `npm run validate:traffic`, a standalone validation command that is wired into `npm run build` only after the required features exist in Task 7.

- [ ] **Step 1: Write failing validation checks**

Create checks that require one H1 on every lawsuit hub, unique IDs, unique TOC entries, a rendered latest-status summary with source links on every case-backed hub, an allowlist of analytics events (`contact_click`, `official_source_click`, `qualified_read`), and no past item in the built deadline tracker's “Upcoming Public Dates” section.

- [ ] **Step 2: Run the validator and confirm failure**

Run: `node scripts/validate-traffic-improvements.mjs`

Expected: FAIL because the status summary and analytics helper do not exist and the deadline page still uses a hard-coded date.

- [ ] **Step 3: Add the standalone validator script**

Add `"validate:traffic": "node scripts/validate-traffic-improvements.mjs"`. Do not add it to the main build chain until Task 7, so intermediate feature commits retain a usable build.

- [ ] **Step 4: Preserve the red test for subsequent tasks**

Run: `npm run validate:traffic`

Expected: the same intentional failures, proving the gate is active.

- [ ] **Step 5: Commit**

Run: `git add package.json scripts/validate-traffic-improvements.mjs && git commit -m "test: add organic traffic validation gate"`

### Task 2: Implement the shared status-first lawsuit layout

**Files:**
- Create: `src/components/LatestStatusSummary.astro`
- Modify: `src/components/TableOfContents.astro`
- Modify: `src/pages/lawsuits/[slug]/index.astro`
- Modify: `src/lib/caseData.ts`
- Test: `scripts/validate-traffic-improvements.mjs`

**Interfaces:**
- Consumes: `CaseData`, `latestPendingCount(caseData)`, settlement records, and key dates.
- Produces: `<LatestStatusSummary data={caseData} caseSlug={slug} />` and one deduplicated TOC list shared by desktop and mobile renderings.

- [ ] **Step 1: Confirm the Task 1 layout checks fail**

Run: `npm run validate:traffic`

Expected: FAIL for missing latest-status summaries and duplicate TOC entries.

- [ ] **Step 2: Implement `LatestStatusSummary.astro`**

Render phase, latest primary pending count/date, first settlement posture, next non-past key date, and direct source links. Render nothing when `data` is absent.

- [ ] **Step 3: Deduplicate the TOC model**

Build the final list through a helper that removes repeated IDs and repeated labels while preserving first occurrence. Render the existing desktop nav and an accessible mobile `<details>` nav from that list.

- [ ] **Step 4: Clarify the visible H1**

Append ` Lawsuit` at render time only when the configured display name does not already contain the word `lawsuit`.

- [ ] **Step 5: Place the status summary directly below the introduction**

Keep `LitigationDataPanel` in the aside; the new component is a concise orientation layer.

- [ ] **Step 6: Run focused and full tests**

Run: `npm run validate:traffic`

Expected: layout/TOC/H1 checks PASS; analytics and deadline checks may remain red.

Run: `npm run build`

Expected: PASS because the standalone traffic gate is not yet wired into the build.

- [ ] **Step 7: Commit**

Run: `git add src/components/LatestStatusSummary.astro src/components/TableOfContents.astro src/pages/lawsuits/[slug]/index.astro src/lib/caseData.ts && git commit -m "feat: add status-first lawsuit layout"`

### Task 3: Add analytics events and strengthen editorial methodology

**Files:**
- Create: `src/lib/analytics.ts`
- Create: `src/components/AnalyticsEvents.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/editorial-policy.astro`
- Test: `scripts/validate-traffic-improvements.mjs`

**Interfaces:**
- Consumes: the existing site-wide `gtag` initialization.
- Produces: safe `trackEvent(name, params)` behavior and delegated events named `contact_click`, `official_source_click`, and `qualified_read`.

- [ ] **Step 1: Confirm analytics validation fails**

Run: `npm run validate:traffic`

Expected: FAIL because the analytics helper and allowed events are missing.

- [ ] **Step 2: Implement the no-op-safe analytics helper**

Allow only the three designed event names. Drop undefined parameters and call `window.gtag` only when it is available.

- [ ] **Step 3: Implement delegated interaction tracking**

Track contact links, official-source outbound links identified by component/data attributes, and one `qualified_read` after both 60 seconds and 50% document depth. Send page path, destination host, component location, case slug, and link label only.

- [ ] **Step 4: Mount analytics after the existing GA initialization**

Ensure pages remain functional when GA or JavaScript is blocked.

- [ ] **Step 5: Expand the editorial policy**

Document primary-source hierarchy, volatile-fact review, panel/prose reconciliation, neutral framing, correction handling, date semantics, and organization-level authorship. Explicitly avoid claiming named professional review.

- [ ] **Step 6: Run tests and build**

Run: `npm run build`

Expected: PASS.

Run: `npm run validate:traffic`

Expected: analytics checks PASS; deadline and tracker checks remain intentionally red for Task 6.

- [ ] **Step 7: Commit**

Run: `git add src/lib/analytics.ts src/components/AnalyticsEvents.astro src/layouts/BaseLayout.astro src/pages/editorial-policy.astro && git commit -m "feat: add engagement analytics and editorial methodology"`

### Task 4: Refresh all 13 structured case records from official sources

**Files:**
- Modify: `src/data/cases/afff-firefighting-foam.json`
- Modify: `src/data/cases/bard-powerport.json`
- Modify: `src/data/cases/camp-lejeune.json`
- Modify: `src/data/cases/depo-provera.json`
- Modify: `src/data/cases/hair-relaxer.json`
- Modify: `src/data/cases/hernia-mesh.json`
- Modify: `src/data/cases/ozempic.json`
- Modify: `src/data/cases/paragard.json`
- Modify: `src/data/cases/paraquat.json`
- Modify: `src/data/cases/roundup.json`
- Modify: `src/data/cases/social-media.json`
- Modify: `src/data/cases/suboxone.json`
- Modify: `src/data/cases/talcum-powder.json`
- Modify as required by reconciliation: `src/content/lawsuits/afff-firefighting-foam.md`
- Modify as required by reconciliation: `src/content/lawsuits/bard-powerport.md`
- Modify as required by reconciliation: `src/content/lawsuits/camp-lejeune.md`
- Modify as required by reconciliation: `src/content/lawsuits/depo-provera.md`
- Modify as required by reconciliation: `src/content/lawsuits/hair-relaxer.md`
- Modify as required by reconciliation: `src/content/lawsuits/hernia-mesh.md`
- Modify as required by reconciliation: `src/content/lawsuits/ozempic.md`
- Modify as required by reconciliation: `src/content/lawsuits/paragard.md`
- Modify as required by reconciliation: `src/content/lawsuits/paraquat.md`
- Modify as required by reconciliation: `src/content/lawsuits/roundup.md`
- Modify as required by reconciliation: `src/content/lawsuits/social-media.md`
- Modify as required by reconciliation: `src/content/lawsuits/suboxone.md`
- Modify as required by reconciliation: `src/content/lawsuits/talcum-powder.md`
- Test: `scripts/validate-content.mjs`, `scripts/validate-priority-pages.mjs`

**Interfaces:**
- Consumes: the newest official JPML report and official court/agency/settlement sources.
- Produces: internally consistent historical/current records with one primary count, supported `dataAsOf`, sources, dates, and reconciled prose.

- [ ] **Step 1: Record the current structured baseline**

Run a Node script or `rg` to list every case slug, primary count/date, `dataAsOf`, phase, and future key date.

- [ ] **Step 2: Research the newest official sources**

Use the newest JPML pending-actions report plus official court orders/pages, DOJ/FDA sources, and official settlement administrators. Secondary sources may locate records but may not support volatile facts.

- [ ] **Step 3: Update one case at a time**

For each case, add the newest count as primary, demote prior primary counts, reconcile judge/defendants/phase/settlements/key dates, and update `dataAsOf` only to a supported date.

- [ ] **Step 4: Reconcile matching Markdown**

Search each hub for old counts, completed future dates, and contradictory phase language. Change `lastUpdated` and `lastReviewed` only under the design rules.

- [ ] **Step 5: Validate after each small batch**

Run: `npm run validate:content && npm run validate:priority-pages`

Expected: PASS with one primary count and no panel/prose contradictions.

- [ ] **Step 6: Commit the complete structured refresh**

Run: `git add src/data/cases src/content/lawsuits && git commit -m "content: refresh August lawsuit data from primary sources"`

### Task 5: Consolidate the five priority hubs around demonstrated intent

**Files:**
- Modify: `src/content/lawsuits/ozempic.md`
- Modify: `src/content/lawsuits/roundup.md`
- Modify: `src/content/lawsuits/paraquat.md`
- Modify: `src/content/lawsuits/afff-firefighting-foam.md`
- Modify: `src/content/lawsuits/suboxone.md`
- Modify: `src/pages/lawsuits/[slug]/index.astro` only if the final TOC model needs slug-specific cleanup
- Test: `scripts/validate-priority-pages.mjs`, `scripts/validate-traffic-improvements.mjs`

**Interfaces:**
- Consumes: refreshed Task 4 case records and the approved query groups.
- Produces: concise, non-duplicative sections for status, settlements, eligibility, evidence, deadlines, and MDL/class-action distinctions.

- [ ] **Step 1: Extend focused priority-page assertions**

Require each priority hub to contain a dated latest update, settlement answer, eligibility/evidence answer, deadline answer, and contextual links to relevant trackers without duplicate section IDs.

- [ ] **Step 2: Run assertions and confirm targeted failures**

Run: `npm run validate:priority-pages && npm run validate:traffic`

Expected: FAIL only where a priority hub lacks the approved concise structure.

- [ ] **Step 3: Consolidate one hub at a time**

Preserve supported useful copy, remove true duplication, lead with the newest material event, keep defendant-dispute language, and do not create companion pages.

- [ ] **Step 4: Keep Roundup prospective**

Describe the August 19 hearing as scheduled unless an official outcome is available at implementation time and verified from the official settlement/court source.

- [ ] **Step 5: Run tests and spot-check built HTML**

Run: `npm run build`

Expected: all five priority URLs build with unique IDs, one H1, a latest-status summary, and intended internal links.

- [ ] **Step 6: Commit**

Run: `git add src/content/lawsuits src/pages/lawsuits/[slug]/index.astro scripts/validate-priority-pages.mjs && git commit -m "content: sharpen priority lawsuit search intent"`

### Task 6: Upgrade trackers and eliminate stale upcoming dates

**Files:**
- Modify: `src/pages/mdl-statistics.astro`
- Modify: `src/pages/settlements.astro`
- Modify: `src/pages/deadlines.astro`
- Modify: `src/lib/caseData.ts`
- Test: `scripts/validate-traffic-improvements.mjs`

**Interfaces:**
- Consumes: current and immediately prior pending counts, settlement records, key dates, and build-time UTC date.
- Produces: monthly change summaries and a deadline page that cannot classify past dates as upcoming.

- [ ] **Step 1: Confirm deadline and tracker checks fail**

Run: `npm run validate:traffic`

Expected: FAIL for hard-coded date or missing tracker monthly summaries.

- [ ] **Step 2: Add MDL monthly changes**

Compute count and percentage changes from current versus previous records and label increases/decreases without interpreting legal merits.

- [ ] **Step 3: Add settlement monthly summary**

Summarize verified status categories and material current-month changes without implying payment or eligibility.

- [ ] **Step 4: Replace the deadline hard-coded date**

Use `new Date().toISOString().slice(0, 10)` at build time and filter key dates against it.

- [ ] **Step 5: Run validation and build**

Run: `npm run validate:traffic && npm run build`

Expected: PASS, including no past item under “Upcoming Public Dates.”

- [ ] **Step 6: Commit**

Run: `git add src/pages/mdl-statistics.astro src/pages/settlements.astro src/pages/deadlines.astro src/lib/caseData.ts && git commit -m "feat: add current tracker change summaries"`

### Task 7: Add targeted state snippet overrides and internal links

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/pages/lawsuits/[lawsuitSlug]/[stateSlug]/index.astro`
- Modify: `src/content/state-guides/depo-provera-pennsylvania.md`
- Modify: `src/content/state-guides/depo-provera-north-carolina.md`
- Modify: `src/content/state-guides/depo-provera-delaware.md`
- Modify: `src/content/state-guides/ozempic-california.md`
- Modify: `src/content/state-guides/paraquat-pennsylvania.md`
- Modify: `src/content/state-guides/roundup-pennsylvania.md`
- Modify: `src/content/state-guides/roundup-missouri.md`
- Modify: `src/content/state-guides/social-media-texas.md`
- Modify: `src/lib/seo.ts`
- Modify: `package.json`
- Test: `scripts/validate-priority-pages.mjs`

**Interfaces:**
- Consumes: optional `seoTitle` and `seoDescription` state-guide frontmatter.
- Produces: targeted metadata for evidence-backed top-ten/zero-click state pages; all other state pages retain generated defaults.

- [ ] **Step 1: Add failing metadata assertions for supported state pages**

Require overrides only for the final evidence-backed set and enforce the existing title/meta length caps.

- [ ] **Step 2: Run assertions and confirm failure**

Run: `npm run validate:priority-pages`

Expected: FAIL because the schema/template does not yet consume targeted overrides.

- [ ] **Step 3: Add optional schema fields and template consumption**

Use `guide.data.seoTitle ?? stateGuideSeoTitle(...)` and `guide.data.seoDescription ?? stateGuideMetaDescription(...)` without affecting URLs or canonical logic.

- [ ] **Step 4: Add carefully supported overrides and links**

Apply only to state pages demonstrated by the August export. Avoid unsupported exact deadline claims and promotional language.

- [ ] **Step 5: Run build and inspect generated snippets**

Run: `npm run build`

Expected: targeted pages contain the overrides; non-targeted state pages preserve current defaults.

- [ ] **Step 6: Wire the completed traffic validator into the build**

Run `npm run validate:traffic` after `astro build` and before the final link check. Confirm the full build now enforces every traffic-improvement invariant.

- [ ] **Step 7: Commit**

Run: `git add src/content.config.ts src/pages/lawsuits/[lawsuitSlug]/[stateSlug]/index.astro src/content/state-guides src/lib/seo.ts scripts/validate-priority-pages.mjs && git commit -m "seo: improve proven state page snippets"`

### Task 8: Final verification, documentation, and draft PR

**Files:**
- Modify: `docs/superpowers/plans/2026-08-16-august-organic-ai-traffic.md` only to check completed steps
- Create through GitHub: post-hearing Roundup follow-up issue
- Create through GitHub: draft pull request

**Interfaces:**
- Consumes: all prior commits and official-source reconciliation notes.
- Produces: a verified draft PR with rollback-friendly commits, source table, dashboard checklist, and follow-up issue.

- [ ] **Step 1: Run the complete clean verification gate**

Run: `npm ci`

Run: `git diff --check`

Run: `npm run build`

Expected: all commands exit 0; all source, content, traffic, priority-page, and link validators pass.

- [ ] **Step 2: Inspect generated artifacts**

Check all 13 hub pages, three trackers, targeted state pages, sitemap, RSS, `llms.txt`, robots, canonicals, Article/Dataset/FAQ schema, status-summary sources, and upcoming dates.

- [ ] **Step 3: Perform desktop and mobile visual checks**

Run the local preview and inspect the five priority hubs, three trackers, editorial policy, and targeted state pages at representative desktop and mobile widths. Fix clipping, inaccessible navigation, duplicated copy, or broken tables before proceeding.

- [ ] **Step 4: Create the Roundup follow-up issue**

Issue title: `Verify and publish the August 19 Roundup hearing outcome`.

The issue body must require the official court/settlement source, data/prose reconciliation, date updates, validation, and no outcome claim before verification.

- [ ] **Step 5: Push the branch and open a draft PR**

PR title: `Improve August organic and AI traffic foundations`.

Include the analytics evidence, source reconciliation table, commit map, verification output, GA4 dashboard steps, Roundup issue link, and known limitations.

- [ ] **Step 6: Re-read the PR diff and checks**

Verify the base is `main`, the head is `seo/august-traffic-improvements`, the PR is draft, no unrelated files are included, and no merge/deploy occurred.
