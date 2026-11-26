import type { Metadata } from "next";
import Link from "next/link";
import { drakMcpServers, ownClientServers, type McpServer } from "@/lib/drak-mcp-scopes";

export const metadata: Metadata = {
  alternates: { canonical: "/drak-mcp" },
  title: "drak-mcp — AI assistant access to your marketing platforms",
  description:
    "Drak Marketing's open-source MCP servers let Claude and other AI assistants query and manage Google Ads, Google Analytics 4, Google Search Console, Google Tag Manager, and other marketing platforms on your behalf.",
};

function ServerList({ servers }: { servers: McpServer[] }) {
  return (
    <div className="mt-4 space-y-4">
      {servers.map((m) => (
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
  );
}

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
            Claude Code, and other MCP-compatible AI assistants query and manage marketing
            platforms on your behalf — Google Ads, Google Analytics 4, Google Search Console,
            Google Tag Manager, Meta Ads, Bing Ads, and more.
          </p>
          <p className="mt-3">
            Each MCP runs locally on your own computer. The OAuth credentials you grant stay on
            your machine, and Drak Marketing never sees your tokens or your marketing data. What
            the tools return does leave your machine: it goes to the AI assistant you connect
            them to, and from there to the AI provider you choose. See{" "}
            <a href="#where-your-data-goes" className="font-medium text-foreground hover:underline">
              where your data goes
            </a>
            .
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
            Servers that use the drak-mcp OAuth app
          </h2>
          <p>
            Only mcp-google-ads signs in through the drak-mcp OAuth app, and it requests one
            scope. You can point it at your own OAuth client instead by setting{" "}
            <code className="text-xs">GOOGLE_ADS_CLIENT_ID</code> and{" "}
            <code className="text-xs">GOOGLE_ADS_CLIENT_SECRET</code>.
          </p>
          <ServerList servers={drakMcpServers} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Servers that use your own OAuth client
          </h2>
          <p>
            The published mcp-ga4, mcp-google-gsc and mcp-gtm-ga4 packages include no OAuth
            client and do not use the drak-mcp app. You authorize them with an OAuth client you
            create in your own Google Cloud project, so the grant is between your account and
            your project, and the consent screen shows your app&apos;s name.
          </p>
          <ServerList servers={ownClientServers} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Changes to the drak-mcp sign-in
          </h2>
          <p>
            mcp-google-ads is moving to the same model as the other servers. The next major
            release (2.0) requires your own OAuth client, and earlier versions will be marked
            deprecated with 7 days&apos; notice. After that notice ends, the drak-mcp app stops
            accepting sign-ins from accounts outside Drak Marketing. If you use mcp-google-ads
            today, create an OAuth client in your own Google Cloud project, enable the Google Ads
            API and request API access; the package README walks through the steps.
          </p>
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
              requested scopes and the app name — &quot;drak-mcp&quot; for mcp-google-ads 1.x,
              or your own app&apos;s name when you use your own client — then approve.
            </li>
            <li>
              Google issues a refresh token scoped to your account. mcp-google-ads and
              mcp-google-gsc store it in a credentials file on your own computer under{" "}
              <code className="text-xs">~/Library/Preferences/</code> (macOS),{" "}
              <code className="text-xs">~/.config/</code> (Linux) or{" "}
              <code className="text-xs">%APPDATA%</code>{" "}(Windows); on macOS and Linux the file is
              set so only your user account can read it. mcp-gtm-ga4&apos;s setup writes it to the
              file you name with <code className="text-xs">--output</code>, also set so only your
              user account can read it. mcp-ga4&apos;s setup writes the token
              into your AI app&apos;s MCP configuration file instead.
            </li>
            <li>
              From that point on, your AI assistant can query the platform through the MCP. API
              calls go directly from your computer to Google over HTTPS.
            </li>
          </ol>
        </div>

        <div id="where-your-data-goes">
          <h2 className="text-base font-semibold text-foreground mb-2">Where your data goes</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-foreground">To Google.</strong>{" "}Requests go straight from
              your computer to Google&apos;s APIs. No Drak Marketing server sits in between.
            </li>
            <li>
              <strong className="text-foreground">To the AI provider you choose.</strong>{" "}When
              a tool runs, its result — report rows, account, campaign and keyword names,
              settings — goes back to your AI assistant, which sends it to its AI provider (for
              example, Anthropic for Claude) as part of the conversation. That provider&apos;s
              terms and retention settings apply. Drak Marketing does not choose the provider and
              does not receive the data.
            </li>
            <li>
              <strong className="text-foreground">To a local request log.</strong> On macOS,
              mcp-google-ads writes one line per Google Ads API call to{" "}
              <code className="text-xs">~/Library/Logs/google-ads-requests.jsonl</code>: the time,
              caller, computer name, method, customer id, operation count, status and, for a
              successful change, the resource name of each item it wrote. It never records
              tokens, queries, request bodies or report rows. On Linux and Windows the same line
              goes to standard error, which your AI app may keep in its own logs. Set{" "}
              <code className="text-xs">GOOGLE_ADS_REQUEST_LOG_PATH</code> to write it elsewhere.
            </li>
          </ul>
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
            . Look for &quot;drak-mcp&quot; (or your own app&apos;s name) and click &quot;Remove
            access&quot;. You can also delete the local credentials file to clear stored tokens,
            and delete the request log at any time.
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
            Drak Marketing runs no server that receives your OAuth tokens or marketing data from
            these MCPs. Your data goes to Google, to the AI provider you choose, and to files on
            your own computer. See our full{" "}
            <Link href="/privacy" className="font-medium text-foreground hover:underline">
              privacy policy
            </Link>{" "}
            for details, including the dedicated section covering drak-mcp and Google user data.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">Contact</h2>
          <p>
            Questions about drak-mcp, security concerns, or verification requests? Email{" "}
            <a
              href="mailto:hello@drakmarketing.com"
              className="font-medium text-foreground hover:underline"
            >
              hello@drakmarketing.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
