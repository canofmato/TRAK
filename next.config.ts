import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
 webpack(config) {
    // 기존 Next.js SVG 처리 룰 제거
    const fileLoaderRule = config.module.rules.find((rule: { test?: RegExp }) =>
      rule.test?.test?.(".svg")
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    // SVGR로 SVG → React 컴포넌트
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    
    return config;
  },
};

export default nextConfig;
