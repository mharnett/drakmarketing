import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// JSX wraps sentences across lines and escapes apostrophes, so compare the
// page source as one line of plain text.
async function pageText(path: string): Promise<string> {
  const raw = await readFile(new URL(`../../${path}`, import.meta.url), "utf8");
  return raw
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\{" "\}/g, " ")
    .replace(/\s+/g, " ");
}

const DRAK_MCP = "src/app/drak-mcp/page.tsx";
const PRIVACY = "src/app/privacy/page.tsx";

test("drak-mcp page no longer says data stays between the machine and Google", async () => {
  const text = await pageText(DRAK_MCP);
  assert.doesNotMatch(text, /all data flows stay on your local machine/i);
  assert.doesNotMatch(text, /calls happen locally between your machine and Google/i);
});

test("drak-mcp page says results go to the AI provider the user chooses", async () => {
  const text = await pageText(DRAK_MCP);
  assert.match(text, /AI provider you (choose|use)/i);
  assert.match(text, /your own OAuth client/i);
});

test("drak-mcp page names the mcp-google-ads request log", async () => {
  const text = await pageText(DRAK_MCP);
  assert.match(text, /request log/i);
  assert.match(text, /google-ads-requests\.jsonl/);
});

test("privacy page covers access, use, transfer, protection, log, retention and deletion", async () => {
  const text = await pageText(PRIVACY);
  for (const heading of [
    /What data drak-mcp accesses/,
    /How drak-mcp uses it/,
    /Transfer to your AI provider/,
    /How it is protected/,
    /Local request log/,
    /Retention and deletion/,
  ]) {
    assert.match(text, heading);
  }
  assert.match(text, /google-ads-requests\.jsonl/);
  assert.match(text, /owner-only|only your user account can read/i);
});

test("privacy page retention no longer covers contact forms only", async () => {
  const text = await pageText(PRIVACY);
  const start = text.indexOf("> Data retention <");
  assert.ok(start >= 0, "Data retention section missing");
  const end = text.indexOf("</div>", start);
  assert.match(text.slice(start, end), /drak-mcp/);
});
