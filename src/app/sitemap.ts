import { type MetadataRoute } from "next";

const BASE_URL = "https://maxouxax.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
