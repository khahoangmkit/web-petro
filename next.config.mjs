/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // Remove assetPrefix for now to avoid the error
  // We'll handle asset paths differently
};

export default nextConfig;
