/**
 * Robust JSON parser for AI model responses.
 * Three repair strategies: direct → control-char escape → regex fallback.
 * Original by the imported kit; kept as-is — proven against Gemini + Claude responses.
 */

export function parseJSONResponse<T extends Record<string, unknown>>(
  raw: string,
  requiredFields: string[] = [],
): T {
  let clean = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "");

  const m = clean.match(/\{[\s\S]*\}/);
  if (m) clean = m[0];

  // Strategy 1: direct
  try {
    const out = JSON.parse(clean) as T;
    requireFields(out, requiredFields);
    return out;
  } catch {
    /* fall through */
  }

  // Strategy 2: escape control chars inside known string fields
  try {
    let repaired = clean;
    const stringFields = [
      ...requiredFields,
      "title_bg",
      "title_en",
      "content_bg",
      "content_en",
      "excerpt_bg",
      "excerpt_en",
      "metaDescription_bg",
      "metaDescription_en",
    ];
    for (const f of stringFields) {
      const re = new RegExp(`"${f}":\\s*"([\\s\\S]*?)"(?=\\s*[,}])`, "g");
      repaired = repaired.replace(re, (_match, value: string) => {
        const escaped = value
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/[\x00-\x1F\x7F]/g, "");
        return `"${f}": "${escaped}"`;
      });
    }
    const out = JSON.parse(repaired) as T;
    requireFields(out, requiredFields);
    return out;
  } catch {
    /* fall through */
  }

  // Strategy 3: regex extract per field (last-ditch)
  try {
    const out: Record<string, unknown> = {};
    for (const f of requiredFields) {
      const fm = clean.match(new RegExp(`"${f}":\\s*"([^"]*)"`, "s"));
      if (fm) out[f] = fm[1];
    }
    const tagsMatch = clean.match(/"tags":\s*\[([\s\S]*?)\]/);
    if (tagsMatch) {
      const items = tagsMatch[1].match(/"([^"]+)"/g);
      out.tags = items ? items.map((s) => s.replace(/"/g, "")) : [];
    }
    if (Object.keys(out).length > 0) return out as T;
  } catch {
    /* nothing */
  }

  throw new Error(
    `Could not parse AI response. Preview: ${clean.slice(0, 200)}`,
  );
}

function requireFields(o: Record<string, unknown>, fields: string[]) {
  for (const f of fields) {
    if (o[f] === undefined || o[f] === null) {
      throw new Error(`Missing required field: ${f}`);
    }
  }
}
