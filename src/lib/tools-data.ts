export interface Tool {
  slug: string;
  name: string;
  package: string;
  description: string;
  longDescription: string;
  platform: string;
  toolCount: number;
  githubRepo: string;
  npmPackage: string;
  installCommand: string;
  features: string[];
  status: "published" | "beta" | "coming-soon";
  comparison?: Comparison;
}

export interface Comparison {
  columns: [string, string];
  rows: { label: string; official: string; ours: string }[];
  footnote?: string;
}

const suite = (count: number): Tool => ({
    slug: "marketing-suite",
    name: "MCP Marketing Suite",
    package: "mcp-marketing-suite",
    description:
      `Production-grade collection of MCP servers for performance marketing — Google, Meta, Microsoft, LinkedIn, Reddit, GA4, Search Console, GTM. ${count} tools across 8 platforms.`,
    longDescription:
      "An umbrella project for the full drak MCP marketing stack. Eight production servers — seven on npm, one on PyPI — covering paid media, analytics, and tag management. Built by practitioners running real ad spend. Pick the platforms you actually use; the suite is designed to be additive, not all-or-nothing, with recommended profiles for Google-only, cross-channel, and full-agency context budgets.",
    platform: "Multi-platform",
    toolCount: count,
    githubRepo: "mharnett/mcp-marketing-suite",
    npmPackage: "",
    installCommand: "",
    features: [
      "8 production servers across paid media, analytics, and tagging",
      `${count} tools — Google Ads, Meta, Microsoft, LinkedIn, Reddit, GA4, GSC, GTM`,
      "Recommended profiles by context budget",
      "Project-scoped .mcp.json guidance",
      "Tool Search support for Claude Code (deferred loading)",
      "Built by practitioners running real ad spend",
    ],
    status: "published",
});

const servers: Tool[] = [
  {
    slug: "google-ads",
    name: "Google Ads MCP",
    package: "mcp-google-ads",
    description:
      "MCP server for Google Ads API with MCC support, 85 tools for campaign management, and built-in safeguards.",
    longDescription:
      "A production-grade MCP server for Google Ads with full Multi-Client Center (MCC) support. Manage campaigns, ad groups, keywords, and ads across multiple accounts. Safe-by-default — all creates are PAUSED, with an approval workflow for destructive actions. Supports GAQL queries for custom reporting.",
    platform: "Google Ads",
    toolCount: 85,
    githubRepo: "mharnett/mcp-google-ads",
    npmPackage: "mcp-google-ads",
    installCommand: "npx mcp-google-ads",
    features: [
      "MCC (Multi-Client Center) support",
      "Auto-context detection per account",
      "GAQL custom queries",
      "Full keyword, ad, and campaign CRUD",
      "Safe-by-default — all creates PAUSED",
      "Approval workflow for destructive actions",
      "Campaign budget management",
      "Search term reports and insights",
      "Budget magnitude ceiling and stale-value guard on writes",
      "Required reason and audit log on bidding overrides",
      "Never attaches a lead form unless explicitly asked",
      "Keyword labelling and ad-group asset linking",
    ],
    comparison: {
      columns: ["Google's official Google Ads MCP", "Google Ads MCP"],
      rows: [
        {
          label: "Publisher and status",
          official: "Google; open source (Apache-2.0), pre-1.0",
          ours: "Drak Marketing; open source (MIT), on npm",
        },
        {
          label: "Reads",
          official: "GAQL search, field metadata, accessible customers",
          ours: "GAQL plus keyword, ad, search term, Keyword Planner and experiment reports",
        },
        {
          label: "Writes",
          official: "Assets, YouTube video uploads and labels only",
          ours: "Campaigns, ad groups, ads, keywords, negatives, budgets, bidding, targeting, experiments",
        },
        {
          label: "Write safety",
          official: "Dry run first; committing needs the same parameters plus a checksum",
          ours: "Writes off unless enabled; new objects land paused; \u00b120% budget and bid ceiling; lead-form guard",
        },
        {
          label: "Query language",
          official: "GAQL built from structured parameters",
          ours: "Raw GAQL, plus purpose-built report tools",
        },
        {
          label: "Multi-account (MCC)",
          official: "Manager login ID per call or as a default",
          ours: "Manager login in config; picks the client account from the working folder",
        },
        {
          label: "Sign-in",
          official: "Application Default Credentials or OAuth",
          ours: "OAuth refresh token plus developer token",
        },
        {
          label: "Hosting",
          official: "Local (Python), or self-hosted over HTTP, Docker or Cloud Run",
          ours: "Local (Node.js)",
        },
        {
          label: "Best for",
          official: "Analysis and asset/label upkeep on Google-maintained code",
          ours: "Day-to-day campaign changes through an AI assistant, with guardrails",
        },
      ],
      footnote:
        "Comparison as of November 2026, based on Google's google-ads-mcp repository and Google Ads API documentation.",
    },
    status: "published",
  },
  {
    slug: "linkedin-ads",
    name: "LinkedIn Ads MCP",
    package: "mcp-linkedin-ads",
    description:
      "11 tools for LinkedIn Campaign Manager reporting and predictive (lookalike) audiences across multiple ad accounts, proven across 65+ active campaigns.",
    longDescription:
      "An MCP server for LinkedIn advertising reporting and predictive (lookalike) audiences. List ad accounts, campaign groups, and campaigns, and pull campaign-, account-, and pivot-level analytics across multiple accounts — all through a single MCP interface. Reporting is read-only; the two lookalike write tools stay off unless you enable them, and each write confirms the account, supports a dry run, and reads the result back.",
    platform: "LinkedIn Ads",
    toolCount: 11,
    githubRepo: "mharnett/mcp-linkedin-ads",
    npmPackage: "mcp-linkedin-ads",
    installCommand: "npx mcp-linkedin-ads",
    features: [
      "Read-only reporting; lookalike writes off unless enabled",
      "Create, update and list predictive (lookalike) audiences",
      "Multi-account support",
      "Account, campaign group, and campaign listing",
      "Campaign and account performance reports",
      "Flexible analytics by pivot and date range",
      "Per-client context detection",
    ],
    comparison: {
      columns: ["LinkedIn Marketing API (no official MCP)", "LinkedIn Ads MCP"],
      rows: [
        {
          label: "Publisher and status",
          official: "No MCP from LinkedIn or Microsoft; only the Marketing API",
          ours: "Drak Marketing; open source (MIT), on npm and in the official MCP Registry",
        },
        {
          label: "What you get",
          official: "A REST API to build your own integration on",
          ours: "Ready-made tools for any MCP-compatible AI assistant",
        },
        {
          label: "Reads",
          official: "Full API read access, depending on your access tier",
          ours: "Ad accounts, campaign groups, campaigns, performance and analytics",
        },
        {
          label: "Writes",
          official: "Campaigns, creatives and audiences, through your own code",
          ours: "Predictive (lookalike) audiences only; off unless enabled, with dry run and read-back",
        },
        {
          label: "Reporting and pivots",
          official: "Analytics endpoint with pivots and time granularity",
          ours: "Pivots such as campaign, creative, company size, industry, seniority, job function, country",
        },
        {
          label: "Multi-account",
          official: "Every ad account the signed-in member can reach",
          ours: "Several accounts in config; per-call account ID or matched by working folder",
        },
        {
          label: "Sign-in",
          official: "Developer app, Advertising API approval and OAuth 2.0",
          ours: "Your own app's OAuth credentials; refresh token rotated automatically",
        },
        {
          label: "Coverage beyond reporting",
          official: "Conversions API, Lead Sync, Media Planning, Company Intelligence",
          ours: "Frequency (impressions \u00f7 reach) added to reports",
        },
        {
          label: "Best for",
          official: "Building your own app",
          ours: "LinkedIn Ads reporting and lookalike audiences from an AI assistant across several accounts",
        },
      ],
      footnote:
        "LinkedIn has not published an MCP server as of November 2026, so this compares against building on its Marketing API directly.",
    },
    status: "published",
  },
  {
    slug: "bing-ads",
    name: "Bing Ads MCP",
    package: "mcp-bing-ads",
    description:
      "13 tools for Microsoft Advertising — performance and quality score reporting, shared negative lists, budgets, and bids.",
    longDescription:
      "An MCP server for Microsoft Advertising (Bing Ads). Report on campaigns, keywords, and search terms with quality scores, manage shared negative keyword lists, pause keywords, and update campaign budgets and ad group CPC bids. The first open-source Bing Ads MCP server available.",
    platform: "Microsoft Advertising",
    toolCount: 13,
    githubRepo: "mharnett/mcp-bing-ads",
    npmPackage: "mcp-bing-ads",
    installCommand: "npx mcp-bing-ads",
    features: [
      "Campaign and ad group listing",
      "Keyword performance with quality score",
      "Shared negative keyword lists",
      "Ad group CPC bid updates",
      "Search term reports",
      "Keyword pausing",
      "Campaign budget updates",
      "First open-source Bing Ads MCP",
    ],
    comparison: {
      columns: ["Microsoft's official Advertising MCP", "Bing Ads MCP"],
      rows: [
        {
          label: "Publisher and status",
          official: "Microsoft; open pilot, read-only",
          ours: "Drak Marketing; open source (MIT), on npm",
        },
        {
          label: "Reads",
          official: "Accounts, campaigns, ad groups, ads, keywords, Performance Max asset groups, assets, audiences",
          ours: "Campaigns, ad groups, campaign/keyword/search term reports, shared negative lists",
        },
        {
          label: "Writes",
          official: "None",
          ours: "Pause keywords, set campaign budgets, set ad group max CPC, add shared negatives",
        },
        {
          label: "Write safety",
          official: "Not applicable (read-only)",
          ours: "Writes off unless enabled; account ID required; budgets and bids read back after writing",
        },
        {
          label: "Reporting",
          official: "Metrics on entity calls (spend, ROAS, CPA, top-impression rate); preset date ranges",
          ours: "Campaign, keyword (with Quality Score) and search term reports; any date range",
        },
        {
          label: "Multi-account",
          official: "Lists every account you can access",
          ours: "Accounts set in a local config; picked by ID or working folder",
        },
        {
          label: "Sign-in",
          official: "Microsoft account sign-in",
          ours: "Your own Azure app, developer token and refresh token",
        },
        {
          label: "Hosting",
          official: "Hosted by Microsoft; nothing to install",
          ours: "Local (Node.js)",
        },
        {
          label: "Notable extras",
          official: "180-day change history, Performance Max and audience data",
          ours: "Search terms, Quality Score, shared negative list audits",
        },
        {
          label: "Best for",
          official: "Read-only analysis with no install",
          ours: "Analysis plus a few guarded edits",
        },
      ],
      footnote:
        "Comparison as of November 2026, based on Microsoft Advertising's MCP documentation.",
    },
    status: "published",
  },
  {
    slug: "ga4",
    name: "GA4 MCP",
    package: "mcp-ga4",
    description:
      "Google Analytics 4 server with historical reports, realtime data, and custom dimensions management.",
    longDescription:
      "Connect your AI assistant to Google Analytics 4. Run historical and realtime reports, manage custom dimensions and metrics, and analyze traffic patterns. Supports both service account and OAuth authentication with multi-client configuration.",
    platform: "Google Analytics 4",
    toolCount: 9,
    githubRepo: "mharnett/mcp-ga4",
    npmPackage: "mcp-ga4",
    installCommand: "npx mcp-ga4",
    features: [
      "Historical report generation",
      "Realtime data access",
      "Custom dimension management",
      "Custom metrics management",
      "Multi-client configuration",
      "Service account and OAuth support",
      "Relative date ranges",
      "Data stream listing",
    ],
    status: "published",
  },
  {
    slug: "search-console",
    name: "Search Console MCP",
    package: "mcp-google-gsc",
    description:
      "Google Search Console tools for search analytics, URL inspection, and site performance monitoring.",
    longDescription:
      "Access Google Search Console data through your AI assistant. Analyze search performance with dimension filters, inspect URL indexing status, and monitor mobile usability. Multi-client support for agencies managing multiple properties.",
    platform: "Google Search Console",
    toolCount: 4,
    githubRepo: "mharnett/mcp-search-console",
    npmPackage: "mcp-google-gsc",
    installCommand: "npx mcp-google-gsc",
    features: [
      "Search analytics with dimension filters",
      "URL indexing inspection",
      "Mobile usability reporting",
      "Multi-client support",
    ],
    status: "published",
  },
  {
    slug: "gtm-ga4",
    name: "GTM + GA4 MCP",
    package: "mcp-gtm-ga4",
    description:
      "Integrated Google Tag Manager and GA4 server with consent auditing, tag management, and sandbox safety.",
    longDescription:
      "Manage Google Tag Manager containers alongside GA4 from a single MCP server. Create and update tags, triggers, and variables. Audit consent compliance across your container. Sandbox safety prevents accidental production changes — workspace preview and versioning built in.",
    platform: "Google Tag Manager + GA4",
    toolCount: 13,
    githubRepo: "mharnett/mcp-gtm-ga4",
    npmPackage: "mcp-gtm-ga4",
    installCommand: "npx mcp-gtm-ga4",
    features: [
      "Tag, trigger, and variable management",
      "Consent compliance auditing",
      "Workspace preview and versioning",
      "Sandbox safety for production protection",
      "GA4 integration",
      "Container snapshot diffing",
    ],
    status: "published",
  },
  {
    slug: "reddit-ads",
    name: "Reddit Ads MCP",
    package: "mcp-reddit-ads",
    description:
      "18 tools for Reddit Ads API v3 — campaign management, targeting, and performance reporting.",
    longDescription:
      "Manage Reddit advertising campaigns through your AI assistant. Full CRUD for campaigns and ads with subreddit, interest, and geographic targeting. Bulk pause/enable operations and safe-by-default behavior for responsible automation.",
    platform: "Reddit Ads",
    toolCount: 18,
    githubRepo: "mharnett/mcp-reddit-ads",
    npmPackage: "mcp-reddit-ads",
    installCommand: "npx mcp-reddit-ads",
    features: [
      "Full campaign and ad CRUD",
      "Subreddit targeting",
      "Interest-based targeting",
      "Geographic targeting",
      "Bulk pause/enable operations",
      "Performance reporting",
      "Safe-by-default behavior",
      "Reddit Ads API v3 support",
    ],
    status: "published",
  },
  {
    slug: "meta-ads",
    name: "Meta Ads MCP",
    package: "meta-ads-mcp",
    description:
      "28+ tools for Facebook and Instagram advertising — campaigns, audiences, creatives, and insights.",
    longDescription:
      "Manage Meta (Facebook and Instagram) advertising with 28+ tools for campaign management, audience targeting, and creative testing. Available as a hosted service via Pipeboard or self-hosted for full control.",
    platform: "Meta Ads",
    toolCount: 28,
    githubRepo: "",
    npmPackage: "",
    installCommand: "",
    features: [
      "Campaign management across Facebook and Instagram",
      "Dynamic creative testing",
      "Audience targeting and insights",
      "Ad creative management",
      "Performance reporting and analytics",
      "Multi-platform support",
      "Interest and behavior targeting",
      "Geographic and demographic targeting",
    ],
    status: "published",
  },
  {
    slug: "meta-ads-incrementality",
    name: "Meta Ads Incrementality MCP",
    package: "mcp-meta-ads-incrementality",
    description:
      "Meta Marketing API insights with incrementality as the default attribution window — quantifies the gap vs. 7d-click + 1d-view.",
    longDescription:
      "Most agency Meta reports use the default 7-day-click + 1-day-view attribution, which systematically overstates ad impact. This MCP server makes Meta's `incrementality` breakdown the default and lets you ask for the standard windows in the same call to quantify the gap. v0.2.3 adds a full campaign-build toolset — campaigns, ad sets, ads, creatives, audiences, and lead forms — on top of the incrementality insights, backed by 120+ unit tests covering the incrementality math, attribution-window handling, and Meta SDK request shape. Verify against a sandboxed Business Manager account before production use.",
    platform: "Meta Ads",
    toolCount: 20,
    githubRepo: "mharnett/mcp-meta-ads-incrementality",
    npmPackage: "mcp-meta-ads-incrementality",
    installCommand: "npx mcp-meta-ads-incrementality",
    features: [
      "Incrementality as the default attribution window",
      "Side-by-side comparison vs. 7d-click + 1d-view",
      "120+ unit tests on the incrementality math and SDK shape",
      "System User token auth (Business Manager)",
    ],
    status: "beta",
    comparison: {
      columns: ["Meta's official Ads MCP", "Meta Ads Incrementality MCP"],
      rows: [
        {
          label: "Default conversion number",
          official: "Meta's standard attributed conversions",
          ours: "Meta's modeled incremental conversions",
        },
        {
          label: "Incrementality",
          official: "Conversion Lift studies: a randomized holdout you set up in advance",
          ours: "Meta's incrementality estimate on every report, by default",
        },
        {
          label: "Inflation math",
          official: "None",
          ours: "Built in: reported vs. incremental conversions, inflation factor, % overstated",
        },
        {
          label: "Cost per acquisition (CPA)",
          official: "Cost per result over time, plus industry benchmarks",
          ours: "CPA for each attribution window, side by side",
        },
        {
          label: "Experiments",
          official: "A/B tests and Conversion Lift studies",
          ours: "None yet (Conversion Lift is on the roadmap)",
        },
        {
          label: "Building and editing",
          official: "Campaigns, ad sets, ads, creatives, custom audiences, Instagram post boosts",
          ours: "Campaigns, ad sets, ads, creatives, audiences, lookalikes, lead forms, budgets, pause/activate",
        },
        {
          label: "Write safety",
          official: "New campaigns, ad sets and ads land paused; your AI client confirms before activating",
          ours: "Writes off unless enabled; new objects land paused; dry-run previews on edits; naming checks on renames",
        },
        {
          label: "Catalog, signals and research",
          official: "Product catalogs, pixel and Conversions API signal health, Ad Library search",
          ours: "None",
        },
        {
          label: "Sign-in",
          official: "OAuth through Facebook Login for Business",
          ours: "Meta access token (System User token recommended)",
        },
        {
          label: "Best for",
          official: "Running the account",
          ours: "Judging the account: reports where the causal number leads",
        },
      ],
      footnote:
        "Comparison as of November 2026, based on Meta's developer documentation. I run both: Meta's to operate the account, this one to evaluate it.",
    },
  },
];

/** Sum over the individual servers; the suite bundles them, so it is not added again. */
export const totalToolCount = servers.reduce((sum, t) => sum + t.toolCount, 0);

export const tools: Tool[] = [suite(totalToolCount), ...servers];
export const publishedCount = tools.filter(
  (t) => t.status === "published"
).length;
