import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function AgentsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Agents"
        titleGradient="purple"
        description="Agents are the core building blocks of AgentSea. They represent autonomous AI entities that can reason, use tools, and maintain conversation context."
      />

      <div className="prose max-w-none">
        <h2>What is an Agent?</h2>
        <p>
          An agent in AgentSea is an intelligent entity powered by a Large
          Language Model (LLM) that can:
        </p>
        <ul>
          <li>Process natural language inputs and generate responses</li>
          <li>
            Use tools to perform actions (API calls, file operations,
            calculations, etc.)
          </li>
          <li>Maintain conversation history and context</li>
          <li>Make decisions about which tools to use and when</li>
          <li>Stream responses for real-time interactions</li>
        </ul>

        <h2>Creating an Agent</h2>
        <p>Here's a basic example of creating an agent:</p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  BufferMemory,
} from '@lov3kaizen/agentsea-core';

// Set up provider
const provider = new AnthropicProvider(process.env.ANTHROPIC_API_KEY);

// Set up tool registry
const toolRegistry = new ToolRegistry();

// Set up memory
const memory = new BufferMemory(50); // Keep last 50 messages

// Create agent
const agent = new Agent(
  {
    name: 'customer-support-agent',
    description: 'A helpful customer support assistant',
    model: 'claude-sonnet-4-20250514',
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
        </CodeBlock>

        <h2>Agent Configuration</h2>
        <p>The agent configuration object accepts the following properties:</p>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  name
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  string
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Unique identifier for the agent
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  model
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  string
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  LLM model name (e.g., claude-sonnet-4-20250514)
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  provider
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  string
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  'anthropic', 'openai', 'ollama', 'llama-cpp', 'gpt4all', or
                  'huggingface'
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  systemPrompt
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  string
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Instructions for the agent's behavior
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  tools
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Tool[]
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Array of tools the agent can use
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  temperature
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  number
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Randomness (0.0-1.0). Lower = more focused
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  maxTokens
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  number
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Maximum response length
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Executing an Agent</h2>
        <p>
          To execute an agent, call the <code>execute()</code> method with a
          prompt and context:
        </p>

        <CodeBlock language="typescript">
          {`const response = await agent.execute(
  'What is the weather like today?',
  {
    conversationId: 'user-123',
    sessionData: { userId: '123', location: 'San Francisco' },
    history: [],
  },
);

console.log(response.content); // Agent's response
console.log(response.toolCalls); // Tools that were used
console.log(response.metadata); // Additional metadata`}
        </CodeBlock>

        <h2>Streaming Responses</h2>
        <p>
          For real-time interactions, use streaming to receive responses as
          they're generated:
        </p>

        <CodeBlock language="typescript">
          {`const stream = await agent.stream(
  'Write a story about a robot',
  context,
);

for await (const chunk of stream) {
  if (chunk.type === 'content') {
    process.stdout.write(chunk.content);
  } else if (chunk.type === 'tool_call') {
    console.log('Using tool:', chunk.toolName);
  }
}`}
        </CodeBlock>

        <h2>Agent with Tools</h2>
        <p>Agents become powerful when equipped with tools:</p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  calculatorTool,
  httpRequestTool,
} from '@lov3kaizen/agentsea-core';

// Set up tools
const toolRegistry = new ToolRegistry();
toolRegistry.register(calculatorTool);
toolRegistry.register(httpRequestTool);

// Create agent with tools
const agent = new Agent(
  {
    name: 'data-analyst',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: 'You are a data analyst that can fetch and analyze data.',
    tools: [calculatorTool, httpRequestTool],
  },
  new AnthropicProvider(),
  toolRegistry,
);

// Agent can now use tools automatically
const response = await agent.execute(
  'Fetch data from https://api.example.com/stats and calculate the average',
  context,
);`}
        </CodeBlock>

        <h2>Memory Management</h2>
        <p>Agents can use different memory stores to maintain context:</p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  BufferMemory, // In-memory, simple
  RedisMemory, // Persistent, scalable
  SummaryMemory, // Auto-summarization
} from '@lov3kaizen/agentsea-core';

// Option 1: Buffer memory (default)
const bufferMemory = new BufferMemory(100); // Keep last 100 messages

// Option 2: Redis memory (persistent)
const redisMemory = new RedisMemory({
  url: 'redis://localhost:6379',
  ttl: 86400, // 24 hours
});

// Option 3: Summary memory (auto-summarizes old messages)
const summaryMemory = new SummaryMemory(
  new AnthropicProvider(),
  {
    maxMessages: 20,
    summaryModel: 'claude-haiku-4-20250514',
  },
);

const agent = new Agent(config, provider, toolRegistry, redisMemory);`}
        </CodeBlock>

        <h2>Multiple Providers</h2>
        <p>Switch between Anthropic Claude and OpenAI easily:</p>

        <CodeBlock language="typescript">
          {`import { Agent, AnthropicProvider, OpenAIProvider } from '@lov3kaizen/agentsea-core';

// Anthropic Claude
const claudeAgent = new Agent(
  {
    name: 'claude-agent',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
  },
  new AnthropicProvider(),
  toolRegistry,
);

// OpenAI GPT
const gptAgent = new Agent(
  {
    name: 'gpt-agent',
    model: 'gpt-4-turbo-preview',
    provider: 'openai',
  },
  new OpenAIProvider(),
  toolRegistry,
);`}
        </CodeBlock>

        <h2>Local & Open Source Providers</h2>
        <p>
          Run agents with local LLMs for privacy, cost savings, and offline
          operation:
        </p>

        <CodeBlock language="typescript">
          {`import { Agent, OllamaProvider, LlamaCppProvider } from '@lov3kaizen/agentsea-core';

// Ollama (easiest for local models)
const ollamaAgent = new Agent(
  {
    name: 'local-agent',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful assistant running locally.',
  },
  new OllamaProvider({
    baseUrl: 'http://localhost:11434',
    model: 'llama3.2'
  }),
  toolRegistry,
);

// llama.cpp (fastest performance)
const llamaCppAgent = new Agent(
  {
    name: 'fast-local-agent',
    model: 'llama-3.2-3b-q4_k_m',
    provider: 'llama-cpp',
  },
  new LlamaCppProvider({
    baseUrl: 'http://localhost:8080'
  }),
  toolRegistry,
);

// Response times are faster with no API latency!
const response = await ollamaAgent.execute('Hello!');`}
        </CodeBlock>

        <div className="bg-sky-50 border-l-4 border-sky-500 p-6 my-6">
          <p className="font-semibold mb-2">Benefits of Local Providers:</p>
          <ul className="space-y-1">
            <li>🔒 Data privacy - nothing leaves your machine</li>
            <li>💰 No API costs - unlimited usage</li>
            <li>⚡ Low latency - no network round trips</li>
            <li>🔌 Offline capable - works without internet</li>
          </ul>
          <p className="mt-4">
            <Link
              href="/docs/local-providers"
              className="text-sky-600 hover:underline font-semibold"
            >
              → Complete Guide to Local & Open Source Providers
            </Link>
          </p>
        </div>

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>System Prompts</strong>: Write clear, specific system
            prompts that define the agent's role and behavior
          </li>
          <li>
            <strong>Temperature</strong>: Use lower temperature (0.0-0.3) for
            factual tasks, higher (0.7-1.0) for creative tasks
          </li>
          <li>
            <strong>Memory</strong>: Choose memory store based on your needs
            (Buffer for simple, Redis for production, Summary for long
            conversations)
          </li>
          <li>
            <strong>Tools</strong>: Only provide tools that are relevant to the
            agent's purpose
          </li>
          <li>
            <strong>Error Handling</strong>: Always wrap agent execution in
            try-catch blocks
          </li>
          <li>
            <strong>Streaming</strong>: Use streaming for better user experience
            in interactive applications
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/tools">Learn about Tools</Link>
          </li>
          <li>
            <Link href="/docs/workflows">Orchestrate Multiple Agents</Link>
          </li>
          <li>
            <Link href="/docs/memory">Explore Memory Options</Link>
          </li>
          <li>
            <Link href="/examples">View Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
