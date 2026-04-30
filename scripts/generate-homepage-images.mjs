#!/usr/bin/env node
/**
 * Batch generate homepage images via KIE.ai GPT Image-2 (text-to-image).
 *
 * Generates:
 *   - 1 hero portrait                 → hero/portrait.png         (3:4)
 *   - 3 blog cover images             → blog/<slug>.png            (16:9)
 *   - 3 testimonial avatar headshots  → testimonials/<key>.png     (1:1)
 *   - 3 GLP-1 variant background      → glp1/<id>.png              (1:1)
 *   - 1 newsletter banner background  → newsletter/banner.png      (21:9 → 16:9)
 *
 * All upload to product-images/<path>.png in Supabase Storage.
 *
 * Usage:
 *   node scripts/generate-homepage-images.mjs               # all missing
 *   node scripts/generate-homepage-images.mjs --only blog   # one bucket only
 *   node scripts/generate-homepage-images.mjs --force       # regen even if exists
 */

import "dotenv/config";
import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

// Load .env.local manually
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
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw new Error("Missing Supabase env vars");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const args = process.argv.slice(2);
const argOnly = (() => {
  const i = args.indexOf("--only");
  return i >= 0 ? args[i + 1] : null;
})();
const force = args.includes("--force");

// ---------- Style preamble (consistent with category images) ----------
const STYLE = [
  "Premium editorial fitness wellness clinical photography, 2026 magazine quality.",
  "Real athletic person, professional model, healthy skin, confident presence.",
  "Modern bright gym, clinic, lab, or studio interior, soft cool natural light, cinematic depth.",
  "Sharp focus on subject, slightly blurred background.",
  "No text, no logos, no watermarks.",
  "Premium peptide research brand campaign aesthetic — Nike Lululemon or clinical pharma campaign feel.",
].join(" ");

// ---------- Image jobs ----------
const JOBS = [
  // ─── HERO ───
  {
    bucket: "hero",
    key: "portrait",
    aspect: "3:4",
    prompt: `${STYLE} Vertical 3:4 portrait of an athletic woman in her early 30s, confident calm expression, looking off-camera slightly, holding a small clear glass research vial in her hand, wearing a fitted heather-grey athletic top, modern bright wellness clinic with subtle teal and navy accents in background, soft window light from left, premium pharma campaign hero shot.`,
  },

  // ─── BLOG COVERS (3) ───
  {
    bucket: "blog",
    key: "bpc-157-guide",
    aspect: "16:9",
    prompt: `${STYLE} 16:9 horizontal cover image. Athletic woman in her 30s on a modern gym mat, gently massaging her shoulder with focused calm expression, recovery yoga studio with plants, warm natural light from large window, conveys tissue healing and recovery science. Cinematic editorial composition.`,
  },
  {
    bucket: "blog",
    key: "semaglutide-vs-tirzepatide",
    aspect: "16:9",
    prompt: `${STYLE} 16:9 horizontal cover image. Two clear glass medical vials side by side on a clean white clinical lab counter, one with a teal-tinted liquid one with a navy-blue tinted liquid, soft cool laboratory lighting, blurred microscope and lab equipment in background. Conveys scientific peptide comparison.`,
  },
  {
    bucket: "blog",
    key: "peptide-beginners-guide",
    aspect: "16:9",
    prompt: `${STYLE} 16:9 horizontal cover image. Top-down flat-lay of an open scientific notebook with handwritten molecular structures, a clean glass vial, a fountain pen, on a soft white linen surface, golden morning light. Welcoming and educational, conveys peptide research learning.`,
  },

  // ─── TESTIMONIAL AVATARS (3) — square 1:1 close-ups ───
  {
    bucket: "testimonials",
    key: "author1",
    aspect: "1:1",
    prompt: `${STYLE} 1:1 square close-up portrait headshot of a male research scientist in his late 30s, wearing a clean white lab coat over a navy shirt, warm confident slight smile, sharp eyes, soft natural light from a large lab window, blurred modern laboratory in background. Premium credible expert portrait.`,
  },
  {
    bucket: "testimonials",
    key: "author2",
    aspect: "1:1",
    prompt: `${STYLE} 1:1 square close-up portrait headshot of a fit athletic woman in her early 30s, post-workout glow, confident genuine smile, wearing a black sports tank top, soft natural light, blurred modern gym interior in background. Healthy active wellness portrait.`,
  },
  {
    bucket: "testimonials",
    key: "author3",
    aspect: "1:1",
    prompt: `${STYLE} 1:1 square close-up portrait headshot of a man in his 40s with light stubble, warm confident expression looking straight at camera, wearing a charcoal grey t-shirt, soft natural light, blurred warm modern interior in background. Mature lifestyle wellness portrait.`,
  },

  // ─── GLP-1 VARIANT BACKGROUNDS (3) — 1:1, ambient ───
  {
    bucket: "glp1",
    key: "semaglutide",
    aspect: "1:1",
    prompt: `${STYLE} 1:1 square. Single clear glass medical vial filled with translucent teal-tinted liquid, dramatic side lighting, deep navy out-of-focus background with subtle teal bokeh, no labels, premium clinical macro composition. Conveys first-generation GLP-1 peptide.`,
  },
  {
    bucket: "glp1",
    key: "tirzepatide",
    aspect: "1:1",
    prompt: `${STYLE} 1:1 square. Single clear glass medical vial with translucent navy-blue tinted liquid, dramatic top-down lighting, deep dark navy out-of-focus background with cool steel bokeh, no labels, premium clinical macro composition. Conveys advanced second-generation peptide.`,
  },
  {
    bucket: "glp1",
    key: "retatrutide",
    aspect: "1:1",
    prompt: `${STYLE} 1:1 square. Single clear glass medical vial with translucent purple-violet tinted liquid, dramatic side rim lighting, deep dark purple out-of-focus background with subtle violet bokeh, no labels, premium experimental clinical macro composition. Conveys cutting-edge experimental triple-agonist peptide.`,
  },

  // ─── NEWSLETTER BACKGROUND ───
  {
    bucket: "newsletter",
    key: "banner",
    aspect: "16:9",
    prompt: `${STYLE} 16:9 horizontal banner. Peaceful empty modern peptide research lab interior at dawn, soft sunbeams streaming through large windows hitting empty stainless steel benches and glass beakers, warm-cool color contrast, no people, cinematic atmospheric depth. Inspires trust and quiet professionalism.`,
  },
];

// ---------- KIE.ai client ----------
async function kieCreate(prompt, aspect) {
  const res = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KIE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-2-text-to-image",
      input: { prompt, aspect_ratio: aspect, resolution: "1K" },
    }),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(`createTask failed: ${json.msg ?? json.code}`);
  return json.data.taskId;
}

async function kiePoll(taskId, { timeoutMs = 5 * 60 * 1000 } = {}) {
  const startedAt = Date.now();
  let delay = 4000;
  while (Date.now() - startedAt < timeoutMs) {
    const res = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${KIE_KEY}` },
    });
    const json = await res.json();
    const d = json.data;
    if (d.state === "success") return JSON.parse(d.resultJson).resultUrls;
    if (d.state === "fail") throw new Error(`task failed: ${d.failMsg ?? d.failCode}`);
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

async function uploadToStorage(bucket, key, buffer) {
  const path = `${bucket}/${key}.png`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, buffer, { contentType: "image/png", upsert: true });
  if (error) throw new Error(`upload failed: ${error.message}`);
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

async function existsInStorage(bucket, key) {
  const { data } = await supabase.storage
    .from("product-images")
    .list(bucket, { search: `${key}.png` });
  return data?.some((f) => f.name === `${key}.png`) ?? false;
}

// ---------- Main ----------
async function main() {
  let target = JOBS;
  if (argOnly) target = JOBS.filter((j) => j.bucket === argOnly);

  if (!force) {
    const filtered = [];
    for (const j of target) {
      if (await existsInStorage(j.bucket, j.key)) {
        console.log(`✓ ${j.bucket}/${j.key} exists, skipping`);
      } else {
        filtered.push(j);
      }
    }
    target = filtered;
  }

  console.log(`\nProcessing ${target.length}/${JOBS.length} images.\n`);

  let done = 0;
  let failed = 0;
  const startedAt = Date.now();

  for (const job of target) {
    const label = `${job.bucket}/${job.key} [${job.aspect}]`;
    console.log(`[${done + failed + 1}/${target.length}] ${label}`);

    const MAX_ATTEMPTS = 8;
    let attempt = 0;
    while (attempt < MAX_ATTEMPTS) {
      attempt++;
      try {
        const t0 = Date.now();
        const taskId = await kieCreate(job.prompt, job.aspect);
        const urls = await kiePoll(taskId);
        const buffer = await downloadBuffer(urls[0]);
        const publicUrl = await uploadToStorage(job.bucket, job.key, buffer);
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const tag = attempt > 1 ? ` (attempt ${attempt})` : "";
        console.log(`  ✓ ${publicUrl} (${elapsed}s)${tag}\n`);
        done++;
        break;
      } catch (err) {
        const isRetryable =
          /Internal Error|timed out|503|502|504|ECONN|fetch failed|network|EAI_AGAIN|ENOTFOUND|socket hang up/i.test(
            err.message
          );
        if (!isRetryable || attempt === MAX_ATTEMPTS) {
          console.error(`  ✗ ${err.message}\n`);
          failed++;
          break;
        }
        const backoff = Math.min(15000 * Math.min(attempt, 4) * (attempt > 4 ? 2 : 1), 120000);
        console.log(`  … retrying in ${backoff / 1000}s (${err.message})`);
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
