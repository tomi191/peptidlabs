"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

type Item = {
  name: string;
  size: string;
  scale: number;
  color: string;
  example: string;
};

const items: Item[] = [
  {
    name: "Молекула вода",
    size: "0.0003 nm",
    scale: 6,
    color: "#7dd3fc",
    example: "H2O",
  },
  {
    name: "Аминокиселина",
    size: "~0.5 nm",
    scale: 14,
    color: "#a7f3d0",
    example: "Глицин, аланин, лизин",
  },
  {
    name: "Малка молекула",
    size: "~1 nm",
    scale: 22,
    color: "#fde047",
    example: "Аспирин, кофеин",
  },
  {
    name: "Малък пептид",
    size: "~2 nm",
    scale: 38,
    color: "#5eead4",
    example: "GHK-Cu (3 АК), TRH (3 АК)",
  },
  {
    name: "Среден пептид",
    size: "~5 nm",
    scale: 70,
    color: "#2dd4bf",
    example: "BPC-157 (15 АК), Семаглутид (31 АК)",
  },
  {
    name: "Голям пептид",
    size: "~10 nm",
    scale: 110,
    color: "#0d9488",
    example: "Тирзепатид (39 АК), Инсулин (51 АК)",
  },
  {
    name: "Малък протеин",
    size: "~30 nm",
    scale: 180,
    color: "#0f766e",
    example: "Хормон на растежа (191 АК)",
  },
];

export function SizeComparison() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-white p-6 md:p-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
        Сравнителна скала на размерите
      </p>
      <h3 className="font-display text-xl font-bold text-navy mb-2 tracking-[-0.02em]">
        Колко голям е един пептид?
      </h3>
      <p className="text-sm text-secondary leading-relaxed mb-8">
        Пептидите са по-големи от обикновените лекарствени молекули, но много
        по-малки от протеините. Този размер е причината те да преминават през
        клетъчните мембрани по-добре от протеините, но да са по-стабилни от
        малките молекули.
      </p>

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="grid gap-3 sm:grid-cols-[180px_1fr_auto] sm:items-center"
          >
            <div>
              <p className="text-sm font-semibold text-navy">{item.name}</p>
              <p className="font-mono text-[11px] text-muted">{item.size}</p>
            </div>
            <div className="relative h-8 rounded-full bg-surface overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${(item.scale / 200) * 100}%` } : {}}
                transition={{ duration: 1.2, delay: i * 0.08 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
            <p className="text-xs text-muted sm:text-right sm:max-w-[200px]">
              {item.example}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-border bg-surface/50 p-4">
        <p className="text-xs text-secondary leading-relaxed">
          <strong className="text-navy">За сравнение:</strong> човешка коса е
          приблизително 80 000 nm дебела, тоест около 8 000 пъти по-голяма от
          среден пептид. Един пептид е толкова малък, че не може да се види дори с
          най-мощните оптични микроскопи. За изобразяване се ползва крио-електронна
          микроскопия или рентгенова кристалография.
        </p>
      </div>
    </div>
  );
}
