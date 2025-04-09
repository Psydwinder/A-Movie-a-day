/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        './runtimeConfig': './runtimeConfig.browser',
      };
    }
    return config;
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',  // For Google user profile images
      'image.tmdb.org'             // For TMDB movie posters
    ],
  },
};

module.exports = nextConfig; 