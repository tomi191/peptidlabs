"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAdmin } from "@/lib/store/admin";
import { Sparkles, Loader2, ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";

const CONTENT_TYPES = [
  { value: "tofu", label: "TOFU — Educational (нов читател)" },
  { value: "mofu", label: "MOFU — Comparison / How-to" },
  { value: "bofu", label: "BOFU — Conversion-aware" },
  { value: "advertorial", label: "Advertorial — Long-form story" },
] as const;

const MODELS = [
  {
    value: "anthropic/claude-3.5-sonnet",
    label: "Claude 3.5 Sonnet (recommended) · ~$0.05 за статия",
  },
  {
    value: "anthropic/claude-opus-4",
    label: "Claude Opus 4 (max quality) · ~$0.30 за статия",
  },
  {
    value: "google/gemini-2.5-flash",
    label: "Gemini 2.5 Flash (cheap) · ~$0.005 за статия",
  },
  {
    value: "google/gemini-2.0-flash-exp:free",
    label: "Gemini 2.0 Flash (free, lower quality)",
  },
  {
    value: "deepseek/deepseek-chat",
    label: "DeepSeek v3 (ultra cheap) · ~$0.01 за статия",
  },
];

export default function NewBlogPostPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAdmin();
  const [mounted, setMounted] = useState(false);

  const [topic, setTopic] = useState("");
  const [keywordsRaw, setKeywordsRaw] = useState("");
  const [contentType, setContentType] = useState<
    "tofu" | "mofu" | "bofu" | "advertorial"
  >("tofu");
  const [category, setCategory] = useState("general");
  const [targetWordCount, setTargetWordCount] = useState(1500);
  const [model, setModel] = useState("anthropic/claude-3.5-sonnet");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated()) router.push("/admin");
  }, [mounted, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || !keywordsRaw.trim()) {
      toast.error("Темата и ключовите думи са задължителни");
      return;
    }
    setSubmitting(true);
    const t0 = Date.now();
    try {
      const keywords = keywordsRaw
        .split(/[,\n]/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: topic.trim(),
          keywords,
          contentType,
          category: category.trim() || "general",
          targetWordCount,
          model,
        }),
      });
      const data = await res.json();
      if (!data?.success) {
        throw new Error(data?.error ?? "Грешка при генериране");
      }

      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      toast.success(
        `Статия генерирана за ${elapsed}s · ${data.data.wordCount_bg} BG / ${data.data.wordCount_en} EN думи`,
        { duration: 6000 },
      );
      router.push("/admin/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Грешка");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted || !isAuthenticated()) return null;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"
        >
          <ArrowLeft size={14} />
          Назад към списъка
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-navy">
          Нова блог статия (AI)
        </h1>
        <p className="mt-1 text-sm text-muted">
          Bilingual генериране (BG + EN) през OpenRouter. Резултатът се записва
          като чернова — ще можеш да го прегледаш + публикуваш отделно.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-white p-6 space-y-5"
      >
        {/* Topic */}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Тема (на български) *
          </span>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="напр. Какво е GHK-Cu и защо го наричат „синият елексир“"
            className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            required
          />
          <p className="mt-1 text-xs text-muted">
            Това ще се изпрати буквално като TOPIC към модела. Бъди конкретен.
          </p>
        </label>

        {/* Keywords */}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Ключови думи (запетая или нов ред) *
          </span>
          <textarea
            value={keywordsRaw}
            onChange={(e) => setKeywordsRaw(e.target.value)}
            placeholder="GHK-Cu, медни пептиди, anti-aging пептиди, Pickart"
            rows={3}
            className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            required
          />
          <p className="mt-1 text-xs text-muted">
            Първата дума = primary keyword. Останалите се разпръскват в текста.
          </p>
        </label>

        {/* Content type + category */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Content type
            </span>
            <select
              value={contentType}
              onChange={(e) =>
                setContentType(e.target.value as typeof contentType)
              }
              className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-navy focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {CONTENT_TYPES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Категория (slug)
            </span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="general / weight-loss / healing / nootropic"
              className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </label>
        </div>

        {/* Word count + model */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Целеви брой думи (на език)
            </span>
            <input
              type="number"
              value={targetWordCount}
              onChange={(e) => setTargetWordCount(Number(e.target.value))}
              min={500}
              max={4000}
              step={100}
              className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-navy focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              AI модел
            </span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-navy focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 rounded-lg border border-dashed border-border bg-surface px-3 py-2.5">
          <Info
            size={14}
            className="mt-0.5 shrink-0 text-muted"
            strokeWidth={1.75}
          />
          <p className="text-xs leading-relaxed text-secondary">
            Генерирането отнема <strong>30-90 секунди</strong>. Не затваряй
            таба. Резултатът ще се запише като чернова — преди публикуване
            прегледай ръчно.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/blog"
            className="text-sm text-muted hover:text-navy"
          >
            Отказ
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {submitting ? "Генериране..." : "Генерирай статия"}
          </button>
        </div>
      </form>
    </div>
  );
}
