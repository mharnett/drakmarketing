export async function getGitHubStars(repo: string): Promise<number | null> {
  if (!repo) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}
