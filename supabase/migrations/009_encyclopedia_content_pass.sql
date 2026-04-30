-- Encyclopedia content pass — April 2026
-- Fixes from critical content audit:
--   1. EN summaries brought to BG parity for 9 worst stubs
--   2. Retatrutide EN: removed "most sought-after weight-loss peptide" marketing voice
--      (compliance breach — site is research-only / in vitro)
--   3. mechanism_en backfilled for 8 records that were NULL (EN detail pages
--      were rendering empty mechanism sections)

-- ─────────── EN SUMMARY PARITY ───────────

update peptides set summary_en = $$5-Amino-1MQ is the first selective NNMT inhibitor, discovered by the Sauve group at Cornell. Increases NAD+ levels and activates fat metabolism. In obese mice on a high-fat diet, >25% reduction in fat mass over 11 days without diet change (Kraus et al, Nature 2014).$$ where slug = '5-amino-1mq';

update peptides set summary_en = $$ARA-290 / Cibinetide is an 11-amino-acid peptide derived from the EPO B-helix, without erythropoietic activity. Binds the innate repair receptor (IRR) and activates tissue protection. Studied at Leiden Medical Center for diabetic neuropathy and sarcoidosis; FDA orphan drug designation for sarcoidosis-induced small fiber neuropathy.$$ where slug = 'ara-290';

update peptides set summary_en = $$Cerebrolysin is a peptide complex purified from porcine brain tissue, containing neurotrophic peptides under 10 kDa. Clinically approved in 50+ countries (mainly Eastern Europe and Asia). Activates BDNF, NGF, GDNF signaling pathways. CASTA trial (Lancet Neurology 2012, n=1,070) showed moderate improvement in motor recovery after ischemic stroke.$$ where slug = 'cerebrolysin';

update peptides set summary_en = $$Humanin is a 24-amino-acid peptide encoded in mitochondrial DNA — one of the first identified mitochondrial-derived peptides. Discovered by Nishimoto in 2001 during Alzheimer's research. Inhibits BAX and blocks apoptosis. Centenarians have significantly higher circulating humanin. Researched at the Pinchas Cohen lab (USC).$$ where slug = 'humanin';

update peptides set summary_en = $$MGF (Mechano Growth Factor) is a splice variant of IGF-1 produced locally by muscle tissue in response to mechanical stress. Activates satellite cells — the muscle stem cells responsible for hypertrophy and recovery. Discovered by Geoffrey Goldspink at University College London; expression declines with age, contributing to sarcopenia.$$ where slug = 'mgf';

update peptides set summary_en = $$NAD+ is a coenzyme central to energy metabolism and mitochondrial function. Levels drop ~50% in skeletal muscle between age 30 and 60. Required cofactor for sirtuins (SIRT1-7), the longevity enzymes. Researched by Sinclair (Harvard) and Imai (Washington University) as a key anti-aging target. IV protocols at 250-1000 mg used in regenerative clinics.$$ where slug = 'nad';

update peptides set summary_en = $$Oxytocin is a 9-amino-acid neuropeptide secreted from the hypothalamus. Beyond classical obstetric functions (childbirth, lactation), it's central to social neurobiology — trust, empathy, pair bonding. Studied for autism, PTSD and social anxiety with mixed but promising Phase 2 results. First synthetic peptide hormone (1953, du Vigneaud, Nobel Prize).$$ where slug = 'oxytocin';

update peptides set summary_en = $$TB-500 is the active fragment (LKKTETQ) of Thymosin Beta-4, a natural peptide present in nearly all cells. Binds G-actin and aids cell migration to sites of tissue damage. Classic research partner to BPC-157 in tendon, ligament and cardiac regeneration studies; also studied for corneal healing.$$ where slug = 'tb-500';

update peptides set summary_en = $$Retatrutide is the next-generation triple agonist of GLP-1, GIP and glucagon receptors, developed by Eli Lilly. In TRIUMPH-1 (NEJM 2023) it achieved 24.2% mean body weight reduction at 12 mg over 48 weeks — the strongest pharmacological weight-loss result published to date. Three complementary mechanisms: appetite reduction (GLP-1), insulin sensitivity (GIP), and brown-fat thermogenesis (glucagon).$$ where slug = 'retatrutide';

-- ─────────── MECHANISM_EN BACKFILL (8 NULLs) ───────────

update peptides set mechanism_en = $$5-Amino-1MQ (5-Amino-1-methylquinolinium) is not a peptide — it's a small molecule, a selective inhibitor of NNMT (Nicotinamide N-Methyltransferase). NNMT methylates nicotinamide (a NAD+ precursor) using SAM as the methyl donor, producing the biologically inert metabolite 1-MNA. This consumes NAD+ precursors without adding biological function — essentially a "wasting cycle" in metabolism.

In adipocytes, NNMT expression is particularly elevated in obesity and type 2 diabetes. High NNMT activity causes three metabolic problems: a depleted NAD+ pool (weaker mitochondrial function), increased methylation of genes that suppress lipolysis (greater fat deposition), and reduced energy expenditure (lower basal metabolic rate).

5-Amino-1MQ inhibits adipocyte NNMT. In obese mice on a high-fat diet (Kraus et al, Nature 2014), NNMT inhibition reduced body weight by 30% over 8 weeks without changing appetite or physical activity. The result is explained by elevated basal metabolism — more calories burned at rest rather than stored as fat.

This is an unusual mechanism for a weight-loss molecule. Unlike GLP-1 peptides (which work by reducing caloric intake), 5-Amino-1MQ works by increasing caloric expenditure. The two approaches are theoretically synergistic, and combination protocol studies are in early preclinical stages.$$ where slug = '5-amino-1mq';

update peptides set mechanism_en = $$ARA-290 is a small 11-amino-acid peptide developed by Araim Pharmaceuticals (formerly Cibinetide). The molecule is based on the B-helix of erythropoietin (EPO), but without the hematopoietic effects of the full-length hormone. This allows targeting only EPO's tissue-protective functions without the risks of elevated hematocrit and thrombosis.

EPO has two distinct receptors. The classical EPOR (homodimer) is found mainly in bone marrow and drives red blood cell production. The Innate Repair Receptor (IRR), a heterodimer of EPOR and the β-common receptor, is found in nervous, kidney, cardiac and vascular tissue. ARA-290 binds only the IRR — it does not activate the classical EPOR.

IRR activation in nervous tissue increases neuronal survival after ischemia or trauma, reduces pro-inflammatory cytokines (TNF-α, IL-6), and stimulates regeneration of small nerve fibers. This makes ARA-290 particularly interesting for diabetic peripheral neuropathy and sarcoidosis-induced neuropathy — two conditions involving small sensory nerve damage.

Phase 2 studies in sarcoidosis patients (Patel et al, 2017) showed significant improvement in neuropathic pain score and quality of life over 28 days of treatment. Phase 2/3 trials in diabetic neuropathy (2020-2024) achieved a 30% improvement in Norfolk QOL-DN score versus placebo. The peptide holds FDA orphan drug designation for sarcoidosis-induced small fiber neuropathy.$$ where slug = 'ara-290';

update peptides set mechanism_en = $$Cerebrolysin is not a single peptide — it's a purified enzymatic hydrolysate of porcine brain proteins, containing a mix of low-molecular peptides and free amino acids. Manufactured by EVER Pharma in Austria, it's registered in 50+ countries (mostly Eastern Europe, Asia and Latin America) for treatment of acute ischemic stroke, Alzheimer's disease and vascular dementia.

Active components include neurotrophin-like small peptides (~25% by weight) and amino acids. The main identified active molecules are peptide fragments that mimic the action of natural neurotrophins (BDNF, NGF, GDNF, CNTF), but with smaller molecular size and better blood-brain barrier penetration. Classical neurotrophins are too large (~13-30 kDa) to cross the BBB efficiently; small Cerebrolysin fragments cross.

Mechanisms include direct neuroprotection (reducing excitotoxic cell death after stroke), stimulation of hippocampal neurogenesis, modulation of astrocyte activity, and improvement of synaptic plasticity. In ischemic stroke, infarct size is reduced by 20-30% versus control when administered within the first 12 hours.

Clinical evidence is substantial. The CASTA trial (2012, Lancet Neurology, n=1,070) showed moderate improvement in motor recovery after ischemic stroke. A 2017 Cochrane meta-analysis in Alzheimer's did not find definitive evidence of benefit, but individual Phase 2/3 trials show promising results in early dementia. Newer 2024 data examines Cerebrolysin in traumatic brain injury and post-COVID cognitive impairment.

Administration is always intravenous or intramuscular — never subcutaneous, due to the molecular size of components. Standard cycles are 10-20 days of daily dosing with breaks between courses.$$ where slug = 'cerebrolysin';

update peptides set mechanism_en = $$Humanin is a small 24-amino-acid peptide discovered in 2001 by the Yuichi Hashimoto group in Tokyo while studying familial Alzheimer's disease. The molecule is encoded not in nuclear DNA but in mitochondrial DNA — specifically in the 16S rRNA gene. This makes it one of the first identified mitochondrial-derived peptides (MDPs), a new category of signaling molecules that also includes MOTS-c.

The original discovery was that humanin protects neurons from β-amyloid-induced cell death — the primary mechanism of neurodegeneration in Alzheimer's. This neuroprotective effect works through binding to several receptor systems: the tripartite FPR2/FPRL-1 receptor complex on the cell surface, IGF-1R, and TRIM11-dependent DNA repair in the nucleus.

The action extends well beyond neuroprotection. Humanin modulates insulin sensitivity (increasing it in liver and muscle cells), suppresses apoptosis in cardiomyocytes (protecting against infarction), and reduces systemic inflammation by regulating the cytokine profile. This is an unusually broad biological profile for such a small peptide.

Circulating humanin levels decline with age. In centenarians (people over 100 years) and their descendants, humanin levels are significantly higher compared to age-matched controls — a correlation that suggests a role in longevity. Newer 2024 studies are investigating humanin as a biomarker for biological age and a potential therapeutic target for multiple age-related diseases.

Phase 1 clinical trials are in early stages, focused on Alzheimer's and type 2 diabetes. Results are expected in late 2026.$$ where slug = 'humanin';

update peptides set mechanism_en = $$MGF (Mechano Growth Factor) is a splice variant of IGF-1, discovered by Geoffrey Goldspink at University College London in the late 1990s while studying muscle response to load. Unlike standard IGF-1 (IGF-1Ea), which circulates in plasma and regulates general growth processes, MGF (IGF-1Ec) is produced locally in muscle tissue in response to mechanical loading or injury.

Structurally, MGF differs from IGF-1Ea only in the C-terminal E-domain sequence — the result of alternative splicing of the same IGF-1 gene. This difference, however, dramatically changes biological action. Classical IGF-1 acts mainly on differentiated muscle cells. MGF activates satellite cells — muscle stem cells that, when needed, can fuse with existing muscle fibers, adding new nuclei and increasing regenerative capacity.

Satellite cell activation is critical for hypertrophy (muscle growth) and recovery from injury. With age, MGF expression declines significantly, which is one of the causes of sarcopenia (age-related muscle loss). In athletes, MGF rises rapidly after heavy resistance training and peaks 12-24 hours later — the same time when satellite cell activation begins.

Synthetic MGF used in research is the C-terminal E-domain sequence (24 amino acids), without the N-terminal IGF-1 domain. This provides an advantage: without activating the classical IGF-1 receptor (IGF-1R), the molecule selectively targets satellite cells without systemic IGF-1 effects. PEG-MGF is a polyethylene-glycol-stabilized form, with longer plasma half-life (hours vs minutes).$$ where slug = 'mgf';

update peptides set mechanism_en = $$NAD+ (Nicotinamide Adenine Dinucleotide) is not a peptide but a coenzyme involved in hundreds of enzymatic reactions in the cell. The molecule exists in two forms: NAD+ (oxidized) and NADH (reduced), which cycle between the two states during electron transport in the mitochondrial electron transport chain. This is the primary mechanism of ATP synthesis and therefore cellular energy.

With age, NAD+ levels in tissues decline significantly — about a 50% decrease between ages 30 and 60 in skeletal muscle, even more dramatically in the brain. This decline correlates with reduced mitochondrial function, increased oxidative stress, and increased cellular senescence. The hypothesis from Sinclair (Harvard) and Verdin (Buck Institute) is that restoring NAD+ levels may slow aging processes.

NAD+ is a critical cofactor for at least three key enzyme systems. Sirtuins (SIRT1-7) are deacetylases that regulate gene expression, DNA repair and metabolism — all require NAD+. PARP enzymes (poly-ADP-ribose polymerases) repair DNA damage and also consume NAD+. CD38 is an extracellular NAD+ hydrolase that increases with age and dramatically depletes NAD+ reserves.

Direct intravenous NAD+ administration bypasses problems with precursors (NMN, nicotinamide riboside), which require enzymatic processing. Clinical protocols at Hyman, Smarter Not Harder clinics use 250-1000 mg NAD+ infusions over 2-4 hours, typically 5-10 sessions per month. Small observational studies show improvement in fatigue, concentration and recovery from training, but definitive Phase 3 data is still lacking.

NAD+ IV is a standard component of anti-aging and regenerative protocols, especially in combination with peptide blends (BPC-157, TB-500) for mitochondrial support during regeneration.$$ where slug = 'nad';

update peptides set mechanism_en = $$Oxytocin is a 9-amino-acid peptide hormone secreted by parvocellular neurons in the paraventricular and supraoptic nuclei of the hypothalamus, then stored in the posterior pituitary lobe (neurohypophysis). From there it is released into the bloodstream in response to specific stimuli: lactation, childbirth, orgasm, social closeness.

Its classical function (first discovered in 1906) is stimulation of uterine contractions during childbirth and milk ejection during nursing. Oxytocin was the first identified peptide hormone and the first synthesized artificially (1953, Vincent du Vigneaud, Nobel Prize). Synthetic oxytocin (Pitocin) has been used in obstetrics for over 70 years.

Newer neuroscience has revealed a much broader role. Oxytocin receptors are found in the amygdala (the emotion center), nucleus accumbens (the reward system) and prefrontal cortex (social judgment). Activation reduces amygdala reactivity to threats, increases trust and empathy, and improves recognition of emotions from facial expressions. This led to intensive research on oxytocin for autism spectrum disorders, social anxiety and PTSD.

Results, however, are mixed. Phase 2 trials in autism (2014-2024) gave conflicting data — some showed improvement in social reciprocity, others did not differ from placebo. Newer 2024 data points to the need for a personalized approach: oxytocin works better in individuals with low baseline levels and an appropriate social context.

Administration is usually intranasal for central action (avoiding the blood-brain barrier), with about 10-15% of the dose reaching the brain. Subcutaneous administration works for peripheral effects (obstetric, lactation), but little reaches the brain due to the BBB.$$ where slug = 'oxytocin';

update peptides set mechanism_en = $$Retatrutide is a triple agonist of GLP-1, GIP and glucagon receptors, developed by Eli Lilly. It is the first triple incretin agonist in clinical development and currently produces the strongest weight-reduction results among all pharmacological therapies. TRIUMPH-1 (NEJM 2023) showed 24.2% mean body weight reduction at the 12 mg dose over 48 weeks.

Structurally, Retatrutide is based on glucagon — not GLP-1 or GIP — but with modifications that allow it to activate all three incretin receptors with balanced affinity. This is a significant technological achievement: each of the three receptors has a different structure, and activating them requires fine balances that previous dual agonists (Tirzepatide) did not possess.

The triple action provides complementary effects. The GLP-1 component reduces appetite and slows gastric emptying. The GIP component improves insulin sensitivity and stimulates lipid deposition into subcutaneous (not visceral) fat. The glucagon component activates lipolysis and thermogenesis in brown fat, increasing energy expenditure.

The glucagon component is particularly interesting. Glucagon is usually associated with raising blood sugar, which seems counterintuitive for diabetes therapy. The balance, however, is critical: low doses of glucagon stimulate energy expenditure without significantly raising blood sugar. Retatrutide achieves this balance through stronger GLP-1 action, which compensates for glucagon's sugar-raising effect.

The Phase 3 program TRIUMPH-3 (obesity) and TRIUMPH-4 (type 2 diabetes) is expected to lead to approval in late 2026. A smaller study in MASH (steatohepatitis, fatty liver disease) showed 80% regression of steatosis and 60% improvement in fibrosis over 48 weeks — an effect significantly stronger than pure GLP-1 peptides.$$ where slug = 'retatrutide';
