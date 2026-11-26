import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Drak Marketing privacy policy.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: November 25, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Who we are
          </h2>
          <p>
            Drak Marketing (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
            operates the website drakmarketing.com. This policy explains how we
            collect, use, and protect your information.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Information we collect
          </h2>
          <p>
            We collect information you voluntarily provide through our contact
            form: your name, email address, and message. We also collect
            standard server logs (IP address, browser type, pages visited) and,
            through Google Analytics, usage data such as pages viewed, device
            and browser type, and approximate location.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            How we use your information
          </h2>
          <p>
            We use your contact information solely to respond to your inquiry.
            We do not sell, rent, or share your personal information with third
            parties for marketing purposes.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            drak-mcp OAuth handling (Google user data)
          </h2>
          <p>
            Drak Marketing publishes a set of open-source Model Context Protocol
            (MCP) servers, collectively referred to as{" "}
            <a
              href="/drak-mcp"
              className="font-medium text-foreground hover:underline"
            >
              drak-mcp
            </a>
            , that let AI assistants such as Claude Desktop query and manage
            Google Ads, Google Analytics 4, Google Search Console, Google Tag
            Manager, and other marketing platforms on behalf of the signed-in
            user. The OAuth app is registered with Google as{" "}
            <strong className="text-foreground">drak-mcp</strong>.
          </p>
          <p className="mt-3">
            Only mcp-google-ads signs in through the drak-mcp app. The other
            servers use an OAuth client from your own Google Cloud project.
            This section covers how all of them handle Google user data.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">
              What data drak-mcp accesses.
            </strong>{" "}
            Only the Google APIs and scopes you approve during the OAuth consent
            flow. Depending on the server, that is: Google Ads account
            structure, campaigns, ad groups, ads, keywords, budgets, bids,
            conversion settings, and performance and search-term reports
            (<code className="text-xs">adwords</code>); Google Analytics 4
            reports and property, data stream and custom definition settings
            (<code className="text-xs">analytics.readonly</code>, plus{" "}
            <code className="text-xs">analytics.edit</code> for custom
            dimensions); Search Console search analytics, verified sites and URL
            inspection results (<code className="text-xs">webmasters.readonly</code>);
            and Tag Manager containers, tags, triggers, variables and versions.
            The complete scope list per MCP is published at{" "}
            <a
              href="/drak-mcp"
              className="font-medium text-foreground hover:underline"
            >
              drakmarketing.com/drak-mcp
            </a>
            .
          </p>
          <p className="mt-3">
            <strong className="text-foreground">How drak-mcp uses it.</strong>{" "}
            Only to carry out the requests you make through your AI assistant:
            run the report you ask for, return the result, or make the change
            you ask for. drak-mcp does not use Google user data for
            advertising, does not sell it, and does not send it to Drak
            Marketing. Drak Marketing does not use it to build or train AI
            models.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">
              Transfer to your AI provider.
            </strong>{" "}
            When a tool runs, its result (for example report rows, account and
            campaign names, or settings) goes back to the AI assistant you
            connected it to. That assistant sends it to the AI provider you
            choose (for example, Anthropic for Claude) as part of the
            conversation, under that provider&apos;s terms and privacy policy.
            This is the only transfer: Google user data is not sent to Drak
            Marketing or to any other third party.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">How it is protected.</strong>{" "}
            The MCP servers run locally on your own computer, and API calls go
            directly from your computer to Google over HTTPS. Drak Marketing
            operates no server that receives or proxies your OAuth tokens, API
            responses, or marketing data. Refresh tokens are stored only on your
            own computer. mcp-google-ads, mcp-google-gsc and mcp-gtm-ga4 write
            their credentials file as owner-only, so on macOS and Linux only
            your user account can read it (for example,{" "}
            <code className="text-xs">
              ~/Library/Preferences/mcp-google-ads-nodejs/credentials.json
            </code>{" "}
            on macOS). mcp-ga4&apos;s setup writes its token into your AI
            app&apos;s MCP configuration file; protect that file as you would a
            password.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">Local request log.</strong>{" "}
            On macOS, mcp-google-ads writes one line per Google Ads API call to{" "}
            <code className="text-xs">
              ~/Library/Logs/google-ads-requests.jsonl
            </code>
            : the time, caller, computer name, process ids, method, customer
            id, operation count, whether the call was validate-only, status,
            error code and, for a successful change, the resource name of each
            item it wrote. It never records tokens, queries, request bodies or
            report rows. On Linux and Windows the same line goes to standard
            error, which your AI app may keep in its own logs. You can set{" "}
            <code className="text-xs">GOOGLE_ADS_REQUEST_LOG_PATH</code> to
            write it elsewhere. Separately, mcp-ga4 saves notes its feedback
            tools record to{" "}
            <code className="text-xs">~/.config/mcp-ga4/feedback/</code> on your
            computer.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">Retention and deletion.</strong>{" "}
            Drak Marketing holds no Google user data from drak-mcp, so there is
            nothing on our side to retain or delete. On your computer, tokens
            stay in the credentials file until you delete it. The request log
            is rotated at 20 MB, keeping at most the current file and one
            previous file (<code className="text-xs">.1</code>), until you
            delete them. Your AI provider keeps conversation content under its
            own retention settings; delete it there. To remove everything:
            revoke the grant at{" "}
            <a
              href="https://myaccount.google.com/permissions"
              className="font-medium text-foreground hover:underline"
            >
              myaccount.google.com/permissions
            </a>
            , delete the credentials file and the request log files, and delete
            the conversations with your AI provider.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">Limited Use.</strong>{" "}
            drak-mcp&apos;s use and transfer of information received from
            Google APIs adheres to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              className="font-medium text-foreground hover:underline"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">
              How to revoke access.
            </strong>{" "}
            You can revoke the drak-mcp OAuth grant, or the grant to your own
            app, at any time from{" "}
            <a
              href="https://myaccount.google.com/permissions"
              className="font-medium text-foreground hover:underline"
            >
              myaccount.google.com/permissions
            </a>
            . Deleting the local credentials file on your machine also clears
            stored tokens.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">Source code audit.</strong>{" "}
            All MCPs are published open-source under the MIT license at{" "}
            <a
              href="https://github.com/mharnett"
              className="font-medium text-foreground hover:underline"
            >
              github.com/mharnett
            </a>{" "}
            and on npm. You may audit the code at any time before granting
            OAuth access.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Third-party services
          </h2>
          <p>
            Our website is hosted on Vercel. Contact form submissions are
            processed through Formspree. These services may collect standard
            server logs. We use Google Analytics 4 to understand site traffic,
            with advertising features turned off. Each service operates under
            its own privacy policy.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Cookies
          </h2>
          <p>
            We use essential cookies required for the website to function, and
            Google Analytics cookies to measure site traffic. Visitors in the
            European Economic Area, the United Kingdom and Switzerland get no
            analytics cookies; Google Analytics receives only cookieless,
            aggregate measurements from those regions. We set no advertising
            cookies. You can disable cookies in your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Data retention
          </h2>
          <p>
            We retain contact form submissions only as long as needed to respond
            to your inquiry. You may request deletion of your data at any time.
            Drak Marketing holds no Google user data from drak-mcp; see
            retention and deletion in the drak-mcp section above.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Your rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data by contacting us at{" "}
            <a
              href="mailto:hello@drakmarketing.com"
              className="font-medium text-foreground hover:underline"
            >
              hello@drakmarketing.com
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Changes to this policy
          </h2>
          <p>
            We may update this policy from time to time. Changes will be posted
            on this page with an updated date.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Contact
          </h2>
          <p>
            Questions about this policy? Email{" "}
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
