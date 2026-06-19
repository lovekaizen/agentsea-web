import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function PromptsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Prompt Management"
        titleGradient="purple"
        description="Self-hosted prompt management with Git-like version control, environment promotion, A/B testing, and team collaboration."
      />

      <AlertBox type="info" gradient>
        <span>
          Treat prompts as first-class software artifacts with proper DevOps
          workflows: versioning with diffs and history, environment promotion,
          A/B testing, and team collaboration.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-prompts`}
        </CodeBlock>

        <h2>Quick Start</h2>
        <p>
          Create a registry backed by file storage, then create and render a
          prompt with typed variables:
        </p>
        <CodeBlock language="typescript">
          {`import { PromptRegistry, FileStorage } from '@lov3kaizen/agentsea-prompts';

// Create registry with file storage
const registry = new PromptRegistry({
  storage: new FileStorage({ path: './prompts' }),
  defaultEnvironment: 'development',
});

await registry.initialize();

// Create a prompt
const prompt = await registry.create({
  name: 'customer-support',
  description: 'Main customer support system prompt',
  template: \`You are a helpful customer support agent for {{company_name}}.

Your responsibilities:
- Answer questions about {{product_name}}
- Help with billing and account issues
- Escalate complex issues to human agents

Customer name: {{customer_name}}
Account type: {{account_type}}\`,
  variables: {
    company_name: { type: 'string', required: true },
    product_name: { type: 'string', required: true },
    customer_name: { type: 'string', required: true },
    account_type: { type: 'enum', values: ['free', 'pro', 'enterprise'] },
  },
  metadata: {
    author: 'product-team',
    tags: ['support', 'customer-facing'],
  },
});

// Render with variables
const rendered = await registry.render('customer-support', {
  company_name: 'Acme Corp',
  product_name: 'Widget Pro',
  customer_name: 'John Doe',
  account_type: 'pro',
});

console.log(rendered.content);`}
        </CodeBlock>

        <h2>Version Control</h2>
        <p>
          Every change is tracked Git-style. Update prompts to create new
          versions, inspect history, compare diffs, roll back, and branch for
          experiments.
        </p>

        <h3>Update Prompts</h3>
        <p>Each update creates a new version with a commit message:</p>
        <CodeBlock language="typescript">
          {`// Update creates a new version
const updated = await registry.update('customer-support', {
  template: \`\${existingTemplate}

Additional guideline:
- Offer a 10% discount for frustrated customers\`,
  message: 'Added discount guideline for retention',
});

console.log(\`Updated to \${updated.version}\`); // v2`}
        </CodeBlock>

        <h3>View History</h3>
        <CodeBlock language="typescript">
          {`const history = await registry.history('customer-support');

for (const version of history) {
  console.log(\`\${version.version}: \${version.message} (\${version.author})\`);
}`}
        </CodeBlock>

        <h3>Compare Versions</h3>
        <p>Diff any two versions for additions, deletions, and similarity:</p>
        <CodeBlock language="typescript">
          {`const diff = await registry.diff('customer-support', {
  from: 'v1',
  to: 'v2',
});

console.log(\`+\${diff.additions} -\${diff.deletions}\`);
console.log(\`Similarity: \${(diff.similarity * 100).toFixed(1)}%\`);`}
        </CodeBlock>

        <h3>Rollback</h3>
        <CodeBlock language="typescript">
          {`await registry.rollback('customer-support', {
  to: 'v1',
  reason: 'User complaints about new guideline',
});`}
        </CodeBlock>

        <h3>Branching &amp; Merging</h3>
        <p>Branch off to experiment, then merge back to main:</p>
        <CodeBlock language="typescript">
          {`// Create a branch for experimentation
await registry.branch('customer-support', {
  name: 'experiment/shorter-prompt',
  from: 'v2',
});

// Make changes on the branch...

// Merge back to main
await registry.merge('customer-support', {
  from: 'experiment/shorter-prompt',
  strategy: 'squash',
  message: 'Merged shorter prompt experiment',
});`}
        </CodeBlock>

        <h2>Environment Promotion</h2>
        <p>
          Define ordered environments and promote prompts through a Dev →
          Staging → Production workflow with approvals on protected
          environments.
        </p>

        <h3>Define Environments</h3>
        <CodeBlock language="typescript">
          {`const registry = new PromptRegistry({
  storage,
  environments: [
    { name: 'development', label: 'Dev', order: 1 },
    { name: 'staging', label: 'Staging', order: 2 },
    { name: 'production', label: 'Prod', protected: true, order: 3 },
  ],
});`}
        </CodeBlock>

        <h3>Promote Prompts</h3>
        <CodeBlock language="typescript">
          {`// Promote from dev to staging
await registry.promote('customer-support', {
  from: 'development',
  to: 'staging',
  version: 'v3',
  message: 'Ready for QA testing',
});

// Promote to production (requires approver for protected env)
await registry.promote('customer-support', {
  from: 'staging',
  to: 'production',
  version: 'v3',
  approver: 'lead-engineer',
  message: 'Approved after QA sign-off',
});`}
        </CodeBlock>

        <h3>Get Prompt by Environment</h3>
        <CodeBlock language="typescript">
          {`const prodPrompt = await registry.get('customer-support', {
  environment: 'production',
});`}
        </CodeBlock>

        <h2>Templating &amp; Variables</h2>
        <p>
          Prompts use Handlebars-based templates with typed variables, reusable
          partials, and built-in helpers.
        </p>

        <h3>Variables</h3>
        <p>Variables are validated and can declare defaults:</p>
        <CodeBlock language="typescript">
          {`const prompt = await registry.create({
  name: 'greeting',
  template: 'Hello, {{name}}! Welcome to {{company}}.',
  variables: {
    name: { type: 'string', required: true },
    company: { type: 'string', default: 'Acme Corp' },
  },
});

// Render with validation
const result = await registry.render('greeting', { name: 'Alice' });
// "Hello, Alice! Welcome to Acme Corp."`}
        </CodeBlock>

        <h3>Partials (Reusable Snippets)</h3>
        <p>Share common prompt sections across many prompts:</p>
        <CodeBlock language="typescript">
          {`import { Partial } from '@lov3kaizen/agentsea-prompts';

// Register partials
await registry.registerPartial(
  new Partial({
    name: 'safety-guidelines',
    template: \`Safety Guidelines:
- Never provide harmful information
- Decline requests for illegal activities
- Protect user privacy at all times\`,
  }),
);

// Use in prompts
const prompt = await registry.create({
  name: 'assistant',
  template: \`You are a helpful assistant.

{{> safety-guidelines}}

Task: {{task}}\`,
});`}
        </CodeBlock>

        <h3>Built-in Helpers</h3>
        <CodeBlock language="typescript">
          {`// Available helpers
const template = \`
{{upper name}}           // JOHN
{{lower name}}           // john
{{capitalize name}}      // John
{{truncate text 50}}     // Truncated text...
{{default value "N/A"}}  // Default if undefined
{{json object}}          // JSON stringified
{{join array ", "}}      // Array to string
{{date timestamp "iso"}} // Date formatting
{{number value 2}}       // Number with decimals
\`;`}
        </CodeBlock>

        <h2>A/B Testing</h2>
        <p>
          Run experiments across prompt versions with weighted variants,
          consistent user assignment, and statistical significance analysis.
        </p>

        <h3>Create Test</h3>
        <CodeBlock language="typescript">
          {`import { ABTest } from '@lov3kaizen/agentsea-prompts';

const test = await registry.createABTest({
  name: 'concise-vs-detailed',
  prompt: 'customer-support',
  variants: [
    { name: 'control', version: 'v1', weight: 0.5 },
    { name: 'treatment', version: 'v2', weight: 0.5 },
  ],
  metrics: ['user_satisfaction', 'resolution_time'],
  targetSampleSize: 1000,
  confidenceLevel: 0.95,
});`}
        </CodeBlock>

        <h3>Assign Variants &amp; Record Metrics</h3>
        <CodeBlock language="typescript">
          {`// Get variant for user (consistent assignment)
const variant = await test.getVariant({ userId: 'user-123' });
const prompt = await registry.get('customer-support', {
  version: variant.version,
});

// Record an outcome metric
await test.recordMetric('control', 'user_satisfaction', 4.5, {
  userId: 'user-123',
});`}
        </CodeBlock>

        <h3>Get Results</h3>
        <CodeBlock language="typescript">
          {`const results = await test.getResults();

console.log('Total samples:', results.totalSamples);
console.log('Significant?', results.isSignificant);
console.log('Winner:', results.winner);
console.log('P-value:', results.pValue);
console.log('Recommendation:', results.recommendation);`}
        </CodeBlock>

        <h2>SDK Client</h2>
        <p>
          Load and render prompts at runtime with caching and auto-refresh, or
          register prompts locally with no API.
        </p>

        <h3>Runtime Loading</h3>
        <CodeBlock language="typescript">
          {`import { PromptClient } from '@lov3kaizen/agentsea-prompts/client';

const client = new PromptClient({
  registryUrl: 'https://prompts.example.com',
  apiKey: process.env.PROMPT_API_KEY,
  environment: 'production',
  cache: {
    enabled: true,
    ttl: 300, // 5 minutes
  },
});

// Load and render prompt
const result = await client.render('customer-support', {
  company_name: 'Acme Corp',
  customer_name: 'John',
});`}
        </CodeBlock>

        <h3>Local Prompts &amp; Auto-Refresh</h3>
        <CodeBlock language="typescript">
          {`// Register local prompts (no API needed)
client.register('greeting', 'Hello, {{name}}!', {
  variables: { name: { type: 'string', required: true } },
});

const result = await client.render('greeting', { name: 'Alice' });

// Listen for updates
client.on('prompt:updated', ({ name, version }) => {
  console.log(\`Prompt \${name} updated to \${version}\`);
});`}
        </CodeBlock>

        <h2>Team Collaboration</h2>
        <p>
          Request reviews on prompt changes and inspect a full audit log of who
          changed what and when.
        </p>
        <CodeBlock language="typescript">
          {`// Request a review before promoting
const review = await registry.requestReview('customer-support', {
  reviewers: ['lead-engineer', 'product-manager'],
  message: 'Please review the updated retention guideline',
});

// Inspect the audit log
const log = await registry.getAuditLog({ limit: 50 });

for (const entry of log) {
  console.log(\`\${entry.action} on \${entry.target} by \${entry.actor}\`);
}`}
        </CodeBlock>

        <h2>AgentSea Integration</h2>
        <p>
          Wire managed prompts directly into agents so prompt updates propagate
          automatically.
        </p>
        <CodeBlock language="typescript">
          {`import { Agent } from '@lov3kaizen/agentsea-core';
import {
  PromptProvider,
  createSystemPrompt,
} from '@lov3kaizen/agentsea-prompts';

const provider = new PromptProvider({
  registry,
  environment: 'production',
  autoRefresh: true,
});

// Create agent with managed prompt
const agent = new Agent({
  name: 'support-agent',
  model: 'claude-sonnet-4-6',
  provider: 'anthropic',
  // Dynamic prompt from registry
  systemPrompt: provider.dynamic('customer-support', {
    company_name: 'Acme Corp',
    product_name: 'Widget Pro',
  }),
});

// Or use the helper function
const agent2 = new Agent({
  systemPrompt: createSystemPrompt(provider, 'customer-support', {
    company_name: 'Acme Corp',
  }),
});

// Prompt updates automatically when the registry changes!`}
        </CodeBlock>

        <h2>Storage Adapters</h2>
        <p>
          Choose a backend that fits your workflow, from Git-friendly files to
          in-memory testing.
        </p>
        <CodeBlock language="typescript">
          {`import { FileStorage, BufferStorage } from '@lov3kaizen/agentsea-prompts';

// File storage (Git-friendly)
const fileStorage = new FileStorage({
  path: './prompts',
  format: 'json',
});

// In-memory storage (testing)
const bufferStorage = new BufferStorage();`}
        </CodeBlock>

        <Divider />

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/evaluate">Evaluate Prompt Quality</Link>
          </li>
          <li>
            <Link href="/docs/structured-output">
              Generate Structured Output
            </Link>
          </li>
          <li>
            <Link href="/docs/observability">Monitor Prompts in Production</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
