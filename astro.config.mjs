import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = process.env.SITE_URL ?? "https://lawsuitinfo.pages.dev";

export default defineConfig({
  site: siteUrl,
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/sponsorship/")
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
