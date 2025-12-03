import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function MemoryPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Memory"
        titleGradient="blue"
        description="Memory stores enable agents to maintain conversation context across multiple interactions, providing continuity and personalization."
      />

      <div className="prose max-w-none">
        <h2>Memory Types</h2>
        <p>AgentSea provides four memory store implementations:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 not-prose mb-8">
          {memoryTypes.map((type, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{type.description}</p>
              <div className="text-xs text-gray-500">
                <strong>Best for:</strong> {type.bestFor}
              </div>
            </div>
          ))}
        </div>

        <h2>Buffer Memory</h2>
        <p>
          Simple in-memory storage that keeps the most recent messages. Fast and
          easy to use.
        </p>

        <CodeBlock language="typescript">
          {`import { Agent, BufferMemory, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// Create buffer memory with max 50 messages
const memory = new BufferMemory(50);

// Create agent with memory
const agent = new Agent(
  {
    name: 'chat-agent',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: 'You are a helpful assistant.',
  },
  new AnthropicProvider(),
  new ToolRegistry(),
  memory, // Pass memory to agent
);

// First conversation
await agent.execute('My name is Alice', {
  conversationId: 'user-123',
  sessionData: {},
  history: [],
});

// Agent remembers from previous message
await agent.execute('What is my name?', {
  conversationId: 'user-123',
  sessionData: {},
  history: [],
});
// Response: "Your name is Alice"`}
        </CodeBlock>

        <h2>Redis Memory</h2>
        <p>
          Persistent storage using Redis. Ideal for production applications with
          multiple servers.
        </p>

        <CodeBlock language="typescript">
          {`import { Agent, RedisMemory, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// Create Redis memory
const memory = new RedisMemory({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  ttl: 86400, // 24 hours (optional)
  keyPrefix: 'agent:', // Optional key prefix
});

// Create agent with Redis memory
const agent = new Agent(
  config,
  new AnthropicProvider(),
  new ToolRegistry(),
  memory,
);

// Memory persists across server restarts
await agent.execute('Remember: my favorite color is blue', context);

// Later, even after server restart
await agent.execute('What is my favorite color?', context);
// Response: "Your favorite color is blue"

// Cleanup when done
await memory.disconnect();`}
        </CodeBlock>

        <h2>Summary Memory</h2>
        <p>
          Automatically summarizes old messages to maintain context while
          reducing token usage.
        </p>

        <CodeBlock language="typescript">
          {`import { Agent, SummaryMemory, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// Create summary memory
const memory = new SummaryMemory(
  new AnthropicProvider(),
  {
    maxMessages: 20, // Keep last 20 messages
    summaryModel: 'claude-haiku-4-20250514', // Use fast model for summaries
    summaryPrompt: 'Summarize the key points from this conversation:', // Optional
  },
);

// Create agent
const agent = new Agent(
  config,
  new AnthropicProvider(),
  new ToolRegistry(),
  memory,
);

// As conversation grows, old messages are automatically summarized
// This keeps token usage low while maintaining context`}
        </CodeBlock>

        <h2>Memory Interface</h2>
        <p>All memory stores implement the same interface:</p>

        <CodeBlock language="typescript">
          {`interface MemoryStore {
  // Save messages for a conversation
  save(conversationId: string, messages: Message[]): Promise<void>;

  // Load messages for a conversation
  load(conversationId: string): Promise<Message[]>;

  // Clear messages for a conversation
  clear(conversationId: string): Promise<void>;

  // Optional: Check if conversation exists
  exists?(conversationId: string): Promise<boolean>;
}`}
        </CodeBlock>

        <h2>Custom Memory Store</h2>
        <p>
          Create your own memory store by implementing the MemoryStore
          interface:
        </p>

        <CodeBlock language="typescript">
          {`import { MemoryStore, Message } from '@lov3kaizen/agentsea-core';

export class DatabaseMemory implements MemoryStore {
  private db: Database;

  constructor(databaseConnection: Database) {
    this.db = databaseConnection;
  }

  async save(conversationId: string, messages: Message[]): Promise<void> {
    await this.db.conversations.upsert({
      where: { id: conversationId },
      update: {
        messages: messages,
        updatedAt: new Date(),
      },
      create: {
        id: conversationId,
        messages: messages,
        createdAt: new Date(),
      },
    });
  }

  async load(conversationId: string): Promise<Message[]> {
    const conversation = await this.db.conversations.findUnique({
      where: { id: conversationId },
    });

    return conversation?.messages || [];
  }

  async clear(conversationId: string): Promise<void> {
    await this.db.conversations.update({
      where: { id: conversationId },
      data: { messages: [] },
    });
  }

  async exists(conversationId: string): Promise<boolean> {
    const count = await this.db.conversations.count({
      where: { id: conversationId },
    });
    return count > 0;
  }
}

// Use custom memory
const memory = new DatabaseMemory(prismaClient);
const agent = new Agent(config, provider, toolRegistry, memory);`}
        </CodeBlock>

        <h2>Tenant Buffer Memory</h2>
        <p>
          Multi-tenant aware memory that isolates conversation data by tenant.
          Essential for multi-tenant applications.
        </p>

        <CodeBlock language="typescript">
          {`import { Agent, TenantBufferMemory, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// Create tenant-aware memory
const memory = new TenantBufferMemory({ maxMessages: 50 });

// Create agent with tenant memory
const agent = new Agent(
  {
    name: 'support-agent',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: 'You are a customer support assistant.',
  },
  new AnthropicProvider(),
  new ToolRegistry(),
  { type: 'custom', store: memory },
);

// Save conversation for specific tenant
await memory.save('tenant-123', 'conv-456', [
  { role: 'user', content: 'How do I upgrade my plan?' },
  { role: 'assistant', content: 'I can help you upgrade your plan...' },
]);

// Load conversation only for this tenant
const history = await memory.load('tenant-123', 'conv-456');

// Complete tenant isolation - Tenant A cannot access Tenant B's data
const tenantAHistory = await memory.load('tenant-a', 'conv-1'); // ✅ Returns tenant A's data
const tenantBHistory = await memory.load('tenant-b', 'conv-1'); // ✅ Returns tenant B's data (different)

// Clear tenant-specific conversation
await memory.clear('tenant-123', 'conv-456');

// Get all conversation IDs for a tenant
const conversationIds = await memory.getConversationIds('tenant-123');`}
        </CodeBlock>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">
            🏢 Multi-Tenancy Support
          </h3>
          <p className="mb-0">
            TenantBufferMemory provides complete data isolation between tenants,
            ensuring that one tenant's conversations are never accessible to
            another. Use this with the{' '}
            <Link
              href="/docs/multi-tenancy"
              className="text-blue-600 hover:underline"
            >
              Multi-Tenancy system
            </Link>{' '}
            for production SaaS applications.
          </p>
        </div>

        <h2>Managing Conversation History</h2>
        <p>Control how conversation history is managed:</p>

        <CodeBlock language="typescript">
          {`// Clear conversation history
await memory.clear('conversation-123');

// Load existing history
const history = await memory.load('conversation-123');

// Pass history directly to agent
const response = await agent.execute('Hello', {
  conversationId: 'user-123',
  sessionData: {},
  history: history, // Use pre-loaded history
});

// Check if conversation exists
const exists = await memory.exists('conversation-123');
if (!exists) {
  console.log('Starting new conversation');
}`}
        </CodeBlock>

        <h2>Session Data</h2>
        <p>Store additional context alongside messages:</p>

        <CodeBlock language="typescript">
          {`const context = {
  conversationId: 'user-123',
  sessionData: {
    userId: '12345',
    userName: 'Alice',
    preferences: {
      language: 'en',
      timezone: 'America/Los_Angeles',
    },
    metadata: {
      source: 'web',
      device: 'desktop',
    },
  },
  history: [],
};

const response = await agent.execute('What time is it?', context);

// Agent can reference session data in responses
// "Based on your timezone (America/Los_Angeles), it is currently..."`}
        </CodeBlock>

        <h2>Memory Best Practices</h2>

        <h3>Choosing the Right Memory Store</h3>
        <ul>
          <li>
            <strong>BufferMemory</strong>: Development, testing, single-server
            apps
          </li>
          <li>
            <strong>RedisMemory</strong>: Production, multi-server, high
            availability
          </li>
          <li>
            <strong>SummaryMemory</strong>: Long conversations, token
            optimization
          </li>
          <li>
            <strong>TenantBufferMemory</strong>: Multi-tenant SaaS applications
            requiring data isolation
          </li>
        </ul>

        <h3>Memory Configuration</h3>
        <ul>
          <li>
            Set appropriate message limits to balance context and token usage
          </li>
          <li>Use TTL in Redis to automatically expire old conversations</li>
          <li>Implement cleanup jobs to remove inactive conversations</li>
          <li>Monitor memory usage in production environments</li>
        </ul>

        <h3>Privacy and Security</h3>
        <ul>
          <li>Encrypt sensitive data before storing in memory</li>
          <li>Implement data retention policies</li>
          <li>Provide user controls to delete their conversation history</li>
          <li>Use conversation IDs that don't expose user information</li>
        </ul>

        <h2>Comparison Table</h2>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buffer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Redis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Summary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant Buffer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Persistence
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ❌ No
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ✅ Yes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚠️ Depends
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ❌ No
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Speed
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚡ Fastest
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚡ Fast
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  🐢 Slower
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚡ Fastest
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Scalability
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ❌ Single server
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ✅ Multi-server
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚠️ Depends
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ✅ Multi-tenant
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Token Usage
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚠️ Medium
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚠️ Medium
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ✅ Optimized
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚠️ Medium
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Setup
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ✅ Simple
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚠️ Redis required
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚠️ Extra LLM calls
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ✅ Simple
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Tenant Isolation
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ❌ No
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚠️ Manual
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⚠️ Manual
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ✅ Built-in
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/agents">Learn more about Agents</Link>
          </li>
          <li>
            <Link href="/docs/workflows">Use Memory in Workflows</Link>
          </li>
          <li>
            <Link href="/examples">View Memory Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const memoryTypes = [
  {
    icon: '💾',
    name: 'Buffer Memory',
    description: 'In-memory storage that keeps the most recent N messages',
    bestFor: 'Development, testing, simple applications',
  },
  {
    icon: '🔴',
    name: 'Redis Memory',
    description: 'Persistent storage using Redis for production deployments',
    bestFor: 'Production, multi-server, high availability',
  },
  {
    icon: '📝',
    name: 'Summary Memory',
    description: 'Automatically summarizes old messages to reduce token usage',
    bestFor: 'Long conversations, cost optimization',
  },
  {
    icon: '🏢',
    name: 'Tenant Buffer Memory',
    description: 'Multi-tenant aware memory with complete data isolation',
    bestFor: 'Multi-tenant SaaS applications',
  },
];
