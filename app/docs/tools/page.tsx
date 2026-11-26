import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Tools | AgentSea',
  description:
    'Tools let AgentSea agents call external systems and run calculations. Built-in tools, custom tools with Zod schemas, the tool registry, MCP tools and isomorphic tool definitions.',
};

const toc = [
  { id: 'what-are-tools', label: 'What are tools?' },
  { id: 'built-in-tools', label: 'Built-in tools' },
  { id: 'using-built-in', label: 'Using built-in tools' },
  { id: 'custom-tools', label: 'Creating custom tools' },
  { id: 'schema-validation', label: 'Schema validation' },
  { id: 'async-tools', label: 'Async tools' },
  { id: 'error-handling', label: 'Error handling' },
  { id: 'tool-registry', label: 'Tool registry' },
  { id: 'mcp-tools', label: 'MCP tools' },
  { id: 'isomorphic-tools', label: 'Isomorphic tools' },
  { id: 'best-practices', label: 'Best practices' },
  { id: 'next-steps', label: 'Next steps' },
];

export default function ToolsPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Tools"
      lead="Tools extend agent capabilities by letting agents interact with external systems, perform calculations and manipulate data."
      active="concepts"
      toc={toc}
    >
      <DocSection id="what-are-tools" num="01" title="What are tools?">
        <p className="text-base leading-relaxed text-brand-navy">
          A tool is a function an agent can call. The model decides when to call it. Each tool has:
        </p>
        <BulletPanel
          items={[
            'A unique name and a description the model reads',
            'A Zod schema for its parameters, checked before the tool runs',
            'An execute function that receives the validated parameters and a context, and returns a result',
          ]}
        />
      </DocSection>

      <DocSection id="built-in-tools" num="02" title="Built-in tools">
        <p className="text-base leading-relaxed text-brand-navy">
          AgentSea includes built-in tools, ready to register:
        </p>
        <ApiList>
          <ApiRow name="calculatorTool">Basic arithmetic calculations.</ApiRow>
          <ApiRow name="httpRequestTool">HTTP requests to external APIs, with retry configured.</ApiRow>
          <ApiRow name="fileReadTool, fileWriteTool, fileListTool">
            Read, write and list files and directories.
          </ApiRow>
          <ApiRow name="textSummaryTool">Word and character counts, and extraction of emails, URLs and numbers.</ApiRow>
          <ApiRow name="stringTransformTool">Uppercase, lowercase, titlecase, reverse, trim and slug.</ApiRow>
          <ApiRow name="figmaGetFileTool, figmaGetNodesTool, figmaGetImagesTool, figmaGetCommentsTool, figmaPostCommentTool">
            Read Figma files, nodes, images and comments, and post comments.
          </ApiRow>
          <ApiRow name="n8nExecuteWorkflowTool, n8nGetExecutionTool, n8nListWorkflowsTool, n8nTriggerWebhookTool, n8nGetWorkflowTool">
            Run and inspect n8n workflows, and trigger webhooks.
          </ApiRow>
          <ApiRow name="shellExecuteTool, codeEditTool, globTool, grepTool">
            Coding tools: run shell commands, edit code, find files by pattern and search file contents.
          </ApiRow>
          <ApiRow name="gitStatusTool, gitDiffTool, gitAddTool, gitCommitTool, gitLogTool, gitBranchTool">
            Git status, diff, add, commit, log and branch.
          </ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="using-built-in" num="03" title="Using built-in tools">
        <CodeBlock
          lang="TS"
          code={`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  calculatorTool,
  httpRequestTool,
  fileReadTool,
  textSummaryTool,
} from '@lov3kaizen/agentsea-core';

const toolRegistry = new ToolRegistry();
toolRegistry.register(calculatorTool);
toolRegistry.register(httpRequestTool);
toolRegistry.register(fileReadTool);
toolRegistry.register(textSummaryTool);

const agent = new Agent(
  {
    name: 'tool-agent',
    description: 'Uses tools to answer questions',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    tools: [calculatorTool, httpRequestTool, fileReadTool, textSummaryTool],
  },
  new AnthropicProvider(),
  toolRegistry,
);

// The agent calls tools when the model asks for them
const response = await agent.execute(
  'Calculate 42 * 58 and fetch the JSON at https://api.example.com/stats',
  context,
);`}
        />
      </DocSection>

      <DocSection id="custom-tools" num="04" title="Creating custom tools">
        <p className="text-base leading-relaxed text-brand-navy">
          A custom tool is an object that matches the <code>Tool</code> type. The schema field is{' '}
          <code>parameters</code>, and it is a Zod schema.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Tool } from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

export const databaseQueryTool: Tool = {
  name: 'database_query',
  description: 'Execute SQL queries on the database',
  parameters: z.object({
    query: z.string().describe('SQL query to execute'),
    params: z.array(z.any()).optional().describe('Query parameters'),
  }),
  execute: async (input) => {
    const { query, params = [] } = input;
    try {
      const results = await db.query(query, params); // your database client
      return {
        success: true,
        data: results,
        message: \`Query executed successfully. \${results.length} rows returned.\`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};

toolRegistry.register(databaseQueryTool);`}
        />
      </DocSection>

      <DocSection id="schema-validation" num="05" title="Schema validation">
        <p className="text-base leading-relaxed text-brand-navy">
          Tool parameters are Zod schemas. The registry parses them before calling <code>execute</code>.
          Common patterns:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { z } from 'zod';

// Strings with constraints
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
        />
      </DocSection>

      <DocSection id="async-tools" num="06" title="Async tools">
        <p className="text-base leading-relaxed text-brand-navy">
          Tools can be async and call external services. Return a plain object with the result:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Tool } from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

export const weatherTool: Tool = {
  name: 'get_weather',
  description: 'Get the current weather for a city',
  parameters: z.object({
    city: z.string().describe('City name'),
  }),
  execute: async ({ city }) => {
    const response = await fetch(
      \`https://weather.example.com/current?city=\${encodeURIComponent(city)}\`,
    );
    const data = await response.json();
    return { success: true, data };
  },
};`}
        />
      </DocSection>

      <DocSection id="error-handling" num="07" title="Error handling">
        <p className="text-base leading-relaxed text-brand-navy">
          Handle expected failures inside the tool and return them as data. The model can read the
          message and recover.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Tool } from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

export const apiCallTool: Tool = {
  name: 'api_call',
  description: 'Make a GET request to an API endpoint',
  parameters: z.object({
    endpoint: z.string().url(),
  }),
  execute: async (input) => {
    try {
      const response = await fetch(input.endpoint, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        return {
          success: false,
          error: \`HTTP error \${response.status}: \${response.statusText}\`,
        };
      }

      return { success: true, data: await response.json() };
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        return { success: false, error: 'Request timed out' };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};`}
        />
        <Callout kind="note">
          The registry does not catch errors for you. If <code>execute</code> throws, the registry
          rethrows it as <code>Tool execution failed: ...</code>. Return an error object for failures
          you expect, and reserve exceptions for failures the agent cannot act on.
        </Callout>
      </DocSection>

      <DocSection id="tool-registry" num="08" title="Tool registry">
        <p className="text-base leading-relaxed text-brand-navy">
          The registry holds the tools available to an agent:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { ToolRegistry, calculatorTool, httpRequestTool, fileReadTool } from '@lov3kaizen/agentsea-core';

const toolRegistry = new ToolRegistry();

// Register one tool, or several at once
toolRegistry.register(calculatorTool);
toolRegistry.registerMany([httpRequestTool, fileReadTool]);

// Look up a tool by name
const calculator = toolRegistry.get('calculator');

// Check whether a tool exists
const exists = toolRegistry.has('calculator');

// List all registered tools
const allTools = toolRegistry.getAll();

// Remove a tool (returns true if it was registered)
toolRegistry.unregister('calculator');

// Clear everything
toolRegistry.clear();`}
        />
        <ApiList>
          <ApiRow name="register(tool)">Adds one tool.</ApiRow>
          <ApiRow name="registerMany(tools)">Adds several tools.</ApiRow>
          <ApiRow name="get(name)">Returns the tool or undefined.</ApiRow>
          <ApiRow name="has(name)">Returns true when the tool is registered.</ApiRow>
          <ApiRow name="getAll()">Returns every registered tool.</ApiRow>
          <ApiRow name="unregister(name)">Removes a tool. Returns true if it was present.</ApiRow>
          <ApiRow name="clear()">Removes all tools.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="mcp-tools" num="09" title="MCP tools">
        <p className="text-base leading-relaxed text-brand-navy">
          The Model Context Protocol (MCP) lets you import tools from external servers. The{' '}
          <code>MCPRegistry</code> starts each server and converts its tools to AgentSea tools:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, MCPRegistry, ToolRegistry } from '@lov3kaizen/agentsea-core';

const mcpRegistry = new MCPRegistry();
const toolRegistry = new ToolRegistry();

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
  env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN! },
});

// Tools from all connected servers, converted to AgentSea tools
const mcpTools = mcpRegistry.getTools();
toolRegistry.registerMany(mcpTools);

const agent = new Agent(
  {
    name: 'mcp-agent',
    description: 'Uses filesystem and GitHub tools',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    tools: mcpTools,
  },
  new AnthropicProvider(),
  toolRegistry,
);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          For transports, server options and reconnect behavior, see the{' '}
          <Link href="/docs/mcp-overview" className="font-semibold text-brand-ocean hover:underline">MCP overview</Link>.
        </p>
      </DocSection>

      <DocSection id="isomorphic-tools" num="10" title="Isomorphic tools">
        <p className="text-base leading-relaxed text-brand-navy">
          Isomorphic tools separate a tool&apos;s definition from its implementation. Define the input
          and output schemas once, then provide a server implementation, a client implementation or
          both. The input and output types come from the Zod schemas.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">Tool definition</h3>
        <CodeBlock
          lang="TS"
          code={`import { toolDefinition } from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

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

// Server implementation: direct database access
const getUserServer = getUserDef.server(async ({ userId }, context) => {
  const user = await db.users.findUnique({ where: { id: userId } });
  return {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
});

// Client implementation: call an API
const getUserClient = getUserDef.client(async ({ userId }) => {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
});

const agent = new Agent({
  // ...
  tools: [getUserServer.toTool()],
});`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Quick helpers</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          <code>serverTool</code>, <code>clientTool</code> and <code>hybridTool</code> create a tool in one
          call:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { serverTool, clientTool, hybridTool } from '@lov3kaizen/agentsea-core';
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

// Client-only tool, runs in the browser
const showNotification = clientTool({
  name: 'show_notification',
  description: 'Show a browser notification',
  inputSchema: z.object({ title: z.string(), body: z.string() }),
  outputSchema: z.object({ shown: z.boolean() }),
  execute: ({ title, body }) => {
    new Notification(title, { body });
    return { shown: true };
  },
});

// Hybrid tool with a server and a client implementation
const userTool = hybridTool({
  name: 'get_user',
  description: 'Get user information',
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({ name: z.string(), email: z.string() }),
  server: async ({ userId }) => db.users.findUnique({ where: { id: userId } }),
  client: async ({ userId }) => (await fetch(\`/api/users/\${userId}\`)).json(),
});`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Built-in isomorphic tools</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          The calculator has an isomorphic definition, with <code>calculatorDef</code>,{' '}
          <code>calculatorServer</code> and <code>calculatorClient</code> exported:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { calculatorServer } from '@lov3kaizen/agentsea-core';

const tools = [calculatorServer.toTool()];

const result = await calculatorServer.execute(
  { operation: 'add', a: 5, b: 3 },
  context,
);
// { result: 8 }`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Type helpers</h3>
        <CodeBlock
          lang="TS"
          code={`import type { ToolInput, ToolOutput } from '@lov3kaizen/agentsea-core';
import { calculatorDef, calculatorServer } from '@lov3kaizen/agentsea-core';

type CalcInput = ToolInput<typeof calculatorDef>;
type CalcOutput = ToolOutput<typeof calculatorDef>;

function runCalculation(input: CalcInput): Promise<CalcOutput> {
  return calculatorServer.execute(input, context);
}`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Converting to legacy tools</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          Use <code>toLegacyTool</code> and <code>toLegacyTools</code> to pass isomorphic tools to code
          that expects the <code>Tool</code> type:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { toLegacyTool, toLegacyTools } from '@lov3kaizen/agentsea-core';

const legacyCalc = toLegacyTool(calculatorServer);
const legacyTools = toLegacyTools([calculatorServer, getUserServer]);

toolRegistry.registerMany(legacyTools);`}
        />
      </DocSection>

      <DocSection id="best-practices" num="11" title="Best practices">
        <BulletPanel
          items={[
            <>
              <strong>Descriptive names</strong>: use clear names such as <code>database_query</code>, not{' '}
              <code>db</code>.
            </>,
            <>
              <strong>Detailed descriptions</strong>: the model chooses tools from their descriptions.
            </>,
            <>
              <strong>Validation</strong>: validate every input with a Zod schema.
            </>,
            <>
              <strong>Errors</strong>: return error objects for expected failures. Exceptions are
              rethrown by the registry.
            </>,
            <>
              <strong>Timeouts</strong>: set a timeout on every external call.
            </>,
            <>
              <strong>Idempotency</strong>: make tools idempotent where you can.
            </>,
            <>
              <strong>Side effects</strong>: state any side effects in the description.
            </>,
            <>
              <strong>Rate limits</strong>: limit calls to expensive operations.
            </>,
            <>
              <strong>Only relevant tools</strong>: give each agent only the tools its job needs.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="next-steps" num="12" title="Next steps">
        <BulletPanel
          items={[
            <Link key="react" href="/docs/react-hooks" className="text-brand-ocean hover:underline">
              Use tools with React hooks
            </Link>,
            <Link key="mcp" href="/docs/mcp-overview" className="text-brand-ocean hover:underline">
              MCP integration
            </Link>,
            <Link key="workflows" href="/docs/workflows" className="text-brand-ocean hover:underline">
              Use tools in workflows
            </Link>,
            <Link key="agents" href="/docs/agents" className="text-brand-ocean hover:underline">
              Agents
            </Link>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
