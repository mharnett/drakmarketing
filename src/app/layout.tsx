import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

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
    default: "DRAK Marketing — AI-Powered Marketing Tools & Strategy",
    template: "%s | DRAK Marketing",
  },
  description:
    "Open-source MCP servers for Google Ads, LinkedIn Ads, Bing Ads, GA4, and more. 124+ tools built by marketers, for marketers. Free to install and use.",
  metadataBase: new URL("https://drakmarketing.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DRAK Marketing",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DRAK Marketing",
              url: "https://drakmarketing.com",
              description:
                "Open-source MCP servers for marketing automation. 124+ tools for Google Ads, LinkedIn Ads, Bing Ads, GA4, and more.",
              founder: {
                "@type": "Person",
                name: "Mark Harnett",
                url: "https://www.linkedin.com/in/markharnett/",
              },
              sameAs: [
                "https://github.com/mharnett",
                "https://www.linkedin.com/in/markharnett/",
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
