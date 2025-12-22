import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function GatewayPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="LLM Gateway"
        titleGradient="blue"
        description="High-performance OpenAI-compatible API gateway with intelligent routing, caching, and cost optimization across multiple LLM providers."
      />

      <AlertBox type="info" gradient>
        <span>
          The Gateway provides a unified API for all providers with virtual
          models like <code>best</code>, <code>cheapest</code>, and{' '}
          <code>fastest</code> for automatic routing.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-gateway`}
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

        <h2>Quick Start - HTTP Server</h2>
        <p>
          Run the gateway as an OpenAI-compatible HTTP server that you can use
          with any OpenAI SDK:
        </p>

        <CodeBlock language="typescript">
          {`import {
  Gateway,
  createHTTPServer,
  startServer,
} from '@lov3kaizen/agentsea-gateway';

const gateway = new Gateway({
  providers: [
    {
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      models: ['gpt-4o', 'gpt-4o-mini'],
    },
    {
      name: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      models: ['claude-3-5-sonnet-20241022'],
    },
  ],
  routing: {
    strategy: 'cost-optimized',
  },
});

const app = createHTTPServer({ gateway });
startServer(app, { port: 3000 });`}
        </CodeBlock>

        <p>Then use it like the OpenAI API:</p>

        <CodeBlock language="bash">
          {`curl http://localhost:3000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "cheapest",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
        </CodeBlock>

        <h2>Quick Start - SDK</h2>
        <p>Use the gateway directly in your code:</p>

        <CodeBlock language="typescript">
          {`import { Gateway } from '@lov3kaizen/agentsea-gateway';

const gateway = new Gateway({
  providers: [
    { name: 'openai', apiKey: process.env.OPENAI_API_KEY, models: ['gpt-4o'] },
  ],
});

// OpenAI-compatible interface
const response = await gateway.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);
console.log(response._gateway); // Gateway metadata (provider, cost, latency)`}
        </CodeBlock>

        <h2>Virtual Models</h2>
        <p>
          Use virtual models to automatically route to the optimal provider:
        </p>

        <CodeBlock language="typescript">
          {`// Route to highest quality available model
await gateway.chat.completions.create({
  model: 'best',
  messages: [{ role: 'user', content: 'Complex reasoning task...' }],
});

// Route to cheapest model
await gateway.chat.completions.create({
  model: 'cheapest',
  messages: [{ role: 'user', content: 'Simple task...' }],
});

// Route to fastest provider
await gateway.chat.completions.create({
  model: 'fastest',
  messages: [{ role: 'user', content: 'Time-sensitive task...' }],
});`}
        </CodeBlock>

        <h2>Routing Strategies</h2>

        <h3>Round-Robin</h3>
        <p>Distributes requests evenly across providers:</p>
        <CodeBlock language="typescript">
          {`const gateway = new Gateway({
  providers: [...],
  routing: {
    strategy: 'round-robin',
    weights: { openai: 2, anthropic: 1 }, // 2:1 ratio
  },
});`}
        </CodeBlock>

        <h3>Failover</h3>
        <p>Tries providers in order until one succeeds:</p>
        <CodeBlock language="typescript">
          {`const gateway = new Gateway({
  providers: [...],
  routing: {
    strategy: 'failover',
    fallbackChain: ['openai', 'anthropic', 'google'],
  },
});`}
        </CodeBlock>

        <h3>Cost-Optimized</h3>
        <p>Selects the cheapest model meeting quality requirements:</p>
        <CodeBlock language="typescript">
          {`const gateway = new Gateway({
  providers: [...],
  routing: { strategy: 'cost-optimized' },
});`}
        </CodeBlock>

        <h3>Latency-Optimized</h3>
        <p>Routes to the fastest provider based on observed latencies:</p>
        <CodeBlock language="typescript">
          {`const gateway = new Gateway({
  providers: [...],
  routing: { strategy: 'latency-optimized' },
});`}
        </CodeBlock>

        <h2>Caching</h2>
        <p>
          Enable caching to reduce costs and latency for repeated requests:
        </p>

        <CodeBlock language="typescript">
          {`const gateway = new Gateway({
  providers: [...],
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour
    maxEntries: 1000,
    type: 'exact', // Hash-based matching
  },
});`}
        </CodeBlock>

        <h2>Request Metadata</h2>
        <p>Add gateway-specific options to requests:</p>

        <CodeBlock language="typescript">
          {`const response = await gateway.chat.completions.create({
  model: 'gpt-4o',
  messages: [...],
  _gateway: {
    preferredProvider: 'anthropic',
    excludeProviders: ['google'],
    maxCost: 0.01, // Max $0.01 per request
    maxLatency: 5000, // Max 5 seconds
    cachePolicy: 'no-cache', // Skip cache
    tags: { user: 'user-123' },
  },
});`}
        </CodeBlock>

        <h2>Response Metadata</h2>
        <p>Every response includes gateway metadata:</p>

        <CodeBlock language="typescript">
          {`const response = await gateway.chat.completions.create({ ... });

console.log(response._gateway);
// {
//   provider: 'openai',
//   originalModel: 'cheapest',
//   latencyMs: 1234,
//   cost: 0.000123,
//   cached: false,
//   retries: 0,
//   routingDecision: { ... }
// }`}
        </CodeBlock>

        <h2>Streaming</h2>
        <p>Full streaming support with SSE:</p>

        <CodeBlock language="typescript">
          {`const stream = await gateway.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}`}
        </CodeBlock>

        <h2>Metrics</h2>
        <p>Track usage and costs:</p>

        <CodeBlock language="typescript">
          {`const metrics = gateway.getMetrics();

console.log(metrics.requests.total);
console.log(metrics.cost.total);
console.log(metrics.cost.byProvider);
console.log(metrics.latency.avg);
console.log(metrics.cache.hitRate);`}
        </CodeBlock>

        <h2>Events</h2>
        <p>Listen to gateway events:</p>

        <CodeBlock language="typescript">
          {`gateway.on('request:complete', (event) => {
  console.log(\`\${event.provider}: \${event.latencyMs}ms, $\${event.cost}\`);
});

gateway.on('request:error', (event) => {
  console.error(\`Error: \${event.error.message}\`);
});

gateway.on('provider:unhealthy', (provider) => {
  console.warn(\`Provider \${provider} is unhealthy\`);
});`}
        </CodeBlock>

        <h2>API Reference</h2>

        <h3>Gateway</h3>
        <ul>
          <li>
            <code>constructor(config: GatewayConfig)</code> - Create gateway
            instance
          </li>
          <li>
            <code>chat.completions.create(request)</code> - Create completion
          </li>
          <li>
            <code>getMetrics()</code> - Get usage metrics
          </li>
          <li>
            <code>getRegistry()</code> - Get provider registry
          </li>
          <li>
            <code>getRouter()</code> - Get router instance
          </li>
          <li>
            <code>checkHealth()</code> - Check provider health
          </li>
          <li>
            <code>shutdown()</code> - Clean shutdown
          </li>
        </ul>

        <h3>Built-in Providers</h3>
        <ul>
          <li>
            <code>OpenAIProvider</code> - OpenAI / Azure OpenAI
          </li>
          <li>
            <code>AnthropicProvider</code> - Anthropic Claude
          </li>
          <li>
            <code>GoogleProvider</code> - Google Gemini
          </li>
        </ul>

        <h3>Routing Strategies</h3>
        <ul>
          <li>
            <code>RoundRobinStrategy</code> - Even distribution
          </li>
          <li>
            <code>FailoverStrategy</code> - Ordered fallback
          </li>
          <li>
            <code>CostOptimizedStrategy</code> - Cheapest model
          </li>
          <li>
            <code>LatencyOptimizedStrategy</code> - Fastest provider
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/providers">Learn about Providers</Link>
          </li>
          <li>
            <Link href="/docs/observability">Monitor Gateway Performance</Link>
          </li>
          <li>
            <Link href="/docs/guardrails">Add Safety Guardrails</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const features = [
  {
    icon: '🔌',
    name: 'Unified API',
    description: 'OpenAI-compatible API for all providers',
  },
  {
    icon: '🎯',
    name: 'Intelligent Routing',
    description: 'Round-robin, failover, cost, and latency optimization',
  },
  {
    icon: '✨',
    name: 'Virtual Models',
    description: 'Use best, cheapest, or fastest for auto-routing',
  },
  {
    icon: '💾',
    name: 'Built-in Caching',
    description: 'LRU cache to reduce costs and latency',
  },
  {
    icon: '📊',
    name: 'Metrics',
    description: 'Request tracking, cost calculation, latency monitoring',
  },
  {
    icon: '🛡️',
    name: 'Circuit Breaker',
    description: 'Automatic failover and retry protection',
  },
];
