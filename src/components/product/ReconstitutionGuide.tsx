import { FlaskConical } from "lucide-react";

type Props = {
  text: string;
  heading: string;
};

export function ReconstitutionGuide({ text, heading }: Props) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="flex items-center gap-2 mb-3">
        <FlaskConical size={18} className="text-teal-600" />
        <h3 className="text-base font-semibold text-navy">{heading}</h3>
      </div>
      <p className="text-sm leading-relaxed text-secondary">{text}</p>
    </div>
  );
}
