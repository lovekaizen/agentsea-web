import type { ReactNode } from 'react';

export default function BulletPanel({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2.5 rounded-xl border border-rule bg-surface-paper px-5 py-[18px] text-[15px] leading-[1.5] text-brand-navy">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span aria-hidden="true" className="text-ink-eyebrow">
            •
          </span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}
