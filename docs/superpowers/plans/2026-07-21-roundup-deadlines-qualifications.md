# Roundup Deadlines and Qualifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the national Roundup guide the clearest site answer for Roundup filing-deadline, qualification, and proof queries without publishing a universal deadline or implying guaranteed eligibility.

**Architecture:** Keep the existing `/lawsuits/roundup/` URL and content pipeline. Add a focused content invariant to the existing validator, then consolidate the national Markdown guide into one qualification sequence and one deadline sequence while leaving state-level timing to the existing state guides.

**Tech Stack:** Astro 5, Markdown/YAML content, Node.js ESM validation scripts, npm production build.

## Global Constraints

- Refresh only the national Roundup guide and structured case data when necessary.
- Do not create a universal filing deadline or state-by-state deadline table.
- Keep individual claims distinct from the proposed *King v. Monsanto* class settlement.
- Keep the proposed settlement described as preliminary unless a current primary source proves a later status.
- Do not add payout estimates, guaranteed outcomes, or unsourced medical causation claims.
- Do not create a separate deadline or qualification URL.

---

### Task 1: Add Roundup Accuracy Invariants

**Files:**
- Modify: `scripts/validate-content.mjs`
- Test: `scripts/validate-content.mjs`

**Interfaces:**
- Consumes: `src/content/lawsuits/roundup.md` as UTF-8 text.
- Produces: validation failures through the existing `report(file, message)` error collector.

- [ ] **Step 1: Write the failing validation**

Add a focused validator and invoke it before the final error report:

```js
async function validateRoundupDeadlineAndQualificationContent() {
  const file = path.join(root, "src", "content", "lawsuits", "roundup.md");
  const content = await readFile(file, "utf8");
  const required = [
    ["What is the deadline to file a Roundup lawsuit?", "missing direct deadline heading"],
    ["There is no single national deadline for an individual Roundup lawsuit.", "missing no-national-deadline answer"],
    ["Who may qualify for a Roundup lawsuit?", "missing qualified eligibility heading"],
    ["Class-settlement dates do not replace an individual lawsuit deadline.", "missing class-versus-individual deadline distinction"],
    ["What proof do you need for a Roundup lawsuit?", "missing proof heading"]
  ];

  for (const [text, message] of required) {
    if (!content.includes(text)) report(file, message);
  }
}
```

Invoke `await validateRoundupDeadlineAndQualificationContent();` after the existing national-guide freshness check.

- [ ] **Step 2: Run the validator to verify RED**

Run: `npm run validate:content`

Expected: FAIL because the current guide lacks the new direct deadline heading, exact no-national-deadline answer, qualified eligibility heading, and concise class-versus-individual distinction.

- [ ] **Step 3: Commit the failing validation**

```bash
git add scripts/validate-content.mjs
git commit -m "Validate Roundup deadline and qualification answers"
```

### Task 2: Consolidate the National Roundup Guide

**Files:**
- Modify: `src/content/lawsuits/roundup.md`
- Modify only if status facts change during source verification: `src/data/cases/roundup.json`
- Test: `scripts/validate-content.mjs`

**Interfaces:**
- Consumes: current official settlement FAQ, official settlement status page, N.D. California MDL page, and existing state-guide links rendered by the lawsuit template.
- Produces: one canonical national guide answering qualification, proof, and deadline queries.

- [ ] **Step 1: Verify current primary-source facts**

Confirm from the official settlement website and FAQ that final approval has not been granted, the listed fairness-hearing date remains August 19, 2026, and the June 4, 2026 objection/exclusion date is settlement-specific. Confirm the federal MDL context from the N.D. California court page.

- [ ] **Step 2: Rewrite the qualification sequence**

Replace the overlapping `roundup-eligibility`, `roundup-eligibility-factors`, `claim-evaluation`, and `harder-claims` material with a concise sequence headed `Who may qualify for a Roundup lawsuit?`. Preserve these factual groups:

```text
- identifiable Roundup or glyphosate product exposure
- frequency, duration, and work or residential setting
- documented non-Hodgkin lymphoma diagnosis and subtype
- exposure, diagnosis, treatment, and death dates where relevant
- prior claim, settlement, release, or opt-out paperwork
- state law and claim type
```

State that these are review factors, not an automatic qualification formula, and distinguish individual-claim review from the proposed class definition.

- [ ] **Step 3: Rewrite the proof sequence**

Keep `What proof do you need for a Roundup lawsuit?` and organize evidence into product/exposure records, medical records, timing records, and prior-claim documents. Explain that missing receipts do not automatically resolve the claim either way and identify alternative records without promising that they are sufficient.

- [ ] **Step 4: Rewrite the deadline sequence**

Replace the overlapping `state-law`, `roundup-statute-limitations`, and `roundup-deadline-questions` passages with `What is the deadline to file a Roundup lawsuit?`. Begin with:

```text
There is no single national deadline for an individual Roundup lawsuit.
```

Explain the possible relevance of diagnosis, discovery, death, claim type, prior filings, settlements, and releases. Add the exact distinction:

```text
Class-settlement dates do not replace an individual lawsuit deadline.
```

Keep the June 4, 2026 objection/exclusion date and August 19, 2026 fairness-hearing date explicitly tied to the proposed settlement.

- [ ] **Step 5: Align FAQs and metadata**

Use the natural questions `Who may qualify for a Roundup lawsuit?`, `What proof do you need for a Roundup lawsuit?`, and `What is the deadline to file a Roundup lawsuit?`. Remove redundant FAQs that answer the same intent. Keep `lastUpdated` and `lastReviewed` at `2026-07-21`; update `dataAsOf` only if structured case facts change.

- [ ] **Step 6: Run the validator to verify GREEN**

Run: `npm run validate:content`

Expected: `Content validation passed.`

- [ ] **Step 7: Commit the content refresh**

```bash
git add src/content/lawsuits/roundup.md src/data/cases/roundup.json
git commit -m "Focus Roundup guide on deadlines and qualifications"
```

### Task 3: Verify, Review, and Publish

**Files:**
- Review: `dist/lawsuits/roundup/index.html`
- Review: all files changed against `origin/main`

**Interfaces:**
- Consumes: the completed branch and production build output.
- Produces: verified branch and GitHub pull request targeting `main`.

- [ ] **Step 1: Run the complete production verification**

Run: `$env:ASTRO_TELEMETRY_DISABLED='1'; npm run build`

Expected: content validation passes, Astro exits 0, and internal-link validation passes.

- [ ] **Step 2: Inspect the rendered Roundup page**

Confirm that `dist/lawsuits/roundup/index.html` contains each required heading once, source links resolve to the intended destinations, individual and class deadlines are separated, and no duplicate eligibility/deadline blocks remain.

- [ ] **Step 3: Review the diff against the approved design**

Run: `git diff --check origin/main...HEAD` and `git diff --stat origin/main...HEAD`.

Expected: no whitespace errors; changes are limited to the design/plan, validator, Roundup guide, and structured Roundup data only if verified facts changed.

- [ ] **Step 4: Request independent code/content review**

Provide the reviewer with `origin/main` as the base, `HEAD` as the target, the approved design file, and instructions to prioritize legal-status accuracy, deadline ambiguity, eligibility overstatement, duplicate content, and validation coverage. Resolve every Critical or Important finding before proceeding.

- [ ] **Step 5: Push and open a draft pull request**

```bash
git push -u origin agent/roundup-deadlines-qualifications
```

Open a draft PR targeting `main` with the content changes, GSC rationale, accuracy guardrails, and exact verification commands in the description.
