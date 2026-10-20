import Link from 'next/link';
import { GITHUB_URL } from './SiteTopBar';

const docsLinks = [
  { href: '/docs', label: 'Getting started' },
  { href: '/docs/concepts', label: 'Concepts' },
  { href: '/docs/guides', label: 'Guides' },
  { href: '/api', label: 'API reference' },
  { href: '/docs/packages', label: 'Packages' },
  { href: '/changelog', label: 'Changelog' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-surface-sky px-4 py-12 md:px-14">
      <div className="mx-auto flex max-w-[1328px] flex-col gap-10 md:flex-row md:gap-24">
        <div className="flex flex-col gap-1.5 md:w-80">
          <p className="text-base font-semibold text-brand-deep">AgentSea</p>
          <p className="text-sm text-ink-muted">MIT licence. Open source TypeScript ADK.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-label text-ink-eyebrow">Docs</p>
          {docsLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-brand-navy hover:text-brand-deep">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-label text-ink-eyebrow">Community</p>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-navy hover:text-brand-deep">
            GitHub
          </a>
          <a href={`${GITHUB_URL}/discussions`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-navy hover:text-brand-deep">
            Discussions
          </a>
          <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-navy hover:text-brand-deep">
            Issues
          </a>
        </div>
      </div>
    </footer>
  );
}
