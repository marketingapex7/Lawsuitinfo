import policy from "../data/state-index-policy.json";
import { minimumIndexableStateGuides } from "@lib/site";

type GuidePolicy = { index: boolean; reason: string };
const guides = policy.guides as Record<string, GuidePolicy>;

/**
 * Whether a tort x state guide should be indexed. Guides missing from the policy
 * file default to noindex, so newly generated state pages must earn a place
 * (verified state-specific content + search demand) before they enter the index.
 */
export function isIndexableStateGuide(lawsuitSlug: string, stateSlug: string): boolean {
  return guides[`${lawsuitSlug}/${stateSlug}`]?.index === true;
}

type GuideLike = { data: { lawsuitSlug: string; stateSlug: string } };

export function indexableStateGuides<T extends GuideLike>(entries: T[]): T[] {
  return entries.filter((entry) => isIndexableStateGuide(entry.data.lawsuitSlug, entry.data.stateSlug));
}

/** A /states/{state}/ hub is indexable only when enough of its guides are indexable. */
export function isIndexableStateHub<T extends GuideLike>(stateSlug: string, entries: T[]): boolean {
  return indexableStateGuides(entries.filter((entry) => entry.data.stateSlug === stateSlug)).length >= minimumIndexableStateGuides;
}
