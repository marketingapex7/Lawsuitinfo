# Lawsuit Status Guide

Static Astro site for plain-English updates on active injury and mass tort lawsuits.

## Local Development

```sh
npm install
npm run dev
```

## Production Build

```sh
npm run build
```

The static site is generated in `dist/`.

## Cloudflare Pages

Use these Cloudflare Pages build settings:

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `24` or the latest Cloudflare-supported LTS version

Set these environment variables in Cloudflare Pages:

- `PUBLIC_CONTACT_EMAIL`: the public contact email shown on the site
- `ASTRO_TELEMETRY_DISABLED`: `1`

Canonical URLs, sitemap URLs, robots.txt, and schema are fixed to `https://lawsuitstatusguide.com` in the site configuration.

This project uses static output only. It does not need the Cloudflare Astro adapter, Pages Functions, Workers, a database, a CMS, payments, or login.

## Content Editing

- Lawsuit hub pages: `src/content/lawsuits/`
- State lawsuit pages: `src/content/state-guides/`
- Category pages: `src/content/categories/`
- Per-case structured data (MDL #, judge, pending counts, settlements, key dates): `src/data/cases/`
- Per-state statute-of-limitations data: `src/data/states/limitations.json`

Content is edited in Markdown frontmatter and page body sections.

## Build Playbook

`docs/PLAYBOOK.md` is the runbook for adding a new tort, expanding state coverage, de-duplicating per-state pages, and the freshness loop. **Read the YMYL accuracy rules at the top of the playbook before editing legal content.**

Helper scripts in `scripts/`:

- `generate-content.mjs` — original content generator for the launch torts (legacy reference).
- `add-case-states.mjs` — adds 10 state guides for a new case in one run, from a config block.
- `dedup-state-pages.mjs` — replaces the boilerplate per-state body on existing case-state guides with verified, state-specific content driven by `src/data/state-dedup/{tortSlug}.json`.
