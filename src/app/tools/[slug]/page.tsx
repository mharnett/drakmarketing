import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { InstallCommand } from "@/components/install-command";
import { tools } from "@/lib/tools-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Link
        href="/tools"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All tools
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
          <Badge variant="secondary">{tool.toolCount} tools</Badge>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {tool.longDescription}
        </p>
      </div>

      {/* Install */}
      {tool.installCommand && (
        <div className="mb-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Install
          </h2>
          <InstallCommand command={tool.installCommand} />
        </div>
      )}

      {/* Features */}
      <div className="mb-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {tool.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        {tool.githubRepo && (
          <a
            href={`https://github.com/${tool.githubRepo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
            <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
          </a>
        )}
        {tool.npmPackage && (
          <a
            href={`https://www.npmjs.com/package/${tool.npmPackage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            npm
            <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
          </a>
        )}
      </div>

      {/* FAQ for GEO */}
      <div className="mt-16 border-t border-border pt-10">
        <h2 className="text-lg font-semibold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <Faq
            q={`How do I install ${tool.name}?`}
            a={
              tool.installCommand
                ? `Run \`${tool.installCommand}\` in your terminal. No build step or additional configuration required.`
                : `${tool.name} is available as a hosted service. See the documentation for setup instructions.`
            }
          />
          <Faq
            q={`What does ${tool.name} do?`}
            a={tool.longDescription}
          />
          <Faq
            q={`Is ${tool.name} free?`}
            a={`Yes. ${tool.name} is open source and free to use. The source code is available on GitHub.`}
          />
          <Faq
            q={`What AI assistants does ${tool.name} work with?`}
            a="Any MCP-compatible AI assistant, including Claude Code, Claude Desktop, Cursor, Windsurf, and others that support the Model Context Protocol."
          />
        </div>
      </div>
    </section>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <h3 className="font-medium">{q}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{a}</p>
    </div>
  );
}
