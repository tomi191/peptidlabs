#!/usr/bin/env node
/**
 * Generate ONE master Certificate of Analysis (COA) template image via
 * KIE.ai. The template is intentionally generic — no peptide name, no
 * batch number, no real lot data. Per-product overlay is rendered in
 * CSS by the <CoaPreview> component so we never ship faked-but-realistic
 * documents that could be misread as a real batch certificate.
 *
 * Upload to product-images/brand/coa-template.png
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

const PROMPT = [
  "Premium editorial pharma photography, 2026 magazine quality.",
  "Top-down 3:4 vertical macro flat-lay of a printed scientific Certificate of Analysis document on a clean white pharma laboratory bench.",
  "The document shows: a stylized HPLC chromatogram with sharp blue peaks at the top half, two columns of generic placeholder text fields underneath (no readable specific peptide name, no specific lot number — just generic LOT XXXX, MFG MM/YYYY, EXPIRY MM/YYYY, PURITY ≥98%, METHOD HPLC-UV, format placeholders only), and a small generic round wax-style seal embossed in the bottom right corner.",
  "Soft cool natural daylight from upper left, slight paper texture, subtle pen and small glass research vial visible at the document edges as composition props.",
  "Professional, trustworthy, clinical aesthetic. The document looks like a serious lab certificate template, NOT a real batch document.",
  "ABSOLUTELY NO specific peptide names, NO real lot numbers, NO recognizable trademark or company logo on the document itself.",
].join(" ");

async function main() {
  if (!force) {
    const { data } = await supabase.storage
      .from("product-images")
      .list("brand", { search: "coa-template.png" });
    if (data?.some((f) => f.name === "coa-template.png")) {
      console.log("✓ brand/coa-template.png exists, skipping (use --force)");
      return;
    }
  }

  console.log("Generating master COA template (KIE.ai 3:4, 1K)...");
  const t0 = Date.now();

  const create = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
    method: "POST",
    headers: { Authorization: `Bearer ${KIE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-image-2-text-to-image",
      input: { prompt: PROMPT, aspect_ratio: "3:4", resolution: "1K" },
    }),
  });
  const json = await create.json();
  if (json.code !== 200) throw new Error(`createTask failed: ${json.msg}`);
  const taskId = json.data.taskId;

  let delay = 4000;
  let urls = null;
  const start = Date.now();
  while (Date.now() - start < 5 * 60 * 1000) {
    const r = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${KIE_KEY}` },
    });
    const j = await r.json();
    if (j.data.state === "success") {
      urls = JSON.parse(j.data.resultJson).resultUrls;
      break;
    }
    if (j.data.state === "fail") throw new Error(`task failed: ${j.data.failMsg}`);
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.3, 12000);
  }
  if (!urls) throw new Error("timed out");

  const buf = Buffer.from(await (await fetch(urls[0])).arrayBuffer());
  const { error } = await supabase.storage
    .from("product-images")
    .upload("brand/coa-template.png", buf, { contentType: "image/png", upsert: true });
  if (error) throw new Error(`upload failed: ${error.message}`);

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(
    `✓ ${SUPABASE_URL}/storage/v1/object/public/product-images/brand/coa-template.png (${elapsed}s)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
