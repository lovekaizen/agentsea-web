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
    icon: '✨',
    title: 'Content Formatting',
    description:
      'Format responses as text, markdown, HTML, or JSX with syntax highlighting',
    href: '/docs/formatting',
  },
  {
    icon: '🔄',
    title: 'Workflows',
    description: 'Orchestrate multi-agent systems',
    href: '/docs/workflows',
  },
  {
    icon: '🔌',
    title: 'MCP Integration',
    description: 'Connect to MCP servers for external tools',
    href: '/docs/mcp-overview',
  },
  {
    icon: '📊',
    title: 'Observability',
    description: 'Monitor and trace your agentic applications',
    href: '/docs/observability',
  },
  {
    icon: '🏢',
    title: 'Multi-Tenancy',
    description: 'Enterprise-grade tenant isolation and management',
    href: '/docs/multi-tenancy',
  },
];

const features = [
  'Multi-agent orchestration with workflows',
  'Multi-provider support (12+ providers)',
  'Local & open source models (Ollama, llama.cpp, etc.)',
  'First-class MCP (Model Context Protocol) integration',
  'Built-in voice support (TTS/STT) with 5 providers',
  'Commerce capabilities with ACP protocol (14 tools)',
  'REST API, SSE, and WebSocket support',
  'Content formatting with syntax highlighting',
  'Advanced memory stores (Buffer, Redis, Summary)',
  'Built-in tools and easy custom tool creation',
  'Enterprise multi-tenancy with API key auth',
  'Comprehensive observability (logging, metrics, tracing)',
  'Rate limiting and caching',
  'NestJS integration with React components',
  'Full TypeScript support',
  'CLI tool for rapid prototyping',
];
