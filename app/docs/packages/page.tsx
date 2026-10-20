import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import { packageVersion } from '../../components/docs/packageVersion';

export const metadata: Metadata = {
  title: 'Packages | AgentSea',
  description:
    'Each AgentSea package has its own page with install steps, an example, the key API and caveats.',
};

interface PackageCard {
  href: string;
  name: string;
  summary: string;
  /** npm packages show their version from package.json; others show pill. */
  npm?: boolean;
  pill?: string;
}

const packages: PackageCard[] = [
  {
    href: '/docs/packages/core',
    name: 'agentsea-core',
    summary: 'Framework-agnostic core library for building agentic AI applications in Node.js.',
    npm: true,
  },
  {
    href: '/docs/packages/cli',
    name: 'agentsea-cli',
    summary:
      'Command-line interface for the AgentSea ADK to set up providers, create agents, and chat or run them from a terminal.',
    npm: true,
  },
  {
    href: '/docs/packages/gateway',
    name: 'agentsea-gateway',
    summary:
      'An LLM gateway with an OpenAI-compatible API over OpenAI, Anthropic and Google providers, with routing, caching and metrics.',
    npm: true,
  },
  {
    href: '/docs/packages/guardrails',
    name: 'agentsea-guardrails',
    summary:
      'A guard engine that checks text for toxicity, PII, prompt injection, schema and budget limits, and applies a block, transform or warn action.',
    npm: true,
  },
  {
    href: '/docs/packages/crews',
    name: 'agentsea-crews',
    summary: 'Multi-agent orchestration for building teams of AI agents that work through a shared list of tasks.',
    npm: true,
  },
  {
    href: '/docs/packages/cache',
    name: 'agentsea-cache',
    summary: 'Semantic caching layer for LLM responses, using exact-match and semantic-similarity lookups.',
    npm: true,
  },
  {
    href: '/docs/packages/costs',
    name: 'agentsea-costs',
    summary: 'Records LLM usage costs with attribution to users or features, and enforces spending budgets.',
    npm: true,
  },
  {
    href: '/docs/packages/analytics',
    name: 'agentsea-analytics',
    summary:
      'Conversation analytics for AI agents, covering intent classification, flow analysis and sentiment tracking.',
    npm: true,
  },
  {
    href: '/docs/packages/memory',
    name: 'agentsea-memory',
    summary:
      'A memory store and retrieval layer for agents, with in-memory, Redis, PostgreSQL and SQLite backends.',
    npm: true,
  },
  {
    href: '/docs/packages/embeddings',
    name: 'agentsea-embeddings',
    summary:
      'Creates embeddings from OpenAI, Cohere, Voyage, HuggingFace or a custom function, chunks documents, and stores vectors.',
    npm: true,
  },
  {
    href: '/docs/packages/evaluate',
    name: 'agentsea-evaluate',
    summary: 'Runs an evaluation pipeline over a dataset with built-in metrics, LLM judges and preference export.',
    npm: true,
  },
  {
    href: '/docs/packages/prompts',
    name: 'agentsea-prompts',
    summary:
      'A self-hosted prompt registry. It stores prompt templates with versions and environments, renders them with Handlebars, runs A/B tests, and offers a client SDK for loading prompts at runtime.',
    npm: true,
  },
  {
    href: '/docs/packages/structured',
    name: 'agentsea-structured',
    summary: 'Extracts LLM output validated against a Zod schema, with retries and optional streaming.',
    npm: true,
  },
  {
    href: '/docs/packages/ingest',
    name: 'agentsea-ingest',
    summary:
      'Parses PDF, DOCX, HTML, Markdown, text, CSV, Excel and JSON files, chunks them, and runs them through a pipeline for RAG use.',
    npm: true,
  },
  {
    href: '/docs/packages/debugger',
    name: 'agentsea-debugger',
    summary: 'Records agent runs, sets breakpoints, replays recordings with changes, and runs what-if scenarios.',
    npm: true,
  },
  {
    href: '/docs/packages/redteam',
    name: 'agentsea-redteam',
    summary:
      'A toolkit for running attacks, vulnerability scans, benchmarks, compliance checks, audit logging and scheduled tests against an AI agent or LLM application.',
    npm: true,
  },
  {
    href: '/docs/packages/surf',
    name: 'agentsea-surf',
    summary:
      "A computer-use agent that controls a desktop, a browser, or a Docker desktop. It takes screenshots and performs mouse and keyboard actions, using Claude's vision capabilities.",
    npm: true,
  },
  {
    href: '/docs/packages/react',
    name: 'agentsea-react',
    summary: 'React components that render agent response text as formatted markdown.',
    npm: true,
  },
  {
    href: '/docs/packages/nestjs',
    name: 'agentsea-nestjs',
    summary: 'A NestJS module that exposes AgentSea agents over REST and WebSocket endpoints.',
    npm: true,
  },
  {
    href: '/docs/packages/types',
    name: 'agentsea-types',
    summary: 'Shared TypeScript type definitions for the AgentSea ADK.',
    npm: true,
  },
  {
    href: '/docs/packages/admin-ui',
    name: 'admin-ui',
    summary: 'Self-hosted web interface for creating and managing AI agents, workflows, tools and providers.',
    pill: 'private',
  },
  {
    href: '/docs/elixir',
    name: 'agentsea (Elixir)',
    summary: 'An Elixir/OTP implementation of AgentSea.',
    pill: 'unreleased',
  },
];

const toc = packages.map((pkg) => ({ id: pkg.href.split('/').pop() ?? pkg.href, label: pkg.name }));

export default function Page() {
  return (
    <DocsShell
      eyebrow="Reference"
      title="Packages"
      lead="Each package has its own page with install steps, an example, the key API and caveats."
      active="packages"
      toc={toc}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {packages.map((pkg) => {
          const id = pkg.href.split('/').pop() ?? pkg.href;
          return (
            <Link
              key={pkg.href}
              id={id}
              href={pkg.href}
              className="scroll-mt-8 flex flex-col gap-2.5 rounded-[14px] border border-rule bg-surface-paper p-[22px] hover:bg-surface-sky"
            >
              <span className="w-fit rounded-full border border-rule px-2.5 py-[3px] font-mono text-xs font-semibold text-ink-eyebrow">
                {pkg.npm ? `v${packageVersion(`@lov3kaizen/${pkg.name}`)}` : pkg.pill}
              </span>
              <h2 className="font-mono text-lg font-semibold text-brand-deep">{pkg.name}</h2>
              <p className="text-[15px] leading-relaxed text-brand-navy">{pkg.summary}</p>
            </Link>
          );
        })}
      </div>
    </DocsShell>
  );
}
