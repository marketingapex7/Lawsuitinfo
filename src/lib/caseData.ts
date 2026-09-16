import { z } from "astro:content";
import limitationsJson from "../data/states/limitations.json";

const pendingCountSchema = z.object({
  date: z.string(),
  count: z.number(),
  scope: z.string(),
  source: z.string(),
  sourceUrl: z.string().optional(),
  primary: z.boolean().optional(),
  totalFiled: z.number().optional()
});

const caseDataSchema = z.object({
  slug: z.string(),
  caseName: z.string(),
  litigation: z.object({
    type: z.string(),
    mdlNumber: z.string().nullable().optional(),
    mdlName: z.string().nullable().optional(),
    court: z.string(),
    courtShort: z.string().optional(),
    judge: z.string().nullable().optional(),
    established: z.string().nullable().optional()
  }),
  phase: z.string(),
  phaseDetail: z.string().optional(),
  updateNote: z.string().optional(),
  statusVerifiedOn: z.string().optional(),
  updates: z.array(z.object({
    date: z.string(),
    summary: z.string(),
    sourceUrl: z.string()
  })).default([]),
  pendingCounts: z.array(pendingCountSchema).default([]),
  defendants: z.array(z.string()).default([]),
  settlements: z
    .array(
      z.object({
        label: z.string(),
        status: z.string(),
        detail: z.string(),
        source: z.string().optional(),
        sourceUrl: z.string().optional(),
        kind: z.enum(["global", "public-entity", "individual", "proposed", "none"]).optional(),
        amount: z.string().optional(),
        individualClaims: z.string().optional(),
        verifiedOn: z.string().optional()
      })
    )
    .default([]),
  keyDates: z
    .array(
      z.object({
        date: z.string(),
        label: z.string(),
        detail: z.string().optional(),
        sourceUrl: z.string().optional(),
        source: z.string().optional(),
        verifiedOn: z.string().optional(),
        appliesTo: z.string().optional(),
        kind: z.enum(["court", "bellwether", "claim", "milestone"]).optional(),
        status: z.enum(["scheduled", "completed", "cancelled", "historical"]).optional()
      })
    )
    .default([]),
  deadlineOverride: z.string().optional(),
  sources: z.array(z.object({ name: z.string(), url: z.string() })).default([]),
  dataAsOf: z.string()
});

export type CaseData = z.infer<typeof caseDataSchema>;

const modules = import.meta.glob<{ default: unknown }>("../data/cases/*.json", { eager: true });

const cases = new Map<string, CaseData>();
for (const [path, mod] of Object.entries(modules)) {
  const parsed = caseDataSchema.parse((mod as { default: unknown }).default);
  cases.set(parsed.slug, parsed);
  void path;
}

export function getCaseData(slug: string): CaseData | undefined {
  return cases.get(slug);
}

export function getAllCaseData(): CaseData[] {
  return Array.from(cases.values()).sort((a, b) => a.caseName.localeCompare(b.caseName));
}

export function latestPendingCount(data: CaseData) {
  // Deterministic headline selection: an explicit `primary: true` entry wins;
  // otherwise the newest date wins, with ties going to the earliest array entry.
  const primary = data.pendingCounts.find((entry) => entry.primary);
  if (primary) return primary;
  let best: CaseData["pendingCounts"][number] | undefined;
  for (const entry of data.pendingCounts) {
    if (!best || entry.date.localeCompare(best.date) > 0) best = entry;
  }
  return best;
}

export function secondaryPendingCounts(data: CaseData) {
  const headline = latestPendingCount(data);
  return data.pendingCounts.filter((entry) => entry !== headline);
}

export function previousPendingCount(data: CaseData) {
  const latest = latestPendingCount(data);
  return [...data.pendingCounts]
    .filter((entry) => entry !== latest && entry.scope === latest?.scope)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function monthlyChange(data: CaseData) {
  const latest = latestPendingCount(data);
  const previous = previousPendingCount(data);
  return latest && previous ? latest.count - previous.count : undefined;
}

export function nextMajorDate(data: CaseData, asOf = data.dataAsOf) {
  return data.keyDates
    .filter((entry) => entry.date >= asOf && entry.status !== "cancelled" && entry.status !== "completed" && entry.status !== "historical")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}

const limitationSchema = z.object({
  piYears: z.number(),
  citation: z.string(),
  discoveryNote: z.string().nullable().optional(),
  reposeNote: z.string().nullable().optional()
});

export type StateLimitation = z.infer<typeof limitationSchema>;

export function getStateLimitation(stateSlug: string): StateLimitation | undefined {
  const raw = (limitationsJson as Record<string, unknown>)[stateSlug];
  if (!raw) return undefined;
  const parsed = limitationSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

export function formatCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}
