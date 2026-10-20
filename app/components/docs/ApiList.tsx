import type { ReactNode } from 'react';

export function ApiList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

interface ApiRowProps {
  /** Signature shown in monospace, e.g. "Agent.execute(input, context)". */
  name: string;
  children: ReactNode;
}

export function ApiRow({ name, children }: ApiRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-rule bg-surface-paper px-[18px] py-3.5 md:flex-row md:gap-4">
      <code className="font-mono text-sm leading-[1.4] break-words text-brand-deep md:w-[330px] md:shrink-0">
        {name}
      </code>
      <div className="text-[15px] leading-[1.4] text-brand-navy">{children}</div>
    </div>
  );
}
