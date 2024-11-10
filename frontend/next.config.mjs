/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOCKET_URL: "https://kahoot.pro",
  },
  distDir: "build",
};
export default nextConfig;
