import type { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/tool-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { tools, totalToolCount } from "@/lib/tools-data";
import { getAllToolStats } from "@/lib/tool-stats";

export const metadata: Metadata = {
  title: "Free Marketing Tools",
  description: `${totalToolCount}+ open-source MCP tools for Google Ads, LinkedIn Ads, Bing Ads, GA4, and more. Install with a single command.`,
};

export default async function ToolsPage() {
  const stats = await getAllToolStats(tools);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          MCP Marketing Suite
        </h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          {totalToolCount}+ tools across {tools.length} platforms. Every server
          is open source, free to use, and installs with a single command.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} stats={stats[tool.slug]} />
        ))}
      </div>

      {/* Claude Code skills — packaged workflows, not MCP servers */}
      <div className="mt-16 border-t border-border pt-12">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">
            Claude Code Skills
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Packaged skills that run inside Claude Code — task workflows, not MCP
            servers.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/tools/trademark-serp-watch">
            <Card className="group h-full transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
                    Trademark SERP Watch
                  </h3>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    Skill
                  </Badge>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  Find competitors misusing your brand in search ad copy and
                  prepare a Google trademark complaint — evidence and draft,
                  never auto-submit.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
