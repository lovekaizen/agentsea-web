import type { ReactNode } from 'react';

interface DocSectionProps {
  id: string;
  /** Two-digit number shown in the pill, e.g. "01". Omit for an unnumbered section. */
  num?: string;
  title: string;
  children: ReactNode;
}

export default function DocSection({ id, num, title, children }: DocSectionProps) {
  return (
    <section id={id} className="flex scroll-mt-8 flex-col gap-3.5">
      <h2 className="flex items-center gap-3 text-2xl font-semibold text-brand-deep">
        {num && (
          <span className="rounded-full bg-brand-tint px-2.5 py-[3px] font-mono text-xs font-semibold text-ink-eyebrow">
            {num}
          </span>
        )}
        {title}
      </h2>
      {children}
    </section>
  );
}
