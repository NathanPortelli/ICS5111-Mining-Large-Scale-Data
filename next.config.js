/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.spoonacular.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "spoonacular.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "img.jamieoliver.com",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
