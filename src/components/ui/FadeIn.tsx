"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function FadeIn({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only activate the hidden state after JS is ready — ensures content
    // stays visible when JS is disabled, pre-hydration, or when a
    // screenshot tool renders the page without triggering IntersectionObserver.
    el.classList.add("js-ready");

    // If already in viewport when mounted, reveal immediately.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-in-section ${className}`}>
      {children}
    </div>
  );
}
