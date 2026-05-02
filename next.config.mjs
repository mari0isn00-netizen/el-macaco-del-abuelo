/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  turbopack: {
    root: "C:/Users/Admin/el-macaco-del-abuelo",
  },
}

export default nextConfig
