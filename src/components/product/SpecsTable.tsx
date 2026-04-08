import type { Product } from "@/lib/types";
import { getFormLabel } from "@/lib/labels";

type SpecRow = {
  label: string;
  value: string | number | null | undefined;
};

export function SpecsTable({
  product,
  translations,
  locale = "en",
}: {
  product: Product;
  locale?: string;
  translations: {
    specifications: string;
    specName: string;
    specCas: string;
    specFormula: string;
    specMw: string;
    specPurity: string;
    specForm: string;
    specAppearance: string;
    specVialSize: string;
    specStorage: string;
    specShelfLife: string;
  };
}) {
  const sd = product.scientific_data ?? {};

  const rows: SpecRow[] = [
    { label: translations.specName, value: product.name },
    { label: translations.specCas, value: sd.cas_number as string | undefined },
    {
      label: translations.specFormula,
      value: sd.molecular_formula as string | undefined,
    },
    {
      label: translations.specMw,
      value: product.molecular_weight
        ? `${product.molecular_weight} Da`
        : null,
    },
    {
      label: translations.specPurity,
      value: `≥${product.purity_percent}%`,
    },
    { label: translations.specForm, value: getFormLabel(product.form, locale) },
    {
      label: translations.specAppearance,
      value: sd.appearance as string | undefined,
    },
    {
      label: translations.specVialSize,
      value: product.vial_size_mg ? `${product.vial_size_mg} mg` : null,
    },
    {
      label: translations.specStorage,
      value: sd.storage_conditions as string | undefined,
    },
    {
      label: translations.specShelfLife,
      value: sd.shelf_life as string | undefined,
    },
  ];

  const visibleRows = rows.filter(
    (r) => r.value != null && r.value !== ""
  );

  if (visibleRows.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-navy">
        {translations.specifications}
      </h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left">
          <tbody>
            {visibleRows.map((row, i) => (
              <tr
                key={row.label}
                className={i % 2 === 0 ? "bg-surface" : "bg-white"}
              >
                <td className="px-4 py-3 text-xs font-semibold uppercase text-muted">
                  {row.label}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-navy">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
