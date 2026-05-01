import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ShieldCheck,
  Truck,
  FlaskConical,
  FileCheck,
  Globe,
  Euro,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBg = locale === "bg";
  return buildMetadata({
    title: isBg
      ? "Алтернатива на Peptide Sciences за ЕС изследователи | PeptidLabs"
      : "Peptide Sciences Alternative for EU Researchers | PeptidLabs",
    description: isBg
      ? "Peptide Sciences прекрати дейност в началото на 2026. PeptidLabs е native EU доставчик с HPLC верифицирана чистота, COA с всяка партида и доставка от ЕС склад за 1-7 работни дни. Без мита, без митнически забавяния."
      : "Peptide Sciences shut down in early 2026. PeptidLabs is a native EU supplier with HPLC-verified purity, COA per batch, and EU warehouse shipping in 1-7 business days. No customs duties, no border delays.",
    path: `/${locale}/peptide-sciences-alternative`,
    locale,
  });
}

export default async function PeptideSciencesAlternativePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isBg = locale === "bg";

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: isBg ? "Начало" : "Home", path: `/${locale}` },
    {
      name: isBg ? "Алтернатива на Peptide Sciences" : "Peptide Sciences Alternative",
      path: `/${locale}/peptide-sciences-alternative`,
    },
  ]);

  return (
    <main className="flex-1 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageHero
        crumbs={[
          {
            label: isBg
              ? "Алтернатива на Peptide Sciences"
              : "Peptide Sciences Alternative",
          },
        ]}
        title={
          isBg
            ? "Алтернатива на Peptide Sciences за ЕС"
            : "A Native-EU Alternative to Peptide Sciences"
        }
        subtitle={
          isBg
            ? "Peptide Sciences прекрати продажбите в началото на 2026, оставяйки европейските изследователски групи без техния доставчик по подразбиране. PeptidLabs е native EU отговорът — същата научна сериозност, без транс-атлантическата митница."
            : "Peptide Sciences ceased sales in early 2026, leaving European research groups without their default supplier. PeptidLabs is the native-EU answer — the same scientific seriousness, without the transatlantic customs friction."
        }
        locale={locale}
      />

      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        {/* Lead — flowing prose, NOT bullet hell */}
        <section className="max-w-3xl space-y-5 text-secondary leading-relaxed">
          <p className="text-[15px]">
            {isBg ? (
              <>
                За много изследователи в Европа Peptide Sciences беше доставчикът
                по подразбиране — широк каталог, последователно качество и
                разпознаваема Certificate of Analysis за всяка партида. Когато
                през март 2026 спряха дейност, останаха две алтернативи:
                продължаващи трансатлантически вносове през Bachem или Sigma
                (скъпо, бавно, с митнически забавяния), или преминаване към
                native EU доставчик. PeptidLabs беше изграден точно за този
                сценарий — каталогът, методологията и логистиката произлизат
                директно от европейска научна култура.
              </>
            ) : (
              <>
                For many researchers in Europe, Peptide Sciences was the default
                supplier — broad catalog, consistent quality, and a recognizable
                Certificate of Analysis for every batch. When they ceased
                operations in March 2026, two alternatives remained: continued
                transatlantic imports via Bachem or Sigma (expensive, slow, with
                customs delays), or moving to a native EU supplier. PeptidLabs was
                built for exactly this scenario — the catalog, methodology and
                logistics flow directly from European scientific culture.
              </>
            )}
          </p>

          <p className="text-[15px]">
            {isBg ? (
              <>
                Каталогът ни покрива всички пептиди, които повечето изследователи
                купуваха от Peptide Sciences — BPC-157, TB-500, Семаглутид,
                Тирзепатид, Ретатрутид, GHK-Cu, Ипаморелин, Селанк, Семакс,
                Церебролизин и още 60+ молекули. Всяка партида преминава
                независим HPLC-UV анализ и масспектрометрично потвърждение в
                акредитирана лаборатория, с гарантиран минимум 98% чистота
                (повечето партиди постигат 99% и нагоре). COA се прилага към
                всяка поръчка и е достъпен в нашия{" "}
                <Link href="/coa-vault" className="text-accent underline decoration-dotted hover:no-underline">
                  COA Vault
                </Link>{" "}
                за бъдеща справка.
              </>
            ) : (
              <>
                Our catalog covers every peptide most researchers used to buy from
                Peptide Sciences — BPC-157, TB-500, Semaglutide, Tirzepatide,
                Retatrutide, GHK-Cu, Ipamorelin, Selank, Semax, Cerebrolysin, and
                60+ more molecules. Every batch goes through independent HPLC-UV
                analysis and mass spec confirmation at an accredited laboratory,
                with a guaranteed minimum of 98% purity (most batches reach 99%
                or higher). The COA ships with each order and stays accessible in
                our{" "}
                <Link href="/coa-vault" className="text-accent underline decoration-dotted hover:no-underline">
                  COA Vault
                </Link>{" "}
                for future reference.
              </>
            )}
          </p>

          <p className="text-[15px]">
            {isBg ? (
              <>
                Логистично разликата спрямо вноса от Северна Америка е значителна.
                Изпращаме от EU-базиран склад с Еконт за България (1-2 работни
                дни) и международни куриери за останалите страни в съюза (3-7
                дни). Без мита. Без митнически забавяния. Без температурно
                компрометиране при дни в транспортна верига отвъд океана. За
                европейски изследователи това означава по-кратки протоколи, и
                по-малка вариация между партидите от една и съща поръчка.
              </>
            ) : (
              <>
                Logistically the difference from North American imports is
                significant. We ship from an EU-based warehouse with Econt for
                Bulgaria (1-2 business days) and international couriers for the
                rest of the EU (3-7 days). No customs duties. No border delays.
                No temperature compromise across days in a transoceanic logistics
                chain. For European researchers that translates into shorter
                protocols and lower batch-to-batch variation within a single
                order.
              </>
            )}
          </p>
        </section>

        {/* Comparison strip — 4 advantages, narrow info-dense pills */}
        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: FlaskConical,
              title: isBg ? "Същият научен бар" : "Same scientific bar",
              body: isBg
                ? "HPLC-UV ≥98%, mass spec на всяка партида, акредитирана лаборатория."
                : "HPLC-UV ≥98%, mass spec on every batch, accredited laboratory.",
            },
            {
              icon: FileCheck,
              title: isBg ? "COA с всяка партида" : "COA with every batch",
              body: isBg
                ? "Лот номер, дата, чистота, идентичност — документирани и архивирани."
                : "Lot number, date, purity, identity — documented and archived.",
            },
            {
              icon: Truck,
              title: isBg ? "ЕС логистика" : "EU logistics",
              body: isBg
                ? "1-7 дни доставка от EU склад. Без мита, без митнически забавяния."
                : "1-7 days from EU warehouse. No customs duties, no border delays.",
            },
            {
              icon: Euro,
              title: isBg ? "EUR ценообразуване" : "EUR pricing",
              body: isBg
                ? "Цени в евро (със BGN еквивалент). Без валутни конверсии и FX surprise."
                : "Prices in EUR (with BGN equivalent). No FX conversions, no surprise costs.",
            },
          ].map(({ icon: Icon, title, body }, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-white p-5 transition-colors hover:border-accent/40"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-tint text-accent">
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-semibold text-navy">{title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-secondary">
                {body}
              </p>
            </div>
          ))}
        </section>

        {/* Q&A section — answers the obvious researcher questions */}
        <section className="mt-16 max-w-3xl space-y-8">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy">
              {isBg
                ? "Имам отворени протоколи на партиди от Peptide Sciences. Какво се променя при PeptidLabs?"
                : "I have open protocols on Peptide Sciences batches. What changes with PeptidLabs?"}
            </h2>
            <p className="mt-2 text-secondary leading-relaxed text-[15px]">
              {isBg
                ? "Молекулите са същите — еднакви аминокиселинни последователности, еднакви molecular weights, еднакъв synthesis pathway. Разликата е във формата на партидата, лот номера и точната измерена чистота, която варира леко между производители. За continuity, препоръчваме да започнете нова серия експерименти с PeptidLabs партида и да третирате я като нов baseline; не смесвайте партиди от два различни доставчика в един и същи протокол."
                : "The molecules are identical — same amino acid sequences, same molecular weights, same synthesis pathway. What differs is the batch format, lot number and exact measured purity, which varies slightly between manufacturers. For continuity, we recommend starting a new experiment series with a PeptidLabs batch and treating it as a fresh baseline; don't mix batches from two different suppliers in the same protocol."}
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy">
              {isBg
                ? "Имате ли по-екзотични пептиди — например MOTS-c, FOXO4-DRI, SS-31?"
                : "Do you stock more exotic peptides — like MOTS-c, FOXO4-DRI, SS-31?"}
            </h2>
            <p className="mt-2 text-secondary leading-relaxed text-[15px]">
              {isBg
                ? "Да. Каталогът включва над 70 пептида, в това число senolytic FOXO4-DRI, mitochondrial-derived MOTS-c и Humanin, новата 2026 GLP-1 generation (Survodutide, Mazdutide, Orforglipron), както и руските ноотропи Селанк, Семакс, NA-Семакс, Церебролизин. Ако работите с пептид, който не е в каталога, пишете на info@peptidlabs.eu — добавянето на нови молекули по специален запит е стандартна практика."
                : "Yes. Our catalog has 70+ peptides including the senolytic FOXO4-DRI, mitochondrial-derived MOTS-c and Humanin, the new 2026 GLP-1 generation (Survodutide, Mazdutide, Orforglipron), and Russian nootropics Selank, Semax, NA-Semax, Cerebrolysin. If you work with a peptide not in the catalog, email info@peptidlabs.eu — adding new molecules on request is standard practice."}
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy">
              {isBg
                ? "Какво включва COA на PeptidLabs спрямо Peptide Sciences?"
                : "What does a PeptidLabs COA include compared to Peptide Sciences?"}
            </h2>
            <p className="mt-2 text-secondary leading-relaxed text-[15px]">
              {isBg ? (
                <>
                  Същите аналитични пазари: HPLC-UV chromatogram с интегрирани
                  пикове, mass spectrometry потвърждение на молекулна маса, лот
                  номер, дата на синтез, срок на годност, заявка за чистота, и
                  endotoxin тест при appropriate molecules. Виж{" "}
                  <Link
                    href="/coa-vault"
                    className="text-accent underline decoration-dotted hover:no-underline"
                  >
                    примерен формат в COA Vault
                  </Link>
                  .
                </>
              ) : (
                <>
                  The same analytical markers: HPLC-UV chromatogram with
                  integrated peaks, mass spectrometry confirmation of molecular
                  weight, lot number, manufacture date, expiry date, purity
                  claim, and endotoxin testing on appropriate molecules. See the{" "}
                  <Link
                    href="/coa-vault"
                    className="text-accent underline decoration-dotted hover:no-underline"
                  >
                    sample format in the COA Vault
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </section>

        {/* Soft CTA */}
        <section className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-surface via-white to-accent-tint/40 px-8 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold tracking-tight text-navy">
                {isBg
                  ? "Готови за първа поръчка?"
                  : "Ready for your first order?"}
              </h2>
              <p className="mt-2 text-secondary leading-relaxed">
                {isBg
                  ? "Започнете с каталога — каталогът е подреден по изследователска цел. Реконституция калкулаторът, енциклопедията и COA Vault са безплатни и достъпни без регистрация."
                  : "Start with the catalog — it's organized by research goal. The reconstitution calculator, encyclopedia and COA Vault are free and need no registration."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
              >
                <FlaskConical size={16} />
                {isBg ? "Каталог" : "Browse catalog"}
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/encyclopedia"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium text-navy transition-colors hover:border-navy/40"
              >
                <Globe size={16} />
                {isBg ? "Енциклопедия" : "Encyclopedia"}
              </Link>
              <Link
                href="/coa-vault"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium text-navy transition-colors hover:border-navy/40"
              >
                <ShieldCheck size={16} />
                COA Vault
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
