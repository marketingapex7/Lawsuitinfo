import { states } from "./site";

const stateSlugs = new Set<string>(states.map((state) => state.slug));

const classify = (link: HTMLAnchorElement) => {
  if (link.dataset.track) return link.dataset.track;
  const href = link.getAttribute("href") ?? "";
  if (link.rel.includes("sponsored")) return "sponsor_click";
  if (link.dataset.destination === "attorney") return "attorney_link_click";
  if (href.startsWith("mailto:")) return "contact_click";
  if (href.startsWith("tel:")) return "phone_click";
  const url = new URL(link.href, window.location.href);
  if (!/^https?:$/.test(url.protocol)) return;
  if (url.origin !== window.location.origin) return "source_click";
  if (url.pathname === window.location.pathname && url.hash) return "section_navigation";
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] === "states") return "state_guide_click";
  if (parts[0] === "lawsuits" && parts.length === 3) {
    return stateSlugs.has(parts[2]) ? "state_guide_click" : "supporting_guide_click";
  }
  if (parts[0] === "mdl") return "mdl_click";
  if (parts[0] === "settlements") return "settlement_tracker_click";
  if (parts[0] === "deadlines") return "deadline_tracker_click";
};

document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
  if (!link) return;
  const eventName = classify(link);
  if (!eventName || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, { link_url: link.href, link_text: link.textContent?.trim().slice(0, 100) });
});

declare global { interface Window { gtag?: (...args: unknown[]) => void } }
