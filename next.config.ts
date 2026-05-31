import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@prisma/client'],
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
