/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Bắt buộc cho next/image khi export
  },
  assetPrefix: './',
};

export default nextConfig;
