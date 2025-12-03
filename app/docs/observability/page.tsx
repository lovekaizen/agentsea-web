import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function ObservabilityPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Observability"
        titleGradient="blue"
        description="Monitor, debug, and optimize your agentic applications with comprehensive logging, metrics, and distributed tracing."
      />

      <div className="prose max-w-none">
        <h2>Observability Pillars</h2>
        <p>AgentSea provides three core observability features:</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-8">
          {observabilityPillars.map((pillar, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="text-3xl mb-2">{pillar.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {pillar.name}
              </h3>
              <p className="text-sm text-gray-600">{pillar.description}</p>
            </div>
          ))}
        </div>

        <h2>Logging</h2>
        <p>
          Structured logging powered by Winston with JSON and simple formats:
        </p>

        <CodeBlock language="typescript">
          {`import { Logger } from '@lov3kaizen/agentsea-core';

// Create logger
const logger = new Logger({
  level: 'info', // 'error', 'warn', 'info', 'debug'
  format: 'json', // or 'simple'
  filename: './logs/app.log', // Optional file output
});

// Log messages
logger.error('Failed to connect', { error: err.message });
logger.warn('Rate limit approaching', { usage: 95 });
logger.info('Agent executed successfully', { agentName: 'chat-agent' });
logger.debug('Tool called', { toolName: 'calculator', input: { a: 1, b: 2 } });`}
        </CodeBlock>

        <h3>Logging Agent Execution</h3>

        <CodeBlock language="typescript">
          {`import { Agent, Logger } from '@lov3kaizen/agentsea-core';

const logger = new Logger({ level: 'info' });

// Enable agent logging
const agent = new Agent(config, provider, toolRegistry, memory);

try {
  logger.info('Agent execution started', {
    agentName: agent.name,
    conversationId: context.conversationId,
  });

  const response = await agent.execute(prompt, context);

  logger.info('Agent execution completed', {
    agentName: agent.name,
    tokensUsed: response.metadata.tokensUsed,
    toolsCalled: response.toolCalls.length,
  });

  return response;
} catch (error) {
  logger.error('Agent execution failed', {
    agentName: agent.name,
    error: error.message,
    stack: error.stack,
  });
  throw error;
}`}
        </CodeBlock>

        <h2>Metrics</h2>
        <p>Track performance metrics for agents, tools, and workflows:</p>

        <CodeBlock language="typescript">
          {`import { Metrics, globalMetrics } from '@lov3kaizen/agentsea-core';

// Use global metrics instance
const metrics = globalMetrics;

// Record metrics
metrics.recordCounter('agent.executions', 1, {
  agentName: 'chat-agent',
  status: 'success',
});

metrics.recordHistogram('agent.latency', 1250, {
  agentName: 'chat-agent',
});

metrics.recordGauge('agent.active_conversations', 42);

// Get statistics
const stats = metrics.getStatistics();
console.log(stats);
// {
// 'agent.executions': { count: 100, sum: 100, ... },
// 'agent.latency': { count: 100, min: 200, max: 3000, mean: 1250, ... }
// }`}
        </CodeBlock>

        <h3>Automated Agent Metrics</h3>

        <CodeBlock language="typescript">
          {`import { Agent, globalMetrics } from '@lov3kaizen/agentsea-core';

const agent = new Agent(config, provider, toolRegistry, memory);

// Wrap execution with metrics
async function executeWithMetrics(prompt: string, context: any) {
  const startTime = Date.now();

  try {
    const response = await agent.execute(prompt, context);

    // Record success metrics
    globalMetrics.recordCounter('agent.executions', 1, {
      agentName: agent.name,
      status: 'success',
    });

    globalMetrics.recordHistogram('agent.latency', Date.now() - startTime, {
      agentName: agent.name,
    });

    globalMetrics.recordHistogram('agent.tokens', response.metadata.tokensUsed, {
      agentName: agent.name,
    });

    return response;
  } catch (error) {
    // Record error metrics
    globalMetrics.recordCounter('agent.executions', 1, {
      agentName: agent.name,
      status: 'error',
    });

    globalMetrics.recordCounter('agent.errors', 1, {
      agentName: agent.name,
      errorType: error.constructor.name,
    });

    throw error;
  }
}`}
        </CodeBlock>

        <h3>Subscribing to Metrics</h3>

        <CodeBlock language="typescript">
          {`import { globalMetrics } from '@lov3kaizen/agentsea-core';

// Subscribe to metric updates
globalMetrics.subscribe((metric) => {
  console.log(\`Metric recorded: \${metric.name} = \${metric.value}\`);

  // Send to monitoring service
  if (metric.name === 'agent.latency' && metric.value > 5000) {
    alertHighLatency(metric);
  }
});`}
        </CodeBlock>

        <h2>Distributed Tracing</h2>
        <p>Track execution flow across agents, tools, and workflows:</p>

        <CodeBlock language="typescript">
          {`import { Tracer, globalTracer } from '@lov3kaizen/agentsea-core';

const tracer = globalTracer;

// Create trace
const trace = tracer.createTrace('user-request', {
  userId: '12345',
  operation: 'chat',
});

// Create spans for each operation
const agentSpan = trace.createSpan('agent-execution', {
  agentName: 'chat-agent',
});

try {
  const response = await agent.execute(prompt, context);

  // Create nested span for tool execution
  const toolSpan = agentSpan.createSpan('tool-call', {
    toolName: 'calculator',
  });

  const result = await executeTool('calculator', { a: 1, b: 2 });
  toolSpan.end();

  agentSpan.end();

  // Get trace information
  const duration = trace.getDuration();
  const spans = trace.getSpans();
  console.log(\`Total duration: \${duration}ms, Spans: \${spans.length}\`);
} catch (error) {
  agentSpan.end();
  throw error;
}`}
        </CodeBlock>

        <h3>Automatic Tracing</h3>

        <CodeBlock language="typescript">
          {`import { Agent, globalTracer } from '@lov3kaizen/agentsea-core';

// Wrap agent with automatic tracing
function createTracedAgent(config, provider, toolRegistry, memory) {
  const agent = new Agent(config, provider, toolRegistry, memory);

  // Override execute method
  const originalExecute = agent.execute.bind(agent);

  agent.execute = async (prompt, context) => {
    const trace = globalTracer.createTrace(\`agent:\${agent.name}\`, {
      conversationId: context.conversationId,
    });

    const span = trace.createSpan('agent-execution', {
      agentName: agent.name,
      prompt: prompt.substring(0, 100),
    });

    try {
      const response = await originalExecute(prompt, context);
      span.end();
      return response;
    } catch (error) {
      span.end();
      throw error;
    }
  };

  return agent;
}

const tracedAgent = createTracedAgent(config, provider, toolRegistry, memory);`}
        </CodeBlock>

        <h2>Integration with Monitoring Services</h2>

        <h3>Prometheus</h3>

        <CodeBlock language="typescript">
          {`import { globalMetrics } from '@lov3kaizen/agentsea-core';
import { register, Counter, Histogram } from 'prom-client';

// Create Prometheus metrics
const agentExecutions = new Counter({
  name: 'agent_executions_total',
  help: 'Total agent executions',
  labelNames: ['agent_name', 'status'],
});

const agentLatency = new Histogram({
  name: 'agent_latency_seconds',
  help: 'Agent execution latency',
  labelNames: ['agent_name'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Subscribe to AgentSea  metrics and forward to Prometheus
globalMetrics.subscribe((metric) => {
  if (metric.name === 'agent.executions') {
    agentExecutions.inc({
      agent_name: metric.tags.agentName,
      status: metric.tags.status,
    });
  } else if (metric.name === 'agent.latency') {
    agentLatency.observe(
      { agent_name: metric.tags.agentName },
      metric.value / 1000, // Convert to seconds
    );
  }
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});`}
        </CodeBlock>

        <h3>DataDog</h3>

        <CodeBlock language="typescript">
          {`import { globalMetrics } from '@lov3kaizen/agentsea-core';
import { StatsD } from 'node-statsd';

const statsd = new StatsD({
  host: 'localhost',
  port: 8125,
});

// Forward metrics to DataDog
globalMetrics.subscribe((metric) => {
  const tags = Object.entries(metric.tags || {})
    .map(([key, value]) => \`\${key}:\${value}\`)
    .join(',');

  if (metric.type === 'counter') {
    statsd.increment(metric.name, 1, tags);
  } else if (metric.type === 'histogram') {
    statsd.histogram(metric.name, metric.value, tags);
  } else if (metric.type === 'gauge') {
    statsd.gauge(metric.name, metric.value, tags);
  }
});`}
        </CodeBlock>

        <h3>Custom Dashboard</h3>

        <CodeBlock language="typescript">
          {`import { globalMetrics, globalTracer } from '@lov3kaizen/agentsea-core';

// Create dashboard endpoint
app.get('/dashboard', (req, res) => {
  const stats = globalMetrics.getStatistics();
  const activeTraces = globalTracer.getActiveTraces();

  res.json({
    metrics: {
      totalExecutions: stats['agent.executions']?.count || 0,
      averageLatency: stats['agent.latency']?.mean || 0,
      errorRate: calculateErrorRate(stats),
      tokensUsed: stats['agent.tokens']?.sum || 0,
    },
    activeTraces: activeTraces.length,
    uptime: process.uptime(),
  });
});`}
        </CodeBlock>

        <h2>Performance Monitoring</h2>

        <CodeBlock language="typescript">
          {`import { globalMetrics } from '@lov3kaizen/agentsea-core';

// Monitor performance periodically
setInterval(() => {
  const stats = globalMetrics.getStatistics();

  // Check for performance issues
  if (stats['agent.latency']?.mean > 5000) {
    logger.warn('High average latency detected', {
      averageLatency: stats['agent.latency'].mean,
    });
  }

  const errorRate = calculateErrorRate(stats);
  if (errorRate > 0.05) {
    logger.error('High error rate detected', {
      errorRate: errorRate,
    });
  }

  // Log summary
  logger.info('Performance summary', {
    executions: stats['agent.executions']?.count,
    averageLatency: stats['agent.latency']?.mean,
    errorRate: errorRate,
  });
}, 60000); // Every minute`}
        </CodeBlock>

        <h2>Best Practices</h2>

        <ul>
          <li>
            <strong>Log Levels</strong>: Use appropriate log levels (error for
            failures, info for important events, debug for detailed
            troubleshooting)
          </li>
          <li>
            <strong>Structured Logging</strong>: Include relevant context in log
            messages (agent names, conversation IDs, etc.)
          </li>
          <li>
            <strong>Metric Naming</strong>: Use consistent naming conventions
            (e.g., <code>agent.executions</code>, <code>tool.calls</code>)
          </li>
          <li>
            <strong>Sampling</strong>: Sample high-volume traces to reduce
            overhead
          </li>
          <li>
            <strong>Alerting</strong>: Set up alerts for critical metrics (error
            rates, high latency)
          </li>
          <li>
            <strong>Dashboards</strong>: Create dashboards to visualize key
            metrics
          </li>
          <li>
            <strong>Retention</strong>: Configure appropriate log and metric
            retention periods
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/agents">Learn about Agents</Link>
          </li>
          <li>
            <Link href="/docs/workflows">Explore Workflows</Link>
          </li>
          <li>
            <Link href="/examples">View Observability Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const observabilityPillars = [
  {
    icon: '📝',
    name: 'Logging',
    description: 'Structured logging with Winston for debugging and auditing',
  },
  {
    icon: '📊',
    name: 'Metrics',
    description: 'Performance metrics for agents, tools, and workflows',
  },
  {
    icon: '🔍',
    name: 'Tracing',
    description: 'Distributed tracing to understand execution flow',
  },
];
