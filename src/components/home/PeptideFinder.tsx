"use client";

/* PeptideFinder — 3-step wizard that matches research goal → recommended peptides.
   No medical claims. Frames as "research interest" not "treatment recommendation".
   High-conversion widget — turns curious browsers into product-page traffic. */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/i18n/navigation";
import {
  Activity,
  Scale,
  Dumbbell,
  Brain,
  Hourglass,
  Flame,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";

type Locale = "bg" | "en";

type Goal = {
  id: string;
  icon: typeof Activity;
  label: { bg: string; en: string };
  hint: { bg: string; en: string };
};

type Experience = {
  id: "starter" | "experienced";
  label: { bg: string; en: string };
  hint: { bg: string; en: string };
};

type Recommendation = {
  productSlug: string;
  name: string;
  why: { bg: string; en: string };
  priceEur: number;
};

const GOALS: Goal[] = [
  {
    id: "regen",
    icon: Activity,
    label: { bg: "Регенерация на тъкани", en: "Tissue regeneration" },
    hint: { bg: "Сухожилия, стави, мускули, ГИТ", en: "Tendons, joints, muscles, GI tract" },
  },
  {
    id: "metabolic",
    icon: Scale,
    label: { bg: "Метаболитни изследвания", en: "Metabolic research" },
    hint: { bg: "GLP-1 семейство, мастен метаболизъм", en: "GLP-1 class, fat metabolism" },
  },
  {
    id: "gh",
    icon: Dumbbell,
    label: { bg: "Растежен хормон", en: "Growth hormone" },
    hint: { bg: "GHRP/GHRH, мускулна регенерация", en: "GHRP/GHRH, muscle regeneration" },
  },
  {
    id: "cognitive",
    icon: Brain,
    label: { bg: "Когнитивни изследвания", en: "Cognitive research" },
    hint: { bg: "Невропептиди, BDNF, паметови центрове", en: "Neuropeptides, BDNF, memory centers" },
  },
  {
    id: "longevity",
    icon: Hourglass,
    label: { bg: "Дълголетие / клетъчно стареене", en: "Longevity / cellular aging" },
    hint: { bg: "NAD+, теломераза, митохондрии", en: "NAD+, telomerase, mitochondria" },
  },
  {
    id: "skin",
    icon: Flame,
    label: { bg: "Кожа и регенерация", en: "Skin and regeneration" },
    hint: { bg: "Колаген, заздравяване, GHK-Cu", en: "Collagen, healing, GHK-Cu" },
  },
];

const EXPERIENCE: Experience[] = [
  {
    id: "starter",
    label: { bg: "Първа година peptides", en: "First year with peptides" },
    hint: { bg: "По-нисък старт, добре документирани", en: "Lower starting point, well documented" },
  },
  {
    id: "experienced",
    label: { bg: "Имам опит", en: "I have experience" },
    hint: { bg: "Включително нови / експериментални", en: "Including new / experimental" },
  },
];

// Recommendation matrix: [goalId][experienceId] → ordered list of recommendations
const RECOMMENDATIONS: Record<string, Record<Experience["id"], Recommendation[]>> = {
  regen: {
    starter: [
      { productSlug: "bpc-157-5mg", name: "BPC-157 5mg", priceEur: 24.9, why: { bg: "Над 30 години публикувана литература. Стандартен старт за регенеративни протоколи.", en: "30+ years of published literature. Standard entry point for regenerative protocols." } },
      { productSlug: "tb-500-5mg", name: "TB-500 5mg", priceEur: 29.9, why: { bg: "Допълва BPC-157. По-дълъг полуживот, 2× седмично.", en: "Complements BPC-157. Longer half-life, 2× weekly." } },
    ],
    experienced: [
      { productSlug: "bpc-157-tb-500-blend-10mg", name: "BPC + TB бленд 10mg", priceEur: 49.9, why: { bg: "Класическа синергия в един флакон. По-силен ефект от двата поотделно.", en: "Classic synergy in one vial. Stronger than the two separately." } },
      { productSlug: "ara-290-16mg", name: "ARA-290 16mg", priceEur: 79.9, why: { bg: "Тъканна репарация без EPO ефекти. Изследван за нервна регенерация.", en: "Tissue repair without EPO effects. Researched for nerve regeneration." } },
    ],
  },
  metabolic: {
    starter: [
      { productSlug: "semaglutide-5mg", name: "Семаглутид 5mg", priceEur: 79.9, why: { bg: "Първото поколение GLP-1 — най-добре документирано. STEP 1-5 проучвания.", en: "First-gen GLP-1 — best documented. STEP 1-5 trials." } },
      { productSlug: "aod-9604-5mg", name: "AOD-9604 5mg", priceEur: 29.9, why: { bg: "Чисто фокусиран върху мастен метаболизъм. Без хормонални странични пътища.", en: "Pure focus on fat metabolism. No hormonal side pathways." } },
    ],
    experienced: [
      { productSlug: "tirzepatide-5mg", name: "Тирзепатид 5mg", priceEur: 119.9, why: { bg: "Двоен GLP-1/GIP агонист. SURMOUNT-1: −22.5% в 72 седмици.", en: "Dual GLP-1/GIP agonist. SURMOUNT-1: −22.5% in 72 weeks." } },
      { productSlug: "retatrutide-5mg", name: "Ретатрутид 5mg", priceEur: 139.9, why: { bg: "Експериментален троен агонист. Phase 2 NEJM 2023: −24.2%.", en: "Experimental triple agonist. Phase 2 NEJM 2023: −24.2%." } },
      { productSlug: "tesamorelin-5mg", name: "Тезаморелин 5mg", priceEur: 119.9, why: { bg: "Уникална селективност към висцерална тъкан. FDA-одобрен (Egrifta).", en: "Unique selectivity for visceral tissue. FDA-approved (Egrifta)." } },
    ],
  },
  gh: {
    starter: [
      { productSlug: "ipamorelin-5mg", name: "Ипаморелин 5mg", priceEur: 29.9, why: { bg: "Най-чистият GHRP. Без кортизол/пролактин повишение.", en: "Cleanest GHRP. No cortisol/prolactin elevation." } },
      { productSlug: "sermorelin-5mg", name: "Серморелин 5mg", priceEur: 29.9, why: { bg: "Класически GHRH аналог от Нобеловия лауреат Roger Guillemin.", en: "Classic GHRH analog from Nobel laureate Roger Guillemin." } },
    ],
    experienced: [
      { productSlug: "ipamorelin-cjc-blend-10mg", name: "Ипа+CJC бленд 10mg", priceEur: 36.9, why: { bg: "Класическа синергия. Удвояване на GH пулсациите.", en: "Classic synergy. Doubled GH pulse amplitude." } },
      { productSlug: "mgf-5mg", name: "MGF 5mg", priceEur: 34.9, why: { bg: "Активира мускулните сателитни клетки след тренировка.", en: "Activates muscle satellite cells after training." } },
    ],
  },
  cognitive: {
    starter: [
      { productSlug: "selank-5mg", name: "Селанк 5mg", priceEur: 22.9, why: { bg: "Анксиолитик без седация и зависимост. Регистриран в Русия.", en: "Anxiolytic without sedation or dependence. Registered in Russia." } },
      { productSlug: "semax-5mg", name: "Семакс 5mg", priceEur: 24.9, why: { bg: "Повишава BDNF в хипокампуса. Клинично одобрен в Русия.", en: "Raises BDNF in hippocampus. Clinically approved in Russia." } },
    ],
    experienced: [
      { productSlug: "cerebrolysin-5ml", name: "Церебролизин 5ml", priceEur: 59.9, why: { bg: "Невротрофичен комплекс. Клинично одобрен в 50+ страни.", en: "Neurotrophic complex. Clinically approved in 50+ countries." } },
      { productSlug: "oxytocin-2mg", name: "Окситоцин 2mg", priceEur: 29.9, why: { bg: "Социална невробиология. Heinrichs Trust Game проучвания.", en: "Social neurobiology. Heinrichs Trust Game studies." } },
    ],
  },
  longevity: {
    starter: [
      { productSlug: "nad-plus-500mg", name: "NAD+ 500mg", priceEur: 89.9, why: { bg: "Централен коензим. Sinclair (Harvard) изследвания за дълголетие.", en: "Central coenzyme. Sinclair (Harvard) longevity research." } },
      { productSlug: "epitalon-10mg", name: "Епиталон 10mg", priceEur: 24.9, why: { bg: "Кратки курсове 10-20 дни. Хавинсон протокол.", en: "Short 10-20 day courses. Khavinson protocol." } },
    ],
    experienced: [
      { productSlug: "humanin-10mg", name: "Хуманин 10mg", priceEur: 44.9, why: { bg: "Митохондриален пептид. Изследван при свързани с възрастта състояния.", en: "Mitochondrial peptide. Researched in age-related conditions." } },
      { productSlug: "5-amino-1mq-50mg", name: "5-Амино-1MQ 50mg", priceEur: 69.9, why: { bg: "NNMT инхибитор. Повишава NAD+ нивата от друг ъгъл.", en: "NNMT inhibitor. Raises NAD+ from a different angle." } },
    ],
  },
  skin: {
    starter: [
      { productSlug: "ghk-cu-50mg", name: "GHK-Cu 50mg", priceEur: 29.9, why: { bg: '"Синият елексир". Естествен в тялото — нивата падат с възрастта.', en: 'The "blue elixir". Naturally in body — levels decline with age.' } },
    ],
    experienced: [
      { productSlug: "ghk-cu-50mg", name: "GHK-Cu 50mg", priceEur: 29.9, why: { bg: "Системно s.c. за по-широк ефект — не само локално.", en: "Systemic s.c. for broader effect — not just topical." } },
      { productSlug: "bpc-157-5mg", name: "BPC-157 5mg", priceEur: 24.9, why: { bg: "Регенерация на меки тъкани, включително кожа.", en: "Soft tissue regeneration including skin." } },
    ],
  },
};

export function PeptideFinder({ locale }: { locale: Locale }) {
  const isBg = locale === "bg";
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [goal, setGoal] = useState<string | null>(null);
  const [exp, setExp] = useState<Experience["id"] | null>(null);

  const recs =
    goal && exp ? RECOMMENDATIONS[goal]?.[exp] ?? [] : [];

  const reset = () => {
    setStep(1);
    setGoal(null);
    setExp(null);
  };

  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            {isBg ? "[Намери своя пептид]" : "[Find your peptide]"}
          </p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-navy tracking-tight">
            {isBg
              ? "Не сте сигурни откъде да започнете?"
              : "Not sure where to start?"}
          </h2>
          <p className="mt-2 text-sm text-secondary">
            {isBg
              ? "Отговорете на 2 въпроса и ще ви предложим peptides от каталога, които съответстват на изследователската ви цел."
              : "Answer 2 questions and we'll suggest peptides from the catalog matching your research interest."}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
                  step >= n
                    ? "bg-navy text-white"
                    : "bg-surface text-muted"
                }`}
              >
                {n}
              </span>
              {n < 3 && (
                <span
                  className={`h-px w-8 transition-colors ${
                    step > n ? "bg-navy" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1 — Goal */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-4 text-sm font-semibold text-navy">
                {isBg
                  ? "1. Каква изследователска цел ви интересува?"
                  : "1. What research goal interests you?"}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {GOALS.map((g) => {
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setGoal(g.id);
                        setStep(2);
                      }}
                      className="group flex items-start gap-3 rounded-xl border border-border bg-white p-4 text-left transition-all hover:border-navy hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-secondary transition-colors group-hover:bg-accent-tint group-hover:text-accent">
                        <Icon size={18} strokeWidth={1.6} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy">
                          {isBg ? g.label.bg : g.label.en}
                        </p>
                        <p className="mt-1 text-[11px] text-muted leading-snug">
                          {isBg ? g.hint.bg : g.hint.en}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Experience */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-4 text-sm font-semibold text-navy">
                {isBg
                  ? "2. Какъв е опитът ви с peptide изследвания?"
                  : "2. What is your peptide research experience?"}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {EXPERIENCE.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      setExp(e.id);
                      setStep(3);
                    }}
                    className="group rounded-xl border border-border bg-white p-5 text-left transition-all hover:border-navy hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)]"
                  >
                    <p className="text-sm font-semibold text-navy">
                      {isBg ? e.label.bg : e.label.en}
                    </p>
                    <p className="mt-1.5 text-xs text-muted leading-snug">
                      {isBg ? e.hint.bg : e.hint.en}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      {isBg ? "Избери" : "Select"}
                      <ArrowRight size={11} />
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-4 text-xs text-muted hover:text-navy"
              >
                ← {isBg ? "Назад" : "Back"}
              </button>
            </motion.div>
          )}

          {/* STEP 3 — Recommendations */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-navy">
                  <Sparkles
                    size={14}
                    className="mr-1.5 inline-block text-accent"
                  />
                  {isBg
                    ? `${recs.length} peptide(а) подходящи за вашата цел`
                    : `${recs.length} peptide(s) matching your interest`}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-medium text-secondary hover:border-navy hover:text-navy"
                >
                  <RefreshCw size={11} />
                  {isBg ? "Започни отново" : "Start over"}
                </button>
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                {recs.map((r, i) => (
                  <Link
                    key={r.productSlug}
                    href={`/products/${r.productSlug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-white p-5 transition-all hover:border-navy hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)]"
                  >
                    <div className="mb-3 flex items-baseline justify-between gap-2">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-bold ${
                          i === 0
                            ? "bg-navy text-white"
                            : "bg-surface text-secondary"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                        {i === 0
                          ? isBg
                            ? "Първи избор"
                            : "Top pick"
                          : isBg
                            ? "Алтернатива"
                            : "Alternative"}
                      </span>
                    </div>
                    <p className="font-display text-lg font-bold text-navy">
                      {r.name}
                    </p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">
                      {isBg ? r.why.bg : r.why.en}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-mono text-lg font-bold text-navy tabular">
                        €{r.priceEur.toFixed(2)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                        {isBg ? "Виж" : "View"}
                        <ArrowRight
                          size={12}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <p className="mt-6 text-[11px] italic text-muted">
                {isBg
                  ? "Препоръките се базират на категоризация по изследователска област — не са медицински съвет. Всички продукти са за изследователски цели in vitro."
                  : "Recommendations based on research area categorization — not medical advice. All products are for in vitro research purposes."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
