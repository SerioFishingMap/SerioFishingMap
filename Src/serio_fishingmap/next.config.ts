import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return Promise.resolve([
      {
        // 画像表示のテスト用
        source: "/300",
        destination: "https://picsum.photos/",
      },
    ]);
  },
};

export default nextConfig;
