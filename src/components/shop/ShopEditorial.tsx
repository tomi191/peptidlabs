import { Link } from "@/i18n/navigation";

type Intent = "all" | "weight-loss" | "healing";

const COPY: Record<
  Intent,
  Record<"bg" | "en", { paragraphs: string[] }>
> = {
  all: {
    bg: {
      paragraphs: [
        "Каталогът, който виждате, е подреден по изследователска цел, а не по азбуката. Тази разлика звучи дребна, но определя начина, по който работи реалната лаборатория — започвате с въпрос (заздравяване на сухожилие, метаболитен ефект, синаптична пластичност), а не с името на молекулата. Затова BPC-157 живее в „Заздравяване и регенерация“, Семаглутид и Тирзепатид в „Отслабване“, Селанк и Семакс в „Когнитивно“. Това опростява прехода от хипотеза към протокол, особено за изследователи, които сравняват алтернативи в рамките на същия механизъм.",
        "Зад всеки продукт стои един и същи стандарт. Партидите се синтезират по solid-phase Merrifield метод, проверяват се с високоефективна течна хроматография (HPLC) при гарантиран минимум 98% чистота — на практика повечето партиди постигат 99% и нагоре, точната стойност за конкретната партида е документирана в Сертификата за анализ (COA), който прилагаме към всяка поръчка. Идентичността се потвърждава с масспектрометрия. Това не е козметика — без HPLC и без независим COA няма как да твърдите, че експериментирате с това, което мислите, че експериментирате.",
        "Каталогът е силен в три направления. Регенеративната серия — BPC-157, TB-500, ARA-290, KPV — стъпва върху работата на Predrag Sikiric (Загребски университет, над 100 peer-reviewed статии). GLP-1 серията документира арката от Семаглутид (STEP проучванията, 14.9% редукция за 68 седмици) през Тирзепатид (SURMOUNT-1, 22.5% за 72 седмици) до експерименталния троен агонист Ретатрутид (TRIUMPH-1 в NEJM 2023, 24.2% за 48 седмици). Ноотропната секция включва руските пептиди Селанк и Семакс, нативния невропротективен Церебролизин и митохондриалния Хуманин.",
      ],
    },
    en: {
      paragraphs: [
        "The catalog you're looking at is organized by research goal, not by alphabet. The distinction sounds minor, but it shapes how a real lab actually works — you start with a question (tendon healing, metabolic effect, synaptic plasticity) rather than with a molecule's name. That's why BPC-157 lives under \"Healing and Regeneration,\" Semaglutide and Tirzepatide under \"Weight Loss,\" Selank and Semax under \"Cognitive.\" The arrangement simplifies the move from hypothesis to protocol, particularly for researchers comparing alternatives within the same mechanism.",
        "The same standard sits behind every product. Batches are synthesized by solid-phase Merrifield chemistry, then verified by high-performance liquid chromatography (HPLC) at a guaranteed minimum of 98% purity — in practice most batches reach 99% or higher, with the exact value for your specific batch documented in the Certificate of Analysis (COA) shipped with every order. Identity is confirmed by mass spectrometry. None of this is cosmetic — without HPLC and an independent COA you have no way to claim you're working with what you think you're working with.",
        "The catalog is strongest in three directions. The regenerative series — BPC-157, TB-500, ARA-290, KPV — stands on the work of Predrag Sikiric (University of Zagreb, over 100 peer-reviewed papers). The GLP-1 series traces the arc from Semaglutide (STEP trials, 14.9% reduction at 68 weeks) through Tirzepatide (SURMOUNT-1, 22.5% at 72 weeks) to the experimental triple agonist Retatrutide (TRIUMPH-1 in NEJM 2023, 24.2% at 48 weeks). The nootropic section covers the Russian peptides Selank and Semax, the native neuroprotective Cerebrolysin, and the mitochondrial Humanin.",
      ],
    },
  },
  "weight-loss": {
    bg: {
      paragraphs: [
        "Серията „Отслабване“ в каталога не е подбрана около пазарния шум, а около действителната научна арка на инкретиновата терапия. Между 2017 и 2026 година ендокринологията премина през три различни молекулни класа — селективен GLP-1, dual GLP-1+GIP twincretin, троен GLP-1+GIP+глюкагон агонист — и всеки следващ постави по-висок таван за фармакологично намаляване на телесна маса.",
        "Семаглутид е молекулата, която дефинира съвременната ера. STEP-1 показа 14.9% средна редукция на телесна маса за 68 седмици при 2.4 mg седмично — нов референтен бенчмарк, спрямо който се измерва всяко следващо съединение. Тирзепатид е следващата завъртявка — комбиниране на GLP-1 с GIP, балансиран twincretin афинитет, SURMOUNT-1 (NEJM 2022) даде 22.5% за 72 седмици. Това беше първият път, когато twincretin клас надминаваше монотерапията.",
        "Ретатрутид прави следващата стъпка — троен агонизъм на GLP-1 + GIP + глюкагоновия рецептор. Глюкагоновият компонент стимулира енергиен разход в кафявата мазнина без да повишава значимо кръвната захар, защото GLP-1 компенсира. TRIUMPH-1 (NEJM 2023) даде 24.2% за 48 седмици. Извън GLP-1 арката стои необичаен флангов път — 5-Amino-1MQ, селективен NNMT инхибитор (Sauve, Cornell, Nature 2014), който вместо да намалява приема на калории повишава енергийния разход. Кое да изследвате първо зависи от конкретния инкретинов въпрос, не от заглавието.",
      ],
    },
    en: {
      paragraphs: [
        "The \"Weight Loss\" series isn't curated around market noise but around the actual scientific arc of incretin therapy. Between 2017 and 2026, endocrinology moved through three distinct molecular classes — selective GLP-1, dual GLP-1+GIP twincretin, triple GLP-1+GIP+glucagon agonist — and each successive class raised the ceiling for pharmacological body mass reduction.",
        "Semaglutide is the molecule that defined the modern era. STEP-1 showed 14.9% mean body mass reduction at 68 weeks on 2.4 mg weekly — a new benchmark against which every subsequent compound is measured. Tirzepatide is the next turn — combining GLP-1 with GIP at balanced twincretin affinity. SURMOUNT-1 (NEJM 2022) delivered 22.5% at 72 weeks. That was the first time a twincretin class outperformed monotherapy.",
        "Retatrutide takes the next step — triple agonism of GLP-1 + GIP + glucagon receptors. The glucagon component stimulates energy expenditure in brown fat without significantly raising blood sugar, because GLP-1 compensates. TRIUMPH-1 (NEJM 2023) delivered 24.2% at 48 weeks. Beyond the GLP-1 arc sits an unusual flank route — 5-Amino-1MQ, a selective NNMT inhibitor (Sauve, Cornell, Nature 2014) that raises caloric expenditure rather than reducing intake. Which one to research first depends on the specific incretin question, not on the loudest headline.",
      ],
    },
  },
  healing: {
    bg: {
      paragraphs: [
        "Серията „Заздравяване и регенерация“ е изградена около една централна молекула с над 100 peer-reviewed публикации зад себе си — BPC-157. Body Protection Compound, или 15-аминокиселинен фрагмент от защитен протеин, изолиран от стомашния сок, беше характеризиран от групата на Predrag Sikiric в Загребския университет в началото на 90-те години.",
        "Първият механизъм е стимулация на ангиогенезата — растежа на нови кръвоносни съдове в наранена тъкан. В моделни проучвания на разкъсано Ахилесово сухожилие при плъхове, BPC-157 повишава експресията на VEGFR2 с 3-5 пъти и значително ускорява васкуларизацията. Вторият механизъм е модулация на NO системата с двупосочен ефект — в исхемични условия повишава NO за вазодилатация, в хипертензивни условия модулира свръхпроизводството. Тази бимодалност обяснява защо BPC-157 работи в много различни видове наранявания.",
        "TB-500 е класическият партньор — активен фрагмент LKKTETQ на естествения Thymosin Beta-4. Свързва G-actin и подпомага клетъчната миграция към местата на увреда. Двата механизма (васкуларизация + клетъчна миграция) са комплементарни. ARA-290 (Cibinetide) представя различен подход — EPO-производен пептид, IRR рецепторен агонист с FDA orphan drug designation. KPV е малка тристепенна молекула с противовъзпалителна активност, особено в чревната тъкан. Тези молекули не са с маркетинг bullet points — Sikiric лабораторията публикува по темата от 30+ години.",
      ],
    },
    en: {
      paragraphs: [
        "The \"Healing and Regeneration\" series is built around one central molecule with over 100 peer-reviewed publications behind it — BPC-157. Body Protection Compound, a 15-amino-acid fragment of a protective protein isolated from gastric juice, was characterized by Predrag Sikiric's group at the University of Zagreb in the early 1990s.",
        "The first mechanism is stimulation of angiogenesis — the growth of new blood vessels in injured tissue. In model studies of torn Achilles tendons in rats, BPC-157 raises VEGFR2 expression by 3 to 5 times and significantly accelerates vascularization. The second mechanism is modulation of the NO system with a bidirectional effect — in ischemic conditions it raises NO for vasodilation, in hypertensive conditions it modulates overproduction. This bimodality explains why BPC-157 works across many different injury types.",
        "TB-500 is the classic partner — the active LKKTETQ fragment of natural Thymosin Beta-4. It binds G-actin and assists cell migration to sites of damage. The two mechanisms (vascularization + cell migration) are complementary. ARA-290 (Cibinetide) represents a different approach — an EPO-derived peptide, IRR receptor agonist with FDA orphan drug designation. KPV is a small tripeptide with anti-inflammatory activity, particularly in the gut. These aren't molecules with marketing bullet points — the Sikiric lab has been publishing on the subject for 30+ years.",
      ],
    },
  },
};

type Props = {
  intent: Intent;
  locale: "bg" | "en" | string;
};

/**
 * Editorial intro paragraphs for /shop and the highest-traffic shop
 * categories (/shop/weight-loss, /shop/healing). Per the SEO audit
 * these cluster keywords were owned by educational sites; flanking
 * with both editorial AND commercial content gives us a chance at
 * top-3 ranking. Flowing prose, no bullet hell, no AI slop.
 */
export function ShopEditorial({ intent, locale }: Props) {
  const lang = locale === "bg" ? "bg" : "en";
  const copy = COPY[intent][lang];

  return (
    <section className="mb-12 max-w-3xl">
      <details
        open
        className="group prose-shop space-y-4 text-secondary leading-relaxed"
      >
        <summary className="sr-only">
          {lang === "bg" ? "Преглед" : "Overview"}
        </summary>
        {copy.paragraphs.map((p, i) => (
          <p key={i} className="text-[15px]">
            {p}
          </p>
        ))}
        <p className="text-sm text-muted pt-2">
          {lang === "bg" ? "Свързани ресурси: " : "Related resources: "}
          <Link href="/encyclopedia" className="text-accent underline decoration-dotted hover:no-underline">
            {lang === "bg" ? "Енциклопедия" : "Encyclopedia"}
          </Link>
          {" · "}
          <Link href="/calculator" className="text-accent underline decoration-dotted hover:no-underline">
            {lang === "bg" ? "Калкулатор за реконституция" : "Reconstitution calculator"}
          </Link>
          {" · "}
          <Link href="/coa-vault" className="text-accent underline decoration-dotted hover:no-underline">
            COA Vault
          </Link>
        </p>
      </details>
    </section>
  );
}
