import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../../components/docs/DocsShell';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import Callout from '../../../components/docs/Callout';
import BulletPanel from '../../../components/docs/BulletPanel';

export const metadata: Metadata = {
  title: 'Gateway | AgentSea for Elixir',
  description: 'Strategy routing, circuit breaking, failover, streaming, and an OpenAI-compatible endpoint.',
};

const toc = [
  { id: 'route', label: 'Configure & route' },
  { id: 'strategies', label: 'Strategies' },
  { id: 'streaming', label: 'Streaming' },
  { id: 'openai-endpoint', label: 'OpenAI-compatible endpoint' },
  { id: 'next', label: 'Next' },
];

export default function ElixirGatewayPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="Gateway"
      lead="Route across providers with failover, circuit breaking, and real token streaming."
      active="packages"
      toc={toc}
    >
      <Callout kind="note">
        <code className="font-mono text-sm">agentsea_gateway</code> picks a provider per request by strategy, trips a{' '}
        <code className="font-mono text-sm">:fuse</code> circuit breaker on repeated failures, and fails over to the next
        candidate. API on{' '}
        <a href="https://hexdocs.pm/agentsea_gateway" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-deep underline">
          HexDocs
        </a>
        .
      </Callout>

      <DocSection id="route" title="Configure & route">
        <CodeBlock
          lang="EX"
          code={`alias AgentSea.Gateway
alias AgentSea.Gateway.{Config, Provider}

config = %Config{
  providers: [
    %Provider{name: :opus,  module: AgentSea.Providers.Anthropic, model: "claude-opus-4-8"},
    %Provider{name: :haiku, module: AgentSea.Providers.Anthropic, model: "claude-haiku-4-5"}
  ],
  strategy: AgentSea.Gateway.Router.Failover
}

{:ok, gw} = Gateway.start_link(config)

messages = [%{role: :user, content: "Summarize OTP in a sentence."}]
{:ok, response, served_by} = Gateway.completion(gw, messages)

response.content   # the answer
served_by          # which provider handled it`}
        />
      </DocSection>

      <DocSection id="strategies" title="Strategies">
        <BulletPanel
          items={[
            <>
              <code className="font-mono text-sm">AgentSea.Gateway.Router.Failover</code>: try in order, fall through on
              error.
            </>,
            <>
              <code className="font-mono text-sm">AgentSea.Gateway.Router.RoundRobin</code>: spread load evenly.
            </>,
            <>
              <code className="font-mono text-sm">AgentSea.Gateway.Router.CostOptimized</code>: cheapest viable model
              first.
            </>,
            <>
              <code className="font-mono text-sm">AgentSea.Gateway.Router.LatencyOptimized</code>: fastest by observed
              latency.
            </>,
          ]}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Each provider has a <code className="font-mono text-sm">:fuse</code> circuit breaker: after repeated failures
          the breaker blows and that provider is skipped until it resets.
        </p>
      </DocSection>

      <DocSection id="streaming" title="Streaming">
        <p className="text-base leading-relaxed text-brand-navy">
          <code className="font-mono text-sm">stream/3</code> returns a lazy stream of normalized events from the first
          streamable provider:
        </p>
        <CodeBlock
          lang="EX"
          code={`{:ok, stream, _provider} = Gateway.stream(gw, messages)

Enum.each(stream, fn
  {:content, delta} -> IO.write(delta)
  {:thinking, _t}   -> :ok
  :done             -> IO.puts("")
  _other            -> :ok
end)`}
        />
      </DocSection>

      <DocSection id="openai-endpoint" title="OpenAI-compatible endpoint">
        <p className="text-base leading-relaxed text-brand-navy">
          <code className="font-mono text-sm">agentsea_web</code> exposes{' '}
          <code className="font-mono text-sm">POST /v1/chat/completions</code> backed by the gateway. Point any OpenAI
          client (or <code className="font-mono text-sm">curl</code>) at it. With{' '}
          <code className="font-mono text-sm">stream: true</code> it forwards each provider event as a real SSE chunk.
        </p>
        <CodeBlock
          lang="BASH"
          code={`curl http://localhost:4002/v1/chat/completions \\
  -H "content-type: application/json" \\
  -d '{
    "model": "agentsea",
    "messages": [{"role": "user", "content": "hello"}],
    "stream": true
  }'`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Configure which gateway backs the endpoint via{' '}
          <code className="font-mono text-sm">config :agentsea_web, :gateway, MyApp.Gateway</code>. The same app also
          serves a Phoenix LiveView dashboard that renders agent, tool, crew, gateway, and guardrail telemetry live.
        </p>
      </DocSection>

      <DocSection id="next" title="Next">
        <p className="text-base leading-relaxed text-brand-navy">
          Add retrieval with{' '}
          <Link href="/docs/elixir/rag" className="font-semibold text-brand-deep underline">
            Embeddings &amp; RAG
          </Link>
          , or wire tools and guardrails on the{' '}
          <Link href="/docs/elixir/agents" className="font-semibold text-brand-deep underline">
            Agents page
          </Link>
          .
        </p>
      </DocSection>
    </DocsShell>
  );
}
