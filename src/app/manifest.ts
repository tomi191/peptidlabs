import type { MetadataRoute } from "next";
import { getPublishedPeptideCount } from "@/lib/queries";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const peptideCount = await getPublishedPeptideCount();
  return {
    name: "PeptidLabs — Research Grade Peptides",
    short_name: "PeptidLabs",
    description:
      `${peptideCount}+ HPLC-tested research peptides. COA included with every order. EU shipping 1–3 days.`,
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    lang: "bg",
    dir: "ltr",
    categories: ["shopping", "medical", "health", "science"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/icon-maskable.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Магазин",
        short_name: "Магазин",
        description: "Разгледай каталога",
        url: "/bg/shop?source=pwa-shortcut",
      },
      {
        name: "Калкулатор",
        short_name: "Калкулатор",
        description: "Доза и реконституция",
        url: "/bg/calculator?source=pwa-shortcut",
      },
      {
        name: "Поръчки",
        short_name: "Поръчки",
        description: "Проследи поръчка",
        url: "/bg/orders?source=pwa-shortcut",
      },
    ],
  };
}
