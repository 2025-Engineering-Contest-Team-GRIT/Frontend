import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.BASE_URL + "/api/:path*",
      },
    ];
  },
  // 웹사이트 파비콘(로고 아이콘) 설정
  // favicon 및 웹사이트 아이콘 지정
  // next/image 또는 _document.tsx에서 별도 설정이 없다면 기본적으로 public/favicon.ico가 사용됨
  // SVG를 favicon으로 사용하려면 _document.tsx에서 head에 직접 link 태그 추가 필요
  // 아래는 next.config.ts에서의 예시 주석
};

export default nextConfig;
