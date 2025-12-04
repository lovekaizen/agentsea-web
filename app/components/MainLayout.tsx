'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AGENTSEA_VERSION } from '../constants';

interface NavLink {
  href: string;
  label: string;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

const sections: NavSection[] = [
  {
    title: 'Getting Started',
    links: [
      { href: '/', label: 'Home' },
      { href: '/docs', label: 'Documentation' },
      { href: '/docs/installation', label: 'Installation' },
      { href: '/docs/quick-start', label: 'Quick Start' },
      { href: '/docs/cli', label: 'CLI Tool' },
    ],
  },
  {
    title: 'Core Concepts',
    links: [
      { href: '/docs/agents', label: 'Agents' },
      { href: '/docs/providers', label: 'Providers' },
      { href: '/docs/local-providers', label: 'Local Providers' },
      { href: '/docs/tools', label: 'Tools' },
      { href: '/docs/workflows', label: 'Workflows' },
      { href: '/docs/memory', label: 'Memory' },
      { href: '/docs/formatting', label: 'Content Formatting' },
      { href: '/docs/conversation', label: 'Conversation' },
    ],
  },
  {
    title: 'Features',
    links: [
      { href: '/docs/voice', label: 'Voice (TTS/STT)' },
      { href: '/docs/local-models', label: 'Local Models' },
      { href: '/docs/acp-integration', label: 'ACP Commerce' },
      { href: '/api', label: 'REST API & Streaming' },
    ],
  },
  {
    title: 'MCP Integration',
    links: [
      { href: '/docs/mcp-overview', label: 'Overview' },
      { href: '/docs/mcp-servers', label: 'MCP Servers' },
      { href: '/docs/mcp-tools', label: 'MCP Tools (Figma & n8n)' },
    ],
  },
  {
    title: 'Advanced',
    links: [
      { href: '/docs/multi-tenancy', label: 'Multi-Tenancy' },
      { href: '/docs/observability', label: 'Observability' },
      { href: '/docs/nestjs', label: 'NestJS Integration' },
    ],
  },
  {
    title: 'Resources',
    links: [{ href: '/examples', label: 'Examples' }],
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDocsPage =
    pathname.startsWith('/docs') ||
    pathname === '/api' ||
    pathname === '/examples';
  const isHomePage = pathname === '/';

  return (
    <div className="relative">
      <input id="main-drawer" type="checkbox" className="peer hidden" />

      {/* Overlay when drawer is open - only show on docs pages */}
      {isDocsPage && (
        <label
          htmlFor="main-drawer"
          className="fixed inset-0 bg-black/50 z-30 hidden peer-checked:block lg:peer-checked:hidden"
        />
      )}

      {/* Main content */}
      <div className={isDocsPage ? 'lg:pl-80' : ''}>
        {!isHomePage && (
          <div className="flex items-center justify-between pr-4 pl-24 py-4 lg:px-8">
            <div className="small">
              <a
                href="https://github.com/lovekaizen/agentsea"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                title="AgentSea on Github"
              >
                {AGENTSEA_VERSION} release
              </a>{' '}
              - Contributors, Sponsors and Enquiries are most welcome 😌
            </div>
            <div className="flex-none">
              <a
                href="https://github.com/lovekaizen/agentsea"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle"
                title="AgentSea on Github"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        )}

        <main className={`flex-1 ${isDocsPage ? 'pl-16 lg:pl-0' : ''}`}>
          {children}
        </main>

        <footer
          className={`footer footer-center bg-base-100 border-t border-base-300 p-10 ${
            isDocsPage ? 'ml-16 lg:ml-0' : ''
          }`}
        >
          <div>
            <nav className="grid grid-flow-col gap-6 mb-4">
              <Link
                href="/docs/voice"
                className="link link-hover text-base-content/70 hover:text-base-content transition-colors"
              >
                Voice Features
              </Link>
              <Link
                href="/docs/local-models"
                className="link link-hover text-base-content/70 hover:text-base-content transition-colors"
              >
                Local Models
              </Link>
              <Link
                href="/docs/cli"
                className="link link-hover text-base-content/70 hover:text-base-content transition-colors"
              >
                CLI Tool
              </Link>
              <Link
                href="/api"
                className="link link-hover text-base-content/70 hover:text-base-content transition-colors"
              >
                REST API
              </Link>
            </nav>
            <nav className="grid grid-flow-col gap-6 mb-6">
              <a
                href="https://github.com/lovekaizen/agentsea"
                className="link link-hover text-base-content/70 hover:text-base-content transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/lovekaizen/agentsea/discussions"
                className="link link-hover text-base-content/70 hover:text-base-content transition-colors"
              >
                Discussions
              </a>
              <a
                href="https://github.com/lovekaizen/agentsea/issues"
                className="link link-hover text-base-content/70 hover:text-base-content transition-colors"
              >
                Issues
              </a>
            </nav>
            <aside>
              <p className="text-base-content/60">
                © 2025{' '}
                <span className="text-gradient-animated font-semibold">
                  AgentSea ADK
                </span>
                . MIT License.
              </p>
            </aside>
          </div>
        </footer>
      </div>

      {/* Narrow sidebar when closed - only show on docs pages */}
      {isDocsPage && (
        <aside className="fixed left-0 top-0 h-full bg-base-200 border-r border-base-300 z-20 w-16 flex items-start justify-center pt-4 lg:hidden">
          <label htmlFor="main-drawer" className="btn btn-ghost btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </aside>
      )}

      {/* Expanded sidebar when open - only show on docs pages */}
      {isDocsPage && (
        <aside className="fixed left-0 top-0 h-full bg-base-200 border-r border-base-300 z-40 w-80 transition-transform duration-300 -translate-x-full peer-checked:translate-x-0 lg:translate-x-0">
          <div className="flex flex-col h-full">
            {/* Header with logo */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <Link href="/" className="btn btn-ghost px-0 py-2">
                <Image
                  src={'/svg/agentsea-logo.svg'}
                  width={160}
                  height={44}
                  alt="AgentSea Logo"
                />
              </Link>
              <label
                htmlFor="main-drawer"
                className="btn btn-ghost btn-square btn-sm lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </label>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto">
              <ul className="menu p-4">
                {sections.map((section, idx) => (
                  <li key={idx}>
                    <h2 className="menu-title text-gradient-purple font-semibold">
                      {section.title}
                    </h2>
                    <ul>
                      {section.links.map((link) => (
                        <li key={link.href} className="pl-2">
                          <Link
                            href={link.href}
                            className={
                              pathname === link.href
                                ? 'active bg-gradient-to-r from-sky-600/20 to-cyan-500/20 border-l-2 border-cyan-500 !text-white font-medium'
                                : 'hover:bg-gradient-to-r hover:from-sky-600/10 hover:to-cyan-500/10 transition-all'
                            }
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
