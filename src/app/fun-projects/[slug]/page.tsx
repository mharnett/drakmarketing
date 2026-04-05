import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { funProjects, formatFunProjectDate } from "@/lib/fun-projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return funProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = funProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt,
  };
}

export default async function FunProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = funProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link
        href="/fun-projects"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All projects
      </Link>

      <header className="mb-10">
        <time className="text-xs text-muted-foreground uppercase tracking-wide">
          {formatFunProjectDate(project.date)}
        </time>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {project.title}
        </h1>

        {(project.appUrl || project.repoUrl) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {project.appUrl && (
              <a
                href={project.appUrl}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                Launch app
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                View source
              </a>
            )}
          </div>
        )}
      </header>

      <div className="prose prose-neutral max-w-none text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_p]:text-muted-foreground [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80">
        {project.content.split("\n\n").map((block, i) => {
          if (block.startsWith("## ")) {
            return <h2 key={i}>{block.replace("## ", "")}</h2>;
          }
          if (block.startsWith("**") && block.endsWith("**")) {
            return (
              <p key={i}>
                <strong>{block.replace(/\*\*/g, "")}</strong>
              </p>
            );
          }
          return (
            <p
              key={i}
              dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block) }}
            />
          );
        })}
      </div>
    </article>
  );
}

function renderInlineMarkdown(text: string): string {
  return text
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
