/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable image optimization
    formats: ['image/avif', 'image/webp'],
    // Allow remote images from Firebase Storage and other common domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleapis.com', // Firebase Storage
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.firebaseapp.com', // Firebase Hosting
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.firebasestorage.googleapis.com', // Firebase Storage direct
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com', // Cloudinary (if used)
        pathname: '/**',
      },
    ],
    // Image quality settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache time (in seconds)
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
