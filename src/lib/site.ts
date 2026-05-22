export const site = {
  name: "Injury Lawsuit Guide",
  url: import.meta.env.SITE_URL ?? "https://example.com",
  description:
    "Plain-English legal information about active mass tort and injury lawsuits, state-specific legal context, and sponsorship availability.",
  email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? "sponsors@example.com"
};

export const states = [
  {
    name: "Illinois",
    slug: "illinois",
    abbr: "IL",
    courts: ["Northern District of Illinois", "Central District of Illinois", "Southern District of Illinois"]
  },
  {
    name: "Missouri",
    slug: "missouri",
    abbr: "MO",
    courts: ["Eastern District of Missouri", "Western District of Missouri"]
  },
  {
    name: "Texas",
    slug: "texas",
    abbr: "TX",
    courts: ["Northern District of Texas", "Southern District of Texas", "Eastern District of Texas", "Western District of Texas"]
  },
  {
    name: "Florida",
    slug: "florida",
    abbr: "FL",
    courts: ["Northern District of Florida", "Middle District of Florida", "Southern District of Florida"]
  },
  {
    name: "California",
    slug: "california",
    abbr: "CA",
    courts: ["Northern District of California", "Eastern District of California", "Central District of California", "Southern District of California"]
  },
  {
    name: "North Carolina",
    slug: "north-carolina",
    abbr: "NC",
    courts: ["Eastern District of North Carolina", "Middle District of North Carolina", "Western District of North Carolina"]
  },
  {
    name: "Georgia",
    slug: "georgia",
    abbr: "GA",
    courts: ["Northern District of Georgia", "Middle District of Georgia", "Southern District of Georgia"]
  },
  {
    name: "Ohio",
    slug: "ohio",
    abbr: "OH",
    courts: ["Northern District of Ohio", "Southern District of Ohio"]
  },
  {
    name: "Pennsylvania",
    slug: "pennsylvania",
    abbr: "PA",
    courts: ["Eastern District of Pennsylvania", "Middle District of Pennsylvania", "Western District of Pennsylvania"]
  },
  {
    name: "Michigan",
    slug: "michigan",
    abbr: "MI",
    courts: ["Eastern District of Michigan", "Western District of Michigan"]
  }
] as const;

export type LaunchState = (typeof states)[number];

export function getStateBySlug(slug: string) {
  return states.find((state) => state.slug === slug);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T12:00:00`));
}
