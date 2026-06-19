import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function CachePage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Cache"
        titleGradient="blue"
        description="Semantic caching layer for LLM responses — exact match, semantic similarity, and hybrid strategies."
      />

      <AlertBox type="info" gradient>
        <span>
          The cache reduces LLM costs by 30-50% through intelligent caching,
          combining hash-based exact matching with embedding-based semantic
          similarity across pluggable storage backends.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-cache`}
        </CodeBlock>
        <p>For semantic matching, also install the embeddings package:</p>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-embeddings`}
        </CodeBlock>

        <h2>Quick Start</h2>
        <p>
          Create a <code>SemanticCache</code> with a store and a match strategy,
          then wrap your LLM calls. Identical requests hit the cache via
          hash-based exact matching:
        </p>
        <CodeBlock language="typescript">
          {`import {
  SemanticCache,
  MemoryCacheStore,
  ExactMatchStrategy,
} from '@lov3kaizen/agentsea-cache';

// Create cache with memory store and exact matching
const cache = new SemanticCache(
  {
    defaultTTL: 3600, // 1 hour
    matchStrategy: 'exact',
  },
  new MemoryCacheStore({ type: 'memory', maxEntries: 10000 }),
  new ExactMatchStrategy(),
);

// Wrap your LLM call
const response = await cache.wrap(
  {
    model: 'gpt-5.5',
    messages: [{ role: 'user', content: 'What is the capital of France?' }],
  },
  async (request) => {
    // Your LLM call here
    return await openai.chat.completions.create(request);
  },
);

console.log('Cached:', response._cache?.hit);`}
        </CodeBlock>

        <h2>Exact Match Caching</h2>
        <p>
          <code>ExactMatchStrategy</code> uses a hash of the normalized request
          so identical requests return the cached response instantly. Pair it
          with any store and set <code>matchStrategy</code> to <code>'exact'</code>:
        </p>
        <CodeBlock language="typescript">
          {`import {
  SemanticCache,
  MemoryCacheStore,
  ExactMatchStrategy,
} from '@lov3kaizen/agentsea-cache';

const cache = new SemanticCache(
  { defaultTTL: 3600, matchStrategy: 'exact' },
  new MemoryCacheStore({ type: 'memory', maxEntries: 10000 }),
  new ExactMatchStrategy(),
);`}
        </CodeBlock>

        <h2>Semantic Similarity Caching</h2>
        <p>
          Use <code>SemanticMatchStrategy</code> with a <code>SimilarityEngine</code>{' '}
          backed by an embedding provider to match semantically similar queries.
          Set a <code>similarityThreshold</code> to control how close a match must
          be:
        </p>
        <CodeBlock language="typescript">
          {`import {
  SemanticCache,
  MemoryCacheStore,
  SemanticMatchStrategy,
  SimilarityEngine,
} from '@lov3kaizen/agentsea-cache';
import { OpenAIProvider } from '@lov3kaizen/agentsea-embeddings';

// Create embedding provider
const embeddingProvider = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small',
});

// Create similarity engine
const similarity = new SimilarityEngine({
  provider: embeddingProvider,
  cacheEmbeddings: true,
});

const cache = new SemanticCache(
  {
    defaultTTL: 3600,
    similarityThreshold: 0.92, // 92% similarity required
    matchStrategy: 'semantic',
  },
  new MemoryCacheStore({ type: 'memory' }),
  new SemanticMatchStrategy(),
  similarity,
);`}
        </CodeBlock>

        <h2>Hybrid Strategy</h2>
        <p>
          <code>HybridMatchStrategy</code> tries exact matching first and falls
          back to semantic similarity — the best of both for high hit rates with
          low latency. Inspect <code>_cache</code> on the response for hit status
          and similarity score:
        </p>
        <CodeBlock language="typescript">
          {`import {
  SemanticCache,
  MemoryCacheStore,
  HybridMatchStrategy,
  SimilarityEngine,
} from '@lov3kaizen/agentsea-cache';
import { OpenAIProvider } from '@lov3kaizen/agentsea-embeddings';

const similarity = new SimilarityEngine({
  provider: new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  }),
  cacheEmbeddings: true,
});

const cache = new SemanticCache(
  {
    defaultTTL: 3600,
    similarityThreshold: 0.92,
    matchStrategy: 'hybrid', // Try exact first, then semantic
  },
  new MemoryCacheStore({ type: 'memory' }),
  new HybridMatchStrategy(),
  similarity,
);

const response1 = await cache.wrap(
  {
    model: 'gpt-5.5',
    messages: [{ role: 'user', content: 'What is the capital of France?' }],
  },
  llmCall,
);

// This hits the cache due to semantic similarity!
const response2 = await cache.wrap(
  {
    model: 'gpt-5.5',
    messages: [{ role: 'user', content: "What's France's capital city?" }],
  },
  llmCall,
);

console.log('Second call cached:', response2._cache?.hit); // true
console.log('Similarity:', response2._cache?.similarity); // ~0.95`}
        </CodeBlock>

        <h2>Wrap Options</h2>
        <p>
          The <code>wrap</code> method accepts per-call <code>WrapOptions</code> to
          override TTL, tag entries for grouped invalidation, scope to a
          namespace, or bypass the cache entirely:
        </p>
        <CodeBlock language="typescript">
          {`interface WrapOptions {
  ttl?: number;          // Custom TTL
  tags?: string[];       // Tags for grouping
  namespace?: string;    // Namespace override
  skipCache?: boolean;   // Bypass cache
  forceRefresh?: boolean; // Force update
}

const response = await cache.wrap(request, llmCall, {
  ttl: 1800,
  tags: ['support', 'faq'],
});`}
        </CodeBlock>

        <h2>Streaming Replay</h2>
        <p>
          <code>StreamCache</code> records streaming LLM responses and replays
          cached streams transparently chunk by chunk:
        </p>
        <CodeBlock language="typescript">
          {`import { StreamCache, MemoryCacheStore } from '@lov3kaizen/agentsea-cache';

const store = new MemoryCacheStore({ type: 'memory' });

const streamCache = new StreamCache(store, {
  minLengthToCache: 50,
  cacheIncomplete: false,
  streamTtl: 3600,
});

// Wrap streaming calls
const stream = streamCache.wrapStream('gpt-5.5', messages, async function* () {
  for await (const chunk of llm.stream(request)) {
    yield chunk;
  }
});

// Cached streams are replayed transparently
for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}`}
        </CodeBlock>

        <h2>Backends &amp; Stores</h2>
        <p>
          Swap the store to change where cache entries live. Memory, Redis,
          SQLite, and Pinecone backends are available, each configured by its
          store config:
        </p>
        <CodeBlock language="typescript">
          {`import {
  MemoryCacheStore,
  RedisCacheStore,
  PineconeCacheStore,
} from '@lov3kaizen/agentsea-cache';

// In-memory with LRU eviction
const memoryStore = new MemoryCacheStore({
  type: 'memory',
  maxEntries: 10000,
  maxSizeBytes: 1024 * 1024 * 1024, // 1GB
  evictionPolicy: 'lru',
});

// Redis
const redisStore = new RedisCacheStore({
  type: 'redis',
  url: 'redis://localhost:6379',
  keyPrefix: 'llm-cache',
});

// Pinecone (for semantic vector search)
const pineconeStore = new PineconeCacheStore({
  type: 'pinecone',
  apiKey: process.env.PINECONE_API_KEY,
  index: 'llm-cache',
  namespace: 'production',
});`}
        </CodeBlock>

        <h2>Multi-Tier Caching</h2>
        <p>
          <code>TieredCacheStore</code> composes multiple stores into an
          L1/L2/L3 hierarchy with write-through and promotion on hit — keep a
          fast in-memory L1 in front of a shared Redis L2:
        </p>
        <CodeBlock language="typescript">
          {`import {
  TieredCacheStore,
  MemoryCacheStore,
  RedisCacheStore,
} from '@lov3kaizen/agentsea-cache';

const memoryStore = new MemoryCacheStore({ type: 'memory' });
const redisStore = new RedisCacheStore({
  type: 'redis',
  url: 'redis://localhost:6379',
});

const tieredStore = new TieredCacheStore({
  type: 'tiered',
  tiers: [
    { name: 'l1-memory', priority: 1, store: memoryStore, ttl: 300 },
    { name: 'l2-redis', priority: 2, store: redisStore, ttl: 3600 },
  ],
  writeThrough: true,
  promoteOnHit: true,
});`}
        </CodeBlock>

        <h2>TTL &amp; Eviction</h2>
        <p>
          Set a <code>defaultTTL</code> in seconds on the cache config (0 = no
          expiry) and override per call via <code>WrapOptions.ttl</code>. The
          memory store evicts entries with its configured{' '}
          <code>evictionPolicy</code> when <code>maxEntries</code> or{' '}
          <code>maxSizeBytes</code> is exceeded:
        </p>
        <CodeBlock language="typescript">
          {`const cache = new SemanticCache(
  {
    defaultTTL: 3600, // entries expire after 1 hour
    maxEntries: 10000,
    matchStrategy: 'exact',
  },
  new MemoryCacheStore({
    type: 'memory',
    maxEntries: 10000,
    maxSizeBytes: 1024 * 1024 * 1024,
    evictionPolicy: 'lru',
  }),
  new ExactMatchStrategy(),
);`}
        </CodeBlock>

        <h2>Invalidation</h2>
        <p>
          Invalidate stale entries by key pattern or by the tags you attached at
          write time, or clear the cache entirely:
        </p>
        <CodeBlock language="typescript">
          {`// Remove entries matching a pattern
await cache.invalidateByPattern('user:123:*');

// Remove all entries tagged 'faq'
await cache.invalidateByTags(['faq']);

// Delete a single key or clear everything
await cache.delete(key);
await cache.clear();`}
        </CodeBlock>

        <h2>Analytics</h2>
        <p>
          Track hit rate, tokens saved, and cost reduction with{' '}
          <code>getStats</code> and the detailed <code>getAnalytics</code>{' '}
          report:
        </p>
        <CodeBlock language="typescript">
          {`// Get statistics
const stats = cache.getStats();
console.log(\`Hit Rate: \${(stats.hitRate * 100).toFixed(1)}%\`);
console.log(\`Tokens Saved: \${stats.tokensSaved.toLocaleString()}\`);
console.log(\`Cost Savings: $\${stats.costSavingsUSD.toFixed(2)}\`);

// Get detailed analytics
const analytics = cache.getAnalytics();
const report = analytics.getCostSavingsReport();
console.log(\`Reduction: \${report.reductionPercent.toFixed(1)}%\`);`}
        </CodeBlock>

        <h2>AgentSea Integration</h2>
        <p>
          Wrap any provider with <code>CachedProvider</code>, or add caching to
          an agent pipeline with <code>CacheMiddleware</code>:
        </p>
        <CodeBlock language="typescript">
          {`import { CachedProvider, CacheMiddleware } from '@lov3kaizen/agentsea-cache';

// Transparent caching around a provider
const cachedProvider = new CachedProvider({
  provider: anthropicProvider,
  cache: semanticCache,
  skipModels: ['gpt-4-vision'], // Don't cache vision models
});

const response = await cachedProvider.complete({
  model: 'claude-sonnet-4-6',
  messages: [{ role: 'user', content: 'Hello' }],
});

// Caching middleware for agent pipelines
const middleware = new CacheMiddleware({
  cache: semanticCache,
  skipToolRequests: true, // Don't cache tool-using requests
  defaultTTL: 1800,
});`}
        </CodeBlock>

        <Divider />

        <Section>
          <h2>Next Steps</h2>
          <ul>
            <li>
              <Link href="/docs/gateway">Use with Gateway</Link>
            </li>
            <li>
              <Link href="/docs/embeddings">Configure Embeddings</Link>
            </li>
            <li>
              <Link href="/docs/costs">Track Costs</Link>
            </li>
          </ul>
        </Section>
      </div>
    </PageContainer>
  );
}
