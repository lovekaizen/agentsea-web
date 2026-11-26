import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import BulletPanel from '../../../components/docs/BulletPanel';
import { ApiList, ApiRow } from '../../../components/docs/ApiList';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-gateway | AgentSea',
  description:
    'An LLM gateway with an OpenAI-compatible API over OpenAI, Anthropic and Google providers, with routing, caching and metrics.',
};

const pkg: PackageDoc = {
  slug: 'gateway',
  name: '@lov3kaizen/agentsea-gateway',
  summary:
    'An LLM gateway with an OpenAI-compatible API over OpenAI, Anthropic and Google providers, with routing, caching and metrics.',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-gateway',
  example: {
    lang: 'TS',
    code: `import { Gateway } from '@lov3kaizen/agentsea-gateway';

const gateway = new Gateway({
  providers: [{ name: 'openai', apiKey: process.env.OPENAI_API_KEY, models: ['gpt-5.5'] }],
});
const response = await gateway.chat.completions.create({
  model: 'gpt-5.5',
  messages: [{ role: 'user', content: 'Hello!' }],
});
if ('choices' in response) {
  console.log(response.choices[0].message.content);
  console.log(response._gateway); // provider, cost, latency
}`,
  },
  api: [
    { name: 'new Gateway(config)', description: 'Creates a gateway from a list of providers and optional routing and cache settings.' },
    { name: 'gateway.chat.completions.create(request)', description: 'Sends an OpenAI-style chat request to the chosen provider.' },
    { name: 'routing.strategy', description: 'One of round-robin, failover, cost-optimized or latency-optimized.' },
    { name: "model: 'best' | 'cheapest' | 'fastest'", description: 'Virtual models that route each request automatically.' },
    { name: 'gateway.getMetrics()', description: 'Returns request count, cost, latency and cache hit rate.' },
  ],
  caveats: [
    'How CostOptimizedStrategy measures quality is not described.',
    'The circuit breaker for failover is mentioned but not configured in the docs.',
    'The cache is described as exact-match with maxEntries and ttl. No LRU policy is documented.',
    'Events request:complete, request:error, provider:unhealthy and provider:healthy are emitted by the gateway. See Events and metrics below.',
  ],
};

const toc = [
  { id: 'routing', label: 'Routing' },
  { id: 'caching', label: 'Caching' },
  { id: 'request-metadata', label: 'Request metadata' },
  { id: 'http-server', label: 'HTTP server' },
  { id: 'events', label: 'Events and metrics' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="routing" num="05" title="Routing">
        <p className="text-base leading-relaxed text-brand-navy">
          Set <code>routing</code> in the gateway config. <code>strategy</code> picks the default behaviour. Use{' '}
          <code>weights</code> with round-robin, and <code>fallbackChain</code> with failover.
        </p>
        <CodeBlock
          lang="TS"
          code={`const gateway = new Gateway({
  providers: [/* ... */],
  routing: {
    strategy: 'failover',
    fallbackChain: ['openai', 'anthropic', 'google'],
  },
});`}
        />
        <BulletPanel
          items={[
            <>
              <code>round-robin</code> with <code>weights</code>, for example <code>{'{ openai: 2, anthropic: 1 }'}</code>, sends twice as many requests to OpenAI.
            </>,
            <>
              <code>failover</code> tries the providers in <code>fallbackChain</code> order until one succeeds.
            </>,
            <>
              <code>cost-optimized</code> and <code>latency-optimized</code> choose by cost and by observed latency.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="caching" num="06" title="Caching">
        <p className="text-base leading-relaxed text-brand-navy">
          Turn on the cache to reuse responses for repeated requests. <code>ttl</code> is in seconds. <code>maxEntries</code> caps the number of stored responses.
        </p>
        <CodeBlock
          lang="TS"
          code={`const gateway = new Gateway({
  providers: [/* ... */],
  cache: {
    enabled: true,
    ttl: 3600, // seconds
    maxEntries: 1000,
    type: 'exact', // or 'semantic'
  },
});`}
        />
      </DocSection>

      <DocSection id="request-metadata" num="07" title="Request metadata">
        <p className="text-base leading-relaxed text-brand-navy">
          Add a <code>_gateway</code> object to a request to steer routing or the cache for that call only.
        </p>
        <CodeBlock
          lang="TS"
          code={`const response = await gateway.chat.completions.create({
  model: 'gpt-5.5',
  messages: [{ role: 'user', content: 'Hello!' }],
  _gateway: {
    preferredProvider: 'anthropic',
    excludeProviders: ['google'],
    maxCost: 0.01,
    maxLatency: 5000,
    cachePolicy: 'no-cache', // 'default' | 'no-cache' | 'force-cache'
    tags: { user: 'user-123' },
  },
});`}
        />
      </DocSection>

      <DocSection id="http-server" num="08" title="HTTP server">
        <p className="text-base leading-relaxed text-brand-navy">
          Run the gateway as an OpenAI-compatible HTTP server, then point any OpenAI SDK or <code>curl</code> at it.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Gateway, createHTTPServer, startServer } from '@lov3kaizen/agentsea-gateway';

const gateway = new Gateway({
  providers: [{ name: 'openai', apiKey: process.env.OPENAI_API_KEY, models: ['gpt-5.5'] }],
});
const app = createHTTPServer({ gateway });
startServer(app, { port: 3000 });`}
        />
        <CodeBlock
          lang="BASH"
          code={`curl http://localhost:3000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{ "model": "cheapest", "messages": [{"role": "user", "content": "Hello!"}] }'`}
        />
      </DocSection>

      <DocSection id="events" num="09" title="Events and metrics">
        <CodeBlock
          lang="TS"
          code={`gateway.on('request:complete', (event) => {
  console.log(event.provider, event.latencyMs, event.cost);
});
gateway.on('request:error', (event) => {
  console.error(event.error.message);
});
gateway.on('provider:unhealthy', (provider) => {
  console.warn(provider, 'is unhealthy');
});

const metrics = gateway.getMetrics();
console.log(metrics.requests.total, metrics.requests.failed);`}
        />
        <ApiList>
          <ApiRow name="request:complete">Fires after each request with provider, model, latencyMs, cost, cached and tokens.</ApiRow>
          <ApiRow name="request:error">Fires when a request fails, with the requestId, provider and error.</ApiRow>
          <ApiRow name="provider:unhealthy / provider:healthy">Fires when a provider is marked unhealthy or recovers.</ApiRow>
        </ApiList>
      </DocSection>
    </PackagePage>
  );
}
