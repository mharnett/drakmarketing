import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p");

  if (!p || !p.startsWith("/Users/mark/")) {
    return new NextResponse("bad path", { status: 400 });
  }

  const target = `vscode://file/${p}`;
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Opening VS Code…</title></head>
<body style="font-family:system-ui;padding:2rem">
<p>Opening <code>${p.replace(/</g, "&lt;")}</code> in VS Code…</p>
<p>If nothing happens, <a id="manual" href="${target}">click here</a>.</p>
<script>window.location.replace(${JSON.stringify(target)});</script>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
