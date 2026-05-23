import { defineCollection, z } from "astro:content";

const faqSchema = z.object({
  question: z.string(),
  answer: z.string()
});

const sponsorSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional()
}).optional();

const lawsuits = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lawsuit: z.string(),
    urlSlug: z.string().optional(),
    category: z.string(),
    categorySlug: z.string(),
    status: z.string(),
    primaryInjury: z.string(),
    caseType: z.string(),
    affected: z.string(),
    evidence: z.array(z.string()),
    injuries: z.array(z.string()),
    timeline: z.array(z.object({
      label: z.string(),
      detail: z.string()
    })),
    lastUpdated: z.string(),
    lastReviewed: z.string(),
    sponsorStatus: z.enum(["available", "reserved", "sold"]),
    sponsor: sponsorSchema,
    faqs: z.array(faqSchema)
  })
});

const stateGuides = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lawsuit: z.string(),
    lawsuitSlug: z.string(),
    state: z.string(),
    stateSlug: z.string(),
    stateAbbr: z.string(),
    category: z.string(),
    categorySlug: z.string(),
    status: z.string(),
    primaryInjury: z.string(),
    exposureContext: z.string(),
    lastUpdated: z.string(),
    lastReviewed: z.string(),
    sponsorStatus: z.enum(["available", "reserved", "sold"]),
    sponsor: sponsorSchema,
    faqs: z.array(faqSchema)
  })
});

const categories = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    urlSlug: z.string().optional(),
    name: z.string(),
    lawsuitSlugs: z.array(z.string()),
    lastUpdated: z.string()
  })
});

export const collections = {
  lawsuits,
  "state-guides": stateGuides,
  categories
};
