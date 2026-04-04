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
}

export const tools: Tool[] = [
  {
    slug: "google-ads",
    name: "Google Ads MCP",
    package: "mcp-google-ads",
    description:
      "MCP server for Google Ads API with MCC support, 35 tools for campaign management, and built-in safeguards.",
    longDescription:
      "A production-grade MCP server for Google Ads with full Multi-Client Center (MCC) support. Manage campaigns, ad groups, keywords, and ads across multiple accounts. Safe-by-default — all creates are PAUSED, with an approval workflow for destructive actions. Supports GAQL queries for custom reporting.",
    platform: "Google Ads",
    toolCount: 35,
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
    ],
    status: "published",
  },
  {
    slug: "linkedin-ads",
    name: "LinkedIn Ads MCP",
    package: "mcp-linkedin-ads",
    description:
      "65+ tools for LinkedIn Campaign Manager with multi-account management, proven across 65+ active campaigns.",
    longDescription:
      "The most comprehensive MCP server for LinkedIn advertising. Full CRUD for campaigns, ads, and creatives with advanced targeting by demographics, job titles, companies, and locations. Budget and bid optimization, audience insights, and conversion tracking — all through a single MCP interface.",
    platform: "LinkedIn Ads",
    toolCount: 65,
    githubRepo: "mharnett/mcp-linkedin-ads",
    npmPackage: "mcp-linkedin-ads",
    installCommand: "npx mcp-linkedin-ads",
    features: [
      "65+ tools for full campaign management",
      "Multi-account management",
      "Demographic and job title targeting",
      "Company and location targeting",
      "Budget and bid optimization",
      "Creative management and A/B testing",
      "Conversion tracking setup",
      "Audience insights and reporting",
    ],
    status: "published",
  },
  {
    slug: "bing-ads",
    name: "Bing Ads MCP",
    package: "mcp-bing-ads",
    description:
      "30+ tools for Microsoft Advertising — campaign management, quality scores, shared negatives, and bid automation.",
    longDescription:
      "A comprehensive MCP server for Microsoft Advertising (Bing Ads). Manage campaigns, ad groups, and keywords with quality score reporting, shared negative keyword management, and bid automation. The first open-source Bing Ads MCP server available.",
    platform: "Microsoft Advertising",
    toolCount: 30,
    githubRepo: "mharnett/mcp-bing-ads",
    npmPackage: "mcp-bing-ads",
    installCommand: "npx mcp-bing-ads",
    features: [
      "Campaign, ad group, and keyword management",
      "Quality score reporting",
      "Shared negative keyword management",
      "Bid automation and optimization",
      "Search term reports",
      "Performance analysis and reporting",
      "Budget management",
      "First open-source Bing Ads MCP",
    ],
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
];

export const totalToolCount = tools.reduce((sum, t) => sum + t.toolCount, 0);
export const publishedCount = tools.filter(
  (t) => t.status === "published"
).length;
