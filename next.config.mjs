/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Disable Google font fetching during build (fix Vercel timeout)
  optimizeFonts: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {},
}

export default nextConfig
