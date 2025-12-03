import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function MCPOverviewPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="MCP Integration Overview"
        titleGradient="purple"
        description="Model Context Protocol (MCP) is an open standard that enables seamless integration between LLM applications and external tools. AgentSea provides first-class MCP support."
      />

      <div className="prose max-w-none">
        <h2>What is MCP?</h2>
        <p>
          Model Context Protocol (MCP) is an open standard developed by
          Anthropic that provides a universal way for AI applications to connect
          to external data sources and tools. Think of it as USB-C for AI—a
          single protocol that works with any compatible tool or service.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Key Benefits
          </h3>
          <ul className="text-blue-800 m-0 list-disc list-inside">
            <li>Connect to any MCP-compatible tool or service</li>
            <li>Automatic tool discovery and registration</li>
            <li>Standardized tool calling interface</li>
            <li>Support for both local and remote servers</li>
            <li>Access to resources, prompts, and tools</li>
          </ul>
        </div>

        <h2>How MCP Works in AgentSea </h2>
        <p>AgentSea handles all the complexity of MCP integration:</p>

        <ol>
          <li>
            <strong>Connect to MCP Servers</strong>: Specify server command and
            transport type
          </li>
          <li>
            <strong>Automatic Tool Discovery</strong>: AgentSea fetches
            available tools from the server
          </li>
          <li>
            <strong>Schema Conversion</strong>: JSON Schema from MCP is
            converted to Zod schemas
          </li>
          <li>
            <strong>Tool Registration</strong>: MCP tools are automatically
            registered with your agents
          </li>
          <li>
            <strong>Transparent Execution</strong>: Agents can call MCP tools
            just like built-in tools
          </li>
        </ol>

        <h2>Quick Start</h2>
        <p>Here's a minimal example of using MCP with AgentSea :</p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  MCPRegistry,
} from '@lov3kaizen/agentsea-core';

// 1. Create MCP registry
const mcpRegistry = new MCPRegistry();

// 2. Connect to MCP server
await mcpRegistry.addServer({
  name: 'filesystem',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
  transport: 'stdio',
});

// 3. Get MCP tools (automatically converted)
const mcpTools = mcpRegistry.getTools();

// 4. Create agent with MCP tools
const toolRegistry = new ToolRegistry();
toolRegistry.registerMany(mcpTools);

const agent = new Agent(
  {
    name: 'mcp-agent',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    tools: mcpTools,
  },
  new AnthropicProvider(),
  toolRegistry,
);

// 5. Agent can now use MCP tools
const response = await agent.execute(
  'List all files in /tmp',
  context,
);

// Cleanup
await mcpRegistry.disconnectAll();`}
        </CodeBlock>

        <h2>MCP Architecture</h2>
        <p>Understanding the MCP architecture in AgentSea :</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
          {architectureComponents.map((component, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="text-2xl mb-2">{component.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {component.name}
              </h3>
              <p className="text-sm text-gray-600">{component.description}</p>
            </div>
          ))}
        </div>

        <h2>Transport Types</h2>
        <p>AgentSea supports two MCP transport types:</p>

        <h3>STDIO Transport</h3>
        <p>For local MCP servers that communicate via standard input/output:</p>

        <CodeBlock language="typescript">
          {`await mcpRegistry.addServer({
  name: 'local-server',
  command: 'node',
  args: ['./my-mcp-server.js'],
  transport: 'stdio',
  env: {
    API_KEY: process.env.API_KEY,
  },
});`}
        </CodeBlock>

        <h3>SSE Transport</h3>
        <p>For HTTP-based MCP servers using Server-Sent Events:</p>

        <CodeBlock language="typescript">
          {`await mcpRegistry.addServer({
  name: 'remote-server',
  url: 'https://mcp.example.com/sse',
  transport: 'sse',
  headers: {
    'Authorization': \`Bearer \${process.env.API_TOKEN}\`,
  },
});`}
        </CodeBlock>

        <h2>Multiple MCP Servers</h2>
        <p>Connect to multiple MCP servers simultaneously:</p>

        <CodeBlock language="typescript">
          {`const mcpRegistry = new MCPRegistry();

// Connect to filesystem server
await mcpRegistry.addServer({
  name: 'filesystem',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/home/user'],
  transport: 'stdio',
});

// Connect to GitHub server
await mcpRegistry.addServer({
  name: 'github',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-github'],
  transport: 'stdio',
  env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN },
});

// Connect to custom HTTP server
await mcpRegistry.addServer({
  name: 'custom',
  url: 'https://api.example.com/mcp',
  transport: 'sse',
});

// Get tools from all servers
// Tools are prefixed: filesystem:read_file, github:create_issue, etc.
const allTools = mcpRegistry.getTools();

// Or get tools from specific server
const githubTools = mcpRegistry.getServerTools('github');`}
        </CodeBlock>

        <h2>MCP Resources</h2>
        <p>Some MCP servers provide resources (data, templates, etc.):</p>

        <CodeBlock language="typescript">
          {`const client = mcpRegistry.getClient('filesystem');

// List available resources
const resources = await client.listResources();
console.log(resources);
// [{ uri: 'file:///home/user/data.json', name: 'User Data', ... }]

// Read resource content
const content = await client.readResource('file:///home/user/data.json');
console.log(content);`}
        </CodeBlock>

        <h2>MCP Prompts</h2>
        <p>MCP servers can provide pre-configured prompts:</p>

        <CodeBlock language="typescript">
          {`const client = mcpRegistry.getClient('github');

// List available prompts
const prompts = await client.listPrompts();
console.log(prompts);
// [{ name: 'review_pr', description: 'Review a pull request', ... }]

// Get prompt
const prompt = await client.getPrompt('review_pr', {
  repo: 'owner/repo',
  prNumber: '123',
});

// Use prompt with agent
const response = await agent.execute(prompt.messages[0].content, context);`}
        </CodeBlock>

        <h2>Error Handling</h2>
        <p>Handle MCP connection errors gracefully:</p>

        <CodeBlock language="typescript">
          {`try {
  await mcpRegistry.addServer({
    name: 'my-server',
    command: 'npx',
    args: ['-y', '@example/mcp-server'],
    transport: 'stdio',
  });

  const tools = mcpRegistry.getTools();
  console.log(\`Loaded \${tools.length} tools\`);
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('MCP server command not found');
  } else if (error.message.includes('timeout')) {
    console.error('MCP server connection timeout');
  } else {
    console.error('Failed to connect to MCP server:', error);
  }

  // Fall back to built-in tools
  const fallbackTools = [calculatorTool, httpRequestTool];
  toolRegistry.registerMany(fallbackTools);
}`}
        </CodeBlock>

        <h2>Lifecycle Management</h2>
        <p>
          Manage MCP server connections throughout your application lifecycle:
        </p>

        <CodeBlock language="typescript">
          {`// Startup
const mcpRegistry = new MCPRegistry();
await mcpRegistry.addServer(config1);
await mcpRegistry.addServer(config2);

// Check connection status
const client = mcpRegistry.getClient('my-server');
const isConnected = client.isConnected();

// Reload tools from a server
await mcpRegistry.reloadServerTools('my-server');

// Remove specific server
await mcpRegistry.removeServer('my-server');

// Shutdown - disconnect all servers
await mcpRegistry.disconnectAll();`}
        </CodeBlock>

        <h2>Popular MCP Servers</h2>
        <p>Some popular MCP servers you can use:</p>

        <ul>
          <li>
            <strong>@modelcontextprotocol/server-filesystem</strong>: File
            system operations
          </li>
          <li>
            <strong>@modelcontextprotocol/server-github</strong>: GitHub API
            integration
          </li>
          <li>
            <strong>@modelcontextprotocol/server-postgres</strong>: PostgreSQL
            database access
          </li>
          <li>
            <strong>@modelcontextprotocol/server-slack</strong>: Slack messaging
          </li>
          <li>
            <strong>@modelcontextprotocol/server-puppeteer</strong>: Browser
            automation
          </li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Connection Management</strong>: Always disconnect from MCP
            servers during shutdown
          </li>
          <li>
            <strong>Error Handling</strong>: Implement fallback tools in case
            MCP servers are unavailable
          </li>
          <li>
            <strong>Tool Naming</strong>: Use server prefixes to avoid tool name
            conflicts
          </li>
          <li>
            <strong>Security</strong>: Pass sensitive credentials via
            environment variables
          </li>
          <li>
            <strong>Timeouts</strong>: Set appropriate timeouts for MCP server
            operations
          </li>
          <li>
            <strong>Testing</strong>: Test with MCP servers unavailable to
            ensure graceful degradation
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/mcp-servers">Explore MCP Servers</Link>
          </li>
          <li>
            <Link href="/docs/tools">Learn about Built-in Tools</Link>
          </li>
          <li>
            <Link href="/examples">View MCP Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const architectureComponents = [
  {
    icon: '🔌',
    name: 'MCPRegistry',
    description: 'Manages connections to multiple MCP servers',
  },
  {
    icon: '💬',
    name: 'MCPClient',
    description: 'Communicates with individual MCP servers',
  },
  {
    icon: '🚀',
    name: 'MCPTransport',
    description: 'Handles STDIO or SSE communication',
  },
  {
    icon: '🔧',
    name: 'ToolAdapter',
    description: 'Converts MCP tools to AgentSea  format',
  },
];
