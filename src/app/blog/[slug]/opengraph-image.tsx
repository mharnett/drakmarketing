import { ImageResponse } from "next/og";
import { allBlogPosts } from "@/lib/blog-posts";

export const alt = "Drak Marketing blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return allBlogPosts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);
  const title = post?.title ?? "Drak Marketing";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 28, color: "#a1a1aa" }}>Drak Marketing</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#a1a1aa" }}>{post?.author ?? "Mark Harnett"}</div>
      </div>
    ),
    { ...size },
  );
}
