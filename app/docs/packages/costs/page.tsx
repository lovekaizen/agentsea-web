import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import { ApiList, ApiRow } from '../../../components/docs/ApiList';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-costs | AgentSea',
  description:
    'Records LLM usage costs with attribution to users or features, and enforces spending budgets.',
};

const pkg: PackageDoc = {
  slug: 'costs',
  name: '@lov3kaizen/agentsea-costs',
  summary: 'Records LLM usage costs with attribution to users or features, and enforces spending budgets.',
  onNpm: true,
  install: 'npm install @lov3kaizen/agentsea-costs',
  example: {
    lang: 'TS',
    code: `import { createCostManager } from '@lov3kaizen/agentsea-costs';

const costManager = createCostManager({ currency: 'USD', defaultAttribution: { environment: 'production' } });
await costManager.trackAnthropicResponse(
  { model: 'claude-sonnet-4-6', usage: { input_tokens: 1500, output_tokens: 500 } },
  { attribution: { userId: 'user-123', feature: 'chat' } },
);
const summary = await costManager.getSummary({ startDate: new Date('2024-01-01'), endDate: new Date() });
console.log('Total cost: $' + summary.totalCost.toFixed(4));`,
  },
  api: [
    {
      name: 'CostManager.track(options) / trackOpenAIResponse(response)',
      description: 'Records the cost of one model call.',
    },
    { name: 'CostManager.getSummary(query)', description: 'Returns total cost for a date range.' },
    {
      name: 'CostManager.getTopUsers() / getTopModels() / getTopFeatures()',
      description: 'Lists the highest-cost users, models or features.',
    },
    {
      name: 'BudgetManager.createBudget({ name, limit, period, scope, actions })',
      description: 'Defines a budget with warning thresholds and actions.',
    },
    {
      name: 'ModelPricingRegistry.calculateCost(provider, model, inputTokens, outputTokens)',
      description: "Works out the cost of a call from a model's pricing.",
    },
  ],
  caveats: [
    'Records are held in memory by default. To persist them, pass an onFlush handler that writes to your store.',
    'Token counting uses tiktoken for OpenAI models only. No counting method is documented for other providers.',
    'The supported-models table lists older Claude models than the examples. Check pricing before relying on it.',
    'Requires Node.js 20 or later. SQLite, Postgres, Stripe and NestJS support are optional peer dependencies.',
  ],
};

const toc = [
  { id: 'scoped', label: 'Scoped tracking' },
  { id: 'budgets', label: 'Budgets' },
  { id: 'reports', label: 'Reports and events' },
  { id: 'storage', label: 'Storage' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="scoped" num="05" title="Scoped tracking">
        <p className="text-base leading-relaxed text-brand-navy">
          A scoped tracker adds the same attribution to every call it records. Use one per user, project or feature.
        </p>
        <CodeBlock
          lang="TS"
          code={`const userTracker = costManager.scoped({ userId: 'user-123', environment: 'production' });
await userTracker.trackAnthropicResponse({
  model: 'claude-sonnet-4-6',
  usage: { input_tokens: 500, output_tokens: 200 },
});`}
        />
        <ApiList>
          <ApiRow name="CostManager.trackError(options)">Records a failed call, with the error message and the estimated input tokens.</ApiRow>
          <ApiRow name="CostManager.countTokens(...) / estimateCost(...)">Counts tokens and estimates a call&apos;s cost before you make it.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="budgets" num="06" title="Budgets">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>BudgetManager</code> is a separate class. Pass it the same storage you use for records, then create budgets with a period, a scope and warning thresholds.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { BudgetManager, BufferStorage } from '@lov3kaizen/agentsea-costs';

const budgets = new BudgetManager({}, new BufferStorage());
const budget = await budgets.createBudget({
  name: 'Monthly AI Budget',
  limit: 1000,
  period: 'monthly',
  scope: 'global',
  warningThresholds: [50, 80, 90],
});

budgets.on('budget:warning', (alert) => console.log('Warning:', alert.message));
budgets.on('budget:exceeded', (alert) => console.log('Exceeded:', alert.message));`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Scopes other than <code>global</code> take a <code>scopeId</code>, for example one budget per user with <code>scope: &apos;user&apos;</code> and <code>scopeId: &apos;user-123&apos;</code>.
        </p>
      </DocSection>

      <DocSection id="reports" num="07" title="Reports and events">
        <CodeBlock
          lang="TS"
          code={`const topModels = await costManager.getTopModels({ limit: 5 });
const topUsers = await costManager.getTopUsers({ limit: 10 });

costManager.on('cost:recorded', (record) => {
  console.log('Tracked:', record.model, record.cost.totalCost);
});
costManager.on('error', (error) => console.error('Cost tracking error:', error.message));`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          <code>getCostsByDimension</code> and <code>getCostTrends</code> break spend down by model, user or feature, and over time.
        </p>
      </DocSection>

      <DocSection id="storage" num="08" title="Storage">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>BufferStorage</code> keeps records in memory and flushes them on a timer or when it is full. Your <code>onFlush</code> handler writes them to your own store.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { BufferStorage } from '@lov3kaizen/agentsea-costs';

const storage = new BufferStorage({
  maxRecords: 10000,
  autoFlushInterval: 30000, // 30 seconds
  onFlush: async (records) => {
    // Persist records to your database
  },
});`}
        />
      </DocSection>
    </PackagePage>
  );
}
