import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Observability | AgentSea',
  description:
    'Logging, metrics and tracing in @lov3kaizen/agentsea-core: the Logger, MetricsCollector and Tracer classes, and how to wire them around agent runs.',
};

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'logging', label: 'Logging' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'tracing', label: 'Tracing' },
  { id: 'forwarding', label: 'Forwarding to monitoring' },
  { id: 'performance', label: 'Performance monitoring' },
  { id: 'related-packages', label: 'Related packages' },
  { id: 'best-practices', label: 'Best practices' },
  { id: 'next-steps', label: 'Next steps' },
];

export default function ObservabilityPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Observability"
      lead="Log, measure and trace agent runs with the logging, metrics and tracing classes in @lov3kaizen/agentsea-core."
      active="concepts"
      toc={toc}
    >
      <DocSection id="overview" num="01" title="Overview">
        <p className="text-base leading-relaxed text-brand-navy">
          Core provides three building blocks:
        </p>
        <ApiList>
          <ApiRow name="Logger">Structured logging on top of winston, to the console and optionally a file.</ApiRow>
          <ApiRow name="MetricsCollector / globalMetrics">
            Records one entry per agent run, with latency, tokens and success. Summarizes and notifies subscribers.
          </ApiRow>
          <ApiRow name="Tracer / globalTracer">Spans with attributes, events and durations, grouped by trace ID.</ApiRow>
        </ApiList>
        <Callout kind="note">
          The agent does not record metrics or spans on its own. Wrap the calls you want measured, as the examples
          below do.
        </Callout>
      </DocSection>

      <DocSection id="logging" num="02" title="Logging">
        <CodeBlock
          lang="TS"
          code={`import { Logger } from '@lov3kaizen/agentsea-core';

const logger = new Logger({
  level: 'info',           // 'error' | 'warn' | 'info' | 'debug'
  format: 'json',          // 'json' | 'simple' (applies to the file)
  filename: './logs/app.log', // optional file output
  console: true,           // default; set false to skip the console
});

logger.error('Failed to connect', { error: 'timeout' });
logger.warn('Rate limit approaching', { usage: 95 });
logger.info('Agent executed', { agentName: 'chat-agent' });
logger.debug('Tool called', { toolName: 'calculator' });

// A child logger adds fixed fields to every entry
const requestLogger = logger.child({ requestId: 'req-42' });
requestLogger.info('Starting run');`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Logging an agent run:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, Logger } from '@lov3kaizen/agentsea-core';

const logger = new Logger({ level: 'info' });

async function runAgent(agent: Agent, prompt: string, context: AgentContext) {
  logger.info('Agent run started', {
    agentName: agent.config.name,
    conversationId: context.conversationId,
  });
  try {
    const response = await agent.execute(prompt, context);
    logger.info('Agent run completed', {
      agentName: agent.config.name,
      tokensUsed: response.metadata.tokensUsed,
      toolCalls: response.toolCalls?.length ?? 0,
    });
    return response;
  } catch (error) {
    logger.error('Agent run failed', {
      agentName: agent.config.name,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}`}
        />
      </DocSection>

      <DocSection id="metrics" num="03" title="Metrics">
        <p className="text-base leading-relaxed text-brand-navy">
          A metric is an <code>AgentMetrics</code> record: <code>agentName</code>, <code>latencyMs</code>,{' '}
          <code>tokensUsed</code>, <code>success</code>, an optional <code>error</code>, and a{' '}
          <code>timestamp</code>. Record one per run:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AgentContext, globalMetrics } from '@lov3kaizen/agentsea-core';

async function executeWithMetrics(agent: Agent, prompt: string, context: AgentContext) {
  const startedAt = Date.now();
  try {
    const response = await agent.execute(prompt, context);
    globalMetrics.record({
      agentName: agent.config.name,
      latencyMs: Date.now() - startedAt,
      tokensUsed: response.metadata.tokensUsed,
      success: true,
      timestamp: new Date(),
    });
    return response;
  } catch (error) {
    globalMetrics.record({
      agentName: agent.config.name,
      latencyMs: Date.now() - startedAt,
      tokensUsed: 0,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date(),
    });
    throw error;
  }
}`}
        />
        <p className="text-base leading-relaxed text-brand-navy">Read the recorded metrics:</p>
        <ApiList>
          <ApiRow name="getStats(agentName?)">
            Returns <code>totalCalls</code>, <code>successRate</code>, <code>avgLatency</code>,{' '}
            <code>totalTokens</code> and <code>errors</code>. Without a name, it covers all agents.
          </ApiRow>
          <ApiRow name="getAll()">Returns a copy of every recorded metric.</ApiRow>
          <ApiRow name="getByAgent(name)">Returns the metrics for one agent.</ApiRow>
          <ApiRow name="getByTimeRange(start, end)">Returns the metrics recorded in a time window.</ApiRow>
          <ApiRow name="subscribe(listener)">Calls the listener for each new metric. Returns an unsubscribe function.</ApiRow>
          <ApiRow name="clear()">Removes all recorded metrics.</ApiRow>
        </ApiList>
        <CodeBlock
          lang="TS"
          code={`const stats = globalMetrics.getStats('chat-agent');
console.log(stats.totalCalls, stats.successRate, stats.avgLatency, stats.totalTokens);`}
        />
      </DocSection>

      <DocSection id="tracing" num="04" title="Tracing">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>startSpan(name, context?)</code> returns a span and a context. Pass that context to a child
          span to nest it under the parent:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { globalTracer } from '@lov3kaizen/agentsea-core';

const { span: runSpan, context: runContext } = globalTracer.startSpan('agent-run');
globalTracer.setAttributes(runSpan.spanId, { agentName: 'chat-agent', userId: '12345' });

try {
  const response = await agent.execute(prompt, context);

  // A child span for a tool call, nested under the run
  const { span: toolSpan } = globalTracer.startSpan('tool-call', runContext);
  globalTracer.setAttributes(toolSpan.spanId, { toolName: 'calculator' });
  globalTracer.endSpan(toolSpan.spanId);

  globalTracer.addEvent(runSpan.spanId, 'completed', { tokensUsed: response.metadata.tokensUsed });
  globalTracer.endSpan(runSpan.spanId);

  // All spans in the trace, and the run's duration in milliseconds
  const spans = globalTracer.getTrace(runSpan.traceId);
  console.log(spans.length, globalTracer.getSpanDuration(runSpan.spanId));
} catch (error) {
  globalTracer.endSpan(runSpan.spanId, error instanceof Error ? error : new Error(String(error)));
  throw error;
}`}
        />
        <ApiList>
          <ApiRow name="startSpan(name, context?)">Starts a span. Returns <code>{'{ span, context }'}</code>.</ApiRow>
          <ApiRow name="endSpan(spanId, error?)">Ends a span. Passing an error marks it failed.</ApiRow>
          <ApiRow name="setAttributes(spanId, attributes)">Attaches key/value pairs to a span.</ApiRow>
          <ApiRow name="addEvent(spanId, name, attributes?)">Adds a timestamped event to a span.</ApiRow>
          <ApiRow name="getSpan(spanId), getTrace(traceId)">Returns one span, or every span in a trace.</ApiRow>
          <ApiRow name="getSpanDuration(spanId)">Returns the duration in milliseconds once the span has ended.</ApiRow>
          <ApiRow name="export(), clear()">Returns all spans, or clears them.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="forwarding" num="05" title="Forwarding to monitoring">
        <p className="text-base leading-relaxed text-brand-navy">
          Core has no built-in exporter for Prometheus, DataDog or other systems. To send metrics out, subscribe
          to <code>globalMetrics</code> and forward each record with your own client:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { globalMetrics } from '@lov3kaizen/agentsea-core';

const unsubscribe = globalMetrics.subscribe((metric) => {
  // Send to your monitoring client here
  sendToMonitoring({
    name: 'agent.run',
    agent: metric.agentName,
    latencyMs: metric.latencyMs,
    tokens: metric.tokensUsed,
    success: metric.success,
  });

  if (metric.latencyMs > 5000) {
    console.warn(\`Slow run: \${metric.agentName} took \${metric.latencyMs} ms\`);
  }
});

// Call unsubscribe() to stop forwarding`}
        />
      </DocSection>

      <DocSection id="performance" num="06" title="Performance monitoring">
        <p className="text-base leading-relaxed text-brand-navy">
          Check the summary on an interval and log anything out of range:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { globalMetrics, Logger } from '@lov3kaizen/agentsea-core';

const logger = new Logger({ level: 'info' });

setInterval(() => {
  const stats = globalMetrics.getStats();

  if (stats.avgLatency > 5000) {
    logger.warn('High average latency', { avgLatency: stats.avgLatency });
  }

  const errorRate = stats.totalCalls > 0 ? stats.errors / stats.totalCalls : 0;
  if (errorRate > 0.05) {
    logger.error('High error rate', { errorRate });
  }

  logger.info('Performance summary', { ...stats, errorRate });
}, 60_000); // once a minute`}
        />
      </DocSection>

      <DocSection id="related-packages" num="07" title="Related packages">
        <BulletPanel
          items={[
            <>
              <strong>@lov3kaizen/agentsea-analytics</strong>: conversation analytics, with intent classification, flow
              analysis and sentiment. See the <Link href="/docs/analytics" className="font-semibold text-brand-ocean hover:underline">analytics reference</Link>.
            </>,
            <>
              <strong>@lov3kaizen/agentsea-debugger</strong>: step-through debugging, execution recordings, checkpoints
              and replay. See the <Link href="/docs/debugger" className="font-semibold text-brand-ocean hover:underline">debugger reference</Link>.
            </>,
            <>
              <strong>@lov3kaizen/agentsea-costs</strong>: real-time cost tracking, budgets and attribution. See the{' '}
              <Link href="/docs/costs" className="font-semibold text-brand-ocean hover:underline">costs reference</Link>.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="best-practices" num="08" title="Best practices">
        <BulletPanel
          items={[
            <>
              <strong>Log levels</strong>: use <code>error</code> for failures, <code>info</code> for important events
              and <code>debug</code> for detail.
            </>,
            <>
              <strong>Context</strong>: include agent names and conversation IDs. Use <code>child()</code> for fields
              that repeat.
            </>,
            <>
              <strong>Metric names and fields</strong>: use the same agent names everywhere so records can be grouped.
            </>,
            <>
              <strong>Bound memory</strong>: <code>globalMetrics</code> and the tracer keep records in memory. Forward
              them and call <code>clear()</code> on a schedule in long-running processes.
            </>,
            <>
              <strong>Alerts</strong>: alert on error rate and latency, not on single failures.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="next-steps" num="09" title="Next steps">
        <BulletPanel
          items={[
            <Link key="agents" href="/docs/agents" className="text-brand-ocean hover:underline">
              Learn about agents
            </Link>,
            <Link key="workflows" href="/docs/workflows" className="text-brand-ocean hover:underline">
              Explore workflows
            </Link>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
