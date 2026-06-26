import Link from 'next/link';
import PageContainer from '@/app/components/PageContainer';
import { PageHeader, Section, CodeBlock, AlertBox } from '@/app/components/Section';

export const metadata = {
  title: 'Crews — AgentSea for Elixir',
  description: 'Multi-agent coordination with delegation strategies and a gen_statem task DAG.',
};

export default function ElixirCrewsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Crews"
        titleGradient="purple"
        description="Multi-agent coordination — delegation strategies and a dependency-aware task DAG."
      />

      <div className="prose max-w-none">
        <AlertBox type="info">
          <p className="m-0">
            <code>agentsea_crews</code> models a crew as a <code>DynamicSupervisor</code>
            of agents with a <code>gen_statem</code> coordinator. See the API on{' '}
            <a href="https://hexdocs.pm/agentsea_crews" target="_blank" rel="noopener noreferrer">
              HexDocs
            </a>
            .
          </p>
        </AlertBox>

        <Section title="Roles & capabilities" id="roles">
          <p>
            Crew agents carry a <code>role</code> with <code>capabilities</code>. The
            delegation strategy uses them to pick who handles each task:
          </p>

          <CodeBlock language="elixir">
            {`alias AgentSea.{Agent, Role, Capability}

coder = %Agent.Config{
  name: :coder,
  model: "claude-opus-4-8",
  provider: {AgentSea.Providers.Anthropic, []},
  role: %Role{name: "coder", capabilities: [%Capability{name: "coding", proficiency: :expert}]}
}

writer = %Agent.Config{
  name: :writer,
  model: "claude-haiku-4-5",
  provider: {AgentSea.Providers.Anthropic, []},
  role: %Role{name: "writer", capabilities: [%Capability{name: "writing", proficiency: :expert}]}
}`}
          </CodeBlock>
        </Section>

        <Section title="Building & running a crew" id="running">
          <p>
            Define a <code>Crew.Spec</code>, start it (under your supervision tree in real
            apps), add tasks, then <code>kickoff/1</code>. Tasks with satisfied
            dependencies run concurrently; the call returns when everything settles.
          </p>

          <CodeBlock language="elixir">
            {`spec = %AgentSea.Crew.Spec{
  name: :build_crew,
  agents: [coder, writer],
  strategy: AgentSea.Crew.Delegation.BestMatch
}

{:ok, _pid} = start_supervised({AgentSea.Crew, spec})

{:ok, impl} =
  AgentSea.Crew.add_task(:build_crew,
    description: "implement the feature",
    required_capabilities: ["coding"]
  )

{:ok, _docs} =
  AgentSea.Crew.add_task(:build_crew,
    description: "document the feature",
    required_capabilities: ["writing"],
    depends_on: [impl.id]            # runs only after the coding task succeeds
  )

{:ok, result} = AgentSea.Crew.kickoff(:build_crew)

result.success          # true if no task failed
result.results          # %{task_id => response}
result.failures         # %{task_id => reason}`}
          </CodeBlock>
        </Section>

        <Section title="Delegation strategies" id="strategies">
          <p>How a task is assigned to an agent:</p>
          <ul>
            <li>
              <code>AgentSea.Crew.Delegation.BestMatch</code> — the most capable agent for
              the task&apos;s required capabilities.
            </li>
            <li>
              <code>AgentSea.Crew.Delegation.RoundRobin</code> — even distribution.
            </li>
            <li>
              <code>AgentSea.Crew.Delegation.Auction</code> — a timed <code>GenServer</code>
              fan-out where agents bid (role match × model price tier); highest bid wins.
            </li>
          </ul>
        </Section>

        <Section title="Lifecycle controls" id="controls">
          <p>
            The coordinator is a state machine: <code>:idle → :running → :completed</code>,
            with <code>:paused</code> and <code>:aborted</code> branches.
          </p>

          <CodeBlock language="elixir">
            {`AgentSea.Crew.pause(:build_crew)    # stop dispatching new tasks; in-flight finish
AgentSea.Crew.resume(:build_crew)   # continue from where it left off
AgentSea.Crew.abort(:build_crew)    # cancel in-flight tasks; kickoff caller gets {:error, :aborted}
AgentSea.Crew.status(:build_crew)   # :idle | :running | :paused | :completed | :aborted`}
          </CodeBlock>
        </Section>

        <Section title="Observability" id="observability">
          <p>
            Every kickoff, task, and delegation emits <code>:telemetry</code> events
            (<code>[:agentsea, :crew, :kickoff | :task, …]</code>). Attach your own
            handler, or run <code>agentsea_web</code> for a live Phoenix LiveView
            dashboard of the whole fleet. See{' '}
            <Link href="/docs/elixir/gateway">the gateway page</Link> for routing and the
            OpenAI-compatible endpoint.
          </p>
        </Section>
      </div>
    </PageContainer>
  );
}
