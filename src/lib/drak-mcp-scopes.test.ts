import { test } from "node:test";
import assert from "node:assert/strict";
import {
  drakMcpServers,
  drakMcpScopes,
  ownClientServers,
} from "./drak-mcp-scopes.ts";

// The scopes declared on the drak-mcp consent screen and submitted for
// Google OAuth verification (Mark's 3-scope decision, 2026-11-20). The page
// may list fewer than these, never one outside them.
const SUBMITTED = [
  "https://www.googleapis.com/auth/adwords",
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
];

// Read from the published npm packages 2026-11-25: only mcp-google-ads
// 1.16.1 embeds the drak-mcp client. mcp-ga4 2.3.3, mcp-google-gsc 1.2.2 and
// mcp-gtm-ga4 1.3.2 embed none, so their users bring their own client.
test("only mcp-google-ads uses the drak-mcp app", () => {
  assert.deepEqual(
    drakMcpServers.map((s) => s.name),
    ["mcp-google-ads"],
  );
});

test("the drak-mcp app lists only the adwords scope", () => {
  assert.deepEqual(drakMcpScopes, ["https://www.googleapis.com/auth/adwords"]);
});

test("no drak-mcp server lists a scope outside the submission", () => {
  for (const s of drakMcpServers) {
    for (const scope of s.scopes) {
      assert.ok(SUBMITTED.includes(scope), `${s.name} lists ${scope}`);
    }
  }
});

test("GA4, Search Console and Tag Manager are listed as own-client", () => {
  const own = ownClientServers.map((s) => s.name);
  for (const name of ["mcp-ga4", "mcp-google-gsc", "mcp-gtm-ga4"]) {
    assert.ok(own.includes(name), `${name} missing from own-client list`);
    assert.ok(
      !drakMcpServers.some((s) => s.name === name),
      `${name} still listed under the drak-mcp app`,
    );
  }
});

test("each own-client server lists the scopes its package requests", () => {
  const byName = Object.fromEntries(ownClientServers.map((s) => [s.name, s.scopes]));
  assert.deepEqual(byName["mcp-google-gsc"], [
    "https://www.googleapis.com/auth/webmasters.readonly",
  ]);
  assert.deepEqual(byName["mcp-ga4"], [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/analytics.edit",
  ]);
});

test("every server entry in both lists is complete", () => {
  assert.ok(drakMcpServers.length > 0);
  for (const s of [...drakMcpServers, ...ownClientServers]) {
    assert.ok(s.name && s.description && s.npm, `${s.name} missing a field`);
    assert.ok(s.scopes.length > 0, `${s.name} has no scopes`);
  }
});

test("server names are unique across both lists", () => {
  const names = [...drakMcpServers, ...ownClientServers].map((s) => s.name);
  assert.equal(new Set(names).size, names.length);
});
