import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { totalToolCount } from "@/lib/tools-data";
import { gtagInitScript, isValidGaId } from "@/lib/ga-consent";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Drak Marketing — AI-Powered Marketing Tools & Strategy",
    template: "%s | Drak Marketing",
  },
  description:
    `Open-source MCP servers for Google Ads, LinkedIn Ads, Bing Ads, GA4, and more. ${totalToolCount}+ tools built by marketers, for marketers. Free to install and use.`,
  metadataBase: new URL("https://drakmarketing.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Drak Marketing",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {isValidGaId(GA_ID) && (
          <>
            <Script id="gtag-init" strategy="afterInteractive">
              {gtagInitScript(GA_ID)}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Drak Marketing",
              url: "https://drakmarketing.com",
              description:
                `Open-source MCP servers for marketing automation. ${totalToolCount}+ tools for Google Ads, LinkedIn Ads, Bing Ads, GA4, and more.`,
              founder: {
                "@type": "Person",
                name: "Mark Harnett",
                url: "https://www.linkedin.com/in/harnett/",
              },
              sameAs: [
                "https://github.com/mharnett",
                "https://www.linkedin.com/in/harnett/",
              ],
            }),
          }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
