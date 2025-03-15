/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  distDir: 'build',
  images: {
    unoptimized: true,
  },
  // Disable React Server Components for static export
  experimental: {
    runtime: 'nodejs',
    serverActions: false,
  },
  // Ensure plain URLs work with static export
  trailingSlash: true,
};
