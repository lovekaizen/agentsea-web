import Image from 'next/image';
import Link from 'next/link';

const GITHUB_URL = 'https://github.com/lovekaizen/agentsea';

const features = [
  {
    title: 'Any major provider',
    body: 'Anthropic, OpenAI and Google Gemini, plus local models through Ollama, LM Studio and vLLM.',
  },
  {
    title: 'Tools, memory and crews',
    body: 'Built-in tools, episodic and semantic memory, and role-based multi-agent crews with delegation.',
  },
  {
    title: 'Guardrails and evaluation',
    body: 'Content safety, prompt injection detection, PII filtering, LLM-as-judge metrics and red-team tests.',
  },
];

const packages = [
  {
    name: '@lov3kaizen/agentsea-core',
    href: '/docs/installation',
    body: 'Framework-agnostic core library for building agentic AI applications in Node.js.',
  },
  {
    name: '@lov3kaizen/agentsea-cli',
    href: '/docs/cli',
    body: 'Command-line interface for the AgentSea ADK to set up providers, create agents, and chat or run them from a terminal.',
  },
  {
    name: '@lov3kaizen/agentsea-gateway',
    href: '/docs/gateway',
    body: 'An LLM gateway with an OpenAI-compatible API over OpenAI, Anthropic and Google providers, with routing, caching and metrics.',
  },
  {
    name: '@lov3kaizen/agentsea-guardrails',
    href: '/docs/guardrails',
    body: 'A guard engine that checks text for toxicity, PII, prompt injection, schema and budget limits, and applies a block, transform or warn action.',
  },
  {
    name: '@lov3kaizen/agentsea-crews',
    href: '/docs/crews',
    body: 'Multi-agent orchestration for building teams of AI agents that work through a shared list of tasks.',
  },
  {
    name: '@lov3kaizen/agentsea-memory',
    href: '/docs/memory',
    body: 'A memory store and retrieval layer for agents, with in-memory, Redis, PostgreSQL, SQLite and Pinecone backends.',
  },
];

export default function Home() {
  return (
    <div className="bg-surface-paper text-brand-navy">
      <header className="flex h-[72px] items-center justify-between bg-brand-deep px-4 md:px-16">
        <Link href="/" aria-label="AgentSea home" className="shrink-0">
          <Image
            src="/svg/agentsea-logo.svg"
            alt="AgentSea"
            width={92}
            height={28}
            priority
            className="h-7 w-auto brightness-0 invert"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 text-base text-brand-tint md:flex">
          <Link href="/docs" className="hover:text-white">Docs</Link>
          <Link href="/api" className="hover:text-white">API</Link>
          <Link href="#packages" className="hover:text-white">Packages</Link>
          <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Changelog
          </a>
        </nav>

        <div className="flex items-center gap-6 text-base text-brand-tint">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            GitHub
          </a>
          <Link
            href="/docs/installation"
            className="rounded-lg bg-brand-seafoam px-4 py-2 text-sm font-semibold text-brand-deep hover:brightness-95"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="flex min-h-[600px] flex-col justify-center bg-gradient-to-b from-brand-ocean to-brand-deep px-4 py-24 md:px-16">
        <p className="text-sm font-semibold text-brand-seafoam">TypeScript ADK for AI agents</p>
        <h1 className="mt-4 max-w-[880px] text-4xl font-bold leading-tight text-white md:text-display">
          Build and orchestrate AI agents
        </h1>
        <p className="mt-6 max-w-[640px] text-xl leading-relaxed text-brand-tint">
          One TypeScript toolkit for providers, tools, memory, crews, guardrails and observability. Open source
          under MIT.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/docs/installation"
            className="inline-flex h-11 items-center rounded-lg bg-brand-seafoam px-6 font-semibold text-brand-deep hover:brightness-95"
          >
            Get started
          </Link>
          <Link
            href="#packages"
            className="inline-flex h-11 items-center rounded-lg border border-brand-tint px-6 font-semibold text-white hover:bg-white/10"
          >
            Browse packages
          </Link>
        </div>

        <div className="mt-6 inline-flex max-w-full items-center overflow-x-auto rounded-lg border border-brand-navy bg-surface-code px-5 py-3 font-mono text-[15px] text-brand-tint">
          <code className="whitespace-nowrap">npm install @lov3kaizen/agentsea-core</code>
        </div>
      </section>

      <section className="bg-surface-sky px-4 py-24 md:px-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-rule bg-surface-paper p-6">
              <h2 className="text-xl font-semibold text-brand-deep">{feature.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-brand-navy">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="packages" className="scroll-mt-6 bg-surface-sky px-4 pb-24 md:px-16">
        <p className="text-label uppercase tracking-[0.06em] text-ink-eyebrow">Packages</p>
        <h2 className="mt-2 text-4xl font-bold text-brand-deep">Start with the package you need</h2>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Link
              key={pkg.name}
              href={pkg.href}
              className="flex flex-col rounded-xl border border-rule bg-surface-paper p-6 transition-shadow hover:shadow-md"
            >
              <span className="font-mono text-base font-semibold text-ink-eyebrow">{pkg.name}</span>
              <span className="mt-3 text-base leading-relaxed text-brand-navy">{pkg.body}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-center gap-x-2 gap-y-2 bg-brand-deep px-4 py-8 text-sm text-brand-tint md:px-16">
        <span>AgentSea · MIT licence ·</span>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a>
        <span>·</span>
        <a href={`${GITHUB_URL}/discussions`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
          Discussions
        </a>
        <span>·</span>
        <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
          Issues
        </a>
      </footer>
    </div>
  );
}
