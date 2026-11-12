import { test } from "node:test";
import assert from "node:assert/strict";
import { tools, totalToolCount } from "./tools-data.ts";

const bySlug = (slug: string) => {
  const t = tools.find((x) => x.slug === slug);
  assert.ok(t, `expected a tool with slug "${slug}"`);
  return t!;
};

// Counted from each repo's src/tools.ts: Google on 2026-11-12 (main @ 34c6e2f);
// LinkedIn npm 1.2.0 on 2026-11-12; Bing (1.3.2) on 2026-10-30.
test("Google, LinkedIn and Bing tool counts match the published servers", () => {
  assert.equal(bySlug("google-ads").toolCount, 85);
  assert.equal(bySlug("linkedin-ads").toolCount, 11);
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

test("Meta incrementality page carries a comparison against Meta's official MCP", () => {
  const c = bySlug("meta-ads-incrementality").comparison;
  assert.ok(c, "expected a comparison on meta-ads-incrementality");
  assert.deepEqual(c!.columns, ["Meta's official Ads MCP", "Meta Ads Incrementality MCP"]);
  assert.deepEqual(
    c!.rows.map((r) => r.label),
    [
      "Default conversion number",
      "Incrementality",
      "Inflation math",
      "Cost per acquisition (CPA)",
      "Experiments",
      "Building and editing",
      "Write safety",
      "Catalog, signals and research",
      "Sign-in",
      "Best for",
    ],
  );
  for (const r of c!.rows) {
    assert.ok(r.official.trim() && r.ours.trim(), `row "${r.label}" has both cells`);
  }
  assert.match(c!.footnote ?? "", /November 2026/);
});

test("Google, Microsoft and LinkedIn pages carry comparisons against the platform's own offering", () => {
  const expected: Record<string, string> = {
    "google-ads": "Google's official Google Ads MCP",
    "bing-ads": "Microsoft's official Advertising MCP",
    "linkedin-ads": "LinkedIn Marketing API (no official MCP)",
  };
  for (const [slug, first] of Object.entries(expected)) {
    const c = bySlug(slug).comparison;
    assert.ok(c, `expected a comparison on ${slug}`);
    assert.equal(c!.columns[0], first, `${slug} first column`);
    assert.equal(c!.columns[1], bySlug(slug).name, `${slug} second column is the tool's own name`);
    assert.ok(c!.rows.length >= 8, `${slug} has at least 8 rows`);
    assert.match(c!.footnote ?? "", /November 2026/, `${slug} footnote is dated`);
  }
});

test("every comparison row has two short, filled cells", () => {
  for (const t of tools.filter((x) => x.comparison)) {
    for (const r of t.comparison!.rows) {
      for (const cell of [r.official, r.ours]) {
        assert.ok(cell.trim(), `${t.slug} / ${r.label} has an empty cell`);
        assert.ok(cell.length <= 120, `${t.slug} / ${r.label} cell is over 120 chars`);
      }
    }
  }
});

test("only the four ad-platform pages carry a comparison", () => {
  const withComparison = tools.filter((t) => t.comparison).map((t) => t.slug).sort();
  assert.deepEqual(withComparison, ["bing-ads", "google-ads", "linkedin-ads", "meta-ads-incrementality"]);
});

test("llms.txt per-server counts match tools-data", async () => {
  const { readFile } = await import("node:fs/promises");
  const text = await readFile(new URL("../../public/llms.txt", import.meta.url), "utf8");
  for (const t of tools.filter((x) => x.npmPackage)) {
    const m = text.match(new RegExp(`\\*\\*${t.package}\\*\\* \\((\\d+) tools\\)`));
    if (m) assert.equal(Number(m[1]), t.toolCount, `${t.package} in llms.txt`);
  }
});

test("llms.txt headline total matches the summed tool count", async () => {
  const { readFile } = await import("node:fs/promises");
  const text = await readFile(new URL("../../public/llms.txt", import.meta.url), "utf8");
  const m = text.match(/MCP servers with (\d+)\+? tools/);
  assert.ok(m, "llms.txt headline total not found");
  assert.equal(Number(m![1]), totalToolCount);
});

test("LinkedIn copy reflects 1.2.0's guarded lookalike writes", () => {
  const t = bySlug("linkedin-ads");
  const copy = [t.description, t.longDescription, ...t.features, ...t.comparison!.rows.map((r) => r.ours)].join(" ");
  assert.doesNotMatch(copy, /\b7 (read-only )?tools\b|never changes (anything in )?Campaign Manager/);
  assert.match(copy, /lookalike/i);
});
