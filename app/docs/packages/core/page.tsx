import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-core | AgentSea',
  description: 'Framework-agnostic core library for building agentic AI applications in Node.js.',
};

const pkg: PackageDoc = {
  slug: 'core',
  name: '@lov3kaizen/agentsea-core',
  summary: 'Framework-agnostic core library for building agentic AI applications in Node.js.',
  version: '1.2.1',
  onNpm: true,
  install: 'npm install @lov3kaizen/agentsea-core',
  example: {
    lang: 'TS',
    code: `import { Agent, AnthropicProvider, ToolRegistry, BufferMemory, calculatorTool } from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  { name: 'assistant', description: 'General assistant', model: 'claude-sonnet-4-6', provider: 'anthropic',
    systemPrompt: 'You are a helpful assistant.', tools: [calculatorTool] },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  new ToolRegistry(),
  new BufferMemory(50),
);
const response = await agent.execute('What is 42 * 58?', { conversationId: 'user-123', sessionData: {}, history: [] });
console.log(response.content);`,
  },
  api: [
    { name: 'Agent.execute(input, context)', description: 'Runs the agent on one input and returns the response.' },
    { name: 'Agent.executeStream(input, context)', description: 'Streams the response in chunks.' },
    { name: 'ToolRegistry.register(tool)', description: 'Adds a tool that the agent can call.' },
    {
      name: 'MCPRegistry.addServer({ name, command, args, transport })',
      description: 'Connects an MCP server and exposes its tools with getTools().',
    },
    {
      name: 'SequentialWorkflow / ParallelWorkflow / SupervisorWorkflow',
      description: 'Run several agents in a fixed order, in parallel, or under a supervisor.',
    },
  ],
  caveats: [
    'MCP stdio servers do not receive provider API keys by default. Pass them with passEnv or env.',
    'Only the 13 coding tools and calculatorTool are documented. Eight general tools are mentioned but not named.',
    "Model names in the examples may change. Check the provider's current model list before use.",
    'Requires Node.js 20 or later.',
  ],
};

export default function Page() {
  return <PackagePage pkg={pkg} />;
}
