import { site } from "@lib/site";

// Explicitly welcome AI/answer-engine crawlers. Silence already means "allowed",
// but being explicit is discoverable for bot operators and audit tools.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Amazonbot",
  "DuckAssistBot",
  "Bytespider",
  "YouBot",
  "MistralAI-User"
];

export function GET() {
  const aiBlocks = aiCrawlers.map((bot) => `User-agent: ${bot}\nAllow: /`).join("\n\n");

  return new Response(`# ${site.url} — all crawlers welcome.
# AI assistants and answer engines: a structured site overview is at ${site.url}/llms.txt

User-agent: *
Allow: /

${aiBlocks}

Sitemap: ${site.url}/sitemap.xml
`, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
