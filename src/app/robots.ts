import { type MetadataRoute } from "next";

const host = "https://maxouxax.me";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
