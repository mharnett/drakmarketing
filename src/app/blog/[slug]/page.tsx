import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { allBlogPosts, formatDate } from "@/lib/blog-posts";
import { type PostBlock, parsePostBlocks } from "@/lib/blog-markdown";
import { blogPostMetadata, postJsonLd } from "@/lib/blog-seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allBlogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return blogPostMetadata(post);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      {postJsonLd(post).map((ld) => (
        <script
          key={ld["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
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
          By{" "}
          <Link href="/about" rel="author" className="underline underline-offset-2 hover:text-foreground">
            {post.author}
          </Link>
        </p>
      </header>

      <div className="prose prose-neutral max-w-none text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:text-muted-foreground [&_strong]:text-foreground [&_ul]:text-muted-foreground [&_li]:mb-1">
        {parsePostBlocks(post.content).map((block, i) => renderBlock(block, i))}
      </div>
    </article>
  );
}

function renderBlock(block: PostBlock, i: number) {
  switch (block.kind) {
    case "video":
      return (
        <video
          key={i}
          src={block.src}
          poster={block.poster}
          aria-label={block.alt}
          className="my-6 w-full rounded-md border"
          autoPlay
          muted
          loop
          playsInline
          controls
        />
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element -- static SVG chart; it adapts to dark mode itself
        <img key={i} src={block.src} alt={block.alt} className="my-6 w-full rounded-md border" />
      );
    case "h3":
      return <h3 key={i}>{block.text}</h3>;
    case "h2":
      return <h2 key={i}>{block.text}</h2>;
    case "strong":
      return (
        <p key={i}>
          <strong>{block.text}</strong>
        </p>
      );
    case "list":
      return (
        <ul key={i}>
          {block.items.map((html, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </ul>
      );
    case "italic":
      return (
        <p key={i} className="italic">
          {block.text}
        </p>
      );
    case "paragraph":
      return <p key={i} dangerouslySetInnerHTML={{ __html: block.html }} />;
  }
}
