import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

function FaqAccordionItem({ item }: { item: FaqItem }) {
  return (
    <details className="group border-b border-border">
      <summary className="flex cursor-pointer items-center justify-between py-4 text-sm font-semibold text-navy">
        <span>{item.question}</span>
        <ChevronDown
          size={16}
          className="shrink-0 text-muted transition-transform group-open:rotate-180"
        />
      </summary>
      <p className="pb-4 text-sm leading-relaxed text-secondary">
        {item.answer}
      </p>
    </details>
  );
}

export function ProductFaq({
  heading,
  items,
}: {
  heading: string;
  items: FaqItem[];
}) {
  if (items.length === 0) return null;

  const midpoint = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, midpoint);
  const rightColumn = items.slice(midpoint);

  return (
    <section>
      <h2 className="text-lg font-bold text-navy">{heading}</h2>
      <div className="mt-6 grid grid-cols-1 gap-x-8 lg:grid-cols-2">
        <div>
          {leftColumn.map((item) => (
            <FaqAccordionItem key={item.question} item={item} />
          ))}
        </div>
        <div>
          {rightColumn.map((item) => (
            <FaqAccordionItem key={item.question} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
