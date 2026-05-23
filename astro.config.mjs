import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = process.env.SITE_URL ?? "https://lawsuitinfo.pages.dev";

export default defineConfig({
  site: siteUrl,
  output: "static",
  vite: {
    plugins: [tailwindcss()]
  }
});
