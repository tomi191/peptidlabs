-- Backfill price_bgn for the 4 products that had 0.00 (data hygiene).
-- Fixed BGN/EUR rate = 1.95583 per Bulgarian transition law,
-- rounded to 2 decimals.
-- Affected slugs: aod-9604-10mg, kpv-20mg, na-semax-30mg, pt-141-5mg.
--
-- DualPrice component also defends against price_bgn=0 by falling back
-- to fixed-rate computation, so this is belt-and-braces.

update products
set price_bgn = round((price_eur * 1.95583)::numeric, 2)
where price_bgn = 0 or price_bgn is null;
