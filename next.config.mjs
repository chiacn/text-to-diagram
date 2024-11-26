/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";
const nextConfig = {
  output: "export", // Next 14 버전에서는 next exprot 명령 대신 output: "export"
  basePath: isProduction ? "/text-to-diagram" : "",
  // next 이미지 최적화 옵션 off
  // Note:  Image 태그를 사용하게 되면 이미지 랜더링 시에 Next에서 자동적으로 이미지 최적화를 하는데 해당 기능은 정적 파일만을 사용하는 SSG 방식에서는 불가능하므로 unoptimized 옵션을 true로 하여 Next 이미지 최적화 옵션을 꺼야한다.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
