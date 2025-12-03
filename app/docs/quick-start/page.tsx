import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  SubSection,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function QuickStartPage() {
  return (
    <PageContainer maxWidth="5xl">
      {/* Header */}
      <PageHeader
        title="Quick Start Guide"
        titleGradient="blue"
        description="Get up and running with AgentSea in minutes. Build your first AI agent with just a few lines of code."
      />

      {/* Installation */}
      <Section title="Installation" id="installation">
        <p className="text-base-content/70">
          Install AgentSea using your preferred package manager:
        </p>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-core
npm install @lov3kaizen/agentsea-core
yarn add @lov3kaizen/agentsea-core`}
        </CodeBlock>
      </Section>

      <Divider />

      {/* Basic Agent */}
      <Section title="Basic Agent" id="basic-agent">
        <p className="text-base-content/70">
          Create your first agent in just a few lines of code:
        </p>
        <CodeBlock language="typescript">
          {`import { Agent, AnthropicProvider, ToolRegistry, BufferMemory, calculatorTool } from '@lov3kaizen/agentsea-core';
const provider = new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
const toolRegistry = new ToolRegistry();
toolRegistry.register(calculatorTool);
const agent = new Agent({
  name: 'my-assistant',
  model: 'claude-sonnet-4-20250514',
  provider: 'anthropic',
  systemPrompt: 'You are a helpful assistant.',
  tools: [calculatorTool],
}, provider, toolRegistry, new BufferMemory(50));
const response = await agent.execute('What is 42 * 58?', context);`}
        </CodeBlock>
      </Section>

      <Divider />

      {/* Local Models */}
      <Section
        title="Using Local Models (Privacy & Cost-Free)"
        id="local-models"
      >
        <p className="text-base-content/70">
          Run agents completely locally with Ollama - perfect for
          privacy-sensitive applications, offline development, or eliminating
          API costs:
        </p>
        <CodeBlock language="typescript">
          {`import { Agent, OllamaProvider, ToolRegistry, BufferMemory } from '@lov3kaizen/agentsea-core';
// No API key needed - runs 100% locally!
const provider = new OllamaProvider({
  baseUrl: 'http://localhost:11434',
  model: 'llama3.2' // or mistral, gemma2, qwen2.5, etc.
});
const agent = new Agent({
  name: 'local-assistant',
  model: 'llama3.2',
  provider: 'ollama',
  systemPrompt: 'You are a helpful assistant running locally.',
}, provider, new ToolRegistry(), new BufferMemory(50));
const response = await agent.execute('Hello!', context);`}
        </CodeBlock>

        <AlertBox type="success">
          <div>
            <h3 className="font-bold text-lg mb-2">
              🦙 Get Started with Ollama
            </h3>
            <p className="mb-3">Install Ollama in seconds:</p>
            <CodeBlock language="bash">
              {`curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2`}
            </CodeBlock>
            <Link
              href="/docs/local-providers"
              className="link link-primary font-semibold"
            >
              → Complete guide to local & open source providers
            </Link>
          </div>
        </AlertBox>
      </Section>

      <Divider />

      {/* MCP Integration */}
      <Section title="MCP Integration" id="mcp-integration">
        <p className="text-base-content/70">
          Connect to MCP servers to extend your agent with external tools:
        </p>
        <CodeBlock language="typescript">
          {`import { Agent, AnthropicProvider, ToolRegistry, MCPRegistry } from '@lov3kaizen/agentsea-core';
const mcpRegistry = new MCPRegistry();
await mcpRegistry.addServer({
  name: 'filesystem',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
});
const mcpTools = mcpRegistry.getTools();
const toolRegistry = new ToolRegistry();
toolRegistry.registerMany(mcpTools);
const agent = new Agent(config, new AnthropicProvider(), toolRegistry);
const response = await agent.execute('List the files in /tmp', context);`}
        </CodeBlock>
      </Section>

      <Divider />

      {/* Workflows */}
      <Section title="Multi-Agent Workflows" id="workflows">
        <p className="text-base-content/70">
          Orchestrate multiple agents for complex tasks:
        </p>
        <CodeBlock language="typescript">
          {`import { WorkflowFactory, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';
const workflow = WorkflowFactory.create({
  name: 'research-workflow',
  type: 'sequential',
  agents: [
    { name: 'researcher', systemPrompt: 'Research information.' },
    { name: 'writer', systemPrompt: 'Write a summary.' },
  ],
}, new AnthropicProvider(), new ToolRegistry());
const result = await workflow.execute('Research AI agents', context);`}
        </CodeBlock>
      </Section>

      <Divider className="my-16" />

      {/* Next Steps */}
      <Section title="Next Steps" id="next-steps" variant="gradient">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/docs/agents" className="btn btn-outline">
            Learn more about Agents
          </Link>
          <Link href="/docs/local-providers" className="btn btn-outline">
            Run Local & Open Source Models
          </Link>
          <Link href="/docs/tools" className="btn btn-outline">
            Explore Tools
          </Link>
          <Link href="/docs/workflows" className="btn btn-outline">
            Master Workflows
          </Link>
          <Link href="/docs/mcp-overview" className="btn btn-outline">
            Integrate MCP Servers
          </Link>
          <Link href="/examples" className="btn btn-outline">
            View Examples
          </Link>
        </div>
      </Section>

      <AlertBox type="info">
        <div>
          <h3 className="font-bold text-lg mb-2">💡 Tip</h3>
          <p>
            Check out the{' '}
            <Link href="/examples" className="link link-primary font-semibold">
              examples page
            </Link>{' '}
            for complete, runnable examples covering all features.
          </p>
        </div>
      </AlertBox>
    </PageContainer>
  );
}
