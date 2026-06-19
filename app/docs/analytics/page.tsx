import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function AnalyticsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Conversation Analytics"
        titleGradient="warm"
        description="Intent classification, sentiment tracking, flow analysis, and actionable insights for AI agent conversations."
      />

      <AlertBox type="info" gradient>
        <span>
          Analytics collects conversations and messages, classifies intent and
          sentiment, analyzes flows, detects anomalies, and surfaces KPIs and
          reports so you can understand and improve agent behavior.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-analytics`}
        </CodeBlock>

        <h2>Quick Start</h2>
        <p>
          Create an <code>Analytics</code> instance with a collector,
          classifiers, and a metrics engine, then track conversations:
        </p>
        <CodeBlock language="typescript">
          {`import {
  Analytics,
  Collector,
  IntentClassifier,
  SentimentAnalyzer,
  MetricsEngine,
} from '@lov3kaizen/agentsea-analytics';

// Create analytics instance
const analytics = new Analytics({
  collector: new Collector(),
  classifiers: [new IntentClassifier(), new SentimentAnalyzer()],
  metrics: new MetricsEngine(),
});

// Track a conversation
analytics.track({
  conversationId: 'conv-123',
  message: { role: 'user', content: 'I need help with my order' },
  metadata: { userId: 'user-456' },
});`}
        </CodeBlock>

        <h2>Collection</h2>
        <p>
          Track conversations, messages, and sessions in real time or in batches
          for high-throughput workloads:
        </p>
        <CodeBlock language="typescript">
          {`import {
  Collector,
  ConversationTracker,
  MessageTracker,
  BatchCollector,
} from '@lov3kaizen/agentsea-analytics/collection';

// Real-time collection
const collector = new Collector({
  batchSize: 100,
  flushInterval: 5000,
});

// Track conversations
const conversationTracker = new ConversationTracker();
conversationTracker.on('conversation:complete', (metrics) => {
  console.log('Duration:', metrics.duration);
  console.log('Messages:', metrics.messageCount);
  console.log('Resolution:', metrics.resolved);
});

// Track individual messages
const messageTracker = new MessageTracker();

// Batch collection for high-throughput
const batchCollector = new BatchCollector({
  maxBatchSize: 500,
  flushInterval: 10000,
});`}
        </CodeBlock>

        <h2>Intent Classification</h2>
        <p>
          Classify user intents with custom taxonomies. The classifier returns a
          predicted intent and a confidence score:
        </p>
        <CodeBlock language="typescript">
          {`import {
  IntentClassifier,
  TaxonomyManager,
} from '@lov3kaizen/agentsea-analytics/classification';

// Intent classification
const intentClassifier = new IntentClassifier({
  intents: ['order-inquiry', 'refund-request', 'product-question', 'complaint'],
});
const intent = await intentClassifier.classify('Where is my order?');
// { intent: 'order-inquiry', confidence: 0.95 }

// Custom taxonomies
const taxonomy = new TaxonomyManager();
taxonomy.define({
  name: 'support-categories',
  categories: ['billing', 'shipping', 'returns', 'technical'],
});`}
        </CodeBlock>

        <h2>Sentiment & Topic Tracking</h2>
        <p>
          Track sentiment across conversations and categorize messages by topic:
        </p>
        <CodeBlock language="typescript">
          {`import {
  SentimentAnalyzer,
  TopicClassifier,
} from '@lov3kaizen/agentsea-analytics/classification';

// Sentiment analysis
const sentimentAnalyzer = new SentimentAnalyzer();
const sentiment = await sentimentAnalyzer.analyze('This product is amazing!');
// { sentiment: 'positive', score: 0.92 }

// Topic classification
const topicClassifier = new TopicClassifier({
  topics: ['billing', 'shipping', 'product', 'technical'],
});`}
        </CodeBlock>

        <h2>Flow Analysis</h2>
        <p>
          Analyze conversation flows, detect drop-off points, measure success
          rates, and build funnels to identify bottlenecks:
        </p>
        <CodeBlock language="typescript">
          {`import {
  FlowAnalyzer,
  DropOffDetector,
  SuccessAnalyzer,
  FunnelAnalyzer,
} from '@lov3kaizen/agentsea-analytics/analysis';

// Analyze conversation flow patterns
const flowAnalyzer = new FlowAnalyzer();
const flows = await flowAnalyzer.analyze(conversations);

// Detect drop-off points
const dropOffDetector = new DropOffDetector();
const dropOffs = await dropOffDetector.detect(conversations);

// Analyze success rates
const successAnalyzer = new SuccessAnalyzer({
  successCriteria: (conv) => conv.resolved === true,
});

// Funnel analysis
const funnelAnalyzer = new FunnelAnalyzer();
const funnel = await funnelAnalyzer.analyze({
  stages: ['greeting', 'problem-identification', 'solution', 'resolution'],
  conversations,
});`}
        </CodeBlock>

        <h2>Topic Clustering</h2>
        <p>
          Discover recurring themes by clustering conversations and detecting
          common patterns:
        </p>
        <CodeBlock language="typescript">
          {`import {
  TopicClusterer,
  PatternDetector,
} from '@lov3kaizen/agentsea-analytics/clustering';

// Cluster conversations by topic
const clusterer = new TopicClusterer();
const clusters = await clusterer.cluster(conversations);

// Detect conversation patterns
const patternDetector = new PatternDetector();
const patterns = await patternDetector.detect(conversations);`}
        </CodeBlock>

        <h2>Anomaly & Trend Detection</h2>
        <p>
          Detect unusual patterns as they happen and track how metrics trend
          over time:
        </p>
        <CodeBlock language="typescript">
          {`import {
  AnomalyDetector,
  TrendAnalyzer,
} from '@lov3kaizen/agentsea-analytics/clustering';

// Anomaly detection
const anomalyDetector = new AnomalyDetector({
  sensitivity: 'medium',
});
anomalyDetector.on('anomaly', (anomaly) => {
  console.log('Anomaly detected:', anomaly.description);
});

// Trend analysis
const trendAnalyzer = new TrendAnalyzer({ window: '7d' });
const trends = await trendAnalyzer.analyze(metrics);`}
        </CodeBlock>

        <h2>Metrics & KPIs</h2>
        <p>
          Record built-in metrics, track KPIs against targets, define custom
          metrics, and build aggregations:
        </p>
        <CodeBlock language="typescript">
          {`import {
  MetricsEngine,
  KPITracker,
  CustomMetrics,
  AggregationBuilder,
} from '@lov3kaizen/agentsea-analytics/metrics';

// Built-in metrics engine
const metrics = new MetricsEngine();
metrics.record('response_time', 1500);
metrics.record('satisfaction_score', 4.5);

// KPI tracking
const kpiTracker = new KPITracker({
  kpis: [
    { name: 'resolution_rate', target: 0.85 },
    { name: 'avg_response_time', target: 2000 },
    { name: 'customer_satisfaction', target: 4.0 },
  ],
});

// Custom metrics
const custom = new CustomMetrics();
custom.define('escalation_rate', {
  type: 'ratio',
  numerator: 'escalated_conversations',
  denominator: 'total_conversations',
});

// Aggregations
const agg = new AggregationBuilder()
  .groupBy('intent')
  .aggregate('count')
  .aggregate('avg', 'duration')
  .build();`}
        </CodeBlock>

        <Divider />

        <h2>Reporting & Dashboards</h2>
        <p>
          Generate dashboard snapshots and export reports in multiple formats:
        </p>
        <CodeBlock language="typescript">
          {`import {
  DashboardData,
  ReportGenerator,
  Exporter,
} from '@lov3kaizen/agentsea-analytics/reporting';

// Dashboard data
const dashboard = new DashboardData({
  timeRange: { start: '2025-01-01', end: '2025-01-31' },
});
const snapshot = await dashboard.getSnapshot();

// Generate reports
const reporter = new ReportGenerator();
const report = await reporter.generate({
  sections: ['summary', 'intents', 'sentiment', 'flows', 'kpis'],
  timeRange: { start: '2025-01-01', end: '2025-01-31' },
});

// Export in multiple formats
const exporter = new Exporter();
await exporter.export(report, { format: 'pdf', path: './report.pdf' });
await exporter.export(report, { format: 'csv', path: './data.csv' });
await exporter.export(report, { format: 'json', path: './report.json' });`}
        </CodeBlock>

        <h2>Storage Backends</h2>
        <p>
          Persist analytics data with memory, SQLite, or PostgreSQL adapters:
        </p>
        <CodeBlock language="typescript">
          {`import {
  MemoryStorageAdapter,
  SQLiteStorageAdapter,
  PostgresStorageAdapter,
} from '@lov3kaizen/agentsea-analytics/storage';

// In-memory (development)
const memoryStore = new MemoryStorageAdapter();

// SQLite (single-server)
const sqliteStore = new SQLiteStorageAdapter({
  path: './analytics.db',
});

// PostgreSQL (production)
const pgStore = new PostgresStorageAdapter({
  connectionString: process.env.DATABASE_URL,
});`}
        </CodeBlock>

        <h2>AgentSea Integration</h2>
        <p>
          Wire analytics into AgentSea agents as middleware or wrap a provider:
        </p>
        <CodeBlock language="typescript">
          {`import {
  createAnalyticsMiddleware,
  createAnalyticsProvider,
} from '@lov3kaizen/agentsea-analytics/integrations';
import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';

// As middleware
const middleware = createAnalyticsMiddleware({
  storage: sqliteStore,
  classifiers: [new IntentClassifier(), new SentimentAnalyzer()],
});

// As a provider wrapper
const provider = createAnalyticsProvider({
  provider: new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  analytics: analyticsInstance,
});`}
        </CodeBlock>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/observability">Monitor Agents with Observability</Link>
          </li>
          <li>
            <Link href="/docs/costs">Track Conversation Costs</Link>
          </li>
          <li>
            <Link href="/docs/evaluate">Evaluate LLM Quality</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
