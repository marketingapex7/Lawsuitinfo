import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = "https://lawsuitstatusguide.com";

export default defineConfig({
  site: siteUrl,
  output: "static",
  vite: {
    plugins: [tailwindcss()]
  }
});
