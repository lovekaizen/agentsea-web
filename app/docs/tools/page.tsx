import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';


export default function ToolsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Tools"
        titleGradient="warm"
        description="Tools extend agent capabilities by allowing them to interact with external systems, perform calculations, manipulate data, and more."
      />

      <div className="prose max-w-none">
        <h2>What are Tools?</h2>
        <p>
          Tools are functions that agents can call to perform specific tasks.
          They are defined with:
        </p>
        <ul>
          <li>A unique name and description</li>
          <li>Input schema validation using Zod</li>
          <li>An execution function that returns results</li>
        </ul>

        <h2>Built-in Tools</h2>
        <p>AgentSea includes 10+ powerful built-in tools ready to use:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
          {builtInTools.map((tool, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{tool.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2>Using Built-in Tools</h2>
        <p>Import and register tools with your agent:</p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  calculatorTool,
  httpRequestTool,
  fileReadTool,
  textSummaryTool,
} from '@lov3kaizen/agentsea-core';
import type { Tool, ToolCall, ToolContext } from '@lov3kaizen/agentsea-types';

// Create tool registry
const toolRegistry = new ToolRegistry();

// Register tools
toolRegistry.register(calculatorTool);
toolRegistry.register(httpRequestTool);
toolRegistry.register(fileReadTool);
toolRegistry.register(textSummaryTool);

// Create agent with tools
const agent = new Agent(
  {
    name: 'tool-agent',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    tools: [calculatorTool, httpRequestTool, fileReadTool, textSummaryTool],
  },
  new AnthropicProvider(),
  toolRegistry,
);

// Agent will automatically use tools when needed
const response = await agent.execute(
  'Calculate 42 * 58 and fetch weather data from https://api.weather.com',
  context,
);`}
        </CodeBlock>

        <h2>Creating Custom Tools</h2>
        <p>Create your own tools to extend agent capabilities:</p>

        <CodeBlock language="typescript">
          {`import { Tool } from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

// Define tool
export const databaseQueryTool: Tool = {
  name: 'database_query',
  description: 'Execute SQL queries on the database',
  inputSchema: z.object({
    query: z.string().describe('SQL query to execute'),
    params: z.array(z.any()).optional().describe('Query parameters'),
  }),
  execute: async (input) => {
    const { query, params = [] } = input;

    try {
      // Your database logic here
      const results = await db.query(query, params);

      return {
        success: true,
        data: results,
        message: \`Query executed successfully. \${results.length} rows returned.\`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

// Register with agent
toolRegistry.register(databaseQueryTool);`}
        </CodeBlock>

        <h2>Tool Schema Validation</h2>
        <p>
          Tools use Zod schemas for input validation. Here are common patterns:
        </p>

        <CodeBlock language="typescript">
          {`import { z } from 'zod';

// String with constraints
const nameSchema = z.object({
  name: z.string().min(1).max(100).describe('User name'),
});

// Numbers with ranges
const ageSchema = z.object({
  age: z.number().int().min(0).max(120).describe('User age'),
});

// Enums
const statusSchema = z.object({
  status: z.enum(['active', 'inactive', 'pending']).describe('Status'),
});

// Optional fields
const updateSchema = z.object({
  id: z.string().describe('User ID'),
  email: z.string().email().optional().describe('New email'),
  phone: z.string().optional().describe('New phone number'),
});

// Arrays
const bulkSchema = z.object({
  ids: z.array(z.string()).describe('User IDs to process'),
});

// Nested objects
const addressSchema = z.object({
  user: z.object({
    name: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      zip: z.string(),
    }),
  }),
});`}
        </CodeBlock>

        <h2>Async Tools</h2>
        <p>Tools can be async and perform long-running operations:</p>

        <CodeBlock language="bash">
          {`export const imageGenerationTool: Tool = {
  name: 'generate_image',
  description: 'Generate an image using DALL-E',
  inputSchema: z.object({
    prompt: z.string().describe('Image description'),
    size: z.enum(['256x256', '512x512', '1024x1024']).default('512x512'),
  }),
  execute: async (input) => {
    const { prompt, size } = input;

    // Call image generation API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        size,
        n: 1,
      }),
    });

    const data = await response.json();

    return {
      success: true,
      imageUrl: data.data[0].url,
      message: 'Image generated successfully',
    };
  },
};`}
        </CodeBlock>

        <h2>Error Handling</h2>
        <p>Always handle errors gracefully in tools:</p>

        <CodeBlock language="bash">
          {`export const apiCallTool: Tool = {
  name: 'api_call',
  description: 'Make an API call',
  inputSchema: z.object({
    endpoint: z.string().url(),
  }),
  execute: async (input) => {
    try {
      const response = await fetch(input.endpoint, {
        timeout: 5000, // 5 second timeout
      });

      if (!response.ok) {
        return {
          success: false,
          error: \`HTTP error \${response.status}: \${response.statusText}\`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out',
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }
  },
};`}
        </CodeBlock>

        <h2>MCP Tools</h2>
        <p>
          Use MCP (Model Context Protocol) to automatically import tools from
          external servers:
        </p>

        <CodeBlock language="typescript">
          {`import { MCPRegistry } from '@lov3kaizen/agentsea-core';

// Create MCP registry
const mcpRegistry = new MCPRegistry();

// Connect to MCP servers
await mcpRegistry.addServer({
  name: 'filesystem',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/home/user'],
  transport: 'stdio',
});

await mcpRegistry.addServer({
  name: 'github',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-github'],
  transport: 'stdio',
  env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN },
});

// Get all MCP tools (automatically converted)
const mcpTools = mcpRegistry.getTools();

// Register with tool registry
toolRegistry.registerMany(mcpTools);

// Agent now has access to filesystem and GitHub tools
const agent = new Agent(
  {
    name: 'mcp-agent',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    tools: mcpTools,
  },
  provider,
  toolRegistry,
);`}
        </CodeBlock>

        <h2>Tool Registry</h2>
        <p>Manage tools efficiently with the tool registry:</p>

        <CodeBlock language="typescript">
          {`import { ToolRegistry } from '@lov3kaizen/agentsea-core';

const toolRegistry = new ToolRegistry();

// Register single tool
toolRegistry.register(calculatorTool);

// Register multiple tools
toolRegistry.registerMany([
  httpRequestTool,
  fileReadTool,
  textSummaryTool,
]);

// Get tool by name
const calculator = toolRegistry.get('calculator');

// Check if tool exists
const exists = toolRegistry.has('calculator');

// List all tools
const allTools = toolRegistry.list();

// Unregister tool
toolRegistry.unregister('calculator');`}
        </CodeBlock>

        <h2>Isomorphic Tool Management</h2>
        <AlertBox type="info">
          Isomorphic tools let you define tools once and implement them for
          different environments (server or client). This enables type-safe tool
          definitions with Zod schemas for both input and output validation.
        </AlertBox>

        <p>
          The isomorphic tool system provides a clean separation between tool
          definitions and their implementations, allowing you to:
        </p>
        <ul>
          <li>Define tools with full input/output type safety</li>
          <li>Create server-side implementations for backend operations</li>
          <li>Create client-side implementations for browser operations</li>
          <li>Share tool definitions between environments</li>
        </ul>

        <h3>Tool Definition</h3>
        <p>
          Create a tool definition that can be implemented for different
          environments:
        </p>

        <CodeBlock language="typescript">
          {`import { toolDefinition } from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

// Define the tool with input/output schemas
const getUserDef = toolDefinition({
  name: 'get_user',
  description: 'Get user information from the database',
  inputSchema: z.object({
    userId: z.string().describe('The user ID to look up'),
  }),
  outputSchema: z.object({
    name: z.string(),
    email: z.string().email(),
    createdAt: z.string(),
  }),
});

// Server implementation - direct database access
const getUserServer = getUserDef.server(async ({ userId }, context) => {
  const user = await db.users.findUnique({ where: { id: userId } });
  return {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
});

// Client implementation - fetch from API
const getUserClient = getUserDef.client(async ({ userId }) => {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
});

// Use with agent
const agent = new Agent({
  tools: [getUserServer.toTool()],
  // ...
});`}
        </CodeBlock>

        <h3>Quick Helpers</h3>
        <p>
          For simpler cases, use the quick helper functions to create tools in
          one step:
        </p>

        <CodeBlock language="typescript">
          {`import { serverTool, clientTool, hybridTool } from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

// Server-only tool
const calculateTool = serverTool({
  name: 'calculate',
  description: 'Perform arithmetic operations',
  inputSchema: z.object({
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    a: z.number(),
    b: z.number(),
  }),
  outputSchema: z.object({ result: z.number() }),
  execute: async ({ operation, a, b }) => {
    switch (operation) {
      case 'add': return { result: a + b };
      case 'subtract': return { result: a - b };
      case 'multiply': return { result: a * b };
      case 'divide': return { result: a / b };
    }
  },
});

// Client-only tool (runs in browser)
const showNotification = clientTool({
  name: 'show_notification',
  description: 'Show a browser notification',
  inputSchema: z.object({
    title: z.string(),
    body: z.string(),
  }),
  outputSchema: z.object({ shown: z.boolean() }),
  execute: ({ title, body }) => {
    new Notification(title, { body });
    return { shown: true };
  },
});

// Hybrid tool with both implementations
const userTool = hybridTool({
  name: 'get_user',
  description: 'Get user information',
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({ name: z.string(), email: z.string() }),
  server: async ({ userId }) => {
    return await db.users.findUnique({ where: { id: userId } });
  },
  client: async ({ userId }) => {
    const res = await fetch(\`/api/users/\${userId}\`);
    return res.json();
  },
});`}
        </CodeBlock>

        <h3>Built-in Isomorphic Tools</h3>
        <p>
          AgentSea includes isomorphic versions of built-in tools with both
          server and client implementations:
        </p>

        <CodeBlock language="typescript">
          {`import {
  calculatorDef,
  calculatorServer,
  calculatorClient,
} from '@lov3kaizen/agentsea-core';

// Use the definition to create custom implementations
const customCalc = calculatorDef.server(async ({ operation, a, b }) => {
  // Custom server logic with logging
  console.log(\`Calculating: \${a} \${operation} \${b}\`);
  // ... implementation
});

// Or use pre-built implementations
const tools = [calculatorServer.toTool()];

// Execute directly
const result = await calculatorServer.execute(
  { operation: 'add', a: 5, b: 3 },
  context
);
// { result: 8 }`}
        </CodeBlock>

        <h3>Type Safety</h3>
        <p>
          Extract input and output types from tool definitions for full type
          safety:
        </p>

        <CodeBlock language="typescript">
          {`import type { ToolInput, ToolOutput } from '@lov3kaizen/agentsea-core';

// Extract types from tool
type CalcInput = ToolInput<typeof calculatorDef>;
// { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }

type CalcOutput = ToolOutput<typeof calculatorDef>;
// { result: number }

// Use in your code
function runCalculation(input: CalcInput): Promise<CalcOutput> {
  return calculatorServer.execute(input, context);
}`}
        </CodeBlock>

        <h3>Converting to Legacy Tools</h3>
        <p>Convert isomorphic tools to the legacy Tool interface for compatibility:</p>

        <CodeBlock language="typescript">
          {`import { toLegacyTool, toLegacyTools } from '@lov3kaizen/agentsea-core';

// Convert single tool
const legacyCalc = toLegacyTool(calculatorServer);

// Convert multiple tools
const legacyTools = toLegacyTools([
  calculatorServer,
  getUserServer,
  customTool,
]);

// Use with existing code
toolRegistry.registerMany(legacyTools);`}
        </CodeBlock>

        <Divider />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Descriptive Names</strong>: Use clear, descriptive tool
            names (e.g., <code>database_query</code> not <code>db</code>)
          </li>
          <li>
            <strong>Detailed Descriptions</strong>: Provide comprehensive
            descriptions so agents know when to use each tool
          </li>
          <li>
            <strong>Validation</strong>: Always validate inputs with Zod schemas
          </li>
          <li>
            <strong>Error Handling</strong>: Return structured error objects,
            never throw exceptions
          </li>
          <li>
            <strong>Timeouts</strong>: Set reasonable timeouts for external API
            calls
          </li>
          <li>
            <strong>Idempotency</strong>: Make tools idempotent when possible
          </li>
          <li>
            <strong>Side Effects</strong>: Document any side effects in the
            description
          </li>
          <li>
            <strong>Rate Limiting</strong>: Implement rate limiting for
            expensive operations
          </li>
          <li>
            <strong>Use Output Schemas</strong>: Define output schemas for
            better type safety and validation
          </li>
          <li>
            <strong>Environment Separation</strong>: Use isomorphic tools to
            keep server and client logic separate
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/react-hooks">Use Tools with React Hooks</Link>
          </li>
          <li>
            <Link href="/docs/mcp-overview">Learn about MCP Integration</Link>
          </li>
          <li>
            <Link href="/docs/workflows">Use Tools in Workflows</Link>
          </li>
          <li>
            <Link href="/examples">View Tool Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const builtInTools = [
  {
    icon: '🧮',
    name: 'Calculator',
    description:
      'Perform mathematical calculations with support for basic arithmetic',
  },
  {
    icon: '🌐',
    name: 'HTTP Request',
    description: 'Make HTTP requests to external APIs with retry logic',
  },
  {
    icon: '📁',
    name: 'File Read',
    description: 'Read file contents from the filesystem',
  },
  {
    icon: '✏️',
    name: 'File Write',
    description: 'Write data to files on the filesystem',
  },
  {
    icon: '📋',
    name: 'File List',
    description: 'List files and directories in a path',
  },
  {
    icon: '📊',
    name: 'Text Summary',
    description: 'Extract word count, emails, URLs, and numbers from text',
  },
  {
    icon: '🔤',
    name: 'String Transform',
    description:
      'Transform strings (uppercase, lowercase, titlecase, reverse, trim, slug)',
  },
  {
    icon: '📅',
    name: 'Date Time',
    description: 'Get current date/time and format dates',
  },
  {
    icon: '🎨',
    name: 'Figma',
    description:
      'Interact with Figma files, nodes, images, and comments via API',
  },
  {
    icon: '⚡',
    name: 'n8n',
    description: 'Execute and manage n8n workflows and webhooks for automation',
  },
];
