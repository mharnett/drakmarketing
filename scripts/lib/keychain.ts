import { execFileSync } from "node:child_process";

/**
 * Shared macOS Keychain read for this repo's LinkedIn scripts
 * (scripts/linkedin-oauth.ts, scripts/sync-linkedin-posts.ts) — replaces the
 * two byte-identical inline `security find-generic-password` copies those
 * files used to carry.
 *
 * This intentionally mirrors the read-command shape of
 * `drak_ops.keychain.keychain_get()` (mharnett/drak-ops,
 * src/drak_ops/keychain.py) so the two stay behaviorally equivalent even
 * though they can't share code across languages. See keychain.contract.ts /
 * keychain.contract.test.ts for the tripwire that watches for drift, and
 * docs/keychain-decision.md for why this repo has its own copy instead of
 * depending on drak_ops directly (not published to npm; only this repo has
 * real TS callers).
 */

export type ExecFile = (file: string, args: string[], opts?: object) => unknown;

/** Build the `security find-generic-password` argv for a Keychain read. */
export function buildKeychainReadArgs(service: string, account?: string): string[] {
  const args = ["find-generic-password"];
  if (account) args.push("-a", account);
  args.push("-s", service, "-w");
  return args;
}

/**
 * Read a secret from the macOS Keychain.
 *
 * Throws when the entry is absent — matches the behavior of the two inline
 * implementations this replaces, both of which relied on execSync throwing
 * on a nonzero `security` exit (sync-linkedin-posts.ts's `main()` field-URN
 * lookup, for example, depends on this throw to fall back to a live API call).
 */
export function keychainGet(
  service: string,
  account: string,
  exec: ExecFile = execFileSync,
): string {
  const out = exec("security", buildKeychainReadArgs(service, account), {
    encoding: "utf-8",
  });
  return String(out).trim();
}
