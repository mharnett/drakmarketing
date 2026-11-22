# Blog AEO guide

Answer engine optimization (AEO) means getting a post cited in AI answers: ChatGPT, Perplexity, Claude and Google AI Overviews.

Read this before drafting or editing a post in `src/lib/blog-posts.ts`, and review against it before merging. It holds the rules a test can't check. The ones a test can check live in code, and the code wins if this page and the code disagree.

## What the tests already enforce

- **`src/lib/blog-aeo-lint.test.ts`**, for every post dated 2026-11-16 or later: a `**Short answer:**` lead, a `**Key takeaways**` block of five bullets, question headings that each open with a 40 to 60 word answer, a 3 to 5 entry FAQ with 35 to 50 word answers, no em dashes and no client names. Exact bounds are in the file.
- **Per-post tests** for the three older posts the lint skips, all in `src/lib/`: `blog-posts-one-week.test.ts`, `blog-posts-oop.test.ts` and `blog-posts.test.ts` (the Meta incrementality post).

## Judgment rules

1. **One first-party data point per post.** Give it something a model can't reconstruct from other pages. That can be a number from an account Mark manages, a before-and-after read or a count of merged fixes. Anonymize it ("one B2B software account I manage"), with no client name, id or spend that points to the client. Say what kind of evidence it is in the same sentence: "a before-and-after read, not a controlled test". A made-up example is labeled hypothetical, like the one-week chart. Never invent a number to fill the slot. If there isn't a real one, ask Mark in the PR.
2. **Define each entity once.** Spell out an acronym on first use ("marketing mix model (MMM)"). Say what a tool, library or person is the first time it appears. After that, use one name for it everywhere, including on the tools pages. Don't alternate between "MMM", "media mix model" and "the model".
3. **Claim and evidence in one block.** Engines lift one paragraph at a time, so keep the number, where it came from and its caveat together. "Cutting brand spend about 40% twice left brand leads flat: 168 to 166 a month" works. The claim in the takeaways with the numbers three sections down doesn't.
4. **FAQ only for real reader questions.** Use questions a reader would actually type, taken from real wording such as sales calls, Search Console queries or comments. Skip anything the body already answers, and keep insider terms out of the question (rule ids, notebook names). The lint wants at least three. If you can't find three real ones, raise it with Mark. Don't pad.
5. **No cosmetic date changes.** `date` is the publish date. Don't move it to make a post look fresh. A substantive revision (new data, a corrected claim, a changed recommendation) earns a modified date: set `updated` on the post (YYYY-MM-DD) and leave `date` alone. `updated` drives the BlogPosting `dateModified` and the sitemap `lastmod`.
6. **The post is canonical, GitHub is the evidence.** The full explanation lives on drakmarketing.com, which sets its own canonical URL. The PR and the guardrail rule file on GitHub are linked from the post as proof. Keep the rule file short and link back to the post. Don't paste the post into a README.
7. **Write it as Mark.** Short lines, concrete numbers, a casual hedge where it's honest. No triads, no bolded one-line maxims, no "it's not X, it's Y" pivots and no summarizing closer. A post ends on the last useful line or an offer.

## Where this site diverges from Pepper

Pepper (pepper.inc) is an AEO agency, so its advice also sells its services. These notes come from three of its posts, read 2026-11-13: [page structure and FAQs](https://www.pepper.inc/blog/answer-engine-optimization-page-structure-h1-faq-strategy/), [how to get cited in LLMs](https://pepper.inc/blog/how-to-get-cited-in-llms) and [the AEO guide](https://www.pepper.inc/blog/answer-engine-optimization/).

Followed: question headings, a 40 to 60 word answer under each heading, a bold lead with five key takeaways, an FAQ only for genuine follow-ups with 35 to 50 word answers, claim and evidence in one block, original data, and no fake freshness.

Diverges:

- **Paragraph length.** Pepper's LLM-citation post asks for 40 to 80 word paragraphs. Here only the section openers are long. Everything else stays in Mark's short lines, because the openers already give an engine a full answer to lift.
- **Opening answer length.** Pepper's posts disagree: 15 to 25 words in one, 40 to 60 in another. The lint uses 40 to 60 under headings and puts no word count on the short answer.
- **FAQPage schema.** One Pepper post says to add FAQPage now. Another says it doesn't drive citation. The site emits FAQPage only when a post has a real FAQ section and doesn't count on it for citations.
- **Refresh cadence.** Pepper suggests refreshing best-of pages every 2 to 4 weeks and evergreen guides quarterly. Most posts here are write-ups of one merged fix, so they change only when the facts do (rule 5).
- **llms.txt.** Pepper calls it unproven, and one post lists it as a myth. The site keeps `public/llms.txt` because it costs nothing if no engine reads it.

Pepper puts about 84% of AI citations on third-party sources, so on-page work caps out. Off-page work (a Wikidata entry, LinkedIn articles from Mark's own account, third-party mentions, citation tracking on a fixed set of 20 to 30 prompts) is on Mark's backlog and needs him for the accounts and the writing.
