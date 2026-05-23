# Injury Lawsuit Guide

Static Astro site for public legal information and lawsuit/state sponsorship pages.

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

- `SITE_URL`: the production origin, such as `https://lawsuitinfo.pages.dev`
- `PUBLIC_CONTACT_EMAIL`: the public contact email shown on the site
- `ASTRO_TELEMETRY_DISABLED`: `1`

This project uses static output only. It does not need the Cloudflare Astro adapter, Pages Functions, Workers, a database, a CMS, payments, or login.

## Content Editing

- Lawsuit hub pages: `src/content/lawsuits/`
- State lawsuit pages: `src/content/state-guides/`
- Category pages: `src/content/categories/`

Sponsor availability is edited in frontmatter with `sponsorStatus: available`, `reserved`, or `sold`.
