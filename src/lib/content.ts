export function entrySlug(entry: { id: string; data: { urlSlug?: string; slug?: string } }) {
  return entry.data.urlSlug ?? entry.data.slug ?? entry.id.replace(/\.mdx?$/, "");
}
