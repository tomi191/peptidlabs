# PeptideLab.bg — Design Specification

## Overview

Онлайн магазин за research пептиди (лиофилизиран прах във флакони, "for research purposes only") с образователна платформа, обслужващ българския и европейския пазар. Позициониране: "Science meets Lab" — хибрид между научен справочник и premium пептиден магазин с лабораторна естетика.

**Домейн:** peptidelab.bg  
**Стак:** Next.js 15 (App Router) + Supabase + Vercel + Stripe  
**Езици:** Български + English  
**Валути:** BGN + EUR  

## Target Personas

### Георги (50% от revenue, фитнес/recovery)
- Мъж 25-40, фитнес ентусиаст или спортист
- Търси конкретен пептид (BPC-157, Ipamorelin) — знае какво му трябва
- Journey: Форум/Reddit → Google "BPC-157 купи България" → Продуктова страница → COD покупка
- Убеждават го: COA сертификат, HPLC чистота >98%, бърза доставка, наложен платеж
- Купува: healing пептиди (BPC-157, TB-500), GH секретагози (Ipa+CJC), blends

### Димитър (30% от revenue, biohacker/longevity)
- Мъж/жена 28-45, напреднал, чете PubMed и r/peptides
- Аналитичен — сравнява доставчици, проверява COA, знае дозировки
- Journey: Google/Reddit → Енциклопедия → Сравнение → COA проверка → Stripe покупка
- Убеждават го: third-party COA, научни данни, PubMed линкове, подробна product page
- Купува: Selank/Semax, Epitalon, GHK-Cu, Semaglutide, MOTS-c

### Мария (20% от revenue, weight loss/aesthetics)
- Жена 28-50, търси решение за отслабване или тен
- По-малко технически грамотна — идва от TikTok/Instagram, търси по проблем
- Journey: Google "пептиди за отслабване" → Блог статия → Категория → WhatsApp въпрос → покупка
- Убеждава я: статия на български, WhatsApp поддръжка, ревюта, наложен платеж
- Купува: Semaglutide, Tirzepatide, AOD-9604, Melanotan 2, PT-141

## Visual Identity

### Цветова палитра: Clinical White + Teal Accent
- **Background:** #ffffff (чисто бяло)
- **Surface:** #fafaf9 (off-white за секции, stats, trust bar)
- **Text primary:** #0f172a (deep navy — заглавия, CTA бутони, цени)
- **Text secondary:** #57534e (warm gray — nav links, body text)
- **Text muted:** #a8a29e (stone — specs, labels, timestamps)
- **Accent:** #0d9488 (teal — САМО за category labels, COA badge, cart badge, links при hover)
- **Accent tint:** #f0fdfa (teal tint — COA tag background)
- **Borders:** #f5f5f4 (ultra-light — dividers, card borders)
- **CTA:** #0f172a (navy — primary buttons са тъмни, не teal)

Teal правило: **максимум 5% от визуалното поле**. Използва се като хирургически инструмент — само за елементи, които трябва да привлекат доверие (COA, verified, category labels).

### Типография
- **Body:** Inter (400, 500, 600, 700) — чист, медицински
- **Specs / monospace:** JetBrains Mono — за purity %, mg, molecular data
- **Headings:** Inter 600-700

### Layout
- **Full-width** fluid layout, оптимизиран за всеки device
- **Max-width container** за текстово съдържание: 1280px centered
- **Responsive breakpoints:** mobile-first (320px → 768px → 1024px → 1280px+)
- **Grid:** 1 col mobile → 2 col tablet → 4 col desktop за продуктови карти

### Икони
- **Lucide React** — единствен icon пакет. НИКОГА emoji като UI елементи.
- Nav: Search, Heart, User, ShoppingBag
- Trust: FlaskConical, FileCheck, Truck, Lock
- Categories: Activity, Scale, Dumbbell, Brain, Hourglass, etc.
- Product: ShieldCheck (COA), Plus (add to cart), ArrowRight

### Дизайн принципи
- **NO AI SLOP** — без generic hero sections, без centered-text-over-gradient patterns, без stock снимки, без emoji
- **Mobile first** — responsive от 320px нагоре
- **Full-width layout** — edge-to-edge на всяко устройство
- **Асиметрични layouts** — не всичко центрирано. Hero е split (текст ляво, data дясно)
- **Minimal teal** — акцентът е 5%, останалото е бяло + navy
- **JetBrains Mono за данни** — purity, mg, molecular weight в monospace
- **Консистентни vial снимки** на светъл фон

## Site Architecture

### Navigation (Header)
```
[Top bar] Безплатна доставка над 99 лв | 🇧🇬 BG | 🇬🇧 EN | BGN ▾
[Main]    [P] PEPTIDELAB    Магазин ▾ | Енциклопедия | Блог | За нас    🔍 ♡ 👤 🛒(2)
```

### Sitemap

```
🏠 Homepage
├── Hero: value proposition + "For Research Purposes Only" disclaimer
├── Dual-entry блок ("По категория" / "По пептид")
├── Бестселъри (top 6 пептида)
├── Последни статии от блога
├── Trust секция (COA, HPLC >98%, third-party тест, бърза доставка)
└── Email capture (newsletter)

🛒 Магазин
├── По категория (за Мария и нови клиенти)
│   ├── Healing / Recovery (BPC-157, TB-500, GHK-Cu)
│   ├── Weight Loss / Metabolic (Semaglutide, Tirzepatide, AOD-9604)
│   ├── GH Secretagogues / Muscle (Ipamorelin, CJC-1295, GHRP-6)
│   ├── Anti-Aging / Longevity (Epitalon, GHK-Cu, Thymalin)
│   ├── Cognitive / Nootropic (Selank, Semax, Dihexa)
│   ├── Sexual Health / Tanning (PT-141, Melanotan 2)
│   ├── Hair Growth (PTD-DBM, GHK-Cu, AHK-Cu)
│   ├── Immune (Thymosin Alpha-1, LL-37, KPV)
│   ├── Blends (BPC+TB, Ipa+CJC)
│   └── Аксесоари (BAC water, спринцовки, starter kits)
├── По пептид (за Георги и Димитър — знаят какво търсят)
│   ├── BPC-157 (5mg, 10mg)
│   ├── Semaglutide (3mg, 5mg)
│   ├── Ipamorelin (2mg, 5mg)
│   └── [всички 65 пептида...]
├── Филтри: категория, цена, mg размер, чистота, наличност
└── Продуктова страница

🧬 Енциклопедия
├── Списък на всички пептиди (А-Я / A-Z)
├── Детайлна страница за всеки пептид
│   ├── Молекулна формула и структура
│   ├── Механизъм на действие
│   ├── Клинични изследвания (PubMed линкове)
│   ├── Продукти с този пептид → линк към магазина
│   ├── Свързани пептиди
│   └── Stacking notes (кои пептиди се комбинират)
└── Сравнение на пептиди (интерактивна таблица)

📝 Блог / Гайдове
├── Статии (SEO оптимизирани, на БГ + EN)
├── Научни новини за пептиди
└── Видео секция (placeholder за бъдещо)

👤 Акаунт
├── Кошница (side drawer, Zustand + localStorage, guest-friendly)
├── Checkout (Stripe + наложен платеж)
├── Моят акаунт (поръчки, wishlist)
└── Проследяване на доставка

ℹ️ Инфо
├── За нас
├── Доставка и плащане
├── Връщане и рекламации
├── FAQ
├── Контакти
├── Disclaimer ("For Research Purposes Only")
└── Политика за поверителност / Общи условия
```

## Key Features

### 1. Dual-Entry Navigation
Homepage предлага два пътя:
- **"По категория"** (ляво) — category chips (Healing, Weight Loss, Muscle, Nootropic...), emerald цвят
- **"По пептид"** (дясно) — peptide names в monospace (BPC-157, Semaglutide, Ipamorelin...), cyan цвят (#06b6d4), с search autocomplete

### 2. Product Page (Research Peptide)
Всяка продуктова страница има 3 таба:
- **Overview** (default) — описание, research applications, vial размери, цена, CTA
- **Science** — молекулна формула, механизъм на действие, PubMed линкове, half-life, stacking notes
- **COA** — Certificate of Analysis за текущия batch (HPLC, MS, purity %, endotoxin)

Quick-spec bar под заглавието: Purity | Vial Size (mg) | Form (lyophilized/solution) | Molecular Weight

### 3. Peptide Encyclopedia
SEO-оптимизирани страници за всеки пептид. Всяка страница включва:
- Молекулна формула и визуална структура
- Механизъм на действие (на достъпен език + научен)
- Клинични изследвания с линкове
- **"Продукти с този пептид"** секция — conversion bridge от образование към покупка
- Свързани пептиди

URL: `/bg/encyclopedia/ghk-cu`, `/en/encyclopedia/ghk-cu`

### 4. Review System
- Звезди (1-5) + текст
- Verified purchase badge
- Admin approval преди публикуване
- Aggregate rating видим на product card и в Google (JSON-LD)

### 5. i18n (BG + EN)
- next-intl за routing: `/bg/...` и `/en/...`
- Всички product descriptions, blog posts, encyclopedia entries — двуезични
- Currency switch: BGN / EUR
- Default: BG за .bg домейн, EN за EU трафик

### 6. Email Capture
- Newsletter popup (не aggressive — след 30 сек или exit intent)
- "Получи 10% отстъпка" incentive — генерира unique coupon code от `coupons` таблицата
- Записва в `newsletter_subscribers` таблица + sync с Resend за email campaigns
- Фаза 1b feature

### 7. WhatsApp/Viber Button
- Floating бутон долу вдясно
- Директен линк към WhatsApp Business
- Обслужва клиенти с въпроси и wholesale запитвания

### 8. "For Research Purposes Only" Disclaimer
- Постоянен disclaimer в footer-а на всяка страница
- Disclaimer на продуктовата страница преди "Add to Cart"
- Checkbox при checkout: "Потвърждавам, че този продукт е за изследователски цели"
- Terms of Service секция с подробен legal disclaimer

## Data Model (Supabase)

```
products
├── id uuid PK
├── slug text UNIQUE
├── sku text UNIQUE
├── name text NOT NULL (BPC-157, Semaglutide...)
├── name_bg text  -- описателно име на БГ
├── description_bg, description_en text
├── price_bgn numeric NOT NULL
├── price_eur numeric NOT NULL  -- ръчно зададена, фиксирана цена
├── images text[] (URLs от Supabase Storage)
├── vial_size_mg numeric NOT NULL  -- 2mg, 5mg, 10mg, 50mg
├── form text NOT NULL (lyophilized, solution, nasal_spray, capsule)
├── purity_percent numeric DEFAULT 99  -- HPLC purity
├── molecular_weight numeric  -- Da
├── sequence text  -- amino acid sequence
├── scientific_data jsonb {mechanism, half_life, storage, pubmed_links, stacking_notes}
├── coa_url text  -- link to COA PDF in Supabase Storage
├── is_bestseller boolean DEFAULT false
├── is_blend boolean DEFAULT false
├── status enum (draft, published, out_of_stock, archived) DEFAULT draft
├── stock integer DEFAULT 0
├── weight_grams integer  -- за калкулация на доставка (vial + packaging)
└── created_at, updated_at

product_categories (junction M2M)
├── product_id → FK products
└── category_id → FK categories

product_peptides (junction M2M — за blends с multiple пептиди)
├── product_id → FK products
└── peptide_id → FK peptides

peptides
├── id uuid PK
├── slug text UNIQUE
├── name text NOT NULL (GHK-Cu, Matrixyl...)
├── full_name_bg, full_name_en text
├── formula text
├── mechanism_bg, mechanism_en text
├── research_links text[]
└── image_url text

peptide_relations (junction M2M, self-referencing)
├── peptide_id → FK peptides
└── related_peptide_id → FK peptides

categories
├── id uuid PK
├── slug text UNIQUE
├── name_bg, name_en text NOT NULL (Healing, Weight Loss, GH/Muscle, Anti-Aging, Cognitive, Sexual, Hair, Immune, Blends, Accessories)
├── description_bg, description_en text
└── icon text
└── sort_order integer

blog_posts
├── id uuid PK
├── slug text UNIQUE
├── title_bg, title_en text NOT NULL
├── content_bg, content_en text (MDX, stored in Supabase)
├── tags text[]
├── published_at timestamptz
├── status enum (draft, published) DEFAULT draft
└── author text

blog_post_products (junction M2M)
├── blog_post_id → FK blog_posts
└── product_id → FK products

blog_post_peptides (junction M2M)
├── blog_post_id → FK blog_posts
└── peptide_id → FK peptides

reviews
├── id uuid PK
├── product_id → FK products NOT NULL
├── user_id → FK users (nullable — за гост ревюта)
├── rating integer CHECK (1-5) NOT NULL
├── text text
├── author_name text NOT NULL
├── verified_purchase boolean DEFAULT false  -- auto-set чрез cross-ref с orders
├── approved boolean DEFAULT false
└── created_at timestamptz

orders
├── id uuid PK
├── user_id → FK users (nullable — guest checkout)
├── status enum (pending, confirmed, shipped, delivered, cancelled)
├── payment_method enum (stripe, cod)
├── stripe_payment_id text
├── shipping_address jsonb {name, phone, city, address, zip, country}
├── phone text NOT NULL  -- задължително за COD валидация
├── tracking_number text
├── courier text (econt, speedy, international)
├── subtotal numeric NOT NULL
├── shipping_cost numeric NOT NULL DEFAULT 0
├── discount_amount numeric DEFAULT 0
├── coupon_code text
├── total numeric NOT NULL
├── currency text NOT NULL (BGN, EUR)
├── locale text (bg, en)
├── notes text
└── created_at timestamptz

order_items
├── id uuid PK
├── order_id → FK orders NOT NULL
├── product_id → FK products NOT NULL
├── quantity integer NOT NULL
├── unit_price numeric NOT NULL
└── product_name text  -- snapshot at purchase time

coupons
├── id uuid PK
├── code text UNIQUE NOT NULL
├── discount_percent integer  -- 10 = 10%
├── discount_fixed numeric  -- или фиксирана сума
├── min_order_amount numeric
├── max_uses integer
├── used_count integer DEFAULT 0
├── valid_from, valid_until timestamptz
└── active boolean DEFAULT true

newsletter_subscribers
├── id uuid PK
├── email text UNIQUE NOT NULL
├── locale text (bg, en)
├── subscribed_at timestamptz
└── coupon_sent boolean DEFAULT false

shipping_rates
├── id uuid PK
├── courier text NOT NULL (econt, speedy, international)
├── country text (BG, EU, etc.)
├── min_weight integer, max_weight integer
├── price numeric NOT NULL
├── free_above numeric  -- безплатна доставка над X лв
└── active boolean DEFAULT true

users
├── id uuid PK (Supabase Auth)
├── email text, name text
├── phone text
├── addresses jsonb[]
├── locale_preference text DEFAULT 'bg'
├── currency_preference text DEFAULT 'BGN'
└── created_at timestamptz

wishlists (separate table, not array on users)
├── id uuid PK
├── user_id → FK users NOT NULL
├── product_id → FK products NOT NULL
└── created_at timestamptz
```

### Бележки за data model
- **Цени:** Ръчно зададени двойни колони (price_bgn, price_eur). Няма runtime конвертиране. Валутата се определя от потребителската настройка.
- **Blog content:** MDX съдържание се съхранява в Supabase, рендерира се с `next-mdx-remote` at runtime. Admin редактира през dashboard.
- **Verified purchase:** Автоматично се определя чрез cross-reference на `reviews.user_id` с `orders.user_id` и `order_items.product_id`.
- **Wishlist:** Работи само за регистрирани потребители. Гости виждат wishlist иконата, но при клик се пренасочват към login. Фаза 1 — basic wishlist, Фаза 2 — wishlist sharing.

## Payment Flow

### Stripe (карти, Apple Pay, Google Pay)
- Stripe Checkout Session
- Webhook за потвърждение → update order status
- Поддържа BGN и EUR

### Наложен платеж (COD)
- Custom flow: поръчката се създава със status "pending"
- Email потвърждение до клиента
- Admin dashboard за управление на COD поръчки
- Ръчен update на status при доставка/плащане
- Само за България

**COD fraud prevention:**
- Телефонен номер задължителен — SMS/OTP верификация при първа COD поръчка
- Минимална стойност за COD: 20 лв (предотвратява тест поръчки)
- Максимална стойност за COD: 500 лв (над това — само карта)
- Rate limit: максимум 2 COD поръчки на ден от един IP/телефон
- Адрес валидация: град + пощенски код cross-check
- Refused delivery tracking: при 2+ отказани доставки — COD блокиран за този телефон

### Доставка
- **България:** Econt / Speedy — интеграция чрез техните API (label генериране, tracking)
- **EU:** Стандартна международна доставка (ръчен процес в начало, API по-късно)
- **Цени:** Дефинирани в `shipping_rates` таблицата. Default: 5.99 лв за БГ, безплатно над 99 лв
- **Tracking:** Линк към Econt/Speedy tracking страница (външен URL). Не custom tracking page.

## SEO Strategy

### Structured Data (JSON-LD)
- Product schema с aggregateRating
- Article schema за блог постове
- BreadcrumbList за навигация
- Organization schema

### Technical SEO
- **hreflang tags:** `<link rel="alternate" hreflang="bg" href="...">` на всяка страница — критично за двуезичен сайт
- **Canonical URLs:** Self-referencing canonical на всяка страница
- **Open Graph + Twitter Card meta:** title, description, image за всяка страница
- **Image alt text:** Всяко продуктово изображение — описателен alt на съответния език
- **XML Sitemap:** Auto-generated от Next.js — включва products, encyclopedia, blog, categories
- **robots.txt:** Allow all, disallow /api/, /admin/
- **404 strategy:** Custom 404 страница с search и популярни категории
- **Redirect strategy:** При промяна на slug — 301 redirect от старото URL (redirect map в Supabase)

### URL Structure
```
/bg/                          → Homepage BG
/en/                          → Homepage EN
/bg/shop/concerns/wrinkles    → Категория по проблем
/bg/shop/peptides/ghk-cu      → Категория по пептид
/bg/products/ghk-cu-serum     → Продукт
/bg/encyclopedia/ghk-cu       → Енциклопедия запис
/bg/blog/top-5-peptidi-bruchki → Блог статия
```

### Content Strategy
- 1 статия/седмица — таргетиране на "пептиди за [проблем]" ключови думи на БГ
- Енциклопедия записи за всеки пептид — long-tail SEO
- Cross-linking: Статия ↔ Енциклопедия ↔ Продукт

## Phased Delivery

### Фаза 1a — Core Store (седмици 1-3)
- Homepage с dual-entry навигация + бестселъри
- Каталог (по проблем + по пептид) с филтри (тип кожа, цена)
- Продуктова страница с 3 таба (описание, наука/INCI)
- Cart (side drawer, Zustand, localStorage persistence)
- Stripe checkout + COD flow (с SMS верификация)
- Доставка: shipping rates, безплатно над 99 лв
- i18n (BG + EN) — next-intl
- Admin dashboard: Supabase Studio за data + custom Next.js `/admin` routes за:
  - Управление на поръчки (view, update status, tracking)
  - Управление на продукти (CRUD, status draft/published)
  - Управление на ревюта (approve/reject)
  - Protected с Supabase Auth RLS + admin role
- SEO: sitemap, robots.txt, JSON-LD, hreflang, OG meta, canonical
- Analytics (Vercel Analytics + GA4)
- WhatsApp floating бутон

### Фаза 1b — Content & Trust (седмици 4-5)
- Ревю система (звезди + текст, admin approval, verified purchase auto-detect)
- Блог (MDX in Supabase, rendered with next-mdx-remote)
- Енциклопедия (начални записи за top 10 пептиди)
- Email capture (newsletter popup, 10% coupon — coupons table)
- "За професионалисти" landing page
- Trust секция на homepage (COA mentions, сертификати — текстово, без downloadable PDFs)

### Фаза 2 — месец 2-3
- Peptide Quiz wizard
- Бандъли и комплекти
- Stacking guide (кои пептиди комбинираш)
- COA документи за сваляне
- Преди/след галерия
- Бърза повторна поръчка
- Абонаментен модел (recurring orders)
- Wishlist sharing
- Advanced филтри

### Фаза 3 — месец 4+
- B2B секция с wholesale цени
- Автоматично фактуриране за фирми
- Видео съдържание интеграция
- Протоколи за професионалисти
- EU доставка оптимизация (DDP)
- Loyalty програма
- Referral система

## Technical Architecture

```
Browser → Vercel Edge Network → Next.js App Router
                                    ├── SSG: Homepage, Categories, Encyclopedia, Blog
                                    ├── ISR: Product pages (revalidate on review approval via on-demand revalidation)
                                    ├── API Routes: /api/checkout, /api/orders, /api/reviews, /api/revalidate
                                    └── Supabase
                                          ├── PostgreSQL (data)
                                          ├── Auth (users + admin RLS)
                                          ├── Storage (images, COA PDFs)
                                          └── Webhooks → trigger ISR revalidation
```

### Rendering Strategy
- **SSG** за страници, които рядко се променят: Homepage, Category pages, Encyclopedia, Blog
- **ISR (Incremental Static Regeneration)** за Product pages — статично генерирани, но revalidate on-demand при одобряване на ревю или промяна на продукта. Supabase webhook → `/api/revalidate` → `revalidatePath()`
- **Client-side** за динамични елементи: cart, wishlist toggle, currency switch

### Key Dependencies
- **next-intl** — i18n routing и translations
- **@stripe/stripe-js + stripe** — payments
- **zustand** — client state (cart, wishlist)
- **tailwindcss** — styling (dark emerald theme)
- **@supabase/supabase-js** — database client
- **next-mdx-remote** — MDX rendering от Supabase-stored content
- **react-hot-toast** — notifications
- **lucide-react** — icons

## Growth Engine

```
SEO статия за пептид X → Потребител научава, гради trust
→ Вижда "Продукти с този пептид" → Купува от PeptideLab
→ Email follow-up → Повторна покупка
```

Конкурентното предимство: **Който научи клиента, печели клиента.** 200 статии за пептиди на български, ранкващи в Google = 2 години преднина пред всеки конкурент.

## KPIs (Launch targets)
- Conversion rate: 2-3%
- Average Order Value: 70+ лв
- Email captures: 100/месец
- Organic traffic: 500 visits/месец (месец 3)
- Return customer rate: 30%+

## Product Catalog (75 продукта, 12 категории)

### Ценова архитектура
- **Entry (€8-18):** ~15 продукта — lip balm, mist, micellar, тонер, пачове
- **Core (€18-35):** ~40 продукта — серуми, кремове, маски, hair products
- **Premium (€35-72):** ~10 продукта — концентрати, growth factors, pro серуми
- **Bundles (€28-72):** 5 комплекта — discovery kit, routine sets, gift sets

### По категория

| # | Категория | Брой | Ценови диапазон |
|---|-----------|------|-----------------|
| 1 | Серуми за лице | 20 | €12-55 |
| 2 | Околоочна зона | 6 | €14-36 |
| 3 | Кремове за лице | 8 | €18-42 |
| 4 | Маски | 5 | €16-34 |
| 5 | Коса и растеж | 6 | €16-48 |
| 6 | Шия и деколте | 3 | €18-38 |
| 7 | Тяло | 4 | €12-34 |
| 8 | Почистване | 4 | €12-24 |
| 9 | Тонери и есенции | 4 | €12-32 |
| 10 | Устни | 3 | €8-20 |
| 11 | Комплекти | 5 | €28-72 |
| 12 | Професионални | 7 | €28-72 |

### Top 10 за Launch (must-have)
1. **Multi-Peptide Anti-Aging Serum** — Matrixyl + Argireline + SYN-AKE (€22-35) FLAGSHIP
2. **Argireline 10% Wrinkle-Freeze Serum** — Acetyl Hexapeptide-3 (€14-22) PRICE HERO
3. **GHK-Cu 1% Regenerating Serum** — Copper Tripeptide-1 (€18-32) TRENDING
4. **Matrixyl 10% Collagen Boost Serum** — Palmitoyl Tripeptide-1+7 (€12-20)
5. **Copper Peptide Hair Growth Serum** — GHK-Cu + Biotin + Caffeine (€28-42)
6. **Intensive Peptide Eye Patches (30 пар)** — Argireline + Matrixyl (€16-24) REPEAT BUY
7. **Peptide Day Cream SPF 30** — Matrixyl 3000 + SPF (€22-35) DAILY
8. **Peptide Discovery Kit** — 4 мини серума + крем (€28-38) ACQUISITION
9. **Lash & Brow Growth Serum** — Myristoyl Pentapeptide-17 (€18-28) HIGH MARGIN
10. **Peptide Lip Plumping Gloss** — Volulip (€12-18) IMPULSE

### Ключови пептиди
- **Matrixyl** (всички варианти) — най-разпознат, в 18 продукта
- **Argireline** (Acetyl Hexapeptide-3) — топ търсене, в 14 продукта
- **GHK-Cu** (Copper Tripeptide-1) — +1016% YoY ръст, в 12 продукта
- **SYN-AKE** — силен в Балканите, в 4 продукта
- **EGF** — premium ниша, в 4 продукта
- **SNAP-8** — next-gen Argireline, в 3 продукта
- **Collagen Peptides** — масов пазар, в 8 продукта

### Пълен списък (75 продукта)

**Серуми за лице (20):**
1. Argireline 10% Wrinkle-Freeze Serum (€14-22)
2. Matrixyl 10% Collagen Boost Serum (€12-20)
3. GHK-Cu 1% Regenerating Serum (€18-32)
4. Multi-Peptide Anti-Aging Power Serum (€22-35)
5. SYN-AKE Venom Peptide Serum (€20-30)
6. SNAP-8 Advanced Expression Line Serum (€16-26)
7. EGF Epidermal Growth Factor Serum (€28-45)
8. Peptide + Vitamin C Brightening Serum (€18-28)
9. Retinol + Peptide Night Renewal Serum (€22-35)
10. HA + Peptide Hydration Serum (€14-22)
11. Niacinamide 5% + Peptide Pore Refining Serum (€14-22)
12. Bakuchiol + Peptide Plant Retinol Serum (€20-30)
13. Ceramide + Peptide Barrier Repair Serum (€18-28)
14. Leuphasyl + Argireline Double Action Serum (€18-26)
15. Peptide + Squalane Oil Serum (€18-28)
16. Collagen Peptide + Probiotics Serum (€22-32)
17. Anti-Redness Peptide Calming Serum (€20-30)
18. Peptide + AHA Exfoliating Renewal Serum (€16-24)
19. Firming Peptide Ampoule 7-Day Cure (€18-28)
20. Peptide Booster Drops (€20-30)

**Околоочна зона (6):**
21. Peptide Eye Contour Roll-On Serum (€16-26)
22. Dark Circle Correcting Peptide Eye Cream (€18-30)
23. Intensive Peptide Eye Patches 30 пар (€16-24)
24. Lifting Eye Cream + SYN-AKE (€22-34)
25. Peptide Eye Gel за чувствителни очи (€14-22)
26. Multi-Peptide Eye Serum-Cream (€22-36)

**Кремове за лице (8):**
27. Peptide Day Cream SPF 30 (€22-35)
28. Collagen Peptide Rich Night Cream (€24-38)
29. Copper Peptide Recovery Cream (€26-40)
30. Lightweight Peptide Gel-Cream за мазна кожа (€18-28)
31. Peptide + Retinol Night Renewal Cream (€24-36)
32. Firming Peptide Cream за 50+ кожа (€28-42)
33. Peptide CC Cream 3 нюанса (€18-28)
34. Overnight Peptide Sleeping Mask-Cream (€20-32)

**Маски (5):**
35. Peptide + Gold Hydrogel Sheet Mask 5бр (€18-28)
36. Copper Peptide Clay Detox Mask (€16-24)
37. Collagen Peptide Overnight Gel Mask (€18-28)
38. Bio-Cellulose Lifting Mask 3бр (€22-34)
39. Peptide + Enzyme Exfoliating Mask (€16-24)

**Коса и растеж (6):**
40. Copper Peptide Hair Growth Serum (€28-42)
41. Peptide + Redensyl Hair Density Spray (€26-38)
42. Scalp Peptide Treatment Ampoules 12бр (€32-48)
43. Peptide Thickening Shampoo (€16-24)
44. Minoxidil-Free Peptide Hair Growth Tonic (€24-36)
45. Peptide Lash & Brow Growth Serum (€18-28)

**Шия и деколте (3):**
46. Neck & Decollete Firming Cream (€24-38)
47. Neck Lift Peptide Serum (€22-34)
48. Peptide Decollete Sheet Masks 4бр (€18-28)

**Тяло (4):**
49. Peptide Anti-Cellulite Body Serum (€22-34)
50. Firming Body Cream with Peptides (€20-32)
51. Peptide Anti-Aging Hand Cream SPF 15 (€12-18)
52. Peptide Stretch Mark Serum (€20-30)

**Почистване (4):**
53. Gentle Peptide Foam Cleanser (€14-22)
54. Peptide Micellar Cleansing Water (€12-18)
55. Peptide Oil Cleanser (€16-24)
56. Peptide + PHA Exfoliating Cleanser (€16-24)

**Тонери и есенции (4):**
57. Peptide + HA Hydrating Toner (€14-22)
58. Fermented Peptide Essence (€20-32)
59. Copper Peptide Clarifying Toner (€16-24)
60. Peptide Mist Spray (€12-18)

**Устни (3):**
61. Peptide Lip Plumping Gloss (€12-18)
62. Peptide Lip Balm SPF 15 (€8-14)
63. Overnight Peptide Lip Mask (€14-20)

**Комплекти (5):**
64. Peptide Discovery Kit — 4 мини (€28-38)
65. Anti-Wrinkle Peptide Routine Set (€52-72)
66. Hair Growth Peptide Kit (€42-58)
67. Peptide Date Night Set (€32-44)
68. Men's Peptide Essentials Kit (€36-48)

**Професионални / Концентрати (7):**
69. GHK-Cu 3% Professional Concentrate (€38-58)
70. Argireline 20% Professional Solution (€28-42)
71. Matrixyl Synthe'6 10% Professional Serum (€32-48)
72. EGF + FGF Dual Growth Factor Concentrate (€48-72)
73. 10-Peptide Complex Supercharged Serum (€38-55)
74. Professional Peptide Peel Booster (€28-40)
75. Peptide Mesotherapy Serum 5x5ml (€32-48)

## Regulatory Compliance

### Правна рамка: Research Peptides (сива зона)
Research пептидите (BPC-157, TB-500, Ipamorelin, Semaglutide analogs и т.н.) НЕ са одобрени за употреба от хора в ЕС. Те се продават легално като **"for research purposes only"** — за in-vitro изследвания, лабораторна употреба.

### Какво е легално
- Продажба на пептиди етикетирани "For Research Purposes Only / Not for Human Consumption"
- Продажба на лиофилизиран прах в стерилни флакони
- Предоставяне на COA (Certificate of Analysis) с HPLC чистота
- Научно описание на механизъм на действие с PubMed референции
- Продажба на аксесоари (бактериостатична вода, спринцовки)

### Какво НЕ ТРЯБВА да се прави (= юридически рискове)
- **НИКОГА** не давай дозировки за хора ("inject 250mcg twice daily")
- **НИКОГА** не описвай продукта като лекарство ("лекува", "лечение на")
- **НИКОГА** не маркетирай с преди/след снимки на хора
- **НИКОГА** не рекламирай конкретни здравословни ползи ("ще загубите 10 кг")
- **НИКОГА** не продавай готови за инжектиране разтвори (реконституирани)
- Избягвай думите: "пациент", "доза", "лечение", "терапия", "прилагане"
- Използвай: "research subject", "research application", "studied for", "literature suggests"

### Етикетиране на флакон
- Име на пептида + количество (mg)
- "For Research Purposes Only"
- "Not for Human Consumption"
- Batch/Lot номер
- Дата на производство
- Условия за съхранение
- Фирмено име и адрес

### Защитни мерки за сайта
1. **Disclaimer на всяка страница** (footer): "All products are sold for research purposes only. Not for human consumption."
2. **Disclaimer на продуктова страница** преди Add to Cart
3. **Checkbox при checkout**: "I confirm these products are for research use only"
4. **Terms of Service**: подробен legal disclaimer, освобождаване от отговорност
5. **Блог/Енциклопедия**: "Research suggests..." езикова рамка, не "Take X for Y"
6. **Не публикувай дозировки** — линкни към PubMed, нека reader сам чете

### Практическа реалност в България
- Българските власти фокусират enforcement върху **мащабен трафик**, не върху retail research peptide магазини
- Онлайн продажби с "research" етикиране работят относително открито
- Конкурентите (Direct Peptides, Particle Peptides) оперират свободно в EU
- Основният риск е ако някой подаде жалба или ако продуктите бъдат рекламирани като лекарства

### Препоръка
Консултация с адвокат специализиран в pharmaceutical/regulatory law в България преди launch (~500-1,000 EUR). Ще потвърди конкретните рамки за твоята фирмена структура.

## Open Questions
1. Продуктови снимки — има ли наличен фото материал на флакони с консистентен стил?
2. Доставка — кой куриер за България? Econt, Speedy? И за EU? Cold chain нужен ли е?
3. Домейн — peptidelab.bg свободен ли е?
4. Доставчик — от кого се доставят пептидите? (Китай, EU производител, друг?)
5. COA — доставчикът предоставя ли COA за всеки batch?
6. Съхранение — имаш ли хладилно съхранение за inventory?
