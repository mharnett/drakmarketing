import { test } from "node:test";
import assert from "node:assert/strict";
import { tools, totalToolCount } from "./tools-data.ts";

const bySlug = (slug: string) => {
  const t = tools.find((x) => x.slug === slug);
  assert.ok(t, `expected a tool with slug "${slug}"`);
  return t!;
};

// Counted from each repo's src/tools.ts on 2026-10-30 (mcp-google-ads 1.12.0,
// mcp-linkedin-ads 1.1.4, mcp-bing-ads 1.3.1).
test("Google, LinkedIn and Bing tool counts match the published servers", () => {
  assert.equal(bySlug("google-ads").toolCount, 77);
  assert.equal(bySlug("linkedin-ads").toolCount, 7);
  assert.equal(bySlug("bing-ads").toolCount, 13);
});

test("no copy still carries the old overstated counts", () => {
  for (const slug of ["google-ads", "linkedin-ads", "bing-ads"]) {
    const t = bySlug(slug);
    const copy = [t.description, t.longDescription, ...t.features].join(" ");
    assert.doesNotMatch(copy, /\b(35|65\+|30\+) tools\b/, `${slug} copy`);
  }
});

test("the suite is not double-counted in the total", () => {
  const servers = tools.filter((t) => t.slug !== "marketing-suite");
  const sum = servers.reduce((s, t) => s + t.toolCount, 0);
  assert.equal(totalToolCount, sum);
  assert.equal(bySlug("marketing-suite").toolCount, sum);
});

test("pages and llms.txt carry no stale hardcoded tool counts", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = ["src/app/layout.tsx", "src/app/about/page.tsx", "src/app/page.tsx", "public/llms.txt"];
  for (const f of files) {
    const text = await readFile(new URL(`../../${f}`, import.meta.url), "utf8");
    assert.doesNotMatch(text, /\b124\+? tools\b|\b35 tools available\b|\((35|65\+|30\+) tools\)/, f);
  }
});
