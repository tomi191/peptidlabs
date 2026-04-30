"use client";

/* CategoryTransformation — Modern Morphing Literal Edition
   Beautiful interactive visualizations representing literal transformations 
   (Fat to Skinny, Skinny to Muscle, Old Face to Young Face, etc.)
   using smooth physics-based Framer Motion paths. */

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";

type Stage = "before" | "after";

export function CategoryTransformation({ slug }: { slug: string }) {
  const [stage, setStage] = useState<Stage>("before");
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.5 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (reduced || !inView) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    const period = hovered ? 1500 : 3000;
    intervalRef.current = setInterval(() => {
      setStage((s) => (s === "before" ? "after" : "before"));
    }, period);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [inView, hovered, reduced]);

  const isStatic = slug === "accessories" && false; // We made accessories animated too

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 bottom-0 flex h-[72px] items-end justify-center overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() =>
        setStage((s) => (s === "before" ? "after" : "before"))
      }
      aria-hidden="true"
    >
      {!isStatic && (
        <div className="absolute left-3 top-2 flex items-center gap-1.5 rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur-md z-10">
          <motion.span
            animate={{ opacity: stage === "before" ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          >
            Преди
          </motion.span>
          <span className="opacity-30">→</span>
          <motion.span
            animate={{
              opacity: stage === "after" ? 1 : 0.4,
              color: stage === "after" ? "#0f766e" : "inherit"
            }}
            transition={{ duration: 0.3 }}
          >
            След
          </motion.span>
        </div>
      )}
      <CategoryFigure slug={slug} stage={stage} />
    </div>
  );
}

// Smooth bouncy physics for premium feel
const spring = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;
const smooth = { duration: 0.8, ease: [0.25, 1, 0.5, 1] as const };

function CategoryFigure({ slug, stage }: { slug: string; stage: Stage }) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <svg viewBox="0 0 120 50" className="h-[50px] w-full max-w-[160px] overflow-visible" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="fat-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="skinny-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="muscle-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <linearGradient id="young-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="healing-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="flame-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.3" />
        </filter>
        <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComponentTransfer in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {children}
    </svg>
  );

  switch (slug) {
    case "weight-loss": return <Wrapper><WeightLoss stage={stage} /></Wrapper>;
    case "gh-muscle": return <Wrapper><Muscle stage={stage} /></Wrapper>;
    case "anti-aging": return <Wrapper><Aging stage={stage} /></Wrapper>;
    case "healing": return <Wrapper><Healing stage={stage} /></Wrapper>;
    case "nootropic": return <Wrapper><Nootropic stage={stage} /></Wrapper>;
    case "sexual-health": return <Wrapper><SexualHealth stage={stage} /></Wrapper>;
    case "hair-growth": return <Wrapper><HairGrowth stage={stage} /></Wrapper>;
    case "immune": return <Wrapper><Immune stage={stage} /></Wrapper>;
    case "blends": return <Wrapper><Blends stage={stage} /></Wrapper>;
    case "accessories": return <Wrapper><Accessories stage={stage} /></Wrapper>;
    default: return null;
  }
}

/* 1. WEIGHT LOSS: Fat silhouette morphs to skinny silhouette */
function WeightLoss({ stage }: { stage: Stage }) {
  return (
    <g>
      <motion.circle 
        cx="60" cy="11" 
        initial={false}
        animate={{ r: stage === "before" ? 7 : 5.5, fill: stage === "before" ? "url(#fat-grad)" : "url(#skinny-grad)" }} 
        transition={spring} 
      />
      <motion.path
        initial={false}
        animate={{
          d: stage === "before"
            ? "M 42 20 C 55 18, 65 18, 78 20 C 85 35, 83 50, 78 50 C 65 50, 55 50, 42 50 C 37 50, 35 35, 42 20 Z"
            : "M 50 20 C 55 19, 65 19, 70 20 C 72 35, 66 50, 66 50 C 62 50, 58 50, 54 50 C 48 50, 48 35, 50 20 Z",
          fill: stage === "before" ? "url(#fat-grad)" : "url(#skinny-grad)"
        }}
        transition={spring}
      />
      {/* Inner glowing core for the skinny body to show energy */}
      <motion.path
        initial={false}
        animate={{
          d: stage === "before"
            ? "M 55 25 C 58 24, 62 24, 65 25 C 68 35, 67 45, 65 45 C 62 45, 58 45, 55 45 C 53 45, 52 35, 55 25 Z"
            : "M 55 25 C 58 24, 62 24, 65 25 C 66 35, 63 45, 63 45 C 61 45, 59 45, 57 45 C 57 45, 54 35, 55 25 Z",
          opacity: stage === "before" ? 0 : 0.6,
          fill: "#bae6fd"
        }}
        transition={spring}
        filter="blur(2px)"
      />
    </g>
  );
}

/* 2. GH/MUSCLE: Skinny silhouette morphs to muscular v-taper */
function Muscle({ stage }: { stage: Stage }) {
  return (
    <g>
      <motion.circle 
        cx="60" cy="11" 
        initial={false}
        animate={{ 
          r: stage === "before" ? 5.5 : 6.5, 
          fill: stage === "before" ? "#cbd5e1" : "url(#muscle-grad)" 
        }} 
        transition={spring} 
      />
      <motion.path
        initial={false}
        animate={{
          d: stage === "before"
            ? "M 50 20 C 55 19, 65 19, 70 20 C 72 35, 66 50, 66 50 C 62 50, 58 50, 54 50 C 48 50, 48 35, 50 20 Z"
            : "M 38 20 C 50 16, 70 16, 82 20 C 88 28, 70 38, 66 50 C 62 50, 58 50, 54 50 C 50 38, 32 28, 38 20 Z",
          fill: stage === "before" ? "#cbd5e1" : "url(#muscle-grad)"
        }}
        transition={spring}
      />
      {/* Muscle Definition (Pecs/Abs) fading in */}
      <motion.g
        initial={false}
        animate={{ opacity: stage === "before" ? 0 : 0.4 }}
        transition={smooth}
      >
        <path d="M 50 25 Q 60 30 70 25" fill="none" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 60 30 L 60 45" fill="none" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 55 35 L 65 35 M 56 40 L 64 40" fill="none" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
    </g>
  );
}

/* 3. ANTI-AGING: Old face profile morphs to young face profile */
function Aging({ stage }: { stage: Stage }) {
  return (
    <g>
      <motion.path
        initial={false}
        animate={{
          d: stage === "before"
            ? "M 60 8 C 50 8, 43 15, 43 20 C 43 22, 46 22, 46 22 L 38 30 L 44 33 C 42 36, 44 39, 46 39 C 43 45, 46 48, 55 48 L 62 50 C 75 50, 80 40, 80 25 C 80 10, 70 8, 60 8 Z"
            : "M 60 5 C 50 5, 45 15, 45 20 C 45 22, 48 22, 48 22 L 40 28 L 45 32 C 43 35, 45 38, 48 38 C 45 42, 48 45, 55 45 L 60 50 C 70 50, 75 40, 75 25 C 75 10, 70 5, 60 5 Z",
          fill: stage === "before" ? "#cbd5e1" : "url(#young-grad)"
        }}
        transition={spring}
      />
      {/* Wrinkles fading out */}
      <motion.g initial={false} animate={{ opacity: stage === "before" ? 1 : 0 }} transition={smooth}>
        <path d="M 45 26 Q 50 28 53 25" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
        <path d="M 48 32 Q 52 35 55 33" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
        <path d="M 48 40 Q 52 42 55 40" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
      </motion.g>
      {/* Magic glow */}
      {stage === "after" && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <circle cx="35" cy="15" r="1.5" fill="#fde047" filter="url(#glow-cyan)" />
          <circle cx="40" cy="25" r="1.5" fill="#fde047" filter="url(#glow-cyan)" />
          <circle cx="85" cy="20" r="2" fill="#fbcfe8" filter="url(#glow-cyan)" />
        </motion.g>
      )}
    </g>
  );
}

/* 4. HEALING: Figure with red pain points -> glowing cyan/green healthy body */
function Healing({ stage }: { stage: Stage }) {
  return (
    <g>
      <motion.path
        d="M 50 20 C 55 19, 65 19, 70 20 C 72 35, 66 50, 66 50 C 62 50, 58 50, 54 50 C 48 50, 48 35, 50 20 Z"
        initial={false}
        animate={{ fill: stage === "before" ? "#cbd5e1" : "url(#healing-grad)" }}
        transition={smooth}
      />
      <motion.circle cx="60" cy="11" r="6" initial={false} animate={{ fill: stage === "before" ? "#cbd5e1" : "url(#healing-grad)" }} transition={smooth} />
      
      {/* Pain areas */}
      <motion.circle cx="53" cy="25" r="4" fill="#ef4444" filter="blur(2px)" initial={false} animate={{ opacity: stage === "before" ? 0.8 : 0, scale: stage === "before" ? 1 : 0 }} />
      <motion.circle cx="66" cy="35" r="3" fill="#ef4444" filter="blur(2px)" initial={false} animate={{ opacity: stage === "before" ? 0.6 : 0, scale: stage === "before" ? 1 : 0 }} />

      {/* Healing glow filling up */}
      <motion.circle cx="60" cy="30" r="15" fill="#4ade80" filter="blur(6px)" initial={false} animate={{ opacity: stage === "before" ? 0 : 0.6, scale: stage === "before" ? 0.5 : 1.5 }} transition={smooth} />
    </g>
  );
}

/* 5. NOOTROPIC: Dim brain -> Brain lights up with synaptic connections */
function Nootropic({ stage }: { stage: Stage }) {
  return (
    <g>
      <motion.path
        d="M 45 25 C 45 10, 75 10, 75 25 C 80 30, 75 40, 60 40 C 45 40, 40 30, 45 25 Z"
        initial={false}
        animate={{ fill: stage === "before" ? "#cbd5e1" : "#e0e7ff", stroke: stage === "before" ? "#94a3b8" : "#6366f1" }}
        strokeWidth="2"
        transition={smooth}
      />
      {/* Brain folds */}
      <motion.path
        d="M 50 20 Q 60 15 70 20 M 48 28 Q 60 25 72 28 M 52 35 Q 60 38 68 35"
        fill="none"
        initial={false}
        animate={{ stroke: stage === "before" ? "#94a3b8" : "#818cf8" }}
        strokeWidth="1.5"
        strokeLinecap="round"
        transition={smooth}
      />
      {/* Glowing Synapses */}
      <motion.g initial={false} animate={{ opacity: stage === "before" ? 0 : 1 }} transition={smooth}>
        <circle cx="55" cy="18" r="2" fill="#fde047" filter="url(#glow-cyan)" />
        <circle cx="65" cy="22" r="2" fill="#fde047" filter="url(#glow-cyan)" />
        <circle cx="50" cy="30" r="2" fill="#fde047" filter="url(#glow-cyan)" />
        <circle cx="70" cy="32" r="2" fill="#fde047" filter="url(#glow-cyan)" />
        <path d="M 55 18 L 65 22 L 70 32 L 50 30 Z" fill="none" stroke="#fde047" strokeWidth="0.5" opacity="0.6" />
      </motion.g>
    </g>
  );
}

/* 6. SEXUAL HEALTH: Small dim flame -> Roaring vibrant flame */
function SexualHealth({ stage }: { stage: Stage }) {
  return (
    <g>
      <motion.path
        initial={false}
        animate={{
          d: stage === "before" 
            ? "M 60 25 C 65 32, 68 38, 60 45 C 52 38, 55 32, 60 25 Z"
            : "M 60 5 C 75 25, 80 38, 60 48 C 40 38, 45 25, 60 5 Z",
          fill: stage === "before" ? "#94a3b8" : "url(#flame-grad)",
          filter: stage === "before" ? "blur(0px)" : "blur(1px)"
        }}
        transition={spring}
      />
      <motion.path
        initial={false}
        animate={{
          d: stage === "before"
            ? "M 60 30 C 62 35, 64 38, 60 42 C 56 38, 58 35, 60 30 Z"
            : "M 60 18 C 68 30, 70 38, 60 45 C 50 38, 52 30, 60 18 Z",
          fill: stage === "before" ? "#cbd5e1" : "#ef4444",
          opacity: stage === "before" ? 0.5 : 0.9
        }}
        transition={spring}
      />
      <motion.g initial={false} animate={{ opacity: stage === "before" ? 0 : 1 }}>
        <circle cx="45" cy="15" r="1.5" fill="#fde047" filter="url(#glow-cyan)" />
        <circle cx="75" cy="20" r="2" fill="#fde047" filter="url(#glow-cyan)" />
      </motion.g>
    </g>
  );
}

/* 7. HAIR GROWTH: Bald head -> Scalp covered in thick hair */
function HairGrowth({ stage }: { stage: Stage }) {
  return (
    <g>
      {/* Face Base */}
      <path d="M 45 25 C 45 10, 75 10, 75 25 C 75 40, 65 50, 60 50 C 55 50, 45 40, 45 25 Z" fill="#fbcfe8" />
      <circle cx="55" cy="25" r="1.5" fill="#be185d" />
      <circle cx="65" cy="25" r="1.5" fill="#be185d" />
      <path d="M 57 32 Q 60 35 63 32" fill="none" stroke="#be185d" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Hair morphing up */}
      <motion.path
        d="M 42 28 C 40 10, 50 0, 60 0 C 70 0, 80 10, 78 28 C 72 15, 48 15, 42 28 Z"
        fill="#1e293b"
        initial={false}
        animate={{ scaleY: stage === "before" ? 0 : 1, opacity: stage === "before" ? 0 : 1 }}
        style={{ transformOrigin: "60px 25px" }}
        transition={spring}
      />
      {stage === "after" && (
        <motion.circle cx="70" cy="8" r="2" fill="#fff" filter="blur(1px)" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
      )}
    </g>
  );
}

/* 8. IMMUNE: Broken shield halves -> United glowing shield */
function Immune({ stage }: { stage: Stage }) {
  return (
    <g>
      <motion.path
        d="M 60 10 L 45 10 L 45 25 C 45 40, 60 50, 60 50 Z"
        initial={false}
        animate={{
          x: stage === "before" ? -5 : 0,
          y: stage === "before" ? 5 : 0,
          rotate: stage === "before" ? -15 : 0,
          fill: stage === "before" ? "#94a3b8" : "url(#skinny-grad)"
        }}
        style={{ transformOrigin: "60px 50px" }}
        transition={spring}
      />
      <motion.path
        d="M 60 10 L 75 10 L 75 25 C 75 40, 60 50, 60 50 Z"
        initial={false}
        animate={{
          x: stage === "before" ? 5 : 0,
          y: stage === "before" ? 5 : 0,
          rotate: stage === "before" ? 15 : 0,
          fill: stage === "before" ? "#64748b" : "url(#skinny-grad)"
        }}
        style={{ transformOrigin: "60px 50px" }}
        transition={spring}
      />
      <motion.circle
        cx="60" cy="30" r="20"
        fill="#38bdf8"
        initial={false}
        animate={{ opacity: stage === "before" ? 0 : 0.4, scale: stage === "before" ? 0.5 : 1 }}
        filter="url(#glow-cyan)"
        transition={smooth}
      />
      <motion.path
        d="M 55 25 L 65 25 M 60 20 L 60 30"
        stroke="#fff" strokeWidth="2" strokeLinecap="round"
        initial={false}
        animate={{ opacity: stage === "before" ? 0 : 1 }}
      />
    </g>
  );
}

/* 9. BLENDS: Disparate components -> Merged glowing synergy orb */
function Blends({ stage }: { stage: Stage }) {
  return (
    <g>
      <motion.circle
        cx="60" cy="25"
        initial={false}
        animate={{
          r: stage === "before" ? 6 : 14,
          x: stage === "before" ? -15 : 0,
          y: stage === "before" ? -10 : 0,
          fill: "#ec4899"
        }}
        transition={spring}
        style={{ mixBlendMode: "multiply" }}
      />
      <motion.circle
        cx="60" cy="25"
        initial={false}
        animate={{
          r: stage === "before" ? 6 : 14,
          x: stage === "before" ? 15 : 0,
          y: stage === "before" ? -10 : 0,
          fill: "#06b6d4"
        }}
        transition={spring}
        style={{ mixBlendMode: "multiply" }}
      />
      <motion.circle
        cx="60" cy="25"
        initial={false}
        animate={{
          r: stage === "before" ? 6 : 14,
          x: stage === "before" ? 0 : 0,
          y: stage === "before" ? 15 : 0,
          fill: "#eab308"
        }}
        transition={spring}
        style={{ mixBlendMode: "multiply" }}
      />
      <motion.circle
        cx="60" cy="25" r="18"
        fill="#fff"
        filter="blur(4px)"
        initial={false}
        animate={{ opacity: stage === "before" ? 0 : 0.7, scale: stage === "before" ? 0.5 : 1 }}
      />
    </g>
  );
}

/* 10. ACCESSORIES: Empty syringe barrel -> Fills up smoothly */
function Accessories({ stage }: { stage: Stage }) {
  return (
    <g>
      <rect x="30" y="20" width="50" height="10" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      <motion.rect
        initial={false}
        animate={{ width: stage === "before" ? 5 : 45 }}
        transition={spring}
        x="32" y="22" height="6" rx="1" fill="#38bdf8" opacity="0.8"
      />
      <motion.g
        initial={false}
        animate={{ x: stage === "before" ? 0 : 40 }}
        transition={spring}
      >
        <rect x="10" y="24" width="22" height="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        <rect x="6" y="21" width="4" height="8" rx="1" fill="#94a3b8" />
        <rect x="32" y="21" width="4" height="8" rx="1" fill="#334155" />
      </motion.g>
      <path d="M 80 23 L 85 24 L 85 26 L 80 27 Z" fill="#cbd5e1" />
      <line x1="85" y1="25" x2="105" y2="25" stroke="#94a3b8" strokeWidth="1" />
    </g>
  );
}
