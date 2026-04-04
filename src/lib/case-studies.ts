export interface CaseStudy {
  slug: string;
  client: string;
  anonymizedClient?: string;
  headline: string;
  description: string;
  results: string[];
  platforms: string[];
  category: "legacy" | "current";
  featured: boolean;
}

// Current client work — from Drive presentations (anonymizable)
export const currentCaseStudies: CaseStudy[] = [
  {
    slug: "b2b-saas-lead-quality",
    client: "Neon One",
    anonymizedClient: "B2B SaaS Nonprofit Technology Company",
    headline: "Lead quality transformation via Value-Based Bidding",
    description:
      "Multi-channel paid media generating 400+ MQLs/month across Google, Bing, Meta, and LinkedIn. Implemented Value-Based Bidding with custom Salesforce signals to optimize for lead quality over volume. Built Pardot form value signals and Discovery stage feedback loops to train Google's algorithm on what a good lead actually looks like.",
    results: [
      "MQL-to-SQO conversion rate improved from 26% to 37%",
      "65 T1 Wins in one month — 10% above target",
      "$219K ACV in a single month — 5% above target",
      "Pipeline grew to $407K/month — up 10% vs 6-month mean",
      "Average days to convert dropped from 51 to 22-31",
      "Non-freemail MQLs hit 15-month high (864/month)",
    ],
    platforms: [
      "Google Ads",
      "Bing Ads",
      "Meta Ads",
      "LinkedIn",
      "Salesforce",
      "GA4",
    ],
    category: "current",
    featured: true,
  },
  {
    slug: "gaming-acquisition-diagnostic",
    client: "IMVU",
    anonymizedClient: "Social Gaming Platform",
    headline: "$190K/month in budget savings from acquisition diagnostic",
    description:
      "Conducted a deep acquisition diagnostic for the C-suite revealing that $487K/month in UA spend was generating only ~$50K in non-brand revenue, while organic users drove $4.45M/month. Identified that 85% of budget went to channels with 6-month ROAS under 0.20. Recommended and executed $190K+/month in cuts with zero revenue impact.",
    results: [
      "Identified $190K+/month in wasteful spend across TikTok, Snapchat, CTV",
      "Organic engine generating $4.45M/month at zero acquisition cost",
      "February natural experiment: 30% spend pullback, zero revenue impact",
      "Discovered whale segment: 10% of transactions = 45% of revenue",
      "Apple Search Ads Brand was 96.3% re-attributions — not new users",
      "Proposed VBB strategy to optimize for whale acquisition",
    ],
    platforms: [
      "Google Ads (UAC)",
      "TikTok",
      "Snapchat",
      "Apple Search Ads",
      "AppsFlyer",
      "Meta",
    ],
    category: "current",
    featured: true,
  },
  {
    slug: "global-apac-expansion",
    client: "Forcepoint",
    anonymizedClient: "Fortune 500 Cybersecurity Company",
    headline: "Global B2B expansion — APAC/India market launch",
    description:
      "Managed Google Ads across US, EMEA, APAC, and India for an enterprise cybersecurity company. Launched APAC/India expansion with full-funnel TOFU/MOFU/BOFU campaigns targeting data security and compliance buyers.",
    results: [
      "India MOFU CPA improved 3x: $573 to $183/conversion",
      "India TOFU Display at $17/conversion — best efficiency across all regions",
      "India MOFU volume increased 14x month-over-month (5 to 70 conversions)",
      "APAC 6Sense display scaled +751%",
      "India 6Sense display scaled +341%",
    ],
    platforms: ["Google Ads", "6Sense", "LinkedIn", "Salesforce"],
    category: "current",
    featured: true,
  },
  {
    slug: "multichannel-b2b-lead-gen",
    client: "Flowspace",
    anonymizedClient: "B2B SaaS Fulfillment Platform",
    headline: "Meta CPA reduced 81% in 8 weeks",
    description:
      "Running Google Ads, Meta Ads, and LinkedIn for a B2B fulfillment SaaS. Implemented Value-Based Bidding with Salesforce lead value integration and built a conversion retraction pipeline for lead quality feedback.",
    results: [
      "Meta CPA reduced from $522 to $99 — 81% improvement in 8 weeks",
      "Google Ads best week: $185 CPA with 1.37 ROAS",
      "Google CTR consistently 5-8%+",
      "Built SFDC-to-Google-Ads conversion retraction pipeline",
    ],
    platforms: ["Google Ads", "Meta Ads", "LinkedIn", "Salesforce"],
    category: "current",
    featured: false,
  },
  {
    slug: "brand-incrementality",
    client: "Neon One",
    anonymizedClient: "B2B SaaS Company",
    headline: "Brand incrementality measurement via bid walking",
    description:
      "Analyzed brand vs. non-brand bidding strategy using bid walking methodology. Systematically varied brand spend to measure organic absorption of branded demand, validating that most branded clicks are not incremental.",
    results: [
      "Validated organic absorption of branded demand",
      "Data-driven budget reallocation from brand to non-brand",
      "Week 3 example: +15 surplus paid MQLs, +18 surplus organic MQLs",
    ],
    platforms: ["Google Ads", "GA4"],
    category: "current",
    featured: false,
  },
];

// Legacy case studies — from old Weebly site
export const legacyCaseStudies: CaseStudy[] = [
  {
    slug: "cognito-alzheimers-study",
    client: "Cognito",
    headline: "Patient recruitment for Phase 3 Alzheimer's study",
    description:
      "Helped Cognito drive patient referrals for their Phase 3 Alzheimer's study by rigorously testing ad creatives and then optimizing budgets and targeting. The team successfully met their interim enrollment goal, due in large part to these campaigns.",
    results: ["Met interim enrollment goal ahead of schedule"],
    platforms: ["Facebook Ads", "Google Ads"],
    category: "legacy",
    featured: false,
  },
  {
    slug: "swing-telehealth",
    client: "Swing Care",
    headline: "Telehealth appointment generation for fibromyalgia treatment",
    description:
      "Built Facebook campaigns to drive telehealth doctor appointments for Swing Care's fibromyalgia treatment plans. Developed deep funnel conversion points and disqualifying questionnaire answers to ensure high quality leads, then optimized creative, geography, and budget to enable significant growth since launch.",
    results: [
      "Deep funnel conversion tracking with disqualification filters",
      "Significant growth since launch",
    ],
    platforms: ["Facebook Ads"],
    category: "legacy",
    featured: false,
  },
  {
    slug: "quantic-mba",
    client: "Quantic",
    headline: "Multi-million dollar campaigns for MBA program applications",
    description:
      "Managed multi-million dollar Meta and Google campaigns to drive high quality applications to Quantic's MBA programs. Instrumented platforms to optimize and report against ROAS goals, and developed Data Studio reporting for key geographies and programs.",
    results: [
      "Multi-million dollar campaign management",
      "ROAS-optimized reporting across geographies",
      "Data Studio dashboards for program-level insights",
    ],
    platforms: ["Meta Ads", "Google Ads", "Data Studio"],
    category: "legacy",
    featured: false,
  },
  {
    slug: "cognoa-medical-trial",
    client: "Cognoa",
    headline: "Medical trial recruitment — wildly successful under budget",
    description:
      "Developed and launched a Facebook campaign to drive medical trial participants. The resulting campaign was wildly successful and recruited many extra patients within a tight window and under budget.",
    results: [
      "Recruited above target within tight window",
      "Came in under budget",
    ],
    platforms: ["Facebook Ads"],
    category: "legacy",
    featured: false,
  },
  {
    slug: "upturn-app-growth",
    client: "Upturn",
    headline: "Consumer credit app — web to native app transition",
    description:
      "Managed acquisition for Upturn's high volume consumer credit dispute platform. Tested flow, creative, and channels including Apple Search Ads, Facebook, Google App Ads, Spotify, and affiliate channels. Transitioned from 100% web focus to native iOS and Android campaigns as the product matured.",
    results: [
      "Multi-channel acquisition across 5+ platforms",
      "Successful web-to-app transition",
      "Testing across paid, affiliate, and incentive channels",
    ],
    platforms: [
      "Apple Search Ads",
      "Facebook Ads",
      "Google App Ads",
      "Spotify",
    ],
    category: "legacy",
    featured: false,
  },
  {
    slug: "spark-grills",
    client: "Spark Grills",
    headline: "Sold out top-rated charcoal grill through paid media",
    description:
      "Developed ads, testing, and bidding strategies to help Spark Grills sell out of their top-rated charcoal grill.",
    results: ["Product sold out through paid media campaigns"],
    platforms: ["Google Ads", "Facebook Ads"],
    category: "legacy",
    featured: false,
  },
];

export const allCaseStudies = [...currentCaseStudies, ...legacyCaseStudies];
export const featuredCaseStudies = allCaseStudies.filter((cs) => cs.featured);
