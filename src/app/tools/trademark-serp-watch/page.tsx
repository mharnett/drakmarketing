import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Coffee,
  Download,
  FileText,
  Plug,
  Scale,
  Search,
  ShieldCheck,
  Terminal,
} from "lucide-react";

// Stripe Payment Link (public pay-what-you-want URL). Override via env
// NEXT_PUBLIC_STRIPE_DONATE_URL; empty string hides the button.
const DEFAULT_DONATE_URL = "https://donate.stripe.com/7sY7sK0HWgAOfw9dbL1Jm00";
const envDonateUrl = process.env.NEXT_PUBLIC_STRIPE_DONATE_URL;
const donateUrl = envDonateUrl === undefined ? DEFAULT_DONATE_URL : envDonateUrl;

const NAME = "Trademark SERP Watch";
const DESCRIPTION =
  "Find competitors misusing your brand in search ads and draft the Google trademark complaint — right inside Claude. Evidence and all; it never auto-submits.";

// Primary path: a claude.ai custom connector (paste a URL, no code/download).
const CONNECTOR_URL = "https://drak-stack-monorepo-production.up.railway.app/mcp";

// Secondary path: install as a Claude Code skill.
const INSTALL_CMD = `mkdir -p ~/.claude/skills
curl -sL https://drakmarketing.com/skills/trademark-serp-watch.tar.gz | tar -xz -C ~/.claude/skills`;

export const metadata: Metadata = {
  title: NAME,
  description: DESCRIPTION,
};

const steps = [
  {
    icon: Scale,
    title: "Look up the registration",
    body: "Resolves your brand to its live USPTO registration and surfaces every match — you confirm the right one.",
  },
  {
    icon: Search,
    title: "Sample live search ads",
    body: "Captures ads as actually served across cities — the only way to catch a mark inserted via keyword insertion.",
  },
  {
    icon: ShieldCheck,
    title: "Classify against policy",
    body: "Reads each landing page and flags only genuine competitive use — reseller, review, and partner ads are left alone.",
  },
  {
    icon: FileText,
    title: "Assemble a reviewed draft",
    body: "Builds an evidence dossier + a pre-filled Google complaint for you to review and submit.",
  },
];

const features = [
  "USPTO registration lookup — never auto-picks the wrong mark",
  "Live SERP capture that catches keyword-inserted brand mentions",
  "Conservative classifier — won't flag reseller / review / partner ads",
  "Per-candidate evidence dossier with screenshot and trigger term",
  "Pre-filled Google Ads complaint for human review",
  "Free to run — no API key or setup",
];

const faqs = [
  {
    q: "Does a competitor using my brand in their ad mean infringement?",
    a: "Not by itself. Google allows the trademark in ad text for resellers, reviews, and partners — only competitive use violates policy, and that turns on the landing page. The tool classifies the page, so it won't push you to file on a permitted use.",
  },
  {
    q: "Will it submit the complaint for me?",
    a: "No, by design. The complaint is a legal attestation filed under the owner's identity, and Google requires a human to confirm. The skill stops at a reviewed, pre-filled draft.",
  },
  {
    q: "What do I need to run it?",
    a: "Claude Code. It calls a free hosted search service — no API key or setup. Power users can plug in their own SerpAPI key.",
  },
];

const schemaData = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: NAME,
    description: DESCRIPTION,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Organization",
      name: "Drak Marketing",
      url: "https://drakmarketing.com",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Tools", item: "https://drakmarketing.com/tools" },
      { "@type": "ListItem", position: 2, name: NAME, item: "https://drakmarketing.com/tools/trademark-serp-watch" },
    ],
  },
];

export default function TrademarkSerpWatchPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Link
        href="/tools"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All tools
      </Link>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Claude connector
          </span>
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            Beta
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{NAME}</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {DESCRIPTION}
        </p>
      </div>

      {/* Get started — connector first (above the fold) */}
      <div className="mb-6 rounded-xl border border-border bg-muted/40 p-6 sm:p-7">
        <div className="flex items-center gap-2">
          <Plug className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Add it to Claude — paste one URL</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Works in claude.ai (Free → Enterprise) and Cowork. No code, no download.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-background px-4 py-3 font-mono text-xs leading-relaxed">
          {CONNECTOR_URL}
        </pre>
        <ol className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1.</span> claude.ai →
            Settings → Connectors → <span className="text-foreground">Add custom connector</span>
          </li>
          <li>
            <span className="font-medium text-foreground">2.</span> Paste the URL
            above → Add (leave the auth fields blank)
          </li>
          <li>
            <span className="font-medium text-foreground">3.</span> In any chat, ask:{" "}
            <span className="italic">
              &ldquo;check if competitors are misusing my trademark &lsquo;Neon
              One&rsquo; in search ads&rdquo;
            </span>
          </li>
        </ol>
      </div>

      {/* Secondary — Claude Code */}
      <div className="mb-12 rounded-lg border border-border p-5">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">
            Prefer Claude Code? Install the skill locally
          </h3>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-background px-4 py-3 font-mono text-xs leading-relaxed">
          {INSTALL_CMD}
        </pre>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href="/skills/trademark-serp-watch.tar.gz"
            download
            className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Download skill
          </a>
          <a
            href="/skills/trademark-serp-watch-SKILL.md"
            download
            className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <FileText className="h-4 w-4" />
            SKILL.md
          </a>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Lands in{" "}
          <code className="font-mono">~/.claude/skills/trademark-serp-watch/</code>,
          loads on next start.
        </p>
      </div>

      {/* How it works */}
      <div className="mb-12">
        <h2 className="mb-5 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-lg border border-border p-5">
              <div className="mb-2 flex items-center gap-2">
                <s.icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          What it does
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Support */}
      <div className="mb-12 rounded-xl border border-border bg-muted/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Buy back your coffee break ☕</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Free to run — but each run quietly racks up a little search cost on my
          end. If it saved you an afternoon, buy me a coffee.
        </p>
        {donateUrl ? (
          <a
            href={donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <Coffee className="h-4 w-4" />
            $6.33 tip
          </a>
        ) : (
          <p className="mt-5 inline-flex items-center gap-2 rounded-md border border-dashed border-border px-5 py-2.5 text-sm text-muted-foreground">
            <Coffee className="h-4 w-4" />
            Tip jar opening soon
          </p>
        )}
      </div>

      {/* FAQ */}
      <div className="border-t border-border pt-10">
        <h2 className="mb-6 text-lg font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-medium">{f.q}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
