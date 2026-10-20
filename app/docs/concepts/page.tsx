import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';

export const metadata: Metadata = {
  title: 'Concepts | AgentSea',
  description:
    'The terms used across the AgentSea packages, with the class and package names the code uses: agents, providers, tools, memory, crews, guardrails and observability.',
};

const toc = [
  { id: 'agents', label: 'Agents' },
  { id: 'providers', label: 'Providers' },
  { id: 'tools', label: 'Tools' },
  { id: 'memory', label: 'Memory' },
  { id: 'crews', label: 'Crews' },
  { id: 'guardrails', label: 'Guardrails' },
  { id: 'observability', label: 'Observability' },
];

const cards = [
  {
    id: 'agents',
    title: 'Agents',
    body: 'An Agent is built from a config, a provider, a ToolRegistry and an optional memory store. The config holds the name, description, model, provider name, system prompt, tools and iteration limit.',
  },
  {
    id: 'providers',
    title: 'Providers',
    body: 'A provider wraps one model API. Cloud providers are AnthropicProvider, OpenAIProvider and GeminiProvider.',
  },
  {
    id: 'tools',
    title: 'Tools',
    body: 'A tool is an object with a name, a description, a Zod schema for its parameters, and an execute function. The Tool type is exported by the types package.',
  },
  {
    id: 'memory',
    title: 'Memory',
    body: 'Memory stores conversation history for an agent. The core package has BufferMemory, which keeps the last N messages, and SummaryMemory, which keeps recent messages plus a summary of older ones.',
  },
  {
    id: 'crews',
    title: 'Crews',
    body: 'A crew is a team of agents, each with a role. Create one with createCrew(config), add tasks with addTask, and run them with kickoff().',
    pkg: '@lov3kaizen/agentsea-crews',
  },
  {
    id: 'guardrails',
    title: 'Guardrails',
    body: 'Guardrails check text on the way in (input) and on the way out (output). createGuardrailsEngine builds an engine from a list of guard settings.',
    pkg: '@lov3kaizen/agentsea-guardrails',
  },
  {
    id: 'observability',
    title: 'Observability',
    body: 'The core package has a Logger, a MetricsCollector and a Tracer. Shared instances are exported as globalMetrics and globalTracer.',
  },
];

export default function ConceptsPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Concepts"
      lead="The terms used across the AgentSea packages, with the class and package names the code uses."
      active="concepts"
      toc={toc}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <section
            key={card.id}
            id={card.id}
            className="flex scroll-mt-8 flex-col gap-3 rounded-xl border border-rule bg-surface-paper p-[22px]"
          >
            <h2 className="text-lg font-semibold text-brand-deep">{card.title}</h2>
            <p className="text-[15px] leading-relaxed text-brand-navy">{card.body}</p>
            {card.pkg && (
              <p className="text-sm text-ink-muted">
                Package: <code className="font-mono text-[13px]">{card.pkg}</code>
              </p>
            )}
          </section>
        ))}
      </div>
    </DocsShell>
  );
}
