type Props = {
  index: string; // "01", "02"...
  total: string; // "09"
  label: string; // "HERO", "ПРЕПОРЪКИ"
  className?: string;
};

export function SectionMarker({ index, total, label, className = "" }: Props) {
  return (
    <div
      className={`flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted uppercase ${className}`}
      aria-hidden="true"
    >
      <span>
        [{index}/{total}]
      </span>
      <span className="h-px w-6 bg-border" />
      <span>{label}</span>
    </div>
  );
}
