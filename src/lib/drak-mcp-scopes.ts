export interface McpServer {
  name: string;
  description: string;
  scopes: string[];
  npm: string;
}

// Servers that authorize through the drak_mcp OAuth app. Their scopes must
// match the drak_mcp consent screen exactly; see drak-mcp-scopes.test.ts.
export const drakMcpServers: McpServer[] = [
  {
    name: "mcp-google-ads",
    description:
      "Read campaign, keyword, and search-term performance; create campaigns, ad groups, and ads; manage budgets and bids. Safe by default — all mutations are created PAUSED.",
    scopes: ["https://www.googleapis.com/auth/adwords"],
    npm: "https://www.npmjs.com/package/mcp-google-ads",
  },
  {
    name: "mcp-ga4 (read-only)",
    description:
      "Run standard and realtime reports; list data streams, custom dimensions, and custom metrics. On the drak_mcp app it runs read-only and makes no changes to your GA4 properties.",
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    npm: "https://www.npmjs.com/package/mcp-ga4",
  },
  {
    name: "mcp-google-gsc",
    description:
      "Query Search Console search analytics, list verified sites, inspect URL indexing status. Read-only.",
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    npm: "https://www.npmjs.com/package/mcp-google-gsc",
  },
];

// Servers that need broader scopes and do not use the drak_mcp app: the user
// authorizes them with an OAuth client from their own Google Cloud project.
export const ownClientServers: McpServer[] = [
  {
    name: "mcp-gtm-ga4",
    description:
      "List and edit tags, triggers, and variables in Google Tag Manager containers; create container versions and previews; create GA4 custom dimensions.",
    scopes: [
      "https://www.googleapis.com/auth/tagmanager.edit.containers",
      "https://www.googleapis.com/auth/tagmanager.edit.containerversions",
      "https://www.googleapis.com/auth/tagmanager.publish",
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/analytics.edit",
    ],
    npm: "https://www.npmjs.com/package/mcp-gtm-ga4",
  },
  {
    name: "mcp-ga4 (with custom-dimension writes)",
    description:
      "The same GA4 server with its custom-dimension tool enabled, which needs analytics.edit.",
    scopes: [
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/analytics.edit",
    ],
    npm: "https://www.npmjs.com/package/mcp-ga4",
  },
];

export const drakMcpScopes: string[] = [
  ...new Set(drakMcpServers.flatMap((s) => s.scopes)),
];
