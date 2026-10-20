import Link from 'next/link';
import type { ReactNode } from 'react';
import SiteFooter from './SiteFooter';
import SiteTopBar from './SiteTopBar';

export type NavKey = 'getting-started' | 'concepts' | 'guides' | 'api' | 'packages' | 'changelog';

export const DOCS_NAV: { key: NavKey; label: string; href: string }[] = [
  { key: 'getting-started', label: 'Getting started', href: '/docs' },
  { key: 'concepts', label: 'Concepts', href: '/docs/concepts' },
  { key: 'guides', label: 'Guides', href: '/docs/guides' },
  { key: 'api', label: 'API reference', href: '/api' },
  { key: 'packages', label: 'Packages', href: '/docs/packages' },
  { key: 'changelog', label: 'Changelog', href: '/changelog' },
];

export interface TocItem {
  id: string;
  label: string;
}

interface DocsShellProps {
  /** Small label above the title, e.g. "Guide", "Package", "Reference". */
  eyebrow: string;
  title: string;
  lead?: string;
  /** Pills shown under the lead, e.g. the package version. */
  badges?: string[];
  /** Highlights the matching item in the Documentation sidebar. */
  active?: NavKey;
  /** Anchors listed in the "On this page" column. */
  toc: TocItem[];
  children: ReactNode;
}

/**
 * Page chrome shared by every docs page: top bar, header band, the three-column
 * body (sidebar, main, on-this-page) and the footer. Sections go in `children`.
 */
export default function DocsShell({ eyebrow, title, lead, badges = [], active, toc, children }: DocsShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-paper text-brand-navy">
      <SiteTopBar />

      <div className="bg-surface-band">
        <header className="mx-auto grid w-full max-w-[1440px] gap-3 px-4 pb-12 pt-14 md:px-14 lg:grid-cols-[220px_minmax(0,820px)_180px] lg:gap-12">
          <div className="hidden lg:block" aria-hidden="true" />
          <div className="flex min-w-0 flex-col gap-3">
            <p className="text-label text-ink-eyebrow">{eyebrow}</p>
            <h1 className="text-[44px] font-bold leading-tight text-brand-deep">{title}</h1>
            {lead && <p className="text-xl leading-relaxed text-brand-navy">{lead}</p>}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-rule bg-surface-paper px-2.5 py-[3px] text-label text-ink-eyebrow"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 gap-12 px-4 pb-24 pt-12 md:px-14 lg:grid-cols-[220px_minmax(0,820px)_180px]">
        <nav aria-label="Documentation" className="flex flex-col gap-1 lg:sticky lg:top-6 lg:self-start">
          <p className="mb-1 hidden text-xs font-semibold text-ink-muted lg:block">Documentation</p>
          <div className="flex flex-wrap gap-1 lg:flex-col">
            {DOCS_NAV.map((item) => {
              const isActive = item.key === active;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-lg px-3 py-[7px] text-[15px] ${
                    isActive
                      ? 'bg-brand-tint font-semibold text-brand-deep'
                      : 'text-brand-navy hover:bg-surface-sky'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <main id="main" className="flex min-w-0 flex-col gap-9">
          {children}
        </main>

        <aside aria-label="On this page" className="hidden lg:sticky lg:top-6 lg:flex lg:self-start lg:flex-col lg:gap-2.5">
          {toc.length > 0 && (
            <>
              <p className="text-xs font-semibold text-ink-muted">On this page</p>
              {toc.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="text-sm text-brand-navy hover:text-brand-deep">
                  {item.label}
                </a>
              ))}
            </>
          )}
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
