/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Disable Google font fetching during build (fix Vercel timeout)
  optimizeFonts: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebat-products.s3.me-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {},
}

export default nextConfig
