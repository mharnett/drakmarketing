import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { parseImageBlock, renderInlineMarkdown } from "./blog-markdown.ts";
import { blogPosts } from "./blog-posts.ts";

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
