import type { Metadata } from 'next';
import DocsShell from '../components/docs/DocsShell';
import DocSection from '../components/docs/DocSection';
import CodeBlock from '../components/docs/CodeBlock';
import Callout from '../components/docs/Callout';
import BulletPanel from '../components/docs/BulletPanel';
import { ApiList, ApiRow } from '../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Design system | AgentSea',
  description: 'Colours, text styles and components for the AgentSea docs.',
  robots: { index: false, follow: false },
};

const toc = [
  { id: 'colours', label: 'Colour styles' },
  { id: 'text-styles', label: 'Text styles' },
  { id: 'components', label: 'Components' },
];

/*
 * Colour tokens from tailwind.config.ts. The three design-only colours
 * (Text/On code, Warning/Background, Warning/Text) are hard-coded in the
 * components, not Tailwind tokens, so they are shown with their hex value.
 */
const colours = [
  { name: 'Brand/Ocean', token: 'brand-ocean', hex: '#0284C7', swatch: 'bg-brand-ocean' },
  { name: 'Brand/Deep', token: 'brand-deep', hex: '#0C4A6E', swatch: 'bg-brand-deep' },
  { name: 'Brand/Navy', token: 'brand-navy', hex: '#1E3A5F', swatch: 'bg-brand-navy' },
  { name: 'Brand/Seafoam', token: 'brand-seafoam', hex: '#2DD4BF', swatch: 'bg-brand-seafoam' },
  { name: 'Brand/Tint', token: 'brand-tint', hex: '#E0F2FE', swatch: 'bg-brand-tint' },
  { name: 'Surface/Paper', token: 'surface-paper', hex: '#FFFFFF', swatch: 'bg-surface-paper' },
  { name: 'Surface/Sky', token: 'surface-sky', hex: '#F0F9FF', swatch: 'bg-surface-sky' },
  { name: 'Surface/Band', token: 'surface-band', hex: '#E6F4FB', swatch: 'bg-surface-band' },
  { name: 'Surface/Code', token: 'surface-code', hex: '#0B1F33', swatch: 'bg-surface-code' },
  { name: 'Surface/Code strip', token: 'surface-code-strip', hex: '#12314D', swatch: 'bg-surface-code-strip' },
  { name: 'Text/Muted', token: 'ink-muted', hex: '#4B6B84', swatch: 'bg-ink-muted' },
  { name: 'Text/Eyebrow', token: 'ink-eyebrow', hex: '#0369A1', swatch: 'bg-ink-eyebrow' },
  { name: 'Line/Rule', token: 'rule', hex: '#D6E6F0', swatch: 'bg-rule' },
  { name: 'Text/On code', token: 'not a token', hex: '#E0F2FE', swatch: 'bg-[#E0F2FE]' },
  { name: 'Warning/Background', token: 'not a token', hex: '#FEF3C7', swatch: 'bg-[#FEF3C7]' },
  { name: 'Warning/Text', token: 'not a token', hex: '#78350F', swatch: 'bg-[#78350F]' },
];

const textStyles = [
  { name: 'Display/Hero', size: '56px', weight: 'Bold', className: 'text-[56px] font-bold leading-[1.15]' },
  { name: 'Heading/Title', size: '44px', weight: 'Bold', className: 'text-[44px] font-bold leading-tight' },
  { name: 'Heading/Page', size: '40px', weight: 'Bold', className: 'text-[40px] font-bold leading-tight' },
  { name: 'Heading/Section', size: '26px', weight: 'SemiBold', className: 'text-[26px] font-semibold' },
  { name: 'Heading/Subsection', size: '24px', weight: 'SemiBold', className: 'text-2xl font-semibold' },
  { name: 'Heading/Card large', size: '20px', weight: 'SemiBold', className: 'text-xl font-semibold' },
  { name: 'Heading/Card', size: '18px', weight: 'SemiBold', className: 'text-lg font-semibold' },
  { name: 'Text/Lead', size: '20px', weight: 'Regular', className: 'text-xl leading-relaxed' },
  { name: 'Text/Body', size: '16px', weight: 'Regular', className: 'text-base leading-relaxed' },
  { name: 'Text/Label', size: '16px', weight: 'SemiBold', className: 'text-base font-semibold' },
  { name: 'Text/Small', size: '15px', weight: 'Regular', className: 'text-[15px] leading-[1.5]' },
  { name: 'Text/Caption', size: '14px', weight: 'Regular', className: 'text-sm' },
  { name: 'Text/Eyebrow', size: '13px', weight: 'SemiBold', className: 'text-label text-ink-eyebrow' },
  { name: 'Text/Micro', size: '12px', weight: 'SemiBold', className: 'text-xs font-semibold' },
  { name: 'Code/Block', size: '14px', weight: 'JetBrains Mono', className: 'font-mono text-sm' },
  { name: 'Code/Inline', size: '13px', weight: 'JetBrains Mono', className: 'font-mono text-[13px]' },
];

export default function DesignSystemPage() {
  return (
    <DocsShell
      eyebrow="Design system"
      title="Design system"
      lead="Colours, text styles and components for the AgentSea docs. Styles are linked: changing a style updates every layer that uses it."
      toc={toc}
    >
      <DocSection id="colours" title="Colour styles">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colours.map((colour) => (
            <div key={colour.name} className="flex flex-col gap-2 rounded-xl border border-rule bg-surface-paper p-3">
              <div className={`h-12 rounded-lg border border-rule ${colour.swatch}`} aria-hidden="true" />
              <p className="text-sm font-semibold text-brand-deep">{colour.name}</p>
              <p className="font-mono text-[13px] text-ink-muted">{colour.hex}</p>
              {colour.token !== 'not a token' && (
                <p className="font-mono text-xs text-ink-muted">{colour.token}</p>
              )}
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="text-styles" title="Text styles">
        <div className="flex flex-col gap-4">
          {textStyles.map((style) => (
            <div
              key={style.name}
              className="flex flex-col gap-1 border-b border-rule pb-4 md:flex-row md:items-baseline md:gap-6"
            >
              <p className="w-full shrink-0 text-label text-ink-eyebrow md:w-[220px]">
                {style.name}
                <span className="block text-xs font-normal text-ink-muted">
                  {style.size}, {style.weight}
                </span>
              </p>
              <p className={`min-w-0 break-words text-brand-navy ${style.className}`}>The quick brown fox</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="components" title="Components">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-brand-deep">Pill</h3>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-tint px-2.5 py-[3px] font-mono text-xs font-semibold text-ink-eyebrow">
              01
            </span>
            <span className="rounded-full border border-rule bg-surface-paper px-2.5 py-[3px] text-label text-ink-eyebrow">
              Guide
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-brand-deep">Code block</h3>
          <CodeBlock lang="TS" code={`const agent = new Agent(config, provider, tools);`} />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-brand-deep">Callouts</h3>
          <Callout kind="note">body</Callout>
          <Callout kind="warning">body</Callout>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-brand-deep">API row</h3>
          <ApiList>
            <ApiRow name="name">desc</ApiRow>
          </ApiList>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-brand-deep">Bullet panel</h3>
          <BulletPanel items={['item']} />
        </div>
      </DocSection>
    </DocsShell>
  );
}
