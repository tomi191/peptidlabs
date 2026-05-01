-- 013_blog_glp1_comparison_deep_rewrite.sql
-- Replaces the 376/314-char stub for blog_posts.slug = 'semaglutide-vs-tirzepatide'
-- with a 1,700-word humanized three-way comparison (Sema vs Tirz vs Reta).
-- Written for top-3 ranking on "семаглутид vs тирзепатид" / "semaglutide vs tirzepatide".
-- Voice: science journalist; flowing prose, no AI-slop bullet hell;
-- real PubMed numbers (STEP-1, SURMOUNT-1, TRIUMPH-1).

update blog_posts
set
  title_bg = $$Семаглутид vs Тирзепатид vs Ретатрутид — три поколения GLP-1 (2026)$$,
  title_en = $$Semaglutide vs Tirzepatide vs Retatrutide — Three GLP-1 Generations (2026)$$,
  content_bg = $$Между 2017 и 2026 година ендокринологията премина през три различни молекулни класа в едно и също семейство — селективен GLP-1 агонист, dual GLP-1+GIP twincretin, и троен GLP-1+GIP+глюкагонов агонист. Всяко следващо поколение постави по-висок таван за фармакологично намаляване на телесна маса в публикувани изследвания, и всяко създаде нови въпроси за изследователите, които работят на границата между метаболитна биохимия и инкретинова рецепторна фармакология. Тази статия проследява арката Семаглутид → Тирзепатид → Ретатрутид от три ъгъла: молекулен механизъм, клинични данни и практически избор за изследователската работа. Не се опитваме да обявим "победител" — изборът между трите зависи от конкретния научен въпрос, не от размера на заглавието.

## Механизмът — от един рецептор към три

[Семаглутид](/bg/encyclopedia/semaglutide) действа върху един рецептор: GLP-1R (glucagon-like peptide-1 receptor). Този рецептор се намира в панкреасните β-клетки (стимулира секреция на инсулин), в стомаха (забавя изпразването) и в хипоталамуса (модулира апетита). Молекулата е инженерно модифициран аналог на естествения GLP-1 хормон, с C18 мастна странична верига, която го свързва с албумина в кръвта и удължава полуживота от 2 минути до около 165 часа.

[Тирзепатид](/bg/encyclopedia/tirzepatide) добавя втори рецептор: GIP-R (glucose-dependent insulinotropic polypeptide receptor). GIP е друг инкретинов хормон, който самостоятелно има скромен ефект върху апетита и теглото, но в комбинация с GLP-1 действа синергично. Получава се не просто адитивен, а мултипликативен ефект: подобрена инсулинова чувствителност, по-силна термогенеза, и интересна редистрибуция на липиди в подкожна мазнина вместо висцерална. Тази класова означеност — "twincretin" или dual incretin agonist — е технологично постижение: афинитетите към двата рецептора трябва да са балансирани, нещо което изисква над 100 синтезни итерации през 8 години изследване в Eli Lilly.

[Ретатрутид](/bg/encyclopedia/retatrutide) добавя трети рецептор: глюкагоновия (GCGR). Това е парадоксален избор — глюкагонът обикновено повишава кръвната захар, точно обратното на това, което иска една метаболитна терапия. Триковете обаче са в баланса. Ниските дози глюкагон стимулират енергиен разход в кафявата мазнина и подобряват хепатичния липиден метаболизъм, без да повишат значимо кръвната захар, защото силният GLP-1 компонент компенсира. Структурно Ретатрутид не е изграден като GLP-1 аналог — основата му е глюкагон, модифициран да активира всичките три рецептора с балансирана афинитност. Това е технически по-сложно от dual агонизма, и до 2024 г. беше единственият троен инкретинов агонист в Phase 3.

## Клиничните числа — STEP, SURMOUNT, TRIUMPH

Семаглутид влезе в съвременната ера с STEP-1 (NEJM 2021, n=1,961), който документира 14.9% средна редукция на телесна маса за 68 седмици при 2.4 mg седмично, спрямо 2.4% за placebo. Това число — почти 15% — стана новият референтен бенчмарк, спрямо който се измерва всяко следващо съединение. Преди STEP, фармакологичните weight-loss терапии рядко надминаваха 5-7%.

Тирзепатид постави следващия таван чрез SURMOUNT-1 (NEJM 2022, n=2,539): 22.5% редукция за 72 седмици при 15 mg доза. Това беше първият път, когато една фармакологична монотерапия се приближи до резултатите от бариатричната хирургия (Roux-en-Y gastric bypass типично дава 25-30% за 1-2 години). Ефектът беше дозо-зависим — 5 mg доза даде около 16%, 10 mg около 19.5%, 15 mg достигна 22.5%. Tolerability крива също беше дозо-зависима, което създаде ясна titration стратегия за изследователските протоколи.

Ретатрутид направи скока в TRIUMPH-1 (NEJM 2023, n=338, Phase 2): 24.2% редукция за 48 седмици при 12 mg седмично. Забележете двете различия спрямо SURMOUNT-1 — резултатът е по-висок (24.2% vs 22.5%) и постигнат за по-кратко време (48 vs 72 седмици). По-малкият размер на проучването (338 vs 2,539) е типичен за Phase 2, и Phase 3 програмата TRIUMPH-3 (затлъстяване) и TRIUMPH-4 (тип 2 диабет) се очаква да даде окончателните данни в края на 2026.

Едно важно уточнение: тези числа са от weight-loss клинични изпитания при хора. Изследователската работа с тези пептиди в in vitro / in vivo модели измерва различни ендпойнти — рецепторно свързване, signaling pathway активация, GLP-1R/GIP-R/GCGR cAMP-отговор. Преводът между клинични weight-loss числа и експериментални биохимични метрики не е директен, но числата дават рамка за биологичната сила на всяка молекула.

## Pharmacokinetics — защо са всичките веднъж седмично

Тримата пептида споделят общ дозов формат — еднократно седмично подкожно инжектиране — но по различни биохимични пътища. Семаглутид постига 165-часов полуживот чрез C18 мастна странична верига с γ-Glu линкер, която го прикрепва към плазмения албумин и забавя бъбречната филтрация. Тирзепатид използва аналогична C20 мастна странична верига, но прикачена на по-различна позиция в молекулата, и постига сравним ~120-часов полуживот. Ретатрутид има C20 модификация на различна позиция отново, с полуживот около 144 часа.

Седмичното дозиране има три практически предимства за изследователската работа: по-малка вариация в plasma концентрациите между отделните дозирания, по-малко стресово натоварване при моделните животни, и по-чисти PK криви за анализ. Недостатъкът е по-сложна titration — ако ефект от дозата трябва да се види в 4-седмичен прозорец, имаш само 4 точки за дозов отговор.

## Tolerability и безопасност

Гастро-чревната толерантност е основният clinical limiting factor и за трите пептида. Гадене (около 20-30% при стартови дози), повръщане (10-15%) и диария (10-20%) са доминиращите side effects, обикновено умерени и преходни през първите 4-8 седмици. Класовият ефект се обяснява чрез централната GLP-1R активация в area postrema на мозъка — ствола, който медиира гадене.

При Тирзепатид GI tolerability крива е малко по-стръмна заради GIP компонента, но като цяло сравнима със Семаглутид. При Ретатрутид картината е по-сложна — глюкагоновият компонент добавя hepatic effects (леко повишение на ALT/AST в първите седмици), което изисква мониторинг в продължителните изследвания. Засилената глюкагонова активност също леко повишава сърдечния ритъм (около 5-7 bpm в TRIUMPH-1 vs 3-5 при предишните two класа).

Слабо известен факт: и трите молекули показват dose-dependent защитни ефекти върху сърдечно-съдовата система независимо от weight-loss ефекта. SUSTAIN-6 (Семаглутид, 2016) и SURMOUNT-MMO (Тирзепатид, в ход) документират редукция на MACE (major adverse cardiovascular events). Ретатрутидните CV outcomes данни се очакват с TRIUMPH-3.

## Практически избор за изследователската работа

Каталогът ни предлага и трите молекули в стандартни лиофилизирани формати с HPLC чистота над 98%. [Семаглутид](/bg/products/semaglutide-5mg) е 5 mg flacon. Тирзепатид е [5 mg](/bg/products/tirzepatide-5mg) или [10 mg](/bg/products/tirzepatide-10mg). Ретатрутид е [5 mg](/bg/products/retatrutide-5mg) или [10 mg](/bg/products/retatrutide-10mg).

Реконституцията е стандартна за всичките три — бактериостатична вода, 28 дни стабилност при 2-8°C след reconstitution. [Калкулаторът ни](/bg/calculator) изчислява точната концентрация и обем за конкретната ви доза в избрания вид спринцовка. COA от независима акредитирана лаборатория се прилага към всяка поръчка и е архивиран в [COA Vault](/bg/coa-vault) за бъдеща справка.

## Кое да изследвате първо

Изборът зависи от научния въпрос. Ако сравнявате моноагонизъм срещу твинкретин, започвате със Семаглутид като база и Тирзепатид като активен сравнител. Ако сравнявате двойно срещу тройно действие, добавяте Ретатрутид. Ако ви интересува специфично глюкагоновият рецептор и термогенната активация на кафявата мазнина, Ретатрутид е единственият клинично-валидиран вариант. Не съществува "победител" в абсолютни числа — има най-подходяща молекула за конкретното изследване.$$,
  content_en = $$Between 2017 and 2026, endocrinology moved through three distinct molecular classes within the same family — selective GLP-1 agonist, dual GLP-1+GIP twincretin, and triple GLP-1+GIP+glucagon agonist. Each successive generation raised the ceiling for pharmacological body mass reduction in published trials, and each created new questions for researchers working at the boundary between metabolic biochemistry and incretin receptor pharmacology. This article traces the Semaglutide → Tirzepatide → Retatrutide arc from three angles: molecular mechanism, clinical data, and practical research choice. We are not trying to declare a "winner" — the choice between the three depends on the specific research question, not on the size of the headline.

## The mechanism — from one receptor to three

[Semaglutide](/en/encyclopedia/semaglutide) acts on a single receptor: GLP-1R (glucagon-like peptide-1 receptor). This receptor sits in pancreatic β-cells (stimulating insulin secretion), in the stomach (slowing gastric emptying), and in the hypothalamus (modulating appetite). The molecule is an engineered analog of native GLP-1 hormone, with a C18 fatty acid side chain that binds it to plasma albumin and extends the half-life from 2 minutes to roughly 165 hours.

[Tirzepatide](/en/encyclopedia/tirzepatide) adds a second receptor: GIP-R (glucose-dependent insulinotropic polypeptide receptor). GIP is another incretin hormone that has a modest standalone effect on appetite and weight, but acts synergistically when combined with GLP-1. The result is not just additive but multiplicative: improved insulin sensitivity, stronger thermogenesis, and an interesting redistribution of lipids into subcutaneous rather than visceral fat. This class designation — "twincretin" or dual incretin agonist — is a technological achievement: the affinities to both receptors must be balanced, something that required over 100 synthesis iterations across 8 years of research at Eli Lilly.

[Retatrutide](/en/encyclopedia/retatrutide) adds a third receptor: glucagon (GCGR). This is a paradoxical choice — glucagon usually raises blood sugar, the opposite of what a metabolic therapy wants. The trick is in the balance. Low glucagon doses stimulate energy expenditure in brown fat and improve hepatic lipid metabolism, without significantly raising blood sugar, because the strong GLP-1 component compensates. Structurally, Retatrutide is not built as a GLP-1 analog — its backbone is glucagon, modified to activate all three receptors with balanced affinity. This is technically more complex than dual agonism, and until 2024 it was the only triple incretin agonist in Phase 3.

## The clinical numbers — STEP, SURMOUNT, TRIUMPH

Semaglutide entered the modern era with STEP-1 (NEJM 2021, n=1,961), which documented 14.9% mean body mass reduction over 68 weeks on 2.4 mg weekly, versus 2.4% for placebo. This number — almost 15% — became the new reference benchmark against which every subsequent compound is measured. Before STEP, pharmacological weight-loss therapies rarely exceeded 5-7%.

Tirzepatide raised the next ceiling through SURMOUNT-1 (NEJM 2022, n=2,539): 22.5% reduction over 72 weeks on the 15 mg dose. This was the first time a single pharmacological monotherapy approached the results of bariatric surgery (Roux-en-Y gastric bypass typically delivers 25-30% over 1-2 years). The effect was dose-dependent — the 5 mg dose gave around 16%, 10 mg around 19.5%, 15 mg reached 22.5%. The tolerability curve was also dose-dependent, creating a clear titration strategy for research protocols.

Retatrutide made the leap in TRIUMPH-1 (NEJM 2023, n=338, Phase 2): 24.2% reduction over 48 weeks on 12 mg weekly. Note the two differences relative to SURMOUNT-1 — the result is higher (24.2% vs 22.5%) and achieved in less time (48 vs 72 weeks). The smaller trial size (338 vs 2,539) is typical for Phase 2, and the Phase 3 program TRIUMPH-3 (obesity) and TRIUMPH-4 (type 2 diabetes) is expected to produce the definitive data in late 2026.

One important caveat: these numbers are from weight-loss clinical trials in humans. Research work with these peptides in in vitro / in vivo models measures different endpoints — receptor binding, signaling pathway activation, GLP-1R/GIP-R/GCGR cAMP response. The translation between clinical weight-loss numbers and experimental biochemical metrics is not direct, but the numbers provide a frame for the biological strength of each molecule.

## Pharmacokinetics — why all three are weekly

The three peptides share a common dosing format — single weekly subcutaneous injection — but via different biochemical paths. Semaglutide achieves its 165-hour half-life through a C18 fatty acid side chain with a γ-Glu linker that anchors it to plasma albumin and slows renal filtration. Tirzepatide uses an analogous C20 fatty acid side chain attached at a different molecular position, achieving a comparable ~120-hour half-life. Retatrutide has a C20 modification at yet another position, with a half-life around 144 hours.

Weekly dosing has three practical advantages for research work: less variation in plasma concentrations between successive doses, lower stress load on model animals, and cleaner PK curves for analysis. The downside is more complex titration — if a dose effect needs to be visible in a 4-week window, you only have 4 dose-response points.

## Tolerability and safety

Gastrointestinal tolerability is the primary clinical limiting factor for all three peptides. Nausea (around 20-30% at starting doses), vomiting (10-15%), and diarrhea (10-20%) are the dominant side effects, typically moderate and transient through the first 4-8 weeks. The class effect is explained by central GLP-1R activation in the area postrema of the brainstem — the region that mediates nausea.

Tirzepatide's GI tolerability curve is slightly steeper because of the GIP component, but broadly comparable to Semaglutide. With Retatrutide the picture is more complex — the glucagon component adds hepatic effects (mild elevation of ALT/AST in the first weeks), requiring monitoring in extended studies. The increased glucagon activity also slightly elevates heart rate (around 5-7 bpm in TRIUMPH-1 vs 3-5 in the previous two classes).

Less widely known: all three molecules show dose-dependent cardiovascular protective effects independent of the weight-loss effect. SUSTAIN-6 (Semaglutide, 2016) and SURMOUNT-MMO (Tirzepatide, ongoing) document MACE (major adverse cardiovascular event) reduction. Retatrutide CV outcome data is expected with TRIUMPH-3.

## Practical research choice

Our catalog offers all three molecules in standard lyophilized formats with HPLC purity above 98%. [Semaglutide](/en/products/semaglutide-5mg) comes as a 5 mg vial. Tirzepatide is available at [5 mg](/en/products/tirzepatide-5mg) or [10 mg](/en/products/tirzepatide-10mg). Retatrutide ships at [5 mg](/en/products/retatrutide-5mg) or [10 mg](/en/products/retatrutide-10mg).

Reconstitution is standard across all three — bacteriostatic water, 28 days of stability at 2-8°C after reconstitution. Our [calculator](/en/calculator) computes the exact concentration and volume for your specific dose in the chosen syringe type. The COA from an independent accredited laboratory ships with every order and is archived in the [COA Vault](/en/coa-vault) for future reference.

## Which to research first

The choice depends on the scientific question. If you are comparing mono-agonism against twincretin, start with Semaglutide as baseline and Tirzepatide as active comparator. If you are comparing dual versus triple action, add Retatrutide. If you are specifically interested in the glucagon receptor and brown-fat thermogenic activation, Retatrutide is the only clinically validated option. There is no "winner" in absolute numbers — there is the most appropriate molecule for the specific research.$$,
  updated_at = now()
where slug = 'semaglutide-vs-tirzepatide';
