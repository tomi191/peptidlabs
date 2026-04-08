"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-mono text-4xl font-bold text-border">Error</p>
      <h1 className="mt-4 text-lg font-semibold text-navy">Something went wrong</h1>
      <p className="mt-2 text-sm text-secondary">Please try again or contact support.</p>
      <button onClick={reset} className="mt-6 rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white">
        Try Again
      </button>
    </main>
  );
}
