import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Desde o Next 15 o default é 'attachment', que o Safari (iPhone) honra
    // mesmo em <img> embutida, quebrando a exibicao inline das fotos.
    contentDispositionType: "inline",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
