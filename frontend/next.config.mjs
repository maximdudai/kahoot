/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOCKET_URL: "https://kahoot.pro/api",  // Use domain, not raw IP
  },
  distDir: "build", // Optional, default is ".next"
};

export default nextConfig;
