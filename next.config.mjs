/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Bắt buộc cho next/image khi export
  },
  trailingSlash: true,
  // Remove assetPrefix for now to avoid the error
  // We'll handle asset paths differently
};

export default nextConfig;
