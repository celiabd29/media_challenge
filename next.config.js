const isDev = process.env.NODE_ENV === "development";
const withPWA = require("next-pwa")({
  dest: "public",
  disable: isDev,
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'erlldebnhztrpzapzvrk.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
