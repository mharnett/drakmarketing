export interface McpServer {
  name: string;
  description: string;
  scopes: string[];
  npm: string;
}

// Servers whose published package signs in through the drak-mcp OAuth app.
// Only mcp-google-ads 1.x embeds that client; see drak-mcp-scopes.test.ts.
export const drakMcpServers: McpServer[] = [
  {
    name: "mcp-google-ads",
    description:
      "Read campaign, keyword, and search-term performance; create campaigns, ad groups, and ads; manage budgets and bids. Safe by default — all mutations are created PAUSED. Versions up to 1.16.1 sign in through the drak-mcp app unless you set your own client. The next major release (2.0) requires your own OAuth client, like the servers below.",
    scopes: ["https://www.googleapis.com/auth/adwords"],
    npm: "https://www.npmjs.com/package/mcp-google-ads",
  },
];

// Servers whose published package embeds no OAuth client: the user
// authorizes them with a client from their own Google Cloud project.
export const ownClientServers: McpServer[] = [
  {
    name: "mcp-ga4",
    description:
      "Run standard and realtime reports; list data streams, custom dimensions, and custom metrics. Only the custom-dimension tool needs analytics.edit; without it the server needs only analytics.readonly.",
    scopes: [
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/analytics.edit",
    ],
    npm: "https://www.npmjs.com/package/mcp-ga4",
  },
  {
    name: "mcp-google-gsc",
    description:
      "Query Search Console search analytics, list verified sites, inspect URL indexing status. Read-only.",
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    npm: "https://www.npmjs.com/package/mcp-google-gsc",
  },
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
];

export const drakMcpScopes: string[] = [
  ...new Set(drakMcpServers.flatMap((s) => s.scopes)),
];
