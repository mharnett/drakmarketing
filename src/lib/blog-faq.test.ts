// FAQ blocks on blog posts. A post's FAQ is a `## FAQ` section of `### Question` headings,
// each followed by answer paragraphs. The page shows it as headings and paragraphs and
// emits the same entries as FAQPage JSON-LD. These tests check that both halves agree,
// and that the FAQs on the three posts rewritten for AEO only restate their own post.
import { test } from "node:test";
import assert from "node:assert/strict";
import { type PostBlock, parsePostBlocks, renderInlineMarkdown } from "./blog-markdown.ts";
import { type BlogPost, blogPosts } from "./blog-posts.ts";
import { postJsonLd } from "./blog-seo.ts";

interface FaqEntry {
  question: string;
  answer: string;
}

/** The FAQ as the page shows it: each h3 after the "FAQ" h2, with the paragraphs under it, up to the next h2. */
function shownFaq(blocks: PostBlock[]): FaqEntry[] {
  const out: FaqEntry[] = [];
  let inFaq = false;
  let current: { question: string; parts: string[] } | null = null;
  const flush = () => {
    if (current) out.push({ question: current.question, answer: current.parts.join(" ") });
    current = null;
  };
  for (const b of blocks) {
    if (b.kind === "h2") {
      flush();
      inFaq = b.text.trim().toLowerCase() === "faq";
    } else if (inFaq && b.kind === "h3") {
      flush();
      current = { question: b.text, parts: [] };
    } else if (inFaq && current && b.kind === "paragraph") {
      current.parts.push(b.html);
    }
  }
  flush();
  return out;
}

/** The FAQPage entries the post page emits as JSON-LD, or [] when it emits no FAQPage. */
function emittedFaq(post: BlogPost): FaqEntry[] {
  for (const ld of postJsonLd(post)) {
    if (ld["@type"] === "FAQPage" && "mainEntity" in ld) {
      return ld.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }));
    }
  }
  return [];
}

const fixture = (content: string): BlogPost => ({
  slug: "a-post",
  title: "A Post",
  date: "2026-11-16",
  author: "Mark Harnett",
  excerpt: "An excerpt.",
  content,
});

// ---- The renderer: what each block becomes on the page. ----

test("parsePostBlocks gives each block the kind the page renders it as", () => {
  const content = [
    "**Short answer:** Yes.",
    "**Key takeaways**",
    "- one **bold**\n- two",
    "![A chart](/images/blog/x.svg)",
    "![A clip](/images/blog/x.mp4)",
    "## A heading",
    "### A question?",
    "*An aside.*",
    "A [link](/tools) and *this*.",
  ].join("\n\n");
  assert.deepEqual(parsePostBlocks(content), [
    { kind: "paragraph", html: "<strong>Short answer:</strong> Yes." },
    { kind: "strong", text: "Key takeaways" },
    { kind: "list", items: ["one <strong>bold</strong>", "two"] },
    { kind: "image", src: "/images/blog/x.svg", alt: "A chart" },
    { kind: "video", src: "/images/blog/x.mp4", poster: "/images/blog/x-poster.png", alt: "A clip" },
    { kind: "h2", text: "A heading" },
    { kind: "h3", text: "A question?" },
    { kind: "italic", text: "An aside." },
    { kind: "paragraph", html: renderInlineMarkdown("A [link](/tools) and *this*.") },
  ]);
});

test("a post with an FAQ section shows each question and answer, and emits the same ones as FAQPage", () => {
  const post = fixture(
    "Intro.\n\n## FAQ\n\n### What is it?\n\nIt is a thing.\n\nIt has two paragraphs.\n\n### Why?\n\nBecause.\n\n## After\n\nNot part of the FAQ.",
  );
  const expected = [
    { question: "What is it?", answer: "It is a thing. It has two paragraphs." },
    { question: "Why?", answer: "Because." },
  ];
  assert.deepEqual(shownFaq(parsePostBlocks(post.content)), expected);
  assert.deepEqual(emittedFaq(post), expected);
  const types = postJsonLd(post).map((ld) => ld["@type"]);
  assert.deepEqual(types, ["BlogPosting", "FAQPage"]);
});

test("a post without an FAQ section emits BlogPosting only", () => {
  const post = fixture("Intro.\n\n## Other\n\n### Not a question\n\nText.");
  assert.deepEqual(postJsonLd(post).map((ld) => ld["@type"]), ["BlogPosting"]);
  assert.deepEqual(shownFaq(parsePostBlocks(post.content)), []);
});

// ---- The FAQs on the three posts drakmarketing#23 rewrote. ----

const FAQ_POSTS = ["dont-decide-from-one-week", "object-oriented-task-management", "meta-incrementality-two-mcps"];

function post(slug: string): BlogPost {
  const p = blogPosts.find((x) => x.slug === slug);
  assert.ok(p, `expected a blog post with slug "${slug}"`);
  return p!;
}

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** The post above its FAQ section: what an FAQ answer may restate. */
function bodyAboveFaq(p: BlogPost): string {
  const i = p.content.indexOf("\n\n## FAQ\n\n");
  assert.ok(i > 0, `${p.slug} has no "## FAQ" section`);
  return p.content.slice(0, i);
}

/** Numbers as written: "20-30%" gives 20 and 30%, "2.5×" gives 2.5, and "B2B" gives none. */
const numbersIn = (text: string) => text.match(/(?<![\p{L}\d.])\d+(?:\.\d+)?%?(?![\p{L}\d])/gu) ?? [];

for (const slug of FAQ_POSTS) {
  test(`${slug} ends with a 3-question FAQ that the page shows and emits as FAQPage`, () => {
    const p = post(slug);
    const blocks = parsePostBlocks(p.content);
    const h2s = blocks.filter((b) => b.kind === "h2").map((b) => (b as { text: string }).text);
    assert.equal(h2s.at(-1), "FAQ", "the FAQ is the last section");

    const faqs = emittedFaq(p);
    assert.equal(faqs.length, 3, "a 3-question FAQ");
    assert.deepEqual(shownFaq(blocks), faqs, "the page shows exactly what the FAQPage JSON-LD says");

    const bodyHeadings = h2s.slice(0, -1).map((h) => h.toLowerCase());
    for (const f of faqs) {
      assert.ok(f.question.endsWith("?"), `"${f.question}" must be a question`);
      assert.ok(!/PMG-/.test(f.question), `insider term in "${f.question}"`);
      assert.ok(!bodyHeadings.includes(f.question.toLowerCase()), `"${f.question}" repeats a heading`);
      const n = wordCount(f.answer);
      assert.ok(n >= 35 && n <= 50, `"${f.question}" answer is ${n} words; it needs 35-50`);
      // Plain text, so the JSON-LD answer reads exactly like the paragraph on the page.
      assert.equal(renderInlineMarkdown(f.answer), f.answer, `"${f.question}" answer has inline markdown`);
      assert.ok(!f.answer.includes("`"), `"${f.question}" answer has a code span`);
    }
  });

  test(`${slug} FAQ states no number the post above it doesn't`, () => {
    const p = post(slug);
    const body = bodyAboveFaq(p);
    const faqs = emittedFaq(p);
    assert.ok(faqs.length > 0, "no FAQ to check");
    for (const f of faqs) {
      for (const n of numbersIn(`${f.question} ${f.answer}`)) {
        const escaped = n.replace(/\./g, "\\.");
        assert.ok(
          new RegExp(`(?<![\\p{L}\\d.])${escaped}(?![\\p{L}\\d])`, "u").test(body),
          `"${f.question}" says ${n}; the post above the FAQ never does`,
        );
      }
    }
  });
}

test("numbersIn reads numbers as the post writes them", () => {
  assert.deepEqual(numbersIn("CPA moves 20-30% in B2B, 2.5× over 8 weeks, 7-day-click"), ["20", "30%", "2.5", "8", "7"]);
});
