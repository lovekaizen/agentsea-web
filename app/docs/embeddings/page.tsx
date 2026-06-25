import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function EmbeddingsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Embeddings"
        titleGradient="purple"
        description="Vector embedding lifecycle management toolkit. Handle versioning, caching, chunking, drift detection, and migration across embedding models."
      />

      <AlertBox type="info" gradient>
        <span>
          The Embeddings package provides multi-provider support, smart chunking
          strategies, and vector store integrations with Pinecone, Chroma,
          Qdrant, pgvector, Weaviate, and Milvus.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-embeddings`}
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
  createEmbeddingManager,
  createOpenAIProvider,
  createMemoryCache,
  createMemoryStore,
} from '@lov3kaizen/agentsea-embeddings';

// Create provider
const provider = createOpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'text-embedding-3-small',
});

// Create manager
const manager = createEmbeddingManager({
  defaultModel: 'text-embedding-3-small',
  defaultProvider: 'openai',
});

// Register provider and configure
manager.registerModel(provider, true);
manager.setCache(createMemoryCache());
manager.setStore(createMemoryStore({ type: 'memory', dimensions: 1536 }));

// Generate embedding
const result = await manager.embed('Hello, world!');
console.log('Dimensions:', result.dimensions);
console.log('Tokens:', result.tokenCount);

// Batch embedding
const batchResult = await manager.embedBatch([
  'First document',
  'Second document',
  'Third document',
]);
console.log('Embedded:', batchResult.results.length, 'documents');`}
        </CodeBlock>

        <h2>Providers</h2>

        <h3>OpenAI</h3>
        <CodeBlock language="typescript">
          {`import { createOpenAIProvider } from '@lov3kaizen/agentsea-embeddings';

const provider = createOpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'text-embedding-3-small', // or 'text-embedding-3-large', 'text-embedding-ada-002'
  dimensions: 1536, // optional dimension reduction for v3 models
});`}
        </CodeBlock>

        <h3>Cohere</h3>
        <CodeBlock language="typescript">
          {`import { createCohereProvider } from '@lov3kaizen/agentsea-embeddings';

const provider = createCohereProvider({
  apiKey: process.env.COHERE_API_KEY!,
  model: 'embed-english-v3.0',
  inputType: 'search_document', // or 'search_query', 'classification', 'clustering'
});`}
        </CodeBlock>

        <h3>Voyage AI</h3>
        <CodeBlock language="typescript">
          {`import { createVoyageProvider } from '@lov3kaizen/agentsea-embeddings';

const provider = createVoyageProvider({
  apiKey: process.env.VOYAGE_API_KEY!,
  model: 'voyage-3', // or 'voyage-code-3', 'voyage-finance-2', etc.
});`}
        </CodeBlock>

        <h3>HuggingFace</h3>
        <CodeBlock language="typescript">
          {`import { createHuggingFaceProvider } from '@lov3kaizen/agentsea-embeddings';

const provider = createHuggingFaceProvider({
  apiKey: process.env.HF_API_KEY!,
  model: 'sentence-transformers/all-MiniLM-L6-v2',
});`}
        </CodeBlock>

        <h3>Local/Custom</h3>
        <CodeBlock language="typescript">
          {`import { createLocalProvider } from '@lov3kaizen/agentsea-embeddings';

const provider = createLocalProvider({
  dimensions: 384,
  name: 'custom-model',
  embedFn: async (texts) => {
    // Your custom embedding logic
    return texts.map((text) => new Array(384).fill(0).map(() => Math.random()));
  },
});`}
        </CodeBlock>

        <h3>Local ONNX Models</h3>
        <p>
          Instead of supplying an <code>embedFn</code>, point{' '}
          <code>modelPath</code> at an ONNX feature-extraction model (a local
          directory or a HuggingFace repo id). The provider loads it via
          Transformers.js and handles tokenization, the ONNX runtime, and
          mean-pooling for you.
        </p>
        <AlertBox type="info">
          <span>
            Loading ONNX models from <code>modelPath</code> requires the
            optional <code>@xenova/transformers</code> dependency. Install it, or
            pass an <code>embedFn</code> instead.
          </span>
        </AlertBox>
        <CodeBlock language="bash">{`pnpm add @xenova/transformers`}</CodeBlock>
        <CodeBlock language="typescript">
          {`import { createLocalProvider } from '@lov3kaizen/agentsea-embeddings';

const provider = createLocalProvider({
  // Local directory or a HuggingFace repo id
  modelPath: 'Xenova/all-MiniLM-L6-v2',
  dimensions: 384,
  normalize: true, // L2-normalize the pooled output (default)
});

// First call lazily loads the ONNX pipeline
const result = await provider.embed('Hello, world!');
console.log('Dimensions:', result.dimensions);`}
        </CodeBlock>

        <h2>Chunking Strategies</h2>

        <h3>Fixed Size</h3>
        <CodeBlock language="typescript">
          {`import { createFixedChunker } from '@lov3kaizen/agentsea-embeddings';

const chunker = createFixedChunker();
const chunks = await chunker.chunk(text, {
  chunkSize: 512,
  chunkOverlap: 50,
});`}
        </CodeBlock>

        <h3>Recursive</h3>
        <CodeBlock language="typescript">
          {`import { createRecursiveChunker } from '@lov3kaizen/agentsea-embeddings';

const chunker = createRecursiveChunker();
const chunks = await chunker.chunk(text, {
  chunkSize: 512,
  separators: ['\\n\\n', '\\n', '. ', ' '],
});`}
        </CodeBlock>

        <h3>Markdown-Aware</h3>
        <CodeBlock language="typescript">
          {`import { createMarkdownChunker } from '@lov3kaizen/agentsea-embeddings';

const chunker = createMarkdownChunker();
const chunks = await chunker.chunk(markdownText, {
  preserveHeaders: true,
  includeHeaderHierarchy: true,
});`}
        </CodeBlock>

        <h3>Code-Aware</h3>
        <CodeBlock language="typescript">
          {`import { createCodeChunker } from '@lov3kaizen/agentsea-embeddings';

const chunker = createCodeChunker();
const chunks = await chunker.chunk(sourceCode, {
  language: 'typescript',
  splitBy: 'function',
  includeImports: true,
});`}
        </CodeBlock>

        <h3>Semantic</h3>
        <CodeBlock language="typescript">
          {`import { createSemanticChunker } from '@lov3kaizen/agentsea-embeddings';

const chunker = createSemanticChunker();
const chunks = await chunker.chunk(text, {
  similarityThreshold: 0.5,
  embeddingFn: async (texts) => provider.embedBatch(texts).then((r) => r.results.map((e) => e.vector)),
});`}
        </CodeBlock>

        <h2>Document Embedding & Search</h2>
        <CodeBlock language="typescript">
          {`import {
  createEmbeddingManager,
  createOpenAIProvider,
  createRecursiveChunker,
} from '@lov3kaizen/agentsea-embeddings';

const manager = createEmbeddingManager();
const provider = createOpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

manager.registerModel(provider, true);
manager.setChunker(createRecursiveChunker());

// Embed a long document
const document = \`
# Introduction

This is a long document that needs to be chunked...

## Section 1

Content for section 1...

## Section 2

Content for section 2...
\`;

const chunks = await manager.embedDocument(document, {
  documentId: 'doc-1',
  source: 'example.md',
  type: 'markdown',
});

console.log('Created', chunks.length, 'chunks');

// Semantic search
const results = await manager.search('What is the main topic?', {
  topK: 5,
  minScore: 0.7,
});

for (const result of results) {
  console.log(\`[\${result.score.toFixed(3)}] \${result.text.slice(0, 100)}...\`);
}`}
        </CodeBlock>

        <h2>Caching</h2>

        <h3>Memory Cache</h3>
        <CodeBlock language="typescript">
          {`import { createMemoryCache } from '@lov3kaizen/agentsea-embeddings';

const cache = createMemoryCache({
  maxEntries: 10000,
  maxAge: 3600000, // 1 hour
});`}
        </CodeBlock>

        <h3>Redis Cache</h3>
        <CodeBlock language="typescript">
          {`import { createRedisCache } from '@lov3kaizen/agentsea-embeddings';

const cache = createRedisCache({
  url: 'redis://localhost:6379',
  keyPrefix: 'emb',
  defaultTTL: 86400, // 24 hours
});

await cache.connect();`}
        </CodeBlock>

        <h3>SQLite Cache</h3>
        <CodeBlock language="typescript">
          {`import { createSQLiteCache } from '@lov3kaizen/agentsea-embeddings';

const cache = createSQLiteCache({
  dbPath: './embeddings.db',
  walMode: true,
});

await cache.init();`}
        </CodeBlock>

        <h3>Tiered Cache</h3>
        <CodeBlock language="typescript">
          {`import { createStandardTieredCache } from '@lov3kaizen/agentsea-embeddings';

const cache = createStandardTieredCache({
  memoryMaxEntries: 1000,
  persistentPath: './embeddings.db',
});`}
        </CodeBlock>

        <h2>Vector Stores</h2>

        <h3>Memory Store</h3>
        <CodeBlock language="typescript">
          {`import { createMemoryStore } from '@lov3kaizen/agentsea-embeddings';

const store = createMemoryStore({
  dimensions: 1536,
  metric: 'cosine',
});`}
        </CodeBlock>

        <h3>Pinecone</h3>
        <CodeBlock language="typescript">
          {`import { createPineconeStore } from '@lov3kaizen/agentsea-embeddings';

const store = createPineconeStore({
  apiKey: process.env.PINECONE_API_KEY!,
  indexName: 'my-index',
  namespace: 'default',
});

await store.init();`}
        </CodeBlock>

        <h3>Chroma</h3>
        <CodeBlock language="typescript">
          {`import { createChromaStore } from '@lov3kaizen/agentsea-embeddings';

const store = createChromaStore({
  url: 'http://localhost:8000',
  collectionName: 'my-collection',
});

await store.init();`}
        </CodeBlock>

        <h3>Qdrant</h3>
        <CodeBlock language="typescript">
          {`import { createQdrantStore } from '@lov3kaizen/agentsea-embeddings';

const store = createQdrantStore({
  url: 'http://localhost:6333',
  collectionName: 'my-collection',
  dimensions: 1536,
});

await store.init();`}
        </CodeBlock>

        <h3>pgvector</h3>
        <AlertBox type="info">
          <span>
            pgvector, Weaviate, and Milvus are constructed through the{' '}
            <code>createStore(type, config)</code> factory and rely on optional
            peer drivers (<code>pg</code>, <code>weaviate-ts-client</code>, and{' '}
            <code>@zilliz/milvus2-sdk-node</code> respectively). Install the
            driver for the backend you use.
          </span>
        </AlertBox>
        <CodeBlock language="bash">{`pnpm add pg`}</CodeBlock>
        <CodeBlock language="typescript">
          {`import { createStore } from '@lov3kaizen/agentsea-embeddings';

const store = createStore('pgvector', {
  type: 'pgvector',
  connectionString: 'postgres://user:pass@localhost:5432/mydb',
  tableName: 'embeddings',
  dimensions: 1536,
  metric: 'cosine',
  indexType: 'hnsw', // or 'ivfflat'
  indexParams: { m: 16, efConstruction: 64 },
});

await store.init();`}
        </CodeBlock>

        <h3>Weaviate</h3>
        <CodeBlock language="bash">{`pnpm add weaviate-ts-client`}</CodeBlock>
        <CodeBlock language="typescript">
          {`import { createStore } from '@lov3kaizen/agentsea-embeddings';

const store = createStore('weaviate', {
  type: 'weaviate',
  url: 'http://localhost:8080',
  apiKey: process.env.WEAVIATE_API_KEY, // optional
  className: 'Document',
  dimensions: 1536,
  metric: 'cosine',
});

await store.init();`}
        </CodeBlock>

        <h3>Milvus</h3>
        <CodeBlock language="bash">{`pnpm add @zilliz/milvus2-sdk-node`}</CodeBlock>
        <CodeBlock language="typescript">
          {`import { createStore } from '@lov3kaizen/agentsea-embeddings';

const store = createStore('milvus', {
  type: 'milvus',
  url: 'http://localhost:19530',
  username: process.env.MILVUS_USER, // optional
  password: process.env.MILVUS_PASSWORD, // optional
  collectionName: 'documents',
  dimensions: 1536,
  metric: 'cosine',
  indexType: 'HNSW', // 'IVF_FLAT' | 'IVF_SQ8' | 'IVF_PQ' | 'HNSW' | 'ANNOY'
});

await store.init();`}
        </CodeBlock>

        <h2>Version Management</h2>
        <CodeBlock language="typescript">
          {`import { createVersionRegistry } from '@lov3kaizen/agentsea-embeddings';

const registry = createVersionRegistry();

// Register versions
const v1 = registry.register({
  name: 'v1',
  provider: 'openai',
  model: 'text-embedding-ada-002',
  dimensions: 1536,
});

const v2 = registry.register({
  name: 'v2',
  provider: 'openai',
  model: 'text-embedding-3-small',
  dimensions: 1536,
});

// Activate version
registry.activate(v2.id);

// Compare versions
const comparison = registry.compare(v1.id, v2.id);
console.log('Migration required:', comparison.migrationRequired);

// Deprecate old version
registry.deprecate(v1.id, 'Replaced by v2', v2.id);`}
        </CodeBlock>

        <h2>Drift Detection</h2>
        <CodeBlock language="typescript">
          {`import { createDriftDetector } from '@lov3kaizen/agentsea-embeddings';

const detector = createDriftDetector({
  driftThreshold: 0.1,
  alertSeverity: 'medium',
});

// Set reference distribution
const referenceEmbeddings = await manager.embedBatch(referenceTexts);
detector.setReference(
  referenceEmbeddings.results.map((r) => r.vector),
  'text-embedding-3-small'
);

// Monitor for drift
detector.on('drift:detected', (result) => {
  console.log('Drift detected!', result.severity, result.driftScore);
});

// Add samples for monitoring
for (const embedding of newEmbeddings) {
  detector.addSample(embedding.vector);
}

// Or detect manually
const currentEmbeddings = await manager.embedBatch(currentTexts);
const driftResult = detector.detect(currentEmbeddings.results.map((r) => r.vector));`}
        </CodeBlock>

        <h2>API Reference</h2>

        <h3>EmbeddingManager</h3>
        <ul>
          <li>
            <code>registerModel(model, isDefault?)</code> - Register an
            embedding model
          </li>
          <li>
            <code>embed(text, options?)</code> - Embed a single text
          </li>
          <li>
            <code>embedBatch(texts, options?)</code> - Embed multiple texts
          </li>
          <li>
            <code>embedDocument(text, options?)</code> - Chunk and embed a
            document
          </li>
          <li>
            <code>search(query, options?)</code> - Search for similar content
          </li>
          <li>
            <code>similarity(text1, text2)</code> - Calculate similarity between
            texts
          </li>
          <li>
            <code>setCache(cache)</code> - Set cache implementation
          </li>
          <li>
            <code>setChunker(chunker)</code> - Set chunker implementation
          </li>
          <li>
            <code>setStore(store)</code> - Set store implementation
          </li>
          <li>
            <code>getStats()</code> - Get embedding statistics
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/memory">Explore Memory Systems</Link>
          </li>
          <li>
            <Link href="/docs/evaluate">Evaluate RAG Quality</Link>
          </li>
          <li>
            <Link href="/docs/observability">Monitor Embedding Performance</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const features = [
  {
    icon: '🔌',
    name: 'Multiple Providers',
    description: 'OpenAI, Cohere, Voyage AI, HuggingFace, and local models',
  },
  {
    icon: '✂️',
    name: 'Smart Chunking',
    description:
      'Fixed, recursive, semantic, markdown-aware, and code-aware strategies',
  },
  {
    icon: '💾',
    name: 'Multi-tier Caching',
    description: 'Memory, Redis, SQLite, and tiered caching',
  },
  {
    icon: '📦',
    name: 'Version Management',
    description: 'Track embedding versions and plan migrations',
  },
  {
    icon: '📊',
    name: 'Drift Detection',
    description: 'Monitor embedding quality and detect distribution drift',
  },
  {
    icon: '🗄️',
    name: 'Vector Stores',
    description:
      'Pinecone, Chroma, Qdrant, pgvector, Weaviate, Milvus, and in-memory adapters',
  },
];
