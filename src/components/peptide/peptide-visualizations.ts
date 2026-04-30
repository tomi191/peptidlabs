/* Server-safe data registry for PeptideMechanism visualizations.
   No "use client" — can be imported from server components. */

import type { PeptideMechanismData } from "./PeptideMechanism";

const GHK_CU_DATA: PeptideMechanismData = {
  hero: {
    title: { bg: "Синият елексир", en: "The Blue Elixir" },
    subtitle: {
      bg: "GHK свързва меден йон Cu²⁺ — резултатът е дълбок син цвят от d-d електронни преходи",
      en: "GHK binds a copper ion Cu²⁺ — the result is a deep blue from d-d electronic transitions",
    },
    liquidColor: "#1e40af",
  },
  bodyMap: {
    title: { bg: "Къде действа в тялото", en: "Where it acts in the body" },
    markers: [
      {
        id: "skin",
        x: 52,
        y: 24,
        label: { bg: "Кожа", en: "Skin" },
        detail: {
          bg: "Стимулира фибробластите да синтезират колаген, еластин и декорин — изгражда матрикса на дермата",
          en: "Stimulates fibroblasts to synthesize collagen, elastin and decorin — building the dermal matrix",
        },
        stat: "70% повече колаген",
        iconKey: "sparkles",
      },
      {
        id: "mitochondria",
        x: 38,
        y: 42,
        label: { bg: "Митохондрии", en: "Mitochondria" },
        detail: {
          bg: "Доставя меден йон до cytochrome c oxidase — централния ензим, който произвежда ATP в клетката",
          en: "Delivers copper to cytochrome c oxidase — the central enzyme producing ATP in the cell",
        },
        stat: "Възстановява енергиен метаболизъм",
        iconKey: "zap",
      },
      {
        id: "dna",
        x: 62,
        y: 56,
        label: { bg: "ДНК (ядро)", en: "DNA (nucleus)" },
        detail: {
          bg: "Модулира експресията на 4000+ човешки гена — активира DNA repair, потиска раково-свързани",
          en: "Modulates expression of 4000+ human genes — activates DNA repair, suppresses cancer-related",
        },
        stat: "31% от генома",
        iconKey: "dna",
      },
    ],
  },
  decline: {
    title: { bg: "Възрастов спад в плазмата", en: "Age-related plasma decline" },
    yAxisUnit: "ng/mL",
    points: [
      { age: 20, value: 200, callout: { bg: "Пик", en: "Peak" } },
      { age: 30, value: 170 },
      { age: 40, value: 140 },
      { age: 50, value: 110 },
      {
        age: 60,
        value: 80,
        callout: { bg: "−60% спрямо 20", en: "−60% from age 20" },
      },
    ],
  },
  comparison: {
    title: {
      bg: "Колагенова синтеза vs алтернативи",
      en: "Collagen synthesis vs alternatives",
    },
    yAxisUnit: "% жени с измерима синтеза",
    bars: [
      {
        label: "GHK-Cu",
        value: 70,
        highlight: true,
        caption: { bg: "Pickart 2018", en: "Pickart 2018" },
      },
      { label: "Витамин C", value: 50 },
      { label: "Ретиноева киселина", value: 40 },
    ],
  },
};

export const PEPTIDE_VISUALIZATIONS: Record<string, PeptideMechanismData> = {
  "ghk-cu-50mg": GHK_CU_DATA,
};

export function getPeptideVisualization(
  slug: string,
): PeptideMechanismData | null {
  return PEPTIDE_VISUALIZATIONS[slug] ?? null;
}
