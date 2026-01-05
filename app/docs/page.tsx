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
    icon: '🔍',
    title: 'Embeddings',
    description: 'Multi-provider embeddings with caching and vector stores',
    href: '/docs/embeddings',
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
  'Multi-agent crews with 5 delegation strategies',
  'LLM Gateway with intelligent routing and caching',
  'Guardrails for safety, validation, and security',
  'LLM evaluation with metrics and LLM-as-Judge',
  'Multi-provider embeddings with vector stores',
  'Browser automation with Claude vision',
  'Per-model type safety with compile-time validation',
  'Local & open source models (Ollama, llama.cpp, etc.)',
  'First-class MCP (Model Context Protocol) integration',
  'Built-in voice support (TTS/STT) with 5 providers',
  'Commerce capabilities with ACP protocol (14 tools)',
  'REST API, SSE, and WebSocket support',
  'Advanced memory (Episodic, Semantic, Working)',
  'Enterprise multi-tenancy with API key auth',
  'Comprehensive observability (logging, metrics, tracing)',
  'NestJS integration with decorators and modules',
  'Full TypeScript support with strict types',
];
