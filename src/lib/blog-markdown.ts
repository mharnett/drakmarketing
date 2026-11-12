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
