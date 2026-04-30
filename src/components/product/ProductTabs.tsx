"use client";

import { useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import type { Product } from "@/lib/types";
import { TextWithAbbr } from "@/components/ui/TextWithAbbr";

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
    researchApplications: string;
    keyFeatures: string;
    keyFeature1: string;
    keyFeature2: string;
    keyFeature3: string;
    keyFeature4: string;
    aminoAcidSequence: string;
    mechanismOfAction: string;
    halfLife: string;
    storageHandling: string;
    pubmedReferences: string;
    batchNumber: string;
    thirdPartyNote: string;
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
            translations={translations}
          />
        )}
        {activeTab === "science" && (
          <ScienceTab product={product} translations={translations} />
        )}
        {activeTab === "coa" && (
          <CoaTab product={product} translations={translations} />
        )}
      </div>
    </div>
  );
}

function OverviewTab({
  product,
  locale,
  translations,
}: {
  product: Product;
  locale: string;
  translations: Props["translations"];
}) {
  const summary =
    locale === "bg" ? product.summary_bg : product.summary_en;
  const description =
    locale === "bg" ? product.description_bg : product.description_en;

  const sci = product.scientific_data as Record<string, unknown> | null;
  const plainTldr =
    locale === "bg"
      ? (sci?.plain_tldr_bg as string | undefined)
      : (sci?.plain_tldr_en as string | undefined);

  const researchApps = sci?.research_applications as string[] | undefined;

  return (
    <div className="space-y-6">
      {/* Plain-language TL;DR — for users without scientific background */}
      {plainTldr && (
        <div className="rounded-2xl border border-accent-border bg-gradient-to-br from-accent-tint via-white to-white p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            {locale === "bg" ? "На обикновен език" : "In plain language"}
          </p>
          <p className="mt-2 text-base leading-relaxed text-navy">
            {plainTldr}
          </p>
        </div>
      )}

      {summary && (
        <div className="rounded-xl bg-surface p-5">
          <h3 className="text-sm font-semibold text-navy mb-2">
            {locale === "bg" ? "Кратко научно резюме" : "Scientific summary"}
          </h3>
          <p className="text-base leading-relaxed text-secondary">
            <TextWithAbbr text={summary} locale={locale} />
          </p>
        </div>
      )}

      {description && (
        <div className="space-y-4 text-sm leading-relaxed text-secondary">
          {description.split(/\n\n+/).map((para, i) => (
            <p key={i}>
              <TextWithAbbr text={para} locale={locale} />
            </p>
          ))}
        </div>
      )}

      {researchApps && researchApps.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-navy">
            {translations.researchApplications}
          </h3>
          <ul className="mt-2 space-y-1">
            {researchApps.map((app) => (
              <li
                key={app}
                className="flex items-start gap-2 text-sm text-secondary"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
                {app}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-navy">
          {translations.keyFeatures}
        </h3>
        <ul className="mt-2 space-y-1">
          {[
            translations.keyFeature1,
            translations.keyFeature2,
            translations.keyFeature3,
            translations.keyFeature4,
          ].map((feat) => (
            <li
              key={feat}
              className="flex items-start gap-2 text-sm text-secondary"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
              {feat}
            </li>
          ))}
        </ul>
      </div>

      <p className="border-t border-border pt-4 text-xs italic text-muted">
        {translations.researchDisclaimer}
      </p>
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
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="text-sm text-secondary">{children}</div>
    </div>
  );
}

function ScienceTab({
  product,
  translations,
}: {
  product: Product;
  translations: Props["translations"];
}) {
  const data = product.scientific_data;
  const hasData = data && Object.keys(data).length > 0;

  if (!hasData && !product.sequence) {
    return <p className="text-sm text-muted">{translations.scienceComingSoon}</p>;
  }

  const mechanism = data?.mechanism as string | undefined;
  const halfLife = data?.half_life as string | undefined;
  const storage = data?.storage as string | undefined;
  const reconstitution = data?.reconstitution as string | undefined;
  const pubmedLinks = data?.pubmed_links as string[] | undefined;

  return (
    <div className="space-y-6">
      {product.sequence && (
        <ScienceSection label={translations.aminoAcidSequence}>
          <p className="overflow-x-auto rounded-lg bg-surface p-4 font-mono text-sm leading-relaxed">
            {product.sequence}
          </p>
        </ScienceSection>
      )}

      {mechanism && (
        <ScienceSection label={translations.mechanismOfAction}>
          <p className="leading-relaxed">{mechanism}</p>
        </ScienceSection>
      )}

      {halfLife && (
        <ScienceSection label={translations.halfLife}>
          <p>{halfLife}</p>
        </ScienceSection>
      )}

      {(storage || reconstitution) && (
        <ScienceSection label={translations.storageHandling}>
          {storage && <p className="leading-relaxed">{storage}</p>}
          {reconstitution && (
            <p className="mt-1 leading-relaxed">{reconstitution}</p>
          )}
        </ScienceSection>
      )}

      {pubmedLinks && pubmedLinks.length > 0 && (
        <ScienceSection label={translations.pubmedReferences}>
          <ul className="space-y-2">
            {pubmedLinks.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-navy underline hover:text-navy/80"
                >
                  <ExternalLink size={12} className="shrink-0" />
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </ScienceSection>
      )}
    </div>
  );
}

function CoaTab({
  product,
  translations,
}: {
  product: Product;
  translations: Props["translations"];
}) {
  return (
    <div className="space-y-4">
      {product.coa_url ? (
        <a
          href={product.coa_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-surface"
        >
          <Download size={16} />
          {translations.downloadCoa}
        </a>
      ) : (
        <p className="text-sm text-secondary">{translations.coaRequest}</p>
      )}

      <div className="rounded-lg bg-surface p-4">
        <p className="text-xs text-muted">
          <span className="font-semibold uppercase">{translations.batchNumber}:</span>{" "}
          <span className="font-mono">—</span>
        </p>
      </div>

      <p className="text-xs text-muted">{translations.thirdPartyNote}</p>
    </div>
  );
}
