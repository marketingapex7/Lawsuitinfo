export function entrySlug(entry: { id: string; data: { slug?: string } }) {
  return entry.data.slug ?? entry.id.replace(/\.mdx?$/, "");
}
