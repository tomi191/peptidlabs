import { ExternalLink } from "lucide-react";

export type ClinicalPhase = {
  phase: "I" | "II" | "III" | "Approved";
  trial: string;
  dose: string;
  duration: string;
  result: string;
  pubmed?: string;
};

type Props = {
  phases: ClinicalPhase[];
  heading: string;
  locale: "bg" | "en";
};

const PHASE_BG: Record<ClinicalPhase["phase"], string> = {
  I: "Фаза I",
  II: "Фаза II",
  III: "Фаза III",
  Approved: "Одобрен",
};

const PHASE_COLORS: Record<ClinicalPhase["phase"], string> = {
  I: "bg-amber-50 text-amber-700 border-amber-200",
  II: "bg-orange-50 text-orange-700 border-orange-200",
  III: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Approved: "bg-teal-50 text-teal-700 border-teal-200",
};

export function ClinicalPhases({ phases, heading, locale }: Props) {
  if (phases.length === 0) return null;
  const isBg = locale === "bg";
  const phaseLabel = (p: ClinicalPhase["phase"]) =>
    isBg ? PHASE_BG[p] : `Phase ${p === "Approved" ? "Approved" : p}`;

  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
        {isBg ? "[Клинични проучвания]" : "[Clinical trials]"}
      </p>
      <h3 className="mt-2 font-display text-xl md:text-2xl font-bold text-navy tracking-tight">
        {heading}
      </h3>
      <p className="mt-1 text-xs text-muted">
        {isBg
          ? "Структурирани данни от публикуваните Phase I-III проучвания"
          : "Structured data from published Phase I-III trials"}
      </p>

      <div className="mt-6 -mx-2 overflow-x-auto md:mx-0">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted">
              <th className="px-3 py-2 font-medium">{isBg ? "Фаза" : "Phase"}</th>
              <th className="px-3 py-2 font-medium">{isBg ? "Проучване" : "Trial"}</th>
              <th className="px-3 py-2 font-medium">{isBg ? "Доза" : "Dose"}</th>
              <th className="px-3 py-2 font-medium">{isBg ? "Период" : "Duration"}</th>
              <th className="px-3 py-2 font-medium">{isBg ? "Резултат" : "Result"}</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors">
                <td className="px-3 py-3.5 align-top">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${PHASE_COLORS[row.phase]}`}
                  >
                    {phaseLabel(row.phase)}
                  </span>
                </td>
                <td className="px-3 py-3.5 align-top">
                  {row.pubmed ? (
                    <a
                      href={row.pubmed}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-accent"
                    >
                      {row.trial}
                      <ExternalLink size={11} className="opacity-50 group-hover:opacity-100" />
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-navy">{row.trial}</span>
                  )}
                </td>
                <td className="px-3 py-3.5 align-top">
                  <span className="font-mono text-xs text-secondary">{row.dose}</span>
                </td>
                <td className="px-3 py-3.5 align-top">
                  <span className="text-xs text-secondary">{row.duration}</span>
                </td>
                <td className="px-3 py-3.5 align-top">
                  <span className="text-xs text-secondary leading-relaxed">{row.result}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[11px] italic text-muted">
        {isBg
          ? "Източници: PubMed, ClinicalTrials.gov, NEJM, FDA пресрелизи"
          : "Sources: PubMed, ClinicalTrials.gov, NEJM, FDA press releases"}
      </p>
    </div>
  );
}
