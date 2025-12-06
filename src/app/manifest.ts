import { type MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

const t = await getTranslations("meta.home");

const name = "MAXOUXAX";
const description = t("description");

export default function manifest(): MetadataRoute.Manifest {
  return {
    name,
    short_name: name,
    description,
    start_url: "/",
    display: "standalone",
    scope: "/",
    background_color: "#0b1220",
    theme_color: "#0b1220",
    // [favicon-script icons start]
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    // [favicon-script icons end]
  };
}
