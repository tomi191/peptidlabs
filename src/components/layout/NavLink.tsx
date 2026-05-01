"use client";

import { motion } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  /** layoutId group — pass the same value to all links that should share
      the morphing underline. Default: "nav-underline". */
  layoutId?: string;
};

/**
 * NavLink — text link with an active underline that slides smoothly
 * between currently-active items via Framer Motion `layoutId`.
 * The underline is teal, 2px, sits 4px below the text, and only renders
 * on the active link. When the active link changes, the underline
 * morph-translates to the new position.
 */
export function NavLink({ href, children, layoutId = "nav-underline" }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`relative inline-flex items-center gap-1.5 py-1 text-sm transition-colors ${
        isActive
          ? "text-navy font-medium"
          : "text-secondary hover:text-navy"
      }`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId={layoutId}
          className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-accent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}
