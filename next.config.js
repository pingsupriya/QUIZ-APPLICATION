/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Configure images domain for external API images if needed
  images: {
    domains: ['opentdb.com'],
  },
}

module.exports = nextConfig 