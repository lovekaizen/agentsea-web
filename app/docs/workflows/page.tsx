import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Workflows | AgentSea',
  description:
    'Coordinate several AgentSea agents with sequential, parallel and supervisor workflows, error-handling strategies and retries.',
};

const toc = [
  { id: 'what-are-workflows', label: 'What are workflows?' },
  { id: 'sequential', label: 'Sequential workflows' },
  { id: 'parallel', label: 'Parallel workflows' },
  { id: 'supervisor', label: 'Supervisor workflows' },
  { id: 'error-handling', label: 'Error handling' },
  { id: 'retry', label: 'Retry strategy' },
  { id: 'context-and-results', label: 'Context and results' },
  { id: 'workflow-factory', label: 'Workflow factory' },
  { id: 'use-cases', label: 'Use cases' },
  { id: 'best-practices', label: 'Best practices' },
  { id: 'next-steps', label: 'Next steps' },
];

export default function WorkflowsPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Workflows"
      lead="Workflows coordinate multiple agents to solve a task together, through sequential, parallel or supervisor patterns."
      active="concepts"
      toc={toc}
    >
      <DocSection id="what-are-workflows" num="01" title="What are workflows?">
        <p className="text-base leading-relaxed text-brand-navy">
          A workflow runs a list of agents over one input. AgentSea has three patterns:
        </p>
        <ApiList>
          <ApiRow name="sequential">Agents run one after another. Each agent&apos;s output becomes the next agent&apos;s input.</ApiRow>
          <ApiRow name="parallel">All agents run at the same time on the same input. Their results are combined.</ApiRow>
          <ApiRow name="supervisor">
            Agents run in a routed loop. Each response decides which agent runs next.
          </ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="sequential" num="02" title="Sequential workflows">
        <p className="text-base leading-relaxed text-brand-navy">
          The result is the last agent&apos;s response. Token counts and iterations are summed across
          all agents.
        </p>
        <CodeBlock
          lang="TS"
          code={`import {
  WorkflowFactory,
  AnthropicProvider,
  ToolRegistry,
  httpRequestTool,
} from '@lov3kaizen/agentsea-core';

const provider = new AnthropicProvider();
const toolRegistry = new ToolRegistry();
toolRegistry.register(httpRequestTool);

const workflow = WorkflowFactory.create(
  {
    name: 'content-pipeline',
    type: 'sequential',
    agents: [
      {
        name: 'researcher',
        description: 'Gathers information on the topic',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: 'Research the topic and gather information.',
        tools: [httpRequestTool],
      },
      {
        name: 'writer',
        description: 'Drafts the article',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: 'Write a comprehensive article based on the research.',
      },
      {
        name: 'editor',
        description: 'Polishes the article',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: 'Edit and polish the article for publication.',
      },
    ],
  },
  provider,
  toolRegistry,
);

const result = await workflow.execute('Write an article about AI agents', context);
console.log(result.content); // the editor's output`}
        />
      </DocSection>

      <DocSection id="parallel" num="03" title="Parallel workflows">
        <p className="text-base leading-relaxed text-brand-navy">
          Every agent receives the same input. The result content lists each agent&apos;s response,
          labeled by agent name, in configuration order.
        </p>
        <CodeBlock
          lang="TS"
          code={`const workflow = WorkflowFactory.create(
  {
    name: 'multi-analysis',
    type: 'parallel',
    agents: [
      {
        name: 'sentiment-analyzer',
        description: 'Scores sentiment',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: 'Analyze the sentiment of the text.',
      },
      {
        name: 'keyword-extractor',
        description: 'Extracts keywords',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: 'Extract key topics and keywords.',
      },
      {
        name: 'summarizer',
        description: 'Summarizes the text',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: 'Create a concise summary.',
      },
    ],
  },
  provider,
  toolRegistry,
);

const result = await workflow.execute('Analyze this product review: ...', context);

// [sentiment-analyzer]: ...
//
// [keyword-extractor]: ...
//
// [summarizer]: ...
console.log(result.content);`}
        />
      </DocSection>

      <DocSection id="supervisor" num="04" title="Supervisor workflows">
        <p className="text-base leading-relaxed text-brand-navy">
          A supervisor workflow starts with the first agent in <code>agents</code>. After each
          response, the next agent is chosen in this order:
        </p>
        <BulletPanel
          items={[
            <>
              The response&apos;s <code>nextAgent</code> field, when an agent sets it.
            </>,
            <>
              The first matching rule in <code>routing.rules</code>. Each rule is a{' '}
              <code>condition(context, response)</code> function and a <code>nextAgent</code> name.
            </>,
            <>
              The round-robin order, when <code>routing.strategy</code> is <code>&apos;round-robin&apos;</code>.
            </>,
          ]}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          When none of these picks an agent, the workflow ends and returns the last response. The
          loop stops after 10 routing steps.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { WorkflowFactory, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const workflow = WorkflowFactory.create(
  {
    name: 'customer-support',
    type: 'supervisor',
    agents: [
      {
        name: 'triage',
        description: 'Classifies the request and routes it',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: \`You route customer requests. Reply with one word:
technical, billing or general.\`,
      },
      {
        name: 'technical-support',
        description: 'Technical troubleshooting',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: 'Provide technical support and troubleshooting.',
        tools: [databaseQueryTool],
      },
      {
        name: 'billing-support',
        description: 'Billing and payment questions',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: 'Handle billing and payment inquiries.',
        tools: [paymentApiTool],
      },
      {
        name: 'general-support',
        description: 'General customer support',
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        systemPrompt: 'Provide general customer support.',
      },
    ],
    routing: {
      strategy: 'conditional',
      rules: [
        {
          condition: (_context, response) => response.content.includes('technical'),
          nextAgent: 'technical-support',
        },
        {
          condition: (_context, response) => response.content.includes('billing'),
          nextAgent: 'billing-support',
        },
        {
          condition: () => true,
          nextAgent: 'general-support',
        },
      ],
    },
  },
  new AnthropicProvider(),
  new ToolRegistry(),
);

const result = await workflow.execute('My credit card payment failed', context);`}
        />
        <Callout kind="note">
          The example routes on the text of the triage reply. Keyword matching is fragile, so prefer
          a structured reply or a <code>nextAgent</code> set by the agent where you can.
        </Callout>
      </DocSection>

      <DocSection id="error-handling" num="05" title="Error handling">
        <p className="text-base leading-relaxed text-brand-navy">
          Set <code>errorHandling</code> on the workflow config. It is one string value:
        </p>
        <ApiList>
          <ApiRow name="'fail-fast' (default)">Throws the agent&apos;s error to the caller. The workflow stops.</ApiRow>
          <ApiRow name="'retry'">Re-invokes the failing agent up to <code>retry.maxAttempts</code> times. If every attempt fails, the error propagates.</ApiRow>
          <ApiRow name="'fallback'">
            Returns a response in place of the failed agent&apos;s output. The content says the agent failed and
            finish reason is <code>error</code>.
          </ApiRow>
          <ApiRow name="'continue'">
            Skips the failed agent. In a sequential workflow the next agent receives the same input. In a
            supervisor workflow the next agent in the list runs.
          </ApiRow>
        </ApiList>
        <CodeBlock
          lang="TS"
          code={`const workflow = WorkflowFactory.create(
  {
    name: 'resilient-workflow',
    type: 'sequential',
    agents: [/* ... */],
    errorHandling: 'continue',
  },
  provider,
  toolRegistry,
);

try {
  const result = await workflow.execute(input, context);
  console.log(result.content);
} catch (error) {
  console.error('Workflow failed:', error);
}`}
        />
      </DocSection>

      <DocSection id="retry" num="06" title="Retry strategy">
        <p className="text-base leading-relaxed text-brand-navy">
          With <code>errorHandling: &apos;retry&apos;</code>, the agent is re-invoked after a failure. Tune
          the attempts and backoff with the <code>retry</code> config:
        </p>
        <CodeBlock
          lang="TS"
          code={`const workflow = WorkflowFactory.create(
  {
    name: 'resilient-workflow',
    type: 'sequential',
    agents: [/* ... */],
    errorHandling: 'retry',
    retry: {
      maxAttempts: 5,         // total attempts, including the first
      initialDelayMs: 500,    // base delay between attempts
      backoff: 'exponential', // 'linear' | 'exponential'
      maxDelayMs: 10000,      // cap on the computed delay
    },
  },
  provider,
  toolRegistry,
);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          When <code>retry</code> is omitted, the defaults are 3 attempts with no delay. The delay applies
          only when <code>initialDelayMs</code> is greater than 0. <code>linear</code> waits{' '}
          <code>initialDelayMs * attempt</code>. <code>exponential</code> waits{' '}
          <code>initialDelayMs * 2 ** (attempt - 1)</code>. <code>maxDelayMs</code> caps either value.
        </p>
      </DocSection>

      <DocSection id="context-and-results" num="07" title="Context and results">
        <p className="text-base leading-relaxed text-brand-navy">
          A workflow takes the same <code>AgentContext</code> as an agent. Its <code>conversationId</code>{' '}
          and memory store are used by every agent in the workflow.
        </p>
        <CodeBlock
          lang="TS"
          code={`const context = {
  conversationId: 'workflow-123',
  sessionData: {
    userId: '12345',
    userPreferences: { language: 'en', timezone: 'UTC' },
  },
  history: [],
};

const result = await workflow.execute('Create a report', context);

console.log(result.content);
console.log(result.metadata.tokensUsed);
console.log(result.metadata.latencyMs);
console.log(result.metadata.iterations);`}
        />
        <Callout kind="note">
          Workflows do not expose a streaming API in this version. To stream output, call{' '}
          <code>executeStream()</code> on an individual <code>Agent</code>.
        </Callout>
      </DocSection>

      <DocSection id="workflow-factory" num="08" title="Workflow factory">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>WorkflowFactory.create(config, provider, toolRegistry, memory?)</code> returns the workflow class
          that matches <code>config.type</code>. The types are <code>sequential</code>, <code>parallel</code>{' '}
          and <code>supervisor</code>. A <code>custom</code> workflow must be created with its class directly.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { SupervisorWorkflow } from '@lov3kaizen/agentsea-core';

// The same config as the factory, constructed directly
const workflow = new SupervisorWorkflow(config, provider, toolRegistry, memory);`}
        />
      </DocSection>

      <DocSection id="use-cases" num="09" title="Use cases">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-rule bg-surface-paper p-6">
            <h3 className="text-lg font-semibold text-brand-deep">Sequential</h3>
            <BulletPanel
              items={[
                'Content pipelines: research, write, edit',
                'Data processing: extract, transform, load',
                'Multi-step analysis: collect, analyze, report',
              ]}
            />
          </div>
          <div className="rounded-xl border border-rule bg-surface-paper p-6">
            <h3 className="text-lg font-semibold text-brand-deep">Parallel</h3>
            <BulletPanel
              items={[
                'Multi-perspective analysis: sentiment, keywords, summary',
                'Competitive research across several companies',
                'Generating several variations to compare',
              ]}
            />
          </div>
          <div className="rounded-xl border border-rule bg-surface-paper p-6">
            <h3 className="text-lg font-semibold text-brand-deep">Supervisor</h3>
            <BulletPanel
              items={[
                'Customer support routing',
                'Dynamic task delegation',
                'Multi-round problem solving',
              ]}
            />
          </div>
        </div>
      </DocSection>

      <DocSection id="best-practices" num="10" title="Best practices">
        <BulletPanel
          items={[
            <>
              <strong>Specialize agents</strong>: give each agent one clear role and a specific system prompt.
            </>,
            <>
              <strong>Choose an error strategy</strong> for the use case. Use <code>retry</code> for flaky
              external calls and <code>fallback</code> when a partial answer is acceptable.
            </>,
            <>
              <strong>Route with clear signals</strong>: have agents set <code>nextAgent</code> or return a
              structured answer that a rule can read.
            </>,
            <>
              <strong>Mind the loop limit</strong>: supervisor workflows stop after 10 routing steps. Design
              routing so the loop ends before that.
            </>,
            <>
              <strong>Share context through sessionData</strong>: pass what the agents need in the context.
            </>,
            <>
              <strong>Track cost and latency</strong>: record <code>tokensUsed</code> and <code>latencyMs</code> from each run.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="next-steps" num="11" title="Next steps">
        <BulletPanel
          items={[
            <Link key="agents" href="/docs/agents" className="text-brand-ocean hover:underline">
              Agents
            </Link>,
            <Link key="observability" href="/docs/observability" className="text-brand-ocean hover:underline">
              Monitor workflow performance
            </Link>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
