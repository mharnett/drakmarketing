import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Coffee,
  FileText,
  Scale,
  Search,
  ShieldCheck,
} from "lucide-react";

// A Stripe Payment Link is a public URL (safe to expose client-side), so the
// live pay-what-you-want link is the default. Override via Vercel env
// NEXT_PUBLIC_STRIPE_DONATE_URL (e.g. a test-mode link for preview deploys).
// Setting it to an empty string hides the button instead of shipping a dead link.
const DEFAULT_DONATE_URL = "https://donate.stripe.com/7sY7sK0HWgAOfw9dbL1Jm00";
const envDonateUrl = process.env.NEXT_PUBLIC_STRIPE_DONATE_URL;
const donateUrl = envDonateUrl === undefined ? DEFAULT_DONATE_URL : envDonateUrl;

const NAME = "Trademark SERP Watch";
const DESCRIPTION =
  "A Claude Code skill that finds competitors misusing your brand in search-engine ad copy and prepares a Google Ads trademark complaint — with the evidence and the draft, but never the auto-submit.";

export const metadata: Metadata = {
  title: NAME,
  description: DESCRIPTION,
};

const steps = [
  {
    icon: Scale,
    title: "Look up the registration",
    body: "Resolves your brand to its live USPTO trademark registration(s) and surfaces every match — you confirm the one whose class covers your product.",
  },
  {
    icon: Search,
    title: "Sample live search ads",
    body: "Runs your brand-intent queries against live search results and captures the ads as served — which is the only way to catch a mark inserted via dynamic keyword insertion.",
  },
  {
    icon: ShieldCheck,
    title: "Classify against Google's policy",
    body: "Reads each advertiser's landing page and buckets it: reseller, review/informational, partner, or genuinely competitive. Only unambiguous competitive use is flagged — permitted uses are never treated as violations.",
  },
  {
    icon: FileText,
    title: "Assemble a reviewed draft",
    body: "Builds an evidence dossier per candidate — triggering term, screenshot, landing page, and the registration to cite — pre-filled into Google's complaint form for you to review and submit.",
  },
];

const features = [
  "USPTO registration lookup — never auto-picks the wrong mark",
  "Live SERP capture that catches dynamic-keyword-insertion of your brand",
  "Conservative policy classifier — won't flag permitted reseller / review / partner ads",
  "Per-candidate evidence dossier with screenshot and triggering term",
  "Pre-filled Google Ads complaint package for human review",
  "Free to run — no API key or account setup on your end",
];

const faqs = [
  {
    q: "Does a competitor using my brand in their ad mean they're infringing?",
    a: "Not by itself. Google lets anyone bid on a competitor's trademarked keyword, and it permits the trademark in ad text for resellers, review/informational sites, and partners. Only competitive use — the mark used to divert to a rival product — violates policy, and that turns on the landing page. This tool classifies the landing page instead of matching a string, so it won't push you to file on a permitted use.",
  },
  {
    q: "Will it submit the complaint for me?",
    a: "No — by design. Google's complaint is a good-faith-belief legal attestation filed under the trademark owner's identity, and Google requires a human at the owner to complete an authorization step. The skill stops at a reviewed, pre-filled draft that you submit.",
  },
  {
    q: "What do I need to run it?",
    a: "Just Claude Code. The skill calls a free, hosted search service, so there's no API key or account setup on your end. (Power users can plug in their own SerpAPI key to run unthrottled.)",
  },
  {
    q: "Is it free?",
    a: "Yes — free to use, no key required. The searches behind each run cost a little, and those costs are covered by tips. If it saves you time, chipping in below keeps it running for everyone.",
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Tools",
        item: "https://drakmarketing.com/tools",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: NAME,
        item: "https://drakmarketing.com/tools/trademark-serp-watch",
      },
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

      <div className="mb-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Claude Code skill
          </span>
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            Beta
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{NAME}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {DESCRIPTION}
        </p>
      </div>

      {/* How it works */}
      <div className="mb-12">
        <h2 className="mb-5 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="rounded-lg border border-border p-5"
            >
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
          This does in a couple of minutes what used to be an afternoon of
          scrolling through search results. It&apos;s free to run — no key, no
          setup — but each run does quietly rack up a little search cost on my
          end. If it just handed you an extended coffee break, feel free to leave
          a commensurate tip — enough for a cortado, or the whole café, entirely
          your call. Tips cover those search costs and keep it current with
          Google&apos;s policy changes.
        </p>
        {donateUrl ? (
          <a
            href={donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <Coffee className="h-4 w-4" />
            Leave a tip
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
        <h2 className="mb-6 text-lg font-semibold">
          Frequently Asked Questions
        </h2>
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
