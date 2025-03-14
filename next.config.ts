import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    //domains: ["lh3.googleusercontent.com"],
    domains: ["firebasestorage.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
