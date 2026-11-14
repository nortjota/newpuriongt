import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /presentes/personalizar nunca teve página própria: a personalização com
  // dedicatória acontece dentro da /presentes/kits. Temporário (307) para não
  // ficar em cache caso a rota ganhe uma página no futuro.
  async redirects() {
    return [{ source: "/presentes/personalizar", destination: "/presentes/kits", permanent: false }];
  },
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
