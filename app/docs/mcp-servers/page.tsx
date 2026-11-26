import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';

export const metadata: Metadata = {
  title: 'MCP servers | AgentSea',
  description:
    'Explore popular MCP servers and learn how to integrate them with your AgentSea agents.',
};

const toc = [
  { id: 'official-servers', label: 'Official MCP servers' },
  { id: 'custom-servers', label: 'Creating custom MCP servers' },
  { id: 'using-custom-servers', label: 'Using custom MCP servers' },
  { id: 'best-practices', label: 'Best practices' },
  { id: 'testing', label: 'Testing MCP servers' },
  { id: 'debugging', label: 'Debugging MCP connections' },
  { id: 'registry', label: 'MCP server registry' },
  { id: 'next-steps', label: 'Next steps' },
];

const linkClass = 'text-brand-ocean underline-offset-2 hover:underline';

export default function MCPServersPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="MCP servers"
      lead="Explore popular MCP servers and learn how to integrate them with your AgentSea agents."
      active="guides"
      toc={toc}
    >
      <DocSection id="official-servers" num="01" title="Official MCP servers">
        <p className="text-base leading-relaxed text-brand-navy">
          Anthropic provides several official MCP servers that are production-ready and well-maintained.
        </p>

        {mcpServers.map((server) => (
          <div key={server.name} className="flex flex-col gap-3 rounded-xl border border-rule bg-surface-paper p-6">
            <h3 className="text-lg font-semibold text-brand-deep">
              {server.icon} {server.name}
            </h3>
            <p className="text-base leading-relaxed text-brand-navy">{server.description}</p>
            <CodeBlock lang="TS" code={server.code} />
            <p className="text-[15px] leading-[1.5] text-brand-navy">
              <span className="font-semibold text-brand-deep">Example usage:</span> {server.usage}
            </p>
            {server.envVars && (
              <div className="flex flex-col gap-2">
                <p className="text-[15px] font-semibold text-brand-deep">Required environment variables</p>
                <BulletPanel items={server.envVars.map((envVar) => <code key={envVar}>{envVar}</code>)} />
              </div>
            )}
          </div>
        ))}
      </DocSection>

      <DocSection id="custom-servers" num="02" title="Creating custom MCP servers">
        <p className="text-base leading-relaxed text-brand-navy">
          You can create your own MCP servers to expose custom functionality:
        </p>
        <CodeBlock
          lang="TS"
          code={`// my-mcp-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Create MCP server
const server = new Server(
  {
    name: 'my-custom-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'weather_lookup',
        description: 'Get current weather for a location',
        inputSchema: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City name or zip code',
            },
          },
          required: ['location'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'weather_lookup') {
    const { location } = request.params.arguments;

    // Your implementation
    const weatherData = await fetchWeather(location);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(weatherData),
        },
      ],
    };
  }

  throw new Error(\`Unknown tool: \${request.params.name}\`);
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);`}
        />
      </DocSection>

      <DocSection id="using-custom-servers" num="03" title="Using custom MCP servers">
        <p className="text-base leading-relaxed text-brand-navy">
          Once created, use your custom server with AgentSea:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { MCPRegistry } from '@lov3kaizen/agentsea-core';

const mcpRegistry = new MCPRegistry();

// Connect to your custom server
await mcpRegistry.addServer({
  name: 'weather',
  command: 'node',
  args: ['./my-mcp-server.js'],
  transport: 'stdio',
});

// Use the tools
const tools = mcpRegistry.getTools();
// Now includes: weather:weather_lookup`}
        />
      </DocSection>

      <DocSection id="best-practices" num="04" title="Best practices">
        <h3 className="text-lg font-semibold text-brand-deep">Performance</h3>
        <BulletPanel
          items={[
            'Cache frequently accessed data',
            'Implement rate limiting for external API calls',
            'Use streaming for large responses',
            'Set appropriate timeouts',
          ]}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Security</h3>
        <BulletPanel
          items={[
            'Validate all inputs before processing',
            'Use environment variables for credentials',
            'Implement proper error handling',
            'Sanitize file paths and URLs',
            'Limit file system access to specific directories',
          ]}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Reliability</h3>
        <BulletPanel
          items={[
            'Implement graceful error handling',
            'Provide detailed error messages',
            'Add retry logic for transient failures',
            'Log all operations for debugging',
          ]}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Documentation</h3>
        <BulletPanel
          items={[
            'Write clear tool descriptions',
            'Document all parameters and return types',
            'Provide usage examples',
            'Include setup instructions',
          ]}
        />
      </DocSection>

      <DocSection id="testing" num="05" title="Testing MCP servers">
        <p className="text-base leading-relaxed text-brand-navy">Test your MCP servers before integration:</p>
        <CodeBlock
          lang="TS"
          code={`// test-mcp-server.ts
import { MCPClient } from '@lov3kaizen/agentsea-core';

async function testMCPServer() {
  const client = new MCPClient({
    name: 'weather',
    command: 'node',
    args: ['./my-mcp-server.js'],
    transport: 'stdio',
  });

  try {
    // Connect
    await client.connect();
    console.log('✓ Connected to server');

    // List tools
    const tools = await client.listTools();
    console.log('✓ Tools:', tools.map((t) => t.name));

    // Call tool
    const result = await client.callTool('weather_lookup', {
      location: 'San Francisco',
    });
    console.log('✓ Tool result:', result);

    // Disconnect
    client.disconnect();
    console.log('✓ Disconnected');
  } catch (error) {
    console.error('✗ Test failed:', error);
  }
}

testMCPServer();`}
        />
      </DocSection>

      <DocSection id="debugging" num="06" title="Debugging MCP connections">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>MCPRegistry</code> logs server stderr, errors, warnings and disconnects to the console. For more detail,
          listen to the events on the <code>MCPClient</code> that <code>addServer</code> returns.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { MCPRegistry } from '@lov3kaizen/agentsea-core';

const mcpRegistry = new MCPRegistry();

const client = await mcpRegistry.addServer({
  name: 'my-server',
  command: 'node',
  args: ['./server.js'],
  transport: 'stdio',
});

client.on('initialized', (serverInfo) => {
  console.log("MCP server 'my-server' initialized", serverInfo);
});

client.on('warning', (message) => {
  console.warn(message);
});

client.on('disconnect', () => {
  console.warn("MCP server 'my-server' disconnected");
});`}
        />
      </DocSection>

      <DocSection id="registry" num="07" title="MCP server registry">
        <p className="text-base leading-relaxed text-brand-navy">
          Discover more MCP servers in the community registry:
        </p>
        <BulletPanel
          items={[
            <>
              <a href="https://github.com/modelcontextprotocol/servers" className={linkClass}>
                Official MCP Servers
              </a>
            </>,
            <>
              <a href="https://github.com/topics/mcp-server" className={linkClass}>
                Community MCP Servers
              </a>
            </>,
            <>
              <a href="https://mcp.so" className={linkClass}>
                MCP Server Directory
              </a>
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="next-steps" num="08" title="Next steps">
        <BulletPanel
          items={[
            <>
              <Link href="/docs/mcp-overview" className={linkClass}>
                Learn MCP basics
              </Link>
            </>,
            <>
              <Link href="/docs/tools" className={linkClass}>
                Explore built-in tools
              </Link>
            </>,
            <>
              <Link href="/examples" className={linkClass}>
                View MCP examples
              </Link>
            </>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}

const mcpServers = [
  {
    icon: '📁',
    name: 'Filesystem Server',
    description: 'Provides file system operations including reading, writing, and listing files.',
    code: `await mcpRegistry.addServer({
  name: 'filesystem',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/home/user'],
  transport: 'stdio',
});`,
    usage: 'Ask the agent to "read the contents of config.json" or "list all files in the directory"',
  },
  {
    icon: '🐙',
    name: 'GitHub Server',
    description: 'Interact with GitHub repositories, issues, pull requests, and more.',
    code: `await mcpRegistry.addServer({
  name: 'github',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-github'],
  transport: 'stdio',
  env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN },
});`,
    usage: 'Ask the agent to "create an issue in my repo" or "list recent pull requests"',
    envVars: ['GITHUB_TOKEN'],
  },
  {
    icon: '🐘',
    name: 'PostgreSQL Server',
    description: 'Execute SQL queries and manage PostgreSQL databases.',
    code: `await mcpRegistry.addServer({
  name: 'postgres',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-postgres'],
  transport: 'stdio',
  env: { DATABASE_URL: process.env.DATABASE_URL },
});`,
    usage: 'Ask the agent to "query the users table" or "get the count of active orders"',
    envVars: ['DATABASE_URL'],
  },
  {
    icon: '💬',
    name: 'Slack Server',
    description: 'Send messages, read channels, and manage Slack workspaces.',
    code: `await mcpRegistry.addServer({
  name: 'slack',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-slack'],
  transport: 'stdio',
  env: { SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN },
});`,
    usage: 'Ask the agent to "send a message to #general" or "list recent messages"',
    envVars: ['SLACK_BOT_TOKEN'],
  },
  {
    icon: '🌐',
    name: 'Puppeteer Server',
    description: 'Browser automation for web scraping, testing, and screenshots.',
    code: `await mcpRegistry.addServer({
  name: 'puppeteer',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-puppeteer'],
  transport: 'stdio',
});`,
    usage: 'Ask the agent to "take a screenshot of example.com" or "scrape product prices from this page"',
  },
  {
    icon: '🔍',
    name: 'Google Drive Server',
    description: 'Access and manage files in Google Drive.',
    code: `await mcpRegistry.addServer({
  name: 'gdrive',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-gdrive'],
  transport: 'stdio',
  env: { GOOGLE_CREDENTIALS: process.env.GOOGLE_CREDENTIALS },
});`,
    usage: 'Ask the agent to "list my recent Google Drive files" or "download the Q4 report"',
    envVars: ['GOOGLE_CREDENTIALS'],
  },
];
