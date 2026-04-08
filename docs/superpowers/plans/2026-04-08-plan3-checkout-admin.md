# Plan 3: Checkout + Admin

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build checkout flow (Stripe + COD), order management, and admin dashboard. Stripe code ready but functional only when keys are added.

**Architecture:** Checkout page with form validation, Stripe Checkout Session via API route, COD flow with order creation, admin routes protected by Supabase Auth RLS.

**Tech Stack:** Next.js 16, Stripe (@stripe/stripe-js + stripe), Supabase Auth, Zustand

**Spec:** `docs/superpowers/specs/2026-04-07-peptidelab-design.md`

---

### Task 1: Checkout page — form + payment method selection
### Task 2: COD order flow (API route + confirmation)
### Task 3: Stripe checkout (API route + webhook + success page)  
### Task 4: Order confirmation + tracking page
### Task 5: Admin dashboard — orders list + status management
### Task 6: Admin — products CRUD
### Task 7: SEO (sitemap, robots.txt, meta)
