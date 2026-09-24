import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "canaacontroladoria.com.br",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "canaacontroladoria.com.br",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
