"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="group flex w-full items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2.5 font-mono text-sm transition-colors hover:bg-muted"
    >
      <span className="text-muted-foreground">$</span>
      <span className="flex-1 text-left">{command}</span>
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}
