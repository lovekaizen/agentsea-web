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
                <div className="p-6 bg-gradient-to-r from-sky-600/10 to-cyan-500/10 border-b border-base-300">
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
                          className="border-l-4 border-cyan-500 pl-4"
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
            Types are available from the dedicated types package or re-exported from core:
          </p>

          {/* Types Package */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gradient-purple">
              Dedicated Types Package
            </h3>
            <CodeBlock language="bash">
              {`npm install @lov3kaizen/agentsea-types`}
            </CodeBlock>
          </div>

          {/* Core Types */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gradient-blue">
              Core Agent Types
            </h3>
            <CodeBlock language="typescript">
              {`import type {
  // Agent & Execution
  AgentConfig,
  AgentContext,
  AgentResponse,
  Message,
  FormattedContent,
  OutputFormat,
  FormatOptions,

  // Tools
  Tool,
  ToolCall,
  ToolContext,
  RetryConfig,

  // Providers
  LLMProvider,
  ProviderConfig,
  LLMResponse,
  LLMStreamChunk,
  ProviderInstanceConfig,

  // Memory
  MemoryConfig,
  MemoryStore,

  // Workflows
  WorkflowType,
  WorkflowConfig,
  RoutingLogic,
  RoutingRule,
  ErrorHandlingStrategy,

  // Streaming
  StreamEvent,

  // Observability
  AgentMetrics,
  SpanContext,
} from '@lov3kaizen/agentsea-types';
// Or from core: '@lov3kaizen/agentsea-core'`}
            </CodeBlock>
          </div>

          {/* Multi-Tenancy Types */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gradient-animated">
              Multi-Tenancy Types
            </h3>
            <CodeBlock language="typescript">
              {`import type {
  Tenant,
  TenantStatus,
  TenantSettings,
  TenantContext,
  TenantApiKey,
  TenantQuota,
  TenantStorage,
  TenantResolver,
} from '@lov3kaizen/agentsea-types';`}
            </CodeBlock>
          </div>

          {/* Voice Types */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gradient-cool">
              Voice & Speech Types
            </h3>
            <CodeBlock language="typescript">
              {`import type {
  AudioFormat,
  VoiceType,
  STTConfig,
  TTSConfig,
  STTResult,
  TTSResult,
  STTProvider,
  TTSProvider,
  VoiceMessage,
  VoiceAgentConfig,
} from '@lov3kaizen/agentsea-types';`}
            </CodeBlock>
          </div>

          {/* MCP & ACP Types */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gradient-warm">
              Protocol Types (MCP & ACP)
            </h3>
            <CodeBlock language="typescript">
              {`// Model Context Protocol
import type {
  MCPServerConfig,
  MCPTool,
  MCPResource,
  MCPPrompt,
} from '@lov3kaizen/agentsea-core';

// Agentic Commerce Protocol
import type {
  ACPProduct,
  ACPCart,
  ACPCheckoutSession,
  ACPOrder,
  ACPCustomer,
} from '@lov3kaizen/agentsea-core';`}
            </CodeBlock>
          </div>
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
              'execute(prompt: string, context: AgentContext): Promise<AgentResponse>',
            description: 'Execute the agent with the given prompt and context',
          },
          {
            signature:
              'executeStream(prompt: string, context: AgentContext): AsyncIterable<StreamEvent>',
            description: 'Stream agent responses in real-time with events',
          },
          {
            signature:
              'formatResponse(response: AgentResponse): FormattedContent',
            description: 'Format agent response to specified output format',
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
      {
        name: 'ContentFormatter',
        description: 'Format agent output to text, markdown, HTML, or React',
        constructor: 'Static utility class',
        methods: [
          {
            signature:
              'static format(content: string, format: OutputFormat, options?: FormatOptions): FormattedContent',
            description: 'Format content to specified output format',
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
      {
        name: 'SummaryMemory',
        description: 'Memory with automatic summarization of older messages',
        constructor: 'new SummaryMemory(options: SummaryMemoryOptions)',
        methods: [
          {
            signature:
              'save(conversationId: string, messages: Message[]): Promise<void>',
            description: 'Save messages with automatic summarization',
          },
          {
            signature: 'load(conversationId: string): Promise<Message[]>',
            description: 'Load messages including summaries',
          },
          {
            signature: 'search(conversationId: string, query: string): Promise<Message[]>',
            description: 'Search messages by semantic similarity',
          },
        ],
      },
      {
        name: 'TenantBufferMemory',
        description: 'Tenant-scoped in-memory storage',
        constructor: 'new TenantBufferMemory(maxMessages: number)',
        methods: [
          {
            signature:
              'save(conversationId: string, messages: Message[], tenantId: string): Promise<void>',
            description: 'Save messages scoped to tenant',
          },
          {
            signature: 'load(conversationId: string, tenantId: string): Promise<Message[]>',
            description: 'Load tenant-scoped messages',
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
        name: 'MetricsCollector',
        description: 'Performance metrics collection and aggregation',
        constructor: 'new MetricsCollector()',
        methods: [
          {
            signature: 'record(metrics: AgentMetrics): void',
            description: 'Record agent execution metrics',
          },
          {
            signature: 'getAll(): AgentMetrics[]',
            description: 'Get all recorded metrics',
          },
          {
            signature: 'getByAgent(agentName: string): AgentMetrics[]',
            description: 'Get metrics for specific agent',
          },
          {
            signature: 'getByTimeRange(start: Date, end: Date): AgentMetrics[]',
            description: 'Get metrics within time range',
          },
          {
            signature: 'getStats(agentName?: string): MetricsStats',
            description: 'Get aggregated statistics',
          },
          {
            signature: 'subscribe(callback: (metrics: AgentMetrics) => void): () => void',
            description: 'Subscribe to new metrics events',
          },
        ],
      },
      {
        name: 'Tracer',
        description: 'Distributed tracing for agent executions',
        constructor: 'new Tracer()',
        methods: [
          {
            signature: 'startSpan(name: string, context?: SpanContext): Span',
            description: 'Start a new trace span',
          },
          {
            signature: 'endSpan(span: Span): void',
            description: 'End a trace span',
          },
        ],
      },
    ],
  },
  {
    icon: '🎙️',
    title: 'Voice',
    classes: [
      {
        name: 'VoiceAgent',
        description: 'Voice-enabled agent with speech-to-text and text-to-speech',
        constructor: `new VoiceAgent(
  agent: Agent,
  config: VoiceAgentConfig
)`,
        methods: [
          {
            signature: 'processVoice(audio: Buffer): Promise<VoiceMessage>',
            description: 'Process audio input and return voice response',
          },
          {
            signature: 'speak(text: string): Promise<VoiceMessage>',
            description: 'Convert text to voice response',
          },
          {
            signature: 'transcribe(audio: Buffer): Promise<STTResult>',
            description: 'Transcribe audio to text',
          },
          {
            signature: 'synthesize(text: string): Promise<TTSResult>',
            description: 'Synthesize text to audio',
          },
          {
            signature: 'synthesizeStream(text: string): AsyncIterable<Buffer>',
            description: 'Stream synthesized audio chunks',
          },
          {
            signature: 'getHistory(): VoiceMessage[]',
            description: 'Get voice conversation history',
          },
          {
            signature: 'saveAudio(audio: Buffer, path: string): Promise<void>',
            description: 'Save audio buffer to file',
          },
        ],
      },
      {
        name: 'OpenAIWhisperProvider',
        description: 'OpenAI Whisper speech-to-text provider',
        constructor: 'new OpenAIWhisperProvider(apiKey: string)',
        methods: [
          {
            signature: 'transcribe(audio: Buffer, config?: STTConfig): Promise<STTResult>',
            description: 'Transcribe audio using Whisper',
          },
        ],
      },
      {
        name: 'OpenAITTSProvider',
        description: 'OpenAI text-to-speech provider',
        constructor: 'new OpenAITTSProvider(apiKey: string)',
        methods: [
          {
            signature: 'synthesize(text: string, config?: TTSConfig): Promise<TTSResult>',
            description: 'Synthesize speech using OpenAI TTS',
          },
          {
            signature: 'getVoices(): Promise<VoiceType[]>',
            description: 'Get available voice options',
          },
        ],
      },
      {
        name: 'ElevenLabsTTSProvider',
        description: 'ElevenLabs high-quality text-to-speech',
        constructor: 'new ElevenLabsTTSProvider(apiKey: string)',
        methods: [
          {
            signature: 'synthesize(text: string, config?: TTSConfig): Promise<TTSResult>',
            description: 'Synthesize speech using ElevenLabs',
          },
          {
            signature: 'synthesizeStream(text: string, config?: TTSConfig): AsyncIterable<Buffer>',
            description: 'Stream synthesized audio',
          },
        ],
      },
    ],
  },
  {
    icon: '💬',
    title: 'Conversation',
    classes: [
      {
        name: 'ConversationSchema',
        description: 'Define structured multi-step conversation flows',
        constructor: 'new ConversationSchema(config: ConversationSchemaConfig)',
        methods: [
          {
            signature: 'getState(): ConversationState',
            description: 'Get current conversation state',
          },
          {
            signature: 'getCurrentStep(): ConversationStep',
            description: 'Get current step configuration',
          },
          {
            signature: 'processResponse(response: string): ProcessResult',
            description: 'Process response and advance conversation',
          },
          {
            signature: 'reset(): void',
            description: 'Reset conversation to initial state',
          },
        ],
      },
      {
        name: 'ConversationManager',
        description: 'Manage AI-assisted structured conversations',
        constructor: `new ConversationManager(
  schema: ConversationSchema,
  agent: Agent
)`,
        methods: [
          {
            signature: 'start(): Promise<Message>',
            description: 'Start the conversation',
          },
          {
            signature: 'processMessage(input: string): Promise<Message>',
            description: 'Process user input with AI assistance',
          },
          {
            signature: 'getState(): ConversationState',
            description: 'Get current conversation state',
          },
          {
            signature: 'getHistory(): Message[]',
            description: 'Get conversation history',
          },
          {
            signature: 'export(): ConversationExport',
            description: 'Export conversation for persistence',
          },
          {
            signature: 'import(data: ConversationExport): void',
            description: 'Import saved conversation',
          },
        ],
      },
    ],
  },
  {
    icon: '🏢',
    title: 'Multi-Tenancy',
    classes: [
      {
        name: 'TenantManager',
        description: 'Manage tenant lifecycle and isolation',
        constructor: 'new TenantManager(storage: TenantStorage)',
        methods: [
          {
            signature: 'createTenant(data: CreateTenantData): Promise<Tenant>',
            description: 'Create a new tenant',
          },
          {
            signature: 'getTenant(id: string): Promise<Tenant | null>',
            description: 'Get tenant by ID',
          },
          {
            signature: 'getTenantBySlug(slug: string): Promise<Tenant | null>',
            description: 'Get tenant by slug',
          },
          {
            signature: 'updateTenant(id: string, data: UpdateTenantData): Promise<Tenant>',
            description: 'Update tenant settings',
          },
          {
            signature: 'deleteTenant(id: string): Promise<void>',
            description: 'Delete a tenant',
          },
          {
            signature: 'listTenants(options?: ListOptions): Promise<Tenant[]>',
            description: 'List all tenants with pagination',
          },
          {
            signature: 'createApiKey(tenantId: string, data: CreateApiKeyData): Promise<TenantApiKey>',
            description: 'Create API key for tenant',
          },
          {
            signature: 'revokeApiKey(keyId: string): Promise<void>',
            description: 'Revoke an API key',
          },
        ],
      },
      {
        name: 'MemoryTenantStorage',
        description: 'In-memory tenant storage implementation',
        constructor: 'new MemoryTenantStorage()',
        methods: [
          {
            signature: 'createTenant(tenant: Tenant): Promise<Tenant>',
            description: 'Store a new tenant',
          },
          {
            signature: 'getTenant(id: string): Promise<Tenant | null>',
            description: 'Retrieve tenant by ID',
          },
          {
            signature: 'updateQuota(tenantId: string, quota: TenantQuota): Promise<void>',
            description: 'Update tenant quota usage',
          },
        ],
      },
    ],
  },
  {
    icon: '🛒',
    title: 'ACP (Commerce)',
    classes: [
      {
        name: 'ACPClient',
        description: 'Agentic Commerce Protocol client for e-commerce integration',
        constructor: 'new ACPClient(config: ACPConfig)',
        methods: [
          {
            signature: 'searchProducts(query: ACPProductSearchQuery): Promise<ACPProductSearchResult>',
            description: 'Search products in catalog',
          },
          {
            signature: 'getProduct(productId: string): Promise<ACPProduct>',
            description: 'Get product details',
          },
          {
            signature: 'createCart(customerId?: string): Promise<ACPCart>',
            description: 'Create a new shopping cart',
          },
          {
            signature: 'addToCart(cartId: string, productId: string, quantity: number): Promise<ACPCart>',
            description: 'Add item to cart',
          },
          {
            signature: 'createCheckoutSession(cartId: string): Promise<ACPCheckoutSession>',
            description: 'Create checkout session',
          },
          {
            signature: 'processPayment(sessionId: string, paymentMethod: ACPPaymentMethod): Promise<ACPPaymentIntent>',
            description: 'Process payment for checkout',
          },
          {
            signature: 'getOrder(orderId: string): Promise<ACPOrder>',
            description: 'Get order details',
          },
        ],
        properties: [
          {
            name: 'config',
            type: 'ACPConfig',
            description: 'Client configuration',
          },
        ],
      },
    ],
  },
];
