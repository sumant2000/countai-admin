/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Azure Static Web Apps
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Configure trailing slash
  trailingSlash: true,
  
  // Configure asset prefix for production
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Environment variables
  env: {
    AZURE_SQL_CONNECTION_STRING: process.env.AZURE_SQL_CONNECTION_STRING,
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
    API_BASE_URL: process.env.API_BASE_URL,
  }
}

module.exports = nextConfig
