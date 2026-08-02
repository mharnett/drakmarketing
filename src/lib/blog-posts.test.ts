import { test } from "node:test";
import assert from "node:assert/strict";
import { blogPosts } from "./blog-posts.ts";

const SLUG = "meta-incrementality-two-mcps";

const EXPECTED_EXCERPT =
  "Meta's default attribution credits conversions that would have happened anyway. Meta's API exposes an incrementality number almost nobody reports — and now AI assistants can pull it automatically.";

// Verbatim markdown from blog-post-incrementality-mcp.md lines 15-58 (source of truth for this post).
const EXPECTED_CONTENT =
  "Meta recently released an official MCP server — the connector that lets AI assistants like Claude or ChatGPT work directly inside your ad account. It's good, and if you manage Meta ads with AI you should connect it. I also built my own Meta MCP, and I still run both. This post explains why, and the answer is really about one word: incrementality.\n\n## The number in your report\n\nOpen any Meta ads report and the conversion number you see is attributed on a 7-day-click + 1-day-view window. That means Meta takes credit for a purchase if the buyer clicked an ad in the last 7 days — or merely *saw* one in the last day.\n\nThink about who's inside that number:\n\n- People who searched for your brand, clicked whatever was in front of them, and were going to buy regardless.\n- Retargeted shoppers who were already mid-checkout when the ad \"reached\" them.\n- Anyone who scrolled past an impression yesterday and converted today for unrelated reasons.\n\nNone of those conversions were *caused* by the ad. All of them are in the reported number. That's not fraud — it's just what attribution is: credit assignment, not causation.\n\n## The number Meta doesn't lead with\n\nHere's the part most advertisers don't know: Meta's own API exposes an `incrementality` attribution breakdown — Meta's modeled estimate of conversions that would **not** have happened without the ad. It comes out of the same measurement science behind their Conversion Lift program, and it's sitting in the same insights endpoint as the default number.\n\nAlmost nobody reports it. The incentives are obvious: the default number is bigger, and bigger numbers make everyone at the table feel better. Agencies get to report more conversions, Meta gets more budget, and the gap between \"attributed\" and \"caused\" quietly compounds in your planning.\n\n## What I built\n\nI published an open-source MCP server — [mcp-meta-ads-incrementality](https://github.com/mharnett/mcp-meta-ads-incrementality) — that flips the default. When an AI assistant pulls Meta performance through it, the incrementality window leads. Ask for the standard windows in the same call and it computes the gap on every row:\n\n- **inflation_factor** — reported conversions ÷ incremental conversions\n- **overstatement_pct** — the share of the reported number the ads didn't cause\n\nSo instead of \"the campaign drove 100 conversions,\" the report reads: \"the campaign was credited with 100 conversions, of which roughly 40 were incremental — the reported number is 2.5× the causal one.\" Same API, same data, very different budget conversation.\n\nTwo honest caveats. Meta's incrementality window is a modeled estimate, not a per-campaign randomized holdout — when the dollars are big enough, a proper Conversion Lift study is still the gold standard. And brand campaigns will always look worse under incrementality than non-brand, which is exactly the point: capturing existing demand is cheap and mostly non-incremental.\n\n## Why run both MCPs\n\nMeta's official MCP and mine aren't competitors — they split cleanly along the line of *operate* vs. *evaluate*.\n\n**Meta's official MCP** is the better operator. First-party OAuth (no access tokens to babysit), product catalog management, pixel and CAPI signal diagnostics, campaign creation with everything landing paused by default, plus governance controls for what AI agents may touch. It's the right tool for building and running the account.\n\n**The incrementality MCP** is the evaluator. The official server reports the standard attributed number — the inflated one. Mine exists so that when the AI answers \"what's working?\", the causal number leads and the inflation is quantified next to it.\n\nRun the account with Meta's tools. Judge the account with incrementality. The one thing you shouldn't do is let the platform that sells you the ads also define, unchallenged, the number that decides how much you spend on them.\n\n## Try it on your own account\n\nThe server is MIT-licensed and on npm (`npm install -g mcp-meta-ads-incrementality`). If your reports have only ever shown the default number, pull one month both ways and look at the inflation factor. Whatever it says, you'll know something about your account that most advertisers never check — and you can decide which number deserves to drive next quarter's budget.";

test("meta-incrementality-two-mcps post exists with the correct metadata", () => {
  const post = blogPosts.find((p) => p.slug === SLUG);
  assert.ok(post, `expected a blog post with slug "${SLUG}"`);
  assert.equal(
    post!.title,
    "Your Meta Conversion Number Is Inflated. Here's How to See By How Much.",
  );
  assert.equal(post!.date, "2026-08-01");
  assert.equal(post!.author, "Mark Harnett");
});

test("meta-incrementality-two-mcps excerpt matches the source doc verbatim", () => {
  const post = blogPosts.find((p) => p.slug === SLUG);
  assert.ok(post);
  assert.equal(post!.excerpt, EXPECTED_EXCERPT);
});

test("meta-incrementality-two-mcps content matches the source markdown verbatim, including escaped backticks", () => {
  const post = blogPosts.find((p) => p.slug === SLUG);
  assert.ok(post);
  assert.equal(post!.content, EXPECTED_CONTENT);
  // Anchor: the two inline-code spans from the source must survive escaping intact,
  // not get truncated or turn into stray backslashes.
  assert.equal((post!.content.match(/`/g) || []).length, 4);
  assert.match(post!.content, /`incrementality`/);
  assert.match(post!.content, /`npm install -g mcp-meta-ads-incrementality`/);
});
