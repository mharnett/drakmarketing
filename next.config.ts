import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old URLs from the previous version of the site that Google still crawls.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/work-examples.html", destination: "/work", permanent: true },
      {
        source: "/blog/retargeting-ads-dont-overpay-for-customers",
        destination: "/blog/retargeting-ads-dont-overpay",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
