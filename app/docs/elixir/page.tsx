import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'AgentSea for Elixir | AgentSea',
  description: 'The native Elixir/OTP edition of AgentSea: agents as supervised processes, published on Hex.',
};

const toc = [
  { id: 'install', label: 'Install' },
  { id: 'example', label: 'Example' },
  { id: 'apps', label: 'Apps' },
  { id: 'caveats', label: 'Caveats' },
];

const apps: { name: string; description: string }[] = [
  { name: 'agentsea_core', description: 'Agent GenServer and run loop.' },
  { name: 'agentsea_providers', description: 'Anthropic provider over Req.' },
  { name: 'agentsea_crews', description: 'DynamicSupervisor and Registry for agents.' },
  {
    name: 'agentsea_gateway',
    description: 'Routing across providers (failover, round-robin, cost-optimized, latency-optimized).',
  },
  { name: 'agentsea_web', description: 'Phoenix LiveView fleet dashboard fed by telemetry and PubSub.' },
  { name: 'agentsea_structured', description: 'Structured extraction into Ecto changesets.' },
  { name: 'agentsea_embeddings', description: 'Embedder and VectorStore behaviours.' },
  {
    name: 'agentsea_bumblebee',
    description: 'In-process Hugging Face embedder and Whisper speech-to-text via Bumblebee and Nx.',
  },
  { name: 'agentsea_ingest', description: 'Broadway pipeline: chunk, embed, store.' },
  {
    name: 'agentsea_evaluate',
    description: 'Concurrent evaluation metrics (exact-match, contains, LLM-as-judge) and aggregation.',
  },
  {
    name: 'agentsea_guardrails',
    description: 'Input and output guardrail pipeline: max length, blocklist, PII redaction, LLM moderation.',
  },
  { name: 'agentsea_mcp', description: 'MCP client with stdio and streamable-HTTP transports.' },
  { name: 'agentsea_surf', description: 'Browser sidecar over a Port, exposed as agent tools.' },
  {
    name: 'agentsea_voice',
    description: 'TTS and STT behaviours with OpenAI (TTS and STT) and ElevenLabs (TTS) adapters over Req.',
  },
];

export default function ElixirOverviewPage() {
  return (
    <DocsShell
      eyebrow="Elixir SDK"
      title="AgentSea for Elixir"
      lead="An Elixir/OTP implementation of AgentSea. Each agent is a GenServer."
      badges={['v0.1.0', 'On Hex']}
      active="packages"
      toc={toc}
    >
      <DocSection id="install" num="01" title="Install">
        <div className="flex flex-col gap-6 md:flex-row">
          <p className="text-base leading-relaxed text-brand-navy md:w-[300px] md:shrink-0">
            Add these dependencies to <code className="font-mono text-sm">mix.exs</code>, then run{' '}
            <code className="font-mono text-sm">mix deps.get</code>. Requires Elixir 1.14 or later.
          </p>
          <div className="min-w-0 md:flex-1">
            <CodeBlock
              lang="EX"
              code={`def deps do
  [
    {:agentsea_core, "~> 0.1"},
    {:agentsea_providers, "~> 0.1"}
  ]
end`}
            />
          </div>
        </div>
      </DocSection>

      <DocSection id="example" num="02" title="Example">
        <CodeBlock
          lang="EX"
          code={`config = %AgentSea.Agent.Config{
  name: :assistant,
  model: "claude-opus-4-8",
  # {provider_module, opts}; the key also reads ANTHROPIC_API_KEY
  provider: {AgentSea.Providers.Anthropic, api_key: System.fetch_env!("ANTHROPIC_API_KEY")}
}

{:ok, agent} = AgentSea.Agent.start_link(config)
{:ok, response} = AgentSea.Agent.run(agent, "Explain OTP supervision in one sentence.")
IO.puts(response.content)`}
        />
      </DocSection>

      <DocSection id="apps" num="03" title="Apps">
        <ApiList>
          {apps.map((app) => (
            <ApiRow key={app.name} name={app.name}>
              {app.description}
            </ApiRow>
          ))}
        </ApiList>
      </DocSection>

      <DocSection id="caveats" num="04" title="Caveats">
        <BulletPanel
          items={[
            'All 14 packages are published on Hex at version 0.1.0.',
            'Requires Elixir 1.14 or later. CI runs Elixir 1.18.4 on OTP 25.3; newer OTP versions are not tested.',
            'Only Anthropic is supported as a chat provider. There is no OpenAI provider module yet.',
            'Crew pause, resume and abort are available.',
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
