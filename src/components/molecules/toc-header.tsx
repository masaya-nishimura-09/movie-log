type TocHeaderProps = {
  label: string;
  title: string;
  summary?: string;
};

export function TocHeader({ label, title, summary }: TocHeaderProps) {
  return (
    <div className="flex h-16 items-end justify-between gap-4 lg:h-21 lg:pb-1.5">
      <div>
        <p className="font-semibold text-[10px] text-paper-label leading-4.5 tracking-[0.24em] lg:text-[11px] lg:leading-5">
          {label}
        </p>
        <h1 className="font-bold font-display text-[28px] leading-10 lg:text-[40px] lg:leading-13 lg:tracking-[0.02em]">
          {title}
        </h1>
      </div>
      {summary && (
        <p className="text-[11px] text-paper-muted leading-6 lg:text-xs">
          {summary}
        </p>
      )}
    </div>
  );
}
