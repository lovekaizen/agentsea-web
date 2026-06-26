import Link from 'next/link';
import PageContainer from '../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  FeatureCard,
  Divider,
} from '../components/Section';

export default function DocsPage() {
  return (
    <PageContainer maxWidth="6xl">
      {/* Header */}
      <PageHeader
        title="Documentation"
        titleGradient="animated"
        description="Welcome to the AgentSea documentation. Learn how to build powerful agentic AI applications."
      />

      <AlertBox type="info" gradient>
        <span>
          AgentSea is a production-ready ADK for building agentic AI
          applications with built-in voice, commerce capabilities, local models,
          REST API, and complete privacy.
        </span>
      </AlertBox>

      {/* Documentation Sections */}
      <Section title="Documentation Sections" titleGradient="purple" badge="01">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all border border-base-300 card-gradient-hover group hover:scale-[1.02]"
            >
              <div className="card-body relative z-10">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h3 className="card-title text-lg group-hover:text-gradient transition-all">
                  {section.title}
                </h3>
                <p className="text-sm text-base-content/70">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Quick Example */}
      <Section title="Quick Example" titleGradient="blue" badge="02">
        <p className="text-base-content/70">
          Create your first agent in just a few lines of code:
        </p>
        <CodeBlock language="typescript">
          {`import { Agent, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  {
    name: 'my-agent',
    model: 'claude-sonnet-4-20250514',
    systemPrompt: 'You are a helpful assistant.',
  },
  new AnthropicProvider(),
  new ToolRegistry()
);

const response = await agent.execute('Hello!', context);`}
        </CodeBlock>
      </Section>

      {/* Elixir SDK callout */}
      <div className="bg-base-200 rounded-xl p-6 mt-6 border border-primary/30 relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="badge badge-gradient mb-3">Also on the BEAM</span>
            <h3 className="font-bold text-xl mb-2 text-gradient">
              AgentSea for Elixir
            </h3>
            <p className="text-sm text-base-content/70 mb-4">
              A native Elixir/OTP edition where agents are supervised processes,
              crews are supervisors, and you stream tokens live over Phoenix
              LiveView. All 14 libraries are published on Hex.
            </p>
            <Link href="/docs/elixir" className="btn btn-gradient btn-sm">
              <span>Explore the Elixir SDK →</span>
            </Link>
          </div>
          <CodeBlock language="elixir">
            {`config = %AgentSea.Agent.Config{
  name: :assistant,
  model: "claude-opus-4-8",
  provider: {AgentSea.Providers.Anthropic, []}
}

{:ok, agent} = AgentSea.Agent.start_link(config)
{:ok, res} = AgentSea.Agent.run(agent, "Hello!")`}
          </CodeBlock>
        </div>
      </div>

      <Divider />

      {/* Key Features */}
      <Section title="Key Features" titleGradient="warm" badge="03">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="card bg-base-200 border border-base-300 card-gradient-hover group"
            >
              <div className="card-body p-4 relative z-10">
                <div className="flex items-start gap-3">
                  <span className="badge badge-gradient mt-1">+</span>
                  <p className="text-sm">{feature}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <div className="bg-gradient-mesh rounded-xl p-8 mt-8 relative overflow-hidden">
        <div className="orb orb-2 opacity-20"></div>
        <div className="relative z-10">
          <h3 className="font-bold text-2xl mb-4 text-white">
            Ready to get started?
          </h3>
          <p className="text-white/80 mb-6">
            Check out our Quick Start Guide to begin building powerful AI
            agents.
          </p>
          <Link href="/docs/quick-start" className="btn btn-gradient">
            <span>Get Started →</span>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

const sections = [
  {
    icon: '🚀',
    title: 'Quick Start',
    description: 'Get up and running with AgentSea in minutes',
    href: '/docs/quick-start',
  },
  {
    icon: '💻',
    title: 'Agentic Coding',
    description: 'Interactive AI coding sessions with 13 built-in tools',
    href: '/docs/agentic-coding',
  },
  {
    icon: '🤖',
    title: 'Agents',
    description: 'Learn how to create and configure intelligent agents',
    href: '/docs/agents',
  },
  {
    icon: '👥',
    title: 'Multi-Agent Crews',
    description: 'Role-based coordination with delegation strategies',
    href: '/docs/crews',
  },
  {
    icon: '🎯',
    title: 'Per-Model Type Safety',
    description: 'Compile-time validation for model-specific options',
    href: '/docs/per-model-type-safety',
  },
  {
    icon: '🦙',
    title: 'Local & Open Source',
    description: 'Run agents locally for privacy and zero API costs',
    href: '/docs/local-providers',
  },
  {
    icon: '🔧',
    title: 'Tools',
    description: 'Extend agent capabilities with built-in and custom tools',
    href: '/docs/tools',
  },
  {
    icon: '🌐',
    title: 'LLM Gateway',
    description: 'OpenAI-compatible API with intelligent routing',
    href: '/docs/gateway',
  },
  {
    icon: '🛡️',
    title: 'Guardrails',
    description: 'Content safety, validation, and prompt injection protection',
    href: '/docs/guardrails',
  },
  {
    icon: '📊',
    title: 'LLM Evaluation',
    description: 'Metrics, LLM-as-Judge, and human feedback',
    href: '/docs/evaluate',
  },
  {
    icon: '🔴',
    title: 'Red Teaming',
    description: 'Adversarial testing, vulnerability scanning, and compliance',
    href: '/docs/redteam',
  },
  {
    icon: '🔍',
    title: 'Embeddings',
    description: 'Multi-provider embeddings with caching and vector stores',
    href: '/docs/embeddings',
  },
  {
    icon: '💾',
    title: 'Semantic Cache',
    description: 'Exact-match, semantic, and hybrid LLM response caching',
    href: '/docs/cache',
  },
  {
    icon: '📥',
    title: 'Document Ingestion',
    description: 'PDF, DOCX, HTML & Markdown parsing with smart chunking',
    href: '/docs/ingest',
  },
  {
    icon: '📝',
    title: 'Prompt Management',
    description: 'Version control, A/B testing, and environment promotion',
    href: '/docs/prompts',
  },
  {
    icon: '💰',
    title: 'Cost Tracking',
    description: '60+ model pricing registry with budget enforcement',
    href: '/docs/costs',
  },
  {
    icon: '📈',
    title: 'Conversation Analytics',
    description: 'Intent classification, sentiment, and flow analysis',
    href: '/docs/analytics',
  },
  {
    icon: '🐛',
    title: 'Agent Debugger',
    description: 'Step-through execution, checkpoint replay, and what-if tests',
    href: '/docs/debugger',
  },
  {
    icon: '🖥️',
    title: 'Browser Automation',
    description: 'Computer-use agent with Claude vision',
    href: '/docs/surf',
  },
  {
    icon: '🔌',
    title: 'MCP Integration',
    description: 'Connect to MCP servers for external tools',
    href: '/docs/mcp-overview',
  },
];

const features = [
  'Agentic coding (sea code) with 13 built-in coding tools',
  'Multi-agent crews with 5 delegation strategies',
  'LLM Gateway with intelligent routing and caching',
  'Multi-provider support: 60+ models incl. GPT-5, o3, o4-mini',
  'Guardrails for safety, validation, and security',
  'Red teaming with adversarial testing and compliance checks',
  'LLM evaluation with metrics and LLM-as-Judge',
  'Multi-provider embeddings with vector stores',
  'Semantic caching (exact, similarity, hybrid) with replay',
  'Document ingestion (PDF, DOCX, HTML, Markdown) with chunking',
  'Prompt management with version control and A/B testing',
  'Cost tracking with 60+ model pricing and budget enforcement',
  'Conversation analytics with intent and sentiment tracking',
  'Agent debugger with checkpoint replay and what-if testing',
  'Computer-use & browser automation with Claude vision',
  'Per-model type safety with compile-time validation',
  'Local & open source models (Ollama, LM Studio, vLLM, etc.)',
  'First-class MCP (Model Context Protocol) integration',
  'Built-in voice support (TTS/STT) with multiple providers',
  'Commerce capabilities with ACP protocol (14 tools)',
  'REST API, SSE, and WebSocket support',
  'Advanced memory (Episodic, Semantic, Working)',
  'Enterprise multi-tenancy with API key auth',
  'Comprehensive observability (logging, metrics, tracing)',
  'NestJS integration with decorators and modules',
  'Full TypeScript support with strict types',
];
