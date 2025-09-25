/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow images from any hostname, especially Supabase storage
      },
    ],
  },
};

module.exports = nextConfig;
