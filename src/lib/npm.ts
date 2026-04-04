export async function getNpmWeeklyDownloads(
  pkg: string,
): Promise<number | null> {
  if (!pkg) return null;
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${pkg}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.downloads ?? null;
  } catch {
    return null;
  }
}
