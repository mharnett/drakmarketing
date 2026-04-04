import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts, formatDate } from "@/lib/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All posts
      </Link>

      <header className="mb-10">
        <time className="text-xs text-muted-foreground uppercase tracking-wide">
          {formatDate(post.date)}
        </time>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          By {post.author}
        </p>
      </header>

      <div className="prose prose-neutral max-w-none text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_p]:text-muted-foreground [&_strong]:text-foreground [&_ul]:text-muted-foreground [&_li]:mb-1">
        {post.content.split("\n\n").map((block, i) => {
          if (block.startsWith("## ")) {
            return (
              <h2 key={i}>{block.replace("## ", "")}</h2>
            );
          }
          if (block.startsWith("**") && block.endsWith("**")) {
            return (
              <p key={i}>
                <strong>{block.replace(/\*\*/g, "")}</strong>
              </p>
            );
          }
          if (block.startsWith("- ")) {
            return (
              <ul key={i}>
                {block.split("\n").map((item, j) => (
                  <li key={j}>{item.replace("- ", "")}</li>
                ))}
              </ul>
            );
          }
          if (block.startsWith("*") && block.endsWith("*") && !block.startsWith("**")) {
            return (
              <p key={i} className="italic">
                {block.replace(/^\*|\*$/g, "")}
              </p>
            );
          }
          return <p key={i} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block) }} />;
        })}
      </div>
    </article>
  );
}

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
