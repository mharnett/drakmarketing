import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "drak-mcp — AI assistant access to your marketing platforms",
  description:
    "Drak Marketing's open-source MCP servers let Claude and other AI assistants securely query and manage Google Ads, Google Analytics 4, Google Search Console, Google Tag Manager, and other marketing platforms on your behalf.",
};

const mcps: Array<{
  name: string;
  description: string;
  scopes: string[];
  npm: string;
}> = [
  {
    name: "mcp-google-ads",
    description:
      "Read campaign, keyword, and search-term performance; create campaigns, ad groups, and ads; manage budgets and bids. Safe by default — all mutations are created PAUSED.",
    scopes: ["https://www.googleapis.com/auth/adwords"],
    npm: "https://www.npmjs.com/package/mcp-google-ads",
  },
  {
    name: "mcp-ga4",
    description:
      "Run standard and realtime reports, list and create custom dimensions and metrics, inspect data streams.",
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    npm: "https://www.npmjs.com/package/mcp-ga4",
  },
  {
    name: "mcp-google-gsc",
    description:
      "Query Search Console search analytics, list verified sites, inspect URL indexing status.",
    scopes: [
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/webmasters",
    ],
    npm: "https://www.npmjs.com/package/mcp-google-gsc",
  },
  {
    name: "neon-one-gtm",
    description:
      "List tags, triggers, and variables in Google Tag Manager containers; create GA4 tags; preview and publish container versions.",
    scopes: [
      "https://www.googleapis.com/auth/tagmanager.readonly",
      "https://www.googleapis.com/auth/tagmanager.edit.containers",
      "https://www.googleapis.com/auth/tagmanager.publish",
    ],
    npm: "https://www.npmjs.com/package/neon-one-gtm",
  },
];

export default function DrakMcpPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">drak-mcp</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        AI assistant access to your marketing platforms, via open-source MCP servers.
      </p>

      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">What it is</h2>
          <p>
            <strong className="text-foreground">drak-mcp</strong> is a set of open-source Model
            Context Protocol (MCP) servers published by Drak Marketing. They let Claude Desktop,
            Claude Code, and other MCP-compatible AI assistants securely query and manage
            marketing platforms on your behalf — Google Ads, Google Analytics 4, Google Search
            Console, Google Tag Manager, Meta Ads, Bing Ads, and more.
          </p>
          <p className="mt-3">
            Each MCP runs locally on your own computer. The OAuth credentials you grant stay on
            your machine. Drak Marketing never sees your tokens or your marketing data.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">Who uses it</h2>
          <p>
            Internal Drak Marketing staff managing client accounts, plus the teams at our client
            organizations who want to run reports and workflows through their own AI assistants.
            The code is open-source under the MIT license — anyone may install and use it
            independently.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Google APIs and OAuth scopes used
          </h2>
          <p>
            The MCP servers below request specific OAuth scopes from your Google account when you
            first authorize them. Each scope is scoped to exactly what the MCP needs — no broad
            Google-wide permissions.
          </p>
          <div className="mt-4 space-y-4">
            {mcps.map((m) => (
              <div key={m.name} className="border-l-2 border-muted pl-4">
                <p className="font-semibold text-foreground">{m.name}</p>
                <p className="mt-1">{m.description}</p>
                <p className="mt-2 text-xs">
                  <span className="font-medium text-foreground">Scopes:</span>{" "}
                  <code className="text-xs break-all">{m.scopes.join(", ")}</code>
                </p>
                <p className="mt-1 text-xs">
                  <a href={m.npm} className="font-medium text-foreground hover:underline">
                    npm package →
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">How authorization works</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              You run the setup command for the MCP you want (e.g.{" "}
              <code>npx mcp-google-ads-auth</code>).
            </li>
            <li>
              Your browser opens to Google&apos;s standard OAuth consent screen. You review the
              requested scopes and the &quot;drak_mcp&quot; app name, then approve.
            </li>
            <li>
              Google issues a refresh token scoped to your account. The MCP stores it locally on
              your own computer under{" "}
              <code className="text-xs">~/Library/Preferences/</code> (macOS) or{" "}
              <code className="text-xs">%APPDATA%</code> (Windows).
            </li>
            <li>
              From that point on, Claude Desktop can query the platform through the MCP. All API
              calls happen locally between your machine and Google.
            </li>
          </ol>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">How to revoke access</h2>
          <p>
            At any time you can revoke the OAuth grant from your Google account at{" "}
            <a
              href="https://myaccount.google.com/permissions"
              className="font-medium text-foreground hover:underline"
            >
              myaccount.google.com/permissions
            </a>
            . Look for &quot;drak_mcp&quot; and click &quot;Remove access&quot;. You can also
            delete the local credentials file to clear stored tokens.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">Source code</h2>
          <p>
            All MCP servers are published open-source under MIT license at{" "}
            <a
              href="https://github.com/mharnett"
              className="font-medium text-foreground hover:underline"
            >
              github.com/mharnett
            </a>{" "}
            and on npm. You can audit exactly what the code does before granting OAuth access.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">Privacy</h2>
          <p>
            Because all data flows stay on your local machine and between your machine and Google,
            Drak Marketing never receives your marketing data or OAuth tokens. See our full{" "}
            <Link href="/privacy" className="font-medium text-foreground hover:underline">
              privacy policy
            </Link>{" "}
            for details, including the dedicated section covering drak-mcp OAuth handling.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">Contact</h2>
          <p>
            Questions about drak-mcp, security concerns, or verification requests? Email{" "}
            <a
              href="mailto:mark@drakmarketing.com"
              className="font-medium text-foreground hover:underline"
            >
              mark@drakmarketing.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
