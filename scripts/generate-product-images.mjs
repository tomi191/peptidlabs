#!/usr/bin/env node
/**
 * Batch generate product images via KIE.ai GPT Image-2.
 *
 * Pipeline per product:
 *   1. Pick master template (powder for lyophilized, liquid for solution)
 *   2. Image-to-image swap with peptide-specific label
 *   3. Wait for result (poll)
 *   4. Download generated PNG
 *   5. Upload to Supabase Storage product-images/products/<slug>.png
 *   6. UPDATE products SET images = ARRAY['<public_url>'] WHERE slug = ?
 *
 * Usage:
 *   node scripts/generate-product-images.mjs              # all missing images
 *   node scripts/generate-product-images.mjs --limit 5    # pilot batch
 *   node scripts/generate-product-images.mjs --slug bpc-157-5mg   # single
 *   node scripts/generate-product-images.mjs --force      # regen even if exists
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
  // Strip surrounding quotes if present
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

const MASTERS = {
  powder: `${SUPABASE_URL}/storage/v1/object/public/product-images/masters/powder.png`,
  liquid: `${SUPABASE_URL}/storage/v1/object/public/product-images/masters/liquid.png`,
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ---------- CLI args ----------
const args = process.argv.slice(2);
const argLimit = (() => {
  const i = args.indexOf("--limit");
  return i >= 0 ? parseInt(args[i + 1], 10) : null;
})();
const argSlug = (() => {
  const i = args.indexOf("--slug");
  return i >= 0 ? args[i + 1] : null;
})();
const force = args.includes("--force");

// ---------- Classify product into master template ----------
function pickMaster(product) {
  if (product.form === "solution") return "liquid";
  // capsule, lyophilized, nasal_spray → all show as powder vial for now
  return "powder";
}

// ---------- KIE.ai client ----------
async function kieCreate(masterUrl, prompt) {
  const res = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KIE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-2-image-to-image",
      input: {
        prompt,
        input_urls: [masterUrl],
        aspect_ratio: "3:4",
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

// ---------- Build prompt for each product ----------
function buildPrompt(product) {
  const dose = product.vial_size_mg
    ? `${Math.round(product.vial_size_mg)}mg`
    : product.form === "solution"
      ? "5ml"
      : "";
  const batch = `BATCH-2026-${String(
    Math.floor(Math.random() * 999) + 100
  )}`;
  return [
    `Keep this exact pharmaceutical vial photo identical: same glass, same contents (${product.form === "solution" ? "clear liquid" : "white lyophilized powder"}), same aluminum crimp cap, same studio lighting, same shadow, same clean white background, same 3:4 aspect ratio.`,
    `ONLY modify the label text on the vial.`,
    `Replace the large peptide name in the middle of the label with: "${product.name}"`,
    dose ? `Replace the dose text with: "${dose}"` : "",
    `Replace the batch number at bottom with: "${batch}"`,
    `Keep all other label design elements unchanged: navy blue label background (#0f172a), PEPTIDLABS branding at top in monospace font, teal accent line, HPLC over 99% purity badge in corner.`,
    `All text must be crisp, perfectly legible, properly aligned and centered on the curved vial surface.`,
    `Do not change vial shape, do not change cap, do not change background, do not change lighting.`,
  ]
    .filter(Boolean)
    .join(" ");
}

// ---------- Download + upload ----------
async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadToStorage(slug, buffer) {
  const path = `products/${slug}.png`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, buffer, {
      contentType: "image/png",
      upsert: true,
    });
  if (error) throw new Error(`upload failed: ${error.message}`);
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

// ---------- Main ----------
async function main() {
  let query = supabase
    .from("products")
    .select("slug, name, name_bg, vial_size_mg, form, images")
    .eq("status", "published")
    .neq("form", "accessory")
    .order("slug");

  if (argSlug) query = query.eq("slug", argSlug);

  const { data: products, error } = await query;
  if (error) throw error;

  // Filter out products that already have images unless --force
  const needWork = force
    ? products
    : products.filter((p) => !p.images || p.images.length === 0);

  const target = argLimit ? needWork.slice(0, argLimit) : needWork;
  console.log(
    `Found ${products.length} products, ${needWork.length} need images, processing ${target.length}.\n`
  );

  let done = 0;
  let failed = 0;
  const startedAt = Date.now();

  for (const product of target) {
    const masterKey = pickMaster(product);
    const masterUrl = MASTERS[masterKey];
    const prompt = buildPrompt(product);

    console.log(`[${done + failed + 1}/${target.length}] ${product.slug} (${masterKey})`);

    const MAX_ATTEMPTS = 4;
    let attempt = 0;
    let lastError = null;
    while (attempt < MAX_ATTEMPTS) {
      attempt++;
      try {
        const t0 = Date.now();
        const taskId = await kieCreate(masterUrl, prompt);
        const urls = await kiePoll(taskId);
        const buffer = await downloadBuffer(urls[0]);
        const publicUrl = await uploadToStorage(product.slug, buffer);
        const { error: updateErr } = await supabase
          .from("products")
          .update({ images: [publicUrl] })
          .eq("slug", product.slug);
        if (updateErr) throw new Error(`db update: ${updateErr.message}`);

        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const attemptTag = attempt > 1 ? ` (attempt ${attempt})` : "";
        console.log(`  ✓ ${publicUrl} (${elapsed}s)${attemptTag}\n`);
        done++;
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        const isRetryable = /Internal Error|timed out|503|502|504|ECONN/i.test(
          err.message
        );
        if (!isRetryable || attempt === MAX_ATTEMPTS) {
          console.error(`  ✗ ${err.message} (attempt ${attempt}/${MAX_ATTEMPTS})\n`);
          failed++;
          break;
        }
        const backoff = Math.min(15000 * attempt, 60000);
        console.log(`  … retrying in ${backoff / 1000}s (attempt ${attempt} failed: ${err.message})`);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }

    // Polite throttle between products
    await new Promise((r) => setTimeout(r, 2000));
  }

  const totalMinutes = ((Date.now() - startedAt) / 60000).toFixed(1);
  console.log(
    `\nDone: ${done} succeeded, ${failed} failed in ${totalMinutes} min.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
