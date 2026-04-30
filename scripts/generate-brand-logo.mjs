#!/usr/bin/env node
/**
 * Generate PeptidLabs brand mark via KIE.ai GPT Image-2.
 *
 * Two variants:
 *   - mark      → single clean icon, no text, on white      (1:1)
 *   - lockup    → full mark + PEPTIDLABS wordmark           (1:1)
 *
 * Match the clinical pharma vial aesthetic (navy + teal + white).
 *
 * Upload to product-images/brand/<key>.png in Supabase Storage.
 *
 * Usage:
 *   node scripts/generate-brand-logo.mjs               # both
 *   node scripts/generate-brand-logo.mjs --only mark   # just mark
 *   node scripts/generate-brand-logo.mjs --force       # regen even if exists
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

const JOBS = [
  {
    key: "mark",
    aspect: "1:1",
    prompt: [
      "Premium minimalist pharmaceutical brand logo MARK ONLY.",
      "1:1 square, perfectly centered icon with generous padding on a pure clean white background.",
      "Flat 2D vector-style design — sharp geometric shapes, smooth curves, single solid colors, no gradient, no shadows, no 3D.",
      "Subject: an abstract scientific symbol that suggests a peptide molecule, amino acid bond, or research vial.",
      "Examples of acceptable forms: a stylized hexagonal molecular shape, or a single interlinked chain of two-three nodes, or a simple vial silhouette with a dot.",
      "Color palette: deep navy (#0f172a) for the main mark, subtle teal (#0d9488) accent dot or stroke. Nothing else.",
      "ABSOLUTELY NO LETTERS, NO TEXT, NO WORDMARK, NO TYPOGRAPHY, NO CHARACTERS in the image.",
      "Design quality level: Pfizer, Moderna, Roche, Eli Lilly modern brand identity. Sophisticated, simple, distinctive, scalable, premium.",
      "Style: 2026 clinical pharma brand mark, infinitely scalable look.",
    ].join(" "),
  },
  {
    key: "lockup",
    aspect: "1:1",
    prompt: [
      "Premium minimalist pharmaceutical brand LOGO LOCKUP — icon mark on left, wordmark text on right.",
      "1:1 square, the lockup centered on a pure clean white background with generous padding.",
      "Flat 2D vector-style design.",
      "ICON: a single small abstract scientific mark suggesting a peptide molecule, deep navy with a teal accent dot.",
      "TEXT: the exact word PEPTIDLABS rendered in a clean modern sans-serif typeface (similar to Inter, Geist, Helvetica Neue), bold, deep navy, wide letter-spacing.",
      "The text PEPTIDLABS must be perfectly spelled with crisp clean letterforms — P, E, P, T, I, D, L, A, B, S in that exact order. No misspellings, no extra characters.",
      "No tagline, no other text. Just the mark + the word PEPTIDLABS.",
      "Color palette: deep navy (#0f172a) primary, subtle teal (#0d9488) accent on the mark only.",
      "Design quality level: Pfizer, Moderna, Roche, Eli Lilly brand identity.",
      "Style: 2026 clinical pharma brand lockup, premium, refined, distinctive.",
    ].join(" "),
  },
];

async function kieCreate(prompt, aspect) {
  const res = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
    method: "POST",
    headers: { Authorization: `Bearer ${KIE_KEY}`, "Content-Type": "application/json" },
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

async function uploadToStorage(key, buffer) {
  const path = `brand/${key}.png`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, buffer, { contentType: "image/png", upsert: true });
  if (error) throw new Error(`upload failed: ${error.message}`);
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

async function existsInStorage(key) {
  const { data } = await supabase.storage
    .from("product-images")
    .list("brand", { search: `${key}.png` });
  return data?.some((f) => f.name === `${key}.png`) ?? false;
}

async function main() {
  let target = JOBS;
  if (argOnly) target = JOBS.filter((j) => j.key === argOnly);
  if (!force) {
    const filtered = [];
    for (const j of target) {
      if (await existsInStorage(j.key)) {
        console.log(`✓ brand/${j.key} exists, skipping`);
      } else {
        filtered.push(j);
      }
    }
    target = filtered;
  }

  console.log(`\nProcessing ${target.length}/${JOBS.length} brand assets.\n`);

  let done = 0;
  let failed = 0;

  for (const job of target) {
    console.log(`[${done + failed + 1}/${target.length}] brand/${job.key} [${job.aspect}]`);
    const MAX_ATTEMPTS = 6;
    let attempt = 0;
    while (attempt < MAX_ATTEMPTS) {
      attempt++;
      try {
        const t0 = Date.now();
        const taskId = await kieCreate(job.prompt, job.aspect);
        const urls = await kiePoll(taskId);
        const buffer = await downloadBuffer(urls[0]);
        const publicUrl = await uploadToStorage(job.key, buffer);
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
        const backoff = Math.min(15000 * attempt, 60000);
        console.log(`  … retrying in ${backoff / 1000}s`);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\nDone: ${done} succeeded, ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
