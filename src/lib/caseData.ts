import { z } from "astro:content";
import limitationsJson from "../data/states/limitations.json";

const pendingCountSchema = z.object({
  date: z.string(),
  count: z.number(),
  scope: z.string(),
  source: z.string()
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
  pendingCounts: z.array(pendingCountSchema).default([]),
  defendants: z.array(z.string()).default([]),
  settlements: z
    .array(
      z.object({
        label: z.string(),
        status: z.string(),
        detail: z.string(),
        source: z.string().optional()
      })
    )
    .default([]),
  keyDates: z
    .array(
      z.object({
        date: z.string(),
        label: z.string(),
        detail: z.string().optional()
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

export function latestPendingCount(data: CaseData) {
  return [...data.pendingCounts].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
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
