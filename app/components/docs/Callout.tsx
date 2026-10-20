import type { ReactNode } from 'react';

interface CalloutProps {
  kind?: 'note' | 'warning';
  children: ReactNode;
}

export default function Callout({ kind = 'note', children }: CalloutProps) {
  const isWarning = kind === 'warning';
  return (
    <div
      className={`flex rounded-[10px] ${
        isWarning ? 'bg-[#FEF3C7] text-[#78350F]' : 'bg-surface-sky text-brand-navy'
      }`}
    >
      <div className={`w-1 shrink-0 rounded-l-[10px] ${isWarning ? 'bg-[#78350F]' : 'bg-brand-ocean'}`} />
      <div className="flex flex-col gap-1 px-[18px] py-3.5">
        <p className={`text-xs font-semibold ${isWarning ? '' : 'text-ink-eyebrow'}`}>
          {isWarning ? 'Warning' : 'Note'}
        </p>
        <div className="text-[15px] leading-[1.5]">{children}</div>
      </div>
    </div>
  );
}
