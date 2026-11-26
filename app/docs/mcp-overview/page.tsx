import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import Callout from '../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'MCP | AgentSea',
  description:
    'Connect an agent to MCP servers and give the agent the tools those servers provide.',
};

const toc = [
  { id: 'add-server', label: 'Add an MCP server' },
  { id: 'transport', label: 'Transport' },
  { id: 'server-env', label: 'Environment variables for servers' },
];

export default function McpOverviewPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="MCP"
      lead="Connect an agent to MCP servers and give the agent the tools those servers provide."
      active="guides"
      toc={toc}
    >
      <DocSection id="add-server" num="01" title="Add an MCP server">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>MCPRegistry</code> holds MCP server connections. <code>addServer(config)</code> starts a server and
          returns an <code>MCPClient</code>. <code>getTools()</code> returns the tools from every registered server.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, MCPRegistry, ToolRegistry } from '@lov3kaizen/agentsea-core';
const mcpRegistry = new MCPRegistry();
await mcpRegistry.addServer({
  name: 'filesystem',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
  transport: 'stdio',
});
const mcpTools = mcpRegistry.getTools();
const toolRegistry = new ToolRegistry();
toolRegistry.registerMany(mcpTools);
const agent = new Agent(
  { name: 'files', description: 'Filesystem assistant', model: 'claude-sonnet-4-6', provider: 'anthropic', tools: mcpTools },
  new AnthropicProvider(),
  toolRegistry,
);`}
        />
      </DocSection>

      <DocSection id="transport" num="02" title="Transport">
        <p className="text-base leading-relaxed text-brand-navy">
          The example passes <code>name</code>, <code>command</code>, <code>args</code> and <code>transport</code> to{' '}
          <code>addServer</code>. Other transports and options are not covered here.
        </p>
      </DocSection>

      <DocSection id="server-env" num="03" title="Environment variables for servers">
        <p className="text-base leading-relaxed text-brand-navy">
          Stdio servers receive only a small set of variables from the parent process, such as <code>HOME</code>,{' '}
          <code>PATH</code>, <code>TMPDIR</code> and proxy settings. Provider API keys are not passed. To give a
          server a variable, name it in <code>passEnv</code>, or set it with <code>env</code>.
        </p>
        <CodeBlock
          lang="TS"
          code={`await mcpRegistry.addServer({
  name: 'github',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-github'],
  transport: 'stdio',
  passEnv: ['GITHUB_TOKEN'],
});`}
        />
        <Callout kind="note">
          <code>passEnv</code> copies a variable from the parent environment. Set the variable in the shell that
          runs the app. Do not print its value in logs.
        </Callout>
      </DocSection>
    </DocsShell>
  );
}
