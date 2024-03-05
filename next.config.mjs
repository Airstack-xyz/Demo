/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    TWITTER_PIXEL_ID: process.env.TWITTER_PIXEL_ID,
    API_KEY: process.env.API_KEY,
    MENTION_ENDPOINT: process.env.MENTION_ENDPOINT,
    BFF_ENDPOINT: process.env.BFF_ENDPOINT,
    PRIVY_APP_ID: process.env.PRIVY_APP_ID,
    AIRSTACK_ENDPOINT: process.env.AIRSTACK_ENDPOINT,
    FRAMES_ENDPOINT: process.env.FRAMES_ENDPOINT,
    APP_BASE_URL: process.env.APP_BASE_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com'
      },
      {
        protocol: 'https',
        hostname: 'assets.airstack.xyz'
      },
      {
        protocol: 'https',
        hostname: 'assets.uat.airstack.xyz'
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com'
      }
    ]
  }
};

export default nextConfig;
