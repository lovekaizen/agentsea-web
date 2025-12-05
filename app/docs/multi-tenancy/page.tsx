import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function MultiTenancyPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Multi-Tenancy Support"
        titleGradient="purple"
        description="AgentSea provides enterprise-grade multi-tenancy support, enabling you to serve multiple customers with isolated data, quotas, and configurations."
      />

      <div className="prose max-w-none">
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">🆕 Enterprise Feature</h3>
          <p className="mb-0">
            Multi-tenancy support provides production-ready tenant isolation,
            API key authentication, and quota management. Types are available from{' '}
            <code>@lov3kaizen/agentsea-types</code> or re-exported from the core package.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">Overview</h2>
        <p>The multi-tenancy system provides:</p>
        <ul>
          <li>
            <strong>Tenant Isolation:</strong> Complete data separation between
            tenants
          </li>
          <li>
            <strong>API Key Authentication:</strong> Secure SHA256-hashed API
            keys per tenant
          </li>
          <li>
            <strong>Quota Management:</strong> Track and enforce usage limits
            across hourly, daily, and monthly periods
          </li>
          <li>
            <strong>Settings Management:</strong> Per-tenant configuration for
            agents, conversations, rate limits, and more
          </li>
          <li>
            <strong>Status Control:</strong> Activate, suspend, or deactivate
            tenants dynamically
          </li>
          <li>
            <strong>Memory Isolation:</strong> Tenant-scoped conversation
            history and memory stores
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-4">Tenant Manager</h2>
        <p>
          The <code>TenantManager</code> class provides complete lifecycle
          management for tenants.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Creating a Tenant</h3>
        <CodeBlock language="typescript">
          {`import { TenantManager, MemoryTenantStorage } from '@lov3kaizen/agentsea-core';
import type { Tenant, TenantSettings } from '@lov3kaizen/agentsea-types';

const storage = new MemoryTenantStorage();
const tenantManager = new TenantManager(storage);

// Create a new tenant
const tenant = await tenantManager.createTenant({
  name: 'Acme Corporation',
  slug: 'acme-corp',
  metadata: {
    industry: 'Technology',
    plan: 'enterprise',
  },
  settings: {
    maxAgents: 50,
    maxConversations: 1000,
    rateLimit: { requestsPerMinute: 100 },
    dataRetentionDays: 90,
    allowedProviders: ['anthropic', 'openai'],
  },
});

console.log('Tenant created:', tenant.id);`}
        </CodeBlock>

        <h3 className="text-xl font-semibold mt-8 mb-4">Generating API Keys</h3>
        <p>
          Each tenant can have one or more API keys with scoped permissions and
          expiration dates.
        </p>
        <CodeBlock language="typescript">
          {`// Generate a new API key for the tenant
const apiKey = await tenantManager.generateApiKey(tenant.id, {
  scopes: ['agents:read', 'agents:write', 'conversations:read'],
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
});

console.log('API Key:', apiKey.key); // Save this - it won't be shown again!
console.log('Key ID:', apiKey.id);

// Verify an API key
const verified = await tenantManager.verifyApiKey(apiKey.key);
if (verified) {
  console.log('Valid API key for tenant:', verified.tenantId);
}`}
        </CodeBlock>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">⚠️ Security Note</h3>
          <p className="mb-0">
            API keys are hashed using SHA256 before storage. The plaintext key
            is only available during generation. Store it securely!
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">Tenant Configuration</h2>

        <h3 className="text-xl font-semibold mt-8 mb-4">Tenant Settings</h3>
        <p>
          Each tenant has customizable settings that control resource limits and
          behavior:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Setting
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">maxAgents</td>
                <td className="px-6 py-4 text-sm text-gray-600">number</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Maximum number of agents allowed
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  maxConversations
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">number</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Maximum concurrent conversations
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">rateLimit</td>
                <td className="px-6 py-4 text-sm text-gray-600">object</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Requests per minute limit
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  dataRetentionDays
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">number</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  How long to retain conversation data
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  allowedProviders
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">string[]</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Permitted LLM providers
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Tenant Status</h3>
        <p>Tenants can have one of three statuses:</p>
        <ul>
          <li>
            <strong>ACTIVE:</strong> Fully operational, can use all features
          </li>
          <li>
            <strong>SUSPENDED:</strong> Temporarily disabled, typically for
            non-payment or policy violations
          </li>
          <li>
            <strong>INACTIVE:</strong> Permanently disabled, retains data but no
            access
          </li>
        </ul>

        <CodeBlock language="typescript">
          {`// Suspend a tenant
await tenantManager.updateTenant(tenant.id, {
  status: 'SUSPENDED',
});

// Reactivate a tenant
await tenantManager.updateTenant(tenant.id, {
  status: 'ACTIVE',
});`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4">Quota Management</h2>
        <p>Track and enforce usage quotas across different time periods.</p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Recording Usage</h3>
        <CodeBlock language="typescript">
          {`// Record API usage
await tenantManager.recordQuotaUsage(tenant.id, {
  resource: 'api_calls',
  amount: 1,
  period: 'hourly',
});

// Record token usage
await tenantManager.recordQuotaUsage(tenant.id, {
  resource: 'tokens',
  amount: 5000,
  period: 'daily',
});

// Check quota status
const quotas = await storage.getQuotas(tenant.id);
for (const quota of quotas) {
  console.log(\`\${quota.resource}: \${quota.used}/\${quota.limit} (\${quota.period})\`);
}`}
        </CodeBlock>

        <h3 className="text-xl font-semibold mt-8 mb-4">Quota Periods</h3>
        <p>Quotas can be tracked across three time periods:</p>
        <ul>
          <li>
            <strong>hourly:</strong> Resets every hour
          </li>
          <li>
            <strong>daily:</strong> Resets every day
          </li>
          <li>
            <strong>monthly:</strong> Resets every month
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-4">Tenant-Aware Memory</h2>
        <p>
          Use <code>TenantBufferMemory</code> to ensure conversation data is
          isolated per tenant.
        </p>

        <CodeBlock language="typescript">
          {`import { TenantBufferMemory } from '@lov3kaizen/agentsea-core';

const memory = new TenantBufferMemory({ maxMessages: 50 });

// Save conversation for a specific tenant
await memory.save('tenant-123', 'conv-456', [
  { role: 'user', content: 'Hello!' },
  { role: 'assistant', content: 'Hi! How can I help?' },
]);

// Load only this tenant's conversations
const history = await memory.load('tenant-123', 'conv-456');

// Clear tenant data
await memory.clear('tenant-123', 'conv-456');`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4">Storage Backends</h2>
        <p>
          AgentSea provides multiple storage implementations for tenant data:
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Memory Storage (Development)
        </h3>
        <p>In-memory storage, ideal for development and testing.</p>
        <CodeBlock language="typescript">
          {`import { MemoryTenantStorage, TenantManager } from '@lov3kaizen/agentsea-core';

const storage = new MemoryTenantStorage();
const tenantManager = new TenantManager(storage);`}
        </CodeBlock>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Database Storage (Production)
        </h3>
        <p>
          For production deployments, implement the <code>TenantStorage</code>{' '}
          interface with your preferred database.
        </p>
        <CodeBlock language="typescript">
          {`import { TenantStorage, Tenant } from '@lov3kaizen/agentsea-core';

class PostgresTenantStorage implements TenantStorage {
  async create(tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tenant> {
    // Implement with your database
  }

  async get(id: string): Promise<Tenant | null> {
    // Implement with your database
  }

  async update(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    // Implement with your database
  }

  async delete(id: string): Promise<void> {
    // Implement with your database
  }

  async getBySlug(slug: string): Promise<Tenant | null> {
    // Implement with your database
  }

  async list(): Promise<Tenant[]> {
    // Implement with your database
  }

  // ... implement remaining methods
}`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4">NestJS Integration</h2>
        <p>
          AgentSea provides decorators and guards for seamless multi-tenancy in
          NestJS applications.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Tenant Guard</h3>
        <CodeBlock language="typescript">
          {`import { Controller, Get, UseGuards } from '@nestjs/common';
import { TenantGuard, Tenant } from '@lov3kaizen/agentsea-nestjs';

@Controller('agents')
@UseGuards(TenantGuard)
export class AgentsController {
  @Get()
  async listAgents(@Tenant() tenant: TenantContext) {
    // tenant.id, tenant.name, tenant.settings are available
    return this.agentService.getAgentsByTenant(tenant.id);
  }
}`}
        </CodeBlock>

        <h3 className="text-xl font-semibold mt-8 mb-4">Tenant Decorator</h3>
        <p>
          Extract tenant context from requests using the <code>@Tenant()</code>{' '}
          decorator.
        </p>
        <CodeBlock language="typescript">
          {`import { Tenant } from '@lov3kaizen/agentsea-nestjs';

@Post('execute')
async executeAgent(
  @Tenant() tenant: TenantContext,
  @Body() dto: ExecuteAgentDto,
) {
  // Use tenant.id for data isolation
  return this.agentService.execute(tenant.id, dto);
}`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4">Complete Example</h2>
        <CodeBlock language="typescript">
          {`import {
  TenantManager,
  MemoryTenantStorage,
  TenantBufferMemory,
  Agent,
  AnthropicProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';

// Initialize multi-tenancy system
const storage = new MemoryTenantStorage();
const tenantManager = new TenantManager(storage);

// Create tenant
const tenant = await tenantManager.createTenant({
  name: 'Acme Corp',
  slug: 'acme-corp',
  settings: {
    maxAgents: 10,
    maxConversations: 100,
    allowedProviders: ['anthropic'],
  },
});

// Generate API key
const apiKey = await tenantManager.generateApiKey(tenant.id);
console.log('Save this API key:', apiKey.key);

// Setup tenant-isolated memory
const memory = new TenantBufferMemory();

// Create agent for tenant
const agent = new Agent(
  {
    name: 'support-agent',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: 'You are a helpful customer support assistant.',
  },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  new ToolRegistry(),
  { type: 'custom', store: memory },
);

// Execute with tenant context
const conversationId = 'conv-1';
const response = await agent.execute('How do I reset my password?', {
  conversationId,
  sessionData: { tenantId: tenant.id },
  history: await memory.load(tenant.id, conversationId),
});

// Save tenant conversation
await memory.save(tenant.id, conversationId, [
  { role: 'user', content: 'How do I reset my password?' },
  { role: 'assistant', content: response.content },
]);

// Record usage
await tenantManager.recordQuotaUsage(tenant.id, {
  resource: 'api_calls',
  amount: 1,
  period: 'hourly',
});

await tenantManager.recordQuotaUsage(tenant.id, {
  resource: 'tokens',
  amount: response.metadata.tokensUsed || 0,
  period: 'daily',
});

console.log('Response:', response.content);`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4">Best Practices</h2>
        <ul>
          <li>
            <strong>API Key Security:</strong> Always use HTTPS and never log
            plaintext API keys
          </li>
          <li>
            <strong>Quota Monitoring:</strong> Set up alerts when tenants
            approach quota limits
          </li>
          <li>
            <strong>Data Retention:</strong> Respect tenant data retention
            policies and automate cleanup
          </li>
          <li>
            <strong>Resource Limits:</strong> Set conservative defaults and
            allow upgrades
          </li>
          <li>
            <strong>Audit Logging:</strong> Track all tenant operations for
            compliance
          </li>
          <li>
            <strong>Graceful Degradation:</strong> Handle quota exceeded
            scenarios with clear error messages
          </li>
          <li>
            <strong>Testing:</strong> Test with multiple tenants to ensure
            complete isolation
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/nestjs" className="text-blue-600 hover:underline">
              NestJS Integration
            </Link>{' '}
            - Build multi-tenant APIs with NestJS
          </li>
          <li>
            <Link href="/docs/memory" className="text-blue-600 hover:underline">
              Memory Stores
            </Link>{' '}
            - Learn about tenant-aware memory systems
          </li>
          <li>
            <Link
              href="/docs/observability"
              className="text-blue-600 hover:underline"
            >
              Observability
            </Link>{' '}
            - Monitor tenant usage and performance
          </li>
          <li>
            <Link href="/examples" className="text-blue-600 hover:underline">
              Examples
            </Link>{' '}
            - See complete multi-tenancy examples
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
