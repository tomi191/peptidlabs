/**
 * Minimal structured logger — JSON output in production, pretty in dev.
 * Wraps console so it stays edge-compatible (no Pino/Winston).
 */

type Level = "debug" | "info" | "warn" | "error";

type LogFields = Record<string, unknown>;

const IS_PROD = process.env.NODE_ENV === "production";

function write(level: Level, message: string, fields?: LogFields) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...fields,
  };
  if (IS_PROD) {
    // JSON line — Vercel/Datadog ingest friendly
    if (level === "error") console.error(JSON.stringify(entry));
    else if (level === "warn") console.warn(JSON.stringify(entry));
    else console.log(JSON.stringify(entry));
  } else {
    const prefix = `[${level.toUpperCase()}]`;
    if (level === "error") console.error(prefix, message, fields ?? "");
    else if (level === "warn") console.warn(prefix, message, fields ?? "");
    else console.log(prefix, message, fields ?? "");
  }
}

export const log = {
  debug: (msg: string, fields?: LogFields) => write("debug", msg, fields),
  info: (msg: string, fields?: LogFields) => write("info", msg, fields),
  warn: (msg: string, fields?: LogFields) => write("warn", msg, fields),
  error: (msg: string, fields?: LogFields) => write("error", msg, fields),
};
