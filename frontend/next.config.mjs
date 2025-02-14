/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';  // Assuming you're using this for production check

const nextConfig = {
  env: {
    SOCKET_URL: isProduction ? "https://kahoot.pro/" : "http://localhost:4000/",
  },
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;

