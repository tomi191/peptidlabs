import { Link } from "@/i18n/navigation";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-mono text-6xl font-bold text-border">404</p>
      <h1 className="mt-4 text-xl font-semibold text-navy">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Go Home
        </Link>
        <Link
          href="/shop"
          className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-navy"
        >
          <Search size={16} />
          Browse Shop
        </Link>
      </div>
    </main>
  );
}
