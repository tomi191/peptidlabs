-- Translate accessory product names and descriptions to Bulgarian.
-- Safe to re-run — only updates name_bg where it's NULL or English.

update products
set
  name_bg = 'Алкохолни тампони (100 бр.)',
  description_bg = coalesce(
    description_bg,
    'Еднократни алкохолни тампони за стерилизация на кожата преди инжектиране и на флаконите преди реконституция. Опаковка от 100 броя. Съдържат 70% изопропилов алкохол.'
  ),
  summary_bg = coalesce(
    summary_bg,
    'Стерилни алкохолни тампони — 70% изопропилов алкохол, 100 броя в опаковка.'
  ),
  use_case_tag_bg = coalesce(use_case_tag_bg, 'за стерилност')
where slug like '%alcohol-swabs%' or slug = 'alcohol-swabs-100pk';

update products
set
  name_bg = 'Бактериостатична вода 20 мл',
  description_bg = coalesce(
    description_bg,
    'Бактериостатична вода 20 мл — стерилен разтворител за реконституция на лиофилизирани пептиди. Съдържа 0.9% бензилов алкохол, което осигурява многократна употреба в рамките на 28 дни след отваряне при правилно съхранение в хладилник.'
  ),
  summary_bg = coalesce(
    summary_bg,
    'Стерилна бактериостатична вода (0.9% бензилов алкохол) за многократна реконституция на пептиди — 20 мл флакон.'
  ),
  use_case_tag_bg = coalesce(use_case_tag_bg, 'за реконституция')
where slug like '%bac-water%' or slug like '%bacteriostatic%';

update products
set
  name_bg = 'Инсулинови спринцовки 29G (10 бр.)',
  description_bg = coalesce(
    description_bg,
    'Инсулинови спринцовки 1 мл с фиксирана игла 29G × 12.7 мм. Тънка игла за минимален дискомфорт при подкожни инжекции. Скала в единици инсулин (100 U). Стерилни, индивидуално опаковани, 10 броя.'
  ),
  summary_bg = coalesce(
    summary_bg,
    'Инсулинови спринцовки 1 мл с 29G игла — 10 броя, стерилно индивидуално опаковани.'
  ),
  use_case_tag_bg = coalesce(use_case_tag_bg, 'за прецизна употреба')
where slug like '%insulin-syringes%';

update products
set
  name_bg = 'Спринцовки за смесване 21G (5 бр.)',
  description_bg = coalesce(
    description_bg,
    'Спринцовки 3 мл с игла 21G × 38 мм за прехвърляне на бактериостатична вода във флакон с лиофилизиран пептид. По-голям диаметър на иглата за бързо изтегляне и смесване. 5 броя, стерилно опаковани.'
  ),
  summary_bg = coalesce(
    summary_bg,
    'Спринцовки за реконституция 3 мл с 21G игла — 5 броя, идеални за смесване на разтворител с лиофилизиран пептид.'
  ),
  use_case_tag_bg = coalesce(use_case_tag_bg, 'за реконституция')
where slug like '%mixing-syringes%';

-- Generic translation for any remaining accessories (storage, cases, etc.)
update products
set name_bg = case
    when name ilike '%storage vial%' then 'Флакон за съхранение'
    when name ilike '%storage%' then 'Контейнер за съхранение'
    when name ilike '%carrying case%' or name ilike '%travel case%' then 'Транспортен калъф'
    when name ilike '%needle%' and name_bg is null then replace(name, 'Needles', 'Игли')
    else name
  end
where form = 'accessory' and (name_bg is null or name_bg = name);

-- Ensure all accessories have a BG use case tag
update products
set use_case_tag_bg = coalesce(use_case_tag_bg, 'за лабораторна употреба')
where form = 'accessory' and use_case_tag_bg is null;
