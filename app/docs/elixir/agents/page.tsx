import Link from 'next/link';
import PageContainer from '@/app/components/PageContainer';
import { PageHeader, Section, CodeBlock, AlertBox } from '@/app/components/Section';

export const metadata = {
  title: 'Agents — AgentSea for Elixir',
  description: 'Agents, providers, tools, memory and guardrail hooks in the Elixir SDK.',
};

export default function ElixirAgentsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Agents"
        titleGradient="purple"
        description="The core building blocks: agents, providers, tools, memory, and guardrail hooks."
      />

      <div className="prose max-w-none">
        <AlertBox type="info">
          <p className="m-0">
            New here? Start with the{' '}
            <Link href="/docs/elixir">Elixir overview &amp; installation</Link>.
          </p>
        </AlertBox>

        <Section title="The agent loop" id="loop">
          <p>
            <code>AgentSea.Agent</code> is a <code>GenServer</code> that owns its
            conversation state and runs the loop: call the provider → if it requests
            tools, run them concurrently and feed the results back → repeat until the
            model answers or <code>max_iterations</code> is hit.
          </p>

          <CodeBlock language="elixir">
            {`config = %AgentSea.Agent.Config{
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
          </CodeBlock>
        </Section>

        <Section title="Providers" id="providers">
          <p>
            Providers implement the <code>AgentSea.Provider</code> behaviour
            (<code>complete/2</code> and an optional <code>stream/2</code>). The Anthropic
            provider lives in <code>agentsea_providers</code> and reads its key from{' '}
            <code>ANTHROPIC_API_KEY</code> (or a <code>:api_key</code> option):
          </p>

          <CodeBlock language="elixir">
            {`provider: {AgentSea.Providers.Anthropic, api_key: System.fetch_env!("ANTHROPIC_API_KEY")}`}
          </CodeBlock>

          <p>
            Because it&apos;s just a behaviour, you can write your own — or route across
            several providers with the{' '}
            <Link href="/docs/elixir/gateway">gateway</Link>.
          </p>
        </Section>

        <Section title="Tools" id="tools">
          <p>
            A tool is a module implementing <code>AgentSea.Tool</code>. When the model
            requests it, the agent runs it under a supervised <code>Task</code> — a crash
            becomes an <code>{`{:error, _}`}</code> the model sees, never a dead agent.
          </p>

          <CodeBlock language="elixir">
            {`defmodule MyApp.Tools.Weather do
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
          </CodeBlock>

          <p>
            For ad-hoc or dynamically-discovered tools (e.g. from an{' '}
            <a href="https://hexdocs.pm/agentsea_mcp" target="_blank" rel="noopener noreferrer">
              MCP server
            </a>
            ), pass an <code>AgentSea.Tool.Spec</code> — a function-backed tool — in the
            same <code>tools</code> list:
          </p>

          <CodeBlock language="elixir">
            {`%AgentSea.Tool.Spec{
  name: "now",
  description: "Return the current UTC time.",
  run: fn _args, _ctx -> {:ok, DateTime.utc_now() |> DateTime.to_iso8601()} end
}`}
          </CodeBlock>
        </Section>

        <Section title="Memory" id="memory">
          <p>
            <code>AgentSea.Memory</code> is a behaviour with three adapters: a windowed{' '}
            <code>Buffer</code>, an LLM-compacting <code>Summary</code> store, and a{' '}
            <code>Vector</code> store for semantic recall.
          </p>

          <CodeBlock language="elixir">
            {`# Rolling window
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
          </CodeBlock>
        </Section>

        <Section title="Guardrail hooks" id="guardrails">
          <p>
            Agents accept optional <code>input_guard</code> / <code>output_guard</code>
            hooks — any function returning <code>{`{:ok, content}`}</code> (possibly
            rewritten) or <code>{`{:block, reason}`}</code>. That&apos;s exactly the shape
            of <code>AgentSea.Guardrails.run/2</code>, so a pipeline drops straight in:
          </p>

          <CodeBlock language="elixir">
            {`alias AgentSea.Guardrail.{MaxLength, Blocklist, PIIRedactor}

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
          </CodeBlock>

          <p>
            A blocked input short-circuits to{' '}
            <code>{`{:error, {:guardrail, :input, reason}}`}</code> before the model is
            ever called. See{' '}
            <a href="https://hexdocs.pm/agentsea_guardrails" target="_blank" rel="noopener noreferrer">
              agentsea_guardrails
            </a>{' '}
            for the built-ins (and an <code>LLMGuard</code> moderator).
          </p>
        </Section>

        <Section title="Structured output" id="structured">
          <p>
            Need a typed result instead of prose? <code>agentsea_structured</code> extracts
            a validated Ecto struct, feeding validation errors back to the model and
            retrying:
          </p>

          <CodeBlock language="elixir">
            {`{:ok, %Person{name: "Ada Lovelace", age: 36}} =
  AgentSea.Structured.extract(Person, "Ada Lovelace, 36",
    provider: {AgentSea.Providers.Anthropic, []},
    model: "claude-opus-4-8"
  )`}
          </CodeBlock>
        </Section>
      </div>
    </PageContainer>
  );
}
