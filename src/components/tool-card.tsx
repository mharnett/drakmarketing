import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, Star, Wrench } from "lucide-react";
import type { Tool } from "@/lib/tools-data";
import type { ToolStats } from "@/lib/tool-stats";

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toString();
}

export function ToolCard({
  tool,
  stats,
}: {
  tool: Tool;
  stats?: ToolStats;
}) {
  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="group h-full transition-shadow hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-3 p-6">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold tracking-tight group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <Badge variant="secondary" className="shrink-0 ml-2">
              <Wrench className="mr-1 h-3 w-3" />
              {tool.toolCount}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {tool.description}
          </p>
          {stats && (stats.stars > 0 || stats.downloads > 0) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {stats.stars > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {formatNumber(stats.stars)}
                </span>
              )}
              {stats.downloads > 0 && (
                <span className="inline-flex items-center gap-1">
                  <ArrowDown className="h-3 w-3" />
                  {formatNumber(stats.downloads)}/wk
                </span>
              )}
            </div>
          )}
          {tool.installCommand && (
            <code className="mt-auto block rounded bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
              $ {tool.installCommand}
            </code>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
