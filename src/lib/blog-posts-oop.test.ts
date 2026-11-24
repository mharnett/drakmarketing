import { test } from "node:test";
import assert from "node:assert/strict";
import { blogPosts } from "./blog-posts.ts";
import { allCaseStudies } from "./case-studies.ts";
import { clientNameEntries, mentions } from "./client-names.ts";

// The post was retitled for the query people type. The slug stays, so old links still work
// (the site has no redirects).
const SLUG = "object-oriented-task-management";
const MCKINSEY_URL =
  "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/state-of-ai-trust-in-2026-shifting-to-the-agentic-era";

function post() {
  const p = blogPosts.find((x) => x.slug === SLUG);
  assert.ok(p, `expected a blog post with slug "${SLUG}"`);
  return p!;
}
const blocks = () => post().content.split("\n\n");
// The FAQ section heading is not a question heading; the AEO lint skips it the same way.
const headings = () =>
  blocks()
    .filter((b) => b.startsWith("## "))
    .map((b) => b.slice(3).trim())
    .filter((h) => h.toLowerCase() !== "faq");

test("object-oriented-task-management keeps its slug and publish date under the query title", () => {
  const p = post();
  assert.equal(p.title, "How to Write Tasks AI Agents Can't Get Wrong");
  assert.equal(p.date, "2026-09-29");
  assert.equal(p.author, "Mark Harnett");
});

test("the excerpt and the first block state the method, not the 90s story", () => {
  const p = post();
  const first = blocks()[0];
  assert.ok(first.startsWith("**Short answer:**"), "the first block must start with the short answer");
  for (const [where, text] of [["excerpt", p.excerpt], ["first block", first]] as const) {
    assert.match(text, /Definition of Done/, `${where} must name the Definition of Done`);
    assert.match(text, /check/i, `${where} must name the verification check`);
    assert.match(text, /open questions/i, `${where} must name the open questions`);
  }
  assert.doesNotMatch(first, /^\*\*Short answer:\*\* Back in the 90s/);
});

test("the 40% of 117 and the 34 false 'done' logs sit near the top, in their own block", () => {
  const top = blocks().slice(0, 2);
  const facts = top.find((b) => /40% of 117/.test(b));
  assert.ok(facts, "the 40% of 117 fact must be in the first two blocks");
  assert.match(facts!, /34 times/, "the 34 false 'done' logs belong in the same block");
});

test("the post has question headings, starting with why agents misread tasks", () => {
  const hs = headings();
  assert.ok(hs.length >= 3, `expected at least 3 headings, got ${hs.length}`);
  for (const h of hs) assert.ok(h.endsWith("?"), `"${h}" must be a question`);
  assert.equal(hs[0], "Why do AI agents misread tasks?");
});

test("the template is a labeled list the page can render, given inline instead of offered", () => {
  const bs = blocks();
  assert.equal(bs.filter((b) => b.startsWith("    ")).length, 0, "the page has no code-block renderer");
  const example = bs.find((b) => b.startsWith("- **Done:**"));
  assert.ok(example, "the example must be a list starting with - **Done:**");
  const lines = example!.split("\n");
  assert.deepEqual(
    lines.map((l) => /^- \*\*([^*]+):\*\*/.exec(l)?.[1]),
    ["Done", "Check", "Pass"],
  );
  assert.match(example!, /ad group "AI Compliance"/);
  const blank = bs.find((b) => b.startsWith("- **Definition of Done:**"));
  assert.ok(blank, "the blank template must be a list starting with - **Definition of Done:**");
  for (const label of ["Definition of Done", "Verification", "Open Questions"]) {
    assert.ok(blank!.includes(`- **${label}:**`), `blank template missing ${label}`);
  }
  assert.doesNotMatch(post().content, /Happy to share my template/);
});

test("object-oriented-task-management keeps its source link, its voice and no client names", () => {
  const p = post();
  assert.ok(p.content.includes(`](${MCKINSEY_URL})`));
  for (const [field, text] of Object.entries({ title: p.title, excerpt: p.excerpt, content: p.content })) {
    assert.equal((text.match(/—/g) || []).length, 0, `em dash in ${field}`);
  }
  const roster = clientNameEntries(allCaseStudies, process.env.BLOG_LINT_CLIENT_NAMES);
  assert.ok(roster.length > 0);
  assert.deepEqual(roster.filter((e) => mentions(p.content, e.name)).map((e) => e.label), []);
});
