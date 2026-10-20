import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import { ApiList, ApiRow } from '../../../components/docs/ApiList';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-analytics | AgentSea',
  description:
    'Conversation analytics for AI agents, covering intent classification, flow analysis and sentiment tracking.',
};

const pkg: PackageDoc = {
  slug: 'analytics',
  name: '@lov3kaizen/agentsea-analytics',
  summary:
    'Conversation analytics for AI agents, covering intent classification, flow analysis and sentiment tracking.',
  version: '1.2.1',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-analytics',
  example: {
    lang: 'TS',
    code: `import { Analytics, IntentClassifier, SentimentAnalyzer } from '@lov3kaizen/agentsea-analytics';

const analytics = new Analytics();
const conversation = await analytics.startConversation({ userId: 'user-456' });
await analytics.addMessage(conversation.id, {
  conversationId: conversation.id,
  role: 'user',
  content: 'I need help with my order',
});

const intent = new IntentClassifier().classify('I need help with my order');
const sentiment = new SentimentAnalyzer().analyze('I need help with my order');
console.log(intent.primary, sentiment.label);`,
  },
  api: [
    {
      name: 'Analytics.startConversation(options) / addMessage(conversationId, message)',
      description: 'Starts a conversation and records each message in it.',
    },
    {
      name: 'IntentClassifier({ taxonomy }).classify(text)',
      description: 'Returns the primary intent and its confidence.',
    },
    {
      name: 'SentimentAnalyzer().analyze(text)',
      description: 'Returns a score, label and confidence for a text.',
    },
    {
      name: 'MetricsEngine.registerMetric(definition) / KPITracker.registerKPI(definition)',
      description: 'Defines custom metrics and KPIs. KPITracker.evaluate checks a KPI against its target.',
    },
    {
      name: 'ReportGenerator.generate(options) / Exporter.exportReport(report, format)',
      description: 'Builds a report from stored data and exports it as json, csv, markdown or html.',
    },
  ],
  caveats: [
    'The package does not say whether intent and sentiment classifiers use rules, a model or an LLM. Check results on your own data.',
    'IntentClassifier takes a taxonomy option, not intents. Pass your own intent taxonomy.',
    'The README shows PDF export, but Exporter accepts only json, csv, markdown and html.',
    'SQLite and Postgres storage need the optional peers better-sqlite3 and pg.',
  ],
};

const toc = [
  { id: 'storage', label: 'Storage backends' },
  { id: 'sessions', label: 'Sessions' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="storage" num="05" title="Storage backends">
        <p className="text-base leading-relaxed text-brand-navy">
          Analytics keeps data in memory unless you pass a storage adapter. Use the memory adapter for development, SQLite for one server, and Postgres for production.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Analytics, SQLiteStorageAdapter, PostgresStorageAdapter } from '@lov3kaizen/agentsea-analytics';

const sqlite = new Analytics({ storage: new SQLiteStorageAdapter({ filename: './analytics.db' }) });
const postgres = new Analytics({
  storage: new PostgresStorageAdapter({ connectionString: process.env.DATABASE_URL }),
});`}
        />
      </DocSection>

      <DocSection id="sessions" num="06" title="Sessions">
        <p className="text-base leading-relaxed text-brand-navy">
          Sessions group events under one visit. <code>getSession(id)</code> returns a session only while it is active.
        </p>
        <ApiList>
          <ApiRow name="Analytics.startSession(options) / endSession(id) / touchSession(id)">Opens, closes and refreshes a session.</ApiRow>
          <ApiRow name="Analytics.getSession(id)">Returns an active session from memory, or null.</ApiRow>
        </ApiList>
      </DocSection>
    </PackagePage>
  );
}
