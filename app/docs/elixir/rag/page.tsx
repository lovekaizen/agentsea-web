import Link from 'next/link';
import PageContainer from '@/app/components/PageContainer';
import { PageHeader, Section, CodeBlock, AlertBox } from '@/app/components/Section';

export const metadata = {
  title: 'Embeddings & RAG — AgentSea for Elixir',
  description: 'Embedders, vector stores (pgvector/Qdrant/Pinecone), retrieval, and ingestion.',
};

export default function ElixirRagPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Embeddings & RAG"
        titleGradient="purple"
        description="Pluggable embedders and vector stores, a retrieval tool, and a Broadway ingestion pipeline."
      />

      <div className="prose max-w-none">
        <AlertBox type="info">
          <p className="m-0">
            <code>agentsea_embeddings</code> pairs an <code>Embedder</code> with a{' '}
            <code>VectorStore</code> behind one handle. Both are behaviours, so adapters
            swap freely. API on{' '}
            <a href="https://hexdocs.pm/agentsea_embeddings" target="_blank" rel="noopener noreferrer">
              HexDocs
            </a>
            .
          </p>
        </AlertBox>

        <Section title="Index & search" id="index-search">
          <CodeBlock language="elixir">
            {`{:ok, store} = AgentSea.VectorStore.Memory.start_link()

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
          </CodeBlock>
        </Section>

        <Section title="Embedders" id="embedders">
          <ul>
            <li><code>AgentSea.Embedder.Hashing</code> — dependency-free, deterministic; great for tests/dev.</li>
            <li><code>AgentSea.Embedder.OpenAI</code> / <code>AgentSea.Embedder.Cohere</code> — remote, over Req.</li>
            <li>
              <code>AgentSea.Embedder.Bumblebee</code> — in-process Hugging Face models via
              Bumblebee + Nx (ships in{' '}
              <a href="https://hexdocs.pm/agentsea_bumblebee" target="_blank" rel="noopener noreferrer">
                agentsea_bumblebee
              </a>
              ), no embedding API needed.
            </li>
          </ul>
        </Section>

        <Section title="Vector stores" id="stores">
          <p>The same <code>handle</code> works over any of four stores:</p>
          <CodeBlock language="elixir">
            {`# In-memory (default; dev/tests)
{:ok, store} = AgentSea.VectorStore.Memory.start_link()

# pgvector (Postgres + the vector extension)
{:ok, conn} = Postgrex.start_link(database: "agentsea", hostname: "localhost")
store = AgentSea.VectorStore.Postgres.store(conn, table: "embeddings", dimensions: 1536)
:ok = AgentSea.VectorStore.Postgres.ensure_table(store)

# Qdrant
store = AgentSea.VectorStore.Qdrant.store(url: "http://localhost:6333", collection: "docs")

# Pinecone
store = AgentSea.VectorStore.Pinecone.store(host: "https://my-index-xxxx.svc.pinecone.io")`}
          </CodeBlock>
        </Section>

        <Section title="Give an agent retrieval" id="retrieval-tool">
          <p>
            <code>AgentSea.Embeddings.RetrievalTool</code> is a ready-made{' '}
            <code>search_knowledge</code> tool. Add it to an agent and pass the embeddings
            handle in the run context — the agent retrieves on demand:
          </p>

          <CodeBlock language="elixir">
            {`config = %AgentSea.Agent.Config{
  name: :support,
  model: "claude-opus-4-8",
  provider: {AgentSea.Providers.Anthropic, []},
  tools: [AgentSea.Embeddings.RetrievalTool]
}

{:ok, agent} = AgentSea.Agent.start_link(config)
{:ok, answer} = AgentSea.Agent.run(agent, "What's the refund policy?", %{embeddings: handle})`}
          </CodeBlock>
        </Section>

        <Section title="Bulk ingestion" id="ingest">
          <p>
            For documents at scale, <code>agentsea_ingest</code> provides a{' '}
            <a href="https://hexdocs.pm/agentsea_ingest" target="_blank" rel="noopener noreferrer">
              Broadway
            </a>{' '}
            pipeline — chunk → embed → store — with batching and backpressure, writing into
            any of the stores above. Pair it with structured extraction and{' '}
            <a href="https://hexdocs.pm/agentsea_evaluate" target="_blank" rel="noopener noreferrer">
              agentsea_evaluate
            </a>{' '}
            to measure retrieval quality.
          </p>
        </Section>

        <Section title="Next" id="next">
          <p>
            Route generation across providers with the{' '}
            <Link href="/docs/elixir/gateway">gateway</Link>, or revisit tools and memory
            on the <Link href="/docs/elixir/agents">Agents page</Link>.
          </p>
        </Section>
      </div>
    </PageContainer>
  );
}
