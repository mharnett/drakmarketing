export async function getNpmWeeklyDownloads(pkg: string): Promise<number> {
  if (!pkg) return 0;
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${pkg}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.downloads ?? 0;
  } catch {
    return 0;
  }
}
