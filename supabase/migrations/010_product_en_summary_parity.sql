-- 010_product_en_summary_parity.sql
-- Brings summary_en to BG depth for 46 published products. April 2026.
-- Source: critical content audit — EN summaries averaged 53 chars vs BG 147.
-- Each translation preserves named researchers, study identifiers (NEJM, STEP,
-- SURMOUNT, etc.), real numbers, and mechanism hints. Marketing voice scrubbed
-- ("most sought-after" etc.) for research-only / in-vitro tone compliance.

update products set summary_en = $$5-Amino-1MQ 50mg, the first selective NNMT inhibitor from Cornell. Increases NAD+ and activates fat metabolism. In mice, >25% reduction in fat mass over 11 days without diet change.$$ where slug = '5-amino-1mq-50mg';

update products set summary_en = $$Sterile alcohol swabs, 70% isopropyl alcohol, 100 individually wrapped pieces. Standard antiseptic prep for vial caps and injection sites.$$ where slug = 'alcohol-swabs-100pk';

update products set summary_en = $$AOD-9604 5mg, growth hormone fragment 176-191 from Monash University (Melbourne). Pure fat burning without hyperglycemia or IGF-1 effect. Activates β3-adrenergic receptors and Hormone-Sensitive Lipase.$$ where slug = 'aod-9604-5mg';

update products set summary_en = $$ARA-290 16mg / Cibinetide, EPO-derived without erythropoietic activity. Binds the specific innate repair receptor (IRR) and activates tissue protection. Studied at Leiden Medical Center for diabetic neuropathy and sarcoidosis.$$ where slug = 'ara-290-16mg';

update products set summary_en = $$Sterile bacteriostatic water (0.9% benzyl alcohol), 20 ml vial. Standard reconstitution solvent for lyophilized peptides; opened vial stable up to 28 days refrigerated.$$ where slug = 'bac-water-20ml';

update products set summary_en = $$BPC-157 10mg, double size of the regenerative flagship. For extended research cycles. Over 100 peer-reviewed publications from the Sikiric group.$$ where slug = 'bpc-157-10mg';

update products set summary_en = $$BPC-157 5mg, the flagship of regenerative peptides. 15-amino-acid fragment from a protective protein in gastric juice. Over 100 peer-reviewed papers from the Sikiric group.$$ where slug = 'bpc-157-5mg';

update products set summary_en = $$BPC-157 + TB-500 blend 10mg, the two leading regenerative peptides in synergy. BPC builds blood vessels, TB-500 guides cells there. 5mg + 5mg.$$ where slug = 'bpc-157-tb-500-blend-10mg';

update products set summary_en = $$BPC-157 + TB-500 blend 20mg, double quantity of the most-studied regenerative blend. For extended protocols. 10mg + 10mg.$$ where slug = 'bpc-157-tb-500-blend-20mg';

update products set summary_en = $$Cerebrolysin 5ml, peptide complex with neurotrophic peptides from purified brain tissue. Clinically approved in 50+ countries (Eastern Europe, Russia, China). Activates BDNF, NGF, GDNF. Over 60 years of clinical history.$$ where slug = 'cerebrolysin-5ml';

update products set summary_en = $$CJC-1295 5mg, modified Sermorelin with DPP-4 resistance (without DAC form). Mimics natural GH pulses. Classic partner to Ipamorelin in combined protocols.$$ where slug = 'cjc-1295-5mg';

update products set summary_en = $$DSIP 5mg, 9-amino-acid peptide discovered in 1977 by Schoenenberger and Monnier. Studied for deep sleep onset and stress resilience; activates GABAergic pathways.$$ where slug = 'dsip-5mg';

update products set summary_en = $$Epitalon 10mg, pineal-gland tetrapeptide developed by Prof. Vladimir Khavinson (St. Petersburg). Activates telomerase and regulates melatonin / circadian rhythm. Classic of the Soviet bioregulation school.$$ where slug = 'epitalon-10mg';

update products set summary_en = $$GHK-Cu 100mg, double pack of the copper tripeptide. For extended cosmetic and regenerative research protocols. Body produces it naturally but levels decline with age.$$ where slug = 'ghk-cu-100mg';

update products set summary_en = $$GHK-Cu 50mg, the natural tripeptide-copper complex (the "blue elixir"). The body produces it naturally, but levels drop with age. Modulates 31% of human genes, delivers copper to mitochondria, stimulates collagen synthesis.$$ where slug = 'ghk-cu-50mg';

update products set summary_en = $$GHRP-6 5mg, the first-generation GHRP from Cyril Bowers (Tulane). Historic significance — research with GHRP-6 led to the discovery of ghrelin itself. Strong appetite-stimulating effect.$$ where slug = 'ghrp-6-5mg';

update products set summary_en = $$Hexarelin 5mg, potent GHRP with unique cardioprotective effect via CD36 receptors in cardiomyocytes. GH-axis-independent action. From Deghenghi / Ghigo (Turin).$$ where slug = 'hexarelin-5mg';

update products set summary_en = $$Humanin 10mg, mitochondrial peptide (extremely rare!), discovered by Nishimoto during Alzheimer''s research. Inhibits BAX and blocks cell death. Levels drop with age. Researched at Pinchas Cohen lab (USC).$$ where slug = 'humanin-10mg';

update products set summary_en = $$1 ml insulin syringes with 29G × 1/2-inch needle, sterile, individually packed — 10-pack. Standard tool for subcutaneous research peptide administration.$$ where slug = 'insulin-syringes-10pk';

update products set summary_en = $$Ipamorelin 5mg, flagship of the GHRP category from Novo Nordisk. Clean GH secretagogue without cortisol, prolactin or appetite effect. Classic partner to CJC-1295.$$ where slug = 'ipamorelin-5mg';

update products set summary_en = $$Ipamorelin + CJC-1295 blend 10mg, the classic GH synergy. Two parallel mechanisms (GHRP + GHRH) double the pulse amplitude. Standard in modern protocols.$$ where slug = 'ipamorelin-cjc-blend-10mg';

update products set summary_en = $$KPV 10mg, anti-inflammatory tripeptide (Lys-Pro-Val) from the C-terminus of α-MSH. Inhibits NF-κB and reduces TNF-α, IL-6. Uniquely stable in the gastrointestinal tract — opens interest in oral formulation for IBD.$$ where slug = 'kpv-10mg';

update products set summary_en = $$Matrixyl 50mg, palmitoylated pentapeptide (Pal-KTTKS). Stimulates collagen I and III synthesis in dermal fibroblasts. Common topical anti-aging research molecule.$$ where slug = 'matrixyl-50mg';

update products set summary_en = $$Melanotan 2 10mg, cyclized α-MSH analog from University of Arizona (1980s). PAN-AGONIST — activates all 5 melanocortin receptors (unlike the selective PT-141). Pigmentation + appetite + libido.$$ where slug = 'melanotan-2-10mg';

update products set summary_en = $$MGF 5mg, splice variant of IGF-1 for muscle regeneration. Activates satellite cells (muscle stem cells) after mechanical stress. From Geoffrey Goldspink (University of London).$$ where slug = 'mgf-5mg';

update products set summary_en = $$3 ml mixing syringes with 21G × 1.5-inch needle, sterile — 5-pack. For drawing bacteriostatic water and reconstituting lyophilized peptides.$$ where slug = 'mixing-syringes-5pk';

update products set summary_en = $$MOTS-c 10mg, peptide encoded by mitochondrial DNA (Lee et al, USC). Exercise mimetic that activates AMPK signaling. Improves insulin sensitivity and metabolic flexibility in research.$$ where slug = 'mots-c-10mg';

update products set summary_en = $$NA-Semax 30mg, stabilized Semax version. N-acetyl + C-amidate modification gives 3-4× longer half-life vs standard Semax. Russian nootropic peptide research.$$ where slug = 'na-semax-30mg';

update products set summary_en = $$NAD+ 500mg, the central coenzyme of energy metabolism. Levels drop ~50% with age. Activates sirtuins (longevity enzymes). Researched by Sinclair (Harvard) as a key anti-aging target.$$ where slug = 'nad-plus-500mg';

update products set summary_en = $$Oxytocin 2mg, neuropeptide from the hypothalamus, the "bonding hormone". Beyond childbirth and lactation, central to social neurobiology — trust, empathy, pair bonding. Studied for autism and PTSD.$$ where slug = 'oxytocin-2mg';

update products set summary_en = $$PT-141 10mg (Vyleesi), FDA-approved (2019) melanocortin agonist for HSDD in women. CENTRAL action at the hypothalamic level (not peripheral like Viagra). Discovered by accident during sunless tanner development.$$ where slug = 'pt-141-10mg';

update products set summary_en = $$PTD-DBM 5mg, Wnt activator for hair research. Yonsei University development, published 2017 in Nature Communications. Topical application for follicular regeneration studies.$$ where slug = 'ptd-dbm-5mg';

update products set summary_en = $$Complete starter kit: bacteriostatic water, insulin syringes for dosing, mixing syringes for reconstitution, and alcohol swabs. Everything needed for first-time peptide handling.$$ where slug = 'reconstitution-starter-kit';

update products set summary_en = $$Retatrutide 10mg, double quantity of the strongest peptide of the GLP-1 era. For extended protocols. Triple agonist (GLP-1 / GIP / glucagon) from Eli Lilly.$$ where slug = 'retatrutide-10mg';

update products set summary_en = $$Retatrutide 5mg, the next generation after Tirzepatide. Triple agonist (GLP-1 + GIP + glucagon) from Eli Lilly. 24.2% body weight reduction in Phase 2 (NEJM 2023). New triple-incretin mechanism class.$$ where slug = 'retatrutide-5mg';

update products set summary_en = $$Selank 5mg, Russian nootropic (tuftsin + PGP) from the Russian Academy of Sciences. Anxiolytic without sedation or dependence — unlike benzodiazepines. Registered in Russia since 2009.$$ where slug = 'selank-5mg';

update products set summary_en = $$Semaglutide 5mg, research-grade analog of Ozempic / Wegovy. Long-acting GLP-1 from Novo Nordisk. 14.9% body weight reduction over 68 weeks in the STEP trials. Once-weekly dosing.$$ where slug = 'semaglutide-5mg';

update products set summary_en = $$Semax 5mg, Russian nootropic (modified ACTH 4-7) from the Russian Academy of Sciences. Registered in Russia since 2002 for stroke. Elevates BDNF in the hippocampus. Exclusively intranasal administration.$$ where slug = 'semax-5mg';

update products set summary_en = $$Sermorelin 5mg, the classic from Nobel laureate Roger Guillemin (Salk Institute). Natural GH pulses, short half-life (12 min). Often combined with a GHRP for synergy.$$ where slug = 'sermorelin-5mg';

update products set summary_en = $$Insulated thermal case for transporting peptides at 2–8°C. Holds multiple vials for extended off-fridge intervals. Basic part of a clean reconstitution workflow.$$ where slug = 'storage-case';

update products set summary_en = $$Sterile empty glass storage vials with rubber stoppers and aluminum crimp seals — 10-pack. For aliquoting reconstituted peptides into smaller working portions.$$ where slug = 'storage-vials-10pk';

update products set summary_en = $$TB-500 5mg, the active fragment of natural Thymosin Beta-4. Binds G-actin and accelerates cell migration to sites of tissue damage. Classic research partner to BPC-157.$$ where slug = 'tb-500-5mg';

update products set summary_en = $$Tesamorelin 10mg, double size of the FDA-approved GHRH analog. For extended protocols. Selective for visceral fat reduction.$$ where slug = 'tesamorelin-10mg';

update products set summary_en = $$Tesamorelin 5mg, stabilized GHRH analog (Egrifta). The only FDA-approved peptide for visceral fat. -15% to -18% visceral fat volume over 26 weeks. From Theratechnologies (Canada).$$ where slug = 'tesamorelin-5mg';

update products set summary_en = $$Tirzepatide 10mg, dual GIP / GLP-1 agonist in larger pack. SURMOUNT-1 trial: −20.9% body weight reduction over 72 weeks. For extended research protocols, twice the duration of the 5mg vial.$$ where slug = 'tirzepatide-10mg';

update products set summary_en = $$Tirzepatide 5mg, research-grade analog of Mounjaro / Zepbound. The first dual GLP-1 / GIP agonist from Eli Lilly. 22.5% body weight reduction over 72 weeks in SURMOUNT-1. Stronger than Semaglutide.$$ where slug = 'tirzepatide-5mg';
