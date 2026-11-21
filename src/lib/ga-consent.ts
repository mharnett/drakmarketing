// GA4 bootstrap with Google Consent Mode v2 defaults.
//
// The site has no consent banner, so these defaults are final:
// - Ad storage, ad user data and ad personalization are denied everywhere
//   (the site runs no ads).
// - Analytics storage is granted, except in the EEA, the UK and Switzerland,
//   where it is denied; gtag then sends cookieless pings only.

/** The 30 EEA countries plus the UK and Switzerland (ISO 3166-1 alpha-2). */
export const CONSENT_DENIED_REGIONS: string[] = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU",
  "MT", "NL", "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "GB", "CH",
];

const GA_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/;

/** True only for a well-formed GA4 measurement ID; it is interpolated into a script. */
export function isValidGaId(id: string | undefined): id is string {
  return typeof id === "string" && GA_ID_PATTERN.test(id);
}

export function gtagInitScript(gaId: string): string {
  if (!isValidGaId(gaId)) {
    throw new Error("gtagInitScript: not a GA4 measurement ID");
  }
  const globalDefault = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  };
  const regionalDefault = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    region: CONSENT_DENIED_REGIONS,
  };
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    `gtag('consent','default',${JSON.stringify(regionalDefault)});`,
    `gtag('consent','default',${JSON.stringify(globalDefault)});`,
    "gtag('js',new Date());",
    `gtag('config','${gaId}');`,
  ].join("");
}
