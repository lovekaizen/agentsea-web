import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../../components/docs/DocsShell';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import Callout from '../../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'Crews | AgentSea for Elixir',
  description: 'Multi-agent coordination with delegation strategies and a gen_statem task DAG.',
};

const toc = [
  { id: 'roles', label: 'Roles & capabilities' },
  { id: 'running', label: 'Building & running a crew' },
  { id: 'strategies', label: 'Delegation strategies' },
  { id: 'controls', label: 'Lifecycle controls' },
  { id: 'observability', label: 'Observability' },
];

export default function ElixirCrewsPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="Crews"
      lead="Multi-agent coordination: delegation strategies and a dependency-aware task DAG."
      active="packages"
      toc={toc}
    >
      <Callout kind="note">
        <code className="font-mono text-sm">agentsea_crews</code> models a crew as a{' '}
        <code className="font-mono text-sm">DynamicSupervisor</code> of agents with a{' '}
        <code className="font-mono text-sm">gen_statem</code> coordinator. See the API on{' '}
        <a href="https://hexdocs.pm/agentsea_crews" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-deep underline">
          HexDocs
        </a>
        .
      </Callout>

      <DocSection id="roles" title="Roles & capabilities">
        <p className="text-base leading-relaxed text-brand-navy">
          Crew agents carry a <code className="font-mono text-sm">role</code> with{' '}
          <code className="font-mono text-sm">capabilities</code>. The delegation strategy uses them to pick who
          handles each task:
        </p>
        <CodeBlock
          lang="EX"
          code={`alias AgentSea.{Agent, Role, Capability}

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
        />
      </DocSection>

      <DocSection id="running" title="Building & running a crew">
        <p className="text-base leading-relaxed text-brand-navy">
          Define a <code className="font-mono text-sm">Crew.Spec</code>, start it (under your supervision tree in real
          apps), add tasks, then <code className="font-mono text-sm">kickoff/1</code>. Tasks with satisfied dependencies
          run concurrently; the call returns when everything settles.
        </p>
        <CodeBlock
          lang="EX"
          code={`spec = %AgentSea.Crew.Spec{
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
        />
      </DocSection>

      <DocSection id="strategies" title="Delegation strategies">
        <p className="text-base leading-relaxed text-brand-navy">How a task is assigned to an agent:</p>
        <ul className="flex list-disc flex-col gap-2 pl-6 text-base leading-relaxed text-brand-navy">
          <li>
            <code className="font-mono text-sm">AgentSea.Crew.Delegation.BestMatch</code>: the most capable agent for
            the task&apos;s required capabilities.
          </li>
          <li>
            <code className="font-mono text-sm">AgentSea.Crew.Delegation.RoundRobin</code>: even distribution.
          </li>
          <li>
            <code className="font-mono text-sm">AgentSea.Crew.Delegation.Auction</code>: a timed{' '}
            <code className="font-mono text-sm">GenServer</code> fan-out where agents bid (role match × model price
            tier); highest bid wins.
          </li>
        </ul>
      </DocSection>

      <DocSection id="controls" title="Lifecycle controls">
        <p className="text-base leading-relaxed text-brand-navy">
          The coordinator is a state machine: <code className="font-mono text-sm">:idle → :running → :completed</code>,
          with <code className="font-mono text-sm">:paused</code> and <code className="font-mono text-sm">:aborted</code>{' '}
          branches.
        </p>
        <CodeBlock
          lang="EX"
          code={`AgentSea.Crew.pause(:build_crew)    # stop dispatching new tasks; in-flight finish
AgentSea.Crew.resume(:build_crew)   # continue from where it left off
AgentSea.Crew.abort(:build_crew)    # cancel in-flight tasks; kickoff caller gets {:error, :aborted}
AgentSea.Crew.status(:build_crew)   # :idle | :running | :paused | :completed | :aborted`}
        />
      </DocSection>

      <DocSection id="observability" title="Observability">
        <p className="text-base leading-relaxed text-brand-navy">
          Every kickoff, task, and delegation emits <code className="font-mono text-sm">:telemetry</code> events
          (<code className="font-mono text-sm">[:agentsea, :crew, :kickoff | :task, …]</code>). Attach your own handler,
          or run <code className="font-mono text-sm">agentsea_web</code> for a live Phoenix LiveView dashboard of the
          whole fleet. See{' '}
          <Link href="/docs/elixir/gateway" className="font-semibold text-brand-deep underline">
            the gateway page
          </Link>{' '}
          for routing and the OpenAI-compatible endpoint.
        </p>
      </DocSection>
    </DocsShell>
  );
}
