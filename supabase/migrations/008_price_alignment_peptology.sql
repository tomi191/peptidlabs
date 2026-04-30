-- ============================================================
-- 008_price_alignment_peptology.sql
-- Глобално подравняване на ВСИЧКИ пептидни цени спрямо
-- Peptology pricing model (snapshot peptology.bg към 2026-04-30).
-- EUR е каноничната цена; BGN = EUR × 1.95583 (фиксиран курс).
--
-- Методология:
--   1. Директно съвпадение (ТОЧНА доза в peptology.bg) → точна цена.
--   2. Скалирано (peptology има друга доза) → линейно по €/mg.
--   3. Без peptology референция → per-mg rate от peptide клас:
--      • GLP-1 / GIP / GCGR клас: ~€10–12/mg @ 5mg (намалява до ~€5/mg @ 30mg)
--      • GH секретагози / GHRH:  ~€5–6/mg
--      • Регенерация (BPC, TB, KPV): ~€2.5–4/mg
--      • Козметични пептиди: ~€0.6/mg
--      • Митохондриални / longevity: €2–7/mg
--      • Антимикробни / имунни: ~€13–16/mg
--      • Ноотропи / руски биорегулатори: ~€3–6/mg
--
-- Аксесоарите (вода, спринцовки, тампони, флакони, кит, калъф)
-- НЕ са пипнати — те си имат пазарна цена различна от пептидите.
-- ============================================================

update products
set
  price_eur = case slug
    -- ===== GLP-1 / GIP / GCGR агонисти =====
    when 'retatrutide-5mg'              then 59.00   -- peptology 5мг = €59
    when 'retatrutide-10mg'             then 99.00   -- peptology 10мг = €99
    when 'retatrutide-15mg'             then 125.00  -- peptology 15мг = €125
    when 'tirzepatide-5mg'              then 59.00   -- peptology 5мг = €59
    when 'tirzepatide-10mg'             then 99.00   -- peptology 10мг = €99
    when 'semaglutide-5mg'              then 50.00   -- peptology 5мг = €50
    when 'semaglutide-10mg'             then 80.00   -- peptology 10мг = €80
    when 'cagrilintide-5mg'             then 45.00   -- peptology 5мг = €45
    when 'liraglutide-5mg'              then 40.00   -- по-старо GLP-1 (Saxenda), под Semaglutide
    when 'mazdutide-5mg'                then 69.00   -- ново GLP-1/GCGR, premium над Tirzepatide
    when 'survodutide-10mg'             then 119.00  -- ново GLP-1/GCGR (Boehringer)
    when 'orforglipron-5mg'             then 99.00   -- ново перорално GLP-1 (Eli Lilly)
    when 'tesamorelin-5mg'              then 79.00   -- FDA-одобрен GHRH (Egrifta), специализиран
    when 'tesamorelin-10mg'             then 129.00  -- двоен размер на Tesamorelin

    -- ===== GH секретагози / GHRH аналози =====
    when 'hexarelin-5mg'                then 28.00   -- peptology 5мг = €28
    when 'cjc-1295-5mg'                 then 25.00   -- peptology без DAC 5мг = €25
    when 'cjc-1295-dac-2mg'             then 29.00   -- peptology с DAC 2мг = €29
    when 'ipamorelin-5mg'               then 30.00   -- peptology 5мг = €30
    when 'sermorelin-5mg'               then 39.00   -- peptology 5мг = €39
    when 'gonadorelin-10mg'             then 35.00   -- GnRH аналог, под GHRP клас

    -- ===== Регенерация / меки тъкани =====
    when 'bpc-157-5mg'                  then 25.00   -- regen клас, KPV 10мг=€39 ref
    when 'bpc-157-10mg'                 then 39.00   -- KPV-equivalent rate
    when 'tb-500-5mg'                   then 25.00   -- regen клас
    when 'tb-500-10mg'                  then 39.00   -- regen клас
    when 'bpc-157-tb-500-blend-10mg'    then 45.00   -- бленд = две × 5mg + minor premium
    when 'bpc-157-tb-500-blend-20mg'    then 75.00   -- бленд × 2
    when 'kpv-10mg'                     then 39.00   -- peptology 10мг = €39
    when 'ghk-cu-50mg'                  then 22.00   -- peptology 100мг = €40 → 50мг
    when 'ghk-cu-100mg'                 then 40.00   -- peptology 100мг = €40
    when 'aod-9604-5mg'                 then 40.00   -- peptology 5мг = €40
    when 'ara-290-16mg'                 then 49.00   -- niche regen, ~€3/mg

    -- ===== Козметични пептиди =====
    when 'argireline-50mg'              then 29.00   -- козметичен, low €/mg клас
    when 'matrixyl-50mg'                then 29.00   -- козметичен (Pal-KTTKS)

    -- ===== Антимикробни / имунни =====
    when 'll-37-5mg'                    then 65.00   -- антимикробен, специализиран
    when 'thymosin-alpha-1-5mg'         then 79.00   -- имунен, клиничен (Zadaxin)
    when 'vip-5mg'                      then 60.00   -- невропептид, специализиран

    -- ===== Ноотропи / руски пептидни биорегулатори =====
    when 'semax-5mg'                    then 30.00   -- peptology 5мг = €30
    when 'epitalon-10mg'                then 18.00   -- peptology 50мг = €89 → 10мг
    when 'epitalon-20mg'                then 36.00   -- peptology 50мг = €89 → 20мг
    when 'pinealon-20mg'                then 35.00   -- руски биорегулатор, Epitalon-class
    when 'thymalin-10mg'                then 39.00   -- руски тимусен биорегулатор
    when 'dsip-5mg'                     then 30.00   -- сън-пептид, ноотропен клас

    -- ===== Митохондриални / longevity =====
    when 'ss-31-5mg'                    then 39.00   -- peptology 10мг = €69 → 5мг
    when 'mots-c-10mg'                  then 65.00   -- митохондриален, SS-31 ref
    when 'nad-plus-500mg'               then 60.00   -- longevity, biohacker клас
    when '5-amino-1mq-50mg'             then 45.00   -- peptology 50мг = €45

    -- ===== Сексуални / меланокортинови =====
    when 'oxytocin-2mg'                 then 25.00   -- 2мг сравнимо с Sermorelin 2мг

    -- ===== Метаболитни / fat-loss niche =====
    when 'adipotide-10mg'               then 69.00   -- proteolytic fat ablation, niche

    -- ===== Сенолитици / репродуктивни / неврологични =====
    when 'foxo4-dri-5mg'                then 99.00   -- сенолитик, premium novel
    when 'kisspeptin-10-5mg'            then 45.00   -- репродуктивен neuropeptide
    when 'p21-5mg'                      then 45.00   -- неврогенерация, niche
    when 'ptd-dbm-5mg'                  then 60.00   -- Wnt активатор, специализиран
    when 'dihexa-10mg'                  then 65.00   -- HGF mimetic, neurotropic
  end,
  price_bgn = round((case slug
    when 'retatrutide-5mg'              then 59.00
    when 'retatrutide-10mg'             then 99.00
    when 'retatrutide-15mg'             then 125.00
    when 'tirzepatide-5mg'              then 59.00
    when 'tirzepatide-10mg'             then 99.00
    when 'semaglutide-5mg'              then 50.00
    when 'semaglutide-10mg'             then 80.00
    when 'cagrilintide-5mg'             then 45.00
    when 'liraglutide-5mg'              then 40.00
    when 'mazdutide-5mg'                then 69.00
    when 'survodutide-10mg'             then 119.00
    when 'orforglipron-5mg'             then 99.00
    when 'tesamorelin-5mg'              then 79.00
    when 'tesamorelin-10mg'             then 129.00
    when 'hexarelin-5mg'                then 28.00
    when 'cjc-1295-5mg'                 then 25.00
    when 'cjc-1295-dac-2mg'             then 29.00
    when 'ipamorelin-5mg'               then 30.00
    when 'sermorelin-5mg'               then 39.00
    when 'gonadorelin-10mg'             then 35.00
    when 'bpc-157-5mg'                  then 25.00
    when 'bpc-157-10mg'                 then 39.00
    when 'tb-500-5mg'                   then 25.00
    when 'tb-500-10mg'                  then 39.00
    when 'bpc-157-tb-500-blend-10mg'    then 45.00
    when 'bpc-157-tb-500-blend-20mg'    then 75.00
    when 'kpv-10mg'                     then 39.00
    when 'ghk-cu-50mg'                  then 22.00
    when 'ghk-cu-100mg'                 then 40.00
    when 'aod-9604-5mg'                 then 40.00
    when 'ara-290-16mg'                 then 49.00
    when 'argireline-50mg'              then 29.00
    when 'matrixyl-50mg'                then 29.00
    when 'll-37-5mg'                    then 65.00
    when 'thymosin-alpha-1-5mg'         then 79.00
    when 'vip-5mg'                      then 60.00
    when 'semax-5mg'                    then 30.00
    when 'epitalon-10mg'                then 18.00
    when 'epitalon-20mg'                then 36.00
    when 'pinealon-20mg'                then 35.00
    when 'thymalin-10mg'                then 39.00
    when 'dsip-5mg'                     then 30.00
    when 'ss-31-5mg'                    then 39.00
    when 'mots-c-10mg'                  then 65.00
    when 'nad-plus-500mg'               then 60.00
    when '5-amino-1mq-50mg'             then 45.00
    when 'oxytocin-2mg'                 then 25.00
    when 'adipotide-10mg'               then 69.00
    when 'foxo4-dri-5mg'                then 99.00
    when 'kisspeptin-10-5mg'            then 45.00
    when 'p21-5mg'                      then 45.00
    when 'ptd-dbm-5mg'                  then 60.00
    when 'dihexa-10mg'                  then 65.00
  end) * 1.95583, 2)
where slug in (
  'retatrutide-5mg','retatrutide-10mg','retatrutide-15mg',
  'tirzepatide-5mg','tirzepatide-10mg',
  'semaglutide-5mg','semaglutide-10mg','cagrilintide-5mg',
  'liraglutide-5mg','mazdutide-5mg','survodutide-10mg','orforglipron-5mg',
  'tesamorelin-5mg','tesamorelin-10mg',
  'hexarelin-5mg','cjc-1295-5mg','cjc-1295-dac-2mg',
  'ipamorelin-5mg','sermorelin-5mg','gonadorelin-10mg',
  'bpc-157-5mg','bpc-157-10mg','tb-500-5mg','tb-500-10mg',
  'bpc-157-tb-500-blend-10mg','bpc-157-tb-500-blend-20mg',
  'kpv-10mg','ghk-cu-50mg','ghk-cu-100mg','aod-9604-5mg','ara-290-16mg',
  'argireline-50mg','matrixyl-50mg',
  'll-37-5mg','thymosin-alpha-1-5mg','vip-5mg',
  'semax-5mg','epitalon-10mg','epitalon-20mg','pinealon-20mg','thymalin-10mg','dsip-5mg',
  'ss-31-5mg','mots-c-10mg','nad-plus-500mg','5-amino-1mq-50mg',
  'oxytocin-2mg','adipotide-10mg',
  'foxo4-dri-5mg','kisspeptin-10-5mg','p21-5mg','ptd-dbm-5mg','dihexa-10mg'
);
