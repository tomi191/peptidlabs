"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-red-50 p-3">
          <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-navy">
            Грешка в админ панела
          </h1>
          <p className="mt-2 text-sm text-secondary leading-relaxed">
            Възникна проблем при зареждане на тази страница. Опитайте отново
            или се върнете към началото на админ панела.
          </p>

          {isDev && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                Development preview
              </p>
              <pre className="mt-2 overflow-x-auto font-mono text-xs text-red-900 whitespace-pre-wrap break-all">
                {error.message}
                {error.digest && `\n\ndigest: ${error.digest}`}
              </pre>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              Опитай отново
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-surface"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              Към админ началото
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
