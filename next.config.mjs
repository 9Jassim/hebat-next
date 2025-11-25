/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
