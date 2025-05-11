/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static image imports for Next.js
  images: {
    domains: ['hmdmlcunnmmzshnvpgqb.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure compatibility with Netlify
  output: 'standalone',
}

module.exports = nextConfig
