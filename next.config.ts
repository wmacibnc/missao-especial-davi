import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@prisma/client'],
  // Desabilitar Turbopack e usar Webpack
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'bcryptjs']
    }
    return config
  }
}

export default nextConfig
