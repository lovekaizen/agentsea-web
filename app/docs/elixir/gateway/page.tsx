import Link from 'next/link';
import PageContainer from '@/app/components/PageContainer';
import { PageHeader, Section, CodeBlock, AlertBox } from '@/app/components/Section';

export const metadata = {
  title: 'Gateway — AgentSea for Elixir',
  description: 'Strategy routing, circuit breaking, failover, streaming, and an OpenAI-compatible endpoint.',
};

export default function ElixirGatewayPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Gateway"
        titleGradient="purple"
        description="Route across providers with failover, circuit breaking, and real token streaming."
      />

      <div className="prose max-w-none">
        <AlertBox type="info">
          <p className="m-0">
            <code>agentsea_gateway</code> picks a provider per request by strategy, trips a{' '}
            <code>:fuse</code> circuit breaker on repeated failures, and fails over to the
            next candidate. API on{' '}
            <a href="https://hexdocs.pm/agentsea_gateway" target="_blank" rel="noopener noreferrer">
              HexDocs
            </a>
            .
          </p>
        </AlertBox>

        <Section title="Configure & route" id="route">
          <CodeBlock language="elixir">
            {`alias AgentSea.Gateway
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
          </CodeBlock>
        </Section>

        <Section title="Strategies" id="strategies">
          <ul>
            <li><code>AgentSea.Gateway.Router.Failover</code> — try in order, fall through on error.</li>
            <li><code>AgentSea.Gateway.Router.RoundRobin</code> — spread load evenly.</li>
            <li><code>AgentSea.Gateway.Router.CostOptimized</code> — cheapest viable model first.</li>
            <li><code>AgentSea.Gateway.Router.LatencyOptimized</code> — fastest by observed latency.</li>
          </ul>
          <p>
            Each provider has a <code>:fuse</code> circuit breaker: after repeated
            failures the breaker blows and that provider is skipped until it resets.
          </p>
        </Section>

        <Section title="Streaming" id="streaming">
          <p>
            <code>stream/3</code> returns a lazy stream of normalized events from the
            first streamable provider:
          </p>

          <CodeBlock language="elixir">
            {`{:ok, stream, _provider} = Gateway.stream(gw, messages)

Enum.each(stream, fn
  {:content, delta} -> IO.write(delta)
  {:thinking, _t}   -> :ok
  :done             -> IO.puts("")
  _other            -> :ok
end)`}
          </CodeBlock>
        </Section>

        <Section title="OpenAI-compatible endpoint" id="openai-endpoint">
          <p>
            <code>agentsea_web</code> exposes <code>POST /v1/chat/completions</code> backed
            by the gateway — point any OpenAI client (or <code>curl</code>) at it. With{' '}
            <code>stream: true</code> it forwards each provider event as a real SSE chunk.
          </p>

          <CodeBlock language="bash">
            {`curl http://localhost:4002/v1/chat/completions \\
  -H "content-type: application/json" \\
  -d '{
    "model": "agentsea",
    "messages": [{"role": "user", "content": "hello"}],
    "stream": true
  }'`}
          </CodeBlock>

          <p>
            Configure which gateway backs the endpoint via{' '}
            <code>config :agentsea_web, :gateway, MyApp.Gateway</code>. The same app also
            serves a Phoenix LiveView dashboard that renders agent, tool, crew, gateway,
            and guardrail telemetry live.
          </p>
        </Section>

        <Section title="Next" id="next">
          <p>
            Add retrieval with <Link href="/docs/elixir/rag">Embeddings &amp; RAG</Link>,
            or wire tools and guardrails on the{' '}
            <Link href="/docs/elixir/agents">Agents page</Link>.
          </p>
        </Section>
      </div>
    </PageContainer>
  );
}
