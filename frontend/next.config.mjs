/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOCKET_URL: "https://kahoot.pro/",
  },
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false
};

export default nextConfig;
