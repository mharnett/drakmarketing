import Link from "next/link";
import { ArrowRight, Check, Terminal, Wrench, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ToolCard } from "@/components/tool-card";
import { tools, totalToolCount, publishedCount } from "@/lib/tools-data";
import { featuredCaseStudies } from "@/lib/case-studies";

const featured = tools.filter((t) =>
  ["google-ads", "linkedin-ads", "bing-ads", "ga4"].includes(t.slug)
);

export default function Home() {
  return (
    <>
      {/* Hero — dark with gradient */}
      <section className="relative overflow-hidden bg-[oklch(0.18_0.02_230)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.3_0.12_195)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.25_0.1_75/0.3)_0%,transparent_50%)]" />
        {/* Floating geometric accents */}
        <div className="absolute top-20 right-[15%] hidden lg:block">
          <div className="animate-float opacity-20">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <rect x="20" y="80" width="16" height="40" rx="2" fill="oklch(0.72 0.14 75)" opacity="0.6" />
              <rect x="42" y="55" width="16" height="65" rx="2" fill="oklch(0.72 0.14 75)" opacity="0.7" />
              <rect x="64" y="35" width="16" height="85" rx="2" fill="oklch(0.72 0.14 75)" opacity="0.8" />
              <rect x="86" y="15" width="16" height="105" rx="2" fill="oklch(0.72 0.14 75)" opacity="0.9" />
              <path d="M28 75 L50 50 L72 30 L94 10" stroke="oklch(0.55 0.12 195)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-24 right-[8%] hidden lg:block">
          <div className="animate-float-delayed opacity-15">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" stroke="oklch(0.55 0.12 195)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="40" cy="40" r="20" stroke="oklch(0.72 0.14 75)" strokeWidth="1" />
              <circle cx="40" cy="40" r="4" fill="oklch(0.72 0.14 75)" />
            </svg>
          </div>
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-36 md:pb-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-[oklch(0.72_0.14_75)]" />
              Open-source MCP marketing suite
            </div>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <span className="text-[oklch(0.72_0.14_75)]">{totalToolCount}+</span> marketing
              tools.
              <br />
              <span className="text-white/50">One install command.</span>
            </h1>
            <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-xl">
              We build open-source MCP servers that connect AI assistants to
              Google Ads, LinkedIn, Bing, GA4, and more. Free to use. Built from
              25+ years of performance marketing.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/tools"
                className="group inline-flex items-center gap-2 rounded-lg bg-[oklch(0.72_0.14_75)] px-6 py-3 text-sm font-semibold text-[oklch(0.15_0.02_75)] shadow-lg shadow-[oklch(0.72_0.14_75/0.25)] transition-all hover:shadow-xl hover:shadow-[oklch(0.72_0.14_75/0.35)] hover:brightness-110"
              >
                Explore Tools
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/5 hover:text-white"
              >
                See Our Work
              </Link>
            </div>
          </div>

          {/* Install preview */}
          <div className="mt-14 max-w-lg rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
              <span className="ml-2 text-xs text-white/30 font-mono">terminal</span>
            </div>
            <code className="block text-sm font-mono text-white/70">
              <span className="text-[oklch(0.72_0.14_75)]">$</span> npx mcp-google-ads
            </code>
            <code className="block text-sm font-mono text-white/40 mt-1">
              Google Ads MCP server running — 35 tools available
            </code>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
          <StatBlock value={`${totalToolCount}+`} label="MCP tools" />
          <StatBlock value={`${publishedCount}`} label="platforms" />
          <StatBlock value="25+" label="years" />
          <StatBlock value="Free" label="open source" accent />
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              Tools
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Production-grade MCP servers
            </h2>
            <p className="mt-2 text-muted-foreground max-w-lg">
              For the ad platforms you already use. Install, connect to your AI
              assistant, and start managing campaigns in seconds.
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            View all {tools.length} tools <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <Link
          href="/tools"
          className="mt-6 flex items-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden"
        >
          View all tools <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* Case studies — with accent background */}
      <section className="bg-[oklch(0.18_0.02_230)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="mb-3 bg-[oklch(0.72_0.14_75/0.15)] text-[oklch(0.72_0.14_75)] border-[oklch(0.72_0.14_75/0.2)] hover:bg-[oklch(0.72_0.14_75/0.15)]">
                Results
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Real numbers from real campaigns
              </h2>
              <p className="mt-2 text-white/50 max-w-lg">
                Not hypotheticals. These are results from campaigns we manage.
              </p>
            </div>
            <Link
              href="/work"
              className="hidden items-center gap-1 text-sm font-medium text-[oklch(0.72_0.14_75)] hover:underline sm:flex"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {featuredCaseStudies.map((cs) => (
              <Link key={cs.slug} href={`/work/${cs.slug}`}>
                <div className="group h-full rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/8 hover:border-white/15">
                  <h3 className="font-semibold tracking-tight text-sm text-white/90 group-hover:text-[oklch(0.72_0.14_75)] transition-colors">
                    {cs.headline}
                  </h3>
                  <ul className="mt-4 space-y-2 flex-1">
                    {cs.results.slice(0, 3).map((r) => (
                      <li
                        key={r}
                        className="flex items-start gap-2 text-xs text-white/50"
                      >
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-[oklch(0.72_0.14_75)]" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {cs.platforms.slice(0, 2).map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/40"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/work"
            className="mt-6 flex items-center gap-1 text-sm font-medium text-[oklch(0.72_0.14_75)] hover:underline sm:hidden"
          >
            View all work <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
            How it works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps. No configuration.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <Step
            number="01"
            title="Install"
            description="Run a single npx command. No build step, no config files, no API wrappers to write."
            icon={<Terminal className="h-5 w-5" />}
          />
          <Step
            number="02"
            title="Connect"
            description="Add the server to Claude Code, Cursor, or any MCP-compatible AI assistant."
            icon={<Wrench className="h-5 w-5" />}
          />
          <Step
            number="03"
            title="Work"
            description="Manage campaigns, pull reports, and optimize ads through natural conversation."
            icon={<Zap className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-2xl bg-[oklch(0.18_0.02_230)] px-8 py-16 text-center md:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.3_0.12_195/0.3)_0%,transparent_70%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Need help with AI marketing strategy?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/50">
              We consult on paid media, analytics, and AI-powered marketing
              automation. The tools are free — the expertise is what you&apos;re
              paying for.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[oklch(0.72_0.14_75)] px-6 py-3 text-sm font-semibold text-[oklch(0.15_0.02_75)] shadow-lg shadow-[oklch(0.72_0.14_75/0.25)] transition-all hover:shadow-xl hover:brightness-110"
            >
              Start a Conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatBlock({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="border-r border-border last:border-r-0 px-6 py-6 text-center">
      <div
        className={`text-3xl font-bold tracking-tight ${accent ? "text-[oklch(0.72_0.14_75)]" : ""}`}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="text-xs font-mono text-muted-foreground">{number}</span>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
