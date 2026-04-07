import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export function ProductFaq({
  heading,
  items,
}: {
  heading: string;
  items: FaqItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-lg font-bold text-navy">{heading}</h2>
      <div className="mt-6">
        {items.map((item) => (
          <details key={item.question} className="group border-b border-border">
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
        ))}
      </div>
    </section>
  );
}
