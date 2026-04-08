import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
          <p className="font-mono text-6xl font-bold" style={{ color: "#d1d5db" }}>
            404
          </p>
          <h1 className="mt-4 text-xl font-semibold" style={{ color: "#0f172a" }}>
            Page not found
          </h1>
          <p className="mt-2 max-w-md text-sm" style={{ color: "#64748b" }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#0f172a" }}
            >
              <ArrowLeft size={16} />
              Go Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
