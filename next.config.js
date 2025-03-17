/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['libreoffice-convert'],
  },
}

module.exports = nextConfig;