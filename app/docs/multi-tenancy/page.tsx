import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'Multi-tenancy | AgentSea',
  description:
    'Create tenants, issue and verify API keys, track quotas, and keep conversation memory separate for each tenant.',
};

const toc = [
  { id: 'concepts', label: 'Concepts' },
  { id: 'tenant-manager', label: 'Set up TenantManager' },
  { id: 'api-keys', label: 'API keys' },
  { id: 'quotas', label: 'Quotas' },
  { id: 'memory', label: 'Memory by tenant' },
  { id: 'conversation-prefixes', label: 'Conversation ID prefixes' },
  { id: 'nest-guard', label: 'NestJS guard' },
  { id: 'management-routes', label: 'Management routes' },
];

export default function MultiTenancyPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="Multi-tenancy"
      lead="Create tenants, issue and verify API keys, track quotas, and keep conversation memory separate for each tenant."
      active="guides"
      toc={toc}
    >
      <DocSection id="concepts" num="01" title="Concepts">
        <BulletPanel
          items={[
            <>
              <code>Tenant</code>: id, name, slug, status, settings, createdAt and updatedAt. <code>TenantManager</code>{' '}
              checks for <code>TenantStatus.ACTIVE</code> when it verifies a key.
            </>,
            <>
              <code>TenantSettings</code>: limits and preferences per tenant, such as <code>maxAgents</code>,{' '}
              <code>maxConversations</code> and <code>rateLimit</code>. Defaults come from{' '}
              <code>defaultSettings</code> in the <code>TenantManager</code> config.
            </>,
            <>
              <code>TenantContext</code>: the tenant, with an optional <code>userId</code> and <code>metadata</code>.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="tenant-manager" num="02" title="Set up TenantManager">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>TenantManager</code> needs a storage object. <code>MemoryTenantStorage</code> keeps everything in
          process memory, so tenants and keys are lost when the process restarts. The guide recommends a
          database-backed <code>TenantStorage</code> in production.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { MemoryTenantStorage, TenantManager } from '@lov3kaizen/agentsea-core';

const tenantManager = new TenantManager({
  storage: new MemoryTenantStorage(),
  defaultSettings: { maxAgents: 10, maxConversations: 100, rateLimit: 100 },
});

const tenant = await tenantManager.createTenant({ name: 'Acme Corporation', slug: 'acme' });
const { plainKey } = await tenantManager.createApiKey(tenant.id, {
  name: 'Production API Key',
  scopes: ['agents:execute'],
});
const verified = await tenantManager.verifyApiKey(plainKey);`}
        />
      </DocSection>

      <DocSection id="api-keys" num="03" title="API keys">
        <BulletPanel
          items={[
            <>
              <code>createApiKey(tenantId, {'{ name, scopes?, expiresAt? }'})</code> returns{' '}
              <code>{'{ apiKey, plainKey }'}</code>. The stored <code>apiKey</code> record holds the hashed key. Give{' '}
              <code>plainKey</code> to the tenant once.
            </>,
            <>
              <code>verifyApiKey(plainKey)</code> returns the tenant, or <code>null</code> when the key is unknown or
              the tenant is not active.
            </>,
            <>
              <code>revokeApiKey(apiKeyId)</code> revokes a key.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="quotas" num="04" title="Quotas">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>checkQuota(tenantId, resource, amount = 1)</code> returns <code>{'{ allowed, remaining }'}</code>.{' '}
          <code>incrementQuota(tenantId, resource, amount)</code> records usage. Quota checks use an hourly period. The
          resource name is any string; requests, tokens, agents, conversations and storage are common choices.
        </p>
        <CodeBlock
          lang="TS"
          code={`const { allowed, remaining } = await tenantManager.checkQuota(tenant.id, 'requests');
if (!allowed) {
  throw new Error('Quota exceeded');
}
await tenantManager.incrementQuota(tenant.id, 'requests', 1);
console.log(remaining);`}
        />
      </DocSection>

      <DocSection id="memory" num="05" title="Memory by tenant">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>TenantBufferMemory</code> stores messages per conversation ID and per tenant. The same conversation ID
          under two tenants holds two separate histories.
        </p>
        <BulletPanel
          items={[
            <>
              Other methods: <code>clear(conversationId, tenantId)</code>, <code>clearAll()</code>,{' '}
              <code>getConversationIds(tenantId)</code>, <code>getTenantIds()</code> and <code>size(tenantId)</code>.
            </>,
          ]}
        />
        <CodeBlock
          lang="TS"
          code={`import { TenantBufferMemory } from '@lov3kaizen/agentsea-core';

const memory = new TenantBufferMemory();
const messagesA = [{ role: 'user', content: 'Hello from tenant A' }];
const messagesB = [{ role: 'user', content: 'Hello from tenant B' }];

memory.save('conv-1', messagesA, 'tenant_a');
memory.save('conv-1', messagesB, 'tenant_b');
console.log(memory.load('conv-1', 'tenant_a'));
memory.clearTenant('tenant_b');
console.log(memory.getTenantStats());`}
        />
      </DocSection>

      <DocSection id="conversation-prefixes" num="06" title="Conversation ID prefixes">
        <p className="text-base leading-relaxed text-brand-navy">
          Prefixing conversation IDs with the tenant ID, such as <code>tenantId:support-userId</code>, adds a check on
          reads. <code>TenantBufferMemory</code> already separates data by the <code>tenantId</code> argument, so the
          prefix is optional.
        </p>
        <Callout kind="warning">
          <code>deleteTenant</code> removes the tenant record from storage only. Memory held in{' '}
          <code>TenantBufferMemory</code> is not cleared. Call <code>clearTenant(tenantId)</code> as well.
        </Callout>
      </DocSection>

      <DocSection id="nest-guard" num="07" title="NestJS guard">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>TenantGuard</code> reads the API key from the <code>x-api-key</code> header and the tenant ID from{' '}
          <code>x-tenant-id</code> by default. The options are <code>apiKeyHeader</code>, <code>tenantIdHeader</code>{' '}
          and <code>useSubdomain</code>. The guard takes one options object, which includes <code>tenantManager</code>.
          Nest cannot inject that object by class, so create the guard with <code>new TenantGuard(...)</code> and pass
          the instance to <code>@UseGuards</code>.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Controller, Get, UseGuards } from '@nestjs/common';
import { TenantGuard, TenantId } from '@lov3kaizen/agentsea-nestjs';
// tenantManager: the TenantManager from section 02.

@Controller('agents')
@UseGuards(new TenantGuard({ tenantManager }))
export class TenantAgentsController {
  @Get()
  list(@TenantId() tenantId: string) {
    return { tenantId };
  }
}`}
        />
      </DocSection>

      <DocSection id="management-routes" num="08" title="Management routes">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>TenantController</code> serves these routes under <code>/tenants</code>. It injects a{' '}
          <code>TenantManager</code>, and <code>AgenticModule</code> does not register it, so add it to your module
          yourself.
        </p>
        <BulletPanel
          items={[
            <>
              <code>POST /tenants</code>, <code>GET /tenants</code>, <code>GET /tenants/:id</code>,{' '}
              <code>PUT /tenants/:id</code>, <code>DELETE /tenants/:id</code>
            </>,
            <>
              <code>POST /tenants/:id/suspend</code>, <code>POST /tenants/:id/activate</code>
            </>,
            <>
              <code>POST /tenants/:id/api-keys</code>, <code>GET /tenants/:id/quota/:resource</code>
            </>,
          ]}
        />
        <Callout kind="warning">
          These routes have no guard. Anyone who can reach the app can create, suspend or delete tenants. Add an admin
          guard before exposing them.
        </Callout>
      </DocSection>
    </DocsShell>
  );
}
