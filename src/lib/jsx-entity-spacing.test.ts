import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// The build drops the leading space of a JSX text run that follows an inline
// tag and contains an HTML entity: `</strong> Google&apos;s` renders as
// "</strong>Google's" (seen live on /drak-mcp, 2026-11-25). Runs without an
// entity keep the space. Write `</strong>{" "}` instead of a bare space there.
const SRC = fileURLToPath(new URL("../", import.meta.url));

async function tsxFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await tsxFiles(path)));
    else if (entry.name.endsWith(".tsx")) out.push(path);
  }
  return out;
}

export function gluedRuns(source: string): string[] {
  const hits: string[] = [];
  for (const m of source.matchAll(/<\/(strong|code|em|a|b|span)> ([^<{]*)/g)) {
    if (m[2].includes("&")) {
      const line = source.slice(0, m.index).split("\n").length;
      hits.push(`line ${line}: </${m[1]}> ${m[2].trim().slice(0, 30)}`);
    }
  }
  return hits;
}

test("gluedRuns flags an entity run after an inline tag, not a plain one", () => {
  assert.equal(gluedRuns(`<li><strong>A.</strong> Google&apos;s APIs</li>`).length, 1);
  assert.equal(gluedRuns(`<li><strong>A.</strong> plain text</li>`).length, 0);
  assert.equal(gluedRuns(`<li><strong>A.</strong>{" "}Google&apos;s APIs</li>`).length, 0);
});

test("no page text run after an inline tag relies on a bare space before an entity", async () => {
  const problems: string[] = [];
  for (const file of await tsxFiles(SRC)) {
    for (const hit of gluedRuns(await readFile(file, "utf8"))) {
      problems.push(`${file.slice(SRC.length)} ${hit}`);
    }
  }
  assert.deepEqual(problems, []);
});
