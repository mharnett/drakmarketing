import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
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

      <header className="mb-8">
        <time className="text-xs text-muted-foreground uppercase tracking-wide">
          {formatFunProjectDate(project.date)}
        </time>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {project.title}
        </h1>
      </header>

      {project.heroImage && (
        <figure className="mb-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border">
            <Image
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          {project.heroImage.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground italic">
              {project.heroImage.caption}
            </figcaption>
          )}
        </figure>
      )}

      <div className="prose prose-neutral max-w-none text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_p]:text-muted-foreground [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80">
        {renderContent(project.content)}
      </div>

      {project.appUrl && (
        <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Own a Spark Grill? Launch the replacement app in Chrome on your
            Android phone:
          </p>
          <a
            href={project.appUrl}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            Launch app
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </article>
  );
}

function renderContent(content: string) {
  const blocks = content.split("\n\n");
  return blocks.map((block, i) => {
    // Heading
    if (block.startsWith("## ")) {
      return <h2 key={i}>{block.replace("## ", "")}</h2>;
    }

    // Image block: ![alt](src) followed optionally by *caption*
    const imgMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\s*\n\*([^*]+)\*)?$/);
    if (imgMatch) {
      const [, alt, src, caption] = imgMatch;
      return (
        <figure key={i} className="my-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain bg-muted"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground italic">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // Bold-only paragraph
    if (block.startsWith("**") && block.endsWith("**") && !block.includes("\n")) {
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
  });
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
