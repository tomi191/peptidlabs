import type { Product } from "@/lib/types";

const formLabelsMap: Record<string, Record<Product["form"], string>> = {
  bg: {
    lyophilized: "Лиофилизиран",
    solution: "Разтвор",
    nasal_spray: "Назален спрей",
    capsule: "Капсула",
    accessory: "Аксесоар",
  },
  en: {
    lyophilized: "Lyophilized",
    solution: "Solution",
    nasal_spray: "Nasal Spray",
    capsule: "Capsule",
    accessory: "Accessory",
  },
};

export function getFormLabel(form: Product["form"], locale: string): string {
  return formLabelsMap[locale]?.[form] ?? formLabelsMap.en[form] ?? form;
}

export function getCategoryLabel(locale: string): string {
  return locale === "bg" ? "Изследователски пептид" : "Research Peptide";
}

export function getProductDisplayName(
  product: { name: string; name_bg?: string | null },
  locale: string,
): string {
  if (locale === "bg" && product.name_bg) return product.name_bg;
  return product.name;
}
