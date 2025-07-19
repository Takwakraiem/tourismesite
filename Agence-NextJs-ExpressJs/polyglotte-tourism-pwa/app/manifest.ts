import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Polyglotte Tourism PWA",
    short_name: "Polyglotte",
    description: "Découvrez le Maghreb avec nos guides experts - Application de tourisme",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/logo.jpeg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.jpeg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["travel", "tourism", "lifestyle"],
    lang: "fr",
    orientation: "portrait-primary",
  }
}
