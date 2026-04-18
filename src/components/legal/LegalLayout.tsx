import { Link } from "@/i18n/navigation";
import type { LegalDocument } from "@/lib/legal/content";

type Props = {
  document: LegalDocument;
  locale: string;
};

export function LegalLayout({ document, locale }: Props) {
  const homeLabel = locale === "bg" ? "Начало" : "Home";
  const lastUpdatedLabel =
    locale === "bg" ? "Последна актуализация:" : "Last updated:";
  const tocLabel = locale === "bg" ? "Съдържание" : "Contents";
  const versionLabel = locale === "bg" ? "В сила от" : "Effective from";

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[960px] px-6 py-12">
        <nav className="mb-8 text-xs text-muted">
          <Link href="/" className="hover:text-teal-600">
            {homeLabel}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{document.title}</span>
        </nav>

        <header className="mb-10 border-b border-border pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            {versionLabel} {document.lastUpdated}
          </p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold text-navy tracking-[-0.03em]">
            {document.title}
          </h1>
          <p className="mt-3 font-mono text-[11px] text-muted">
            {lastUpdatedLabel} {document.lastUpdated}
          </p>
        </header>

        <div className="rounded-lg border-l-4 border-accent bg-surface p-4 text-sm text-secondary">
          {document.draftNotice}
        </div>

        <p className="mt-8 text-base leading-relaxed text-secondary">
          {document.intro}
        </p>

        {/* Table of contents */}
        <aside className="mt-10 rounded-xl border border-border bg-surface p-6">
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-navy">
            {tocLabel}
          </h2>
          <ol className="mt-4 space-y-1.5 text-sm">
            {document.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-secondary hover:text-navy hover:underline"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        {/* Body */}
        <div className="mt-10 space-y-10">
          {document.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-navy">{section.heading}</h2>
              {section.paragraphs?.map((p, i) => (
                <p
                  key={i}
                  className="mt-3 text-base leading-relaxed text-secondary"
                >
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-secondary marker:text-accent">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-border pt-6 text-xs text-muted">
          <p>
            {lastUpdatedLabel} {document.lastUpdated}
          </p>
        </footer>
      </div>
    </main>
  );
}
