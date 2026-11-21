import { test } from "node:test";
import assert from "node:assert/strict";
import {
  drakMcpServers,
  drakMcpScopes,
  ownClientServers,
} from "./drak-mcp-scopes.ts";

// The scopes declared on the drak-mcp consent screen and submitted for
// Google OAuth verification (Mark's 3-scope decision, 2026-11-20). Google's
// reviewers compare this homepage list with the consent screen and the demo
// video, so the page must list exactly these and nothing else.
const SUBMITTED = [
  "https://www.googleapis.com/auth/adwords",
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
];

test("the drak-mcp page lists exactly the submitted scopes", () => {
  assert.deepEqual([...drakMcpScopes].sort(), [...SUBMITTED].sort());
});

test("no drak-mcp server lists a scope outside the submission", () => {
  for (const s of drakMcpServers) {
    for (const scope of s.scopes) {
      assert.ok(SUBMITTED.includes(scope), `${s.name} lists ${scope}`);
    }
  }
});

test("every drak-mcp server entry is complete", () => {
  assert.ok(drakMcpServers.length > 0);
  for (const s of drakMcpServers) {
    assert.ok(s.name && s.description && s.npm, `${s.name} missing a field`);
    assert.ok(s.scopes.length > 0, `${s.name} has no scopes`);
  }
});

test("Tag Manager is listed as own-client, not under drak-mcp", () => {
  assert.ok(ownClientServers.some((s) => s.name === "mcp-gtm-ga4"));
  assert.ok(!drakMcpServers.some((s) => s.name === "mcp-gtm-ga4"));
});
