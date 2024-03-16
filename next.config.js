/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: [],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  i18n:{
    locales: ['th', 'en'],
    defaultLocale: 'en',
  }
}

module.exports = nextConfig
