import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "drak marketing builds open-source AI marketing tools and consults on paid media strategy. 25+ years of performance marketing experience.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        About drak marketing
      </h1>

      <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
        <p>
          drak marketing is a team of analytical marketers with over 25 years of
          online advertising experience. Internet marketing channels have evolved
          and changed over time. Taking an analytical approach to measuring return
          on investment and pairing that with deep customer insights consistently
          leads to high performing campaigns.
        </p>
        <p>
          We started building open-source tools because we kept solving the same
          problem: connecting AI assistants to the ad platforms we manage every
          day. Instead of building one-off integrations for each client, we
          open-sourced everything.
        </p>
        <p>
          The result is a suite of{" "}
          <strong className="text-foreground">8 MCP servers</strong> covering
          Google Ads, LinkedIn, Bing, Meta, Reddit, GA4, Search Console, and
          Google Tag Manager — over{" "}
          <strong className="text-foreground">124 tools</strong> that anyone can
          install with a single command.
        </p>
        <p>
          The tools are free. When clients need help with strategy, campaign
          architecture, or building custom AI workflows for their marketing
          teams, that&apos;s where we come in.
        </p>
      </div>

      {/* Certifications */}
      <div className="mt-12 flex items-center gap-6">
        <div className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground">
          Google Partner
        </div>
        <div className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground">
          Meta Business Partner
        </div>
      </div>
    </section>
  );
}
