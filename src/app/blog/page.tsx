import type { Metadata } from "next";
import Link from "next/link";
import { allBlogPosts, formatDate } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical advice on Google Ads, Facebook advertising, digital marketing strategy, and AI-powered marketing automation.",
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-3 text-muted-foreground">
          Practical marketing advice from 25+ years of running campaigns.
        </p>
      </div>

      <div className="space-y-10">
        {allBlogPosts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <time className="text-xs text-muted-foreground uppercase tracking-wide">
                {formatDate(post.date)}
              </time>
              <h2 className="mt-1 text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
              <span className="mt-2 inline-block text-sm font-medium text-primary">
                Read more
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
