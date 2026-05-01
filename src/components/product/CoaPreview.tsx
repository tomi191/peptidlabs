import Image from "next/image";
import { ShieldCheck, Info } from "lucide-react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const COA_TEMPLATE = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/product-images/brand/coa-template.png`
  : null;

type Props = {
  /** Peptide name for the overlay, e.g. "BPC-157" */
  peptideName: string;
  /** Optional dose for the overlay, e.g. "5mg" */
  dose?: string | number | null;
  /** Optional purity to display in the overlay, e.g. 99 */
  purityPercent?: number | null;
  locale: "bg" | "en" | string;
  className?: string;
};

/**
 * CoaPreview — visualizes the Certificate of Analysis a customer will
 * receive with their order. Renders a master template image (a real
 * lab-style document with placeholder fields and a generic HPLC
 * chromatogram) with a small overlay listing this product's name + dose
 * + purity at the top.
 *
 * IMPORTANT: this is intentionally a SAMPLE / FORMAT PREVIEW. We do NOT
 * fake batch numbers or dates that could be misread as a real document.
 * The disclaimer below the image makes that explicit.
 */
export function CoaPreview({
  peptideName,
  dose,
  purityPercent,
  locale,
  className,
}: Props) {
  const isBg = locale === "bg";
  const doseLabel = dose ? `${dose}${typeof dose === "number" ? "mg" : ""}` : null;

  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl border border-border bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.18)] ${className ?? ""}`}
    >
      <div className="relative aspect-[3/4] w-full bg-surface">
        {COA_TEMPLATE && (
          <Image
            src={COA_TEMPLATE}
            alt={isBg ? "Примерен COA сертификат" : "Sample Certificate of Analysis"}
            fill
            sizes="(max-width: 1024px) 100vw, 420px"
            quality={92}
            className="object-cover"
          />
        )}

        {/* Header overlay — peptide identity, top-center */}
        <div className="absolute inset-x-4 top-4 flex flex-col items-center gap-1 rounded-lg bg-white/85 px-3 py-2 ring-1 ring-border backdrop-blur-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {isBg ? "За продукт" : "For product"}
          </p>
          <p className="font-display text-base font-bold leading-none text-navy tabular">
            {peptideName}
            {doseLabel && (
              <span className="ml-1.5 font-mono text-sm font-semibold text-accent">
                {doseLabel}
              </span>
            )}
          </p>
          {purityPercent != null && (
            <p className="font-mono text-[10px] tabular text-secondary">
              ≥ {purityPercent}% HPLC · COA per batch
            </p>
          )}
        </div>

        {/* "SAMPLE / ПРИМЕРЕН" diagonal stamp — bottom-right corner */}
        <div className="absolute -right-8 bottom-12 rotate-[-12deg]">
          <span className="block rounded-md border-2 border-dashed border-accent/70 bg-white/60 px-4 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
            {isBg ? "Примерен формат" : "Sample format"}
          </span>
        </div>

        {/* Subtle reading-readiness indicator */}
        <div className="absolute left-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 ring-1 ring-border backdrop-blur-sm">
          <ShieldCheck size={12} className="text-accent" strokeWidth={2} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-navy">
            HPLC-UV · MS confirmed
          </span>
        </div>
      </div>

      <figcaption className="flex items-start gap-2 border-t border-border bg-surface/50 px-4 py-3">
        <Info size={13} className="mt-0.5 shrink-0 text-muted" strokeWidth={1.75} />
        <p className="text-[11px] leading-relaxed text-secondary">
          {isBg
            ? "Това е примерен формат на сертификата. Действителният COA с конкретните данни за вашата партида (LOT номер, дата на синтез, точна чистота, mass spec потвърждение) се изпраща с поръчката и е достъпен в COA Vault след получаване."
            : "This is a sample format. The actual COA with your specific batch data (lot number, manufacture date, exact purity, mass spectrometry confirmation) is shipped with your order and accessible in the COA Vault after delivery."}
        </p>
      </figcaption>
    </figure>
  );
}
