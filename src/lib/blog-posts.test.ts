import { test } from "node:test";
import assert from "node:assert/strict";
import { blogPosts } from "./blog-posts.ts";
import { allCaseStudies } from "./case-studies.ts";
import { clientNameEntries, mentions } from "./client-names.ts";

const SLUG = "meta-incrementality-two-mcps";
const REPO_URL = "https://github.com/mharnett/mcp-meta-ads-incrementality";

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

test("meta-incrementality-two-mcps post exists with the correct metadata", () => {
  const p = post();
  assert.equal(p.title, "Your Meta Conversion Number Is Inflated. Here's How to See By How Much.");
  assert.equal(p.date, "2026-08-01");
  assert.equal(p.author, "Mark Harnett");
});

test("the post opens by answering 'are Meta-reported conversions inflated?'", () => {
  const first = blocks()[0];
  assert.ok(first.startsWith("**Short answer:** Yes."), "lead with a direct yes");
  for (const term of ["7-day-click", "1-day-view", "incrementality", "inflation factor"]) {
    assert.ok(first.includes(term), `short answer must name ${term}`);
  }
});

test("one first-party inflation reading sits before the first heading, anonymized, with its evidence", () => {
  const bs = blocks();
  const firstHeading = bs.findIndex((b) => b.startsWith("## "));
  const i = bs.findIndex((b) => /more than 5 times/.test(b));
  assert.ok(i >= 0, "expected a measured inflation factor");
  assert.ok(i < firstHeading, "the measured reading belongs before the first heading");
  const reading = bs[i];
  // Claim and evidence in one block: the reported count, the incremental count and who it is.
  assert.match(reading, /more than 100 leads/);
  assert.match(reading, /(?<!\d)20(?!\d)/);
  assert.match(reading, /one B2B software account I manage/);
  assert.match(reading, /retargeting/);
});

test("the post's headings are questions, starting with why the reported number is inflated", () => {
  const hs = headings();
  assert.ok(hs.length >= 4, `expected at least 4 headings, got ${hs.length}`);
  for (const h of hs) assert.ok(h.endsWith("?"), `"${h}" must be a question`);
  assert.equal(hs[0], "Why are Meta's reported conversions inflated?");
  assert.ok(hs.includes("What is Meta's incrementality attribution?"));
});

test("the post keeps its code spans, repo link, metric definitions and worked example", () => {
  const c = post().content;
  // The two inline-code spans survive the template-literal escaping intact.
  assert.equal((c.match(/`/g) || []).length, 4);
  assert.match(c, /`incrementality`/);
  assert.match(c, /`npm install -g mcp-meta-ads-incrementality`/);
  assert.ok(c.includes(`](${REPO_URL})`), "missing the repo link");
  assert.match(c, /\*\*inflation_factor:\*\* reported conversions ÷ incremental conversions/);
  assert.match(c, /\*\*overstatement_pct:\*\*/);
  assert.match(c, /2\.5×/);
});

test("meta-incrementality-two-mcps has no em dashes and no client names", () => {
  const p = post();
  for (const [field, text] of Object.entries({ title: p.title, excerpt: p.excerpt, content: p.content })) {
    assert.equal((text.match(/—/g) || []).length, 0, `em dash in ${field}`);
  }
  const roster = clientNameEntries(allCaseStudies, process.env.BLOG_LINT_CLIENT_NAMES);
  assert.ok(roster.length > 0);
  for (const text of [p.title, p.excerpt, p.content]) {
    assert.deepEqual(roster.filter((e) => mentions(text, e.name)).map((e) => e.label), []);
  }
});
