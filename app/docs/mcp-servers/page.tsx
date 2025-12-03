import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function MCPServersPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="MCP Servers"
        titleGradient="blue"
        description="Explore popular MCP servers and learn how to integrate them with your AgentSea agents."
      />

      <div className="prose max-w-none">
        <h2>Official MCP Servers</h2>
        <p>
          Anthropic provides several official MCP servers that are
          production-ready and well-maintained.
        </p>

        {mcpServers.map((server, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 pt-0 mb-6 not-prose"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {server.icon} {server.name}
                </h3>
                <p className="text-gray-600 mb-4">{server.description}</p>

                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                  <pre className="text-sm text-gray-100">
                    <code>{server.code}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">
                    Example Usage:
                  </h4>
                  <p className="text-sm text-gray-600">{server.usage}</p>
                </div>

                {server.envVars && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Required Environment Variables:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {server.envVars.map((envVar, i) => (
                        <li key={i}>
                          <code className="text-xs">{envVar}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <h2>Creating Custom MCP Servers</h2>
        <p>
          You can create your own MCP servers to expose custom functionality:
        </p>

        <CodeBlock language="typescript">
          {`// my-mcp-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

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
        </CodeBlock>

        <h2>Using Custom MCP Servers</h2>
        <p>Once created, use your custom server with AgentSea :</p>

        <CodeBlock language="typescript">
          {`import { MCPRegistry } from '@lov3kaizen/agentsea-core';

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
        </CodeBlock>

        <h2>MCP Server Best Practices</h2>

        <h3>Performance</h3>
        <ul>
          <li>Cache frequently accessed data</li>
          <li>Implement rate limiting for external API calls</li>
          <li>Use streaming for large responses</li>
          <li>Set appropriate timeouts</li>
        </ul>

        <h3>Security</h3>
        <ul>
          <li>Validate all inputs before processing</li>
          <li>Use environment variables for credentials</li>
          <li>Implement proper error handling</li>
          <li>Sanitize file paths and URLs</li>
          <li>Limit file system access to specific directories</li>
        </ul>

        <h3>Reliability</h3>
        <ul>
          <li>Implement graceful error handling</li>
          <li>Provide detailed error messages</li>
          <li>Add retry logic for transient failures</li>
          <li>Log all operations for debugging</li>
        </ul>

        <h3>Documentation</h3>
        <ul>
          <li>Write clear tool descriptions</li>
          <li>Document all parameters and return types</li>
          <li>Provide usage examples</li>
          <li>Include setup instructions</li>
        </ul>

        <h2>Testing MCP Servers</h2>
        <p>Test your MCP servers before integration:</p>

        <CodeBlock language="typescript">
          {`// test-mcp-server.ts
import { MCPClient } from '@lov3kaizen/agentsea-core';
import { StdioTransport } from '@lov3kaizen/agentsea-core/mcp';

async function testMCPServer() {
  const client = new MCPClient(
    new StdioTransport({
      command: 'node',
      args: ['./my-mcp-server.js'],
    }),
  );

  try {
    // Connect
    await client.connect();
    console.log('✓ Connected to server');

    // List tools
    const tools = await client.listTools();
    console.log('✓ Tools:', tools.map(t => t.name));

    // Call tool
    const result = await client.callTool('weather_lookup', {
      location: 'San Francisco',
    });
    console.log('✓ Tool result:', result);

    // Disconnect
    await client.disconnect();
    console.log('✓ Disconnected');
  } catch (error) {
    console.error('✗ Test failed:', error);
  }
}

testMCPServer();`}
        </CodeBlock>

        <h2>Debugging MCP Connections</h2>
        <p>Enable debug logging to troubleshoot MCP connections:</p>

        <CodeBlock language="typescript">
          {`import { MCPRegistry, Logger } from '@lov3kaizen/agentsea-core';

// Enable debug logging
const logger = new Logger({ level: 'debug' });

const mcpRegistry = new MCPRegistry();

// Listen to MCP events
mcpRegistry.on('server:connected', (serverName) => {
  logger.info(\`MCP server '\${serverName}' connected\`);
});

mcpRegistry.on('server:disconnected', (serverName) => {
  logger.warn(\`MCP server '\${serverName}' disconnected\`);
});

mcpRegistry.on('server:error', (serverName, error) => {
  logger.error(\`MCP server '\${serverName}' error\`, error);
});

// Add server with debugging
await mcpRegistry.addServer({
  name: 'my-server',
  command: 'node',
  args: ['./server.js'],
  transport: 'stdio',
});`}
        </CodeBlock>

        <h2>MCP Server Registry</h2>
        <p>Discover more MCP servers in the community registry:</p>

        <ul>
          <li>
            <a
              href="https://github.com/modelcontextprotocol/servers"
              className="text-blue-600 hover:underline"
            >
              Official MCP Servers
            </a>
          </li>
          <li>
            <a
              href="https://github.com/topics/mcp-server"
              className="text-blue-600 hover:underline"
            >
              Community MCP Servers
            </a>
          </li>
          <li>
            <a href="https://mcp.so" className="text-blue-600 hover:underline">
              MCP Server Directory
            </a>
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/mcp-overview">Learn MCP Basics</Link>
          </li>
          <li>
            <Link href="/docs/tools">Explore Built-in Tools</Link>
          </li>
          <li>
            <Link href="/examples">View MCP Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const mcpServers = [
  {
    icon: '📁',
    name: 'Filesystem Server',
    description:
      'Provides file system operations including reading, writing, and listing files.',
    code: `await mcpRegistry.addServer({
  name: 'filesystem',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/home/user'],
  transport: 'stdio',
});`,
    usage:
      'Ask the agent to "read the contents of config.json" or "list all files in the directory"',
  },
  {
    icon: '🐙',
    name: 'GitHub Server',
    description:
      'Interact with GitHub repositories, issues, pull requests, and more.',
    code: `await mcpRegistry.addServer({
  name: 'github',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-github'],
  transport: 'stdio',
  env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN },
});`,
    usage:
      'Ask the agent to "create an issue in my repo" or "list recent pull requests"',
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
    usage:
      'Ask the agent to "query the users table" or "get the count of active orders"',
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
    usage:
      'Ask the agent to "send a message to #general" or "list recent messages"',
    envVars: ['SLACK_BOT_TOKEN'],
  },
  {
    icon: '🌐',
    name: 'Puppeteer Server',
    description:
      'Browser automation for web scraping, testing, and screenshots.',
    code: `await mcpRegistry.addServer({
  name: 'puppeteer',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-puppeteer'],
  transport: 'stdio',
});`,
    usage:
      'Ask the agent to "take a screenshot of example.com" or "scrape product prices from this page"',
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
    usage:
      'Ask the agent to "list my recent Google Drive files" or "download the Q4 report"',
    envVars: ['GOOGLE_CREDENTIALS'],
  },
];
