/** @type {import('next').NextConfig} */
const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === 'production';

const nextConfig = {
  env: {
    SOCKET_URL: isProduction ? "https://kahoot.pro/" : "http://localhost:4000/",
  },
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;

