# Plan 1: Foundation + Database

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the Next.js project with Supabase, i18n, Tailwind theme, complete database schema, and seed data — ready for frontend development.

**Architecture:** Next.js 15 App Router with next-intl for BG/EN routing, Supabase for PostgreSQL + Auth + Storage, Tailwind CSS with clinical white + teal accent theme. Full-width fluid layout, mobile-first, Lucide React icons.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, next-intl, @supabase/supabase-js, @supabase/ssr, lucide-react, zustand

**Spec:** `docs/superpowers/specs/2026-04-07-peptidelab-design.md`

**Design reference:** `.superpowers/brainstorm/8004-1775583599/hybrid-v2.html`

---

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.env.local.example`, `.gitignore`

- [ ] **Step 1: Create Next.js app**

```bash
cd "D:/Ai Builder Website/Пептиди"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

- [ ] **Step 2: Install core dependencies**

```bash
npm install next-intl @supabase/supabase-js @supabase/ssr zustand lucide-react next-mdx-remote
npm install -D @types/node
```

- [ ] **Step 3: Create `.env.local.example`**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 4: Add `.env.local.example` to `.gitignore`, verify `.env.local` is already ignored**

- [ ] **Step 5: Initialize git and commit**

```bash
git init
git add -A
git commit -m "feat: initialize Next.js 15 project with core dependencies"
```

---

### Task 2: Tailwind theme — Clinical White + Teal

**Files:**
- Modify: `src/app/globals.css`
- Create: `tailwind.config.ts` (modify generated)

- [ ] **Step 1: Configure Tailwind theme with design tokens**

In `tailwind.config.ts`, extend theme with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: "#fafaf9",
        navy: "#0f172a",
        "text-secondary": "#57534e",
        "text-muted": "#a8a29e",
        accent: "#0d9488",
        "accent-tint": "#f0fdfa",
        "accent-border": "#ccfbf1",
        border: "#f5f5f4",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Set up globals.css with font imports and base styles**

```css
@import "tailwindcss";

@theme {
  --color-surface: #fafaf9;
  --color-navy: #0f172a;
  --color-text-secondary: #57534e;
  --color-text-muted: #a8a29e;
  --color-accent: #0d9488;
  --color-accent-tint: #f0fdfa;
  --color-accent-border: #ccfbf1;
  --color-border: #f5f5f4;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

@layer base {
  body {
    @apply bg-white text-navy antialiased;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: configure Tailwind theme — clinical white + teal accent"
```

---

### Task 3: i18n setup with next-intl

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/messages/bg.json`
- Create: `src/messages/en.json`
- Create: `src/middleware.ts`
- Modify: `next.config.ts`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Delete: `src/app/page.tsx`, `src/app/layout.tsx` (move to `[locale]`)

- [ ] **Step 1: Create i18n routing config**

Create `src/i18n/routing.ts`:

```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bg", "en"],
  defaultLocale: "bg",
});
```

- [ ] **Step 2: Create i18n request config**

Create `src/i18n/request.ts`:

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create initial message files**

Create `src/messages/bg.json`:

```json
{
  "nav": {
    "shop": "Магазин",
    "encyclopedia": "Енциклопедия",
    "blog": "Блог",
    "about": "За нас"
  },
  "common": {
    "addToCart": "Добави",
    "viewAll": "Виж всички",
    "bestsellers": "Най-продавани",
    "freeShipping": "Безплатна доставка над 99 лв",
    "hplcTested": "Всички пептиди HPLC тествани ≥98%",
    "researchOnly": "Всички продукти се продават само за изследователски цели. Не са предназначени за консумация от хора.",
    "currency": "лв",
    "coaIncluded": "COA включен"
  },
  "hero": {
    "tag": "Research Grade Peptides",
    "title": "Тествани от трета страна.\nДоставка от ЕС.\nВсеки batch верифициран.",
    "subtitle": "65+ research пептида с HPLC-верифицирана чистота. Certificate of Analysis с всяка поръчка.",
    "browsePeptides": "Разгледай пептиди",
    "viewCoa": "Виж COA доклади"
  }
}
```

Create `src/messages/en.json`:

```json
{
  "nav": {
    "shop": "Shop",
    "encyclopedia": "Encyclopedia",
    "blog": "Blog",
    "about": "About"
  },
  "common": {
    "addToCart": "Add to Cart",
    "viewAll": "View all",
    "bestsellers": "Bestsellers",
    "freeShipping": "Free shipping over €49",
    "hplcTested": "All peptides HPLC tested ≥98%",
    "researchOnly": "All products are sold strictly for research purposes only. Not for human consumption.",
    "currency": "€",
    "coaIncluded": "COA included"
  },
  "hero": {
    "tag": "Research Grade Peptides",
    "title": "Third-party tested.\nShipped from EU.\nEvery batch verified.",
    "subtitle": "65+ research peptides with HPLC-verified purity. Certificate of Analysis included with every order.",
    "browsePeptides": "Browse Peptides",
    "viewCoa": "View COA Reports"
  }
}
```

- [ ] **Step 4: Create middleware for locale routing**

Create `src/middleware.ts`:

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 5: Update next.config.ts for next-intl**

```typescript
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Move app layout to `[locale]`**

Delete `src/app/page.tsx` and `src/app/layout.tsx`. Create `src/app/[locale]/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "PeptideLab — Research Grade Peptides",
  description: "65+ HPLC-tested research peptides. COA included. EU shipping.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-white text-navy antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Create `src/app/[locale]/page.tsx`:

```typescript
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("hero");
  return (
    <main className="w-full">
      <p className="p-8 text-text-secondary">{t("tag")}</p>
    </main>
  );
}
```

- [ ] **Step 7: Run dev server and verify i18n works**

```bash
npm run dev
```

Visit `http://localhost:3000/bg` → should show "Research Grade Peptides"
Visit `http://localhost:3000/en` → should show "Research Grade Peptides"
Visit `http://localhost:3000` → should redirect to `/bg`

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: setup next-intl i18n with BG/EN routing"
```

---

### Task 4: Supabase project + database schema

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create Supabase project**

Use Supabase MCP tool or dashboard to create project "peptidelab". Copy URL and keys to `.env.local`.

- [ ] **Step 2: Create Supabase client utilities**

Create `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Create `src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

- [ ] **Step 3: Write the complete migration SQL**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_bg text not null,
  name_en text not null,
  description_bg text,
  description_en text,
  icon text,
  sort_order integer default 0
);

-- Peptides (encyclopedia entries)
create table peptides (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  full_name_bg text,
  full_name_en text,
  formula text,
  mechanism_bg text,
  mechanism_en text,
  research_links text[] default '{}',
  image_url text
);

create table peptide_relations (
  peptide_id uuid references peptides(id) on delete cascade,
  related_peptide_id uuid references peptides(id) on delete cascade,
  primary key (peptide_id, related_peptide_id)
);

-- Products
create type product_status as enum ('draft', 'published', 'out_of_stock', 'archived');
create type product_form as enum ('lyophilized', 'solution', 'nasal_spray', 'capsule', 'accessory');

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  sku text unique not null,
  name text not null,
  name_bg text,
  description_bg text,
  description_en text,
  price_bgn numeric not null,
  price_eur numeric not null,
  images text[] default '{}',
  vial_size_mg numeric,
  form product_form not null default 'lyophilized',
  purity_percent numeric default 99,
  molecular_weight numeric,
  sequence text,
  scientific_data jsonb default '{}',
  coa_url text,
  is_bestseller boolean default false,
  is_blend boolean default false,
  status product_status default 'draft',
  stock integer default 0,
  weight_grams integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table product_categories (
  product_id uuid references products(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table product_peptides (
  product_id uuid references products(id) on delete cascade,
  peptide_id uuid references peptides(id) on delete cascade,
  primary key (product_id, peptide_id)
);

-- Blog
create type post_status as enum ('draft', 'published');

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_bg text not null,
  title_en text not null,
  content_bg text,
  content_en text,
  tags text[] default '{}',
  published_at timestamptz,
  status post_status default 'draft',
  author text
);

create table blog_post_products (
  blog_post_id uuid references blog_posts(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  primary key (blog_post_id, product_id)
);

create table blog_post_peptides (
  blog_post_id uuid references blog_posts(id) on delete cascade,
  peptide_id uuid references peptides(id) on delete cascade,
  primary key (blog_post_id, peptide_id)
);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  user_id uuid,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text,
  author_name text not null,
  verified_purchase boolean default false,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Orders
create type payment_method as enum ('stripe', 'cod');
create type order_status as enum ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  status order_status default 'pending',
  payment_method payment_method not null,
  stripe_payment_id text,
  shipping_address jsonb not null,
  phone text not null,
  tracking_number text,
  courier text,
  subtotal numeric not null,
  shipping_cost numeric not null default 0,
  discount_amount numeric default 0,
  coupon_code text,
  total numeric not null,
  currency text not null default 'BGN',
  locale text default 'bg',
  research_confirmed boolean not null default false,
  notes text,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity integer not null,
  unit_price numeric not null,
  product_name text not null
);

-- Coupons
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent integer,
  discount_fixed numeric,
  min_order_amount numeric,
  max_uses integer,
  used_count integer default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  active boolean default true
);

-- Newsletter
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  locale text default 'bg',
  subscribed_at timestamptz default now(),
  coupon_sent boolean default false
);

-- Shipping rates
create table shipping_rates (
  id uuid primary key default gen_random_uuid(),
  courier text not null,
  country text,
  min_weight integer,
  max_weight integer,
  price numeric not null,
  free_above numeric,
  active boolean default true
);

-- Wishlists
create table wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- Users profile extension
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  addresses jsonb default '[]',
  locale_preference text default 'bg',
  currency_preference text default 'BGN',
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

-- RLS policies
alter table products enable row level security;
alter table categories enable row level security;
alter table peptides enable row level security;
alter table reviews enable row level security;
alter table orders enable row level security;
alter table profiles enable row level security;

-- Public read for published products
create policy "Public can read published products"
  on products for select using (status = 'published');

-- Public read for categories and peptides
create policy "Public can read categories"
  on categories for select using (true);

create policy "Public can read peptides"
  on peptides for select using (true);

-- Public can read approved reviews
create policy "Public can read approved reviews"
  on reviews for select using (approved = true);

-- Users can read own orders
create policy "Users read own orders"
  on orders for select using (auth.uid() = user_id);

-- Users can read own profile
create policy "Users read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on profiles for update using (auth.uid() = id);

-- Admin full access (checked via profiles.is_admin)
create policy "Admins full access products"
  on products for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins full access orders"
  on orders for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins full access reviews"
  on reviews for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );
```

- [ ] **Step 4: Apply migration via Supabase MCP**

Use Supabase MCP `apply_migration` tool with the SQL above, or run via Supabase CLI.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Supabase client utils and complete database schema"
```

---

### Task 5: Seed data — categories + top 20 peptides + products

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: Write seed data SQL**

Create `supabase/seed.sql`:

```sql
-- Categories
insert into categories (slug, name_bg, name_en, icon, sort_order) values
  ('healing', 'Възстановяване', 'Healing / Recovery', 'activity', 1),
  ('weight-loss', 'Отслабване', 'Weight Loss / Metabolic', 'scale', 2),
  ('gh-muscle', 'GH / Мускули', 'GH / Muscle', 'dumbbell', 3),
  ('anti-aging', 'Анти-ейдж', 'Anti-Aging / Longevity', 'hourglass', 4),
  ('nootropic', 'Ноотропик', 'Cognitive / Nootropic', 'brain', 5),
  ('sexual-health', 'Сексуално здраве', 'Sexual Health / Tanning', 'flame', 6),
  ('hair-growth', 'Растеж на коса', 'Hair Growth', 'scissors', 7),
  ('immune', 'Имунитет', 'Immune', 'shield', 8),
  ('blends', 'Блендове', 'Blends', 'layers', 9),
  ('accessories', 'Аксесоари', 'Accessories', 'package', 10);

-- Peptides (encyclopedia — top 20)
insert into peptides (slug, name, full_name_bg, full_name_en, formula, mechanism_bg, mechanism_en) values
  ('bpc-157', 'BPC-157', 'Body Protection Compound-157', 'Body Protection Compound-157', 'C62H98N16O22', 'Пентадекапептид, изолиран от стомашен сок. Изследван за заздравяване на тъкани, сухожилия и чревна лигавица.', 'Pentadecapeptide isolated from gastric juice. Studied for tissue, tendon, and gut mucosal healing.'),
  ('tb-500', 'TB-500', 'Тимозин Бета-4 фрагмент', 'Thymosin Beta-4 Fragment', 'C212H350N56O78S', 'Синтетичен фрагмент на Тимозин Бета-4. Изследван за тъканна регенерация и клетъчна миграция.', 'Synthetic fragment of Thymosin Beta-4. Studied for tissue regeneration and cell migration.'),
  ('semaglutide', 'Semaglutide', 'Семаглутид', 'Semaglutide', 'C187H291N45O59', 'GLP-1 рецепторен агонист. Изследван за глюкозен метаболизъм и апетитна регулация.', 'GLP-1 receptor agonist. Studied for glucose metabolism and appetite regulation.'),
  ('tirzepatide', 'Tirzepatide', 'Тирзепатид', 'Tirzepatide', 'C225H348N48O68', 'Двоен GIP/GLP-1 рецепторен агонист. Изследван за метаболитна регулация.', 'Dual GIP/GLP-1 receptor agonist. Studied for metabolic regulation.'),
  ('ipamorelin', 'Ipamorelin', 'Ипаморелин', 'Ipamorelin', 'C38H49N9O5', 'Селективен GH секретагог. Изследван за стимулиране на растежен хормон с минимални странични ефекти.', 'Selective GH secretagogue. Studied for growth hormone stimulation with minimal side effects.'),
  ('cjc-1295', 'CJC-1295', 'CJC-1295 с DAC', 'CJC-1295 with DAC', 'C152H252N44O42', 'Модифициран GHRH аналог с удължен полуживот. Изследван за продължително повишаване на GH.', 'Modified GHRH analog with extended half-life. Studied for sustained GH elevation.'),
  ('selank', 'Selank', 'Селанк', 'Selank', 'C33H57N11O9', 'Синтетичен аналог на тъфтсин. Изследван за анксиолитични и ноотропни ефекти.', 'Synthetic tuftsin analog. Studied for anxiolytic and nootropic effects.'),
  ('semax', 'Semax', 'Семакс', 'Semax', 'C37H51N9O10S', 'ACTH(4-10) аналог. Изследван за невропротекция и когнитивно подобрение.', 'ACTH(4-10) analog. Studied for neuroprotection and cognitive enhancement.'),
  ('melanotan-2', 'Melanotan 2', 'Меланотан II', 'Melanotan II', 'C50H69N15O9', 'Синтетичен аналог на алфа-MSH. Изследван за меланокортинова рецепторна активация.', 'Synthetic alpha-MSH analog. Studied for melanocortin receptor activation.'),
  ('pt-141', 'PT-141', 'PT-141 (Бремеланотид)', 'PT-141 (Bremelanotide)', 'C50H68N14O10', 'Меланокортинов рецепторен агонист. Изследван за MC3R/MC4R активация.', 'Melanocortin receptor agonist. Studied for MC3R/MC4R activation.'),
  ('epitalon', 'Epitalon', 'Епиталон', 'Epitalon', 'C14H22N4O9', 'Синтетичен тетрапептид. Изследван за теломеразна активация и пинеална регулация.', 'Synthetic tetrapeptide. Studied for telomerase activation and pineal regulation.'),
  ('ghk-cu', 'GHK-Cu', 'GHK-Cu (Меден пептид)', 'GHK-Cu (Copper Peptide)', 'C14H23CuN6O4', 'Естествено срещащ се меден комплекс трипептид. Изследван за ремоделиране на тъкани и колагенов синтез.', 'Naturally occurring copper complex tripeptide. Studied for tissue remodeling and collagen synthesis.'),
  ('aod-9604', 'AOD-9604', 'AOD-9604', 'AOD-9604', 'C78H123N23O23S2', 'Модифициран GH фрагмент (176-191). Изследван за липолиза и мастен метаболизъм.', 'Modified GH fragment (176-191). Studied for lipolysis and fat metabolism.'),
  ('ghrp-6', 'GHRP-6', 'GHRP-6', 'GHRP-6', 'C46H56N12O6', 'GH освобождаващ пептид. Изследван за стимулиране на GH секреция и грелинова рецепторна активация.', 'GH releasing peptide. Studied for GH secretion stimulation and ghrelin receptor activation.'),
  ('dsip', 'DSIP', 'DSIP (Делта Сън Индуциращ Пептид)', 'DSIP (Delta Sleep Inducing Peptide)', 'C35H48N10O15', 'Невропептид. Изследван за регулация на съня и стресова адаптация.', 'Neuropeptide. Studied for sleep regulation and stress adaptation.'),
  ('na-selank', 'NA-Selank', 'N-Ацетил Селанк', 'N-Acetyl Selank', 'C35H59N11O10', 'Стабилизирана версия на Селанк с подобрена стабилност.', 'Stabilized version of Selank with improved stability.'),
  ('na-semax', 'NA-Semax', 'N-Ацетил Семакс', 'N-Acetyl Semax', 'C39H53N9O11S', 'Стабилизирана версия на Семакс с по-силен ноотропен ефект.', 'Stabilized version of Semax with stronger nootropic effect.'),
  ('tesamorelin', 'Tesamorelin', 'Тесаморелин', 'Tesamorelin', 'C221H366N72O67S', 'GHRH аналог. Изследван за намаляване на висцерална мастна тъкан.', 'GHRH analog. Studied for visceral adipose tissue reduction.'),
  ('mots-c', 'MOTS-c', 'MOTS-c', 'MOTS-c', 'C101H152N28O22S2', 'Митохондриален пептид. Изследван за метаболитна регулация и упражнение-миметичен ефект.', 'Mitochondrial peptide. Studied for metabolic regulation and exercise-mimetic effect.'),
  ('foxo4-dri', 'FOXO4-DRI', 'FOXO4-DRI', 'FOXO4-DRI', NULL, 'D-ретро-инверсо пептид. Изследван за сенолитична активност — апоптоза на стареещи клетки.', 'D-retro-inverso peptide. Studied for senolytic activity — apoptosis of senescent cells.');

-- Top 10 Products (published, ready for store)
insert into products (slug, sku, name, name_bg, description_bg, description_en, price_bgn, price_eur, vial_size_mg, form, purity_percent, is_bestseller, status, stock) values
  ('bpc-157-5mg', 'PL-BPC5', 'BPC-157', 'BPC-157 5mg', 'Лиофилизиран прах, 5mg за флакон. Research grade, HPLC тествана чистота ≥99%.', 'Lyophilized powder, 5mg per vial. Research grade, HPLC tested purity ≥99%.', 58.00, 29.90, 5, 'lyophilized', 99, true, 'published', 100),
  ('bpc-157-10mg', 'PL-BPC10', 'BPC-157', 'BPC-157 10mg', 'Лиофилизиран прах, 10mg за флакон. Research grade.', 'Lyophilized powder, 10mg per vial. Research grade.', 97.00, 49.90, 10, 'lyophilized', 99, false, 'published', 50),
  ('semaglutide-5mg', 'PL-SEMA5', 'Semaglutide', 'Семаглутид 5mg', 'Лиофилизиран прах, 5mg за флакон. Research grade.', 'Lyophilized powder, 5mg per vial. Research grade.', 175.00, 89.90, 5, 'lyophilized', 98, true, 'published', 30),
  ('ipamorelin-cjc-blend-10mg', 'PL-IPACJC10', 'Ipamorelin + CJC-1295 Blend', 'Ипаморелин + CJC-1295 бленд 10mg', 'Комбиниран бленд, 10mg за флакон. Research grade.', 'Combined blend, 10mg per vial. Research grade.', 83.00, 42.90, 10, 'lyophilized', 98, true, 'published', 60),
  ('melanotan-2-10mg', 'PL-MT2-10', 'Melanotan 2', 'Меланотан II 10mg', 'Лиофилизиран прах, 10mg за флакон.', 'Lyophilized powder, 10mg per vial.', 39.00, 19.90, 10, 'lyophilized', 99, true, 'published', 80),
  ('tb-500-5mg', 'PL-TB5', 'TB-500', 'TB-500 5mg', 'Лиофилизиран прах, 5mg за флакон.', 'Lyophilized powder, 5mg per vial.', 68.00, 34.90, 5, 'lyophilized', 99, true, 'published', 70),
  ('selank-5mg', 'PL-SEL5', 'Selank', 'Селанк 5mg', 'Лиофилизиран прах, 5mg за флакон.', 'Lyophilized powder, 5mg per vial.', 48.00, 24.90, 5, 'lyophilized', 99, true, 'published', 90),
  ('semax-5mg', 'PL-SEM5', 'Semax', 'Семакс 5mg', 'Лиофилизиран прах, 5mg за флакон.', 'Lyophilized powder, 5mg per vial.', 48.00, 24.90, 5, 'lyophilized', 99, false, 'published', 90),
  ('pt-141-10mg', 'PL-PT141', 'PT-141', 'PT-141 10mg', 'Лиофилизиран прах, 10mg за флакон.', 'Lyophilized powder, 10mg per vial.', 58.00, 29.90, 10, 'lyophilized', 99, true, 'published', 50),
  ('epitalon-10mg', 'PL-EPI10', 'Epitalon', 'Епиталон 10mg', 'Лиофилизиран прах, 10mg за флакон.', 'Lyophilized powder, 10mg per vial.', 68.00, 34.90, 10, 'lyophilized', 99, false, 'published', 40);

-- Link products to categories
insert into product_categories (product_id, category_id)
select p.id, c.id from products p, categories c where p.slug = 'bpc-157-5mg' and c.slug = 'healing'
union all
select p.id, c.id from products p, categories c where p.slug = 'bpc-157-10mg' and c.slug = 'healing'
union all
select p.id, c.id from products p, categories c where p.slug = 'semaglutide-5mg' and c.slug = 'weight-loss'
union all
select p.id, c.id from products p, categories c where p.slug = 'ipamorelin-cjc-blend-10mg' and c.slug = 'gh-muscle'
union all
select p.id, c.id from products p, categories c where p.slug = 'ipamorelin-cjc-blend-10mg' and c.slug = 'blends'
union all
select p.id, c.id from products p, categories c where p.slug = 'melanotan-2-10mg' and c.slug = 'sexual-health'
union all
select p.id, c.id from products p, categories c where p.slug = 'tb-500-5mg' and c.slug = 'healing'
union all
select p.id, c.id from products p, categories c where p.slug = 'selank-5mg' and c.slug = 'nootropic'
union all
select p.id, c.id from products p, categories c where p.slug = 'semax-5mg' and c.slug = 'nootropic'
union all
select p.id, c.id from products p, categories c where p.slug = 'pt-141-10mg' and c.slug = 'sexual-health'
union all
select p.id, c.id from products p, categories c where p.slug = 'epitalon-10mg' and c.slug = 'anti-aging';

-- Link products to peptides
insert into product_peptides (product_id, peptide_id)
select p.id, pep.id from products p, peptides pep where p.slug = 'bpc-157-5mg' and pep.slug = 'bpc-157'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'bpc-157-10mg' and pep.slug = 'bpc-157'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'semaglutide-5mg' and pep.slug = 'semaglutide'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'ipamorelin-cjc-blend-10mg' and pep.slug = 'ipamorelin'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'ipamorelin-cjc-blend-10mg' and pep.slug = 'cjc-1295'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'melanotan-2-10mg' and pep.slug = 'melanotan-2'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'tb-500-5mg' and pep.slug = 'tb-500'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'selank-5mg' and pep.slug = 'selank'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'semax-5mg' and pep.slug = 'semax'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'pt-141-10mg' and pep.slug = 'pt-141'
union all
select p.id, pep.id from products p, peptides pep where p.slug = 'epitalon-10mg' and pep.slug = 'epitalon';

-- Shipping rates
insert into shipping_rates (courier, country, price, free_above, active) values
  ('econt', 'BG', 5.99, 99, true),
  ('speedy', 'BG', 6.49, 99, true),
  ('international', 'EU', 9.99, 149, true);

-- Bacteriostatic water as accessory
insert into products (slug, sku, name, name_bg, description_bg, description_en, price_bgn, price_eur, vial_size_mg, form, status, stock, weight_grams) values
  ('bac-water-10ml', 'PL-BAC10', 'Bacteriostatic Water 10ml', 'Бактериостатична вода 10ml', 'Стерилна бактериостатична вода, 10ml флакон. За реконституция.', 'Sterile bacteriostatic water, 10ml vial. For reconstitution.', 15.00, 7.90, null, 'accessory', 'published', 200, 30);

insert into product_categories (product_id, category_id)
select p.id, c.id from products p, categories c where p.slug = 'bac-water-10ml' and c.slug = 'accessories';
```

- [ ] **Step 2: Apply seed data via Supabase MCP**

Use `execute_sql` tool with the seed SQL.

- [ ] **Step 3: Verify data in Supabase dashboard**

Check: 10 categories, 20 peptides, 11 products (10 peptides + 1 accessory), product-category links, product-peptide links, 3 shipping rates.

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add seed data — categories, top 20 peptides, 11 products, shipping rates"
```

---

### Task 6: TypeScript types + data fetching utilities

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/queries.ts`

- [ ] **Step 1: Define TypeScript types matching DB schema**

Create `src/lib/types.ts`:

```typescript
export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  name_bg: string | null;
  description_bg: string | null;
  description_en: string | null;
  price_bgn: number;
  price_eur: number;
  images: string[];
  vial_size_mg: number | null;
  form: "lyophilized" | "solution" | "nasal_spray" | "capsule" | "accessory";
  purity_percent: number;
  molecular_weight: number | null;
  sequence: string | null;
  scientific_data: Record<string, any>;
  coa_url: string | null;
  is_bestseller: boolean;
  is_blend: boolean;
  status: "draft" | "published" | "out_of_stock" | "archived";
  stock: number;
  weight_grams: number | null;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  peptides?: Peptide[];
};

export type Category = {
  id: string;
  slug: string;
  name_bg: string;
  name_en: string;
  description_bg: string | null;
  description_en: string | null;
  icon: string | null;
  sort_order: number;
};

export type Peptide = {
  id: string;
  slug: string;
  name: string;
  full_name_bg: string | null;
  full_name_en: string | null;
  formula: string | null;
  mechanism_bg: string | null;
  mechanism_en: string | null;
  research_links: string[];
  image_url: string | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_method: "stripe" | "cod";
  total: number;
  currency: string;
  created_at: string;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};
```

- [ ] **Step 2: Create data fetching queries**

Create `src/lib/queries.ts`:

```typescript
import { createServerSupabase } from "./supabase/server";

export async function getCategories() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getBestsellers() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("is_bestseller", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return data ?? [];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*, product_categories(categories(*)), product_peptides(peptides(*))")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function getProductsByCategory(categorySlug: string) {
  const supabase = await createServerSupabase();
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();
  if (!category) return [];

  const { data } = await supabase
    .from("product_categories")
    .select("products(*)")
    .eq("category_id", category.id);

  return (data ?? [])
    .map((row: any) => row.products)
    .filter((p: any) => p.status === "published");
}

export async function getPeptideBySlug(slug: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("peptides")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getProductsForPeptide(peptideId: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("product_peptides")
    .select("products(*)")
    .eq("peptide_id", peptideId);
  return (data ?? [])
    .map((row: any) => row.products)
    .filter((p: any) => p.status === "published");
}
```

- [ ] **Step 3: Verify queries work**

Add a temporary test in `src/app/[locale]/page.tsx`:

```typescript
import { getCategories, getBestsellers } from "@/lib/queries";

export default async function HomePage() {
  const categories = await getCategories();
  const bestsellers = await getBestsellers();
  return (
    <main className="p-8">
      <pre className="text-sm">{JSON.stringify({ categories: categories.length, bestsellers: bestsellers.length }, null, 2)}</pre>
    </main>
  );
}
```

Run `npm run dev`, visit `/bg` — should show `{"categories": 10, "bestsellers": 7}`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/
git commit -m "feat: add TypeScript types and Supabase data fetching queries"
```

---

### Task 7: Zustand cart store

**Files:**
- Create: `src/lib/store/cart.ts`

- [ ] **Step 1: Create cart store with localStorage persistence**

Create `src/lib/store/cart.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: (currency: "BGN" | "EUR") => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: (currency) =>
        get().items.reduce(
          (sum, i) =>
            sum +
            (currency === "EUR" ? i.product.price_eur : i.product.price_bgn) *
              i.quantity,
          0
        ),
    }),
    { name: "peptidelab-cart" }
  )
);
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/store/
git commit -m "feat: add Zustand cart store with localStorage persistence"
```

---

**Plan 1 complete.** After executing these 7 tasks, you have:
- Next.js 15 project with TypeScript + Tailwind (clinical white theme)
- BG/EN i18n routing with next-intl
- Complete Supabase database schema (all 15 tables)
- Seed data: 10 categories, 20 peptides, 11 products, 3 shipping rates
- Type-safe data fetching utilities
- Cart store with localStorage persistence

**Next:** Plan 2 (Store Frontend) builds the UI on top of this foundation.
