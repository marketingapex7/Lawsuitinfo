const OFFICIAL_SOURCE_HOSTS = new Set([
  "pfaswatersettlement.com",
  "www.pfaswatersettlement.com",
  "weedkillerclass.com",
  "www.weedkillerclass.com",
]);

export function isOfficialSourceUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname.endsWith(".gov") || OFFICIAL_SOURCE_HOSTS.has(hostname);
  } catch {
    return false;
  }
}
