import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { allCaseStudies } from "@/lib/case-studies";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allCaseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = allCaseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: cs.headline,
    description: cs.description.slice(0, 160),
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = allCaseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Link
        href="/work"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All work
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {cs.headline}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {cs.description}
        </p>
      </div>

      {/* Results */}
      {cs.results.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
            Results
          </h2>
          <ul className="space-y-2">
            {cs.results.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Platforms */}
      <div className="mb-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
          Platforms
        </h2>
        <div className="flex flex-wrap gap-2">
          {cs.platforms.map((p) => (
            <Badge key={p} variant="secondary">
              {p}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
