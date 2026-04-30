#!/usr/bin/env node
/**
 * Batch generate category cover images via KIE.ai GPT Image-2 (text-to-image).
 *
 * Pipeline per category:
 *   1. Send unique editorial-photography prompt
 *   2. Poll task to completion
 *   3. Download generated PNG
 *   4. Upload to Supabase Storage product-images/categories/<slug>.png
 *
 * Common visual language for ALL 10 categories:
 *   — Warm cream / stone / linen palette (matches "дамско нежно" brand)
 *   — Soft natural window light, no harsh shadows
 *   — Editorial fine-art photography style, NOT illustration
 *   — Macro / close-up compositions, real textures
 *   — No people's faces, no text, no logos, no AI illustration look
 *   — 4:3 aspect ratio (slots into category card hero area)
 *
 * Usage:
 *   node scripts/generate-category-images.mjs              # all 10
 *   node scripts/generate-category-images.mjs --slug healing
 *   node scripts/generate-category-images.mjs --force      # regen even if exists
 */

import "dotenv/config";
import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

// Load .env.local manually (dotenv only reads .env by default)
const envText = await fs.readFile(".env.local", "utf-8");
for (const line of envText.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq < 0) continue;
  const key = trimmed.slice(0, eq);
  let val = trimmed.slice(eq + 1);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  if (!process.env[key]) process.env[key] = val;
}

const KIE_KEY = process.env.KIE_AI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!KIE_KEY) throw new Error("Missing KIE_AI_API_KEY");
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase env vars");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const args = process.argv.slice(2);
const argSlug = (() => {
  const i = args.indexOf("--slug");
  return i >= 0 ? args[i + 1] : null;
})();
const force = args.includes("--force");

// ---------- Common style preamble (kept short — KIE succeeds more often) ----------
const STYLE = [
  "Editorial fine-art macro photography.",
  "Soft warm natural window light.",
  "Cream linen and stone background.",
  "Muted palette of cream beige bone porcelain warm gold.",
  "Shallow depth of field.",
  "No text, no logos, no people, no faces.",
  "Clean minimal composition, 2026 wellness aesthetic.",
].join(" ");

// ---------- Per-category prompts ----------
const CATEGORIES = {
  healing: {
    name: "Healing & Recovery",
    prompt: `${STYLE} Macro close-up of fresh sage and aloe leaves on cream linen, single drop of clear serum on a leaf, copper-tinted morning sunlight. Conveys regeneration and skin recovery.`,
  },
  "weight-loss": {
    name: "Weight Loss",
    prompt: `${STYLE} Overhead minimalist still life: one ripe green pear, a coiled cloth measuring tape in soft beige, a single sprig of fresh rosemary, on a stone surface. Clean negative space. Conveys lightness and metabolism.`,
  },
  "gh-muscle": {
    name: "GH & Muscle",
    prompt: `${STYLE} Macro photograph of a single fresh whole egg balanced on a smooth river stone, beside a small ceramic dish of golden honey. Warm amber light. Conveys protein, growth, and natural strength.`,
  },
  "anti-aging": {
    name: "Anti-aging",
    prompt: `${STYLE} Extreme macro of a perfect dewdrop on a soft pink rose petal, real dew, gold-leaf flecks scattered on cream silk in background. Luminous and youthful.`,
  },
  nootropic: {
    name: "Nootropic",
    prompt: `${STYLE} Macro of a single open walnut on cream linen beside fresh blueberries and a sprig of rosemary, soft golden hour light. Conveys cognition, memory, focus.`,
  },
  "sexual-health": {
    name: "Sexual Health",
    prompt: `${STYLE} Macro still life of warm coral silk fabric draped softly, two ripe figs split open beside a single white orchid bloom. Sensual but clean and tasteful.`,
  },
  "hair-growth": {
    name: "Hair Growth",
    prompt: `${STYLE} Macro of a wooden boar-bristle brush on cream linen, beside a small glass dish of golden castor oil with a single dropper. Honey amber tones, luxurious.`,
  },
  immune: {
    name: "Immune",
    prompt: `${STYLE} Macro overhead of fresh sliced ginger root, lemon halves, a single garlic clove, and raw honey in a small ceramic bowl on cream linen. Warm soft light. Conveys protection and vitality.`,
  },
  blends: {
    name: "Blends",
    prompt: `${STYLE} Macro of three glass apothecary droppers in a row above cream linen, releasing a single golden, amber, and pearl droplet that converge into one luminous drop on a porcelain surface. Conveys synergy.`,
  },
  accessories: {
    name: "Accessories",
    prompt: `${STYLE} Minimalist clinical flat-lay: one clean glass syringe, two empty amber medical vials, soft cream linen napkin, single sprig of dried lavender. No labels visible. Soft window light, editorial pharmacy aesthetic.`,
  },
};

// ---------- KIE.ai client ----------
async function kieCreate(prompt) {
  const res = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KIE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-2-text-to-image",
      input: {
        prompt,
        aspect_ratio: "4:3",
        resolution: "1K",
      },
    }),
  });
  const json = await res.json();
  if (json.code !== 200) {
    throw new Error(`createTask failed: ${json.msg ?? json.code}`);
  }
  return json.data.taskId;
}

async function kiePoll(taskId, { timeoutMs = 5 * 60 * 1000 } = {}) {
  const startedAt = Date.now();
  let delay = 4000;
  while (Date.now() - startedAt < timeoutMs) {
    const res = await fetch(
      `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`,
      { headers: { Authorization: `Bearer ${KIE_KEY}` } }
    );
    const json = await res.json();
    const d = json.data;
    if (d.state === "success") {
      return JSON.parse(d.resultJson).resultUrls;
    }
    if (d.state === "fail") {
      throw new Error(`task failed: ${d.failMsg ?? d.failCode}`);
    }
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.3, 12000);
  }
  throw new Error(`task ${taskId} timed out`);
}

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadToStorage(slug, buffer) {
  const path = `categories/${slug}.png`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, buffer, {
      contentType: "image/png",
      upsert: true,
    });
  if (error) throw new Error(`upload failed: ${error.message}`);
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

async function existsInStorage(slug) {
  const { data, error } = await supabase.storage
    .from("product-images")
    .list("categories", { search: `${slug}.png` });
  if (error) return false;
  return data?.some((f) => f.name === `${slug}.png`) ?? false;
}

// ---------- Main ----------
async function main() {
  const slugs = argSlug
    ? [argSlug]
    : Object.keys(CATEGORIES);

  const target = [];
  for (const slug of slugs) {
    if (!CATEGORIES[slug]) {
      console.error(`Unknown category slug: ${slug}`);
      continue;
    }
    if (!force && (await existsInStorage(slug))) {
      console.log(`✓ ${slug} already exists, skipping (use --force to regen)`);
      continue;
    }
    target.push(slug);
  }

  console.log(`\nProcessing ${target.length}/${slugs.length} categories.\n`);

  let done = 0;
  let failed = 0;
  const startedAt = Date.now();

  for (const slug of target) {
    const cat = CATEGORIES[slug];
    console.log(`[${done + failed + 1}/${target.length}] ${slug} — ${cat.name}`);

    const MAX_ATTEMPTS = 8;
    let attempt = 0;
    while (attempt < MAX_ATTEMPTS) {
      attempt++;
      try {
        const t0 = Date.now();
        const taskId = await kieCreate(cat.prompt);
        const urls = await kiePoll(taskId);
        const buffer = await downloadBuffer(urls[0]);
        const publicUrl = await uploadToStorage(slug, buffer);

        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const attemptTag = attempt > 1 ? ` (attempt ${attempt})` : "";
        console.log(`  ✓ ${publicUrl} (${elapsed}s)${attemptTag}\n`);
        done++;
        break;
      } catch (err) {
        const isRetryable =
          /Internal Error|timed out|503|502|504|ECONN|fetch failed|network|EAI_AGAIN|ENOTFOUND|socket hang up/i.test(
            err.message
          );
        if (!isRetryable || attempt === MAX_ATTEMPTS) {
          console.error(`  ✗ ${err.message} (attempt ${attempt}/${MAX_ATTEMPTS})\n`);
          failed++;
          break;
        }
        const backoff = Math.min(15000 * Math.min(attempt, 4) * (attempt > 4 ? 2 : 1), 120000);
        console.log(`  … retrying in ${backoff / 1000}s (attempt ${attempt} failed: ${err.message})`);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  const totalMinutes = ((Date.now() - startedAt) / 60000).toFixed(1);
  console.log(`\nDone: ${done} succeeded, ${failed} failed in ${totalMinutes} min.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
