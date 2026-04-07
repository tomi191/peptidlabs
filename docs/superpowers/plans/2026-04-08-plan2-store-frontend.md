# Plan 2: Store Frontend

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete store frontend — header, homepage, category pages, product page, cart drawer — all responsive, full-width, i18n-aware, using live Supabase data.

**Architecture:** Server Components fetch data, Client Components handle interactivity (cart, filters). Lucide React for icons. Full-width fluid layout. Mobile-first responsive. NO AI SLOP. NO emoji as icons.

**Tech Stack:** Next.js 16 App Router, Tailwind v4, next-intl, Supabase, Zustand, lucide-react

**Spec:** `docs/superpowers/specs/2026-04-07-peptidelab-design.md`
**Design reference:** `.superpowers/brainstorm/8004-1775583599/hybrid-v2.html`
**Foundation:** Plan 1 complete — types in `src/lib/types.ts`, queries in `src/lib/queries.ts`, cart in `src/lib/store/cart.ts`

**Design tokens (Tailwind v4, defined in globals.css):**
- `bg-white` / `bg-surface` / `bg-accent-tint`
- `text-navy` / `text-secondary` / `text-muted`
- `text-accent` (teal — only for category labels, COA badges, cart badge)
- `border-border` / `border-accent-border`
- `font-sans` (Inter) / `font-mono` (JetBrains Mono)
- CTA buttons: `bg-navy text-white` (NOT teal)

**Existing i18n keys:** `nav.shop`, `nav.encyclopedia`, `nav.blog`, `nav.about`, `common.addToCart`, `common.viewAll`, `common.bestsellers`, `common.freeShipping`, `common.hplcTested`, `common.researchOnly`, `common.coaIncluded`, `hero.tag`, `hero.title`, `hero.subtitle`, `hero.browsePeptides`, `hero.viewCoa`

---

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          — top bar + nav + cart icon (Server + Client parts)
│   │   ├── Footer.tsx          — disclaimer + links + newsletter
│   │   └── CartDrawer.tsx      — side drawer cart (Client Component)
│   ├── product/
│   │   ├── ProductCard.tsx     — card for grid display
│   │   ├── ProductGrid.tsx     — responsive grid wrapper
│   │   └── QuickSpecBar.tsx    — purity | mg | form | MW inline bar
│   ├── home/
│   │   ├── HeroSection.tsx     — asymmetric hero (text left, stats right)
│   │   ├── CategoryGrid.tsx    — 5-col category cards with Lucide icons
│   │   ├── BestsellersSection.tsx — bestseller products
│   │   └── TrustBar.tsx        — HPLC, COA, Shipping, Payment
│   └── ui/
│       ├── AddToCartButton.tsx — client component, uses cart store
│       └── LocaleSwitch.tsx   — BG/EN language toggle
├── app/[locale]/
│   ├── page.tsx               — homepage (modify existing)
│   ├── shop/
│   │   ├── page.tsx           — all products
│   │   └── [category]/
│   │       └── page.tsx       — products filtered by category
│   └── products/
│       └── [slug]/
│           └── page.tsx       — single product page with tabs
```

---

### Task 1: Header component

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/ui/LocaleSwitch.tsx`
- Modify: `src/app/[locale]/layout.tsx` — add Header
- Modify: `src/messages/bg.json` + `src/messages/en.json` — add missing keys

- [ ] **Step 1: Add i18n keys for header**

Add to both `bg.json` and `en.json`:
```json
"header": {
  "freeShipping": "Безплатна доставка над 99 лв" / "Free shipping over €49",
  "allTested": "Всички пептиди HPLC тествани ≥98%" / "All peptides HPLC tested ≥98%"
}
```

- [ ] **Step 2: Create LocaleSwitch component**

Create `src/components/ui/LocaleSwitch.tsx` — Client Component:
- Two buttons "BG" / "EN" in a pill toggle
- Uses `useRouter` and `usePathname` from next-intl
- Active state: `bg-white text-navy shadow-sm`, inactive: `text-muted`
- Compact: fits in top bar

- [ ] **Step 3: Create Header component**

Create `src/components/layout/Header.tsx`:
- **Top bar**: left = free shipping text, right = LocaleSwitch + currency
- **Main nav**: left = logo mark (navy square with "P") + "PEPTIDELAB" text, center = nav links (Shop, Encyclopedia, Blog, About), right = icons (Search, Heart, User, ShoppingBag with cart badge)
- Lucide icons: `Search`, `Heart`, `User`, `ShoppingBag` from lucide-react
- Cart badge: teal circle with item count from `useCart().totalItems()`
- Full-width, `border-b border-border` separators
- Mobile: hamburger menu (Lucide `Menu` icon), nav links hidden below 1024px
- Cart icon is a Client Component island, rest is Server Component

- [ ] **Step 4: Add Header to locale layout**

Modify `src/app/[locale]/layout.tsx` to include `<Header />` above `{children}`.

- [ ] **Step 5: Verify in browser**

Visit localhost:3000/bg — header should show with nav, icons, locale switch. Visit /en — should switch language.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Header.tsx src/components/ui/LocaleSwitch.tsx src/app/[locale]/layout.tsx src/messages/
git commit -m "feat: add responsive header with nav, Lucide icons, locale switch"
```

---

### Task 2: Footer component

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/[locale]/layout.tsx` — add Footer
- Modify: `src/messages/bg.json` + `en.json` — add footer keys

- [ ] **Step 1: Add i18n keys for footer**

Footer sections: "Research Peptides", quick links (Shop, Encyclopedia, Blog, About), info links (Delivery, Returns, FAQ, Contact), disclaimer text.

- [ ] **Step 2: Create Footer component**

Create `src/components/layout/Footer.tsx`:
- Full-width, `bg-surface border-t border-border`
- 4-column grid (mobile: stack): Logo+description, Shop links, Info links, Contact
- Bottom bar: disclaimer "All products are sold strictly for research purposes only. Not for human consumption." + copyright
- All text uses `text-secondary` / `text-muted`, links hover to `text-navy`

- [ ] **Step 3: Add Footer to locale layout**

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.tsx src/app/[locale]/layout.tsx src/messages/
git commit -m "feat: add footer with disclaimer and navigation"
```

---

### Task 3: Homepage — Hero + Categories + Bestsellers + Trust

**Files:**
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/CategoryGrid.tsx`
- Create: `src/components/home/BestsellersSection.tsx`
- Create: `src/components/home/TrustBar.tsx`
- Create: `src/components/product/ProductCard.tsx`
- Create: `src/components/product/ProductGrid.tsx`
- Create: `src/components/ui/AddToCartButton.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Create AddToCartButton (Client Component)**

```tsx
"use client";
// Uses useCart().addItem(product)
// Navy bg, Plus icon from Lucide, 32x32px square button
```

- [ ] **Step 2: Create ProductCard component**

Each card shows:
- Product image area (placeholder `bg-surface` with vial shape div)
- COA badge top-right: `ShieldCheck` icon + "COA" text in accent-tint
- Category label in `text-accent uppercase text-[10px] font-semibold`
- Product name in `text-navy font-semibold`
- Specs in `font-mono text-muted text-[11px]`: "5mg · lyophilized · ≥99%"
- Footer: price left (`text-navy font-bold`), AddToCartButton right
- Card: `border border-border rounded-lg hover:shadow-md transition-shadow`

- [ ] **Step 3: Create ProductGrid**

Responsive grid wrapper: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`

- [ ] **Step 4: Create HeroSection**

Asymmetric layout — NOT centered AI slop:
- Left (60%): tag line, h1, subtitle, two CTA buttons
- Right (40%): stats card with `bg-surface` — "65+" peptides, "≥98%" purity, "1-3d" delivery
- Lucide icons in buttons: `FlaskConical` for browse, `FileCheck` for COA
- h1: `text-3xl md:text-4xl font-bold text-navy`
- Primary CTA: `bg-navy text-white rounded-lg` (NOT teal, NOT rounded-full)
- Secondary CTA: `border border-border text-navy rounded-lg`
- Full-width, `py-14 md:py-20`

- [ ] **Step 5: Create CategoryGrid**

- 5 columns desktop, 2 mobile, 3 tablet
- Each card: icon area (Lucide icon in `bg-surface` rounded square) + category name + peptide count
- Map Lucide icons from category.icon field: activity→Activity, scale→Scale, dumbbell→Dumbbell, brain→Brain, hourglass→Hourglass, flame→Flame, scissors→Scissors, shield→Shield, layers→Layers, package→Package
- Links to `/[locale]/shop/[category-slug]`

- [ ] **Step 6: Create BestsellersSection**

- Section title "Bestsellers" + "View all →" link
- ProductGrid with bestseller products from `getBestsellers()`
- Server Component, fetches data at build time

- [ ] **Step 7: Create TrustBar**

- 4-column grid, `bg-surface` background
- Items: FlaskConical "HPLC Verified" "≥98% purity", FileCheck "COA Included" "Every batch tested", Truck "EU Shipping" "1-3 days BG, 3-7 EU", Lock "Secure Payment" "Stripe + COD"
- Icons in `text-secondary`, titles in `text-navy font-semibold text-xs`, subtitles in `text-muted text-xs`

- [ ] **Step 8: Assemble homepage**

Modify `src/app/[locale]/page.tsx`:
```tsx
export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const categories = await getCategories();
  const bestsellers = await getBestsellers();
  return (
    <main className="w-full">
      <HeroSection />
      <CategoryGrid categories={categories} locale={locale} />
      <BestsellersSection products={bestsellers} locale={locale} />
      <TrustBar />
    </main>
  );
}
```

- [ ] **Step 9: Verify homepage in browser**

localhost:3000/bg — should show full homepage with real data from Supabase.

- [ ] **Step 10: Commit**

```bash
git add src/components/ src/app/[locale]/page.tsx
git commit -m "feat: build homepage — hero, categories, bestsellers, trust bar"
```

---

### Task 4: Shop pages — all products + category filter

**Files:**
- Create: `src/app/[locale]/shop/page.tsx`
- Create: `src/app/[locale]/shop/[category]/page.tsx`

- [ ] **Step 1: Create shop index page**

`src/app/[locale]/shop/page.tsx`:
- Fetch all categories + all published products
- Left sidebar (desktop): category list as filter links, active category highlighted
- Right content: ProductGrid with products
- Mobile: categories as horizontal scroll chips above products
- Page title "Shop" / "Магазин"

- [ ] **Step 2: Create category page**

`src/app/[locale]/shop/[category]/page.tsx`:
- `generateStaticParams` from all category slugs × locales
- Fetch category by slug + products for that category
- Same layout as shop index but filtered
- Breadcrumb: Home > Shop > [Category Name]
- Category name + description at top

- [ ] **Step 3: Add shop link from nav**

Verify Header "Shop" link points to `/[locale]/shop`.

- [ ] **Step 4: Verify in browser**

- localhost:3000/bg/shop — all products
- localhost:3000/bg/shop/healing — BPC-157 products only
- localhost:3000/bg/shop/nootropic — Selank, Semax

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/shop/
git commit -m "feat: add shop pages with category filtering"
```

---

### Task 5: Product detail page with tabs

**Files:**
- Create: `src/app/[locale]/products/[slug]/page.tsx`
- Create: `src/components/product/ProductTabs.tsx` (Client Component)
- Create: `src/components/product/QuickSpecBar.tsx`

- [ ] **Step 1: Create QuickSpecBar**

Inline bar under product name: Purity | Vial Size | Form | MW
- `font-mono text-xs text-muted` with `|` separators
- Shows: "≥99%" | "5mg" | "Lyophilized" | "MW: 1419.5"

- [ ] **Step 2: Create ProductTabs (Client Component)**

Three tabs: Overview / Science / COA
- Tab buttons: `border-b-2` active state with `border-navy text-navy`, inactive `text-muted`
- **Overview tab**: product description (locale-aware), research applications
- **Science tab**: molecular formula (mono font), mechanism, PubMed links, half-life, stacking notes — all from `scientific_data` JSON
- **COA tab**: if `coa_url` exists → link to download PDF. Otherwise placeholder "COA available upon request"

- [ ] **Step 3: Create product detail page**

`src/app/[locale]/products/[slug]/page.tsx`:
- `generateStaticParams` from all product slugs × locales
- Left: product image area (placeholder vial)
- Right: Category badge, Product name (large), QuickSpecBar, Price, AddToCartButton (full-width on mobile), disclaimer text
- Below: ProductTabs
- Related products section at bottom (same category)
- Breadcrumb: Home > Shop > [Category] > [Product]
- SEO: dynamic metadata with product name, description, JSON-LD Product schema

- [ ] **Step 4: Link ProductCards to product page**

Make ProductCard a `Link` to `/[locale]/products/[slug]`.

- [ ] **Step 5: Verify in browser**

- localhost:3000/bg/products/bpc-157-5mg — full product page
- Click tabs, verify data loads
- Click Add to Cart, verify cart count in header updates

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/products/ src/components/product/
git commit -m "feat: add product detail page with tabs (overview, science, COA)"
```

---

### Task 6: Cart drawer

**Files:**
- Create: `src/components/layout/CartDrawer.tsx`
- Modify: `src/components/layout/Header.tsx` — wire cart icon to open drawer

- [ ] **Step 1: Create CartDrawer (Client Component)**

Side drawer sliding from right:
- Overlay: `bg-black/30` fixed inset-0
- Drawer: `bg-white w-full max-w-md` fixed right-0 top-0 bottom-0
- Header: "Cart" title + close button (Lucide `X`)
- Item list: product name, specs (mono), quantity +/- controls, price, remove button (Lucide `Trash2`)
- Footer: subtotal, shipping note ("Free shipping over 99 лв"), checkout button (`bg-navy text-white w-full`)
- Empty state: "Your cart is empty" with link to shop
- Uses `useCart()` store for all data and actions
- Currency-aware: show BGN or EUR based on locale

- [ ] **Step 2: Wire cart icon in Header**

Cart icon click → toggle CartDrawer open state. Use local state or a Zustand store boolean.

- [ ] **Step 3: Verify full flow**

- Browse products, click Add to Cart on multiple products
- Cart badge updates in header
- Click cart icon → drawer opens with correct items
- Change quantity, remove items
- Close drawer
- Refresh page — cart persists (localStorage)

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/CartDrawer.tsx src/components/layout/Header.tsx
git commit -m "feat: add cart drawer with quantity controls and persistence"
```

---

### Task 7: Responsive polish + WhatsApp button

**Files:**
- Create: `src/components/ui/WhatsAppButton.tsx`
- Modify: various components for mobile polish

- [ ] **Step 1: Create WhatsApp floating button**

Fixed bottom-right, `bg-[#25D366] text-white` circle, Lucide `MessageCircle` icon (or custom WhatsApp SVG). Links to `https://wa.me/YOUR_NUMBER`. Hidden on desktop if preferred, or small.

- [ ] **Step 2: Mobile responsive audit**

Check each page at 375px width:
- Header: hamburger menu works, nav links in mobile menu
- Homepage: hero stacks vertically, categories 2-col, products 1-col
- Shop: categories as horizontal scroll, products 1-col then 2-col
- Product page: image full-width above details, tabs work
- Cart drawer: full-width on mobile
- Footer: single column stack

- [ ] **Step 3: Add to locale layout**

Add WhatsAppButton to layout.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/WhatsAppButton.tsx
git commit -m "feat: add WhatsApp button and mobile responsive polish"
```

---

**Plan 2 complete.** After executing these 7 tasks:
- Full responsive header with Lucide icons + locale switch
- Footer with disclaimer
- Homepage: asymmetric hero, category grid, bestsellers, trust bar
- Shop with category filtering
- Product detail page with 3 tabs
- Cart drawer with persistence
- WhatsApp floating button
- All pages full-width, mobile-first, using real Supabase data

**Next:** Plan 3 (Checkout + Admin) adds Stripe, COD flow, order management, and admin dashboard.
