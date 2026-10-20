import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-memory | AgentSea',
  description:
    'A memory store and retrieval layer for agents, with in-memory, Redis, PostgreSQL and SQLite backends.',
};

const pkg: PackageDoc = {
  slug: 'memory',
  name: '@lov3kaizen/agentsea-memory',
  summary:
    'A memory store and retrieval layer for agents, with in-memory, Redis, PostgreSQL and SQLite backends.',
  version: '1.2.1',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-memory',
  example: {
    lang: 'TS',
    code: `import { MemoryManager, InMemoryStore } from '@lov3kaizen/agentsea-memory';

const memory = new MemoryManager({ store: new InMemoryStore({ maxSize: 1000 }) });

await memory.add({ content: 'User prefers dark mode', type: 'preference', importance: 0.8 });
const { entries } = await memory.search({ types: ['preference'], limit: 10 });
console.log(entries.length);`,
  },
  api: [
    {
      name: 'MemoryManager({ store, embedding?, retrieval? })',
      description: 'Combines a store with optional embedding and retrieval providers.',
    },
    {
      name: 'MemoryManager.add / search / update / delete / clear',
      description: 'Stores, finds, changes and removes memory entries.',
    },
    {
      name: 'TemporalRetrieval / SemanticRetrieval / HybridRetrieval / RetrievalPipeline',
      description: 'Retrieval strategies: by time, by meaning, a mix of both, or a pipeline of several steps.',
    },
    {
      name: 'PostgresStore({ connectionString, tableName, vectorDimensions })',
      description: 'Stores memory in PostgreSQL. The table name defaults to memories.',
    },
    {
      name: 'AccessControl',
      description: 'Controls which agents can read and write memory that is shared between them.',
    },
  ],
  caveats: [
    'InMemoryStore keeps entries in memory and is meant for development and tests. Its ttl is in milliseconds.',
    'Each backend needs its driver installed: ioredis, pg or better-sqlite3. A PineconeStoreConfig type is exported, but this version has no Pinecone store class.',
    'The README Quick Start imports BufferMemoryStore and RecencyRetrieval. This version exports InMemoryStore and TemporalRetrieval instead.',
    'MemoryManager.retrieve needs an embedding provider set with setEmbedding. Without one it throws. search does not need one.',
  ],
};

export default function Page() {
  return <PackagePage pkg={pkg} />;
}
