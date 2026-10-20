import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../../components/docs/DocsShell';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import Callout from '../../../components/docs/Callout';
import BulletPanel from '../../../components/docs/BulletPanel';

export const metadata: Metadata = {
  title: 'Embeddings & RAG | AgentSea for Elixir',
  description: 'Embedders, vector stores (pgvector/Qdrant/Pinecone), retrieval, and ingestion.',
};

const toc = [
  { id: 'index-search', label: 'Index & search' },
  { id: 'embedders', label: 'Embedders' },
  { id: 'stores', label: 'Vector stores' },
  { id: 'retrieval-tool', label: 'Give an agent retrieval' },
  { id: 'ingest', label: 'Bulk ingestion' },
  { id: 'next', label: 'Next' },
];

export default function ElixirRagPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="Embeddings & RAG"
      lead="Pluggable embedders and vector stores, a retrieval tool, and a Broadway ingestion pipeline."
      active="packages"
      toc={toc}
    >
      <Callout kind="note">
        <code className="font-mono text-sm">agentsea_embeddings</code> pairs an{' '}
        <code className="font-mono text-sm">Embedder</code> with a <code className="font-mono text-sm">VectorStore</code>{' '}
        behind one handle. Both are behaviours, so adapters swap freely. API on{' '}
        <a href="https://hexdocs.pm/agentsea_embeddings" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-deep underline">
          HexDocs
        </a>
        .
      </Callout>

      <DocSection id="index-search" title="Index & search">
        <CodeBlock
          lang="EX"
          code={`{:ok, store} = AgentSea.VectorStore.Memory.start_link()

handle =
  AgentSea.Embeddings.new(
    store_mod: AgentSea.VectorStore.Memory,
    store: store,
    embedder: AgentSea.Embedder.OpenAI,
    embed_opts: [api_key: System.fetch_env!("OPENAI_API_KEY")]
  )

AgentSea.Embeddings.index(handle, [
  %{id: "refund", text: "Refunds are accepted within 30 days."},
  %{id: "hours",  text: "We are open weekdays, 9 to 5."}
])

[hit | _] = AgentSea.Embeddings.search(handle, "can I get my money back?", 1)
hit.id    # "refund"
hit.score # cosine similarity`}
        />
      </DocSection>

      <DocSection id="embedders" title="Embedders">
        <BulletPanel
          items={[
            <>
              <code className="font-mono text-sm">AgentSea.Embedder.Hashing</code>: dependency-free and deterministic;
              great for tests and dev.
            </>,
            <>
              <code className="font-mono text-sm">AgentSea.Embedder.OpenAI</code> and{' '}
              <code className="font-mono text-sm">AgentSea.Embedder.Cohere</code>: remote, over Req.
            </>,
            <>
              <code className="font-mono text-sm">AgentSea.Embedder.Bumblebee</code>: in-process Hugging Face models via
              Bumblebee and Nx (ships in{' '}
              <a href="https://hexdocs.pm/agentsea_bumblebee" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-deep underline">
                agentsea_bumblebee
              </a>
              ), with no embedding API needed.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="stores" title="Vector stores">
        <p className="text-base leading-relaxed text-brand-navy">The same <code className="font-mono text-sm">handle</code> works over any of four stores:</p>
        <CodeBlock
          lang="EX"
          code={`# In-memory (default; dev/tests)
{:ok, store} = AgentSea.VectorStore.Memory.start_link()

# pgvector (Postgres + the vector extension)
{:ok, conn} = Postgrex.start_link(database: "agentsea", hostname: "localhost")
store = AgentSea.VectorStore.Postgres.store(conn, table: "embeddings", dimensions: 1536)
:ok = AgentSea.VectorStore.Postgres.ensure_table(store)

# Qdrant
store = AgentSea.VectorStore.Qdrant.store(url: "http://localhost:6333", collection: "docs")

# Pinecone
store = AgentSea.VectorStore.Pinecone.store(host: "https://my-index-xxxx.svc.pinecone.io")`}
        />
      </DocSection>

      <DocSection id="retrieval-tool" title="Give an agent retrieval">
        <p className="text-base leading-relaxed text-brand-navy">
          <code className="font-mono text-sm">AgentSea.Embeddings.RetrievalTool</code> is a ready-made{' '}
          <code className="font-mono text-sm">search_knowledge</code> tool. Add it to an agent and pass the embeddings
          handle in the run context, and the agent retrieves on demand:
        </p>
        <CodeBlock
          lang="EX"
          code={`config = %AgentSea.Agent.Config{
  name: :support,
  model: "claude-opus-4-8",
  provider: {AgentSea.Providers.Anthropic, []},
  tools: [AgentSea.Embeddings.RetrievalTool]
}

{:ok, agent} = AgentSea.Agent.start_link(config)
{:ok, answer} = AgentSea.Agent.run(agent, "What's the refund policy?", %{embeddings: handle})`}
        />
      </DocSection>

      <DocSection id="ingest" title="Bulk ingestion">
        <p className="text-base leading-relaxed text-brand-navy">
          For documents at scale, <code className="font-mono text-sm">agentsea_ingest</code> provides a{' '}
          <a href="https://hexdocs.pm/agentsea_ingest" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-deep underline">
            Broadway
          </a>{' '}
          pipeline (chunk, embed, store) with batching and backpressure, writing into any of the stores above. Pair it
          with structured extraction and{' '}
          <a href="https://hexdocs.pm/agentsea_evaluate" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-deep underline">
            agentsea_evaluate
          </a>{' '}
          to measure retrieval quality.
        </p>
      </DocSection>

      <DocSection id="next" title="Next">
        <p className="text-base leading-relaxed text-brand-navy">
          Route generation across providers with the{' '}
          <Link href="/docs/elixir/gateway" className="font-semibold text-brand-deep underline">
            gateway
          </Link>
          , or revisit tools and memory on the{' '}
          <Link href="/docs/elixir/agents" className="font-semibold text-brand-deep underline">
            Agents page
          </Link>
          .
        </p>
      </DocSection>
    </DocsShell>
  );
}
