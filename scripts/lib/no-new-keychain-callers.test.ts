import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Ratchet: fails the moment a NEW .ts file inline-shells out to
// `security find-generic-password` instead of importing keychainGet() from
// ./keychain. This is the part of the task's DoD that ships regardless of
// the share/don't-share decision recorded in docs/keychain-decision.md.
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const IGNORE_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build", ".vercel"]);

// Files allowed to mention the literal string: the shared helper itself
// (where it legitimately builds the argv) and this cluster's own tests
// (which assert against that literal on purpose).
const ALLOWLIST = new Set([
  "scripts/lib/keychain.ts",
  "scripts/lib/keychain.test.ts",
  "scripts/lib/keychain.contract.ts",
  "scripts/lib/keychain.contract.test.ts",
  "scripts/lib/no-new-keychain-callers.test.ts",
]);

function walkTsFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkTsFiles(full, acc);
    } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      acc.push(full);
    }
  }
  return acc;
}

test("no new inline `security find-generic-password` caller appears outside scripts/lib/keychain.ts", () => {
  const offenders: string[] = [];

  for (const file of walkTsFiles(REPO_ROOT)) {
    const rel = relative(REPO_ROOT, file);
    if (ALLOWLIST.has(rel)) continue;

    const content = readFileSync(file, "utf-8");
    if (content.includes("find-generic-password")) {
      offenders.push(rel);
    }
  }

  assert.deepEqual(
    offenders,
    [],
    offenders.length
      ? `New inline Keychain lookup(s) found outside scripts/lib/keychain.ts: ` +
          `${offenders.join(", ")}. Import keychainGet() from scripts/lib/keychain.ts ` +
          `instead of shelling out to \`security find-generic-password\` directly.`
      : undefined,
  );
});
