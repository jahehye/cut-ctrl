import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "cuts", "crew", "lookbook", "book", "studio"].map((path) => ({
    url: absoluteUrl(`/${path}`),
    lastModified: new Date(),
    changeFrequency: path === "book" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
