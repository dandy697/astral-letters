import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/reports/(.*)/download": ["node_modules/@sparticuz/chromium/bin/*"],
    "/api/reports/(.*)/natal/download": ["node_modules/@sparticuz/chromium/bin/*"],
  },
};

export default nextConfig;
