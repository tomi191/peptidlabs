# PeptideLab Competitive Upgrade Plan

## Findings from Competitor Analysis

### PeptidiShop.com (Direct Bulgarian Competitor)
- H1 is SEO keyword: "Най-добрите пептиди за отслабване 2026"
- Every product has a use-case tag: "за отслабване", "за мускулна маса", "за кожата"
- Before/After results section with timeframes
- Meta keywords: "пептиди за отслабване, semaglutide българия, tirzepatide цена"
- Social proof: "500+ доволни клиента", "4.9/5 оценка", "12 години на пазара"
- Blog with real articles and guides
- Customer testimonials with specific results

### Particle Peptides (EU Market Leader)
- Peptide Calculator with visual syringe feedback
- COA Vault — centralized COA download page
- 323 verified reviews, 4.9/5
- Blog with scientific articles (800+ words)
- Reconstitution guide with step-by-step instructions
- MSDS downloads per product
- Scam warning banner
- Affiliate program (10% commission)
- ISO 9001/13485 certification badges

### NovumLab (Strong EU Competitor)
- Price variant dropdown (2mg/5mg/10mg on ONE page)
- Bundle promotions (BPC+TB combo with discount)
- Trustpilot widget (374 reviews, 4.9/5)
- Reconstitution calculator with worked examples
- 400-500 words product descriptions

---

## Action Items — Prioritized

### PHASE A: SEO & Content Foundation (CRITICAL)

#### A1. Add SEO use-case tags to EVERY product
Every product needs a short "за какво е" tag visible on:
- Product cards in shop/category grids
- Product page (below name)
- Search results
- Meta descriptions

Database: Add `use_case_tag_bg` and `use_case_tag_en` to products table.

Examples:
| Product | BG Tag | EN Tag |
|---------|--------|--------|
| BPC-157 | за възстановяване | for recovery |
| Semaglutide | за отслабване | for weight management |
| Ipamorelin | за растежен хормон | for growth hormone |
| Selank | за когнитивна функция | for cognitive function |
| Melanotan 2 | за тен и пигментация | for tanning research |
| TB-500 | за тъканна регенерация | for tissue regeneration |
| GHK-Cu | за кожа и анти-ейдж | for skin & anti-aging |
| PT-141 | за сексуално здраве | for sexual health |
| Epitalon | за дълголетие | for longevity |
| CJC-1295 | за растежен хормон | for growth hormone |

#### A2. SEO-optimize all page titles and meta descriptions
Current: "PeptideLab — Research Grade Peptides"
Should be: "Пептиди онлайн | BPC-157, Semaglutide, Ipamorelin | PeptideLab.bg"

Product pages: "BPC-157 5mg за възстановяване | €24.90 | COA включен | PeptideLab"
Category pages: "Пептиди за отслабване | Semaglutide, Tirzepatide, AOD-9604 | PeptideLab"
Encyclopedia: "BPC-157 — какво представлява, механизъм на действие, научни изследвания"

#### A3. Add keyword-rich homepage H1
Current: "Тествани от трета страна. Доставка от ЕС."
Should be: "Изследователски пептиди с доказана чистота — BPC-157, Semaglutide, Ipamorelin и още 65+ пептида"

### PHASE B: Conversion Tools

#### B1. Peptide Reconstitution Calculator
Interactive tool: syringe volume → vial mg → BAC water ml → desired dose → visual syringe output
Page: /bg/calculator and /en/calculator
SEO value: "пептид калкулатор", "peptide reconstitution calculator"
Linked from every product page

#### B2. Reconstitution Guide
Step-by-step guide with sections:
1. Preparation (clean workspace, tools needed)
2. Adding BAC water (45° angle technique)
3. Mixing (gentle swirl, not shake)
4. Storage (reconstituted: 2-8°C, 14-21 days)
5. Drawing from vial

Page: /bg/guides/reconstitution and /en/guides/reconstitution
Linked from product pages and calculator

#### B3. Stacking Guides
Pages for popular combinations:
- "BPC-157 + TB-500 стак за възстановяване"
- "Ipamorelin + CJC-1295 стак за растежен хормон"
- "Semaglutide курс — какво трябва да знаете"
SEO: Long-tail keywords

### PHASE C: Trust & Social Proof

#### C1. COA Vault Page
Central page listing all available COA documents
Searchable by product name
PDF downloads
Page: /bg/coa-vault

#### C2. Quality Badges Section
Visual badges on homepage and product pages:
- "HPLC Tested ≥98%"
- "Third-Party Verified"
- "EU GMP Compliant"
- "COA With Every Order"

#### C3. Testimonials Section (when available)
Prepare the component, ready for real reviews

### PHASE D: Blog & Content Marketing

#### D1. Initial blog posts (3-5 articles, 800+ words each)
1. "Какво е BPC-157 и защо е най-търсеният пептид за възстановяване"
2. "Semaglutide vs Tirzepatide — сравнение за 2026"
3. "Как да реконституирате пептиди — пълен гайд за начинаещи"
4. "Топ 5 пептиди за начинаещи — от какво да започнете"
5. "GH секретагози — Ipamorelin, CJC-1295, GHRP-6 сравнение"

#### D2. Blog post template
Each post should include:
- SEO title with primary keyword
- Table of contents
- 800+ words
- Internal links to products and encyclopedia
- PubMed references
- FAQ section at bottom
- Related products sidebar
- CTA to shop

### PHASE E: Technical SEO

#### E1. Schema markup improvements
- Product schema with reviews (when available)
- FAQ schema on all FAQ pages
- Article schema on blog posts  
- BreadcrumbList on all pages
- Organization schema with logo
- SiteLinks searchbox

#### E2. Internal linking strategy
Every blog post → related products + encyclopedia
Every encyclopedia entry → products + blog posts
Every product → encyclopedia + related products + guides
Category pages → blog posts about that category

#### E3. Core Web Vitals
- Image optimization (when product images are added)
- Lazy loading below-fold content
- Font preload for Inter and JetBrains Mono
- Critical CSS inline
