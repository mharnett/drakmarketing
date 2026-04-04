import type { Metadata } from "next";
import { ToolCard } from "@/components/tool-card";
import { tools, totalToolCount } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Free Marketing Tools",
  description: `${totalToolCount}+ open-source MCP tools for Google Ads, LinkedIn Ads, Bing Ads, GA4, and more. Install with a single command.`,
};

export default function ToolsPage() {
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
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
