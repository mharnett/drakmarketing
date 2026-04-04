import { getGitHubStars } from "./github";
import { getNpmWeeklyDownloads } from "./npm";
import type { Tool } from "./tools-data";

export interface ToolStats {
  stars: number;
  downloads: number;
}

export async function getToolStats(tool: Tool): Promise<ToolStats> {
  const [stars, downloads] = await Promise.all([
    getGitHubStars(tool.githubRepo),
    getNpmWeeklyDownloads(tool.npmPackage),
  ]);
  return { stars, downloads };
}

export async function getAllToolStats(
  tools: Tool[],
): Promise<Record<string, ToolStats>> {
  const entries = await Promise.all(
    tools.map(async (t) => [t.slug, await getToolStats(t)] as const),
  );
  return Object.fromEntries(entries);
}
