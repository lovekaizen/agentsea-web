import Link from 'next/link';
import PageContainer from '@/app/components/PageContainer';
import { PageHeader, Section, CodeBlock, AlertBox } from '@/app/components/Section';

export const metadata = {
  title: 'AgentSea for Elixir',
  description:
    'The native Elixir/OTP edition of AgentSea — agents as supervised processes, published on Hex.',
};

const packages: { name: string; blurb: string }[] = [
  { name: 'agentsea_core', blurb: 'Agent GenServer + run loop; Provider/Tool/Memory behaviours; buffer & summary memory.' },
  { name: 'agentsea_providers', blurb: 'Anthropic provider over Req — complete/2 and real SSE stream/2.' },
  { name: 'agentsea_crews', blurb: 'Multi-agent coordination; delegation strategies; a gen_statem task-DAG coordinator.' },
  { name: 'agentsea_gateway', blurb: 'Strategy routing, :fuse circuit breaking, failover, health tracking, streaming.' },
  { name: 'agentsea_web', blurb: 'Phoenix LiveView dashboard + an OpenAI-compatible chat completions endpoint.' },
  { name: 'agentsea_structured', blurb: 'Extract a validated Ecto struct from an LLM, with validation-retry.' },
  { name: 'agentsea_embeddings', blurb: 'Embedder/VectorStore behaviours; in-memory, pgvector, Qdrant & Pinecone stores; RAG.' },
  { name: 'agentsea_bumblebee', blurb: 'In-process Hugging Face embeddings and Whisper STT via Bumblebee + Nx.' },
  { name: 'agentsea_ingest', blurb: 'A Broadway document ingestion pipeline: chunk → embed → store.' },
  { name: 'agentsea_evaluate', blurb: 'Concurrent eval metrics, including an LLM-as-judge.' },
  { name: 'agentsea_mcp', blurb: 'Model Context Protocol client with stdio and streamable-HTTP transports.' },
  { name: 'agentsea_surf', blurb: 'A Node/Playwright browser-automation sidecar exposed as agent tools.' },
  { name: 'agentsea_voice', blurb: 'TTS/STT behaviours with OpenAI and ElevenLabs adapters.' },
  { name: 'agentsea_guardrails', blurb: 'Input/output validation: max-length, blocklist, PII redaction, LLM moderation.' },
];

export default function ElixirOverviewPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="AgentSea for Elixir"
        titleGradient="purple"
        badge="Now on Hex"
        description="A native Elixir/OTP edition of AgentSea — agents are supervised processes, not objects."
      />

      <div className="prose max-w-none">
        <AlertBox type="info">
          <p className="m-0">
            This is the <strong>Elixir SDK</strong>. The rest of these docs cover the
            TypeScript/Node packages (<code>@lov3kaizen/agentsea-*</code>). The Elixir
            edition is a ground-up rewrite that keeps AgentSea&apos;s <em>concepts</em>
            {' '}(Agent, Provider, Tool, Memory, Crew, Gateway, …) and discards the
            TypeScript <em>shapes</em>.
          </p>
        </AlertBox>

        <Section title="Why Elixir?" id="why">
          <p>
            Where OTP already solves it, AgentSea deletes the abstraction and uses the
            primitive. An agent is a <code>GenServer</code> that owns its conversation
            state; a crew is a <code>DynamicSupervisor</code> with a{' '}
            <code>gen_statem</code> coordinator; delegation is message passing; the
            auction is a timed fan-out; gateway failover is a restart strategy and a{' '}
            <code>:fuse</code> circuit breaker; and you watch the whole fleet execute
            live over <code>:telemetry</code> + Phoenix LiveView.
          </p>
          <p>
            A tool that raises is isolated by a supervised <code>Task</code> and folded
            into an <code>{`{:error, _}`}</code> result fed back to the model — the agent
            process never dies for a tool fault.
          </p>
        </Section>

        <Section title="Installation" id="installation">
          <p>
            AgentSea is published to Hex as an umbrella of independent{' '}
            <code>agentsea_*</code> packages — add only the ones you need to your{' '}
            <code>mix.exs</code>:
          </p>

          <CodeBlock language="elixir">
            {`def deps do
  [
    {:agentsea_core, "~> 0.1"},
    {:agentsea_providers, "~> 0.1"}
  ]
end`}
          </CodeBlock>

          <p>Then fetch:</p>

          <CodeBlock language="bash">{`mix deps.get`}</CodeBlock>

          <AlertBox type="success">
            <p className="m-0">
              Requires <strong>Elixir ~&gt; 1.14</strong> on <strong>Erlang/OTP 25+</strong>.
              Every package ships its own docs on{' '}
              <a href="https://hexdocs.pm" target="_blank" rel="noopener noreferrer">
                HexDocs
              </a>
              .
            </p>
          </AlertBox>
        </Section>

        <Section title="Your first agent" id="first-agent">
          <p>
            An agent is a supervised process. Configure it with a model and a provider,
            start it, and run it:
          </p>

          <CodeBlock language="elixir">
            {`config = %AgentSea.Agent.Config{
  name: :assistant,
  model: "claude-opus-4-8",
  # {provider_module, opts}; the key also reads ANTHROPIC_API_KEY
  provider: {AgentSea.Providers.Anthropic, api_key: System.fetch_env!("ANTHROPIC_API_KEY")}
}

{:ok, agent} = AgentSea.Agent.start_link(config)

{:ok, response} = AgentSea.Agent.run(agent, "Explain OTP supervision in one sentence.")
IO.puts(response.content)`}
          </CodeBlock>

          <p>
            In a real app you&apos;d start agents under your supervision tree rather than
            with <code>start_link/1</code> directly.
          </p>
        </Section>

        <Section title="The packages" id="packages">
          <p>
            Fourteen focused libraries, each behind a behaviour so adapters are
            swappable. Click through to the API reference on HexDocs.
          </p>

          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>What it does</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((p) => (
                  <tr key={p.name}>
                    <td>
                      <a
                        href={`https://hexdocs.pm/${p.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <code>{p.name}</code>
                      </a>
                    </td>
                    <td>{p.blurb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Where to next" id="next">
          <ul>
            <li>
              <Link href="/docs/elixir/agents">Agents, Providers, Tools &amp; Memory</Link>{' '}
              — the core building blocks.
            </li>
            <li>
              <Link href="/docs/elixir/crews">Crews</Link> — multi-agent coordination and
              the task DAG.
            </li>
            <li>
              <Link href="/docs/elixir/gateway">Gateway</Link> — routing, failover, and the
              OpenAI-compatible endpoint.
            </li>
            <li>
              <Link href="/docs/elixir/rag">Embeddings &amp; RAG</Link> — vector stores,
              ingestion, and retrieval.
            </li>
          </ul>
        </Section>
      </div>
    </PageContainer>
  );
}
