import { test } from "node:test";
import assert from "node:assert/strict";
import { blogPosts } from "./blog-posts.ts";

const SLUG = "object-oriented-task-management";
const MCKINSEY_URL =
  "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/state-of-ai-trust-in-2026-shifting-to-the-agentic-era";

const EXPECTED_EXCERPT =
  "My AI agents kept going off the rails. The fix wasn't a smarter agent. It was something I learned in a 90s programming class.";

// Verbatim from bus-dev/scratch/blog-object-oriented-task-management-draft.md (v2, 2026-09-29).
const EXPECTED_CONTENT =
  "Back in the 90s we all learned object oriented programming. The big idea: before you build anything, define what goes in and what comes out. I didn't think about it for 25 years. Then I started handing real work to AI agents.\n\nI kept having to correct them. I'd write \"clean up the AI compliance keywords\" and come back to find the agent had done something. Something reasonable, even. Just not what I wanted. Every imprecise task went off the rails.\n\nSo naturally I blamed the agent, and built a classifier to guess what my tasks meant. It got about 40% of 117 wrong. It read \"build a write layer for the ads API\" as a request to go edit an ad account. Which, to be fair, is kind of what the words said.\n\nThat's when it clicked. The agent wasn't the problem. My tasks were. A person can walk over and ask what you meant. An agent just guesses, and an agent guessing inside a live ad account makes for a very interesting Monday. At one point my system logged a step as done 34 times. Nothing had changed once.\n\n[McKinsey's latest AI trust survey](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/state-of-ai-trust-in-2026-shifting-to-the-agentic-era) says the risk with agents is no longer AI saying the wrong thing, but doing it. Only about 30% of companies are any good at governing that. I'm pretty sure I was in the other 70%.\n\nSo I went back to the 90s. Every task now needs a Definition of Done (the outputs, specific and checkable), a read-only Verification check, and no unanswered Open Questions (the inputs) before an agent touches it:\n\n    Done: keywords [list] ENABLED in ad group \"AI Compliance\", URL /ai-compliance\n    Check: query those keywords\n    Pass: all present, ENABLED, right URL\n\nNot exciting. That's the point. \"Done\" stops being the agent's opinion and becomes a query result.\n\nIt doesn't fix everything. I still have a pile of well defined tasks waiting on me to approve something. But now it's painfully obvious which blockers are me.\n\nIf you're handing work to agents, write the Definition of Done first. Happy to share my template.";

test("object-oriented-task-management post exists with the correct metadata", () => {
  const post = blogPosts.find((p) => p.slug === SLUG);
  assert.ok(post, `expected a blog post with slug "${SLUG}"`);
  assert.equal(post!.title, "I Learned This in the 90s. It Turns Out It's an AI Skill.");
  assert.equal(post!.date, "2026-09-29");
  assert.equal(post!.author, "Mark Harnett");
  assert.equal(post!.excerpt, EXPECTED_EXCERPT);
});

test("object-oriented-task-management content matches the draft verbatim", () => {
  const post = blogPosts.find((p) => p.slug === SLUG);
  assert.ok(post);
  assert.equal(post!.content, EXPECTED_CONTENT);
  // Anchors: the McKinsey source is a real markdown link, and the post stays in Mark's voice (no em dashes).
  assert.ok(post!.content.includes(`](${MCKINSEY_URL})`));
  assert.equal((post!.content.match(/\u2014/g) || []).length, 0);
});
