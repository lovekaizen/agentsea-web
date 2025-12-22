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
      { href: '/docs/per-model-type-safety', label: 'Per-Model Type Safety' },
      { href: '/docs/local-providers', label: 'Local Providers' },
      { href: '/docs/tools', label: 'Tools' },
      { href: '/docs/workflows', label: 'Workflows' },
      { href: '/docs/memory', label: 'Memory' },
      { href: '/docs/formatting', label: 'Content Formatting' },
      { href: '/docs/conversation', label: 'Conversation' },
    ],
  },
  {
    title: 'Packages',
    links: [
      { href: '/docs/crews', label: 'Crews (Multi-Agent)' },
      { href: '/docs/gateway', label: 'Gateway (LLM Routing)' },
      { href: '/docs/guardrails', label: 'Guardrails (Safety)' },
      { href: '/docs/evaluate', label: 'Evaluate (LLM Quality)' },
      { href: '/docs/embeddings', label: 'Embeddings (Vectors)' },
      { href: '/docs/surf', label: 'Surf (Browser Automation)' },
    ],
  },
  {
    title: 'Features',
    links: [
      { href: '/docs/react-hooks', label: 'React Hooks' },
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
                          ? 'bg-gradient-to-r from-primary/20 via-secondary/15 to-accent/10 text-primary font-medium border-l-2 border-primary'
                          : 'hover:bg-gradient-to-r hover:from-primary/10 hover:via-secondary/5 hover:to-transparent hover:text-primary transition-all duration-200'
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
