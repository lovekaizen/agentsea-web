import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import { ApiList, ApiRow } from '../../../components/docs/ApiList';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-embeddings | AgentSea',
  description:
    'Creates embeddings from OpenAI, Cohere, Voyage, HuggingFace or a custom function, chunks documents, and stores vectors.',
};

const pkg: PackageDoc = {
  slug: 'embeddings',
  name: '@lov3kaizen/agentsea-embeddings',
  summary:
    'Creates embeddings from OpenAI, Cohere, Voyage, HuggingFace or a custom function, chunks documents, and stores vectors.',
  version: '1.2.1',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-embeddings',
  example: {
    lang: 'TS',
    code: `import { createEmbeddingManager, createOpenAIProvider } from '@lov3kaizen/agentsea-embeddings';

const provider = createOpenAIProvider({
  type: 'openai',
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'text-embedding-3-small',
});
const manager = createEmbeddingManager({ defaultModel: 'text-embedding-3-small', defaultProvider: 'openai' });
manager.registerModel(provider, true);

const result = await manager.embed('Hello, world!');
console.log('Dimensions:', result.dimensions);`,
  },
  api: [
    { name: 'createEmbeddingManager(options)', description: 'Creates a manager that holds models, a cache and a store.' },
    {
      name: 'manager.embed(text) / embedBatch(texts) / embedDocument(text)',
      description: 'Creates embeddings for text. embedDocument splits the text with the chunker set by setChunker.',
    },
    { name: 'manager.search(query, { topK, minScore })', description: 'Finds stored vectors that are close to a query.' },
    {
      name: "createOpenAIProvider({ type: 'openai', apiKey, model, dimensions })",
      description:
        'Creates an OpenAI embedding provider. createCohereProvider, createVoyageProvider and createHuggingFaceProvider follow the same pattern.',
    },
    {
      name: 'createRecursiveChunker() / createMarkdownChunker() / createCodeChunker()',
      description: 'Splits documents into chunks before embedding. These factories take no options in this version.',
    },
  ],
  caveats: [
    "createMemoryStore takes type: 'memory' and a dimensions value.",
    'setCache and setStore are typed to the EmbeddingCache and EmbeddingStore interfaces. The results of createMemoryCache and createMemoryStore do not match those types as written in this version, so the README Quick Start does not compile as shown. The example above leaves them out.',
    'createLocalProvider and createSemanticChunker need an embedding function you supply. The examples use placeholders.',
    'The Redis cache needs await cache.connect(), and the SQLite cache needs await cache.init(). Each store needs await store.init().',
    'DriftDetector and createDriftDetector are exported. This page does not cover them.',
  ],
};

const toc = [
  { id: 'providers', label: 'Providers and chunkers' },
  { id: 'caches-stores', label: 'Caches and stores' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="providers" num="05" title="Providers and chunkers">
        <ApiList>
          <ApiRow name="createOpenAIProvider(config)">OpenAI embeddings.</ApiRow>
          <ApiRow name="createCohereProvider(config)">Cohere embeddings.</ApiRow>
          <ApiRow name="createVoyageProvider(config)">Voyage AI embeddings.</ApiRow>
          <ApiRow name="createHuggingFaceProvider(config)">HuggingFace embeddings.</ApiRow>
          <ApiRow name="createLocalProvider(config)">A provider that wraps your own embedding function.</ApiRow>
          <ApiRow name="createRecursiveChunker() / createMarkdownChunker() / createCodeChunker()">
            Chunkers for plain text, Markdown and source code.
          </ApiRow>
          <ApiRow name="createSemanticChunker()">Chunks by meaning. It needs an embedding function.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="caches-stores" num="06" title="Caches and stores">
        <ApiList>
          <ApiRow name="createMemoryCache(options?) / createRedisCache / createSQLiteCache / createTieredCache">
            Caches for embedding results. Use the memory cache for development, and Redis or SQLite to share or keep results.
          </ApiRow>
          <ApiRow name="createMemoryStore(config?)">An in-memory vector store, with optional persistence to a file.</ApiRow>
          <ApiRow name="createPineconeStore / createChromaStore / createQdrantStore / createPgVectorStore / createWeaviateStore / createMilvusStore">
            Vector stores for hosted and self-hosted databases. Each one needs its own client and credentials.
          </ApiRow>
        </ApiList>
      </DocSection>
    </PackagePage>
  );
}
