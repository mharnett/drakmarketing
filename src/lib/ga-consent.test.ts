import { test } from "node:test";
import assert from "node:assert/strict";
import { CONSENT_DENIED_REGIONS, gtagInitScript, isValidGaId } from "./ga-consent.ts";

const ID = "G-ABC123XYZ9";

// Pull the argument objects out of the gtag('consent','default',{...}) calls.
function consentDefaults(script: string): Array<Record<string, unknown>> {
  const out: Array<Record<string, unknown>> = [];
  const re = /gtag\('consent','default',(\{.*?\})\);/g;
  for (const m of script.matchAll(re)) out.push(JSON.parse(m[1]));
  return out;
}

test("consent defaults are set before gtag('config')", () => {
  const s = gtagInitScript(ID);
  const firstConsent = s.indexOf("gtag('consent','default'");
  const config = s.indexOf(`gtag('config','${ID}')`);
  assert.ok(firstConsent >= 0, "no consent default");
  assert.ok(config > firstConsent, "config must come after the consent defaults");
});

test("ad storage, ad user data and ad personalization are denied everywhere", () => {
  const global = consentDefaults(gtagInitScript(ID)).find((d) => !("region" in d));
  assert.ok(global, "no global consent default");
  assert.equal(global.ad_storage, "denied");
  assert.equal(global.ad_user_data, "denied");
  assert.equal(global.ad_personalization, "denied");
  assert.equal(global.analytics_storage, "granted");
});

test("analytics storage is denied in the EEA, UK and Switzerland", () => {
  const regional = consentDefaults(gtagInitScript(ID)).find((d) => "region" in d);
  assert.ok(regional, "no regional consent default");
  assert.equal(regional.analytics_storage, "denied");
  assert.equal(regional.ad_storage, "denied");
  const regions = regional.region as string[];
  for (const code of ["DE", "FR", "IE", "NL", "NO", "IS", "LI", "GB", "CH"]) {
    assert.ok(regions.includes(code), `missing ${code}`);
  }
  assert.ok(!regions.includes("US"), "US must not be in the denied list");
});

test("the denied region list is the 30 EEA countries plus GB and CH", () => {
  assert.equal(CONSENT_DENIED_REGIONS.length, 32);
  assert.equal(new Set(CONSENT_DENIED_REGIONS).size, 32);
});

test("only well-formed GA4 measurement IDs are accepted", () => {
  assert.ok(isValidGaId("G-ABC123XYZ9"));
  assert.ok(!isValidGaId(""));
  assert.ok(!isValidGaId(undefined));
  assert.ok(!isValidGaId("UA-12345-1"));
  assert.ok(!isValidGaId("G-ABC');alert(1);//"));
});

test("gtagInitScript refuses a malformed ID instead of interpolating it", () => {
  assert.throws(() => gtagInitScript("G-ABC');alert(1);//"));
});
