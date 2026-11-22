// AEO (answer engine optimization) lint for blog posts dated 2026-11-16 or later.
//
// Client names: this repo is public, so no name is written here. The lint reads the
// site's own case-study roster (allCaseStudies[].client), which is already public. For a
// client without a case study, set BLOG_LINT_CLIENT_NAMES to a comma-separated list in
// your shell; that test is skipped, and says so, when it is unset. Failure messages
// name the roster entry or list position, never the client.
//
// The lint lives in this test file because it only runs under `npm test`; tsconfig
// excludes *.test.ts, so it can import sibling modules by their .ts path the way
// node --test needs.
import { test } from "node:test";
import assert from "node:assert/strict";
import type { BlogPost } from "./blog-posts.ts";
import { blogPosts } from "./blog-posts.ts";
import { extractFaqs } from "./blog-seo.ts";
import { allCaseStudies } from "./case-studies.ts";

/**
 * Posts dated on or after this follow the answer-engine (AEO) structure the
 * split-brand-search post set. Older posts are exempt.
 */
const AEO_RULES_START = "2026-11-16";

type AeoRule =
  | "short-answer"
  | "key-takeaways"
  | "question-heading"
  | "opener-length"
  | "faq-count"
  | "faq-question"
  | "faq-answer-length"
  | "em-dash"
  | "client-name";

interface AeoIssue {
  rule: AeoRule;
  message: string;
}

/** A name a post must not mention, with a label that identifies it without repeating it. */
interface ClientNameEntry {
  name: string;
  label: string;
}

const EM_DASH = "\u2014";

function isAeoPost(post: BlogPost): boolean {
  return post.date >= AEO_RULES_START;
}

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

function between(n: number, min: number, max: number) {
  return n >= min && n <= max;
}

/**
 * Names to keep out of posts: every case-study client (the site's own public
 * roster), then any extra names from a comma- or newline-separated list such as
 * the BLOG_LINT_CLIENT_NAMES env var. Labels never contain the name, so a
 * failure message can be pasted anywhere.
 */
function clientNameEntries(
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

function mentions(text: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "iu").test(text);
}

/**
 * Structure rules for a post: a "Short answer" lead, five key takeaways, question
 * headings that each open with a 40-60 word answer, 3-5 FAQ entries of 35-50 words,
 * no em dashes and no client names. Blocks are split on blank lines, as the page
 * renders them.
 */
function aeoLintIssues(post: BlogPost, clientNames: ClientNameEntry[]): AeoIssue[] {
  const issues: AeoIssue[] = [];
  const add = (rule: AeoRule, message: string) => issues.push({ rule, message });
  const blocks = post.content.split("\n\n");

  if (!(blocks[0] ?? "").startsWith("**Short answer:**")) {
    add("short-answer", 'the first block must start with "**Short answer:**"');
  }

  const bullets = (blocks[2] ?? "").split("\n");
  const fiveBullets = bullets.length === 5 && bullets.every((l) => l.startsWith("- "));
  if (blocks[1] !== "**Key takeaways**" || !fiveBullets) {
    add("key-takeaways", 'the second block must be "**Key takeaways**", followed by exactly five "- " bullets');
  }

  blocks.forEach((block, i) => {
    if (!block.startsWith("## ")) return;
    const heading = block.slice(3).trim();
    if (heading.toLowerCase() === "faq") return;
    if (!heading.endsWith("?")) add("question-heading", `"${heading}" must be a question`);
    const opener = blocks[i + 1];
    const n = opener === undefined || opener.startsWith("#") ? 0 : wordCount(opener);
    if (!between(n, 40, 60)) add("opener-length", `"${heading}" opens with ${n} words; it needs 40-60`);
  });

  const faqs = extractFaqs(post.content);
  if (!between(faqs.length, 3, 5)) add("faq-count", `the FAQ has ${faqs.length} entries; it needs 3-5`);
  for (const f of faqs) {
    if (!f.question.endsWith("?")) add("faq-question", `FAQ "${f.question}" must end with a question mark`);
    const n = wordCount(f.answer);
    if (!between(n, 35, 50)) add("faq-answer-length", `FAQ "${f.question}" answer is ${n} words; it needs 35-50`);
  }

  const fields = { title: post.title, excerpt: post.excerpt, content: post.content };
  for (const [field, text] of Object.entries(fields)) {
    const count = text.split(EM_DASH).length - 1;
    if (count > 0) add("em-dash", `the ${field} has ${count} em dash${count === 1 ? "" : "es"}`);
  }

  for (const entry of clientNames) {
    for (const [field, text] of Object.entries(fields)) {
      if (mentions(text, entry.name)) add("client-name", `the ${field} names the ${entry.label}`);
    }
  }

  return issues;
}

// ---- Fixtures: synthetic copy only. No real client, campaign or account data. ----

const words = (n: number) => Array.from({ length: n }, (_, i) => `w${i}`).join(" ");
const FICTIONAL_CLIENT = { name: "Acme Widgets", label: "fixture entry 1" };

interface Parts {
  lead?: string;
  takeawaysLabel?: string;
  takeaways?: string[];
  sections?: { heading: string; opener: string }[];
  faqs?: { question: string; answer: string }[];
}

function fixture(parts: Parts = {}, meta: Partial<BlogPost> = {}): BlogPost {
  const sections = parts.sections ?? [
    { heading: "What is a thing?", opener: words(40) },
    { heading: "How does it work?", opener: words(60) },
  ];
  const faqs = parts.faqs ?? [
    { question: "First question?", answer: words(35) },
    { question: "Second question?", answer: words(50) },
    { question: "Third question?", answer: words(42) },
  ];
  const blocks = [
    parts.lead ?? `**Short answer:** ${words(20)}.`,
    parts.takeawaysLabel ?? "**Key takeaways**",
    (parts.takeaways ?? ["one", "two", "three", "four", "five"]).map((t) => `- ${t}`).join("\n"),
    "A body paragraph before the first heading.",
    ...sections.flatMap((s) => [`## ${s.heading}`, s.opener, "More body copy."]),
    "## FAQ",
    ...faqs.flatMap((f) => [`### ${f.question}`, f.answer]),
  ];
  return {
    slug: "fixture-post",
    title: "A Fixture Post",
    date: "2026-11-20",
    author: "Mark Harnett",
    excerpt: "An excerpt.",
    content: blocks.join("\n\n"),
    ...meta,
  };
}

const rules = (issues: AeoIssue[]) => issues.map((i) => i.rule);
const lint = (post: BlogPost) => aeoLintIssues(post, [FICTIONAL_CLIENT]);

// ---- The lint itself: each rule passes at its bounds and fails just past them. ----

test("a post that follows every rule has no issues, at the word-count bounds", () => {
  const issues = lint(fixture());
  assert.ok(Array.isArray(issues));
  assert.deepEqual(issues, []);
});

test("issues are {rule, message} objects with a readable message", () => {
  const issues = lint(fixture({ lead: "No direct answer here." }));
  assert.equal(issues.length, 1);
  assert.deepEqual(Object.keys(issues[0]).sort(), ["message", "rule"]);
  assert.equal(issues[0].rule, "short-answer");
  assert.match(issues[0].message, /Short answer/);
});

test("key takeaways need the label and exactly five bullets", () => {
  assert.deepEqual(rules(lint(fixture({ takeaways: ["a", "b", "c", "d"] }))), ["key-takeaways"]);
  assert.deepEqual(rules(lint(fixture({ takeaways: ["a", "b", "c", "d", "e", "f"] }))), ["key-takeaways"]);
  assert.deepEqual(rules(lint(fixture({ takeawaysLabel: "**Takeaways**" }))), ["key-takeaways"]);
});

test("every ## heading except FAQ is a question", () => {
  const post = fixture({ sections: [{ heading: "A statement heading", opener: words(50) }] });
  assert.deepEqual(rules(lint(post)), ["question-heading"]);
});

test("each section opens with a 40 to 60 word answer", () => {
  const short = fixture({ sections: [{ heading: "Too short?", opener: words(39) }] });
  const long = fixture({ sections: [{ heading: "Too long?", opener: words(61) }] });
  assert.deepEqual(rules(lint(short)), ["opener-length"]);
  assert.match(lint(short)[0].message, /39 words/);
  assert.deepEqual(rules(lint(long)), ["opener-length"]);
});

test("a heading followed directly by another heading has a zero-word opener", () => {
  const post = fixture();
  post.content = post.content.replace("## What is a thing?\n\n", "## What is a thing?\n\n## Empty?\n\n");
  const issues = lint(post);
  assert.deepEqual(rules(issues), ["opener-length"]);
  assert.match(issues[0].message, /0 words/);
});

test("the FAQ holds 3 to 5 entries", () => {
  const faq = (n: number) => Array.from({ length: n }, (_, i) => ({ question: `Q${i}?`, answer: words(40) }));
  assert.deepEqual(rules(lint(fixture({ faqs: faq(2) }))), ["faq-count"]);
  assert.deepEqual(rules(lint(fixture({ faqs: faq(5) }))), []);
  assert.deepEqual(rules(lint(fixture({ faqs: faq(6) }))), ["faq-count"]);
});

test("a post with no FAQ section fails the FAQ count", () => {
  const post = fixture();
  post.content = post.content.slice(0, post.content.indexOf("\n\n## FAQ"));
  assert.deepEqual(rules(lint(post)), ["faq-count"]);
});

test("FAQ answers run 35 to 50 words and questions end with a question mark", () => {
  const base = [
    { question: "Fine?", answer: words(40) },
    { question: "Also fine?", answer: words(40) },
  ];
  assert.deepEqual(rules(lint(fixture({ faqs: [...base, { question: "Short?", answer: words(34) }] }))), ["faq-answer-length"]);
  assert.deepEqual(rules(lint(fixture({ faqs: [...base, { question: "Long?", answer: words(51) }] }))), ["faq-answer-length"]);
  assert.deepEqual(rules(lint(fixture({ faqs: [...base, { question: "Not a question", answer: words(40) }] }))), ["faq-question"]);
});

test("no em dashes in the title, excerpt or body", () => {
  assert.deepEqual(rules(lint(fixture({}, { title: "A Title \u2014 With a Dash" }))), ["em-dash"]);
  assert.deepEqual(rules(lint(fixture({}, { excerpt: "An excerpt \u2014 with a dash." }))), ["em-dash"]);
  const body = fixture();
  body.content = body.content.replace("A body paragraph", "A body \u2014 paragraph");
  assert.deepEqual(rules(lint(body)), ["em-dash"]);
  // En dashes and hyphens are fine.
  assert.deepEqual(rules(lint(fixture({}, { title: "A Title \u2013 With an En-Dash" }))), []);
});

test("client names are caught in any case, as whole words, and the message never repeats the name", () => {
  const named = fixture();
  named.content = named.content.replace("A body paragraph", "At acme WIDGETS a body paragraph");
  const issues = lint(named);
  assert.deepEqual(rules(issues), ["client-name"]);
  assert.match(issues[0].message, /fixture entry 1/);
  assert.doesNotMatch(issues[0].message, /acme|widgets/i);

  assert.deepEqual(rules(lint(fixture({}, { title: "Acme Widgets Did This" }))), ["client-name"]);
  assert.deepEqual(rules(lint(fixture({}, { excerpt: "About Acme Widgets." }))), ["client-name"]);
  // Inside a longer word is not a mention.
  assert.deepEqual(rules(lint(fixture({}, { excerpt: "About SuperAcme Widgetsmith." }))), []);
});

test("posts dated before the rules start are exempt; the start date and later are linted", () => {
  assert.equal(isAeoPost(fixture({}, { date: "2026-11-15" })), false);
  assert.equal(isAeoPost(fixture({}, { date: "2026-11-16" })), true);
  assert.equal(isAeoPost(fixture({}, { date: "2027-01-02" })), true);
});

test("clientNameEntries labels each name without repeating it, drops duplicates and blank env entries", () => {
  const entries = clientNameEntries(
    [
      { slug: "study-a", client: "Acme Widgets" },
      { slug: "study-b", client: "acme widgets" },
      { slug: "study-c", client: "Globex" },
    ],
    " Initech ,, \n Umbrella Corp ",
  );
  assert.deepEqual(
    entries.map((e) => e.name),
    ["Acme Widgets", "Globex", "Initech", "Umbrella Corp"],
  );
  assert.deepEqual(
    entries.map((e) => e.label),
    ['client of case study "study-a"', 'client of case study "study-c"', "BLOG_LINT_CLIENT_NAMES entry 1", "BLOG_LINT_CLIENT_NAMES entry 2"],
  );
  assert.deepEqual(clientNameEntries([], undefined), []);
});

// ---- The corpus: every post dated on or after the rules start, as it ships. ----

const aeoPosts = blogPosts.filter(isAeoPost);

test("every post date is YYYY-MM-DD, so no post slips past the date filter", () => {
  for (const p of blogPosts) assert.match(p.date, /^\d{4}-\d{2}-\d{2}$/, `${p.slug} date ${p.date}`);
});

test("the post the rules came from is in scope", () => {
  assert.ok(aeoPosts.some((p) => p.slug === "split-brand-search-in-mmm"));
});

test(`every post dated ${AEO_RULES_START} or later follows the AEO structure and names no case-study client`, () => {
  const roster = clientNameEntries(allCaseStudies, undefined);
  assert.ok(roster.length > 0, "the case-study roster is empty, so the client-name rule would check nothing");
  const failures = aeoPosts.flatMap((p) =>
    aeoLintIssues(p, roster).map((i) => `${p.slug} [${i.rule}] ${i.message}`),
  );
  assert.deepEqual(failures, []);
});

const privateNames = process.env.BLOG_LINT_CLIENT_NAMES;

test(
  `every post dated ${AEO_RULES_START} or later names no client from BLOG_LINT_CLIENT_NAMES`,
  {
    skip: privateNames?.trim()
      ? false
      : "BLOG_LINT_CLIENT_NAMES is not set, so clients without a case study were not checked",
  },
  () => {
    const entries = clientNameEntries([], privateNames);
    const failures = aeoPosts.flatMap((p) =>
      aeoLintIssues(p, entries)
        .filter((i) => i.rule === "client-name")
        .map((i) => `${p.slug} ${i.message}`),
    );
    assert.deepEqual(failures, []);
  },
);
