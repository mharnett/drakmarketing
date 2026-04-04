import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import type { Tool } from "@/lib/tools-data";

export function ToolCard({ tool }: { tool: Tool }) {
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
