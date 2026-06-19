import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function IngestPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Document Ingestion"
        titleGradient="blue"
        description="Document processing pipeline — PDF, DOCX, HTML, Markdown parsing with intelligent chunking, table/image extraction, and OCR."
      />

      <AlertBox type="info" gradient>
        <span>
          The ingest package turns raw documents into clean, chunked, RAG-ready
          content — multi-format parsing, configurable chunking strategies, and
          flexible processing pipelines.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-ingest`}
        </CodeBlock>

        <h2>Quick Start</h2>
        <CodeBlock language="typescript">
          {`import { createIngester, pipelines } from '@lov3kaizen/agentsea-ingest';

// Simple ingestion
const ingester = createIngester();
const doc = await ingester.ingestFile('./document.pdf');
console.log(\`Extracted \${doc.chunks.length} chunks\`);

// RAG-optimized pipeline
const pipeline = pipelines.rag().build();
const result = await pipeline.process({ path: './document.md' });`}
        </CodeBlock>

        <h2>Parsing Documents</h2>
        <p>
          The ingest package ships parsers for every common document format.
          Each parser produces extracted text, structured elements, and tables.
        </p>

        <h3>Supported Formats</h3>
        <div className="overflow-x-auto not-prose mb-8">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 pr-4">Format</th>
                <th className="py-2 pr-4">Parser</th>
                <th className="py-2">Factory</th>
              </tr>
            </thead>
            <tbody>
              {supportedFormats.map((format, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-900">
                    {format.name}
                  </td>
                  <td className="py-2 pr-4 text-gray-600">{format.parser}</td>
                  <td className="py-2 font-mono text-xs text-gray-600">
                    {format.factory}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Direct Parser Usage</h3>
        <p>
          Use a parser factory directly when you want fine-grained control over
          a single document:
        </p>
        <CodeBlock language="typescript">
          {`import {
  createPDFParser,
  createMarkdownParser,
} from '@lov3kaizen/agentsea-ingest';
import { readFileSync } from 'fs';

const pdfParser = createPDFParser();
const buffer = readFileSync('./document.pdf');
const result = await pdfParser.parse(buffer);

console.log(result.text);
console.log(result.elements);
console.log(result.tables);`}
        </CodeBlock>

        <Divider />

        <h2>Chunking Strategies</h2>
        <p>
          Split parsed text into retrieval-friendly chunks using the strategy
          that best fits your content.
        </p>

        <h3>Fixed Size</h3>
        <CodeBlock language="typescript">
          {`import { createFixedChunker } from '@lov3kaizen/agentsea-ingest';

const chunker = createFixedChunker();
const chunks = chunker.chunk(text, {
  maxTokens: 512,
  overlap: 50,
  splitOnSentences: true,
});`}
        </CodeBlock>

        <h3>Recursive</h3>
        <CodeBlock language="typescript">
          {`import { createRecursiveChunker } from '@lov3kaizen/agentsea-ingest';

const chunker = createRecursiveChunker();
const chunks = chunker.chunk(text, {
  maxTokens: 512,
  separators: ['\\n\\n', '\\n', '. ', ' '],
  keepSeparator: true,
});`}
        </CodeBlock>

        <h3>Semantic</h3>
        <p>
          Groups sentences by embedding similarity — pass your embedding model
          via <code>embedFunction</code>:
        </p>
        <CodeBlock language="typescript">
          {`import { createSemanticChunker } from '@lov3kaizen/agentsea-ingest';

const chunker = createSemanticChunker();
const chunks = await chunker.chunk(text, {
  maxTokens: 512,
  similarityThreshold: 0.5,
  embedFunction: async (text) => myEmbeddingModel(text),
});`}
        </CodeBlock>

        <h3>Hierarchical</h3>
        <p>Splits on Markdown headings while preserving parent context:</p>
        <CodeBlock language="typescript">
          {`import { createHierarchicalChunker } from '@lov3kaizen/agentsea-ingest';

const chunker = createHierarchicalChunker();
const chunks = chunker.chunk(markdownText, {
  maxTokens: 512,
  headingLevels: [1, 2, 3],
  includeParentContext: true,
});`}
        </CodeBlock>
        <p>
          Sentence and paragraph chunkers are also available via{' '}
          <code>createSentenceChunker</code> and{' '}
          <code>createParagraphChunker</code>.
        </p>

        <Divider />

        <h2>Table &amp; Image Extraction</h2>
        <p>
          Parsers automatically extract tables and images alongside text. The
          results are exposed as <code>TableData</code> and{' '}
          <code>ImageData</code> on the parse result, and as{' '}
          <code>Element</code> entries on the processed document.
        </p>
        <CodeBlock language="typescript">
          {`import { createPDFParser } from '@lov3kaizen/agentsea-ingest';
import { readFileSync } from 'fs';

const parser = createPDFParser();
const result = await parser.parse(readFileSync('./report.pdf'));

// Extracted tables (TableData[])
for (const table of result.tables) {
  console.log(table);
}

// Document elements include paragraphs, headings, lists, tables, images
console.log(result.elements);`}
        </CodeBlock>

        <Divider />

        <h2>Pipeline Builder</h2>
        <p>
          Compose loading, parsing, cleaning, chunking, and embedding into a
          single configurable pipeline:
        </p>
        <CodeBlock language="typescript">
          {`import { createPipelineBuilder } from '@lov3kaizen/agentsea-ingest';

const pipeline = createPipelineBuilder()
  .withName('my-pipeline')
  .withStages(['load', 'parse', 'clean', 'chunk', 'embed'])
  .withChunking({
    strategy: 'semantic',
    maxTokens: 512,
    overlap: 50,
  })
  .withCleaning({
    operations: ['normalize_whitespace', 'remove_urls', 'trim'],
  })
  .withCallbacks({
    onDocumentComplete: (doc) => console.log(\`Processed: \${doc.id}\`),
  })
  .build();

const result = await pipeline.process({ path: './document.pdf' });`}
        </CodeBlock>

        <h3>Pre-built Pipelines</h3>
        <p>
          The <code>pipelines</code> helper provides ready-made configurations,
          including an OCR pipeline for scanned documents:
        </p>
        <CodeBlock language="typescript">
          {`import { pipelines } from '@lov3kaizen/agentsea-ingest';

// Simple text extraction
const simple = pipelines.simple().build();

// Full processing with all stages
const full = pipelines.full().build();

// RAG-optimized pipeline
const rag = pipelines.rag().build();

// Document analysis (no chunking)
const analysis = pipelines.analysis().build();

// OCR pipeline for scanned documents
const ocr = pipelines.ocr().build();`}
        </CodeBlock>

        <Divider />

        <h2>Ingester</h2>
        <p>
          The <code>Ingester</code> class is a high-level API for ingesting
          files, URLs, buffers, and whole directories:
        </p>
        <CodeBlock language="typescript">
          {`import { createIngester } from '@lov3kaizen/agentsea-ingest';

const ingester = createIngester({
  chunking: {
    strategy: 'recursive',
    maxTokens: 512,
  },
  concurrency: 4,
  fileSizeLimit: 10 * 1024 * 1024, // 10MB
});

// Ingest single file
const doc = await ingester.ingestFile('./document.pdf');

// Ingest from URL
const webDoc = await ingester.ingestUrl('https://example.com/page.html');

// Ingest from buffer
const bufferDoc = await ingester.ingestBuffer(buffer, 'document.pdf');

// Ingest directory
const results = await ingester.ingestDirectory('./documents', {
  recursive: true,
  include: ['*.pdf', '*.docx'],
  exclude: ['draft-*'],
});`}
        </CodeBlock>

        <h3>Watch Mode</h3>
        <p>Automatically process files as they are added or modified:</p>
        <CodeBlock language="typescript">
          {`import { createIngester } from '@lov3kaizen/agentsea-ingest';

const ingester = createIngester({
  watchMode: {
    enabled: true,
    paths: ['./documents'],
    include: ['*.pdf', '*.md'],
    debounceDelay: 1000,
    processExisting: true,
  },
});

ingester.startWatching();
// Files added/modified in ./documents will be automatically processed`}
        </CodeBlock>

        <Divider />

        <h2>Events</h2>
        <p>
          Subscribe to pipeline lifecycle events via the pipeline&apos;s event
          emitter:
        </p>
        <CodeBlock language="typescript">
          {`import { createPipeline } from '@lov3kaizen/agentsea-ingest';

const pipeline = createPipeline(config);
const emitter = pipeline.getEventEmitter();

emitter.on('document:loaded', (event) => {
  console.log(\`Loaded: \${event.documentId}\`);
});

emitter.on('document:chunked', (event) => {
  console.log(\`Created \${event.chunkCount} chunks\`);
});

emitter.on('document:completed', (event) => {
  console.log(\`Completed: \${event.document.id}\`);
});`}
        </CodeBlock>

        <Divider />

        <h2>Embeddings Handoff</h2>
        <p>
          Each <code>ProcessedDocument</code> exposes a list of{' '}
          <code>Chunk</code> objects with text, metadata, and an optional
          embedding field — ready to be embedded and stored in your vector
          store or memory layer:
        </p>
        <CodeBlock language="typescript">
          {`import { createIngester } from '@lov3kaizen/agentsea-ingest';
import type { ProcessedDocument, Chunk } from '@lov3kaizen/agentsea-ingest';

const ingester = createIngester();
const doc: ProcessedDocument = await ingester.ingestFile('./document.pdf');

// Hand each chunk to your embeddings model + vector store
for (const chunk of doc.chunks) {
  const text: string = chunk.text;
  // const embedding = await embeddings.embed(text);
  // await vectorStore.upsert({ id: chunk.id, embedding, metadata: chunk.metadata });
}`}
        </CodeBlock>
        <p>
          Alternatively, add an <code>embed</code> stage to your pipeline so
          chunks arrive with embeddings already attached.
        </p>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/embeddings">Generate Embeddings</Link>
          </li>
          <li>
            <Link href="/docs/memory">Store in Memory</Link>
          </li>
          <li>
            <Link href="/docs/structured-output">Structured Output</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const supportedFormats = [
  { name: 'PDF', parser: 'PDFParser', factory: 'createPDFParser' },
  { name: 'DOCX', parser: 'DOCXParser', factory: 'createDOCXParser' },
  { name: 'HTML', parser: 'HTMLParser', factory: 'createHTMLParser' },
  {
    name: 'Markdown',
    parser: 'MarkdownParser',
    factory: 'createMarkdownParser',
  },
  { name: 'Text', parser: 'TextParser', factory: 'createTextParser' },
  { name: 'CSV', parser: 'CSVParser', factory: 'createCSVParser' },
  { name: 'Excel', parser: 'ExcelParser', factory: 'createExcelParser' },
  { name: 'JSON', parser: 'JSONParser', factory: 'createJSONParser' },
];
