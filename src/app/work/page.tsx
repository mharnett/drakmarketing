import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  currentCaseStudies,
  legacyCaseStudies,
  type CaseStudy,
} from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and client results. B2B SaaS lead generation, app user acquisition, global market expansion, and more.",
};

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <Link href={`/work/${cs.slug}`}>
      <Card className="group h-full transition-shadow hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold tracking-tight group-hover:text-primary transition-colors">
              {cs.headline}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {cs.description.slice(0, 180)}
            {cs.description.length > 180 ? "..." : ""}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {cs.platforms.slice(0, 3).map((p) => (
              <Badge key={p} variant="secondary" className="text-xs">
                {p}
              </Badge>
            ))}
            {cs.platforms.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{cs.platforms.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function WorkPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Work
        </h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          Results from real campaigns across B2B SaaS, consumer apps, healthcare,
          education, and e-commerce. All metrics are from actual client work.
        </p>
      </div>

      {/* Current/Featured */}
      <div className="mb-16">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          Recent Work
          <Badge variant="secondary" className="text-xs font-normal">
            2024-2026
          </Badge>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {currentCaseStudies.map((cs) => (
            <CaseStudyCard key={cs.slug} cs={cs} />
          ))}
        </div>
      </div>

      {/* Legacy */}
      <div>
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          Previous Work
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {legacyCaseStudies.map((cs) => (
            <CaseStudyCard key={cs.slug} cs={cs} />
          ))}
        </div>
      </div>
    </section>
  );
}
