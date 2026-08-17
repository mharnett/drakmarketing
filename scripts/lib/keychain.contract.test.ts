import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { buildKeychainReadArgs } from "./keychain.ts";
import { checkPythonContract, PINNED_PY_READ_CONTRACT } from "./keychain.contract.ts";

// This repo has no drak-ops import to test against directly — drak_ops.keychain
// lives in a sibling Python repo (mharnett/drak-ops). These tests are the
// tripwire described in the task's DoD: they don't prove the two stay in sync
// on every CI run (the sibling checkout usually isn't present), but they make
// divergence loud instead of silent. See scripts/lib/README.md.
const DRAK_OPS_PY_PATH =
  process.env.DRAK_OPS_KEYCHAIN_PY_PATH ??
  join(homedir(), "claude-code", "drak-ops", "src", "drak_ops", "keychain.py");

test("near-side: the shared TS helper's argv shape matches the pinned drak_ops.keychain contract", () => {
  // Verifiable with zero cross-repo access — pins buildKeychainReadArgs' own
  // shape against the same PINNED_PY_READ_CONTRACT the far-side check uses,
  // so a future edit to the TS helper that silently drifts from the pinned
  // Python contract fails here even when drak-ops isn't checked out.
  assert.deepEqual(buildKeychainReadArgs("SVC", "ACC"), [
    "find-generic-password",
    "-a",
    "ACC",
    "-s",
    "SVC",
    "-w",
  ]);
  assert.deepEqual(buildKeychainReadArgs("SVC"), ["find-generic-password", "-s", "SVC", "-w"]);
});

test("checkPythonContract fails loudly, naming the refresh steps, when the python source diverges", () => {
  const mutated = `cmd = ["security", "find-generic-password", "-g"]  # someone swapped -w for -g`;
  const result = checkPythonContract(mutated);

  assert.equal(result.ok, false);
  assert.match(result.message ?? "", /PINNED_PY_READ_CONTRACT/);
  assert.match(result.message ?? "", /scripts\/lib\/keychain\.ts/);
});

test("checkPythonContract passes against the real pinned snapshot", () => {
  const result = checkPythonContract(PINNED_PY_READ_CONTRACT);
  assert.equal(result.ok, true);
});

test("far-side: drak_ops/keychain.py on disk still matches the pinned contract (skips loudly if unreachable)", (t) => {
  if (!existsSync(DRAK_OPS_PY_PATH)) {
    t.diagnostic(
      `drak-ops sibling checkout not found at ${DRAK_OPS_PY_PATH} — this does NOT ` +
        "prove drak_ops.keychain still matches the pinned contract. Set " +
        "DRAK_OPS_KEYCHAIN_PY_PATH to a real checkout of mharnett/drak-ops to verify " +
        "for real (e.g. before a release, or in an environment with that repo cloned).",
    );
    t.skip("drak-ops sibling checkout not found — see diagnostic");
    return;
  }

  const pySource = readFileSync(DRAK_OPS_PY_PATH, "utf-8");
  const result = checkPythonContract(pySource);
  assert.ok(result.ok, result.message);
});
