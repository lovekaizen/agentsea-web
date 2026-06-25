import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function EvaluatePage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="LLM Evaluation"
        titleGradient="cool"
        description="Comprehensive feedback collection and evaluation platform. Build production-ready pipelines with automated metrics, LLM-as-Judge, and human feedback."
      />

      <AlertBox type="info" gradient>
        <span>
          The Evaluate package provides metrics, LLM-as-Judge, human feedback
          collection, and preference dataset generation for RLHF/DPO training.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-evaluate`}
        </CodeBlock>

        <h2>Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 not-prose mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <h2>Quick Start</h2>
        <CodeBlock language="typescript">
          {`import {
  EvaluationPipeline,
  AccuracyMetric,
  RelevanceMetric,
  EvalDataset,
} from '@lov3kaizen/agentsea-evaluate';

// Create metrics
const accuracy = new AccuracyMetric({ type: 'fuzzy' });
const relevance = new RelevanceMetric();

// Create evaluation pipeline
const pipeline = new EvaluationPipeline({
  metrics: [accuracy, relevance],
  parallelism: 5,
});

// Create dataset
const dataset = new EvalDataset({
  items: [
    {
      id: '1',
      input: 'What is the capital of France?',
      expectedOutput: 'Paris',
    },
    {
      id: '2',
      input: 'What is 2 + 2?',
      expectedOutput: '4',
    },
  ],
});

// Run evaluation
const results = await pipeline.evaluate({
  dataset,
  generateFn: async (input) => {
    // Your LLM generation function
    return await myAgent.run(input);
  },
});

console.log(results.summary);
// { passRate: 0.95, avgScore: 0.87, ... }`}
        </CodeBlock>

        <h2>Built-in Metrics</h2>
        <div className="overflow-x-auto not-prose mb-8">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={index}>
                  <td>
                    <code>{metric.name}</code>
                  </td>
                  <td>{metric.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Custom Metrics</h2>
        <CodeBlock language="typescript">
          {`import { BaseMetric, MetricResult, EvaluationInput } from '@lov3kaizen/agentsea-evaluate';

class CustomMetric extends BaseMetric {
  readonly type = 'custom';
  readonly name = 'my-metric';

  async evaluate(input: EvaluationInput): Promise<MetricResult> {
    // Your evaluation logic
    const score = calculateScore(input.output, input.expectedOutput);

    return {
      metric: this.name,
      score,
      explanation: \`Score: \${score}\`,
    };
  }
}`}
        </CodeBlock>

        <h2>LLM-as-Judge</h2>

        <h3>Rubric-Based Evaluation</h3>
        <p>Use LLMs to evaluate responses with custom rubrics:</p>
        <CodeBlock language="typescript">
          {`import { RubricJudge } from '@lov3kaizen/agentsea-evaluate';

const judge = new RubricJudge({
  provider: anthropicProvider,
  rubric: {
    criteria: 'Response Quality',
    levels: [
      { score: 1, description: 'Poor - Incorrect or irrelevant' },
      { score: 2, description: 'Fair - Partially correct' },
      { score: 3, description: 'Good - Correct but incomplete' },
      { score: 4, description: 'Very Good - Correct and complete' },
      { score: 5, description: 'Excellent - Correct, complete, and well-explained' },
    ],
  },
});

const result = await judge.evaluate({
  input: 'Explain quantum entanglement',
  output: response,
});`}
        </CodeBlock>

        <h3>Comparative Evaluation</h3>
        <p>Compare two responses head-to-head:</p>
        <CodeBlock language="typescript">
          {`import { ComparativeJudge } from '@lov3kaizen/agentsea-evaluate';

const judge = new ComparativeJudge({
  provider: openaiProvider,
  criteria: ['accuracy', 'helpfulness', 'clarity'],
});

const result = await judge.compare({
  input: 'Summarize this article',
  responseA: modelAOutput,
  responseB: modelBOutput,
});
// { winner: 'A', reasoning: '...', criteriaScores: {...} }`}
        </CodeBlock>

        <h2>Human Feedback</h2>

        <h3>Rating Collector</h3>
        <p>Collect ratings from human annotators:</p>
        <CodeBlock language="typescript">
          {`import { RatingCollector } from '@lov3kaizen/agentsea-evaluate/feedback';

const collector = new RatingCollector({
  scale: 5,
  criteria: ['accuracy', 'helpfulness', 'clarity'],
});

// Collect feedback
await collector.collect({
  itemId: 'response-123',
  input: 'What is ML?',
  output: 'Machine Learning is...',
  annotatorId: 'user-1',
  ratings: {
    accuracy: 4,
    helpfulness: 5,
    clarity: 4,
  },
  comment: 'Good explanation',
});

// Get aggregated scores
const stats = collector.getStatistics('response-123');`}
        </CodeBlock>

        <h3>Preference Collection</h3>
        <p>Collect A/B preferences for RLHF/DPO training:</p>
        <CodeBlock language="typescript">
          {`import { PreferenceCollector } from '@lov3kaizen/agentsea-evaluate/feedback';

const collector = new PreferenceCollector();

// Collect A/B preferences
await collector.collect({
  input: 'Explain recursion',
  responseA: '...',
  responseB: '...',
  preference: 'A',
  annotatorId: 'user-1',
  reason: 'More concise explanation',
});

// Export for RLHF/DPO training
const dataset = collector.exportForDPO();`}
        </CodeBlock>

        <h2>Datasets</h2>

        <h3>Create Dataset</h3>
        <CodeBlock language="typescript">
          {`import { EvalDataset } from '@lov3kaizen/agentsea-evaluate/datasets';

const dataset = new EvalDataset({
  name: 'qa-benchmark',
  items: [
    {
      id: '1',
      input: 'Question 1',
      expectedOutput: 'Answer 1',
      context: ['Relevant context...'],
      tags: ['factual', 'science'],
    },
  ],
});

// Filter and sample
const subset = dataset
  .filter(item => item.tags?.includes('science'))
  .sample(100);

// Split for train/test
const [train, test] = dataset.split(0.8);`}
        </CodeBlock>

        <h3>HuggingFace Integration</h3>

        <h4>Import from the Hub</h4>
        <p>
          <code>EvalDataset.fromHuggingFace</code> loads rows from the public
          HuggingFace{' '}
          <a href="https://datasets-server.huggingface.co">datasets-server</a>{' '}
          REST API — no SDK dependency is required. Rows are mapped onto eval
          items using the configured field names.
        </p>
        <CodeBlock language="typescript">
          {`import { EvalDataset } from '@lov3kaizen/agentsea-evaluate';

const dataset = await EvalDataset.fromHuggingFace('squad', {
  split: 'validation', // defaults to 'train'
  subset: 'default', // datasets-server config / subset, defaults to 'default'
  inputField: 'question', // defaults to 'input'
  outputField: 'answers', // defaults to 'output'
  contextField: 'context', // optional, maps to item.context[]
  limit: 1000, // defaults to 100
});

console.log(dataset.size);
console.log(dataset.getItems()[0]);`}
        </CodeBlock>
        <AlertBox type="info">
          <span>
            To read gated or private datasets, set the <code>HF_TOKEN</code>{' '}
            environment variable. It is sent as a bearer token on the
            datasets-server request.
          </span>
        </AlertBox>

        <h4>Export to the Hub</h4>
        <p>
          <code>DatasetExporter</code> pushes a preference dataset to the
          HuggingFace Hub as DPO-format JSONL, generating a dataset card
          (README) alongside the data. Hub upload uses the optional{' '}
          <code>@huggingface/hub</code> package and requires a write-scoped
          token.
        </p>
        <CodeBlock language="typescript">
          {`import { DatasetExporter } from '@lov3kaizen/agentsea-evaluate/datasets';

const exporter = new DatasetExporter();

const result = await exporter.exportPreferences(preferenceDataset, {
  format: 'huggingface',
  formatOptions: {
    name: 'my-org/preference-dataset', // target Hub repo
    token: process.env.HF_TOKEN, // write-scoped HF token
    private: true,
    license: 'mit',
    tags: ['preference', 'dpo', 'rlhf'],
  },
});

console.log(result.url);
// https://huggingface.co/datasets/my-org/preference-dataset`}
        </CodeBlock>
        <AlertBox type="info">
          <span>
            <code>name</code> and <code>token</code> may also be supplied at the
            top level as <code>repoName</code> and <code>token</code> on the
            export options.
          </span>
        </AlertBox>

        <h2>Continuous Evaluation</h2>
        <p>Monitor production quality with automated evaluation pipelines:</p>

        <CodeBlock language="typescript">
          {`import { ContinuousEvaluator } from '@lov3kaizen/agentsea-evaluate/continuous';

const evaluator = new ContinuousEvaluator({
  metrics: [accuracy, relevance, toxicity],
  sampleRate: 0.1, // Evaluate 10% of requests
  alertThresholds: {
    accuracy: 0.8,
    toxicity: 0.1,
  },
});

// Set up alerts
evaluator.on('alert', (alert) => {
  console.error(\`Quality alert: \${alert.metric} below threshold\`);
  notifyOncall(alert);
});

// Log production interactions
await evaluator.log({
  input: userQuery,
  output: agentResponse,
  expectedOutput: groundTruth, // Optional
});`}
        </CodeBlock>

        <h3>Alert Channels</h3>
        <p>
          The <code>AlertManager</code> delivers quality-degradation alerts over
          multiple channels. Define rules per metric, then attach one or more
          channels. Webhook, Slack, email, and PagerDuty are all supported.
        </p>
        <CodeBlock language="typescript">
          {`import { AlertManager } from '@lov3kaizen/agentsea-evaluate/continuous';

const alerts = new AlertManager({
  rules: {
    accuracy: { metric: 'accuracy', threshold: 0.8, direction: 'below', severity: 'critical' },
    toxicity: { metric: 'toxicity', threshold: 0.1, direction: 'above', severity: 'warning' },
  },
  cooldownMs: 300_000, // suppress repeats for 5 minutes (default)
  channels: [
    { type: 'slack', webhook: 'https://hooks.slack.com/services/...' },
    { type: 'webhook', webhook: 'https://example.com/alerts' },
  ],
});

// Feed metric values; a breached rule fires the channels.
alerts.check('accuracy', 0.74);`}
        </CodeBlock>

        <h4>Email (SMTP)</h4>
        <p>
          The <code>email</code> channel sends alerts over SMTP using the
          optional <code>nodemailer</code> package (install it to enable this
          channel). It requires <code>to</code> recipients and an{' '}
          <code>smtp.host</code>; the <code>from</code> address defaults to the
          SMTP auth user.
        </p>
        <CodeBlock language="typescript">
          {`const channel = {
  type: 'email',
  to: ['oncall@example.com', 'quality@example.com'],
  from: 'alerts@example.com', // optional, defaults to smtp.auth.user
  smtp: {
    host: 'smtp.example.com',
    port: 587, // defaults to 587
    secure: false, // defaults to false
    auth: { user: 'apikey', pass: process.env.SMTP_PASSWORD },
  },
};`}
        </CodeBlock>

        <h4>PagerDuty</h4>
        <p>
          The <code>pagerduty</code> channel triggers an incident through the
          PagerDuty{' '}
          <a href="https://developer.pagerduty.com/docs/events-api-v2/overview/">
            Events API v2
          </a>{' '}
          enqueue endpoint. Provide an integration{' '}
          <code>routingKey</code> (it falls back to <code>apiKey</code> when not
          set). Repeated alerts for the same metric are de-duplicated into a
          single incident.
        </p>
        <CodeBlock language="typescript">
          {`const channel = {
  type: 'pagerduty',
  routingKey: process.env.PAGERDUTY_ROUTING_KEY, // Events API v2 integration key
};`}
        </CodeBlock>
        <AlertBox type="info">
          <span>
            Alert severity (<code>info</code>, <code>warning</code>,{' '}
            <code>critical</code>) comes from the matching rule and is mapped to
            the PagerDuty severity on each event.
          </span>
        </AlertBox>

        <h2>API Reference</h2>

        <h3>EvaluationPipeline</h3>
        <CodeBlock language="typescript">
          {`interface EvaluationPipelineConfig {
  metrics: MetricInterface[];
  llmJudge?: JudgeInterface;
  parallelism?: number;
  timeout?: number;
  retries?: number;
}

// Methods
pipeline.evaluate(options: PipelineEvaluationOptions): Promise<PipelineEvaluationResult>`}
        </CodeBlock>

        <h3>EvalDataset</h3>
        <CodeBlock language="typescript">
          {`interface EvalDatasetItem {
  id: string;
  input: string;
  expectedOutput?: string;
  context?: string[];
  reference?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

// Methods
dataset.getItems(): EvalDatasetItem[]
dataset.filter(predicate): EvalDataset
dataset.sample(count): EvalDataset
dataset.split(ratio): [EvalDataset, EvalDataset]`}
        </CodeBlock>

        <h3>PipelineEvaluationResult</h3>
        <CodeBlock language="typescript">
          {`interface PipelineEvaluationResult {
  results: SingleEvaluationResult[];
  metrics: MetricsSummary;
  failures: FailureAnalysis[];
  summary: EvaluationSummary;
  exportJSON(): string;
  exportCSV(): string;
}`}
        </CodeBlock>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/guardrails">Add Safety Guardrails</Link>
          </li>
          <li>
            <Link href="/docs/observability">Monitor Evaluation Metrics</Link>
          </li>
          <li>
            <Link href="/docs/crews">Evaluate Multi-Agent Crews</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const features = [
  {
    icon: '📊',
    name: 'Built-in Metrics',
    description: 'Accuracy, relevance, coherence, toxicity, and more',
  },
  {
    icon: '⚖️',
    name: 'LLM-as-Judge',
    description: 'Rubric-based and comparative scoring',
  },
  {
    icon: '👥',
    name: 'Human Feedback',
    description: 'Ratings, rankings, and corrections',
  },
  {
    icon: '📦',
    name: 'Dataset Management',
    description: 'Create and import datasets with HuggingFace integration',
  },
  {
    icon: '🔄',
    name: 'Continuous Evaluation',
    description: 'Monitor production quality with alerts',
  },
  {
    icon: '🎯',
    name: 'Preference Learning',
    description: 'Generate datasets for RLHF/DPO training',
  },
];

const metrics = [
  { name: 'AccuracyMetric', description: 'Exact, fuzzy, or semantic match against expected output' },
  { name: 'RelevanceMetric', description: 'How relevant the response is to the input' },
  { name: 'CoherenceMetric', description: 'Logical flow and consistency of the response' },
  { name: 'ToxicityMetric', description: 'Detection of harmful or inappropriate content' },
  { name: 'FaithfulnessMetric', description: 'Factual accuracy relative to provided context (RAG)' },
  { name: 'ContextRelevanceMetric', description: 'Relevance of retrieved context (RAG)' },
  { name: 'FluencyMetric', description: 'Grammar, spelling, and readability' },
  { name: 'ConcisenessMetric', description: 'Brevity without losing important information' },
  { name: 'HelpfulnessMetric', description: 'How helpful the response is to the user' },
  { name: 'SafetyMetric', description: 'Detection of unsafe or harmful outputs' },
];
