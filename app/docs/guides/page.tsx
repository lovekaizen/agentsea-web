import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';

export const metadata: Metadata = {
  title: 'Guides | AgentSea',
  description:
    'AgentSea guides. Each guide covers one task, from a local model setup to a coding session, with a code example.',
};

const guides = [
  {
    id: 'local-models',
    href: '/docs/local-models',
    title: 'Local models',
    body: 'Run agents against models on your own machine or on a self-hosted server that speaks the OpenAI chat API.',
  },
  {
    id: 'voice',
    href: '/docs/voice',
    title: 'Voice',
    body: 'Speech-to-text and text-to-speech providers, and a VoiceAgent that places an agent between them.',
  },
  {
    id: 'mcp',
    href: '/docs/mcp-overview',
    title: 'MCP',
    body: 'Connect an agent to MCP servers and give the agent the tools those servers provide.',
  },
  {
    id: 'acp',
    href: '/docs/acp-integration',
    title: 'ACP',
    body: 'Give an agent commerce tools that call an ACP-compliant backend through ACPClient.',
  },
  {
    id: 'nestjs',
    href: '/docs/nestjs',
    title: 'NestJS',
    body: 'Add AgentSea to a NestJS app with AgenticModule, optional REST and WebSocket routes, and decorator-based agents.',
  },
  {
    id: 'multi-tenancy',
    href: '/docs/multi-tenancy',
    title: 'Multi-tenancy',
    body: 'Create tenants, issue and verify API keys, track quotas, and keep conversation memory separate for each tenant.',
  },
  {
    id: 'formatting',
    href: '/docs/formatting',
    title: 'Formatting',
    body: 'Ask an agent for text, Markdown, HTML or React output, and read the formatted field on the response.',
  },
  {
    id: 'cli',
    href: '/docs/cli',
    title: 'CLI coding',
    body: 'Start an interactive coding session in a project directory with the sea code command.',
  },
  {
    id: 'mcp-servers',
    href: '/docs/mcp-servers',
    title: 'MCP servers',
    body: 'Explore popular MCP servers and learn how to integrate them with your AgentSea agents.',
  },
  {
    id: 'mcp-tools',
    href: '/docs/mcp-tools',
    title: 'MCP tools',
    body: 'Pre-built Model Context Protocol tools for Figma and n8n integrations.',
  },
  {
    id: 'agentic-coding',
    href: '/docs/agentic-coding',
    title: 'Agentic coding',
    body: 'Launch an interactive AI coding session with 13 built-in tools: file operations, code editing, search, shell, and git.',
  },
  {
    id: 'react-hooks',
    href: '/docs/react-hooks',
    title: 'React hooks',
    body: 'Build AI-powered React applications with hooks for chat interfaces and agent execution.',
  },
];

const toc = guides.map((guide) => ({ id: guide.id, label: guide.title }));

export default function GuidesPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="AgentSea Guides"
      lead="Each guide covers one task, from a local model setup to a coding session, with a code example."
      active="guides"
      toc={toc}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((guide, index) => (
          <Link
            key={guide.id}
            id={guide.id}
            href={guide.href}
            className="flex scroll-mt-8 flex-col gap-3 rounded-xl border border-rule bg-surface-paper p-[22px] transition-colors hover:bg-surface-sky"
          >
            <span className="w-fit rounded-full bg-brand-tint px-2.5 py-[3px] font-mono text-xs font-semibold text-ink-eyebrow">
              Guide {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="text-lg font-semibold text-brand-deep">{guide.title}</h2>
            <p className="text-[15px] leading-relaxed text-brand-navy">{guide.body}</p>
          </Link>
        ))}
      </div>
    </DocsShell>
  );
}
