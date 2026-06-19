import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function CostsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Cost Tracking"
        titleGradient="cool"
        description="Real-time AI cost tracking with a 60+ model pricing registry, budget enforcement, and optimization."
      />

      <AlertBox type="info" gradient>
        <span>
          The costs package tracks API calls and spend as they happen, enforces
          budgets at multiple scopes, and surfaces analytics and optimization
          recommendations across every major AI provider.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-costs`}
        </CodeBlock>

        <h2>Quick Start</h2>
        <p>
          Create a cost manager, track an API call, and read back a summary:
        </p>
        <CodeBlock language="typescript">
          {`import {
  CostManager,
  createCostManager,
  BufferStorage,
} from '@lov3kaizen/agentsea-costs';

// Create a cost manager
const costManager = createCostManager({
  currency: 'USD',
  defaultAttribution: {
    environment: 'production',
  },
});

// Track an Anthropic API call
await costManager.trackAnthropicResponse(
  {
    model: 'claude-sonnet-4-6',
    usage: {
      input_tokens: 1500,
      output_tokens: 500,
    },
  },
  {
    attribution: {
      userId: 'user-123',
      feature: 'chat',
    },
  },
);

// Get cost summary
const summary = await costManager.getSummary({
  startDate: new Date('2024-01-01'),
  endDate: new Date(),
});

console.log(\`Total cost: \$\${summary.totalCost.toFixed(4)}\`);
console.log(\`Total tokens: \${summary.totalTokens}\`);
console.log(\`Requests: \${summary.requestCount}\`);`}
        </CodeBlock>

        <h2>Real-time Cost Tracking</h2>
        <p>
          Track any LLM call as it happens, with full attribution to users,
          agents, and features. Use a storage adapter to persist records.
        </p>
        <CodeBlock language="typescript">
          {`import { CostManager, BufferStorage } from '@lov3kaizen/agentsea-costs';

// With persistent storage
const storage = new BufferStorage();
const costManager = new CostManager({ storage });

// Track any LLM call
await costManager.track({
  provider: 'anthropic',
  model: 'claude-sonnet-4-6',
  tokens: {
    inputTokens: 1000,
    outputTokens: 500,
    totalTokens: 1500,
  },
  latencyMs: 1200,
  attribution: {
    userId: 'user-123',
    agentId: 'agent-456',
    feature: 'document-analysis',
  },
});

// Track OpenAI responses directly
await costManager.trackOpenAIResponse({
  model: 'gpt-5.2',
  usage: {
    prompt_tokens: 1000,
    completion_tokens: 500,
    total_tokens: 1500,
  },
});

// Track errors
await costManager.trackError({
  provider: 'openai',
  model: 'gpt-5.2',
  error: 'Rate limit exceeded',
  estimatedInputTokens: 1000,
});`}
        </CodeBlock>

        <h3>Scoped Tracking</h3>
        <p>
          Create scoped trackers so every call inherits a shared attribution
          context.
        </p>
        <CodeBlock language="typescript">
          {`// Create scoped trackers for specific contexts
const userTracker = costManager.scoped({
  userId: 'user-123',
  environment: 'production',
});

// All calls through this tracker include the scope
await userTracker.track({
  provider: 'anthropic',
  model: 'claude-sonnet-4-6',
  tokens: {
    inputTokens: 500,
    outputTokens: 200,
    totalTokens: 700,
  },
});`}
        </CodeBlock>

        <h2>Token Counting</h2>
        <p>
          Count tokens and estimate cost before making a call using{' '}
          <code>TokenCounter</code> backed by the pricing registry.
        </p>
        <CodeBlock language="typescript">
          {`import { TokenCounter, ModelPricingRegistry } from '@lov3kaizen/agentsea-costs';

const registry = new ModelPricingRegistry();
const counter = new TokenCounter(registry);

// Count tokens
const result = await counter.countTokens({
  text: 'Hello, how can I help you today?',
  model: 'claude-sonnet-4-6',
});

console.log(\`Tokens: \${result.tokens}\`);
console.log(\`Estimated cost: \$\${result.estimatedInputCost}\`);

// Estimate cost before making a call
const estimate = await counter.estimateCost({
  input: 'Your prompt here...',
  model: 'claude-sonnet-4-6',
  estimatedOutputTokens: 1000,
});

console.log(\`Estimated total: \$\${estimate.estimatedCost.toFixed(4)}\`);`}
        </CodeBlock>

        <h2>Model Pricing Registry</h2>
        <p>
          The <code>ModelPricingRegistry</code> ships up-to-date pricing for
          60+ models across Anthropic, OpenAI, Google, Mistral, DeepSeek, xAI
          (Grok), and Cohere. Look up pricing, calculate cost, find the cheapest
          qualifying model, and compare options.
        </p>
        <CodeBlock language="typescript">
          {`import { ModelPricingRegistry } from '@lov3kaizen/agentsea-costs';

const registry = new ModelPricingRegistry();

// Get pricing for a model
const pricing = registry.getPricing('anthropic', 'claude-sonnet-4-6');
console.log(\`Input: \$\${pricing.inputPricePerMillion}/1M tokens\`);
console.log(\`Output: \$\${pricing.outputPricePerMillion}/1M tokens\`);

// Calculate cost
const cost = registry.calculateCost(
  'anthropic',
  'claude-sonnet-4-6',
  1000, // input tokens
  500, // output tokens
);
console.log(\`Total: \$\${cost.totalCost.toFixed(4)}\`);

// Find cheapest model with requirements
const cheapest = registry.findCheapestModel({
  requireVision: true,
  requireFunctionCalling: true,
  minContextWindow: 100000,
});

// Compare models
const comparison = registry.comparePricing(
  'claude-sonnet-4-6',
  'gpt-5.2',
  { input: 1000000, output: 500000 }, // sample workload
);

console.log(
  \`\${comparison.cheaperModel} is \${comparison.percentageDiff}% cheaper\`,
);`}
        </CodeBlock>

        <h2>Budget Enforcement &amp; Alerts</h2>
        <p>
          Create budgets, check spend before a call, and react to threshold
          events. Budgets support multiple periods, scopes, warning thresholds,
          and automatic actions.
        </p>
        <CodeBlock language="typescript">
          {`import { BudgetManager, BufferStorage } from '@lov3kaizen/agentsea-costs';

const storage = new BufferStorage();
const budgetManager = new BudgetManager({}, storage);

// Create a budget
const budget = await budgetManager.createBudget({
  name: 'Monthly AI Budget',
  limit: 1000, // \$1000
  period: 'monthly',
  scope: 'global',
  warningThresholds: [50, 80, 90],
  actions: [
    { threshold: 80, action: 'notify', notifyEmails: ['team@example.com'] },
    { threshold: 100, action: 'block' },
  ],
});

// Check budget before making a call
const check = await budgetManager.checkBudget({
  estimatedCost: 0.05,
  attribution: { userId: 'user-123' },
});

if (check.allowed) {
  // Proceed with API call
} else {
  console.log(\`Blocked: \${check.reason}\`);
}

// Get budget usage
const usage = await budgetManager.getUsage(budget.id);
console.log(\`Used: \$\${usage.currentUsage} of \$\${usage.limit}\`);
console.log(\`\${usage.usagePercentage.toFixed(1)}% used\`);

// Listen for budget events
budgetManager.on('budget:warning', (alert) => {
  console.log(\`Warning: \${alert.message}\`);
});

budgetManager.on('budget:exceeded', (alert) => {
  console.log(\`Exceeded: \${alert.message}\`);
});`}
        </CodeBlock>

        <h3>Budget Scopes</h3>
        <p>
          Budgets can be enforced globally or scoped to a user, project, or
          feature.
        </p>
        <CodeBlock language="typescript">
          {`// User-level budget
await budgetManager.createBudget({
  name: 'User Daily Limit',
  limit: 10,
  period: 'daily',
  scope: 'user',
  scopeId: 'user-123',
});

// Project budget
await budgetManager.createBudget({
  name: 'Project Budget',
  limit: 500,
  period: 'monthly',
  scope: 'project',
  scopeId: 'project-abc',
});

// Feature-specific budget
await budgetManager.createBudget({
  name: 'Document Processing',
  limit: 100,
  period: 'weekly',
  scope: 'feature',
  scopeId: 'document-analysis',
});`}
        </CodeBlock>

        <h2>Storage Adapters</h2>
        <p>
          <code>BufferStorage</code> keeps records in memory with automatic
          flushing, so you can persist them to external storage on your own
          schedule.
        </p>
        <CodeBlock language="typescript">
          {`import { BufferStorage } from '@lov3kaizen/agentsea-costs';

const storage = new BufferStorage({
  maxRecords: 10000,
  autoFlushInterval: 30000, // 30 seconds
  onFlush: async (records) => {
    // Persist records to external storage
    console.log(\`Flushing \${records.length} records\`);
  },
});`}
        </CodeBlock>

        <h2>Analytics &amp; Reporting</h2>
        <p>
          Summarize spend, break it down by dimension, chart trends, and find
          your top consumers.
        </p>
        <CodeBlock language="typescript">
          {`// Get cost summary
const summary = await costManager.getSummary({
  startDate: new Date('2024-01-01'),
  endDate: new Date(),
  providers: ['anthropic', 'openai'],
});

// Get costs by dimension
const byModel = await costManager.getCostsByDimension('model', {
  startDate: new Date('2024-01-01'),
});

byModel.forEach((m) => {
  console.log(
    \`\${m.value}: \$\${m.totalCost.toFixed(2)} (\${m.percentage.toFixed(1)}%)\`,
  );
});

// Get cost trends
const trends = await costManager.getCostTrends({
  granularity: 'day',
  startDate: new Date('2024-01-01'),
});

// Get top consumers
const topUsers = await costManager.getTopUsers({ limit: 10 });
const topModels = await costManager.getTopModels({ limit: 5 });
const topFeatures = await costManager.getTopFeatures({ limit: 5 });`}
        </CodeBlock>

        <h2>Event Handling</h2>
        <p>
          Subscribe to cost and budget events to drive notifications and
          downstream logging.
        </p>
        <CodeBlock language="typescript">
          {`costManager.on('cost:recorded', (record) => {
  console.log(
    \`Tracked: \${record.model} - \$\${record.cost.totalCost.toFixed(4)}\`,
  );
});

costManager.on('cost:batch', ({ records }) => {
  console.log(\`Batch saved: \${records.length} records\`);
});

costManager.on('budget:warning', (alert) => {
  sendSlackNotification(alert.message);
});

costManager.on('budget:exceeded', (alert) => {
  sendPagerDutyAlert(alert);
});

costManager.on('error', (error) => {
  console.error('Cost tracking error:', error.message);
});`}
        </CodeBlock>

        <Divider />

        <Section title="Supported Providers">
          <p>
            Pricing and tracking cover the major AI providers out of the box:
          </p>
          <ul>
            <li>
              <strong>Anthropic</strong> — Claude Opus 4.6, Claude Sonnet 4.5,
              Claude Haiku 4.5, and more
            </li>
            <li>
              <strong>OpenAI</strong> — GPT-5, GPT-4.1, GPT-4o, o3, o4-mini, and
              more
            </li>
            <li>
              <strong>Google</strong> — Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini
              2.0 Flash
            </li>
            <li>
              <strong>Mistral</strong> — Mistral Large, Mistral Small, Codestral
            </li>
            <li>
              <strong>DeepSeek</strong> — DeepSeek V3.2 (chat), DeepSeek R1
              (reasoner)
            </li>
            <li>
              <strong>xAI (Grok)</strong> — Grok 3, Grok 3 Fast, Grok 3 Mini
            </li>
            <li>
              <strong>Cohere</strong> — Command R+, Command R
            </li>
          </ul>
        </Section>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/gateway">Route requests with Gateway</Link>
          </li>
          <li>
            <Link href="/docs/observability">Monitor costs in Observability</Link>
          </li>
          <li>
            <Link href="/docs/analytics">Explore Analytics</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
