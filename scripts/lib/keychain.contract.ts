/**
 * Cross-language tripwire between this repo's scripts/lib/keychain.ts and
 * drak_ops.keychain.keychain_get() (mharnett/drak-ops,
 * src/drak_ops/keychain.py). There is no test runner that can span both
 * repos, so this pins a snapshot of the Python read-command construction as
 * of 2026-08-17 and fails loudly — naming the refresh steps — the moment
 * either side no longer matches it. A "keep in sync" comment is not a test;
 * this is the test.
 */

// Verbatim (whitespace-normalized) from drak-ops/src/drak_ops/keychain.py,
// keychain_get()'s command construction, as of 2026-08-17:
export const PINNED_PY_READ_CONTRACT = `cmd = ["security", "find-generic-password"]
if account:
cmd += ["-a", account]
cmd += ["-s", service, "-w"]`;

export function normalizeSnippet(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

export interface ContractCheckResult {
  ok: boolean;
  message?: string;
}

const REFRESH_INSTRUCTIONS =
  "drak_ops.keychain's `security find-generic-password` read-command " +
  "construction no longer matches the pinned snapshot in " +
  "scripts/lib/keychain.contract.ts (PINNED_PY_READ_CONTRACT). Refresh: " +
  "1) diff the `cmd = [...]` block in drak-ops/src/drak_ops/keychain.py " +
  "against PINNED_PY_READ_CONTRACT here; 2) update PINNED_PY_READ_CONTRACT " +
  "to match; 3) update buildKeychainReadArgs() in scripts/lib/keychain.ts so " +
  "its argv shape still matches; 4) re-run " +
  "`node --test scripts/lib/keychain.contract.test.ts`.";

/**
 * Check whether a copy of drak_ops/keychain.py's source still contains the
 * pinned read-command construction. `pySource` can be a whole file's text
 * (only needs to contain the pinned block) or the block text itself.
 */
export function checkPythonContract(pySource: string): ContractCheckResult {
  const normalizedSource = normalizeSnippet(pySource);
  const normalizedPinned = normalizeSnippet(PINNED_PY_READ_CONTRACT);

  if (normalizedSource.includes(normalizedPinned)) {
    return { ok: true };
  }
  return { ok: false, message: REFRESH_INSTRUCTIONS };
}
