import Link from "next/link";
import { ArrowLeft, FlaskConical, BookOpen, Search } from "lucide-react";

/**
 * Root 404 — bilingual, brand-styled. Renders when no locale matched.
 * Uses raw <html> + minimal inline styles since this can render outside the
 * locale layout (no fonts/translations guaranteed).
 */
export default function RootNotFound() {
  return (
    <html lang="bg">
      <body
        style={{
          margin: 0,
          background: "#ffffff",
          color: "#0f172a",
          fontFamily:
            "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
          {/* Brand mark */}
          <Link
            href="/"
            aria-label="PeptidLabs"
            className="mb-8 inline-flex items-center gap-2.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 64 64"
              aria-hidden="true"
            >
              <polygon
                points="32,10 50,21 50,43 32,54 14,43 14,21"
                fill="none"
                stroke="#0f172a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="32" cy="10" r="4" fill="#fff" stroke="#0f172a" strokeWidth="3" />
              <circle cx="50" cy="21" r="4" fill="#fff" stroke="#0f172a" strokeWidth="3" />
              <circle cx="50" cy="43" r="4" fill="#fff" stroke="#0f172a" strokeWidth="3" />
              <circle cx="14" cy="43" r="4" fill="#fff" stroke="#0f172a" strokeWidth="3" />
              <circle cx="32" cy="32" r="5.5" fill="#14b8a6" />
            </svg>
            <span
              style={{ fontWeight: 600, letterSpacing: "0.18em", fontSize: 14 }}
            >
              PEPTIDLABS
            </span>
          </Link>

          <p
            className="font-mono text-7xl font-bold tabular"
            style={{ color: "#e7e5e4" }}
          >
            404
          </p>
          <h1
            className="mt-4 text-2xl font-bold tracking-tight"
            style={{ color: "#0f172a" }}
          >
            Страницата не е намерена · Page not found
          </h1>
          <p
            className="mt-3 max-w-md text-sm leading-relaxed"
            style={{ color: "#57534e" }}
          >
            Тази страница не съществува или е преместена. Опитайте от началото
            или разгледайте каталога ни.
            <br />
            <span style={{ color: "#a8a29e" }}>
              This page does not exist or has been moved. Try the homepage or
              browse the catalog.
            </span>
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/bg"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#0f172a" }}
            >
              <ArrowLeft size={16} />
              Начало · Home
            </Link>
            <Link
              href="/bg/shop"
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
              style={{ borderColor: "#e7e5e4", color: "#0f172a" }}
            >
              <FlaskConical size={16} />
              Каталог · Shop
            </Link>
            <Link
              href="/bg/encyclopedia"
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
              style={{ borderColor: "#e7e5e4", color: "#0f172a" }}
            >
              <BookOpen size={16} />
              Енциклопедия
            </Link>
            <Link
              href="/bg/blog"
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
              style={{ borderColor: "#e7e5e4", color: "#0f172a" }}
            >
              <Search size={16} />
              Блог
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
