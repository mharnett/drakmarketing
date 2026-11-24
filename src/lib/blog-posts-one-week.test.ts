// AEO content checks for "Don't Make Ad Decisions From One Week of Data" (2026-11-10).
// The post predates the AEO lint's start date, so the lint skips it; these tests hold
// the answer-first opening, question headings and the chart numbers stated in text.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseImageBlock } from "./blog-markdown.ts";
import { blogPosts } from "./blog-posts.ts";
import { allCaseStudies } from "./case-studies.ts";
import { clientNameEntries, mentions } from "./client-names.ts";

const SLUG = "dont-decide-from-one-week";
const CHART = "/images/blog/one-week-cpa.svg";

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

test("one-week post opens with the answer: compare to the trailing 6-8 weeks, not last week", () => {
  const first = blocks()[0];
  assert.ok(first.startsWith("**Short answer:**"), "the first block must start with the short answer");
  assert.match(first, /6-8 weeks/);
  assert.match(first, /20-30%/);
  assert.match(first, /last week/);
  // The PR story no longer leads.
  assert.doesNotMatch(first, /Corey Haines|PR merged/);
});

test("one-week post headings are questions, starting with the variance question", () => {
  const hs = headings();
  assert.ok(hs.length >= 4, `expected at least 4 headings, got ${hs.length}`);
  for (const h of hs) assert.ok(h.endsWith("?"), `"${h}" must be a question`);
  assert.equal(hs[0], "How much does CPA normally vary week to week?");
  assert.ok(!hs.includes("The problem"));
});

test("the block under the chart states the chart's numbers in text, and every number matches the chart", () => {
  const bs = blocks();
  const i = bs.findIndex((b) => parseImageBlock(b)?.src === CHART);
  assert.ok(i >= 0, "chart block missing");
  const caption = bs[i + 1] ?? "";
  assert.match(caption, /hypothetical/i, "the chart is hypothetical and the text must say so");
  for (const n of ["80", "115", "84", "105", "25%"]) {
    assert.ok(new RegExp(`(?<!\\d)${n}(?![\\d])`).test(caption), `caption missing ${n}`);
  }
  // Every number the caption states must appear in the chart's own description.
  const svg = readFileSync(join(process.cwd(), "public", CHART), "utf8");
  const desc = /<desc[^>]*>([\s\S]*?)<\/desc>/.exec(svg)?.[1] ?? "";
  assert.ok(desc.length > 0, "chart has no <desc>");
  for (const n of caption.match(/\d+%?/g) ?? []) {
    assert.ok(new RegExp(`(?<!\\d)${n}(?![\\d])`).test(desc), `caption says ${n}, the chart does not`);
  }
});

test("the exceptions that need no baseline are a bulleted list", () => {
  const list = blocks().find((b) => b.startsWith("- ") && /tracking/i.test(b));
  assert.ok(list, "expected the exceptions as a list");
  const items = list!.split("\n");
  assert.ok(items.every((l) => l.startsWith("- ")));
  for (const w of [/overspend/i, /tracking/i, /landing page/i, /disapproved/i]) {
    assert.ok(items.some((l) => w.test(l)), `exceptions list missing ${w}`);
  }
});

test("one-week post keeps its links, its voice and no client names", () => {
  const p = post();
  for (const href of [
    "https://github.com/coreyhaines31/marketingskills/pull/945",
    "https://github.com/mharnett/paid-media-agent-guardrails/blob/main/rules/PMG-003-dont-decide-from-one-week.md",
  ]) {
    assert.ok(p.content.includes(`](${href})`), `missing link ${href}`);
  }
  for (const [field, text] of Object.entries({ title: p.title, excerpt: p.excerpt, content: p.content })) {
    assert.equal((text.match(/—/g) || []).length, 0, `em dash in ${field}`);
  }
  assert.equal(blocks().filter((b) => b.startsWith("    ")).length, 0, "the page has no code-block renderer");
  const roster = clientNameEntries(allCaseStudies, process.env.BLOG_LINT_CLIENT_NAMES);
  assert.ok(roster.length > 0);
  assert.deepEqual(roster.filter((e) => mentions(p.content, e.name)).map((e) => e.label), []);
});
