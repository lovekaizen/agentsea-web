import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function WorkflowsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Workflows"
        titleGradient="purple"
        description="Workflows enable multi-agent orchestration, allowing you to coordinate multiple agents to solve complex tasks through sequential, parallel, or supervised execution patterns."
      />

      <div className="prose max-w-none">
        <h2>What are Workflows?</h2>
        <p>
          Workflows coordinate multiple agents to work together on complex
          tasks. AgentSea supports three workflow patterns:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-8">
          {workflowTypes.map((type, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
          ))}
        </div>

        <h2>Sequential Workflows</h2>
        <p>
          Agents execute one after another, with each agent's output becoming
          the next agent's input.
        </p>

        <CodeBlock language="typescript">
          {`import {
  WorkflowFactory,
  AnthropicProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';
import type { WorkflowConfig, WorkflowType } from '@lov3kaizen/agentsea-types';

const workflow = WorkflowFactory.create(
  {
    name: 'content-pipeline',
    type: 'sequential',
    agents: [
      {
        name: 'researcher',
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        systemPrompt: 'Research the topic and gather information.',
        tools: [httpRequestTool],
      },
      {
        name: 'writer',
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        systemPrompt: 'Write a comprehensive article based on the research.',
      },
      {
        name: 'editor',
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        systemPrompt: 'Edit and polish the article for publication.',
      },
    ],
  },
  new AnthropicProvider(),
  new ToolRegistry(),
);

// Execute workflow
const result = await workflow.execute(
  'Write an article about AI agents',
  context,
);

console.log(result.content); // Final edited article`}
        </CodeBlock>

        <h2>Parallel Workflows</h2>
        <p>
          All agents execute simultaneously, and their results are aggregated.
        </p>

        <CodeBlock language="typescript">
          {`const workflow = WorkflowFactory.create(
  {
    name: 'multi-analysis',
    type: 'parallel',
    agents: [
      {
        name: 'sentiment-analyzer',
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        systemPrompt: 'Analyze the sentiment of the text.',
      },
      {
        name: 'keyword-extractor',
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        systemPrompt: 'Extract key topics and keywords.',
      },
      {
        name: 'summarizer',
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        systemPrompt: 'Create a concise summary.',
      },
    ],
  },
  new AnthropicProvider(),
  new ToolRegistry(),
);

// All agents run in parallel
const result = await workflow.execute(
  'Analyze this product review: ...',
  context,
);

// Result contains combined output from all agents
console.log(result.content);`}
        </CodeBlock>

        <h2>Supervisor Workflows</h2>
        <p>
          A supervisor agent dynamically routes tasks to specialized worker
          agents based on the input.
        </p>

        <CodeBlock language="typescript">
          {`const workflow = WorkflowFactory.create(
  {
    name: 'customer-support',
    type: 'supervisor',
    supervisor: {
      name: 'routing-agent',
      model: 'claude-sonnet-4-20250514',
      provider: 'anthropic',
      systemPrompt: \`You are a routing supervisor. Analyze the request and:
- Route technical questions to 'technical-support'
- Route billing questions to 'billing-support'
- Route general questions to 'general-support'

Respond with ONLY the agent name to route to.\`,
    },
    agents: [
      {
        name: 'technical-support',
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        systemPrompt: 'Provide technical support and troubleshooting.',
        tools: [databaseQueryTool],
      },
      {
        name: 'billing-support',
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        systemPrompt: 'Handle billing and payment inquiries.',
        tools: [paymentApiTool],
      },
      {
        name: 'general-support',
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        systemPrompt: 'Provide general customer support.',
      },
    ],
    maxRounds: 3, // Prevent infinite loops
  },
  new AnthropicProvider(),
  new ToolRegistry(),
);

// Supervisor routes to appropriate agent
const result = await workflow.execute(
  'My credit card payment failed',
  context,
);`}
        </CodeBlock>

        <h2>Error Handling</h2>
        <p>
          Configure how workflows handle agent errors with the{' '}
          <code>errorHandling</code> strategy. It is a single string value, not
          an object:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          {errorStrategies.map((strategy, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <h3 className="font-mono text-sm font-semibold text-purple-700 mb-1">
                {strategy.name}
              </h3>
              <p className="text-sm text-gray-600">{strategy.description}</p>
            </div>
          ))}
        </div>

        <CodeBlock language="typescript">
          {`const workflow = WorkflowFactory.create(
  {
    name: 'resilient-workflow',
    type: 'sequential',
    agents: [...],
    // 'fail-fast' (default) | 'retry' | 'fallback' | 'continue'
    errorHandling: 'continue',
  },
  provider,
  toolRegistry,
);

try {
  const result = await workflow.execute(input, context);
  console.log(result);
} catch (error) {
  console.error('Workflow failed:', error);
}`}
        </CodeBlock>

        <h2>Retry Strategy</h2>
        <AlertBox type="info">
          As of v1.1.0, the <code>&apos;retry&apos;</code> strategy performs
          real retries. A failing agent is re-invoked up to{' '}
          <code>retry.maxAttempts</code> times before the error propagates.
          (Previously this was a no-op that simply re-threw the error.)
        </AlertBox>

        <p>
          Pair <code>errorHandling: &apos;retry&apos;</code> with an optional{' '}
          <code>retry</code> config to tune attempts and backoff:
        </p>

        <CodeBlock language="typescript">
          {`const workflow = WorkflowFactory.create(
  {
    name: 'resilient-workflow',
    type: 'sequential',
    agents: [...],
    errorHandling: 'retry',
    retry: {
      maxAttempts: 5,        // re-invoke the agent up to 5 times
      initialDelayMs: 500,   // base delay before backing off
      backoff: 'exponential', // 'linear' | 'exponential'
      maxDelayMs: 10000,     // optional cap on the computed delay
    },
  },
  provider,
  toolRegistry,
);

// The agent is retried on failure. If every attempt fails,
// the final error propagates to the workflow's error handler.
const result = await workflow.execute(input, context);`}
        </CodeBlock>

        <p>
          When the <code>retry</code> config is omitted, retries default to{' '}
          <strong>3 attempts</strong> with <strong>no delay</strong> and{' '}
          <strong>exponential</strong> backoff. Delays only apply when{' '}
          <code>initialDelayMs</code> is greater than <code>0</code>:{' '}
          <code>linear</code> waits <code>initialDelayMs * attempt</code>, while{' '}
          <code>exponential</code> waits{' '}
          <code>initialDelayMs * 2 ** (attempt - 1)</code>, each capped by{' '}
          <code>maxDelayMs</code>.
        </p>

        <h2>Workflow Context</h2>
        <p>Pass data between agents using workflow context:</p>

        <CodeBlock language="typescript">
          {`const context = {
  conversationId: 'workflow-123',
  sessionData: {
    userId: '12345',
    userPreferences: {
      language: 'en',
      timezone: 'UTC',
    },
  },
  history: [], // Conversation history
};

// In sequential workflows, output from one agent
// becomes input to the next agent automatically
const result = await workflow.execute('Create a report', context);

// Access workflow metadata
console.log(result.metadata.agentsUsed);
console.log(result.metadata.executionTime);
console.log(result.metadata.tokensUsed);`}
        </CodeBlock>

        <h2>Streaming Workflows</h2>
        <p>Stream results in real-time as agents process:</p>

        <CodeBlock language="typescript">
          {`const stream = await workflow.stream(
  'Analyze this data',
  context,
);

for await (const chunk of stream) {
  if (chunk.type === 'agent_start') {
    console.log(\`Starting agent: \${chunk.agentName}\`);
  } else if (chunk.type === 'content') {
    process.stdout.write(chunk.content);
  } else if (chunk.type === 'agent_complete') {
    console.log(\`\\nCompleted agent: \${chunk.agentName}\`);
  }
}`}
        </CodeBlock>

        <h2>Dynamic Agent Selection</h2>
        <p>Create workflows where agents are selected dynamically:</p>

        <CodeBlock language="typescript">
          {`import { SupervisorWorkflow } from '@lov3kaizen/agentsea-core';

const workflow = new SupervisorWorkflow(
  {
    name: 'dynamic-workflow',
    supervisor: supervisorAgent,
    agents: [
      codeReviewAgent,
      bugFixAgent,
      documentationAgent,
    ],
    routingStrategy: 'conditional', // or 'round-robin'
    maxRounds: 5,
  },
  provider,
  toolRegistry,
);

// Supervisor will route based on the input
const result = await workflow.execute(
  'Review this pull request and fix any bugs',
  context,
);`}
        </CodeBlock>

        <h2>Workflow Factory</h2>
        <p>Use the factory for simplified workflow creation:</p>

        <CodeBlock language="typescript">
          {`import { WorkflowFactory } from '@lov3kaizen/agentsea-core';

// Factory handles provider and tool registry setup
const workflow = WorkflowFactory.create(
  {
    name: 'my-workflow',
    type: 'sequential', // 'parallel' or 'supervisor'
    agents: [
      // Agent configurations
    ],
  },
  new AnthropicProvider(),
  new ToolRegistry(),
);

// Factory creates appropriate workflow type automatically
// - SequentialWorkflow for type: 'sequential'
// - ParallelWorkflow for type: 'parallel'
// - SupervisorWorkflow for type: 'supervisor'`}
        </CodeBlock>

        <h2>Use Cases</h2>

        <h3>Sequential Workflows</h3>
        <ul>
          <li>Content creation pipelines (research → write → edit)</li>
          <li>Data processing (extract → transform → load)</li>
          <li>Multi-step analysis (collect → analyze → report)</li>
        </ul>

        <h3>Parallel Workflows</h3>
        <ul>
          <li>Multi-perspective analysis (sentiment + keywords + summary)</li>
          <li>Competitive research (analyze multiple competitors)</li>
          <li>A/B testing (generate multiple variations)</li>
        </ul>

        <h3>Supervisor Workflows</h3>
        <ul>
          <li>Customer support routing</li>
          <li>Dynamic task delegation</li>
          <li>Multi-round problem solving</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Agent Specialization</strong>: Give each agent a clear,
            focused role
          </li>
          <li>
            <strong>System Prompts</strong>: Write specific system prompts for
            each agent's task
          </li>
          <li>
            <strong>Error Handling</strong>: Configure appropriate error
            strategies for your use case
          </li>
          <li>
            <strong>Round Limits</strong>: Set maxRounds in supervisor workflows
            to prevent infinite loops
          </li>
          <li>
            <strong>Context Management</strong>: Use sessionData to pass
            relevant context between agents
          </li>
          <li>
            <strong>Monitoring</strong>: Track workflow execution metrics and
            token usage
          </li>
          <li>
            <strong>Testing</strong>: Test workflows with various inputs to
            ensure proper routing
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/agents">Learn more about Agents</Link>
          </li>
          <li>
            <Link href="/docs/observability">Monitor Workflow Performance</Link>
          </li>
          <li>
            <Link href="/examples">View Workflow Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const workflowTypes = [
  {
    icon: '➡️',
    name: 'Sequential',
    description: 'Agents execute one after another, passing output as input',
  },
  {
    icon: '⚡',
    name: 'Parallel',
    description: 'All agents execute simultaneously and results are combined',
  },
  {
    icon: '👔',
    name: 'Supervisor',
    description: 'A supervisor routes tasks dynamically to specialized agents',
  },
];

const errorStrategies = [
  {
    name: "'fail-fast'",
    description:
      'Default. The agent runs once and any error immediately propagates, terminating the workflow.',
  },
  {
    name: "'retry'",
    description:
      'Re-invokes the failing agent up to retry.maxAttempts times with optional backoff. The error propagates only after every attempt fails.',
  },
  {
    name: "'fallback'",
    description:
      'Returns a fallback response noting the failure instead of throwing, letting the workflow continue.',
  },
  {
    name: "'continue'",
    description:
      'Skips the failed agent and continues the workflow with the remaining agents.',
  },
];
