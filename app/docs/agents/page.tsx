import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Agents | AgentSea',
  description:
    'Agents in AgentSea: LLM-backed entities that process input, call tools, keep conversation history and stream responses.',
};

const toc = [
  { id: 'what-is-an-agent', label: 'What is an agent' },
  { id: 'creating', label: 'Creating an agent' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'executing', label: 'Executing an agent' },
  { id: 'streaming', label: 'Streaming responses' },
  { id: 'tools', label: 'Agents with tools' },
  { id: 'memory', label: 'Memory' },
  { id: 'multiple-providers', label: 'Multiple providers' },
  { id: 'local-providers', label: 'Local providers' },
  { id: 'best-practices', label: 'Best practices' },
  { id: 'next-steps', label: 'Next steps' },
];

export default function AgentsPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Agents"
      lead="Agents are the core building blocks of AgentSea. They represent autonomous AI entities that can reason, use tools, and maintain conversation context."
      active="concepts"
      toc={toc}
    >
      <DocSection id="what-is-an-agent" num="01" title="What is an agent?">
        <p className="text-base leading-relaxed text-brand-navy">
          An agent in AgentSea is an intelligent entity powered by a Large
          Language Model (LLM) that can:
        </p>
        <BulletPanel
          items={[
            'Process natural language inputs and generate responses',
            'Use tools to perform actions (API calls, file operations, calculations, etc.)',
            'Maintain conversation history and context',
            'Make decisions about which tools to use and when',
            'Stream responses for real-time interactions',
          ]}
        />
      </DocSection>

      <DocSection id="creating" num="02" title="Creating an agent">
        <p className="text-base leading-relaxed text-brand-navy">
          Here is a basic example of creating an agent:
        </p>
        <CodeBlock
          lang="TS"
          code={`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  BufferMemory,
} from '@lov3kaizen/agentsea-core';

// Provider, tool registry and memory
const provider = new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
const toolRegistry = new ToolRegistry();
const memory = new BufferMemory(50); // Keep last 50 messages

// Create agent
const agent = new Agent(
  {
    name: 'customer-support-agent',
    description: 'A helpful customer support assistant',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    systemPrompt: 'You are a friendly customer support agent...',
    tools: [],
    temperature: 0.7,
    maxTokens: 2048,
  },
  provider,
  toolRegistry,
  memory,
);`}
        />
      </DocSection>

      <DocSection id="configuration" num="03" title="Configuration">
        <p className="text-base leading-relaxed text-brand-navy">
          The agent configuration object accepts the following properties:
        </p>
        <ApiList>
          <ApiRow name="name: string">Unique identifier for the agent.</ApiRow>
          <ApiRow name="description: string">What the agent is for.</ApiRow>
          <ApiRow name="model: string">LLM model ID, for example claude-sonnet-4-6.</ApiRow>
          <ApiRow name="provider: string">
            Provider name, for example <code>anthropic</code>, <code>openai</code>,{' '}
            <code>gemini</code> or <code>ollama</code>.
          </ApiRow>
          <ApiRow name="systemPrompt?: string">Instructions for the agent&apos;s behavior.</ApiRow>
          <ApiRow name="tools?: Tool[]">Tools the agent can call.</ApiRow>
          <ApiRow name="temperature?: number">
            Randomness. Lower is more focused. The Anthropic provider leaves temperature out
            for models that reject it.
          </ApiRow>
          <ApiRow name="maxTokens?: number">Maximum response length.</ApiRow>
          <ApiRow name="maxIterations?: number">
            Maximum LLM calls in one execution, including tool-call rounds. Defaults to 10.
          </ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="executing" num="04" title="Executing an agent">
        <p className="text-base leading-relaxed text-brand-navy">
          To execute an agent, call <code>execute()</code> with an input string and a context:
        </p>
        <CodeBlock
          lang="TS"
          code={`const response = await agent.execute(
  'What is the weather like today?',
  {
    conversationId: 'user-123',
    sessionData: { userId: '123', location: 'San Francisco' },
    history: [],
  },
);

console.log(response.content); // Agent's response
console.log(response.toolCalls); // Tool calls made during the run
console.log(response.metadata); // tokensUsed, latencyMs, iterations`}
        />
        <Callout kind="note">
          When the agent has a memory store, history is loaded from it by{' '}
          <code>conversationId</code>. <code>context.history</code> is only used when no memory
          store is configured.
        </Callout>
      </DocSection>

      <DocSection id="streaming" num="05" title="Streaming responses">
        <p className="text-base leading-relaxed text-brand-navy">
          For real-time interactions, use <code>executeStream()</code> to receive events as they
          are generated:
        </p>
        <CodeBlock
          lang="TS"
          code={`for await (const event of agent.executeStream(
  'Write a story about a robot',
  context,
)) {
  if (event.type === 'content') {
    process.stdout.write(event.content);
  } else if (event.type === 'tool_calls') {
    for (const call of event.toolCalls) {
      console.log('Using tool:', call.tool);
    }
  } else if (event.type === 'error') {
    console.error(event.error);
  }
}`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Other event types are <code>iteration</code>, <code>tool_result</code> and{' '}
          <code>done</code>, which carries the run metadata.
        </p>
      </DocSection>

      <DocSection id="tools" num="06" title="Agents with tools">
        <p className="text-base leading-relaxed text-brand-navy">
          Agents become powerful when equipped with tools:
        </p>
        <CodeBlock
          lang="TS"
          code={`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  calculatorTool,
  httpRequestTool,
} from '@lov3kaizen/agentsea-core';

// Register tools
const toolRegistry = new ToolRegistry();
toolRegistry.register(calculatorTool);
toolRegistry.register(httpRequestTool);

// Create agent with tools
const agent = new Agent(
  {
    name: 'data-analyst',
    description: 'Fetches and analyzes data',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    systemPrompt: 'You are a data analyst that can fetch and analyze data.',
    tools: [calculatorTool, httpRequestTool],
  },
  new AnthropicProvider(),
  toolRegistry,
);

// The agent calls tools as the model requests them
const response = await agent.execute(
  'Fetch data from https://api.example.com/stats and calculate the average',
  context,
);`}
        />
      </DocSection>

      <DocSection id="memory" num="07" title="Memory">
        <p className="text-base leading-relaxed text-brand-navy">
          Agents can use different memory stores to keep context across calls. The memory
          argument is optional. Each store implements the same save, load and clear interface.
        </p>
        <CodeBlock
          lang="TS"
          code={`import {
  Agent,
  AnthropicProvider,
  BufferMemory, // In-memory, simple
  RedisMemory, // Persistent, scalable
  SummaryMemory, // Summarizes older messages
} from '@lov3kaizen/agentsea-core';

// Option 1: Buffer memory, keeps the last 100 messages
const bufferMemory = new BufferMemory(100);

// Option 2: Redis memory, persistent
const redisMemory = new RedisMemory({
  host: 'localhost',
  port: 6379,
  ttl: 86400, // 24 hours, in seconds
});

// Option 3: Summary memory, keeps the most recent messages and summarizes the rest
const summaryMemory = new SummaryMemory(
  new AnthropicProvider(),
  20, // maxRecentMessages
  'claude-haiku-4-5', // summaryModel
);

const agent = new Agent(config, provider, toolRegistry, redisMemory);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          For the full set of options, see the memory package reference.
        </p>
      </DocSection>

      <DocSection id="multiple-providers" num="08" title="Multiple providers">
        <p className="text-base leading-relaxed text-brand-navy">
          Switch between Anthropic Claude and OpenAI by changing the provider instance:
        </p>
        <CodeBlock
          lang="TS"
          code={`import {
  Agent,
  AnthropicProvider,
  OpenAIProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';

const toolRegistry = new ToolRegistry();

// Anthropic Claude
const claudeAgent = new Agent(
  {
    name: 'claude-agent',
    description: 'Claude-backed agent',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
  },
  new AnthropicProvider(),
  toolRegistry,
);

// OpenAI GPT
const gptAgent = new Agent(
  {
    name: 'gpt-agent',
    description: 'OpenAI-backed agent',
    model: 'gpt-4-turbo-preview',
    provider: 'openai',
  },
  new OpenAIProvider(),
  toolRegistry,
);`}
        />
      </DocSection>

      <DocSection id="local-providers" num="09" title="Local providers">
        <p className="text-base leading-relaxed text-brand-navy">
          Run agents with local LLMs for privacy, cost savings and offline operation:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, OllamaProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const toolRegistry = new ToolRegistry();

// Ollama
const localAgent = new Agent(
  {
    name: 'local-agent',
    description: 'Runs on a local Ollama server',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful assistant running locally.',
  },
  new OllamaProvider({
    baseUrl: 'http://localhost:11434',
    timeout: 60000,
  }),
  toolRegistry,
);

const response = await localAgent.execute('Hello!', context);`}
        />
        <BulletPanel
          items={[
            'Data privacy: prompts and responses stay on your machine',
            'No per-token API costs',
            'Low latency: no network round trip to a hosted API',
            'Works offline once the model is downloaded',
          ]}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          <Link href="/docs/local-providers" className="font-semibold text-brand-ocean hover:underline">
            Complete guide to local and open source providers
          </Link>
        </p>
      </DocSection>

      <DocSection id="best-practices" num="10" title="Best practices">
        <BulletPanel
          items={[
            <>
              <strong>System prompts</strong>: write clear, specific system prompts that define the
              agent&apos;s role and behavior.
            </>,
            <>
              <strong>Temperature</strong>: use a lower temperature (0.0 to 0.3) for factual tasks
              and a higher one (0.7 to 1.0) for creative tasks.
            </>,
            <>
              <strong>Memory</strong>: choose the store for the job. Buffer for simple cases, Redis
              for production, Summary for long conversations.
            </>,
            <>
              <strong>Tools</strong>: only provide tools that are relevant to the agent&apos;s purpose.
            </>,
            <>
              <strong>Error handling</strong>: wrap agent execution in try/catch. Errors are
              rethrown as <code>Agent execution failed: ...</code>.
            </>,
            <>
              <strong>Streaming</strong>: use streaming in interactive applications.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="next-steps" num="11" title="Next steps">
        <BulletPanel
          items={[
            <Link key="tools" href="/docs/tools" className="text-brand-ocean hover:underline">
              Learn about tools
            </Link>,
            <Link key="workflows" href="/docs/workflows" className="text-brand-ocean hover:underline">
              Orchestrate multiple agents
            </Link>,
            <Link key="memory" href="/docs/memory" className="text-brand-ocean hover:underline">
              Explore memory options
            </Link>,
            <Link key="examples" href="/examples" className="text-brand-ocean hover:underline">
              View examples
            </Link>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
