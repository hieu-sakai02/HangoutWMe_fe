import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['react-slick'],
  images: {
    domains: ['res.cloudinary.com']
  }
};

export default nextConfig;
