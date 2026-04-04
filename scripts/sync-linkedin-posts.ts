#!/usr/bin/env npx tsx
/**
 * Sync LinkedIn posts to the website's blog data.
 *
 * Usage: npx tsx scripts/sync-linkedin-posts.ts
 *
 * Reads LinkedIn posts via the Community Management API,
 * converts them to blog post format, and writes to src/lib/linkedin-posts.ts.
 * Existing manually-written blog posts are not affected.
 *
 * Prerequisites:
 *   - Run scripts/linkedin-oauth.ts first to get tokens
 *   - Community Management API approved on the LinkedIn app
 */

import { execSync } from "child_process";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");

function keychain(service: string): string {
  return execSync(
    `security find-generic-password -a drak-posts -s ${service} -w`,
    { encoding: "utf-8" },
  ).trim();
}

function keychainSet(service: string, value: string): void {
  execSync(
    `security delete-generic-password -a drak-posts -s ${service} 2>/dev/null; ` +
      `security add-generic-password -a drak-posts -s ${service} -w "${value}"`,
  );
}

async function refreshTokenIfNeeded(): Promise<string> {
  let token = keychain("LINKEDIN_POSTS_ACCESS_TOKEN");

  // Test the token
  const test = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (test.ok) return token;

  // Try refresh
  console.log("Access token expired, refreshing...");
  let refreshToken: string;
  try {
    refreshToken = keychain("LINKEDIN_POSTS_REFRESH_TOKEN");
  } catch {
    throw new Error("No refresh token available. Run scripts/linkedin-oauth.ts");
  }

  const clientId = keychain("LINKEDIN_POSTS_CLIENT_ID");
  const clientSecret = keychain("LINKEDIN_POSTS_CLIENT_SECRET");

  const resp = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Token refresh failed: ${resp.status} ${text}. Run scripts/linkedin-oauth.ts`);
  }

  const data = (await resp.json()) as any;
  keychainSet("LINKEDIN_POSTS_ACCESS_TOKEN", data.access_token);
  if (data.refresh_token) {
    keychainSet("LINKEDIN_POSTS_REFRESH_TOKEN", data.refresh_token);
  }
  return data.access_token;
}

interface LinkedInPost {
  id: string;
  text: string;
  created: number; // epoch ms
  visibility: string;
  numLikes: number;
  numComments: number;
  numShares: number;
}

async function fetchPosts(token: string, memberUrn: string): Promise<LinkedInPost[]> {
  const posts: LinkedInPost[] = [];
  let start = 0;
  const count = 50;

  while (true) {
    const url =
      `https://api.linkedin.com/rest/posts?author=${encodeURIComponent(memberUrn)}` +
      `&q=author&count=${count}&start=${start}&sortBy=LAST_MODIFIED`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "LinkedIn-Version": "202504",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      if (resp.status === 403) {
        console.error("❌ Access denied. Community Management API may not be approved yet.");
        console.error("   Response:", text);
        process.exit(1);
      }
      throw new Error(`Posts API error: ${resp.status} ${text}`);
    }

    const data = (await resp.json()) as any;
    const elements = data.elements || [];

    for (const post of elements) {
      // Skip reshares and articles without text
      const text = post.commentary || post.content?.article?.description || "";
      if (!text || text.length < 50) continue;

      posts.push({
        id: post.id,
        text,
        created: post.createdAt || post.publishedAt || 0,
        visibility: post.visibility || "PUBLIC",
        numLikes: post.likeCount || 0,
        numComments: post.commentCount || 0,
        numShares: post.shareCount || 0,
      });
    }

    if (elements.length < count) break;
    start += count;
  }

  return posts;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function extractTitle(text: string): string {
  // Use first line if it looks like a title (short, no period)
  const firstLine = text.split("\n")[0].trim();
  if (firstLine.length < 100 && !firstLine.includes(".")) {
    return firstLine.replace(/^[#\s]+/, "");
  }
  // Otherwise use first ~60 chars
  const truncated = text.slice(0, 60).replace(/\n/g, " ").trim();
  return truncated + (text.length > 60 ? "..." : "");
}

function formatDate(epochMs: number): string {
  const d = new Date(epochMs);
  return d.toISOString().split("T")[0];
}

function postToMarkdown(text: string): string {
  // Clean up LinkedIn formatting
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  source: "linkedin";
  linkedinId: string;
  engagement: { likes: number; comments: number; shares: number };
}

function main() {
  return (async () => {
    console.log("Syncing LinkedIn posts...\n");

    const token = await refreshTokenIfNeeded();
    console.log("✓ Token valid");

    // Get member URN
    let memberSub: string;
    try {
      memberSub = keychain("LINKEDIN_POSTS_MEMBER_SUB");
    } catch {
      const me = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = (await me.json()) as any;
      memberSub = meData.sub;
      keychainSet("LINKEDIN_POSTS_MEMBER_SUB", memberSub);
    }

    const memberUrn = `urn:li:person:${memberSub}`;
    console.log(`✓ Member URN: ${memberUrn}`);

    const rawPosts = await fetchPosts(token, memberUrn);
    console.log(`✓ Fetched ${rawPosts.length} posts from LinkedIn`);

    if (rawPosts.length === 0) {
      console.log("No posts found. Check API access or try again later.");
      return;
    }

    // Load existing synced posts to preserve slugs
    const outputPath = join(PROJECT_ROOT, "src/lib/linkedin-posts.ts");
    let existingSlugs = new Map<string, string>();
    if (existsSync(outputPath)) {
      const existing = readFileSync(outputPath, "utf-8");
      const slugMatches = existing.matchAll(/linkedinId:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"/g);
      for (const m of slugMatches) {
        existingSlugs.set(m[1], m[2]);
      }
    }

    // Convert to blog posts
    const blogPosts: BlogPost[] = rawPosts
      .filter((p) => p.visibility === "PUBLIC")
      .sort((a, b) => b.created - a.created)
      .map((p) => {
        const title = extractTitle(p.text);
        const slug = existingSlugs.get(p.id) || `li-${slugify(title)}`;
        return {
          slug,
          title,
          date: formatDate(p.created),
          excerpt: p.text.slice(0, 200).replace(/\n/g, " ").trim() + "...",
          content: postToMarkdown(p.text),
          author: "Mark Harnett",
          source: "linkedin" as const,
          linkedinId: p.id,
          engagement: {
            likes: p.numLikes,
            comments: p.numComments,
            shares: p.numShares,
          },
        };
      });

    console.log(`✓ ${blogPosts.length} public posts converted to blog format`);

    // Write output file
    const output = `// Auto-generated by scripts/sync-linkedin-posts.ts
// Last synced: ${new Date().toISOString()}
// Do not edit manually — changes will be overwritten on next sync.

export interface LinkedInBlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  source: "linkedin";
  linkedinId: string;
  engagement: { likes: number; comments: number; shares: number };
}

export const linkedinPosts: LinkedInBlogPost[] = ${JSON.stringify(blogPosts, null, 2)};
`;

    writeFileSync(outputPath, output);
    console.log(`✓ Written to ${outputPath}`);
    console.log("\nDone! Run 'npm run build' to update the site.");
  })();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
