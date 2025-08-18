// next.config.js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://sma.sikedev.in/api/:path*", // your backend
      },
    ]
  },
}

module.exports = nextConfig

export default nextConfig;
