import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { paidCall, isPaymentLinkLive } from "./paid-call.ts";

test("paid call config has the agreed price and length", () => {
  assert.equal(paidCall.priceUsd, 50);
  assert.equal(paidCall.minutes, 15);
  assert.equal(typeof paidCall.paymentLinkUrl, "string");
});

test("payment link, when set, is a Stripe-hosted https URL", () => {
  if (!isPaymentLinkLive()) return;
  const url = new URL(paidCall.paymentLinkUrl);
  assert.equal(url.protocol, "https:");
  assert.ok(
    url.hostname === "buy.stripe.com" || url.hostname.endsWith(".stripe.com"),
    `expected a Stripe host, got ${url.hostname}`,
  );
});

test("isPaymentLinkLive is false for an empty or non-Stripe link", () => {
  assert.equal(isPaymentLinkLive(""), false);
  assert.equal(isPaymentLinkLive("https://example.com/pay"), false);
  assert.equal(isPaymentLinkLive("https://buy.stripe.com/abc123"), true);
});

// The repo is public. The Motion booking URL is only the Stripe post-payment
// redirect; committing it anywhere would let anyone skip the payment.
test("no Motion booking URL is committed in site source", () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|mdx?|json)$/.test(name) && !name.endsWith(".test.ts")) {
        if (/usemotion\.com\/meet/i.test(readFileSync(p, "utf8"))) offenders.push(p);
      }
    }
  };
  walk("src");
  assert.deepEqual(offenders, []);
});
