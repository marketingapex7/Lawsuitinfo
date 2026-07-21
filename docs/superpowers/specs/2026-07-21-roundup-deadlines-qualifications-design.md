# Roundup Deadlines and Qualifications Refresh

## Goal

Improve the national Roundup guide for the GSC queries about filing deadlines, qualification factors, and required proof. The page should answer those questions directly without promising eligibility, inventing a nationwide filing date, or confusing an individual injury claim with the proposed *King v. Monsanto* class settlement.

## Scope

- Refresh only the national Roundup guide and its structured case data when necessary.
- Consolidate overlapping eligibility, proof, statute-of-limitations, and deadline passages.
- Keep the existing Roundup URL and state-guide architecture.
- Preserve the site's neutral informational tone and existing page components.
- Use current primary sources for litigation and proposed-settlement facts.

## Content Design

The guide will provide two prominent, complementary answers:

1. **Who may qualify for a Roundup lawsuit?** Explain that product use alone does not establish a viable claim. Organize the review factors around identifiable Roundup or glyphosate exposure, exposure frequency and setting, a documented non-Hodgkin lymphoma diagnosis and subtype, the exposure-to-diagnosis timeline, prior claim or release paperwork, and applicable state law.
2. **What is the deadline to file a Roundup lawsuit?** State clearly that there is no single national deadline for individual lawsuits. Explain that state limitation periods may turn on diagnosis, discovery, death, claim type, and prior activity. Separately identify the proposed class settlement's court-controlled dates and make clear that they do not replace an individual's state filing deadline.

A concise proof checklist will connect the two answers: product or workplace records, exposure dates and frequency, pathology and oncology records, treatment history, and prior settlement documents. FAQs will use the natural GSC wording for deadline, statute-of-limitations, qualification, and proof searches.

## Accuracy Rules

- Do not state or imply that every Roundup user qualifies.
- Do not publish a universal filing deadline or a state deadline without a controlling source and fact-specific qualification.
- Distinguish an individual personal-injury or wrongful-death claim from membership in the proposed class.
- Describe the class settlement as proposed and preliminarily approved unless a current official source establishes a later status.
- Distinguish objection, exclusion, registration, and claim-submission dates from statutes of limitation.
- Avoid payout estimates, guaranteed outcomes, and unsourced medical causation claims.

## Search and Internal-Link Strategy

The existing national URL remains the canonical target for broad Roundup qualification and deadline queries. Existing state guides remain the destination for state-level context. The refresh will not create separate deadline or eligibility URLs because doing so would split a still-developing query cluster and risk cannibalization.

## Validation

- Add focused content validation that requires the national Roundup guide to preserve the individual-claim/class-settlement distinction and the no-single-national-deadline answer.
- Run the validator before the content edit and confirm that the new expectations fail for the intended reason.
- Implement the minimum content and structured-data changes needed to satisfy the checks.
- Run the full content validation, Astro production build, and internal-link validation.
- Review the rendered Roundup page for heading order, repetition, source links, and misleading eligibility or deadline language.

## Out of Scope

- New Roundup state pages.
- State-by-state deadline tables.
- New lawsuit, deadline, or qualification URLs.
- Lead forms, sponsor placement, or conversion redesign.
- DataForSEO keyword expansion.
