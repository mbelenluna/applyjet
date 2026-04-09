/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // @auth/prisma-adapter and @auth/core are pure-ESM packages (no CJS fallback).
    // Without this, webpack attempts to bundle them and the named exports resolve to
    // undefined at module-evaluation time, causing "Failed to collect page data".
    // pdf-parse and mammoth also need to stay external for their native bindings.
    serverComponentsExternalPackages: [
      '@auth/prisma-adapter',
      '@auth/core',
      'pdf-parse',
      'mammoth',
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        '@auth/prisma-adapter',
        '@auth/core',
        'pdf-parse',
        'mammoth',
      ]
    }
    return config
  },
}

export default nextConfig
