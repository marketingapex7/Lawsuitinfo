export const ANALYTICS_EVENTS = new Set([
  "contact_click",
  "official_source_click",
  "qualified_read",
]);

const ANALYTICS_PARAMETERS = new Set([
  "page_path",
  "destination_host",
  "component_location",
  "case_slug",
  "link_label",
]);

export function trackEvent(name, parameters = {}) {
  if (!ANALYTICS_EVENTS.has(name)) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const safeParameters = {};
  for (const [key, value] of Object.entries(parameters)) {
    if (!ANALYTICS_PARAMETERS.has(key) || value === undefined || value === null) continue;
    if (!["string", "number", "boolean"].includes(typeof value)) continue;
    safeParameters[key] = value;
  }

  window.gtag("event", name, safeParameters);
}
