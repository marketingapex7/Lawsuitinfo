# Supporting guide verification — September 14, 2026

Scope: five explicitly selected static routes only. The shared `SupportingGuide.astro` reads current phase and settlement posture from `getCaseData`; it does not create a second manually maintained record of volatile status, case counts, or dollar figures. Source review date for explanatory text is September 14, 2026; the component separately displays the case data review date.

## Roundup proof and deadline guides

- https://www.weedkillerclass.com/Home/FAQs — reviewed official FAQ sections on allegations (2), class and existing-MDL treatment (8–9), finality (10), occupational documentation (12), application and prior-claim criteria (17–18), evidence (19, 22), and claim submission (26). Guides summarize selected distinctions, not compensation tiers. No payout numbers copied. Deadlines are described by triggering event; no calendar date inferred from a fairness hearing.
- https://www.weedkillerclass.com/ — official administrator homepage; linked for the operative current notices and dates.
- https://www.sucorte.ca.gov/civil-lawsuit/statute-limitations — California judiciary English-language self-help page successfully retrieved. Supports the California-only illustration of discovery, limitations, and tolling. No state-specific period generalized nationally.
- The old N.D. Cal. Roundup fact-sheet URL redirected to the court homepage when opened. It was not used as a substantive source or published link in these guides.

Record inventories, missing-document checklists, and document organization suggestions are expressly editorial aids rather than court-mandated eligibility rules. The settlement FAQ is not generalized into a test for individual lawsuits.

## AFFF settlement guide

- https://www.pfaswatersettlement.com/ — official court-supervised site identifies four finally approved public-water-system settlements and provides separate defendant/phase/form deadlines. The guide emphasizes the class scope rather than suggesting that water-system funds are injury payouts.
- https://www.scd.uscourts.gov/mdl-2873/orders/CMO%2035%20ECF%207823.pdf — August 15, 2025 CMO 35; personal-injury proof and filing requirements and vacated October 2025 trial setting. Historical description only; current litigation posture is inherited from reviewed case data.

## Suboxone tooth-decay guide

- https://www.fda.gov/drugs/drug-safety-and-availability/fda-warns-about-dental-problems-buprenorphine-medicines-dissolved-mouth-treat-opioid-use-disorder — January 12, 2022 warning, affected oral formulations, reported dental issues, other delivery routes, benefit-risk framing, and patient direction not to stop suddenly without professional discussion. Formulation comparison is date-qualified to the communication. No treatment protocol added.
- https://www.ohnd.uscourts.gov/mdl-3092 — court's description of film-specific dental-injury allegations. Kept distinct from the broader FDA communication.
- https://www.ohnd.uscourts.gov/sites/ohnd/files/Doc%20%23672.pdf — March 31, 2026 amended CMO 13, collection of records, with authorizations covering medical/dental records, prescriptions, billing, and imaging. Suggested inventory is not represented as a substitute for court forms.

## Bard PowerPort settlement-amount guide

- https://www.azd.uscourts.gov/sites/azd/files/23-03081-477.pdf — March 11, 2024 amended CMO 8 and plaintiff profile form. Device identification, alleged complications, removal, fragments, and current outcome are requested in the attached form. These requests are not treated as proof of causation or payment eligibility.
- https://www.azd.uscourts.gov/sites/azd/files/23-03081-476_0.pdf — March 11, 2024 amended CMO 9 and plaintiff fact sheet; detailed information and profile accuracy requirements.
- https://www.azd.uscourts.gov/content/case-management-order-no-27-0 — District of Arizona case title and number verification only; this historical order is not cited for current settlement absence.

No payout range or average was created. Current settlement absence/presence and scope are inherited from the national case JSON and its named reviewed records. Sources used only for historical procedural descriptions are not presented as a full current docket search.

## Implementation verification

- Each supporting route is an explicit `index.astro` beneath its case directory, giving the static route precedence over the state-guide dynamic route.
- Metadata lives in `src/data/supporting-guides.json`: array of `{ path, caseSlug, title, description, reviewedAt }`. Parent implementation integrates discovery in sitemap and navigation.
- Shared component emits article metadata, a current case overview, national/MDL/tracker links, and existing state-guide links derived from the content collection. Settlement details appear only on the AFFF and PowerPort settlement-intent pages.
- Build and final rendered-link verification are performed at integration, after the shared status component and MDL routes are available.
