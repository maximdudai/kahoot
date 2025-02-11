/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOCKET_URL: "https://kahoot.pro/api",
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
