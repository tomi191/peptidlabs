"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { Product } from "@/lib/types";

type TabId = "overview" | "science" | "coa";

type Props = {
  product: Product;
  locale: string;
  translations: {
    overview: string;
    science: string;
    coa: string;
    researchDisclaimer: string;
    scienceComingSoon: string;
    coaRequest: string;
    downloadCoa: string;
  };
};

export function ProductTabs({ product, locale, translations }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: translations.overview },
    { id: "science", label: translations.science },
    { id: "coa", label: translations.coa },
  ];

  return (
    <div>
      <div className="flex gap-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? "border-b-2 border-navy pb-3 text-sm font-semibold text-navy"
                : "cursor-pointer pb-3 text-sm text-muted hover:text-secondary"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {activeTab === "overview" && (
          <OverviewTab
            product={product}
            locale={locale}
            disclaimer={translations.researchDisclaimer}
          />
        )}
        {activeTab === "science" && (
          <ScienceTab
            product={product}
            comingSoon={translations.scienceComingSoon}
          />
        )}
        {activeTab === "coa" && (
          <CoaTab
            product={product}
            coaRequest={translations.coaRequest}
            downloadCoa={translations.downloadCoa}
          />
        )}
      </div>
    </div>
  );
}

function OverviewTab({
  product,
  locale,
  disclaimer,
}: {
  product: Product;
  locale: string;
  disclaimer: string;
}) {
  const description =
    locale === "bg" ? product.description_bg : product.description_en;

  return (
    <div>
      {description && (
        <p className="text-sm leading-relaxed text-secondary">{description}</p>
      )}
      <p className="mt-6 text-xs italic text-muted">{disclaimer}</p>
    </div>
  );
}

function ScienceSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="text-sm text-secondary">{children}</div>
    </div>
  );
}

function ScienceTab({
  product,
  comingSoon,
}: {
  product: Product;
  comingSoon: string;
}) {
  const data = product.scientific_data;
  const hasData = data && Object.keys(data).length > 0;

  if (!hasData) {
    return <p className="text-sm text-muted">{comingSoon}</p>;
  }

  const mechanism = data.mechanism as string | undefined;
  const halfLife = data.half_life as string | undefined;
  const storage = data.storage as string | undefined;
  const pubmedLinks = data.pubmed_links as string[] | undefined;
  const stackingNotes = data.stacking_notes as string | undefined;

  return (
    <div className="space-y-5">
      {product.sequence && (
        <ScienceSection label="Molecular Formula">
          <p className="rounded bg-surface p-3 font-mono text-sm">
            {product.sequence}
          </p>
        </ScienceSection>
      )}

      {mechanism && (
        <ScienceSection label="Mechanism of Action">
          <p>{mechanism}</p>
        </ScienceSection>
      )}

      {halfLife && (
        <ScienceSection label="Half-life">
          <p>{halfLife}</p>
        </ScienceSection>
      )}

      {storage && (
        <ScienceSection label="Storage">
          <p>{storage}</p>
        </ScienceSection>
      )}

      {pubmedLinks && pubmedLinks.length > 0 && (
        <ScienceSection label="PubMed References">
          <ul className="space-y-1">
            {pubmedLinks.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-navy underline hover:text-navy/80"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </ScienceSection>
      )}

      {stackingNotes && (
        <ScienceSection label="Stacking Notes">
          <p>{stackingNotes}</p>
        </ScienceSection>
      )}
    </div>
  );
}

function CoaTab({
  product,
  coaRequest,
  downloadCoa,
}: {
  product: Product;
  coaRequest: string;
  downloadCoa: string;
}) {
  if (product.coa_url) {
    return (
      <a
        href={product.coa_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-navy underline hover:text-navy/80"
      >
        <Download size={16} />
        {downloadCoa}
      </a>
    );
  }

  return <p className="text-sm text-secondary">{coaRequest}</p>;
}
