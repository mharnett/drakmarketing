const SAFE_HREF = /^(https:\/\/|http:\/\/|\/(?!\/))/;
const SITE_PATH = /^\/(?!\/)[^\s"'<>]*$/;

/** Renders the inline markdown the blog uses: links, bold and italic. Unsafe link schemes stay as text. */
export function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label: string, href: string) =>
      SAFE_HREF.test(href) && !/["'<>]/.test(href) ? `<a href="${href}" class="underline underline-offset-2 hover:text-foreground">${label}</a>` : whole,
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

/** Returns the image for a block that is exactly `![alt](/site/path)`, or null. Off-site sources are not allowed. */
export function parseImageBlock(block: string): { alt: string; src: string } | null {
  const m = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(block.trim());
  if (!m || !SITE_PATH.test(m[2])) return null;
  return { alt: m[1], src: m[2] };
}

/** True when a media block's source is a video the page should play rather than show as an image. */
export function isVideoSrc(src: string): boolean {
  return /\.mp4$/i.test(src);
}

/** One block of a post body, as the post page renders it. */
export type PostBlock =
  | { kind: "video"; src: string; poster: string; alt: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "italic"; text: string }
  | { kind: "paragraph"; html: string };

/**
 * Splits a post body on blank lines and says what each block renders as. List items and
 * paragraphs carry their inline markdown already rendered to HTML. An FAQ is a `## FAQ`
 * heading followed by `### Question` headings and answer paragraphs.
 */
export function parsePostBlocks(content: string): PostBlock[] {
  return content.split("\n\n").map((block): PostBlock => {
    const image = parseImageBlock(block);
    if (image && isVideoSrc(image.src)) {
      return { kind: "video", src: image.src, poster: image.src.replace(/\.mp4$/i, "-poster.png"), alt: image.alt };
    }
    if (image) return { kind: "image", src: image.src, alt: image.alt };
    if (block.startsWith("### ")) return { kind: "h3", text: block.slice(4) };
    if (block.startsWith("## ")) return { kind: "h2", text: block.slice(3) };
    if (block.startsWith("**") && block.endsWith("**")) return { kind: "strong", text: block.replace(/\*\*/g, "") };
    if (block.startsWith("- ")) {
      return { kind: "list", items: block.split("\n").map((item) => renderInlineMarkdown(item.replace("- ", ""))) };
    }
    if (block.startsWith("*") && block.endsWith("*") && !block.startsWith("**")) {
      return { kind: "italic", text: block.replace(/^\*|\*$/g, "") };
    }
    return { kind: "paragraph", html: renderInlineMarkdown(block) };
  });
}
