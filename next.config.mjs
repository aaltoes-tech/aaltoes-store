/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "amaranth-defiant-snail-192.mypinata.cloud",
      }
    ],
  },
};

export default nextConfig; 