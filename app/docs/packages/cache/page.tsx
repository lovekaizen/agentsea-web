import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import { ApiList, ApiRow } from '../../../components/docs/ApiList';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-cache | AgentSea',
  description: 'Semantic caching layer for LLM responses, using exact-match and semantic-similarity lookups.',
};

const pkg: PackageDoc = {
  slug: 'cache',
  name: '@lov3kaizen/agentsea-cache',
  summary: 'Semantic caching layer for LLM responses, using exact-match and semantic-similarity lookups.',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-cache',
  example: {
    lang: 'TS',
    code: `import { SemanticCache, MemoryCacheStore, ExactMatchStrategy } from '@lov3kaizen/agentsea-cache';

const cache = new SemanticCache(
  { defaultTTL: 3600, matchStrategy: 'exact' },
  new MemoryCacheStore({ type: 'memory', maxEntries: 10000 }),
  new ExactMatchStrategy(),
);
const response = await cache.wrap(
  { model: 'gpt-5.5', messages: [{ role: 'user', content: 'What is the capital of France?' }] },
  async (request) => await openai.chat.completions.create(request), // your LLM call
);
console.log('Cached:', response._cache?.hit);`,
  },
  api: [
    {
      name: 'SemanticCache.wrap(request, fn, options?)',
      description: 'Returns a cached response if one matches, otherwise calls fn and stores the result.',
    },
    {
      name: 'SemanticCache.get / set / delete / clear',
      description: 'Reads and writes cache entries directly.',
    },
    {
      name: 'SemanticCache.invalidateByTags(tags)',
      description: 'Removes entries that carry the given tags.',
    },
    {
      name: 'SemanticCache.getStats() / getAnalytics()',
      description: 'Returns cache statistics and analytics.',
    },
    {
      name: 'MemoryCacheStore / RedisStoreConfig / TieredStoreConfig',
      description: 'Storage backends for entries: in memory, Redis, or tiered.',
    },
  ],
  caveats: [
    'Semantic matching needs @lov3kaizen/agentsea-embeddings, installed as an optional peer.',
    'The Redis store needs a running Redis server. The Pinecone store needs an API key and an index.',
    'The default match strategy is hybrid. The first example sets exact explicitly.',
    'The package does not say where its pricing data comes from. Check savings figures against your own rates.',
  ],
};

const toc = [
  { id: 'matching', label: 'Matching strategies' },
  { id: 'wrap-options', label: 'Wrap options' },
  { id: 'invalidation', label: 'Invalidation' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="matching" num="05" title="Matching strategies">
        <p className="text-base leading-relaxed text-brand-navy">
          The strategy decides how a new request is matched against stored entries. <code>ExactMatchStrategy</code> uses a hash of the request.{' '}
          <code>SemanticMatchStrategy</code> compares embeddings and needs a <code>SimilarityEngine</code>. <code>HybridMatchStrategy</code> tries exact first, then semantic.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { SemanticCache, MemoryCacheStore, HybridMatchStrategy, SimilarityEngine } from '@lov3kaizen/agentsea-cache';
import { createEmbeddingManager, createOpenAIProvider } from '@lov3kaizen/agentsea-embeddings';

const embeddings = createEmbeddingManager({ defaultProvider: 'openai', defaultModel: 'text-embedding-3-small' });
embeddings.registerModel(
  createOpenAIProvider({ type: 'openai', apiKey: process.env.OPENAI_API_KEY!, model: 'text-embedding-3-small' }),
  true,
);

// SimilarityEngine takes an object with embed(text) returning the vector.
const similarity = new SimilarityEngine({
  provider: { embed: async (text) => (await embeddings.embed(text)).vector },
  cacheEmbeddings: true,
});
const cache = new SemanticCache(
  { defaultTTL: 3600, similarityThreshold: 0.92, matchStrategy: 'hybrid' },
  new MemoryCacheStore({ type: 'memory' }),
  new HybridMatchStrategy(),
  similarity,
);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          When a semantic match is found, <code>response._cache</code> reports the hit and the similarity score.
        </p>
      </DocSection>

      <DocSection id="wrap-options" num="06" title="Wrap options">
        <p className="text-base leading-relaxed text-brand-navy">
          Each <code>wrap</code> call takes options that override the cache defaults for that call only.
        </p>
        <ApiList>
          <ApiRow name="ttl">Seconds to keep this entry. Overrides defaultTTL.</ApiRow>
          <ApiRow name="tags">Labels for grouped invalidation with invalidateByTags.</ApiRow>
          <ApiRow name="namespace">Stores the entry under a namespace.</ApiRow>
          <ApiRow name="skipCache">Calls the function and does not read or write the cache.</ApiRow>
          <ApiRow name="forceRefresh">Skips the lookup, calls the function and stores the new response.</ApiRow>
        </ApiList>
        <CodeBlock
          lang="TS"
          code={`const response = await cache.wrap(request, llmCall, { ttl: 1800, tags: ['support', 'faq'] });`}
        />
      </DocSection>

      <DocSection id="invalidation" num="07" title="Invalidation">
        <CodeBlock
          lang="TS"
          code={`// Remove entries whose keys match a pattern
await cache.invalidateByPattern(/^user:123:/);

// Remove all entries tagged 'faq'
await cache.invalidateByTags(['faq']);

// Delete a single key, or clear everything
await cache.delete(key);
await cache.clear();`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          <code>invalidateByPattern</code> takes a regular expression, not a string glob.
        </p>
      </DocSection>
    </PackagePage>
  );
}
