import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import BulletPanel from '../../../components/docs/BulletPanel';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-prompts | AgentSea',
  description: 'A self-hosted prompt registry with versions, environments, A/B tests and an SDK client.',
};

const pkg: PackageDoc = {
  slug: 'prompts',
  name: '@lov3kaizen/agentsea-prompts',
  summary: 'A self-hosted prompt registry.',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-prompts',
  example: {
    lang: 'TS',
    code: `import { PromptRegistry, FileStorage } from '@lov3kaizen/agentsea-prompts';

const registry = new PromptRegistry({
  storage: new FileStorage({ path: './prompts' }),
});
await registry.initialize();

await registry.create({
  name: 'customer-support',
  template: 'You are a helpful customer support agent for {{company_name}}.',
  variables: { company_name: { type: 'string', required: true } },
});

const rendered = await registry.render('customer-support', { company_name: 'Acme Corp' });
console.log(rendered.content);`,
  },
  api: [
    {
      name: 'PromptRegistry({ storage, defaultEnvironment, environments })',
      description:
        'Main class. Methods: create, get, update, render, history, diff, rollback, branch, merge, promote, createABTest.',
    },
    {
      name: 'registry.promote(name, { from, to, version, approver?, message })',
      description: 'Moves a version between environments. approver is required for a protected environment.',
    },
    {
      name: 'FileStorage({ path, format }) and BufferStorage()',
      description: "File-based storage (format 'json' is shown) and in-memory storage for tests.",
    },
    {
      name: 'PromptClient({ registryUrl, apiKey, environment, cache })',
      description:
        "Imported from '@lov3kaizen/agentsea-prompts/client'. Loads prompts at runtime with caching.",
    },
    {
      name: 'PromptProvider({ registry, environment, autoRefresh }).dynamic(name, vars)',
      description:
        'Supplies a prompt to an AgentSea Agent as systemPrompt. dynamic() returns an async function, not a string.',
    },
  ],
  caveats: [
    'Only ESM is supported. Requires Node.js 20 or later.',
    'File and in-memory storage are implemented. PostgreSQL is marked coming soon. The SQLite and S3 packages are listed as optional dependencies, but no adapter for them is exported.',
    '@lov3kaizen/agentsea-core is an optional peer dependency. Install it when you use the AgentSea integration.',
    'autoRefresh clears the cached prompt when the registry emits prompt:updated for the same environment. The next call to the dynamic prompt reads the new version.',
  ],
};

const toc = [
  { id: 'version-control', label: 'Version control' },
  { id: 'environments', label: 'Environments' },
  { id: 'ab-testing', label: 'A/B testing' },
  { id: 'sdk-client', label: 'SDK client' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="version-control" num="05" title="Version control">
        <p className="text-base leading-relaxed text-brand-navy">
          Each update creates a new version. You can read the history, compare two versions, roll back, and work on
          a branch that merges back into the main line.
        </p>
        <CodeBlock
          lang="TS"
          code={`await registry.update('customer-support', {
  template: updatedTemplate,
  message: 'Added discount guideline for retention',
});

const diff = await registry.diff('customer-support', { from: 'v1', to: 'v2' });

await registry.rollback('customer-support', { to: 'v1', reason: 'Reverted after review' });

await registry.branch('customer-support', { name: 'experiment/shorter-prompt', from: 'v2' });
await registry.merge('customer-support', { from: 'experiment/shorter-prompt', strategy: 'squash' });`}
        />
      </DocSection>

      <DocSection id="environments" num="06" title="Environments">
        <p className="text-base leading-relaxed text-brand-navy">
          Define the environments when you create the registry. Promote a version from one environment to the next.
          A protected environment needs an approver on promotion.
        </p>
        <CodeBlock
          lang="TS"
          code={`const registry = new PromptRegistry({
  storage,
  environments: [
    { name: 'development', label: 'Dev', order: 1 },
    { name: 'staging', label: 'Staging', order: 2 },
    { name: 'production', label: 'Prod', protected: true, order: 3 },
  ],
});

await registry.promote('customer-support', {
  from: 'staging',
  to: 'production',
  version: 'v3',
  approver: 'lead-engineer',
  message: 'Approved after QA sign-off',
});

const prodPrompt = await registry.get('customer-support', { environment: 'production' });`}
        />
      </DocSection>

      <DocSection id="ab-testing" num="07" title="A/B testing">
        <p className="text-base leading-relaxed text-brand-navy">
          Create a test with two or more prompt versions as variants. Each user is assigned a variant, and you record
          metrics against it. getResults reports the sample count, significance, the winner and the p-value.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { ABTest } from '@lov3kaizen/agentsea-prompts';

const test = await registry.createABTest({
  name: 'concise-vs-detailed',
  prompt: 'customer-support',
  variants: [
    { name: 'control', version: 'v1', weight: 0.5 },
    { name: 'treatment', version: 'v2', weight: 0.5 },
  ],
  metrics: ['user_satisfaction', 'resolution_time'],
  confidenceLevel: 0.95,
});

const variant = await test.getVariant({ userId: 'user-123' });
await test.recordMetric('control', 'user_satisfaction', 4.5, { userId: 'user-123' });

const results = await test.getResults();
console.log(results.isSignificant, results.winner, results.pValue);`}
        />
      </DocSection>

      <DocSection id="sdk-client" num="08" title="SDK client">
        <p className="text-base leading-relaxed text-brand-navy">
          Import PromptClient from the client subpath to load prompts at runtime from a registry server. It caches
          results and emits prompt:updated and prompt:loaded events. Set pollInterval to check for changes.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { PromptClient } from '@lov3kaizen/agentsea-prompts/client';

const client = new PromptClient({
  registryUrl: 'https://prompts.example.com',
  apiKey: process.env.PROMPT_API_KEY,
  environment: 'production',
  cache: { enabled: true, ttl: 300 },
});

client.on('prompt:updated', ({ name, version }) => {
  console.log(\`Prompt \${name} updated to \${version}\`);
});

const result = await client.render('customer-support', { company_name: 'Acme Corp' });`}
        />
        <BulletPanel items={['The client also accepts prompts registered locally with client.register, which needs no server.']} />
      </DocSection>
    </PackagePage>
  );
}
