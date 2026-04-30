import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo/schema";
import {
  ArrowRight,
  FlaskConical,
  Beaker,
  Microscope,
  ShieldCheck,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ResearchOnlyBanner } from "@/components/home/ResearchOnlyBanner";
import { PeptideTimeline } from "@/components/peptides101/PeptideTimeline";
import { PeptideBondAnimation } from "@/components/peptides101/PeptideBondAnimation";
import { SizeComparison } from "@/components/peptides101/SizeComparison";
import { TextWithAbbr } from "@/components/ui/TextWithAbbr";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBg = locale === "bg";
  return buildMetadata({
    title: isBg
      ? "Какво са пептидите? Пълно ръководство на човешки език"
      : "What are peptides? Complete guide in plain language",
    description: isBg
      ? "Всичко за пептидите на разбираем български: какво представляват, как работят, история от 1902 до днес, видове, производство и връзка с GLP-1 пептидите за тегло."
      : "Everything about peptides in plain English: what they are, how they work, history from 1902 to today, types, production, and the connection to GLP-1 peptides for weight.",
    path: `/${locale}/what-are-peptides`,
    locale,
  });
}

export default async function WhatArePeptidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isBg = locale === "bg";

  if (!isBg) {
    return (
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-navy">
            English version coming soon
          </h1>
          <p className="mt-4 text-secondary">
            This guide is currently available only in Bulgarian.{" "}
            <Link href="/encyclopedia" className="text-accent hover:underline">
              Browse our peptide encyclopedia →
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-white">
      <ResearchOnlyBanner locale="bg" />

      <PageHero
        crumbs={[{ label: "Какво са пептидите?" }]}
        title="Какво са пептидите?"
        subtitle="Подробно и разбираемо ръководство за пептидите. Кратки молекули с огромно значение за съвременната медицина и наука."
        locale="bg"
      />

      <div className="mx-auto max-w-[1100px] px-6 pb-20">
        {/* TLDR — at-a-glance answer */}
        <section className="mb-16 rounded-2xl bg-surface p-7 border border-border">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            Накратко
          </p>
          <h2 className="font-display text-2xl font-bold text-navy mb-4 tracking-[-0.02em]">
            Какво е пептид с едно изречение?
          </h2>
          <p className="text-base text-secondary leading-relaxed">
            Пептидът е къса верижка от свързани аминокиселини, която е
            по-голяма от обикновено лекарство, но по-малка от протеин. Тялото
            ни произвежда хиляди такива пептиди и ги използва като сигнални
            молекули, например{" "}
            <TextWithAbbr text="инсулин" locale="bg" /> (за кръвната захар),{" "}
            <TextWithAbbr text="окситоцин" locale="bg" /> (за връзка между
            хората) или ендорфини (за облекчаване на болка).
          </p>
        </section>

        {/* Section 1: Definition table */}
        <section className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            01. Определение
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6 tracking-[-0.02em]">
            Аминокиселина, пептид, протеин: каква е разликата
          </h2>
          <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
            Всичко започва с аминокиселините. Те са най-малките градивни
            елементи. Когато се свържат две аминокиселини, се получава дипептид.
            Когато са повече, говорим за олиго- или полипептид. Когато са
            достатъчно много, за да се сгънат в стабилна триизмерна структура с
            биологична функция, наричаме молекулата протеин.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Молекула</th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Аминокиселини
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">Размер</th>
                  <th className="text-left px-4 py-3 font-semibold">Пример</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">
                    Аминокиселина
                  </td>
                  <td className="px-4 py-3 text-secondary">1</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    ~0.5 nm
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    Глицин, лизин, триптофан
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">Дипептид</td>
                  <td className="px-4 py-3 text-secondary">2</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    ~0.8 nm
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    Карнозин, аспартам
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">Трипептид</td>
                  <td className="px-4 py-3 text-secondary">3</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    ~1 nm
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    GHK-Cu, глутатион, TRH
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">
                    Олигопептид
                  </td>
                  <td className="px-4 py-3 text-secondary">4 до 20</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    ~1 до 4 nm
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    Окситоцин (9), BPC-157 (15)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">Полипептид</td>
                  <td className="px-4 py-3 text-secondary">21 до 100</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    ~4 до 15 nm
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    Семаглутид (31), инсулин (51)
                  </td>
                </tr>
                <tr className="bg-surface/40">
                  <td className="px-4 py-3 font-medium text-navy">Протеин</td>
                  <td className="px-4 py-3 text-secondary">над 100</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    ~15+ nm
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    Хемоглобин (574), антитела
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-sm text-muted leading-relaxed max-w-3xl">
            Границата между полипептид и протеин не е строга, повечето учени
            смятат, че всичко над 50 аминокиселини обикновено се нарича протеин,
            но всичко зависи от дали молекулата има стабилна триизмерна
            структура. Семаглутид с 31 аминокиселини е пептид. Инсулин с 51
            аминокиселини, разпределени в две вериги, се счита за малък протеин.
          </p>
        </section>

        {/* Section 2: How peptide bond forms */}
        <section className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            02. Химия
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6 tracking-[-0.02em]">
            Как точно се свързват аминокиселините
          </h2>
          <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
            Всяка аминокиселина има две функционални групи в краищата си:
            аминогрупа (NH2) на единия край и карбоксилна група (COOH) на
            другия. Когато аминогрупата на едната среща карбоксилната на
            другата, се случва нещо красиво: образува се връзка и се отделя
            молекула вода.
          </p>

          <PeptideBondAnimation />
        </section>

        {/* Section 3: Size comparison */}
        <section className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            03. Мащаб
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6 tracking-[-0.02em]">
            Колко малки всъщност са пептидите
          </h2>
          <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
            За да разберем защо пептидите имат уникален терапевтичен профил,
            помага да видим техния размер в перспектива. Те са по-големи от
            класическите лекарства (като аспирин), но много по-малки от
            протеините. Този мащаб им дава най-доброто от двата свята: достатъчно
            малки, за да преминават през клетъчни мембрани, но достатъчно
            големи, за да имат специфични триизмерни структури за прецизно
            свързване.
          </p>

          <SizeComparison />
        </section>

        {/* Section 4: Types of peptides */}
        <section className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            04. Видове
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6 tracking-[-0.02em]">
            Какви видове пептиди съществуват
          </h2>
          <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
            Пептидите се класифицират по различни критерии. По произход
            (естествени или синтетични), по функция (хормонални, регулаторни,
            антимикробни), по размер. Тук са основните функционални категории,
            които ще срещате най-често в съвременната peptide наука.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PeptideTypeCard
              icon={Beaker}
              title="Хормонални"
              desc="Регулират функции в цялото тяло чрез сигнализация между органите. Инсулин, окситоцин, хормон на растежа, GLP-1."
              examples="Семаглутид, Тирзепатид, Окситоцин"
            />
            <PeptideTypeCard
              icon={ShieldCheck}
              title="Антимикробни"
              desc="Първа линия защита срещу бактерии и вируси. Произвеждат се от имунната система и кожата. Не предизвикват резистентност."
              examples="LL-37, дефензини, магаинин"
            />
            <PeptideTypeCard
              icon={Microscope}
              title="Регенеративни"
              desc="Стимулират възстановяване на тъкани, ангиогенеза и стволово-клетъчна миграция. Използват се при наранявания."
              examples="BPC-157, TB-500, GHK-Cu"
            />
            <PeptideTypeCard
              icon={Lightbulb}
              title="Невропептиди"
              desc="Действат в мозъка като невротрансмитери или невромодулатори. Регулират настроение, памет, болка, апетит."
              examples="Семакс, Селанк, ендорфини"
            />
            <PeptideTypeCard
              icon={FlaskConical}
              title="Структурни фрагменти"
              desc="Малки фрагменти на по-големи протеини, които запазват една специфична функция. Често се използват за изследване."
              examples="MGF (от IGF-1), AOD-9604 (от GH)"
            />
            <PeptideTypeCard
              icon={BookOpen}
              title="Биорегулатори"
              desc="Тъканно-специфични пептиди, които регулират функцията на конкретни органи. Школа на Khavinson в Санкт Петербург."
              examples="Епиталон, Тималин, Пинеалон"
            />
          </div>
        </section>

        {/* Section 5: Why peptides matter */}
        <section className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            05. Защо имат значение
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6 tracking-[-0.02em]">
            Пептиди срещу класически лекарства срещу протеини
          </h2>
          <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
            Пептидите попадат в уникална терапевтична зона. Имат предимствата на
            биологичните молекули (специфичност, естественост) с по-добър профил
            на странични ефекти от классическите лекарства, но без сложното
            производство и стабилност на протеините.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Характеристика</th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Малки молекули
                  </th>
                  <th className="text-left px-4 py-3 font-semibold bg-accent/20">
                    Пептиди
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">Протеини</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">
                    Специфичност на таргета
                  </td>
                  <td className="px-4 py-3 text-secondary">Ниска до средна</td>
                  <td className="px-4 py-3 text-navy bg-accent-tint/30">
                    Висока
                  </td>
                  <td className="px-4 py-3 text-secondary">Много висока</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">
                    Орална бионаличност
                  </td>
                  <td className="px-4 py-3 text-secondary">Добра</td>
                  <td className="px-4 py-3 text-navy bg-accent-tint/30">
                    Слаба (изисква инжекция)
                  </td>
                  <td className="px-4 py-3 text-secondary">Много слаба</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">
                    Цена на производство
                  </td>
                  <td className="px-4 py-3 text-secondary">Ниска</td>
                  <td className="px-4 py-3 text-navy bg-accent-tint/30">
                    Средна
                  </td>
                  <td className="px-4 py-3 text-secondary">Висока</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">
                    Полуживот в кръвта
                  </td>
                  <td className="px-4 py-3 text-secondary">Часове до дни</td>
                  <td className="px-4 py-3 text-navy bg-accent-tint/30">
                    Минути до дни (зависи от модификации)
                  </td>
                  <td className="px-4 py-3 text-secondary">Дни до седмици</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">
                    Имуногенност (риск за алергична реакция)
                  </td>
                  <td className="px-4 py-3 text-secondary">Ниска</td>
                  <td className="px-4 py-3 text-navy bg-accent-tint/30">
                    Ниска
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    Може да е значителна
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-navy">
                    Преминава клетъчна мембрана
                  </td>
                  <td className="px-4 py-3 text-secondary">Да</td>
                  <td className="px-4 py-3 text-navy bg-accent-tint/30">
                    Понякога
                  </td>
                  <td className="px-4 py-3 text-secondary">Не</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: How peptides are made */}
        <section className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            06. Производство
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6 tracking-[-0.02em]">
            Как точно се прави един пептид
          </h2>
          <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
            Съвременното peptide производство използва метод, изобретен от
            Bruce Merrifield през 1965 година. Нарича се solid-phase peptide
            synthesis и спечели Нобелова награда през 1984 година. Идеята е
            проста: вместо да опитваме да свържем аминокиселините в течен
            разтвор (където е трудно да отделим междинните продукти), ги
            прикрепяме една по една върху твърда смола.
          </p>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ProductionStep
              num="01"
              title="Прикрепяне"
              desc="Първата аминокиселина се прикрепя към смолна частица. Защитни групи покриват реактивните места."
            />
            <ProductionStep
              num="02"
              title="Свързване"
              desc="Втората аминокиселина се добавя. Образува се пептидна връзка. Излишните реагенти се измиват."
            />
            <ProductionStep
              num="03"
              title="Повторение"
              desc="Цикълът се повтаря за всяка следваща аминокиселина. За пептид с 30 аминокиселини, 30 цикъла."
            />
            <ProductionStep
              num="04"
              title="Освобождаване"
              desc="Готовият пептид се откъсва от смолата с химична реакция. Получава се суров пептид с примеси."
            />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <QualityStep
              title="HPLC пречистване"
              desc="Високоефективна течна хроматография разделя пептида от страничните продукти. Постига се чистота над 98%."
            />
            <QualityStep
              title="Масспектрометрия"
              desc="Mass spectrometry потвърждава, че получената молекула е точно пептидът, който търсим, по точна молекулна маса."
            />
            <QualityStep
              title="Лиофилизация"
              desc="Замразяване и сублимация на водата прави пептида стабилен в форма на бял прах за съхранение и транспорт."
            />
          </div>
        </section>

        {/* Section 7: History timeline */}
        <section className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            07. История
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6 tracking-[-0.02em]">
            120 години peptide наука
          </h2>
          <p className="text-secondary leading-relaxed mb-10 max-w-3xl">
            История на пептидите е история на постепенно разбиране как тялото
            ни регулира себе си с малки молекули. От първия синтетичен дипептид
            през 1902 година до тройните GLP-1 агонисти днес, прогресът никога
            не е спирал, и последните 5 години са най-революционни.
          </p>

          <PeptideTimeline />
        </section>

        {/* Section 8: How to read peptide names */}
        <section className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
            08. Тълкуване на имена
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6 tracking-[-0.02em]">
            Как да прочетеш име на пептид
          </h2>
          <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
            Имената на пептидите често изглеждат като код, но обикновено крият
            ясна логика. Ето няколко примера от каталога ни.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <NameDecoder
              name="BPC-157"
              parts={[
                { label: "BPC", meaning: "Body Protection Compound" },
                { label: "157", meaning: "фрагмент 1 до 57 на оригиналния протеин" },
              ]}
              full="Body Protection Compound, фрагмент 157, изолиран от стомашен сок"
            />
            <NameDecoder
              name="GLP-1"
              parts={[
                { label: "G", meaning: "Glucagon" },
                { label: "LP", meaning: "Like Peptide" },
                { label: "1", meaning: "първи открит вариант" },
              ]}
              full="Глюкагон-подобен пептид-1, инкретинов хормон"
            />
            <NameDecoder
              name="GHK-Cu"
              parts={[
                { label: "G", meaning: "Глицин" },
                { label: "H", meaning: "Хистидин" },
                { label: "K", meaning: "Лизин" },
                { label: "Cu", meaning: "меден йон" },
              ]}
              full="Трипептид Глицин-Хистидин-Лизин с свързан меден йон"
            />
            <NameDecoder
              name="CJC-1295"
              parts={[
                { label: "CJC", meaning: "ConjuChem (компанията-разработчик)" },
                { label: "1295", meaning: "вътрешен номер на молекулата" },
              ]}
              full="Модифициран GHRH аналог от ConjuChem"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-navy text-white p-8 md:p-12">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300 mb-3">
              Следваща стъпка
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 tracking-[-0.02em]">
              Разгледай каталога от 66+ изследователски пептида
            </h2>
            <p className="text-white/80 leading-relaxed mb-6">
              Всеки пептид в каталога ни идва с подробна научна страница,
              сертификат за анализ от независима лаборатория и над 98% HPLC
              чистота. Доставка в целия Европейски съюз за 1 до 7 работни дни.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-navy px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Виж каталога
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/encyclopedia"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Енциклопедия
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mt-12 rounded-xl border border-dashed border-border bg-surface/50 p-5">
          <p className="text-xs text-muted leading-relaxed">
            Тази страница е образователно ръководство, не медицински съвет.
            Всички продукти в каталога ни са предназначени единствено за
            научноизследователски цели in vitro. Не са одобрени за консумация
            от хора. Преди употреба в клинична или научна работа консултирайте
            се с квалифициран специалист.
          </p>
        </section>
      </div>
    </main>
  );
}

function PeptideTypeCard({
  icon: Icon,
  title,
  desc,
  examples,
}: {
  icon: typeof Beaker;
  title: string;
  desc: string;
  examples: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 hover:border-navy/30 transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface mb-4">
        <Icon size={18} className="text-navy" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-base font-bold text-navy mb-2">
        {title}
      </h3>
      <p className="text-sm text-secondary leading-relaxed mb-3">{desc}</p>
      <p className="font-mono text-[11px] text-muted">{examples}</p>
    </div>
  );
}

function ProductionStep({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 relative">
      <p className="absolute top-4 right-4 font-mono text-xs font-bold text-muted tabular">
        {num}
      </p>
      <h3 className="font-display text-base font-bold text-navy mb-2 mt-2">
        {title}
      </h3>
      <p className="text-sm text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}

function QualityStep({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border-l-4 border-accent bg-accent-tint/20 p-5">
      <h4 className="font-display text-base font-bold text-navy mb-2">
        {title}
      </h4>
      <p className="text-sm text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}

function NameDecoder({
  name,
  parts,
  full,
}: {
  name: string;
  parts: { label: string; meaning: string }[];
  full: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <p className="font-mono text-2xl font-bold text-navy mb-4">{name}</p>
      <div className="space-y-2 mb-4">
        {parts.map((part) => (
          <div
            key={part.label}
            className="flex items-baseline gap-3 text-sm"
          >
            <span className="font-mono font-bold text-accent shrink-0 min-w-[40px]">
              {part.label}
            </span>
            <span className="text-secondary">{part.meaning}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted leading-relaxed border-t border-border pt-3">
        {full}
      </p>
    </div>
  );
}
