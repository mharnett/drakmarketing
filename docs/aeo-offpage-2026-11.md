# AEO off-page plan (2026-11)

Answer engine optimization (AEO) means getting cited in AI answers. Pepper (pepper.inc) puts about 84% of AI citations on third-party sources, so the on-page work in [blog-aeo-guide.md](blog-aeo-guide.md) caps out. This page is the off-page half. It covers Wikidata entries, a LinkedIn article, third-party listings and a fixed prompt set for tracking citations by hand.

Nothing here has been submitted, created or queried. Every step needs Mark's own accounts.

## 1. Wikidata entries

### Before submitting

- Wikidata keeps an item when serious, public references can describe it. The site is self-published, so give each item at least one third-party reference, or expect a deletion request. For Mark, use the merged fixes in other people's repos (below). For Drak Marketing, use a directory listing from section 3 once one is live.
- Create Mark's item first, then Drak Marketing, then link the two with "founded by" and "employer".
- The property and item ids below come from memory, not a lookup. Confirm each one in the Wikidata search box while entering it.
- Only facts already public on drakmarketing.com are listed. Inception date, headquarters and country aren't on the site. Add them only if Mark wants them public.

### Mark Harnett

- **Label (en):** Mark Harnett
- **Description (en):** paid media marketer and principal of Drak Marketing

| Property | Value | Reference URL |
|---|---|---|
| instance of (P31) | human (Q5) | https://drakmarketing.com/about |
| occupation (P106) | marketer (pick the item in the search box) | https://drakmarketing.com/about |
| employer (P108) | Drak Marketing (the new item) | https://drakmarketing.com/about |
| LinkedIn personal profile ID (P6634) | `harnett` | https://www.linkedin.com/in/harnett/ |
| GitHub username (P2037) | `mharnett` | https://github.com/mharnett |
| described at URL (P973) | https://drakmarketing.com/about | |

Third-party references that already credit Mark's work, for the occupation statement:
- https://github.com/googleads/google-ads-mcp/pull/146
- https://github.com/pymc-labs/pymc-marketing/pull/3338

sameAs links that exist publicly today: https://www.linkedin.com/in/harnett/ and https://github.com/mharnett.

### Drak Marketing

- **Label (en):** Drak Marketing
- **Description (en):** marketing consultancy that builds open-source AI marketing tools

| Property | Value | Reference URL |
|---|---|---|
| instance of (P31) | business (Q4830453) | https://drakmarketing.com/about |
| industry (P452) | digital marketing (pick the item in the search box) | https://drakmarketing.com/about |
| official website (P856) | https://drakmarketing.com | |
| founded by (P112) | Mark Harnett (the new item) | https://drakmarketing.com/about |
| LinkedIn company or organization ID (P4264) | only once a company page exists | |

sameAs links that exist publicly today: https://drakmarketing.com. The GitHub account and LinkedIn profile are Mark's, so they go on his item, not this one.

### After both items exist

Add the two Wikidata URLs to `sameAs` in the site's JSON-LD: the Person in `src/lib/blog-seo.ts` and the Organization in `src/app/layout.tsx`. The Organization's `sameAs` lists Mark's personal GitHub and LinkedIn today. Those belong on the Person, so swap them for the Wikidata URL and a company LinkedIn page if there is one.

## 2. LinkedIn article outline

Mark writes this from his own account. It's a shorter version of [the split-brand-search post](https://drakmarketing.com/blog/split-brand-search-in-mmm), the post the Pepper review was about. The post stays canonical (guide rule 6), so the article links to it and doesn't paste it in. It uses the post's numbers and no new ones.

**Working title:** Should brand search be its own channel in a marketing mix model?

1. **The answer, in the first two lines.** Brand and non-brand search belong in separate channels. Brand spend mostly follows demand that other media created.
2. **The one-account reading.** Brand spend was cut about 40% twice and brand leads stayed flat: 168 to 166 a month. It's a before-and-after read, not a controlled test.
3. **What one blended channel does.** The model gives search credit for demand TV created, and the optimizer moves budget into brand clicks you'd get anyway.
4. **The fix.** Tag each campaign as brand or non-brand before the data goes in. Give the model two channels, or leave brand out of the media inputs.
5. **Where it's fixed now.** The PyMC-Marketing docs split the two. Link the post for the full version and the PR.
6. **Close on an offer.** "If you maintain a marketing tool and want a second pair of eyes on the paid media logic, happy to look." No recap.

Voice: short lines, a casual hedge where it's honest, no em dashes, no triads, no bolded maxims. Publish once the post is live.

## 3. Third-party and review sites worth a listing

In rough order of effort.

- **Partner directories.** These are already earned, since the site shows both badges. Check that the Google Partners and Meta Business Partners directory listings are public and link to drakmarketing.com.
- **LinkedIn company page.** Create one if none exists. Its URL feeds the Organization `sameAs` and Wikidata P4264.
- **MCP (Model Context Protocol) server directories, for the open-source tools.** The official MCP Registry, Smithery, Glama, PulseMCP, mcp.so and the awesome-mcp-servers list on GitHub. Check which tools are listed already. Each listing should link to the repo and to the tool's page on drakmarketing.com.
- **Crunchbase company profile.** It's free, and AI engines read it for company facts.
- **Clutch.** It's the main B2B agency review site. The listing only helps once it has reviews, so it needs a few clients willing to review. UpCity, GoodFirms and DesignRush can come later.
- **Existing mentions.** Google's google-ads-mcp, PyMC-Marketing, adloop and Corey Haines' marketingskills have all merged Mark's fixes. Where a project keeps a contributors or acknowledgments page, a link back to drakmarketing.com is worth asking for.
- **Trade press.** A contributed article or podcast spot on a paid search outlet such as Search Engine Land, written from one of the posts.

## 4. Citation tracking: 25 fixed prompts

### Rules

- **The set is fixed.** Never edit a prompt once tracking starts. To change one, retire its number and add a new one at the end, so each month compares like with like.
- **Engines:** ChatGPT, Perplexity, Claude and Google AI Overviews, the four the guide names.
- **Cadence:** monthly, in the first week. Use a logged-out or private session with memory and personalization off, so Mark's own history doesn't steer the answer.
- **One run per prompt per engine.** Answers vary from run to run, so judge the trend over at least three monthly runs, never one month.

### Scoring, by hand

For each prompt on each engine:

| Score | When |
|---|---|
| 3 | The answer cites or links a drakmarketing.com page. |
| 2 | It names Drak Marketing or Mark Harnett, or cites one of the GitHub repos or npm packages, without a drakmarketing.com link. |
| 1 | It gives the answer the post gives, but credits someone else or no one. |
| 0 | None of the above. |

Log one row per prompt per engine with these columns: date, engine, prompt number, score, cited URLs, and the source cited instead. The "cited instead" column is where the next third-party targets come from. Each month, report the share of prompts scoring 2 or more on each engine.

### The prompts

Brand search and marketing mix models:
1. Should I separate brand and non-brand search in a marketing mix model?
2. Does brand search spend actually drive sales?
3. Is branded paid search incremental?
4. How should I set up search channels in PyMC-Marketing?

Reporting on paused and removed campaigns:
5. Why doesn't my Google Ads report match my billing?
6. Should I filter Google Ads performance reports to enabled campaigns only?
7. How do I include removed campaigns in a Google Ads spend report?

Weekly ad performance:
8. How much does CPA normally change week to week?
9. What should I compare this week's ad performance to before making changes?
10. How do I stop an AI agent from overreacting to one week of ad data?

Meta measurement:
11. Are Meta ads conversions inflated?
12. What is Meta's incrementality attribution setting?
13. How do I measure how much Meta overstates conversions?
14. Is there an MCP server that reports Meta incrementality?

Tasks for AI agents:
15. How do I write tasks AI agents can't get wrong?
16. What should a Definition of Done for an AI agent task include?

MCP tools and AI in paid media:
17. What is the best MCP server for Google Ads?
18. Is there an MCP server for LinkedIn Ads?
19. Is there an MCP server for Microsoft Advertising?
20. How do I connect Claude to my Google Ads account?
21. What open-source MCP servers are there for marketing?
22. How do I stop an AI agent from making mistakes in my Google Ads account?
23. How do I find competitors using my trademark in their Google ads?

The entities:
24. Who is Mark Harnett?
25. What is Drak Marketing?

Prompts 24 and 25 test whether the engines know the entities at all. They're probably the first place a Wikidata entry would show up.
