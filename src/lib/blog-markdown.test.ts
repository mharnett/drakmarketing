import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { isVideoSrc, parseImageBlock, renderInlineMarkdown } from "./blog-markdown.ts";
import { blogPosts } from "./blog-posts.ts";
import { extractFaqs } from "./blog-seo.ts";

test("renderInlineMarkdown keeps bold and italic", () => {
  assert.equal(renderInlineMarkdown("a **b** *c*"), "a <strong>b</strong> <em>c</em>");
});

test("renderInlineMarkdown turns https and site-relative links into anchors", () => {
  assert.equal(
    renderInlineMarkdown("see [the PR](https://github.com/o/r/pull/1) now"),
    'see <a href="https://github.com/o/r/pull/1" class="underline underline-offset-2 hover:text-foreground">the PR</a> now',
  );
  assert.equal(renderInlineMarkdown("[tools](/tools)"), '<a href="/tools" class="underline underline-offset-2 hover:text-foreground">tools</a>');
});

test("renderInlineMarkdown leaves unsafe link schemes as plain text", () => {
  const out = renderInlineMarkdown("[x](javascript:alert(1))");
  assert.doesNotMatch(out, /<a /);
});

test("parseImageBlock reads a site-relative image block", () => {
  assert.deepEqual(parseImageBlock("![A chart](/images/blog/x.svg)"), {
    alt: "A chart",
    src: "/images/blog/x.svg",
  });
});

test("parseImageBlock rejects non-image blocks and off-site sources", () => {
  assert.equal(parseImageBlock("Just a paragraph."), null);
  assert.equal(parseImageBlock("![a](https://evil.example/x.png)"), null);
  assert.equal(parseImageBlock("![a](javascript:alert(1))"), null);
});

test("dont-decide-from-one-week post exists with its metadata", () => {
  const post = blogPosts.find((p) => p.slug === "dont-decide-from-one-week");
  assert.ok(post, "expected the dont-decide-from-one-week post");
  assert.equal(post!.title, "Don't Make Ad Decisions From One Week of Data");
  assert.equal(post!.author, "Mark Harnett");
  assert.match(post!.date, /^2026-11-\d\d$/);
});

test("dont-decide-from-one-week uses the exact +25% example and its chart file exists", () => {
  const post = blogPosts.find((p) => p.slug === "dont-decide-from-one-week");
  assert.ok(post);
  assert.match(post!.content, /This week it's 105, up 25% on last week's 84\./);
  assert.doesNotMatch(post!.content, /\b108\b|\b86\b/);
  const images = post!.content
    .split("\n\n")
    .map(parseImageBlock)
    .filter((i): i is { alt: string; src: string } => i !== null);
  assert.equal(images.length, 1);
  assert.equal(images[0].src, "/images/blog/one-week-cpa.svg");
  assert.ok(existsSync(join(process.cwd(), "public", images[0].src)), "chart file missing from public/");
});

test("isVideoSrc is true only for mp4 sources", () => {
  assert.equal(isVideoSrc("/images/blog/x.mp4"), true);
  assert.equal(isVideoSrc("/images/blog/x.svg"), false);
  assert.equal(isVideoSrc("/images/blog/x.mp4.png"), false);
});

test("status-filters-hide-spend post is dated for Thursday and embeds its video", () => {
  const post = blogPosts.find((p) => p.slug === "status-filters-hide-spend");
  assert.ok(post, "expected the status-filters-hide-spend post");
  assert.equal(post!.title, "Your Ads Report Is Missing Spend From Campaigns You Paused");
  assert.equal(post!.date, "2026-11-12");
  assert.equal(post!.author, "Mark Harnett");
  const media = post!.content
    .split("\n\n")
    .map(parseImageBlock)
    .filter((m): m is { alt: string; src: string } => m !== null);
  assert.equal(media.length, 1);
  assert.equal(media[0].src, "/images/blog/status-filter.mp4");
  assert.ok(isVideoSrc(media[0].src));
  assert.ok(existsSync(join(process.cwd(), "public", media[0].src)), "video missing from public/");
  for (const href of [
    "https://github.com/googleads/google-ads-mcp/pull/146",
    "https://github.com/kLOsk/adloop/pull/128",
    "https://github.com/mharnett/paid-media-agent-guardrails/blob/main/rules/PMG-004-dont-filter-history-on-status.md",
  ]) {
    assert.ok(post!.content.includes(`](${href})`), `missing link ${href}`);
  }
});

test("split-brand-search-in-mmm post is dated for Monday, explains MMM and carries its links", () => {
  const post = blogPosts.find((p) => p.slug === "split-brand-search-in-mmm");
  assert.ok(post, "expected the split-brand-search-in-mmm post");
  assert.equal(post!.title, "Putting My Paid Search Mistakes Into Other People's Tools");
  assert.equal(post!.date, "2026-11-16");
  assert.equal(post!.author, "Mark Harnett");
  assert.ok(post!.excerpt.length > 0 && post!.excerpt.length <= 220, "excerpt missing or too long");
  // It is the newest post, so it leads the blog index.
  assert.equal(blogPosts[0].slug, "split-brand-search-in-mmm");
  // The intro sections a marketer new to modeling needs, in order.
  const headings = post!.content.split("\n\n").filter((b) => b.startsWith("## "));
  assert.deepEqual(headings, [
    "## What is a marketing mix model?",
    "## What is wrong with one search channel?",
    "## What does the model do with it?",
    "## How do you fix it?",
    "## Why am I putting these rules into open source tools?",
    "## FAQ",
  ]);
  // AEO shape: a direct answer before the first heading, and FAQ entries that become FAQPage schema.
  const firstBlock = post!.content.split("\n\n")[0];
  assert.ok(firstBlock.startsWith("**Short answer:**"), "lead with a direct answer");
  assert.ok(firstBlock.includes("PyMC-Marketing") && firstBlock.includes("brand search"), "name the entities up top");
  const faqs = extractFaqs(post!.content);
  assert.equal(faqs.length, 3, "FAQ holds only follow-ups the body does not answer");
  const words = (t: string) => t.trim().split(/\s+/).length;
  for (const f of faqs) {
    assert.ok(f.question.endsWith("?"), `FAQ question: ${f.question}`);
    assert.ok(words(f.answer) >= 35 && words(f.answer) <= 50, `FAQ answer ${words(f.answer)} words: ${f.question}`);
  }
  // FAQ questions are ones a reader would type, not insider terms from the post.
  for (const f of faqs) assert.ok(!/PMG-|PyMC|notebook/i.test(f.question), `insider FAQ question: ${f.question}`);
  // First-party incrementality read from one client account, anonymized: no client names.
  for (const n of ["40%", "168", "166", "not a controlled test"]) assert.ok(post!.content.includes(n), `missing ${n}`);
  assert.ok(!post!.content.includes("43%"), "spend-share range was replaced by the incrementality point");
  assert.ok(post!.content.split("\n\n")[0].includes("40%"), "incrementality point leads the post");
  assert.ok(faqs.some((f) => f.question === "Does brand search spend drive sales?"), "FAQ answers the incrementality question");
  assert.ok(!/forcepoint|neon/i.test(post!.content.replace(/paid-media-agent-guardrails/g, "")), "no client names");
  // Key takeaways: a labeled block, then five bullets.
  const blocks = post!.content.split("\n\n");
  assert.equal(blocks[1], "**Key takeaways**");
  assert.equal(blocks[2].split("\n").filter((l) => l.startsWith("- ")).length, 5);
  // Each section opens with a 40-60 word direct answer.
  const sections = post!.content.split(/\n(?=## )/).slice(1).filter((x) => !x.startsWith("## FAQ"));
  for (const sec of sections) {
    const first = sec.split("\n\n")[1];
    assert.ok(words(first) >= 40 && words(first) <= 60, `${sec.split("\n")[0]}: opening answer is ${words(first)} words`);
  }
  assert.ok(post!.content.includes("A marketing mix model (MMM)"), "MMM must be spelled out on first use");
  for (const href of [
    "https://github.com/pymc-labs/pymc-marketing/pull/3338",
    "https://github.com/mharnett/paid-media-agent-guardrails/blob/main/rules/PMG-016-split-brand-search-in-mmm.md",
    "https://github.com/mharnett/paid-media-agent-guardrails",
  ]) {
    assert.ok(post!.content.includes(`](${href})`), `missing link ${href}`);
  }
  // Mark's voice: no em dashes. The page has no code-block renderer, so no indented blocks either.
  assert.equal((post!.content.match(/—/g) || []).length, 0);
  assert.equal(post!.content.split("\n\n").filter((b) => b.startsWith("    ")).length, 0);
});
