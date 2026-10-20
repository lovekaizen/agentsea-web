interface CodeBlockProps {
  /** Language label shown in the header strip, e.g. "TS" or "BASH". */
  lang: string;
  code: string;
}

export default function CodeBlock({ lang, code }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-code">
      <div className="bg-surface-code-strip px-4 py-2 text-[11px] font-semibold tracking-wide text-[#7DD3FC]">
        {lang.toUpperCase()}
      </div>
      <pre className="overflow-x-auto px-5 pb-[18px] pt-4 font-mono text-sm leading-[1.5] text-brand-tint">
        <code>{code}</code>
      </pre>
    </div>
  );
}
