import type { Metadata } from "next";
import Link from "next/link";
import { funProjects, formatFunProjectDate } from "@/lib/fun-projects";

export const metadata: Metadata = {
  title: "Fun Projects",
  description:
    "Side projects and reverse-engineering experiments. Things I built for fun with Claude Code.",
};

export default function FunProjectsPage() {
  const sorted = [...funProjects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Fun Projects
        </h1>
        <p className="mt-3 text-muted-foreground">
          Side projects and reverse-engineering experiments. Things I built for
          fun with Claude Code.
        </p>
      </div>

      <div className="space-y-10">
        {sorted.map((project) => (
          <article key={project.slug} className="group">
            <Link href={`/fun-projects/${project.slug}`} className="block">
              <time className="text-xs text-muted-foreground uppercase tracking-wide">
                {formatFunProjectDate(project.date)}
              </time>
              <h2 className="mt-1 text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                {project.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {project.excerpt}
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
