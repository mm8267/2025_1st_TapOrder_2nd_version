/** @type {import('next').NextConfig} */
const nextConfig = {
  // 모든 네트워크 인터페이스에서 접근 가능하도록 설정
  experimental: {
    // 필요한 경우 추가 설정
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 이미지 최적화 설정
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
}

export default nextConfig
