---
name: trademark-serp-watch
description: When the user wants to find competitors misusing their brand/trademark in search-engine ad copy and prepare Google Ads trademark complaints. Use when the user mentions "trademark infringement," "competitor using our brand," "trademark in ad copy," "takedown notice," "trademark complaint," "someone bidding on our brand and using our name," "assess SERPs for trademark misuse," "brand protection in ads," or names a competitor running ads with their trademark. Given a brand name it looks up the USPTO registration, samples live SERPs, detects the mark in ad copy, classifies each landing page against Google's trademark policy, and assembles a reviewed draft complaint package. It NEVER auto-submits the complaint.
metadata:
  version: 1.0.0
---

# Trademark SERP Watch

Find competitors using a brand's trademark **in ad copy** on search results, and
prepare a Google Ads trademark complaint package for a human to review and file.

## The one principle that governs everything

**A competitor's brand appearing in ad copy is NOT, by itself, infringement.**
Google lets anyone bid on a competitor's trademarked *keyword*, and it permits
the trademark in *ad text* for resellers, informational/review sites, partners,
and affiliates. Only **competitive** use — the mark used to divert the user to a
rival product — violates policy, and that turns on the **landing page**, not the
ad string. So: never treat a string match as a violation, and never auto-file.
See `references/google-tm-policy.md`.

## What you never do

- **Never auto-submit the Google complaint.** It is a good-faith-belief legal
  attestation filed under the trademark owner's identity, and Google requires a
  human at the owner to complete an authorization-verification email loop. This
  skill stops at a reviewed draft. (`build_draft_package` hard-codes
  `auto_submit=False`.)
- **Never auto-pick a trademark registration.** If zero or several live marks
  match, surface them and let the human choose.
- **Never report "clean" on a zero-ad capture.** Zero ads across all queries
  reads as capture failure, not absence of infringement.

## Inputs to gather

- Brand / trademark term (required).
- Owner legal name + owner domains (to exclude the owner's own ads).
- Any known example the user already saw (e.g. "Wild Apricot on 'neon one
  reviews'") — add it as an `--extra` query to seed capture.
- Geos (default: United States).
- A SERP provider API key (bring-your-own; see below).

## Pipeline (you run these steps)

1. **Trademark lookup.** Run
   `python scripts/run_watch.py uspto "<brand>" [--variant "<product>"] [--owner "<company>"]`.
   It opens **prefilled** trademark searches in the browser (Justia — indexes
   USPTO records and shows registration/serial numbers) plus the official
   tmsearch.uspto.gov link. (Official USPTO search is a stateful SPA and cannot
   be prefilled by URL, so Justia is the prefilled surface, USPTO is the verify
   surface.)
   - **`--owner` auto-prefill:** when the owner/company name is given, the tool
     parses the results and, **only on an EXACT owner-name match**, auto-selects
     that mark and prefills its registration number — then confirms
     registered/live status against USPTO TSDR. This is safe because it cannot
     select a same-named mark owned by a *different* company (e.g. a "NEON ONE"
     owned by International Data Group is skipped). Anything ambiguous (no match,
     or several) falls back to human selection.
   - Still confirm the **class** covers the goods/services, and that the mark
     term matches the term actually misused in the ads. `--no-open` prints the
     links without popping the browser.

2. **Capture live SERPs.**
   `python scripts/run_watch.py capture "<brand>" --owner-domain <owner.com> --out worklist.json`
   (add `--extra "<brand> discount"` etc. and `--geo`). This generates the
   brand-intent query set, pulls the ads serving now, and flags the ones with
   the mark in their copy (owner's own ads excluded). It records
   `capture_health`. **If `capture_health.status == "suspect_zero"`, stop and
   report a capture problem — do not conclude "no infringement."** Because ads
   are auction/geo/personalization-dependent, run 2-3 samples over time and/or
   extra geos before concluding anything; report findings as "observed in N of M
   samples," never as a guarantee.

3. **Classify each flagged landing page (your judgment).** For every flagged ad
   in `worklist.json`, open its `landing_url` and fill the five `LPSignals`
   booleans, plus `dki_suspected`. Use this rubric:

   | Signal | Set True when the landing page… |
   |---|---|
   | `advertiser_is_owner` | is the trademark owner's own site. |
   | `states_partner_affiliation` | states the advertiser is an authorized partner/reseller/affiliate of the brand. |
   | `sells_marked_product` | is primarily dedicated to **selling the marked product** and shows price/rate. |
   | `is_review_or_info_primary` | primarily provides neutral information/reviews **about the marked product**. |
   | `promotes_own_competing_product` | primarily pushes the advertiser's **own competing product**, using the brand to divert. |

   `dki_suspected`: True if the mark appears in the served ad but the advertiser's
   stored creative (check the Google Ads Transparency Center) shows different
   default text — i.e. it was inserted via dynamic keyword insertion for this
   query. When in genuine doubt about the landing page, leave the competing/legit
   signals such that it resolves to AMBIGUOUS (manual review) rather than forcing
   COMPETITIVE. Conservative beats a wrongful filing.

   Write the annotated worklist as the `finalize` input schema (see
   `run_watch.py` header): `{brand, owner, registration_numbers, needs_human_selection,
   complainant, geos, assessed:[{ad, match, signals, landing_url, dki_suspected}]}`.

4. **Finalize the draft.**
   `python scripts/run_watch.py finalize assessed.json --out draft.json`
   This runs `classify_use` → `select_candidates` → `build_draft_package` and
   writes `draft.json` + a human-readable `draft.md`. Only unambiguous
   COMPETITIVE uses become candidates.

5. **Hand to a human.** Present `draft.md`: the candidate ads, evidence
   (triggering term, screenshot, landing page + why), the registration to cite,
   and the pre-filled form fields (`references/complaint-form-fields.md`). The
   human reviews each candidate against the live page, then submits Google's form
   themselves. If no candidates survive, say so plainly — the value was the
   check, and permitted uses are not takedowns.

## SERP capture (hosted by default, no user key)

`resolve_fetch()` picks the capture path automatically:

- **Default — hosted proxy.** With no `SERPAPI_KEY` set, the skill calls the
  operator's hosted relay (`fetch_proxy` → `DEFAULT_PROXY_URL`, overridable via
  `SERPWATCH_PROXY_URL`). Users need no key or setup; the operator holds one key
  server-side and covers the cost (tip-funded). The relay rate-limits per IP and
  enforces a hard monthly cap — see `services/trademark-serp-proxy/`.
- **Power user — bring your own key.** If `SERPAPI_KEY` is set, the skill calls
  SerpAPI directly with that key (unthrottled, and costs the operator nothing).

To use a different/cheaper provider, add a `parse_<provider>_ads` returning
`list[CapturedAd]` and a `fetch` returning raw JSON — the pipeline is
provider-agnostic. The key is never shipped in the skill; the hosted default
keeps it server-side in the proxy.

## Files

- `scripts/detector.py` — mark-in-ad-copy matcher (exact/variant, own-brand, false-friends)
- `scripts/classifier.py` — landing-page signals → policy bucket → candidate (conservative)
- `scripts/uspto_lookup.py` — registration lookup + live-filter + never-auto-pick
- `scripts/serp_capture.py` — provider-agnostic capture + capture-health
- `scripts/pipeline.py` — query-set + capture→detect flagging
- `scripts/dossier.py` — candidate selection + draft complaint package
- `scripts/run_watch.py` — CLI orchestrator (`uspto` / `queries` / `capture` / `finalize`)
- `references/google-tm-policy.md`, `references/complaint-form-fields.md`
- `tests/` — run `python -m pytest` from the skill dir (61 tests)
