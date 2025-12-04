'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64">
      <Link href="/">
        <Image
          src={'/svg/agentsea-logo.svg'}
          width={282}
          height={78}
          alt="AgentSea Logo"
        />
      </Link>
      <div className="sticky top-4">
        <ul className="menu bg-base-200 rounded-box w-full">
          {sections.map((section, idx) => (
            <li key={idx}>
              <h2 className="menu-title">{section.title}</h2>
              <ul>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={
                        pathname === link.href
                          ? 'active !text-primary-content'
                          : 'hover:!text-primary-content active:!text-primary-content'
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
    </aside>
  );
}
