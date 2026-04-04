#!/usr/bin/env npx tsx
/**
 * LinkedIn OAuth flow for Community Management API (posts access).
 *
 * Usage: npx tsx scripts/linkedin-oauth.ts
 *
 * Prerequisites:
 *   - Keychain entries: LINKEDIN_POSTS_CLIENT_ID, LINKEDIN_POSTS_CLIENT_SECRET (account: drak-posts)
 *   - Redirect URL http://localhost:3456/callback added in LinkedIn Developer app Auth tab
 *   - Community Management API product approved on the app
 *
 * On success, stores the access token and refresh token in Keychain.
 */

import { execSync } from "child_process";
import { createServer } from "http";
import { URL } from "url";

const PORT = 3456;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPES = "r_member_social w_member_social openid profile";

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

const clientId = keychain("LINKEDIN_POSTS_CLIENT_ID");
const clientSecret = keychain("LINKEDIN_POSTS_CLIENT_SECRET");

const authUrl =
  `https://www.linkedin.com/oauth/v2/authorization?` +
  `response_type=code&` +
  `client_id=${clientId}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `scope=${encodeURIComponent(SCOPES)}&` +
  `state=drak-posts-oauth`;

console.log("\n🔗 Open this URL in your browser to authorize:\n");
console.log(authUrl);
console.log("\nWaiting for callback...\n");

// Open in default browser
execSync(`open "${authUrl}"`);

const server = createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost:${PORT}`);

  if (url.pathname !== "/callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    console.error("❌ OAuth error:", error, url.searchParams.get("error_description"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<h2>Authorization failed</h2><p>${error}</p>`);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400);
    res.end("Missing code parameter");
    return;
  }

  console.log("✓ Authorization code received. Exchanging for token...");

  // Exchange code for tokens
  const tokenResp = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
    }).toString(),
  });

  if (!tokenResp.ok) {
    const text = await tokenResp.text();
    console.error("❌ Token exchange failed:", tokenResp.status, text);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<h2>Token exchange failed</h2><pre>${text}</pre>`);
    server.close();
    process.exit(1);
  }

  const tokens = (await tokenResp.json()) as any;
  console.log("✓ Access token received (expires in", tokens.expires_in, "seconds)");

  // Store tokens in Keychain
  keychainSet("LINKEDIN_POSTS_ACCESS_TOKEN", tokens.access_token);
  console.log("✓ Access token stored in Keychain");

  if (tokens.refresh_token) {
    keychainSet("LINKEDIN_POSTS_REFRESH_TOKEN", tokens.refresh_token);
    console.log("✓ Refresh token stored in Keychain");
  }

  // Test: get member profile
  const meResp = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (meResp.ok) {
    const me = (await meResp.json()) as any;
    console.log(`✓ Authenticated as: ${me.name} (${me.sub})`);
    keychainSet("LINKEDIN_POSTS_MEMBER_SUB", me.sub);
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(
    `<h2>✓ Authorization complete</h2><p>Tokens stored in Keychain. You can close this tab.</p>`,
  );
  server.close();
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
