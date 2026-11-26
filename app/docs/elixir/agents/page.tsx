import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../../components/docs/DocsShell';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import Callout from '../../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'Agents | AgentSea for Elixir',
  description: 'Agents, providers, tools, memory and guardrail hooks in the Elixir SDK.',
};

const toc = [
  { id: 'loop', label: 'The agent loop' },
  { id: 'providers', label: 'Providers' },
  { id: 'tools', label: 'Tools' },
  { id: 'memory', label: 'Memory' },
  { id: 'guardrails', label: 'Guardrail hooks' },
  { id: 'structured', label: 'Structured output' },
];

export default function ElixirAgentsPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="Agents"
      lead="The core building blocks: agents, providers, tools, memory, and guardrail hooks."
      active="packages"
      toc={toc}
    >
      <Callout kind="note">
        New here? Start with the <Link href="/docs/elixir" className="font-semibold text-brand-deep underline">Elixir overview and installation</Link>.
      </Callout>

      <DocSection id="loop" title="The agent loop">
        <p className="text-base leading-relaxed text-brand-navy">
          <code className="font-mono text-sm">AgentSea.Agent</code> is a <code className="font-mono text-sm">GenServer</code> that
          owns its conversation state and runs the loop: call the provider, and if it requests tools, run them
          concurrently and feed the results back. It repeats until the model answers or{' '}
          <code className="font-mono text-sm">max_iterations</code> is hit.
        </p>
        <CodeBlock
          lang="EX"
          code={`config = %AgentSea.Agent.Config{
  name: :assistant,
  model: "claude-opus-4-8",
  provider: {AgentSea.Providers.Anthropic, []},
  system_prompt: "You are concise and precise.",
  temperature: 0.2,
  max_iterations: 10
}

{:ok, agent} = AgentSea.Agent.start_link(config)
{:ok, response} = AgentSea.Agent.run(agent, "What is OTP?")

response.content        # the answer
AgentSea.Agent.history(agent)  # conversation so far`}
        />
      </DocSection>

      <DocSection id="providers" title="Providers">
        <p className="text-base leading-relaxed text-brand-navy">
          Providers implement the <code className="font-mono text-sm">AgentSea.Provider</code> behaviour
          (<code className="font-mono text-sm">complete/2</code> and an optional{' '}
          <code className="font-mono text-sm">stream/2</code>). The Anthropic provider lives in{' '}
          <code className="font-mono text-sm">agentsea_providers</code> and reads its key from{' '}
          <code className="font-mono text-sm">ANTHROPIC_API_KEY</code> (or a{' '}
          <code className="font-mono text-sm">:api_key</code> option):
        </p>
        <CodeBlock
          lang="EX"
          code={`provider: {AgentSea.Providers.Anthropic, api_key: System.fetch_env!("ANTHROPIC_API_KEY")}`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Because it&apos;s just a behaviour, you can write your own, or route across several providers with the{' '}
          <Link href="/docs/elixir/gateway" className="font-semibold text-brand-deep underline">gateway</Link>.
        </p>
      </DocSection>

      <DocSection id="tools" title="Tools">
        <p className="text-base leading-relaxed text-brand-navy">
          A tool is a module implementing <code className="font-mono text-sm">AgentSea.Tool</code>. When the model
          requests it, the agent runs it under a supervised <code className="font-mono text-sm">Task</code>. A crash
          becomes an <code className="font-mono text-sm">{'{:error, _}'}</code> the model sees, never a dead agent.
        </p>
        <CodeBlock
          lang="EX"
          code={`defmodule MyApp.Tools.Weather do
  @behaviour AgentSea.Tool

  @impl true
  def name, do: "get_weather"

  @impl true
  def description, do: "Get the current weather for a city."

  @impl true
  def schema, do: [city: [type: :string, required: true]]

  @impl true
  def run(%{"city" => city}, _ctx), do: {:ok, "It is sunny in #{city}."}
end

# then:
config = %AgentSea.Agent.Config{
  name: :assistant,
  model: "claude-opus-4-8",
  provider: {AgentSea.Providers.Anthropic, []},
  tools: [MyApp.Tools.Weather]
}`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          For ad-hoc or dynamically-discovered tools (for example from an{' '}
          <a href="https://hexdocs.pm/agentsea_mcp" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-deep underline">
            MCP server
          </a>
          ), pass an <code className="font-mono text-sm">AgentSea.Tool.Spec</code>, a function-backed tool, in the same{' '}
          <code className="font-mono text-sm">tools</code> list:
        </p>
        <CodeBlock
          lang="EX"
          code={`%AgentSea.Tool.Spec{
  name: "now",
  description: "Return the current UTC time.",
  run: fn _args, _ctx -> {:ok, DateTime.utc_now() |> DateTime.to_iso8601()} end
}`}
        />
      </DocSection>

      <DocSection id="memory" title="Memory">
        <p className="text-base leading-relaxed text-brand-navy">
          <code className="font-mono text-sm">AgentSea.Memory</code> is a behaviour with three adapters: a windowed{' '}
          <code className="font-mono text-sm">Buffer</code>, an LLM-compacting <code className="font-mono text-sm">Summary</code>{' '}
          store, and a <code className="font-mono text-sm">Vector</code> store for semantic recall.
        </p>
        <CodeBlock
          lang="EX"
          code={`# Rolling window
{:ok, _} = AgentSea.Memory.Buffer.start_link(max_messages: 20)
AgentSea.Memory.Buffer.save("conv-1", messages)
AgentSea.Memory.Buffer.load("conv-1")

# Compact older turns into an LLM summary past a threshold
AgentSea.Memory.Summary.start_link(
  provider: {AgentSea.Providers.Anthropic, []},
  model: "claude-haiku-4-5",
  keep_recent: 6,
  threshold: 20
)`}
        />
      </DocSection>

      <DocSection id="guardrails" title="Guardrail hooks">
        <p className="text-base leading-relaxed text-brand-navy">
          Agents accept optional <code className="font-mono text-sm">input_guard</code> and{' '}
          <code className="font-mono text-sm">output_guard</code> hooks. Each is any function returning{' '}
          <code className="font-mono text-sm">{'{:ok, content}'}</code> (possibly rewritten) or{' '}
          <code className="font-mono text-sm">{'{:block, reason}'}</code>. That is exactly the shape of{' '}
          <code className="font-mono text-sm">AgentSea.Guardrails.run/2</code>, so a pipeline drops straight in:
        </p>
        <CodeBlock
          lang="EX"
          code={`alias AgentSea.Guardrail.{MaxLength, Blocklist, PIIRedactor}

config = %AgentSea.Agent.Config{
  name: :assistant,
  model: "claude-opus-4-8",
  provider: {AgentSea.Providers.Anthropic, []},
  input_guard:
    &AgentSea.Guardrails.run(&1, [
      {MaxLength, max: 4000},
      {Blocklist, terms: ["ignore previous instructions"]}
    ]),
  output_guard: &AgentSea.Guardrails.run(&1, [PIIRedactor])
}`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          A blocked input short-circuits to{' '}
          <code className="font-mono text-sm">{'{:error, {:guardrail, :input, reason}}'}</code> before the model is
          ever called. See{' '}
          <a href="https://hexdocs.pm/agentsea_guardrails" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-deep underline">
            agentsea_guardrails
          </a>{' '}
          for the built-ins and an <code className="font-mono text-sm">LLMGuard</code> moderator.
        </p>
      </DocSection>

      <DocSection id="structured" title="Structured output">
        <p className="text-base leading-relaxed text-brand-navy">
          Need a typed result instead of prose? <code className="font-mono text-sm">agentsea_structured</code> extracts
          a validated Ecto struct, feeding validation errors back to the model and retrying.
        </p>
        <CodeBlock
          lang="EX"
          code={`{:ok, %Person{name: "Ada Lovelace", age: 36}} =
  AgentSea.Structured.extract(Person, "Ada Lovelace, 36",
    provider: {AgentSea.Providers.Anthropic, []},
    model: "claude-opus-4-8"
  )`}
        />
      </DocSection>
    </DocsShell>
  );
}
