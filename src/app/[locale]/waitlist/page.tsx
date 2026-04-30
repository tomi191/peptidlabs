import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo/schema";
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  Calendar,
  FlaskConical,
  Bell,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { getPublishedPeptideCount } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBg = locale === "bg";
  return buildMetadata({
    title: isBg
      ? "Запиши се в списъка | Бъди първи на старта"
      : "Join the waitlist | Be first at launch",
    description: isBg
      ? "Запиши се в нашия списък за уведомяване и получи имейл веднага щом каталогът отвори за поръчки."
      : "Join our waitlist and get an email the moment the catalog opens for orders.",
    path: `/${locale}/waitlist`,
    locale,
  });
}

export default async function WaitlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isBg = locale === "bg";
  const peptideTotal = await getPublishedPeptideCount();

  return (
    <main className="flex-1 bg-white">
      <PageHero
        crumbs={[{ label: isBg ? "Списък за уведомяване" : "Waitlist" }]}
        title={isBg ? "Запиши се в списъка" : "Join the waitlist"}
        subtitle={
          isBg
            ? "Подготвяме каталога за официално пускане. Запиши се с имейл и ще те уведомим в момента, в който продуктите станат достъпни за поръчка."
            : "We are preparing for official launch. Add your email and we will notify you the moment products become orderable."
        }
        locale={locale}
      />

      <div className="mx-auto max-w-[900px] px-6 pb-20">
        {/* Form first (above the fold) */}
        <section className="mb-12">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-white to-surface p-8 md:p-10">
            <WaitlistForm variant="hero" source="/waitlist" />
          </div>
        </section>

        {/* What you get */}
        <section className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "Какво получаваш" : "What you get"}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-[-0.02em]">
            {isBg ? "Защо да си в списъка" : "Why join the list"}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Benefit
              icon={Bell}
              title={isBg ? "Първи научаваш" : "First to know"}
              desc={
                isBg
                  ? "Имейл в минутата, когато стартираме официално продажбите."
                  : "Email the minute we open sales officially."
              }
            />
            <Benefit
              icon={Calendar}
              title={isBg ? "Ранен достъп" : "Early access"}
              desc={
                isBg
                  ? "48 часа предварителен достъп преди публичното отваряне."
                  : "48 hours of early access before public launch."
              }
            />
            <Benefit
              icon={ShieldCheck}
              title={isBg ? "Стартова отстъпка" : "Launch discount"}
              desc={
                isBg
                  ? "Специална отстъпка за първите 100 души от списъка."
                  : "Special discount for the first 100 people on the list."
              }
            />
          </div>
        </section>

        {/* What's coming — peptide count */}
        <section className="mb-12 rounded-2xl bg-navy text-white p-8 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300 mb-3">
            {isBg ? "Каталогът подготвен" : "Catalog ready"}
          </p>
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-[-0.03em]">
                {peptideTotal}+{" "}
                {isBg
                  ? "изследователски пептида чакат старт"
                  : "research peptides await launch"}
              </h2>
              <p className="text-white/80 leading-relaxed max-w-2xl">
                {isBg
                  ? "Всички пептиди са с пълна научна документация, HPLC чистота над 98% и независим Сертификат за анализ. Можеш да разгледаш каталога още сега, докато подготвяме инфраструктурата за поръчки."
                  : "All peptides come with full scientific documentation, HPLC purity above 98% and independent Certificate of Analysis. Browse now while we prepare the order infrastructure."}
              </p>
            </div>
            <Link
              href="/encyclopedia"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-navy px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-colors shrink-0"
            >
              <FlaskConical size={16} />
              {isBg ? "Разгледай енциклопедията" : "Browse encyclopedia"}
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            {isBg ? "Често задавани въпроси" : "FAQ"}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-[-0.02em]">
            {isBg ? "Какво да очаквам" : "What to expect"}
          </h2>
          <div className="divide-y divide-border border border-border rounded-2xl bg-white overflow-hidden">
            <FaqItem
              q={isBg ? "Кога ще отворите за поръчки?" : "When do you open for orders?"}
              a={
                isBg
                  ? "Подготвяме инфраструктура (логистика, склад, митническа документация) за официално пускане. Очакваме да отворим през следващите седмици. Записаните в списъка ще получат имейл преди публичното обявяване."
                  : "We are preparing infrastructure (logistics, warehouse, customs paperwork) for official launch. We expect to open within the coming weeks. Waitlist members get an email before public announcement."
              }
            />
            <FaqItem
              q={isBg ? "Безплатно ли е записването?" : "Is signing up free?"}
              a={
                isBg
                  ? "Да, напълно безплатно и без задължение да поръчваш по-късно. Просто получаваш уведомление, когато стартираме."
                  : "Yes, completely free with no obligation to order later. You simply receive notification when we launch."
              }
            />
            <FaqItem
              q={isBg ? "Ще ме спамите ли?" : "Will you spam me?"}
              a={
                isBg
                  ? "Не. Ще получиш един имейл, когато стартираме, плюс рядък ъпдейт ако има значими промени. Можеш да се отпишеш по всяко време с един клик."
                  : "No. You get one email when we launch plus rare updates if something significant changes. Unsubscribe in one click any time."
              }
            />
            <FaqItem
              q={isBg ? "Какво е статутът на продуктите?" : "What is the product status?"}
              a={
                isBg
                  ? "Каталогът от 66+ пептида е напълно готов с HPLC чистота над 98%, независим Сертификат за анализ и пълна научна документация. Чакаме само финализирането на логистичната верига за ЕС доставки."
                  : "The catalog of 66+ peptides is fully ready with HPLC purity above 98%, independent Certificate of Analysis and full scientific documentation. We are only waiting for finalization of the EU shipping logistics."
              }
            />
            <FaqItem
              q={isBg ? "Мога ли да попитам нещо отсега?" : "Can I ask questions now?"}
              a={
                isBg ? (
                  <>
                    Да. Пиши на{" "}
                    <a
                      href="mailto:info@peptidlabs.eu"
                      className="text-accent hover:underline"
                    >
                      info@peptidlabs.eu
                    </a>{" "}
                    или ползвай{" "}
                    <Link href="/contact" className="text-accent hover:underline">
                      контактната форма
                    </Link>
                    . Отговаряме в рамките на 24 часа.
                  </>
                ) : (
                  <>
                    Yes. Email{" "}
                    <a
                      href="mailto:info@peptidlabs.eu"
                      className="text-accent hover:underline"
                    >
                      info@peptidlabs.eu
                    </a>{" "}
                    or use the{" "}
                    <Link href="/contact" className="text-accent hover:underline">
                      contact form
                    </Link>
                    . We reply within 24 hours.
                  </>
                )
              }
            />
          </div>
        </section>

        {/* Trust footer */}
        <section className="rounded-xl border border-dashed border-border bg-surface/50 p-5">
          <div className="flex items-start gap-3">
            <Mail size={16} className="text-muted shrink-0 mt-0.5" />
            <p className="text-xs text-muted leading-relaxed">
              {isBg
                ? "Имейлът ти се пази в база данни, защитена с шифроване, и се ползва само за уведомяване относно стартирането. Никога не се продава на трети страни. Виж "
                : "Your email is stored in an encrypted database and used only to notify you about the launch. Never sold to third parties. See our "}
              <Link href="/privacy" className="text-accent hover:underline">
                {isBg ? "политиката за поверителност" : "privacy policy"}
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Benefit({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Bell;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-tint mb-3">
        <Icon size={18} className="text-accent" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-base font-bold text-navy mb-2">
        {title}
      </h3>
      <p className="text-sm text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-navy hover:bg-surface select-none list-none flex items-center justify-between">
        <span>{q}</span>
        <span className="ml-4 text-muted transition-transform group-open:rotate-45 text-xl leading-none">
          +
        </span>
      </summary>
      <div className="px-5 pb-5 text-sm text-secondary leading-relaxed">
        {a}
      </div>
    </details>
  );
}
