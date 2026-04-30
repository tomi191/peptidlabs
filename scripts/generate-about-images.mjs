#!/usr/bin/env node
/**
 * Generate About-page images via KIE.ai GPT Image-2.
 *   - lab-bench       4:3   replaces PlaceholderVisual at about/page.tsx:118
 *   - team-portrait   1:1   replaces PlaceholderVisual at about/page.tsx:230
 *
 * Upload to product-images/about/<key>.png in Supabase Storage.
 */

import "dotenv/config";
import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

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
const force = process.argv.includes("--force");

const STYLE = [
  "Premium editorial fitness wellness clinical photography, 2026 magazine quality.",
  "Modern bright pharma laboratory or clinic interior, soft cool natural light, cinematic depth.",
  "Sharp focus on subject, slightly blurred background.",
  "No text, no logos, no watermarks.",
  "Premium peptide research brand campaign aesthetic.",
].join(" ");

const JOBS = [
  {
    key: "lab-bench",
    aspect: "4:3",
    prompt: `${STYLE} 4:3 horizontal. Clean white pharma laboratory bench with HPLC chromatograph machine on the right and an organized rack of clear glass research vials on the left, soft cool daylight from large windows, no people visible, premium clinical aesthetic. Conveys scientific rigor and quality control.`,
  },
  {
    key: "team-portrait",
    aspect: "1:1",
    prompt: `${STYLE} 1:1 square. Professional female researcher in her 30s wearing a clean white lab coat over navy shirt, in a modern bright pharma laboratory, holding up a clear glass research vial to inspect it, focused calm expression, soft natural light, blurred lab equipment in background. Confident science campaign portrait.`,
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
  const path = `about/${key}.png`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, buffer, { contentType: "image/png", upsert: true });
  if (error) throw new Error(`upload failed: ${error.message}`);
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

async function existsInStorage(key) {
  const { data } = await supabase.storage
    .from("product-images")
    .list("about", { search: `${key}.png` });
  return data?.some((f) => f.name === `${key}.png`) ?? false;
}

async function main() {
  let target = JOBS;
  if (!force) {
    const filtered = [];
    for (const j of target) {
      if (await existsInStorage(j.key)) {
        console.log(`✓ about/${j.key} exists, skipping`);
      } else {
        filtered.push(j);
      }
    }
    target = filtered;
  }

  console.log(`\nProcessing ${target.length}/${JOBS.length} about images.\n`);

  let done = 0;
  let failed = 0;

  for (const job of target) {
    console.log(`[${done + failed + 1}/${target.length}] about/${job.key} [${job.aspect}]`);
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
