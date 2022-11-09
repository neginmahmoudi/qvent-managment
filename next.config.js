/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dawnyquoz/**',
      },
    ],
  },
};
module.exports = {
  nextConfig,
  compiler: {
    emotion: true,
  },
};
