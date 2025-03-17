/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/conversions/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache" }],
      },
      {
        source: "/compressions/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache" }],
      },
    ];
  },
  //experimental: {
    //serverComponentsExternalPackages: ['libreoffice-convert'],
  //},
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;
