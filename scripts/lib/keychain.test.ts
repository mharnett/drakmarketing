import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildKeychainReadArgs, keychainGet } from "./keychain.ts";

describe("buildKeychainReadArgs", () => {
  test("builds the security find-generic-password argv with an account", () => {
    assert.deepEqual(buildKeychainReadArgs("LINKEDIN_POSTS_CLIENT_ID", "drak-posts"), [
      "find-generic-password",
      "-a",
      "drak-posts",
      "-s",
      "LINKEDIN_POSTS_CLIENT_ID",
      "-w",
    ]);
  });

  test("omits -a when no account is given", () => {
    assert.deepEqual(buildKeychainReadArgs("SOME_SERVICE"), [
      "find-generic-password",
      "-s",
      "SOME_SERVICE",
      "-w",
    ]);
  });
});

describe("keychainGet", () => {
  test("found case: returns the trimmed stdout from the security call", () => {
    const calls: Array<{ file: string; args: string[] }> = [];
    const fakeExec = (file: string, args: string[]) => {
      calls.push({ file, args });
      return "  super-secret-token\n";
    };

    const result = keychainGet("LINKEDIN_POSTS_ACCESS_TOKEN", "drak-posts", fakeExec);

    assert.equal(result, "super-secret-token");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].file, "security");
    assert.deepEqual(calls[0].args, [
      "find-generic-password",
      "-a",
      "drak-posts",
      "-s",
      "LINKEDIN_POSTS_ACCESS_TOKEN",
      "-w",
    ]);
  });

  test("missing case: propagates the underlying throw (no Keychain entry)", () => {
    const fakeExec = () => {
      throw new Error("security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.");
    };

    assert.throws(
      () => keychainGet("DOES_NOT_EXIST", "drak-posts", fakeExec),
      /could not be found/,
    );
  });
});
