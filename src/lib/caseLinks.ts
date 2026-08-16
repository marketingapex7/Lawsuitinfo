export type CaseIntent = "update" | "settlement" | "deadline";

const defaultAnchors: Record<CaseIntent, string> = {
  update: "latest-update",
  settlement: "settlement",
  deadline: "deadlines"
};

const caseAnchors: Record<string, Partial<Record<CaseIntent, string>>> = {
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
  paraquat: {
    settlement: "paraquat-settlement-status",
    deadline: "paraquat-deadlines"
  },
  roundup: {
    settlement: "roundup-settlement-timing",
    deadline: "roundup-deadline-questions"
  },
  suboxone: {
    settlement: "suboxone-settlement-status",
    deadline: "suboxone-deadlines"
  }
};

export function caseIntentHref(slug: string, intent: CaseIntent): string {
  const anchor = caseAnchors[slug]?.[intent] ?? defaultAnchors[intent];
  return `/lawsuits/${slug}/#${anchor}`;
}
