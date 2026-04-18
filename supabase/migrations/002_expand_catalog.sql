-- Migration: 002_expand_catalog.sql
-- Run via Supabase SQL Editor: https://app.supabase.com/project/zoduyztajymsegxzifez/sql
-- Adds 8 new peptides + 10 product variants to bring catalog to 33 peptides / 65 SKUs.
-- Covers 2026 trending peptides: Retatrutide, NAD+, Cerebrolysin, 5-Amino-1MQ, MGF, ARA-290, Oxytocin, Humanin.

-- ==================== PEPTIDES ====================

insert into peptides (slug, name, full_name_bg, full_name_en, formula, mechanism_bg, mechanism_en, summary_bg, summary_en, research_links) values

('retatrutide', 'Retatrutide', 'Ретатрутид', 'Retatrutide', 'C226H350N48O68',
'Ретатрутид е синтетичен троен агонист, който едновременно активира GLP-1, GIP и глюкагонови рецептори. В клинични проучвания от Eli Lilly (SURMOUNT и TRIUMPH серии) е документирана загуба на тегло, значително надвишаваща тази от Семаглутид и Тирзепатид — средно 24% на телесна маса за 48 седмици. Механизмът комбинира понижаване на апетита (GLP-1/GIP), повишена енергийна изразходваност (глюкагон) и подобрен липиден метаболизъм. Считан за следващото поколение GLP-1 терапия. Съхранява се при -20°C, стабилен в реконституиран разтвор до 28 дни при 2-8°C.',
'Retatrutide is a synthetic triple agonist that simultaneously activates GLP-1, GIP and glucagon receptors. In Eli Lilly clinical trials (SURMOUNT and TRIUMPH series), documented weight loss significantly exceeds that of Semaglutide and Tirzepatide — averaging 24% body mass over 48 weeks. The mechanism combines appetite reduction (GLP-1/GIP), increased energy expenditure (glucagon) and improved lipid metabolism. Considered the next generation of GLP-1 therapy. Storage at -20°C, stable in reconstituted solution up to 28 days at 2-8°C.',
'Ретатрутид е най-търсеният нов пептид за отслабване през 2026. Проучванията показват значително по-силни резултати от Семаглутид и Тирзепатид, благодарение на уникалния троен механизъм на действие.',
'Retatrutide is the most sought-after new weight loss peptide in 2026. Studies show significantly stronger results than Semaglutide and Tirzepatide thanks to its unique triple mechanism of action.',
array['https://pubmed.ncbi.nlm.nih.gov/37366476/', 'https://pubmed.ncbi.nlm.nih.gov/37696673/', 'https://pubmed.ncbi.nlm.nih.gov/38052213/']
),

('nad', 'NAD+', 'NAD+ (Никотинамид аденин динуклеотид)', 'NAD+ (Nicotinamide Adenine Dinucleotide)', 'C21H28N7O14P2',
'NAD+ е коензим, присъстващ във всяка клетка, който играе централна роля в клетъчния енергиен метаболизъм, митохондриалната функция и активирането на сиртуините (SIRT1-7). Нивата намаляват с възрастта, което е свързано с редица признаци на стареене. В проучванията на д-р David Sinclair (Харвард) и групата на Shin-ichiro Imai (Washington University) се описва потенциал за възстановяване на митохондриална функция, подобрена инсулинова чувствителност и активация на автофагия. NMN е прекурсор на NAD+ и често се използва в биохакерски протоколи за дълголетие. Съхранява се при 2-8°C на тъмно, защитен от светлина.',
'NAD+ is a coenzyme present in every cell, playing a central role in cellular energy metabolism, mitochondrial function and sirtuin (SIRT1-7) activation. Levels decline with age, which is linked to multiple hallmarks of aging. In research by Dr. David Sinclair (Harvard) and Shin-ichiro Imai''s group (Washington University), potential for mitochondrial function restoration, improved insulin sensitivity and autophagy activation is described. NMN is a NAD+ precursor commonly used in biohacking longevity protocols. Store at 2-8°C in the dark, protected from light.',
'NAD+ е един от най-изследваните пептиди за дълголетие и клетъчно стареене. Биохакери от Силициевата долина го използват за митохондриална функция и енергийни нива.',
'NAD+ is one of the most researched peptides for longevity and cellular aging. Silicon Valley biohackers use it for mitochondrial function and energy levels.',
array['https://pubmed.ncbi.nlm.nih.gov/35859320/', 'https://pubmed.ncbi.nlm.nih.gov/29917560/', 'https://pubmed.ncbi.nlm.nih.gov/32905395/']
),

('cerebrolysin', 'Cerebrolysin', 'Церебролизин', 'Cerebrolysin', NULL,
'Церебролизин е пептиден комплекс, получен от пречистен свински мозъчен тъкан, съдържащ невротрофни пептиди с молекулно тегло под 10 kDa. Клинично одобрен в над 50 страни, основно в Източна Европа и Русия, с десетилетия научна литература. В публикуваните проучвания се описва потенциал за невропротекция след инсулт, когнитивно подобрение при деменция и възстановяване след травматични мозъчни увреждания. Механизмът включва активиране на BDNF, NGF и GDNF сигнални пътища. Продукт с най-голяма история на клинична употреба в невропротективната категория. Съхранение: 2-25°C, защитен от светлина.',
'Cerebrolysin is a peptide complex derived from purified porcine brain tissue, containing neurotrophic peptides with molecular weight below 10 kDa. Clinically approved in over 50 countries, primarily in Eastern Europe and Russia, with decades of scientific literature. Published studies describe potential for neuroprotection after stroke, cognitive improvement in dementia and recovery after traumatic brain injury. The mechanism involves activation of BDNF, NGF and GDNF signaling pathways. Product with the longest history of clinical use in the neuroprotective category. Storage: 2-25°C, protected from light.',
'Церебролизин е класически невропротективен пептид с дълга история на употреба в Източна Европа. Изследван за подобряване на когнитивните функции и възстановяване след мозъчни увреждания.',
'Cerebrolysin is a classic neuroprotective peptide with long history of use in Eastern Europe. Studied for cognitive improvement and recovery after brain injury.',
array['https://pubmed.ncbi.nlm.nih.gov/31304427/', 'https://pubmed.ncbi.nlm.nih.gov/31691064/', 'https://pubmed.ncbi.nlm.nih.gov/29907161/']
),

('5-amino-1mq', '5-Amino-1MQ', '5-Амино-1MQ', '5-Amino-1MQ', 'C11H10N2',
'5-Амино-1MQ е малка молекула, инхибиращ ензима NNMT (никотинамид N-метилтрансфераза). В проучвания, публикувани в Biochemical Pharmacology (2018), се описва редукция на мастната маса при мишки с over 25% за 11 дни без промяна в приема на храна. Механизмът включва повишаване на нивата на NAD+ и SAM (S-аденозилметионин), което води до увеличен клетъчен метаболизъм. Емергентен peptide в биохакерските кръгове през 2025-2026 г. Съхранение: -20°C, стабилен 24 месеца.',
'5-Amino-1MQ is a small molecule inhibiting the enzyme NNMT (nicotinamide N-methyltransferase). Studies published in Biochemical Pharmacology (2018) describe fat mass reduction in mice over 25% in 11 days without change in food intake. The mechanism involves raising NAD+ and SAM (S-adenosylmethionine) levels, leading to increased cellular metabolism. Emerging peptide in biohacking circles during 2025-2026. Storage: -20°C, stable for 24 months.',
'5-Амино-1MQ е нов метаболитен пептид, изследван за подобряване на енергийния метаболизъм и редукция на мастна тъкан без диета.',
'5-Amino-1MQ is a new metabolic peptide studied for improved energy metabolism and fat mass reduction without dieting.',
array['https://pubmed.ncbi.nlm.nih.gov/29175257/', 'https://pubmed.ncbi.nlm.nih.gov/30655328/']
),

('mgf', 'MGF', 'MGF (Механо растежен фактор)', 'MGF (Mechano Growth Factor)', 'C121H200N42O39',
'MGF е сплайс-вариант на IGF-1, който се експресира в мускулна тъкан след механично натоварване или увреждане. Ролята му е активиране на мускулни сателитни клетки, които участват в регенерацията и хипертрофията. В публикуваните изследвания на Geoffrey Goldspink се описва значителен потенциал за ускорена възстановяване на мускулни влакна. PEG-MGF (полиетилен гликол конюгиран) е по-стабилен вариант със систeмно действие. Съхранение: -20°C в лиофилизирана форма.',
'MGF is a splice variant of IGF-1 expressed in muscle tissue after mechanical loading or injury. Its role is activating muscle satellite cells involved in regeneration and hypertrophy. Published research by Geoffrey Goldspink describes significant potential for accelerated muscle fiber recovery. PEG-MGF (polyethylene glycol conjugated) is a more stable variant with systemic action. Storage: -20°C in lyophilized form.',
'MGF е пептид за мускулен растеж и възстановяване, изолиран за първи път в Лондонския университет. Активира сателитните клетки, отговорни за мускулната регенерация.',
'MGF is a peptide for muscle growth and recovery, first isolated at University of London. Activates satellite cells responsible for muscle regeneration.',
array['https://pubmed.ncbi.nlm.nih.gov/15772204/', 'https://pubmed.ncbi.nlm.nih.gov/14534151/']
),

('ara-290', 'ARA-290', 'ARA-290 (Цибинетид)', 'ARA-290 (Cibinetide)', 'C46H77N13O14',
'ARA-290 (Цибинетид) е 11-аминокиселинен пептид, производен на еритропоетина, но без еритропоетична активност. Свързва се с innate repair receptor (IRR) и задейства тъканни защитни и регенеративни механизми. В клинични проучвания при саркоидоза и диабетна невропатия се описва значително намаляване на невропатичната болка и подобрение на функцията на малките нервни влакна. Голяма част от изследванията са проведени в Leiden University Medical Center. Съхранение: -20°C, защитен от светлина.',
'ARA-290 (Cibinetide) is an 11-amino acid peptide derived from erythropoietin, but without erythropoietic activity. Binds to the innate repair receptor (IRR) and triggers tissue protective and regenerative mechanisms. In clinical studies in sarcoidosis and diabetic neuropathy, significant reduction of neuropathic pain and improvement of small nerve fiber function is described. Much of the research was conducted at Leiden University Medical Center. Storage: -20°C, protected from light.',
'ARA-290 е иновативен пептид за нервна регенерация и намаляване на невропатичната болка. Клиничните проучвания показват резултати при диабетна невропатия и саркоидоза.',
'ARA-290 is an innovative peptide for nerve regeneration and neuropathic pain reduction. Clinical trials show results in diabetic neuropathy and sarcoidosis.',
array['https://pubmed.ncbi.nlm.nih.gov/27216919/', 'https://pubmed.ncbi.nlm.nih.gov/28280776/']
),

('oxytocin', 'Oxytocin', 'Окситоцин', 'Oxytocin', 'C43H66N12O12S2',
'Окситоцинът е 9-аминокиселинен невропептид, синтезиран в хипоталамуса. Освен добре познатите функции при раждане и лактация, в съвременните изследвания се описват роли в социалната свързаност, доверието и емоционалната регулация. Публикуваните проучвания включват изследвания върху аутизъм, социална тревожност и PTSD. В биохакерските кръгове се изследва като назален спрей за социална свързаност и емпатия. Бележим период на полуживот от ~3-5 минути при интраназално приложение. Съхранение: 2-8°C реконституиран.',
'Oxytocin is a 9-amino acid neuropeptide synthesized in the hypothalamus. Beyond its well-known functions in childbirth and lactation, modern research describes roles in social bonding, trust and emotional regulation. Published studies include research on autism, social anxiety and PTSD. In biohacking circles, it is investigated as a nasal spray for social connection and empathy. Notable half-life of ~3-5 minutes with intranasal administration. Storage: 2-8°C reconstituted.',
'Окситоцинът е пептидът на социалната свързаност. Изследван за подобряване на емпатията, доверието и емоционалната регулация в биохакерски протоколи.',
'Oxytocin is the peptide of social connection. Studied for improving empathy, trust and emotional regulation in biohacking protocols.',
array['https://pubmed.ncbi.nlm.nih.gov/21334017/', 'https://pubmed.ncbi.nlm.nih.gov/29680668/']
),

('humanin', 'Humanin', 'Хуманин', 'Humanin', 'C113H176N38O33',
'Хуманин е 24-аминокиселинен пептид, кодиран от митохондриалната ДНК (16S rRNA ген). Открит от Nishimoto и колеги през 2001 г. в контекста на Алцхаймер изследвания. В литературата се описват невропротективни и метаболитни ефекти, включително редукция на апоптозата на невроните и подобрена инсулинова чувствителност. Нивата в плазмата намаляват с възрастта. Изследва се интензивно в лабораторията на Pinchas Cohen (USC) като маркер и потенциален терапевтик в свързани с възрастта заболявания. Съхранение: -20°C.',
'Humanin is a 24-amino acid peptide encoded by mitochondrial DNA (16S rRNA gene). Discovered by Nishimoto and colleagues in 2001 in the context of Alzheimer research. Literature describes neuroprotective and metabolic effects, including reduction of neuronal apoptosis and improved insulin sensitivity. Plasma levels decline with age. Intensively studied in Pinchas Cohen''s laboratory (USC) as a marker and potential therapeutic in age-related diseases. Storage: -20°C.',
'Хуманин е митохондриален пептид, чиито нива намаляват с възрастта. Изследван за невропротекция и метаболитно здраве при свързани с възрастта състояния.',
'Humanin is a mitochondrial peptide whose levels decline with age. Studied for neuroprotection and metabolic health in age-related conditions.',
array['https://pubmed.ncbi.nlm.nih.gov/32474162/', 'https://pubmed.ncbi.nlm.nih.gov/31144456/']
);

-- ==================== PRODUCTS ====================

insert into products (slug, sku, name, name_bg, description_bg, summary_bg, price_bgn, price_eur, vial_size_mg, form, purity_percent, status, stock, scientific_data, use_case_tag_bg, use_case_tag_en, is_bestseller) values

('retatrutide-5mg', 'PL-RETA5', 'Retatrutide', 'Ретатрутид 5mg',
'Ретатрутид 5mg е лиофилизиран прах с research grade качество, доставян в стерилен стъклен флакон. Чистотата е верифицирана чрез HPLC анализ с резултат ≥98%, като всяка партида се придружава от независим Сертификат за анализ (COA).

Ретатрутид е най-търсеният нов пептид за метаболитни изследвания през 2026 г. Тройният агонизъм (GLP-1/GIP/глюкагон) е предмет на интензивни проучвания от Eli Lilly, включително SURMOUNT-5 и TRIUMPH сериите. Публикуваните резултати описват значително намаляване на телесната маса и подобрения в липидния метаболизъм.

Продуктът се доставя в лиофилизирана форма за максимална стабилност. Съхранявайте при -20°C преди реконституция. Реконституираният разтвор е стабилен до 28 дни при 2-8°C. Всяка поръчка включва COA с HPLC хроматограма и данни за чистота. Предназначен единствено за научноизследователски цели in vitro.',
'Ретатрутид 5mg — лиофилизиран прах, троен GLP-1/GIP/глюкагон агонист. Най-новото поколение изследвани метаболитни пептиди.',
234.48, 119.90, 5, 'lyophilized', 98, 'published', 50,
'{"mechanism": "Triple agonist of GLP-1, GIP and glucagon receptors", "half_life": "~6 days", "storage": "Store at -20°C lyophilized", "pubmed_links": ["https://pubmed.ncbi.nlm.nih.gov/37366476/", "https://pubmed.ncbi.nlm.nih.gov/37696673/"]}',
'за отслабване (троен агонист)', 'for weight management (triple agonist)', true),

('retatrutide-10mg', 'PL-RETA10', 'Retatrutide', 'Ретатрутид 10mg',
'Ретатрутид 10mg е двойният размер на най-търсения нов метаболитен пептид. Лиофилизиран прах във флакон, HPLC чистота ≥98%, с COA за всяка партида.

В клиничните проучвания SURMOUNT и TRIUMPH се документира превъзходна загуба на тегло — около 24% от телесната маса за 48 седмици, превишаваща резултатите от Семаглутид и Тирзепатид. Механизмът включва едновременно активиране на трите основни метаболитни рецептора.

Съхранявайте при -20°C. Реконституираният разтвор е стабилен 28 дни при 2-8°C. COA включен. За изследователски цели in vitro.',
'Ретатрутид 10mg — двойно количество на най-новото поколение GLP-1 тройни агонисти за разширени изследователски протоколи.',
429.53, 219.90, 10, 'lyophilized', 98, 'published', 30,
'{"mechanism": "Triple agonist of GLP-1, GIP and glucagon receptors", "half_life": "~6 days", "storage": "Store at -20°C lyophilized"}',
'за отслабване (троен агонист)', 'for weight management (triple agonist)', false),

('nad-500mg', 'PL-NAD500', 'NAD+', 'NAD+ 500mg',
'NAD+ 500mg е лиофилизиран прах с висока чистота (≥98% HPLC), доставян в стерилен флакон със защита от светлина. Никотинамид аденин динуклеотидът е коензим от критично значение за клетъчния енергиен метаболизъм.

Изследванията на д-р David Sinclair (Харвард) и Shin-ichiro Imai (Washington University) документират потенциал за възстановяване на митохондриалната функция, активация на сиртуините и подобрение на инсулиновата чувствителност. Един от най-популярните longevity пептиди в биохакерските протоколи.

Съхранение: 2-8°C на тъмно, защитен от светлина. Реконституираният разтвор е за еднократна употреба в рамките на 72 часа. COA включен. Единствено за изследователски цели in vitro.',
'NAD+ 500mg — за клетъчен енергиен метаболизъм и митохондриална функция. Централен longevity пептид в биохакерските протоколи.',
156.28, 79.90, 500, 'lyophilized', 98, 'published', 40,
'{"mechanism": "Sirtuin activation, mitochondrial NAD+ restoration", "half_life": "~30 minutes IV", "storage": "Store at 2-8°C protected from light"}',
'за клетъчна енергия', 'for cellular energy', false),

('cerebrolysin-5ml', 'PL-CERE5', 'Cerebrolysin', 'Церебролизин 5ml амп.',
'Церебролизин е пептиден комплекс, съдържащ ниско-молекулни невротрофни пептиди под 10 kDa, получен от пречистен мозъчен тъкан. Доставя се в стерилни ампули от 5ml, готов за употреба без реконституция.

Клинично одобрен в над 50 страни, с десетилетия научна литература. Публикуваните проучвания документират потенциал за невропротекция при инсулт, когнитивно подобрение при деменция и възстановяване след травматични мозъчни увреждания. Активира BDNF, NGF и GDNF сигнални пътища.

Съхранение: 2-25°C на тъмно. Неизползваните ампули са стабилни 5 години. COA за всяка партида. За изследователски цели in vitro.',
'Церебролизин — класически невропротективен пептид в източноевропейската невронаука. Интензивно проучван за когнитивно възстановяване.',
78.04, 39.90, NULL, 'solution', 98, 'published', 60,
'{"mechanism": "Neurotrophic peptide complex — BDNF, NGF, GDNF activation", "storage": "Store at 2-25°C protected from light"}',
'за невропротекция', 'for neuroprotection', false),

('5-amino-1mq-50mg', 'PL-5AMQ50', '5-Amino-1MQ', '5-Амино-1MQ 50mg',
'5-Амино-1MQ 50mg е иновативен малко-молекулен NNMT инхибитор. Лиофилизиран прах с HPLC чистота ≥98%, COA за всяка партида.

В публикуваните проучвания в Biochemical Pharmacology (2018) се описва значителна редукция на мастната маса при мишки, съпътствана с повишаване на NAD+ нивата и SAM (S-аденозилметионин). Един от най-новите и обещаващи метаболитни пептиди, навлизащи в биохакерските протоколи през 2025-2026.

Съхранение: -20°C, стабилен 24 месеца в лиофилизирана форма. COA включен. За изследователски цели in vitro.',
'5-Амино-1MQ — нов метаболитен пептид, инхибитор на NNMT, който увеличава NAD+ и SAM нивата.',
126.94, 64.90, 50, 'lyophilized', 98, 'published', 40,
'{"mechanism": "NNMT inhibitor — raises NAD+ and SAM levels", "storage": "Store at -20°C lyophilized"}',
'за метаболизъм', 'for metabolism', false),

('mgf-2mg', 'PL-MGF2', 'MGF', 'MGF 2mg',
'MGF 2mg е лиофилизиран прах, съдържащ Механо растежен фактор — сплайс-вариант на IGF-1. HPLC чистота ≥98%, COA за всяка партида.

В публикуваните изследвания на Geoffrey Goldspink (London University) се описва активиране на мускулните сателитни клетки, които участват в регенерацията и хипертрофията. Интересен за проучвания в спортната медицина и регенеративната биология.

Съхранение: -20°C лиофилизиран, реконституираният разтвор е стабилен 14 дни при 2-8°C. COA включен. За изследователски цели in vitro.',
'MGF 2mg — пептид за мускулен растеж, активира сателитните клетки отговорни за регенерацията.',
87.81, 44.90, 2, 'lyophilized', 98, 'published', 35,
'{"mechanism": "IGF-1 splice variant — satellite cell activation", "storage": "Store at -20°C lyophilized"}',
'за мускулен растеж', 'for muscle growth', false),

('ara-290-5mg', 'PL-ARA5', 'ARA-290', 'ARA-290 5mg',
'ARA-290 5mg (Цибинетид) е 11-аминокиселинен пептид, производен на еритропоетина, но без еритропоетична активност. Лиофилизиран прах с HPLC чистота ≥98%.

В клиничните проучвания при саркоидоза и диабетна невропатия (провеждани основно в Leiden University Medical Center) се описва значително намаляване на невропатичната болка и подобрение на функцията на малките нервни влакна. Свързва се с innate repair receptor (IRR) и задейства тъканни защитни механизми.

Съхранение: -20°C лиофилизиран, защитен от светлина. Реконституираният разтвор е стабилен до 21 дни при 2-8°C. COA включен. За изследователски цели in vitro.',
'ARA-290 — иновативен пептид за нервна регенерация. Клинично проучван при диабетна невропатия и саркоидоза.',
107.36, 54.90, 5, 'lyophilized', 98, 'published', 40,
'{"mechanism": "Innate repair receptor (IRR) agonist — tissue protection", "storage": "Store at -20°C protected from light"}',
'за нервна регенерация', 'for nerve regeneration', false),

('oxytocin-2mg', 'PL-OXT2', 'Oxytocin', 'Окситоцин 2mg',
'Окситоцин 2mg е 9-аминокиселинен невропептид с естествено произход. Лиофилизиран прах с HPLC чистота ≥98%, COA за всяка партида.

Освен добре познатите функции при раждане и лактация, в съвременните изследвания се описват роли в социалната свързаност, доверието и емоционалната регулация. Публикуваните проучвания включват изследвания върху аутизъм, социална тревожност и PTSD. В биохакерските кръгове се изследва интраназално за социална свързаност.

Съхранение: -20°C лиофилизиран, реконституиран разтвор при 2-8°C, стабилен 14 дни. COA включен. За изследователски цели in vitro.',
'Окситоцин 2mg — пептидът на социалната свързаност. Изследван за емпатия, доверие и емоционална регулация.',
58.48, 29.90, 2, 'lyophilized', 98, 'published', 50,
'{"mechanism": "Oxytocin receptor agonist", "half_life": "~3-5 min intranasal", "storage": "Store at -20°C lyophilized"}',
'за социална свързаност', 'for social connection', false),

('humanin-5mg', 'PL-HUM5', 'Humanin', 'Хуманин 5mg',
'Хуманин 5mg е 24-аминокиселинен митохондриално-кодиран пептид. Лиофилизиран прах с HPLC чистота ≥98%, COA за всяка партида.

Открит от Nishimoto и колеги през 2001 г. в контекста на Алцхаймер изследвания. В литературата се описват невропротективни и метаболитни ефекти. Интензивно проучван в лабораторията на Pinchas Cohen (USC) като маркер и потенциален терапевтик в свързани с възрастта заболявания.

Съхранение: -20°C лиофилизиран. Реконституираният разтвор е стабилен до 21 дни при 2-8°C. COA включен. За изследователски цели in vitro.',
'Хуманин 5mg — митохондриален longevity пептид. Изследван за невропротекция при свързани с възрастта състояния.',
136.72, 69.90, 5, 'lyophilized', 98, 'published', 30,
'{"mechanism": "Mitochondrial-derived peptide — BAX inhibition, neuroprotection", "storage": "Store at -20°C lyophilized"}',
'за дълголетие', 'for longevity', false);

-- ==================== PRODUCT-CATEGORY LINKS ====================

insert into product_categories (product_id, category_id)
select p.id, c.id from products p, categories c where p.slug = 'retatrutide-5mg' and c.slug = 'weight-loss'
union all select p.id, c.id from products p, categories c where p.slug = 'retatrutide-10mg' and c.slug = 'weight-loss'
union all select p.id, c.id from products p, categories c where p.slug = 'nad-500mg' and c.slug = 'anti-aging'
union all select p.id, c.id from products p, categories c where p.slug = 'cerebrolysin-5ml' and c.slug = 'nootropic'
union all select p.id, c.id from products p, categories c where p.slug = '5-amino-1mq-50mg' and c.slug = 'weight-loss'
union all select p.id, c.id from products p, categories c where p.slug = 'mgf-2mg' and c.slug = 'gh-muscle'
union all select p.id, c.id from products p, categories c where p.slug = 'ara-290-5mg' and c.slug = 'healing'
union all select p.id, c.id from products p, categories c where p.slug = 'oxytocin-2mg' and c.slug = 'nootropic'
union all select p.id, c.id from products p, categories c where p.slug = 'humanin-5mg' and c.slug = 'anti-aging';

-- ==================== PRODUCT-PEPTIDE LINKS ====================

insert into product_peptides (product_id, peptide_id)
select p.id, pep.id from products p, peptides pep where p.slug = 'retatrutide-5mg' and pep.slug = 'retatrutide'
union all select p.id, pep.id from products p, peptides pep where p.slug = 'retatrutide-10mg' and pep.slug = 'retatrutide'
union all select p.id, pep.id from products p, peptides pep where p.slug = 'nad-500mg' and pep.slug = 'nad'
union all select p.id, pep.id from products p, peptides pep where p.slug = 'cerebrolysin-5ml' and pep.slug = 'cerebrolysin'
union all select p.id, pep.id from products p, peptides pep where p.slug = '5-amino-1mq-50mg' and pep.slug = '5-amino-1mq'
union all select p.id, pep.id from products p, peptides pep where p.slug = 'mgf-2mg' and pep.slug = 'mgf'
union all select p.id, pep.id from products p, peptides pep where p.slug = 'ara-290-5mg' and pep.slug = 'ara-290'
union all select p.id, pep.id from products p, peptides pep where p.slug = 'oxytocin-2mg' and pep.slug = 'oxytocin'
union all select p.id, pep.id from products p, peptides pep where p.slug = 'humanin-5mg' and pep.slug = 'humanin';
