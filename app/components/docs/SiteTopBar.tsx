import Image from 'next/image';
import Link from 'next/link';

export const GITHUB_URL = 'https://github.com/lovekaizen/agentsea';

const navLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/api', label: 'API' },
  { href: '/docs/packages', label: 'Packages' },
  { href: '/changelog', label: 'Changelog' },
];

export default function SiteTopBar() {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between bg-brand-deep px-4 md:px-16">
      <Link href="/" aria-label="AgentSea home" className="shrink-0">
        <Image
          src="/svg/agentsea-logo.svg"
          alt="AgentSea"
          width={90}
          height={28}
          priority
          className="h-7 w-auto brightness-0 invert"
        />
      </Link>

      <nav aria-label="Primary" className="hidden items-center gap-8 text-[15px] text-brand-tint md:flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4 text-sm text-brand-tint md:gap-4">
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
          GitHub
        </a>
        <Link
          href="/docs"
          className="rounded-lg bg-brand-seafoam px-4 py-2 text-sm font-semibold text-brand-deep hover:brightness-95"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
