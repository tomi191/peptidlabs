import { ShieldAlert } from "lucide-react";

type Props = {
  text: string;
  heading: string;
};

export function SideEffectsCard({ text, heading }: Props) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert size={18} className="text-amber-600" />
        <h3 className="text-base font-semibold text-navy">{heading}</h3>
      </div>
      <p className="text-sm leading-relaxed text-secondary">{text}</p>
    </div>
  );
}
