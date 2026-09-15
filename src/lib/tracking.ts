const classify = (link: HTMLAnchorElement) => {
  if (link.dataset.track) return link.dataset.track;
  const href = link.getAttribute("href") ?? "";
  if (link.rel.includes("sponsored")) return "sponsor_click";
  if (link.dataset.destination === "attorney") return "attorney_link_click";
  if (href.startsWith("mailto:")) return "contact_click";
  if (href.startsWith("tel:")) return "phone_click";
  if (href.startsWith("/states/") || /^\/lawsuits\/[^/]+\/(?:[a-z-]+)\/$/.test(href)) return "state_guide_click";
  if (href.startsWith("/mdl/")) return "mdl_click";
  if (href.startsWith("/settlements/")) return "settlement_tracker_click";
  if (href.startsWith("/deadlines/")) return "deadline_tracker_click";
  if (/^https?:\/\//.test(href)) return "source_click";
};

document.addEventListener("click", (event) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
  if (!link) return;
  const eventName = classify(link);
  if (!eventName || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, { link_url: link.href, link_text: link.textContent?.trim().slice(0, 100) });
});

declare global { interface Window { gtag?: (...args: unknown[]) => void } }
