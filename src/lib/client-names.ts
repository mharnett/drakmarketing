// Client names a blog post must not mention. This repo is public, so no name is written
// here: the roster is the site's own case-study list (allCaseStudies[].client), which is
// already public, plus any extra names passed in, such as the BLOG_LINT_CLIENT_NAMES env
// var. Shared by the blog tests; it has no imports so tsc, the Next build and node --test
// all accept it.

/** A name a post must not mention, with a label that identifies it without repeating it. */
export interface ClientNameEntry {
  name: string;
  label: string;
}

/**
 * Names to keep out of posts: every case-study client (the site's own public
 * roster), then any extra names from a comma- or newline-separated list such as
 * the BLOG_LINT_CLIENT_NAMES env var. Labels never contain the name, so a
 * failure message can be pasted anywhere.
 */
export function clientNameEntries(
  caseStudies: { slug: string; client: string }[],
  extraNames: string | undefined,
): ClientNameEntry[] {
  const seen = new Set<string>();
  const entries: ClientNameEntry[] = [];
  const add = (name: string, label: string) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ name, label });
  };
  for (const cs of caseStudies) add(cs.client.trim(), `client of case study "${cs.slug}"`);
  const extras = (extraNames ?? "").split(/[,\n]/).map((n) => n.trim()).filter(Boolean);
  extras.forEach((name, i) => add(name, `BLOG_LINT_CLIENT_NAMES entry ${i + 1}`));
  return entries;
}

/** True when `text` names `name` as a whole word, in any case. */
export function mentions(text: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "iu").test(text);
}
