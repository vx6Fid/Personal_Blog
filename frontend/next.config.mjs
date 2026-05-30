/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.alphacoders.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "iili.io",
      },
    ],
  },

  // Block admin pages in production
  async redirects() {
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/admin/:path*",
          destination: "/not-found",
          permanent: false,
        },
        {
          source: "/admin",
          destination: "/not-found",
          permanent: false,
        },
        {
          source: "/login",
          destination: "/not-found",
          permanent: false,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
