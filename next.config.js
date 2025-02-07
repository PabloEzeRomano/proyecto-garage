/** @type {import('next').NextConfig} */
require('dotenv').config();

// Extract domain from Supabase URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseDomain = supabaseUrl ? new URL(supabaseUrl).hostname : '';

const nextConfig = {
  images: {
    domains: [supabaseDomain],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;