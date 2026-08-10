/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

if (!process.env.SENTRY_AUTH_TOKEN) {
  module.exports = nextConfig;
} else {
  const { withSentryConfig } = require("@sentry/nextjs");

  module.exports = withSentryConfig(
    nextConfig,
    {
      silent: true,
      org: "techeducoder",
      project: "javascript-nextjs",
    },
    {
      widenClientFileUpload: true,
      transpileClientSDK: true,
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    }
  );
}
