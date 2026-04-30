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
  "Premium editorial fitness and wellness photography, 2026 magazine quality.",
  "Real athletic person, professional model, fit body, healthy skin.",
  "Modern bright gym, clinic, or studio interior, soft cool natural light, cinematic depth.",
  "Sharp focus on subject, slightly blurred background.",
  "No text, no logos, no watermarks.",
  "Confident wellness aesthetic — looks like a Nike, Lululemon, or premium peptide brand campaign.",
].join(" ");

// ---------- Per-category prompts ----------
const CATEGORIES = {
  healing: {
    name: "Healing & Recovery",
    prompt: `${STYLE} Athletic woman in light grey activewear on a yoga mat in a bright recovery studio, gently massaging her shoulder with focused calm expression, soft window light, plants in background. Conveys recovery, healing, regeneration.`,
  },
  "weight-loss": {
    name: "Weight Loss",
    prompt: `${STYLE} Slim athletic woman in black sports bra and leggings, mid-30s, lean toned body, side profile in a bright minimalist gym, holding a white shaker bottle, natural daylight. Conveys metabolism and lean physique.`,
  },
  "gh-muscle": {
    name: "GH & Muscle",
    prompt: `${STYLE} Muscular man in his 30s, defined back and shoulders, performing a dumbbell row in a modern dark concrete gym, dramatic side lighting highlighting muscle definition, focused intensity. Conveys strength and growth.`,
  },
  "anti-aging": {
    name: "Anti-aging",
    prompt: `${STYLE} Beautiful woman in her 40s, glowing healthy luminous skin, no wrinkles, natural makeup, soft smile, looking off-camera, premium skincare campaign aesthetic, bright airy studio light, cream background. Conveys youth and skin regeneration.`,
  },
  nootropic: {
    name: "Nootropic",
    prompt: `${STYLE} Sharp focused man in his 30s working at a sleek desk with laptop in a modern bright office, intense concentration, clean minimal workspace, daylight from large windows. Conveys cognitive focus and mental clarity.`,
  },
  "sexual-health": {
    name: "Sexual Health",
    prompt: `${STYLE} Confident athletic couple in their 30s, both fit and toned, side embrace silhouette in soft warm bedroom light, tasteful and intimate, cream linen sheets, no nudity, premium lifestyle aesthetic. Conveys vitality and intimacy.`,
  },
  "hair-growth": {
    name: "Hair Growth",
    prompt: `${STYLE} Beautiful woman with long thick healthy shiny dark hair, back of her head and hair flowing, salon quality, soft studio lighting catching individual strands, premium hair-care campaign style. Conveys hair growth and density.`,
  },
  immune: {
    name: "Immune",
    prompt: `${STYLE} Healthy energetic woman in her 30s in white t-shirt, bright sunlight on her face, eyes closed, deep breath, peaceful confident expression, outdoor garden setting, vibrant glowing skin. Conveys vitality and immune strength.`,
  },
  blends: {
    name: "Blends",
    prompt: `${STYLE} Professional woman scientist in her 30s wearing white lab coat, holding two clear glass vials side by side comparing them, focused expression, modern bright laboratory, soft daylight, clinical aesthetic. Conveys peptide synergy and clinical research.`,
  },
  accessories: {
    name: "Accessories",
    prompt: `${STYLE} Close-up of professional hands wearing white nitrile gloves holding a clear glass syringe and amber medical vial, drawing liquid in a clinical setting, sharp focus on the syringe, blurred clinical background. Conveys precise clinical research equipment.`,
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
