import Link from 'next/link';
import PageContainer from '../components/PageContainer';
import { PageHeader, Section, CodeBlock, Divider } from '../components/Section';

export default function APIReferencePage() {
  return (
    <PageContainer maxWidth="6xl">
      {/* Header */}
      <PageHeader
        title="API Reference"
        titleGradient="blue"
        description="Complete API reference for AgentSea - REST API, WebSocket, and core classes."
      />

      {/* REST API & Streaming Section */}
      <div className="mb-16 bg-gradient-mesh rounded-xl p-8 relative overflow-hidden">
        <div className="orb orb-2 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl emoji">🌐</span>
            <h2 className="text-3xl font-bold text-white">
              REST API & Real-Time Streaming
            </h2>
          </div>

          <p className="text-white/80 mb-6">
            AgentSea provides comprehensive HTTP REST API, Server-Sent Events
            (SSE), and WebSocket support for building web applications, mobile
            apps, and real-time interfaces.
          </p>

          {/* Enable API */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gradient-purple">
              Quick Setup
            </h3>
            <CodeBlock language="typescript">
              {`import { AgenticModule } from '@lov3kaizen/agentsea-nestjs';

@Module({
  imports: [
    AgenticModule.forRoot({
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      enableRestApi: true,      // Enable HTTP REST endpoints
      enableWebSocket: true,     // Enable WebSocket gateway
    }),
  ],
})
export class AppModule {}`}
            </CodeBlock>
          </div>

          {/* REST Endpoints */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gradient-blue">
              HTTP REST Endpoints
            </h3>
            <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
              <table className="min-w-full divide-y divide-base-300">
                <thead className="bg-base-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-base-content/60 uppercase">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-base-content/60 uppercase">
                      Endpoint
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-base-content/60 uppercase">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-base-100 divide-y divide-base-300">
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-success">
                      GET
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">/agents</td>
                    <td className="px-4 py-3 text-sm">
                      List all registered agents
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-success">
                      GET
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      /agents/:name
                    </td>
                    <td className="px-4 py-3 text-sm">
                      Get agent details and configuration
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-info">
                      POST
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      /agents/:name/execute
                    </td>
                    <td className="px-4 py-3 text-sm">
                      Execute agent with input
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-info">
                      POST
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      /agents/:name/stream
                    </td>
                    <td className="px-4 py-3 text-sm">
                      Stream agent response (SSE)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-error">
                      DELETE
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      /agents/:name/conversations/:id
                    </td>
                    <td className="px-4 py-3 text-sm">
                      Clear conversation history
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SSE Example */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gradient-animated">
              Server-Sent Events (SSE)
            </h3>
            <p className="text-white/70 mb-4">
              Stream agent responses in real-time with Server-Sent Events:
            </p>
            <CodeBlock language="javascript">
              {`// Client-side SSE streaming
const response = await fetch('/agents/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  },
  body: JSON.stringify({ input: 'Hello!' }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Parse SSE events: iteration, content, tool_calls, tool_result, done, error
  console.log(chunk);
}`}
            </CodeBlock>
          </div>

          {/* WebSocket Example */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gradient-cool">
              WebSocket
            </h3>
            <p className="text-white/70 mb-4">
              Bidirectional real-time communication with Socket.IO:
            </p>
            <CodeBlock language="typescript">
              {`import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/agents');

// Execute agent
socket.emit('execute', {
  agentName: 'customer-support',
  input: 'Hello!',
});

// Listen for streaming events
socket.on('stream', (event) => {
  if (event.type === 'content') {
    console.log(event.content); // Real-time content
  }
});

// Get agent info
socket.emit('getAgent', { agentName: 'customer-support' });
socket.on('agentInfo', (info) => console.log(info));

// List all agents
socket.emit('listAgents');
socket.on('agentList', (data) => console.log(data.agents));`}
            </CodeBlock>
          </div>

          <div className="mt-8 flex gap-4 flex-wrap">
            <a
              href="https://github.com/lovekaizen/agentsea/blob/main/docs/API.md"
              className="btn btn-gradient"
            >
              <span>Full API Documentation →</span>
            </a>
            <a
              href="https://github.com/lovekaizen/agentsea/tree/main/examples"
              className="btn bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              View Examples →
            </a>
          </div>
        </div>
      </div>

      <Divider />

      {/* Core Classes */}
      {apiSections.map((section, index) => (
        <div key={index} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="badge badge-gradient px-3 py-2">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="text-3xl font-bold text-gradient-purple flex items-center gap-3">
              <span className="text-4xl emoji">{section.icon}</span>
              {section.title}
            </h2>
          </div>

          <div className="space-y-8">
            {section.classes.map((apiClass, classIndex) => (
              <div
                key={classIndex}
                className="bg-base-200 rounded-xl border border-base-300 overflow-hidden card-gradient-hover"
              >
                {/* Class Header */}
                <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-base-300">
                  <h3 className="text-2xl font-bold mb-2 text-gradient">
                    {apiClass.name}
                  </h3>
                  <p className="text-base-content/70">{apiClass.description}</p>
                </div>

                {/* Constructor */}
                {apiClass.constructor && (
                  <div className="p-6 border-b border-base-300">
                    <h4 className="font-semibold mb-3 text-gradient-blue">
                      Constructor
                    </h4>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto glow-purple">
                      <pre className="text-sm text-gray-100">
                        <code>{apiClass.constructor}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Methods */}
                {apiClass.methods && (
                  <div className="p-6 border-b border-base-300">
                    <h4 className="font-semibold mb-3 text-gradient-purple">
                      Methods
                    </h4>
                    <div className="space-y-4">
                      {apiClass.methods.map((method, methodIndex) => (
                        <div
                          key={methodIndex}
                          className="border-l-4 border-purple-500 pl-4"
                        >
                          <h5 className="font-mono text-sm font-semibold mb-1">
                            {method.signature}
                          </h5>
                          <p className="text-sm text-base-content/70">
                            {method.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Properties */}
                {'properties' in apiClass &&
                  apiClass.properties &&
                  apiClass.properties.length > 0 && (
                    <div className="p-6">
                      <h4 className="font-semibold mb-3 text-gradient-animated">
                        Properties
                      </h4>
                      <div className="bg-base-100 rounded-lg border border-base-300 overflow-hidden">
                        <table className="min-w-full divide-y divide-base-300">
                          <thead className="bg-base-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-base-content/60 uppercase">
                                Property
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-base-content/60 uppercase">
                                Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-base-content/60 uppercase">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-base-100 divide-y divide-base-300">
                            {apiClass.properties.map((prop, propIndex) => (
                              <tr key={propIndex}>
                                <td className="px-4 py-3 text-sm font-mono">
                                  {prop.name}
                                </td>
                                <td className="px-4 py-3 text-sm font-mono text-base-content/60">
                                  {prop.type}
                                </td>
                                <td className="px-4 py-3 text-sm text-base-content/70">
                                  {prop.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* TypeScript Types */}
      <div className="bg-gradient-mesh rounded-xl p-8 relative overflow-hidden">
        <div className="orb orb-1 opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <span className="emoji">📘</span> TypeScript Support
          </h2>
          <p className="text-white/80 mb-4">
            AgentSea is fully typed with comprehensive TypeScript definitions.
            Import types directly from the package:
          </p>
          <CodeBlock language="typescript">
            {`import type {
  AgentConfig,
  Message,
  Tool,
  ToolCall,
  LLMResponse,
  ExecutionContext,
  WorkflowConfig,
  MemoryStore,
} from '@lov3kaizen/agentsea-core';`}
          </CodeBlock>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/docs"
          className="card bg-base-200 border border-base-300 card-gradient-hover group"
        >
          <div className="card-body relative z-10">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-gradient transition-all flex items-center gap-2">
              <span className="emoji">📖</span> Documentation
            </h3>
            <p className="text-base-content/70">
              Read comprehensive guides and tutorials
            </p>
          </div>
        </Link>
        <Link
          href="/examples"
          className="card bg-base-200 border border-base-300 card-gradient-hover group"
        >
          <div className="card-body relative z-10">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-gradient transition-all flex items-center gap-2">
              <span className="emoji">💡</span> Examples
            </h3>
            <p className="text-base-content/70">
              Explore practical code examples
            </p>
          </div>
        </Link>
      </div>
    </PageContainer>
  );
}

const apiSections = [
  {
    icon: '🤖',
    title: 'Agent',
    classes: [
      {
        name: 'Agent',
        description: 'Core agent class for executing tasks with LLMs',
        constructor: `new Agent(
  config: AgentConfig,
  provider: LLMProvider,
  toolRegistry: ToolRegistry,
  memory?: MemoryStore
)`,
        methods: [
          {
            signature:
              'execute(prompt: string, context: ExecutionContext): Promise<LLMResponse>',
            description: 'Execute the agent with the given prompt and context',
          },
          {
            signature:
              'stream(prompt: string, context: ExecutionContext): AsyncIterable<LLMStreamChunk>',
            description: 'Stream agent responses in real-time',
          },
        ],
        properties: [
          {
            name: 'name',
            type: 'string',
            description: 'Agent name identifier',
          },
          {
            name: 'config',
            type: 'AgentConfig',
            description: 'Agent configuration',
          },
          {
            name: 'provider',
            type: 'LLMProvider',
            description: 'LLM provider instance',
          },
        ],
      },
    ],
  },
  {
    icon: '🔧',
    title: 'Tools',
    classes: [
      {
        name: 'ToolRegistry',
        description: 'Registry for managing agent tools',
        constructor: 'new ToolRegistry()',
        methods: [
          {
            signature: 'register(tool: Tool): void',
            description: 'Register a single tool',
          },
          {
            signature: 'registerMany(tools: Tool[]): void',
            description: 'Register multiple tools at once',
          },
          {
            signature: 'get(name: string): Tool | undefined',
            description: 'Get a tool by name',
          },
          {
            signature: 'has(name: string): boolean',
            description: 'Check if a tool exists',
          },
          {
            signature: 'list(): Tool[]',
            description: 'List all registered tools',
          },
          {
            signature: 'unregister(name: string): void',
            description: 'Remove a tool from the registry',
          },
        ],
      },
      {
        name: 'Tool',
        constructor: 'new Tool()',
        description: 'Tool interface for agent capabilities',
        properties: [
          {
            name: 'name',
            type: 'string',
            description: 'Unique tool identifier',
          },
          {
            name: 'description',
            type: 'string',
            description: 'What the tool does',
          },
          {
            name: 'inputSchema',
            type: 'ZodSchema',
            description: 'Zod schema for input validation',
          },
          {
            name: 'execute',
            type: '(input: any) => Promise<any>',
            description: 'Tool execution function',
          },
        ],
      },
    ],
  },
  {
    icon: '🔄',
    title: 'Workflows',
    classes: [
      {
        name: 'WorkflowFactory',
        description: 'Factory for creating workflow instances',
        constructor: 'Static factory class',
        methods: [
          {
            signature:
              'create(config: WorkflowConfig, provider: LLMProvider, toolRegistry: ToolRegistry): Workflow',
            description: 'Create a workflow from configuration',
          },
        ],
      },
      {
        name: 'SequentialWorkflow',
        description: 'Execute agents one after another',
        constructor: 'new SequentialWorkflow(agents: Agent[])',
        methods: [
          {
            signature:
              'execute(input: string, context: ExecutionContext): Promise<LLMResponse>',
            description: 'Execute workflow sequentially',
          },
        ],
      },
      {
        name: 'ParallelWorkflow',
        description: 'Execute agents in parallel',
        constructor: 'new ParallelWorkflow(agents: Agent[])',
        methods: [
          {
            signature:
              'execute(input: string, context: ExecutionContext): Promise<LLMResponse>',
            description: 'Execute workflow in parallel',
          },
        ],
      },
    ],
  },
  {
    icon: '💾',
    title: 'Memory',
    classes: [
      {
        name: 'BufferMemory',
        description: 'In-memory storage for conversation history',
        constructor: 'new BufferMemory(maxMessages: number)',
        methods: [
          {
            signature:
              'save(conversationId: string, messages: Message[]): Promise<void>',
            description: 'Save messages to memory',
          },
          {
            signature: 'load(conversationId: string): Promise<Message[]>',
            description: 'Load messages from memory',
          },
          {
            signature: 'clear(conversationId: string): Promise<void>',
            description: 'Clear conversation history',
          },
        ],
      },
      {
        name: 'RedisMemory',
        description: 'Persistent storage using Redis',
        constructor: 'new RedisMemory(options: RedisMemoryOptions)',
        methods: [
          {
            signature:
              'save(conversationId: string, messages: Message[]): Promise<void>',
            description: 'Save messages to Redis',
          },
          {
            signature: 'load(conversationId: string): Promise<Message[]>',
            description: 'Load messages from Redis',
          },
          {
            signature: 'disconnect(): Promise<void>',
            description: 'Disconnect from Redis',
          },
        ],
      },
    ],
  },
  {
    icon: '🔌',
    title: 'MCP',
    classes: [
      {
        name: 'MCPRegistry',
        description: 'Manage multiple MCP server connections',
        constructor: 'new MCPRegistry()',
        methods: [
          {
            signature: 'addServer(config: MCPServerConfig): Promise<MCPClient>',
            description: 'Connect to an MCP server',
          },
          {
            signature: 'removeServer(name: string): Promise<void>',
            description: 'Disconnect from an MCP server',
          },
          {
            signature: 'getTools(): Tool[]',
            description: 'Get all tools from all servers',
          },
          {
            signature: 'getServerTools(serverName: string): Tool[]',
            description: 'Get tools from specific server',
          },
          {
            signature: 'disconnectAll(): Promise<void>',
            description: 'Disconnect from all servers',
          },
        ],
      },
    ],
  },
  {
    icon: '📊',
    title: 'Observability',
    classes: [
      {
        name: 'Logger',
        description: 'Structured logging with Winston',
        constructor: 'new Logger(options?: LoggerOptions)',
        methods: [
          {
            signature: 'error(message: string, meta?: any): void',
            description: 'Log error message',
          },
          {
            signature: 'warn(message: string, meta?: any): void',
            description: 'Log warning message',
          },
          {
            signature: 'info(message: string, meta?: any): void',
            description: 'Log info message',
          },
          {
            signature: 'debug(message: string, meta?: any): void',
            description: 'Log debug message',
          },
        ],
      },
      {
        name: 'Metrics',
        description: 'Performance metrics collection',
        constructor: 'new Metrics()',
        methods: [
          {
            signature:
              'recordCounter(name: string, value: number, tags?: Record<string, string>): void',
            description: 'Record counter metric',
          },
          {
            signature:
              'recordHistogram(name: string, value: number, tags?: Record<string, string>): void',
            description: 'Record histogram metric',
          },
          {
            signature:
              'recordGauge(name: string, value: number, tags?: Record<string, string>): void',
            description: 'Record gauge metric',
          },
        ],
      },
    ],
  },
];
