import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'Quick start | AgentSea',
  description:
    'Build a first AgentSea agent in a few lines: a Claude agent, a local Ollama agent, a tool, an MCP server and a sequential workflow.',
};

const toc = [
  { id: 'install', label: 'Install' },
  { id: 'claude-agent', label: 'Agent with Claude' },
  { id: 'local-agent', label: 'Local agent with Ollama' },
  { id: 'tool', label: 'Add a tool' },
  { id: 'mcp', label: 'Connect an MCP server' },
  { id: 'workflow', label: 'Sequential workflow' },
  { id: 'next-steps', label: 'Next steps' },
];

const link = 'font-semibold text-brand-deep hover:underline';

export default function QuickStartPage() {
  return (
    <DocsShell
      eyebrow="Getting started"
      title="Quick start"
      lead="Get up and running with AgentSea in minutes. Build your first AI agent with just a few lines of code."
      active="getting-started"
      toc={toc}
    >
      <DocSection id="install" num="01" title="Install">
        <p className="text-base leading-relaxed text-brand-navy">Install the core package with your package manager.</p>
        <CodeBlock
          lang="BASH"
          code={`pnpm add @lov3kaizen/agentsea-core

# Optional: the CLI, installed globally
pnpm add -g @lov3kaizen/agentsea-cli

# Optional: the NestJS integration
pnpm add @lov3kaizen/agentsea-nestjs`}
        />
      </DocSection>

      <DocSection id="claude-agent" num="02" title="Agent with Claude">
        <p className="text-base leading-relaxed text-brand-navy">
          Set <code className="font-mono text-sm">ANTHROPIC_API_KEY</code> first. AnthropicProvider reads it when no
          key is passed.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  {
    name: 'assistant',
    description: 'General assistant',
    model: 'claude-opus-4-8',
    provider: 'anthropic',
    systemPrompt: 'You are a helpful assistant.',
  },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  new ToolRegistry(),
);

const response = await agent.execute('Hello!', {
  conversationId: 'user-123',
  sessionData: {},
  history: [],
});

console.log(response.content);`}
        />
      </DocSection>

      <DocSection id="local-agent" num="03" title="Local agent with Ollama">
        <p className="text-base leading-relaxed text-brand-navy">
          Run the model on your own machine. No API key is needed. Start the Ollama server, then pull the model.
        </p>
        <CodeBlock lang="BASH" code={`ollama serve\nollama pull llama2`} />
        <CodeBlock
          lang="TS"
          code={`import { Agent, OllamaProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const provider = new OllamaProvider({ baseUrl: 'http://localhost:11434' });

// Optional: pull the model from code. Ollama must be running.
await provider.pullModel('llama2');

const agent = new Agent(
  {
    name: 'local-assistant',
    description: 'Local assistant',
    model: 'llama2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful assistant.',
  },
  provider,
  new ToolRegistry(),
);

const response = await agent.execute('What is 2+2?', {
  conversationId: 'conv-1',
  sessionData: {},
  history: [],
});

console.log(response.content);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          The{' '}
          <Link href="/docs/local-models" className={link}>
            local models guide
          </Link>{' '}
          covers other local servers.
        </p>
      </DocSection>

      <DocSection id="tool" num="04" title="Add a tool">
        <p className="text-base leading-relaxed text-brand-navy">
          Register a tool in a ToolRegistry, then list it in the agent config so the model knows it exists.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, ToolRegistry, calculatorTool } from '@lov3kaizen/agentsea-core';

const tools = new ToolRegistry();
tools.register(calculatorTool);

const agent = new Agent(
  {
    name: 'math',
    description: 'Arithmetic helper',
    model: 'claude-opus-4-8',
    provider: 'anthropic',
    tools: [calculatorTool],
  },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  tools,
);

const response = await agent.execute('What is 42 * 58?', {
  conversationId: 'math-1',
  sessionData: {},
  history: [],
});`}
        />
      </DocSection>

      <DocSection id="mcp" num="05" title="Connect an MCP server">
        <p className="text-base leading-relaxed text-brand-navy">
          An MCPRegistry starts an MCP server and exposes its tools. Register them in the ToolRegistry like any other
          tool.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, ToolRegistry, MCPRegistry } from '@lov3kaizen/agentsea-core';

const mcpRegistry = new MCPRegistry();
await mcpRegistry.addServer({
  name: 'filesystem',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
});

const toolRegistry = new ToolRegistry();
toolRegistry.registerMany(mcpRegistry.getTools());

const agent = new Agent(
  { name: 'files', description: 'Filesystem assistant', model: 'claude-opus-4-8', provider: 'anthropic' },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  toolRegistry,
);

const response = await agent.execute('List the files in /tmp', {
  conversationId: 'files-1',
  sessionData: {},
  history: [],
});`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          The{' '}
          <Link href="/docs/mcp-overview" className={link}>
            MCP guide
          </Link>{' '}
          covers transports and server setup.
        </p>
      </DocSection>

      <DocSection id="workflow" num="06" title="Sequential workflow">
        <p className="text-base leading-relaxed text-brand-navy">
          A sequential workflow runs agents one after another. Each agent takes a full AgentConfig, so it needs a name,
          description, model and provider.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { WorkflowFactory, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const workflow = WorkflowFactory.create(
  {
    name: 'research-workflow',
    type: 'sequential',
    agents: [
      { name: 'researcher', description: 'Gathers facts', model: 'claude-opus-4-8', provider: 'anthropic', systemPrompt: 'Research information.' },
      { name: 'writer', description: 'Writes the summary', model: 'claude-opus-4-8', provider: 'anthropic', systemPrompt: 'Write a summary.' },
    ],
  },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  new ToolRegistry(),
);

const result = await workflow.execute('Research AI agents', {
  conversationId: 'research-1',
  sessionData: {},
  history: [],
});`}
        />
      </DocSection>

      <DocSection id="next-steps" num="07" title="Next steps">
        <BulletPanel
          items={[
            <>
              <Link href="/docs/agents" className={link}>
                Agents
              </Link>
              : configuration options for agents.
            </>,
            <>
              <Link href="/docs/tools" className={link}>
                Tools
              </Link>
              : built-in and custom tools.
            </>,
            <>
              <Link href="/docs/workflows" className={link}>
                Workflows
              </Link>
              : orchestrating several agents.
            </>,
            <>
              <Link href="/examples" className={link}>
                Examples
              </Link>
              : complete, runnable examples for every feature.
            </>,
          ]}
        />
        <Callout kind="note">
          For an interactive coding session in your project, run <code className="font-mono text-sm">sea code</code>.
        </Callout>
      </DocSection>
    </DocsShell>
  );
}
