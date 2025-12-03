import Link from 'next/link';
import PageContainer from '../components/PageContainer';
import ExamplesGrid from '../components/ExamplesGrid';
import { PageHeader, Divider } from '../components/Section';

export default function ExamplesPage() {
  return (
    <PageContainer maxWidth="7xl">
      {/* Header */}
      <PageHeader
        title="Examples"
        titleGradient="warm"
        description="Explore practical examples to learn how to build powerful agentic AI applications with AgentSea."
      />

      {/* Interactive Examples Grid */}
      <ExamplesGrid examples={examples} />

      <Divider />

      {/* Getting Started Section */}
      <div className="mt-16 bg-gradient-mesh rounded-xl p-8 py-16 relative overflow-hidden">
        <div className="orb orb-1 opacity-20"></div>
        <div className="orb orb-2 opacity-20"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to <span className="text-gradient-animated">Get Started</span>
            ?
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Check out our comprehensive documentation to learn more about
            building with AgentSea.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/docs/quick-start" className="btn btn-gradient btn-lg">
              <span>Quick Start Guide</span>
            </Link>
            <Link
              href="/docs"
              className="btn btn-lg bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              Full Documentation
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-gradient-purple">
          Additional Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.href}
              className="card bg-base-200 border border-base-300 card-gradient-hover group"
            >
              <div className="card-body relative z-10">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {resource.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-gradient transition-all">
                  {resource.title}
                </h3>
                <p className="text-base-content/70 text-sm">
                  {resource.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

const examples = [
  {
    icon: '💬',
    title: 'Basic Chatbot',
    description:
      'Create a simple conversational agent with memory and tool calling capabilities.',
    tags: ['Agent', 'Memory', 'Tools'],
    category: 'Getting Started',
    difficulty: 'Beginner' as const,
    code: `import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  BufferMemory,
  calculatorTool,
} from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  {
    name: 'chatbot',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: 'You are a helpful assistant.',
    tools: [calculatorTool],
  },
  new AnthropicProvider(),
  new ToolRegistry(),
  new BufferMemory(50),
);

const response = await agent.execute(
  'What is 42 * 58?',
  { conversationId: 'user-123', sessionData: {}, history: [] }
);`,
    useCases: [
      'Customer support chatbots',
      'Virtual assistants',
      'FAQ automation',
    ],
  },
  {
    icon: '📝',
    title: 'Content Pipeline',
    description:
      'Sequential workflow for research, writing, and editing content.',
    tags: ['Workflow', 'Sequential', 'Multi-Agent'],
    category: 'Workflows',
    difficulty: 'Intermediate' as const,
    code: `import { WorkflowFactory } from '@lov3kaizen/agentsea-core';

const workflow = WorkflowFactory.create(
  {
    name: 'content-pipeline',
    type: 'sequential',
    agents: [
      {
        name: 'researcher',
        systemPrompt: 'Research and gather information.',
        tools: [httpRequestTool],
      },
      {
        name: 'writer',
        systemPrompt: 'Write comprehensive content.',
      },
      {
        name: 'editor',
        systemPrompt: 'Edit and polish for publication.',
      },
    ],
  },
  provider,
  toolRegistry,
);

const result = await workflow.execute(
  'Write an article about AI agents',
  context
);`,
    useCases: ['Blog post generation', 'Report writing', 'Content marketing'],
  },
  {
    icon: '🔌',
    title: 'MCP Integration',
    description: 'Connect to MCP servers for filesystem, GitHub, and more.',
    tags: ['MCP', 'Tools', 'Integration'],
    category: 'Integration',
    difficulty: 'Intermediate' as const,
    code: `import { MCPRegistry } from '@lov3kaizen/agentsea-core';

const mcpRegistry = new MCPRegistry();

await mcpRegistry.addServer({
  name: 'filesystem',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
  transport: 'stdio',
});

await mcpRegistry.addServer({
  name: 'github',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-github'],
  transport: 'stdio',
  env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN },
});

const tools = mcpRegistry.getTools();
// Tools: filesystem:read_file, github:create_issue, etc.`,
    useCases: [
      'File system automation',
      'GitHub operations',
      'Database queries',
    ],
  },
  {
    icon: '🎯',
    title: 'Customer Support Router',
    description:
      'Supervisor workflow that routes requests to specialized agents.',
    tags: ['Workflow', 'Supervisor', 'Routing'],
    category: 'Workflows',
    difficulty: 'Advanced' as const,
    code: `import { WorkflowFactory } from '@lov3kaizen/agentsea-core';

const workflow = WorkflowFactory.create(
  {
    name: 'support-router',
    type: 'supervisor',
    supervisor: {
      name: 'router',
      systemPrompt: 'Route to: technical-support, billing, or general',
    },
    agents: [
      {
        name: 'technical-support',
        systemPrompt: 'Provide technical support.',
        tools: [databaseQueryTool],
      },
      {
        name: 'billing',
        systemPrompt: 'Handle billing inquiries.',
      },
      {
        name: 'general',
        systemPrompt: 'General support.',
      },
    ],
  },
  provider,
  toolRegistry,
);`,
    useCases: [
      'Support ticket routing',
      'Department-specific help',
      'Escalation handling',
    ],
  },
  {
    icon: '📊',
    title: 'Data Analysis Pipeline',
    description: 'Parallel workflow for multi-perspective data analysis.',
    tags: ['Workflow', 'Parallel', 'Analysis'],
    category: 'Workflows',
    difficulty: 'Intermediate' as const,
    code: `import { WorkflowFactory } from '@lov3kaizen/agentsea-core';

const workflow = WorkflowFactory.create(
  {
    name: 'analysis',
    type: 'parallel',
    agents: [
      {
        name: 'sentiment',
        systemPrompt: 'Analyze sentiment.',
      },
      {
        name: 'keywords',
        systemPrompt: 'Extract keywords.',
      },
      {
        name: 'summary',
        systemPrompt: 'Summarize content.',
      },
    ],
  },
  provider,
  toolRegistry,
);

const result = await workflow.execute(
  'Analyze this product review: ...',
  context
);`,
    useCases: [
      'Product review analysis',
      'Social media monitoring',
      'Market research',
    ],
  },
  {
    icon: '🏢',
    title: 'NestJS Application',
    description: 'Enterprise-ready agent service with NestJS integration.',
    tags: ['NestJS', 'API', 'Production'],
    category: 'Integration',
    difficulty: 'Advanced' as const,
    code: `import { Module, Controller, Injectable } from '@nestjs/common';
import { AgenticModule } from '@lov3kaizen/agentsea-nestjs';

@Module({
  imports: [
    AgenticModule.forRoot({
      provider: new AnthropicProvider(),
      defaultConfig: {
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
      },
    }),
  ],
})
export class AppModule {}

@Injectable()
export class ChatService {
  async chat(message: string) {
    return this.agent.execute(message, context);
  }
}

@Controller('chat')
export class ChatController {
  @Post()
  async chat(@Body('message') message: string) {
    return this.chatService.chat(message);
  }
}`,
    useCases: ['REST API services', 'Enterprise applications', 'Microservices'],
  },
  {
    icon: '🦙',
    title: 'Local Agent with Ollama',
    description:
      'Run agents completely offline with local models for privacy and cost savings.',
    tags: ['Local', 'Ollama', 'Privacy'],
    category: 'Local Models',
    difficulty: 'Beginner' as const,
    code: `import {
  Agent,
  OllamaProvider,
  ToolRegistry,
  BufferMemory,
  calculatorTool,
} from '@lov3kaizen/agentsea-core';

// No API key needed - runs locally!
const provider = new OllamaProvider({
  baseUrl: 'http://localhost:11434',
  model: 'llama3.2' // or mistral, gemma2, etc.
});

const agent = new Agent(
  {
    name: 'local-assistant',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful assistant running locally.',
    tools: [calculatorTool],
    temperature: 0.7,
  },
  provider,
  new ToolRegistry(),
  new BufferMemory(50),
);

// Completely private - no data leaves your machine
const response = await agent.execute(
  'What is 156 * 89?',
  { conversationId: 'local-user', sessionData: {}, history: [] }
);`,
    useCases: [
      'Privacy-sensitive applications',
      'Offline/air-gapped environments',
      'Cost-free development',
    ],
  },
  {
    icon: '⚡',
    title: 'High-Performance Local Workflow',
    description: 'Multi-agent workflow using llama.cpp for maximum speed.',
    tags: ['Local', 'llama.cpp', 'Workflow'],
    category: 'Local Models',
    difficulty: 'Advanced' as const,
    code: `import { WorkflowFactory, LlamaCppProvider } from '@lov3kaizen/agentsea-core';

// Ultra-fast inference with llama.cpp
const provider = new LlamaCppProvider({
  baseUrl: 'http://localhost:8080',
  model: 'llama-3.2-3b-q4_k_m'
});

const workflow = WorkflowFactory.create(
  {
    name: 'local-analysis',
    type: 'parallel',
    agents: [
      {
        name: 'summarizer',
        model: 'llama-3.2-3b-q4_k_m',
        provider: 'llama-cpp',
        systemPrompt: 'Summarize the main points.',
      },
      {
        name: 'sentiment',
        model: 'llama-3.2-3b-q4_k_m',
        provider: 'llama-cpp',
        systemPrompt: 'Analyze sentiment.',
      },
      {
        name: 'keywords',
        model: 'llama-3.2-3b-q4_k_m',
        provider: 'llama-cpp',
        systemPrompt: 'Extract key terms.',
      },
    ],
  },
  provider,
  new ToolRegistry(),
);

// All agents run in parallel locally - blazing fast!
const result = await workflow.execute(
  'Analyze: The product is great but expensive.',
  context
);`,
    useCases: [
      'Real-time text analysis',
      'High-throughput processing',
      'Low-latency requirements',
    ],
  },
  {
    icon: '📈',
    title: 'Observability Setup',
    description:
      'Monitor agents with logging, metrics, and distributed tracing.',
    tags: ['Observability', 'Monitoring', 'Metrics'],
    category: 'Production',
    difficulty: 'Advanced' as const,
    code: `import { Logger, globalMetrics, globalTracer } from '@lov3kaizen/agentsea-core';

const logger = new Logger({ level: 'info' });

// Log execution
logger.info('Agent started', { agentName: 'chat-agent' });

// Track metrics
globalMetrics.recordCounter('agent.executions', 1, {
  agentName: 'chat-agent',
  status: 'success',
});

globalMetrics.recordHistogram('agent.latency', 1250, {
  agentName: 'chat-agent',
});

// Create trace
const trace = globalTracer.createTrace('user-request');
const span = trace.createSpan('agent-execution');
// ... execute agent
span.end();

// Export to monitoring service
globalMetrics.subscribe((metric) => {
  sendToPrometheus(metric);
});`,
    useCases: ['Performance monitoring', 'Error tracking', 'Usage analytics'],
  },
  {
    icon: '🔐',
    title: 'Advanced Memory Management',
    description:
      'Use Redis and summary memory for persistent, scalable storage.',
    tags: ['Memory', 'Redis', 'Production'],
    category: 'Production',
    difficulty: 'Advanced' as const,
    code: `import { RedisMemory, SummaryMemory } from '@lov3kaizen/agentsea-core';

// Redis for persistence
const redisMemory = new RedisMemory({
  url: 'redis://localhost:6379',
  ttl: 86400, // 24 hours
  keyPrefix: 'agent:',
});

// Summary for long conversations
const summaryMemory = new SummaryMemory(
  new AnthropicProvider(),
  {
    maxMessages: 20,
    summaryModel: 'claude-haiku-4-20250514',
  },
);

const agent = new Agent(
  config,
  provider,
  toolRegistry,
  redisMemory, // or summaryMemory
);

// Memory persists across restarts
await agent.execute('Remember: my name is Alice', context);`,
    useCases: [
      'Multi-server deployments',
      'Long-running conversations',
      'Cost optimization',
    ],
  },
  {
    icon: '🏢',
    title: 'Multi-Tenancy Support',
    description:
      'Build SaaS applications with complete tenant isolation and API key authentication.',
    tags: ['Multi-Tenancy', 'SaaS', 'Enterprise'],
    category: 'Production',
    difficulty: 'Advanced' as const,
    code: `import {
  TenantManager,
  MemoryTenantStorage,
  TenantBufferMemory,
  Agent,
} from '@lov3kaizen/agentsea-core';

// Initialize multi-tenancy
const storage = new MemoryTenantStorage();
const tenantManager = new TenantManager(storage);

// Create tenant
const tenant = await tenantManager.createTenant({
  name: 'Acme Corp',
  slug: 'acme-corp',
  settings: {
    maxAgents: 10,
    maxConversations: 100,
    allowedProviders: ['anthropic'],
  },
});

// Generate API key
const apiKey = await tenantManager.generateApiKey(tenant.id);

// Tenant-isolated memory
const memory = new TenantBufferMemory();

// Execute with tenant context
const response = await agent.execute(message, {
  conversationId: 'conv-1',
  sessionData: { tenantId: tenant.id },
  history: await memory.load(tenant.id, 'conv-1'),
});

// Track usage
await tenantManager.recordQuotaUsage(tenant.id, {
  resource: 'api_calls',
  amount: 1,
  period: 'hourly',
});`,
    useCases: [
      'Multi-tenant SaaS platforms',
      'Enterprise customer isolation',
      'Usage tracking and billing',
    ],
  },
  {
    icon: '🎙️',
    title: 'Voice-Enabled Agent',
    description:
      'Create agents with built-in speech-to-text and text-to-speech capabilities.',
    tags: ['Voice', 'STT', 'TTS'],
    category: 'Integration',
    difficulty: 'Intermediate' as const,
    code: `import {
  VoiceAgent,
  Agent,
  OpenAIWhisperProvider,
  OpenAITTSProvider,
  AnthropicProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';
import fs from 'fs';

// Create base agent
const agent = new Agent(
  {
    name: 'voice-assistant',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: 'You are a helpful voice assistant.',
  },
  new AnthropicProvider(),
  new ToolRegistry(),
);

// Wrap with voice capabilities
const voiceAgent = new VoiceAgent(agent, {
  sttProvider: new OpenAIWhisperProvider(),
  ttsProvider: new OpenAITTSProvider({ voice: 'nova' }),
  autoSpeak: true, // Automatically convert responses to speech
});

// Voice in → Voice out
const audioFile = fs.readFileSync('./user-question.mp3');
const result = await voiceAgent.processVoice(audioFile, context);

// Save voice response
fs.writeFileSync('./agent-response.mp3', result.audio);`,
    useCases: [
      'Voice assistants',
      'Accessibility applications',
      'Hands-free interfaces',
    ],
  },
];

const resources = [
  {
    icon: '📖',
    title: 'Documentation',
    description: 'Comprehensive guides and API references',
    href: '/docs',
  },
  {
    icon: '🐙',
    title: 'GitHub Repository',
    description: 'View source code and contribute',
    href: 'https://github.com/lov3kaizen/agentsea',
  },
  {
    icon: '💬',
    title: 'Community',
    description: 'Join discussions and get help',
    href: 'https://github.com/lov3kaizen/agentsea/discussions',
  },
];
