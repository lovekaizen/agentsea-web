import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Memory | AgentSea',
  description:
    'Memory stores keep an agent conversation history across calls: buffer, Redis, summary and tenant-aware stores, and how to write your own.',
};

const toc = [
  { id: 'memory-types', label: 'Memory types' },
  { id: 'buffer-memory', label: 'Buffer memory' },
  { id: 'redis-memory', label: 'Redis memory' },
  { id: 'summary-memory', label: 'Summary memory' },
  { id: 'tenant-buffer-memory', label: 'Tenant buffer memory' },
  { id: 'memory-interface', label: 'Memory interface' },
  { id: 'custom-store', label: 'Custom memory store' },
  { id: 'managing-history', label: 'Managing history' },
  { id: 'session-data', label: 'Session data' },
  { id: 'choosing-store', label: 'Choosing a store' },
  { id: 'best-practices', label: 'Best practices' },
  { id: 'next-steps', label: 'Next steps' },
];

export default function MemoryPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Memory"
      lead="Memory stores let an agent keep conversation context across calls, for continuity and personalization."
      active="concepts"
      toc={toc}
    >
      <DocSection id="memory-types" num="01" title="Memory types">
        <p className="text-base leading-relaxed text-brand-navy">
          AgentSea provides four memory stores in core. Pass one to the <code>Agent</code>{' '}
          constructor as its fourth argument.
        </p>
        <ApiList>
          <ApiRow name="BufferMemory">
            Keeps the most recent messages in process memory. Best for development, testing and
            single-process apps.
          </ApiRow>
          <ApiRow name="RedisMemory">
            Stores conversations in Redis, so several servers can share them. Best for production.
          </ApiRow>
          <ApiRow name="SummaryMemory">
            Keeps the latest messages verbatim and summarizes older ones. Best for long conversations.
          </ApiRow>
          <ApiRow name="TenantBufferMemory">
            Buffer memory keyed by tenant, so one tenant&apos;s conversations are not returned to another.
            Best for multi-tenant apps.
          </ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="buffer-memory" num="02" title="Buffer memory">
        <p className="text-base leading-relaxed text-brand-navy">
          Keeps the most recent messages. Pass a number to cap how many are stored per conversation.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, BufferMemory, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// Keep at most 50 messages per conversation
const memory = new BufferMemory(50);

const agent = new Agent(
  {
    name: 'chat-agent',
    description: 'Chat assistant with short-term memory',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    systemPrompt: 'You are a helpful assistant.',
  },
  new AnthropicProvider(),
  new ToolRegistry(),
  memory,
);

const context = { conversationId: 'user-123', sessionData: {}, history: [] };

await agent.execute('My name is Alice', context);

// The agent loads the saved history for user-123
await agent.execute('What is my name?', context); // "Your name is Alice"`}
        />
      </DocSection>

      <DocSection id="redis-memory" num="03" title="Redis memory">
        <p className="text-base leading-relaxed text-brand-navy">
          Persists conversations in Redis. Use it when several servers handle the same conversations,
          or when history must survive a restart.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, RedisMemory, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const memory = new RedisMemory({
  host: 'localhost',                   // falls back to REDIS_HOST
  port: 6379,                          // falls back to REDIS_PORT
  password: process.env.REDIS_PASSWORD, // falls back to REDIS_PASSWORD
  prefix: 'agent:',                    // optional key prefix
  ttl: 86400,                          // seconds, set on each save
});

const agent = new Agent(config, new AnthropicProvider(), new ToolRegistry(), memory);

await agent.execute('Remember: my favorite color is blue', context);

// Close the connection when the process shuts down
await memory.disconnect();`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          The constructor takes <code>host</code>, <code>port</code>, <code>password</code>,{' '}
          <code>db</code>, <code>prefix</code> and <code>ttl</code>. It does not take a URL.
        </p>
      </DocSection>

      <DocSection id="summary-memory" num="04" title="Summary memory">
        <p className="text-base leading-relaxed text-brand-navy">
          Keeps the latest messages as they are, and summarizes the older ones with a model. On load,
          the summary comes first as a system message, followed by the recent messages.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { SummaryMemory, AnthropicProvider } from '@lov3kaizen/agentsea-core';

const memory = new SummaryMemory(
  new AnthropicProvider(), // provider that writes the summaries
  20,                      // maxRecentMessages: keep the last 20 verbatim (default 10)
  'claude-haiku-4-5',      // summaryModel (default)
);`}
        />
        <Callout kind="note">
          Summary memory keeps its data in process memory, like buffer memory. It is not persisted.
        </Callout>
      </DocSection>

      <DocSection id="tenant-buffer-memory" num="05" title="Tenant buffer memory">
        <p className="text-base leading-relaxed text-brand-navy">
          Buffer memory where each call also takes a tenant ID. Conversations are stored per tenant, so
          a lookup under one tenant does not return another tenant&apos;s messages.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { TenantBufferMemory } from '@lov3kaizen/agentsea-core';

const memory = new TenantBufferMemory(50); // maxMessages

// The tenant ID is the last argument of save, load and clear
memory.save('conv-456', [
  { role: 'user', content: 'How do I upgrade my plan?' },
  { role: 'assistant', content: 'I can help you upgrade your plan...' },
], 'tenant-123');

const history = memory.load('conv-456', 'tenant-123');

// Tenant A and tenant B stay apart, even with the same conversation ID
const tenantA = memory.load('conv-1', 'tenant-a');
const tenantB = memory.load('conv-1', 'tenant-b');

memory.clear('conv-456', 'tenant-123');
const conversationIds = memory.getConversationIds('tenant-123');`}
        />
        <Callout kind="warning">
          <code>TenantBufferMemory</code> methods are synchronous, and they take the tenant ID as an extra
          argument. The <code>Agent</code> calls its memory with the conversation ID only, so the agent
          does not pass a tenant ID. For tenant isolation, call <code>save</code>, <code>load</code> and{' '}
          <code>clear</code> with the tenant ID yourself, or use a separate memory store per tenant.
        </Callout>
        <Callout kind="note">
          For tenant setup across the platform, see{' '}
          <Link href="/docs/multi-tenancy" className="font-semibold text-brand-ocean hover:underline">
            multi-tenancy
          </Link>
          .
        </Callout>
      </DocSection>

      <DocSection id="memory-interface" num="06" title="Memory interface">
        <p className="text-base leading-relaxed text-brand-navy">
          An agent accepts any object that implements this interface:
        </p>
        <CodeBlock
          lang="TS"
          code={`interface MemoryStore {
  save(conversationId: string, messages: Message[]): Promise<void>;
  load(conversationId: string): Promise<Message[]>;
  clear(conversationId: string): Promise<void>;
  search?(query: string, limit?: number): Promise<Message[]>; // optional
}`}
        />
      </DocSection>

      <DocSection id="custom-store" num="07" title="Custom memory store">
        <p className="text-base leading-relaxed text-brand-navy">
          Implement <code>MemoryStore</code> to keep history in your own database:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, MemoryStore, Message } from '@lov3kaizen/agentsea-core';

export class DatabaseMemory implements MemoryStore {
  constructor(private db: Database) {} // your database client

  async save(conversationId: string, messages: Message[]): Promise<void> {
    await this.db.conversations.upsert({
      where: { id: conversationId },
      update: { messages, updatedAt: new Date() },
      create: { id: conversationId, messages, createdAt: new Date() },
    });
  }

  async load(conversationId: string): Promise<Message[]> {
    const conversation = await this.db.conversations.findUnique({
      where: { id: conversationId },
    });
    return conversation?.messages ?? [];
  }

  async clear(conversationId: string): Promise<void> {
    await this.db.conversations.update({
      where: { id: conversationId },
      data: { messages: [] },
    });
  }
}

const memory = new DatabaseMemory(dbClient);
const agent = new Agent(config, provider, toolRegistry, memory);`}
        />
      </DocSection>

      <DocSection id="managing-history" num="08" title="Managing history">
        <p className="text-base leading-relaxed text-brand-navy">
          You can read and clear a conversation outside an agent run:
        </p>
        <CodeBlock
          lang="TS"
          code={`// Load the saved history
const history = await memory.load('conversation-123');

// Clear it
await memory.clear('conversation-123');

// List conversation IDs (BufferMemory and RedisMemory)
const ids = await memory.getConversationIds();`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          When an agent has a memory store, every <code>execute()</code> call loads history from that store
          by <code>conversationId</code>. The <code>history</code> field of the context is used only when
          the agent has no memory store, or when loading from the store fails.
        </p>
      </DocSection>

      <DocSection id="session-data" num="09" title="Session data">
        <p className="text-base leading-relaxed text-brand-navy">
          The context&apos;s <code>sessionData</code> field carries application data with a call. The agent loop
          does not read it, and it does not add it to the prompt. To give the model a value, put it in the
          system prompt or in the user message:
        </p>
        <CodeBlock
          lang="TS"
          code={`const context = {
  conversationId: 'user-123',
  sessionData: { userId: '12345', timezone: 'America/Los_Angeles' },
  history: [],
};

const agent = new Agent(
  {
    // ...
    systemPrompt: 'The user is in the America/Los_Angeles timezone. Give times in that zone.',
  },
  provider,
  toolRegistry,
  memory,
);

const response = await agent.execute('What time is it?', context);`}
        />
      </DocSection>

      <DocSection id="choosing-store" num="10" title="Choosing a store">
        <div className="overflow-x-auto rounded-xl border border-rule bg-surface-paper">
          <table className="min-w-full text-[15px] text-brand-navy">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-brand-deep">Store</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-deep">Where history lives</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-deep">Survives restart</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-deep">Needs</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['BufferMemory', 'Process memory', 'No', 'Nothing extra'],
                ['RedisMemory', 'Redis', 'Yes', 'A Redis server'],
                ['SummaryMemory', 'Process memory', 'No', 'A provider to write summaries'],
                ['TenantBufferMemory', 'Process memory, per tenant', 'No', 'Nothing extra'],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-rule">
                  <td className="px-4 py-3 font-semibold text-brand-deep">{row[0]}</td>
                  <td className="px-4 py-3">{row[1]}</td>
                  <td className="px-4 py-3">{row[2]}</td>
                  <td className="px-4 py-3">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="best-practices" num="11" title="Best practices">
        <BulletPanel
          items={[
            <>
              <strong>Pick by deployment</strong>: buffer for development and single-process apps, Redis for
              production and several servers, summary for long conversations.
            </>,
            <>
              <strong>Set limits</strong>: a message cap on buffer memory, or a recent-message count on summary
              memory, keeps token use in check.
            </>,
            <>
              <strong>Expire old data</strong>: set <code>ttl</code> on Redis memory, and clean up inactive
              conversations in other stores.
            </>,
            <>
              <strong>Protect the data</strong>: encrypt sensitive content before you store it, set a retention
              policy, and let users delete their history.
            </>,
            <>
              <strong>Use opaque conversation IDs</strong> that do not reveal user information.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="next-steps" num="12" title="Next steps">
        <BulletPanel
          items={[
            <Link key="pkg" href="/docs/packages/memory" className="text-brand-ocean hover:underline">
              Memory package reference
            </Link>,
            <Link key="agents" href="/docs/agents" className="text-brand-ocean hover:underline">
              Agents
            </Link>,
            <Link key="conversation" href="/docs/conversation" className="text-brand-ocean hover:underline">
              Conversation management
            </Link>,
            <Link key="tenancy" href="/docs/multi-tenancy" className="text-brand-ocean hover:underline">
              Multi-tenancy
            </Link>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
