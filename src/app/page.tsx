import Link from "next/link";
import { ArrowRight, Check, Terminal, Wrench } from "lucide-react";
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
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium tracking-wide text-primary uppercase">
            Open-Source MCP Marketing Suite
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {totalToolCount}+ marketing tools.
            <br />
            <span className="text-muted-foreground">One install command.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
            We build open-source MCP servers that connect AI assistants to Google
            Ads, LinkedIn, Bing, GA4, and more. Free to use. Built from 25+ years
            of performance marketing experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-6">
          <Stat value={`${totalToolCount}+`} label="MCP tools" />
          <Stat value={`${publishedCount}`} label="platforms" />
          <Stat value="25+" label="years experience" />
          <Stat value="Free" label="open source" />
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured Tools
            </h2>
            <p className="mt-2 text-muted-foreground">
              Production-grade MCP servers for the platforms you already use.
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
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

      {/* Case studies */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Client Results
              </h2>
              <p className="mt-2 text-muted-foreground">
                Real numbers from real campaigns.
              </p>
            </div>
            <Link
              href="/work"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {featuredCaseStudies.map((cs) => (
              <Link key={cs.slug} href={`/work/${cs.slug}`}>
                <Card className="group h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex h-full flex-col gap-3 p-6">
                    <h3 className="font-semibold tracking-tight text-sm group-hover:text-primary transition-colors">
                      {cs.headline}
                    </h3>
                    <ul className="space-y-1.5 flex-1">
                      {cs.results.slice(0, 3).map((r) => (
                        <li
                          key={r}
                          className="flex items-start gap-1.5 text-xs text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                          {r}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {cs.platforms.slice(0, 2).map((p) => (
                        <Badge
                          key={p}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <Link
            href="/work"
            className="mt-6 flex items-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden"
          >
            View all work <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-10">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <Step
              number="1"
              title="Install"
              description="Run a single npx command to start any MCP server. No build step, no configuration files."
              icon={<Terminal className="h-5 w-5" />}
            />
            <Step
              number="2"
              title="Connect"
              description="Add the server to Claude Code, Cursor, or any MCP-compatible AI assistant."
              icon={<Wrench className="h-5 w-5" />}
            />
            <Step
              number="3"
              title="Work"
              description="Manage campaigns, pull reports, and optimize ads through natural conversation."
              icon={<ArrowRight className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-xl border border-border bg-muted/30 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Need help with AI marketing strategy?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            We consult on paid media, analytics, and AI-powered marketing
            automation. The tools are free — the expertise is what you&apos;re
            paying for.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start a Conversation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">
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
    <div>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">
        <span className="text-muted-foreground mr-1">{number}.</span>
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
