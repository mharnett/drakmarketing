import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { blogPostMetadata, blogPostingJsonLd, extractFaqs, faqPageJsonLd } from "./blog-seo.ts";
import type { BlogPost } from "./blog-posts.ts";

const post: BlogPost = {
  slug: "a-post",
  title: "A Post",
  date: "2026-11-16",
  author: "Mark Harnett",
  excerpt: "An excerpt.",
  content: "Intro.\n\n## FAQ\n\n### What is it?\n\nIt is a thing.\n\nIt has two paragraphs.\n\n### Why?\n\nBecause.\n\n## After\n\nNot part of the FAQ.",
};

test("blogPostingJsonLd is a BlogPosting with a Person author and dates", () => {
  const ld = blogPostingJsonLd(post);
  assert.equal(ld["@type"], "BlogPosting");
  assert.equal(ld.headline, "A Post");
  assert.equal(ld.datePublished, "2026-11-16");
  assert.equal(ld.dateModified, "2026-11-16");
  assert.equal(ld.author["@type"], "Person");
  assert.equal(ld.author.name, "Mark Harnett");
  assert.ok(ld.author.sameAs.some((u: string) => u.includes("linkedin.com")));
  assert.ok(ld.author.sameAs.some((u: string) => u.includes("github.com/mharnett")));
  assert.equal(ld.mainEntityOfPage, "https://drakmarketing.com/blog/a-post");
});

test("blogPostMetadata sets canonical and article Open Graph", () => {
  const md = blogPostMetadata(post);
  assert.equal(md.alternates?.canonical, "/blog/a-post");
  const og = md.openGraph as { type: string; publishedTime: string; authors: string[]; url: string };
  assert.equal(og.type, "article");
  assert.equal(og.publishedTime, "2026-11-16");
  assert.deepEqual(og.authors, ["Mark Harnett"]);
  assert.equal(og.url, "/blog/a-post");
  assert.equal(md.title, "A Post");
  assert.equal(md.description, "An excerpt.");
});

test("extractFaqs reads ### questions under ## FAQ and stops at the next ## heading", () => {
  assert.deepEqual(extractFaqs(post.content), [
    { question: "What is it?", answer: "It is a thing. It has two paragraphs." },
    { question: "Why?", answer: "Because." },
  ]);
});

test("extractFaqs returns nothing when there is no FAQ section or ### outside it", () => {
  assert.deepEqual(extractFaqs("Intro.\n\n## Other\n\n### Not a question\n\nText."), []);
  assert.deepEqual(extractFaqs("## FAQ\n\nNo questions here."), []);
});

test("faqPageJsonLd is FAQPage with Question/Answer pairs, and null when empty", () => {
  const ld = faqPageJsonLd(extractFaqs(post.content));
  assert.ok(ld);
  assert.equal(ld["@type"], "FAQPage");
  assert.equal(ld.mainEntity.length, 2);
  assert.equal(ld.mainEntity[0]["@type"], "Question");
  assert.equal(ld.mainEntity[0].name, "What is it?");
  assert.equal(ld.mainEntity[0].acceptedAnswer["@type"], "Answer");
  assert.equal(ld.mainEntity[0].acceptedAnswer.text, "It is a thing. It has two paragraphs.");
  assert.equal(faqPageJsonLd([]), null);
});

test("llms.txt has a Blog section pointing at the blog index", () => {
  const txt = readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");
  assert.match(txt, /^## Blog$/m);
  assert.match(txt, /https:\/\/drakmarketing\.com\/blog\b/);
});
