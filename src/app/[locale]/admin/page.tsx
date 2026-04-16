"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAdmin } from "@/lib/store/admin";
import { Lock, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, setToken } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in — redirect
  if (isAuthenticated()) {
    router.push("/admin/orders");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      setToken(data.data.token);
      router.push("/admin/orders");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border">
            <Lock className="h-5 w-5 text-navy" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-semibold text-navy">
            PeptideLab Admin
          </h1>
          <p className="text-sm text-secondary">
            Enter admin password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="sr-only">
              Admin password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              autoComplete="current-password"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-navy/90 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Sign in"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
