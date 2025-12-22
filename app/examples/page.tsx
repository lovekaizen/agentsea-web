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
  {
    icon: '👥',
    title: 'Multi-Agent Crew',
    description:
      'Create a research crew with role-based agents and delegation strategies.',
    tags: ['Crews', 'Multi-Agent', 'Roles'],
    category: 'Multi-Agent',
    difficulty: 'Intermediate' as const,
    code: `import { createCrew, createResearchCrew, ResearchTasks } from '@lov3kaizen/agentsea-crews';

// Option 1: Use pre-built template
const researchCrew = createResearchCrew({
  depth: 'deep',
  includeWriter: true,
});

researchCrew.addTask(ResearchTasks.research('AI agents', 'deep'));
researchCrew.addTask(ResearchTasks.writeReport('AI Agents Analysis', 'executive'));

const result = await researchCrew.kickoff();

// Option 2: Create custom crew
const customCrew = createCrew({
  name: 'analysis-crew',
  delegationStrategy: 'best-match', // or 'consensus', 'auction', 'hierarchical'
  agents: [
    {
      name: 'analyst',
      role: {
        name: 'Data Analyst',
        capabilities: [{ name: 'analysis', proficiency: 'expert' }],
        goals: ['Provide accurate analysis'],
      },
      model: 'claude-sonnet-4-20250514',
      provider: 'anthropic',
    },
  ],
});`,
    useCases: [
      'Research teams',
      'Content creation pipelines',
      'Code review workflows',
    ],
  },
  {
    icon: '🌐',
    title: 'LLM Gateway',
    description:
      'OpenAI-compatible gateway with intelligent routing and cost optimization.',
    tags: ['Gateway', 'Routing', 'Cost'],
    category: 'Infrastructure',
    difficulty: 'Intermediate' as const,
    code: `import { Gateway, createHTTPServer, startServer } from '@lov3kaizen/agentsea-gateway';

const gateway = new Gateway({
  providers: [
    { name: 'openai', apiKey: process.env.OPENAI_API_KEY, models: ['gpt-4o'] },
    { name: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY, models: ['claude-3-5-sonnet'] },
  ],
  routing: { strategy: 'cost-optimized' },
  cache: { enabled: true, ttl: 3600 },
});

// Use virtual models for auto-routing
const response = await gateway.chat.completions.create({
  model: 'cheapest', // or 'best', 'fastest'
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response._gateway); // { provider, cost, latencyMs }

// Or run as HTTP server
const app = createHTTPServer({ gateway });
startServer(app, { port: 3000 });`,
    useCases: [
      'Multi-provider LLM access',
      'Cost optimization',
      'High availability',
    ],
  },
  {
    icon: '🛡️',
    title: 'Safety Guardrails',
    description:
      'Add content safety, prompt injection detection, and PII filtering.',
    tags: ['Guardrails', 'Safety', 'Security'],
    category: 'Safety',
    difficulty: 'Intermediate' as const,
    code: `import {
  createGuardrailsEngine,
  ToxicityGuard,
  PIIGuard,
  PromptInjectionGuard,
} from '@lov3kaizen/agentsea-guardrails';

const engine = createGuardrailsEngine({
  guards: [
    { name: 'toxicity', enabled: true, type: 'input', action: 'block' },
    { name: 'pii', enabled: true, type: 'both', action: 'transform' },
    { name: 'prompt-injection', enabled: true, type: 'input', action: 'block' },
  ],
  failureMode: 'fail-fast',
});

engine.registerGuard(new ToxicityGuard({ sensitivity: 'medium' }));
engine.registerGuard(new PIIGuard({ types: ['email', 'phone'], maskingStrategy: 'redact' }));
engine.registerGuard(new PromptInjectionGuard({ sensitivity: 'high' }));

// Check input before sending to LLM
const result = await engine.checkInput(userMessage, { sessionId: 'user-1' });

if (result.passed) {
  const response = await agent.execute(result.transformedContent || userMessage);
  // Check output before returning to user
  const outputCheck = await engine.checkOutput(response.content);
}`,
    useCases: [
      'Content moderation',
      'PII protection',
      'Security hardening',
    ],
  },
  {
    icon: '📊',
    title: 'LLM Evaluation Pipeline',
    description:
      'Evaluate LLM quality with metrics, LLM-as-Judge, and human feedback.',
    tags: ['Evaluation', 'Metrics', 'Quality'],
    category: 'Quality',
    difficulty: 'Advanced' as const,
    code: `import {
  EvaluationPipeline,
  AccuracyMetric,
  RelevanceMetric,
  RubricJudge,
  EvalDataset,
} from '@lov3kaizen/agentsea-evaluate';

// Create evaluation pipeline
const pipeline = new EvaluationPipeline({
  metrics: [
    new AccuracyMetric({ type: 'fuzzy' }),
    new RelevanceMetric(),
  ],
  parallelism: 5,
});

// Create test dataset
const dataset = new EvalDataset({
  items: [
    { id: '1', input: 'What is the capital of France?', expectedOutput: 'Paris' },
    { id: '2', input: 'What is 2 + 2?', expectedOutput: '4' },
  ],
});

// Run evaluation
const results = await pipeline.evaluate({
  dataset,
  generateFn: async (input) => await agent.execute(input),
});

console.log(results.summary); // { passRate: 0.95, avgScore: 0.87 }

// LLM-as-Judge for subjective evaluation
const judge = new RubricJudge({
  provider: anthropicProvider,
  rubric: {
    criteria: 'Response Quality',
    levels: [
      { score: 1, description: 'Poor' },
      { score: 5, description: 'Excellent' },
    ],
  },
});`,
    useCases: [
      'Model benchmarking',
      'Quality assurance',
      'RLHF data generation',
    ],
  },
  {
    icon: '🔍',
    title: 'Vector Embeddings',
    description:
      'Multi-provider embeddings with chunking, caching, and vector stores.',
    tags: ['Embeddings', 'RAG', 'Search'],
    category: 'RAG',
    difficulty: 'Intermediate' as const,
    code: `import {
  createEmbeddingManager,
  createOpenAIProvider,
  createRecursiveChunker,
  createMemoryStore,
  createMemoryCache,
} from '@lov3kaizen/agentsea-embeddings';

const manager = createEmbeddingManager({
  defaultModel: 'text-embedding-3-small',
  defaultProvider: 'openai',
});

manager.registerModel(createOpenAIProvider({ apiKey: process.env.OPENAI_API_KEY! }), true);
manager.setChunker(createRecursiveChunker());
manager.setStore(createMemoryStore({ dimensions: 1536 }));
manager.setCache(createMemoryCache({ maxEntries: 10000 }));

// Embed a document
const chunks = await manager.embedDocument(longDocument, {
  documentId: 'doc-1',
  type: 'markdown',
});

// Semantic search
const results = await manager.search('What is the main topic?', {
  topK: 5,
  minScore: 0.7,
});

// Check similarity
const score = await manager.similarity('hello world', 'hi there');`,
    useCases: [
      'Semantic search',
      'RAG applications',
      'Document retrieval',
    ],
  },
  {
    icon: '🖥️',
    title: 'Browser Automation',
    description:
      'Control desktop and browser with Claude vision for computer-use tasks.',
    tags: ['Surf', 'Automation', 'Vision'],
    category: 'Automation',
    difficulty: 'Advanced' as const,
    code: `import { SurfAgent, createNativeBackend, PuppeteerBackend } from '@lov3kaizen/agentsea-surf';

// Use native desktop
const nativeBackend = createNativeBackend();
await nativeBackend.connect();

// Or use Puppeteer for web
const browserBackend = new PuppeteerBackend({
  headless: false,
  viewport: { width: 1920, height: 1080 },
});
await browserBackend.connect();

// Create agent with vision
const agent = new SurfAgent('session-1', browserBackend, {
  maxSteps: 20,
  vision: { model: 'claude-sonnet-4-20250514', maxTokens: 4096 },
  sandbox: {
    enabled: true,
    maxActionsPerMinute: 60,
    blockedDomains: ['malicious-site.com'],
  },
});

// Execute natural language task
const result = await agent.execute('Open google.com and search for weather');

// Or stream events
for await (const event of agent.executeStream('Fill out the form')) {
  if (event.type === 'action') console.log('Action:', event.action.description);
  if (event.type === 'complete') console.log('Done:', event.response);
}`,
    useCases: [
      'Web scraping',
      'Form automation',
      'UI testing',
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
    href: 'https://github.com/lovekaizen/agentsea',
  },
  {
    icon: '💬',
    title: 'Community',
    description: 'Join discussions and get help',
    href: 'https://github.com/lovekaizen/agentsea/discussions',
  },
];
