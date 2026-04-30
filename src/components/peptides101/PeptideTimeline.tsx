"use client";

import { useState } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

type Event = {
  year: string;
  title: string;
  desc: string;
  who?: string;
  highlight?: boolean;
};

const events: Event[] = [
  {
    year: "1902",
    title: "Първи синтетичен дипептид",
    desc: "Емил Фишер (Германия) синтезира глицил-глицин, първият peptide, направен в лаборатория. Поставя основите на цялата peptide химия.",
    who: "Емил Фишер, Нобелова награда 1902",
  },
  {
    year: "1953",
    title: "Първи синтетичен пептиден хормон",
    desc: "Vincent du Vigneaud синтезира окситоцин, първият биологично активен пептиден хормон, направен изкуствено. Доказва, че синтетичните peptide могат да заместят естествените.",
    who: "du Vigneaud, Нобелова награда 1955",
    highlight: true,
  },
  {
    year: "1965",
    title: "Solid-phase peptide synthesis",
    desc: "Bruce Merrifield изобретява революционен метод за свързване на аминокиселините една по една върху твърда смола. Това прави възможно масовото производство на пептиди.",
    who: "Merrifield, Нобелова награда 1984",
  },
  {
    year: "1971",
    title: "Откритие на ендорфините",
    desc: "Изследователи откриват, че мозъкът произвежда собствени peptide, които се свързват с опиоидните рецептори. Това са ендорфините, естествените аналгетици на тялото.",
  },
  {
    year: "1991",
    title: "BPC-157 е изолиран",
    desc: "Predrag Sikiric (Загребски университет) изолира Body Protection Compound от стомашен сок. Това е началото на peptide клас за регенерация на тъкани.",
    who: "Predrag Sikiric, Хърватия",
  },
  {
    year: "1999",
    title: "Откритие на грелин",
    desc: "Японски учени идентифицират последния голям хормон в човешкото тяло, грелин (хормонът на глада). Откритието води до развитието на цял клас GH секретагози.",
  },
  {
    year: "2005",
    title: "Първи GLP-1 за диабет",
    desc: "FDA одобрява Exenatide, първият GLP-1 рецепторен агонист за тип 2 диабет. Откриването на този клас променя лечението на диабета.",
  },
  {
    year: "2017",
    title: "Семаглутид (Ozempic)",
    desc: "Novo Nordisk пуска Семаглутид за тип 2 диабет. Седмично инжектиране, силен ефект върху кръвната захар и неочаквана загуба на тегло превръщат пептидите в основна терапия.",
    highlight: true,
  },
  {
    year: "2021",
    title: "Wegovy за затлъстяване",
    desc: "FDA одобрява Семаглутид специфично за хронично управление на тегло. STEP-1 проучване показва близо 15% намаляване на телесното тегло, безпрецедентно за лекарствена терапия.",
  },
  {
    year: "2023",
    title: "Тирзепатид (Mounjaro/Zepbound)",
    desc: "Eli Lilly пуска първия dual GIP/GLP-1 агонист. SURMOUNT-1 показва 20.9% намаляване на тегло, нов рекорд в полето.",
    highlight: true,
  },
  {
    year: "2025",
    title: "Тройни агонисти и таблетни форми",
    desc: "TRIUMPH-1 публикувано: Ретатрутид (троен GLP-1/GIP/глюкагонов агонист) постига 24.2% намаляване на тегло. Орфорглипрон (орален GLP-1) одобрен.",
  },
  {
    year: "2026",
    title: "CagriSema, Сурводутид, Орфорглипрон",
    desc: "REDEFINE-1 потвърждава 22% загуба за CagriSema. SYNCHRONIZE-1 показва 19% за Сурводутид с регресия на MASH в 83%. Орфорглипрон достъпен орално без инжекции.",
    highlight: true,
  },
];

export function PeptideTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-1/2" />
      <div className="space-y-10">
        {events.map((event, i) => (
          <TimelineItem key={i} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ event, index }: { event: Event; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 }}
      className={`relative flex items-start gap-6 md:gap-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white border-2 border-navy md:absolute md:left-1/2 md:-translate-x-1/2">
        <div
          className={`h-2 w-2 rounded-full ${
            event.highlight ? "bg-accent" : "bg-navy"
          }`}
        />
      </div>

      <div
        className={`flex-1 md:w-1/2 ${
          isLeft ? "md:pr-12 md:text-right" : "md:pl-12"
        }`}
      >
        <div
          className={`inline-block rounded-2xl border p-5 ${
            event.highlight
              ? "border-accent/30 bg-accent-tint/30"
              : "border-border bg-white"
          }`}
        >
          <p
            className={`font-mono text-xs font-bold tracking-widest mb-2 ${
              event.highlight ? "text-accent" : "text-muted"
            }`}
          >
            {event.year}
          </p>
          <h3 className="font-display text-base font-bold text-navy mb-2 tracking-[-0.01em]">
            {event.title}
          </h3>
          <p className="text-sm text-secondary leading-relaxed">{event.desc}</p>
          {event.who && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted">
              {event.who}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
