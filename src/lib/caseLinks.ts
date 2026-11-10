export type CaseIntent = "update" | "settlement" | "deadline";

const defaultAnchors: Record<CaseIntent, string> = {
  update: "latest-update",
  settlement: "settlement",
  deadline: "deadlines"
};

const caseAnchors: Record<string, Partial<Record<CaseIntent, string>>> = {
  "bair-hugger": {
    settlement: "settlement-status",
    deadline: "bair-hugger-deadlines"
  },
  "afff-pfas": {
    settlement: "afff-settlement-status",
    deadline: "afff-deadlines"
  },
  "camp-lejeune": {
    settlement: "camp-lejeune-elective-option",
    deadline: "camp-lejeune-deadline"
  },
  ozempic: {
    deadline: "ozempic-deadlines"
  },
  "cook-ivc-filter": {
    settlement: "settlement-status",
    deadline: "cook-ivc-filter-deadlines"
  },
  exactech: {
    settlement: "settlement-status",
    deadline: "exactech-deadlines"
  },
  "nec-baby-formula": {
    settlement: "settlement-status",
    deadline: "nec-baby-formula-deadlines"
  },
  paraquat: {
    settlement: "paraquat-settlement-status",
    deadline: "paraquat-deadlines"
  },
  roundup: {
    deadline: "roundup-deadline-questions"
  },
  suboxone: {
    settlement: "suboxone-settlement-status",
    deadline: "suboxone-deadlines"
  },
  "talcum-powder": {
    deadline: "talcum-powder-deadlines"
  }
};

export function caseIntentHref(slug: string, intent: CaseIntent): string {
  const anchor = caseAnchors[slug]?.[intent] ?? defaultAnchors[intent];
  return `/lawsuits/${slug}/#${anchor}`;
}
