/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['jsvectormap'],
  webpack: (config, { isServer }) => {
    // Add a rule to handle Solidity files
    config.module.rules.push({
      test: /\.sol$/,
      use: 'raw-loader',
    });

    // Add resolve fallback for canvas
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
