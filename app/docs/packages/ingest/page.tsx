import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-ingest | AgentSea',
  description: 'Parses PDF, DOCX, HTML, Markdown, text, CSV, Excel and JSON files, chunks them, and runs them through a RAG pipeline.',
};

const pkg: PackageDoc = {
  slug: 'ingest',
  name: '@lov3kaizen/agentsea-ingest',
  summary:
    'Parses PDF, DOCX, HTML, Markdown, text, CSV, Excel and JSON files, chunks them, and runs them through a pipeline for RAG use.',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-ingest',
  example: {
    lang: 'TS',
    code: `import { createIngester, pipelines } from '@lov3kaizen/agentsea-ingest';

const ingester = createIngester();
const doc = await ingester.ingestFile('./document.pdf');
console.log(\`Extracted \${doc.chunks.length} chunks\`);

const pipeline = pipelines.rag().build();
const result = await pipeline.process({ path: './document.md' });`,
  },
  api: [
    {
      name: 'createIngester({ chunking, concurrency, fileSizeLimit, watchMode })',
      description: 'Creates an ingester with the given options.',
    },
    {
      name: 'ingester.ingestFile(path) / ingestUrl(url) / ingestBuffer(buffer, filename)',
      description: 'Parses one file, URL or buffer into chunks.',
    },
    {
      name: 'ingester.ingestDirectory(path, { recursive, include, exclude })',
      description: 'Parses every matching file in a directory.',
    },
    {
      name: 'pipelines.simple() / full() / rag() / analysis() / ocr()',
      description: 'Prebuilt pipelines, each finished with .build().',
    },
    {
      name: 'createFixedChunker / createRecursiveChunker / createSemanticChunker / createHierarchicalChunker',
      description: 'Chunking strategies.',
    },
  ],
  caveats: [
    'OCR is listed for scanned documents, but the OCR engine is not named.',
    'The example sets a 10 MB file size limit. The default limit is not stated.',
    'The methods for table and image extraction are not described.',
    'createSemanticChunker needs an embedding function you supply. Check the signatures, since some chunkers are called with await and others without.',
  ],
};

const toc = [
  { id: 'formats', label: 'Supported formats' },
  { id: 'watch-mode', label: 'Watch mode' },
  { id: 'events', label: 'Events' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="formats" num="05" title="Supported formats">
        <p className="text-base leading-relaxed text-brand-navy">
          Each format has a parser. The parsers are also exported, so you can call one directly on a buffer.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { createPDFParser } from '@lov3kaizen/agentsea-ingest';
import { readFileSync } from 'fs';

const result = await createPDFParser().parse(readFileSync('./document.pdf'));
console.log(result.text, result.elements, result.tables);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          PDF, DOCX, HTML, Markdown, plain text, CSV, Excel and JSON are supported. The parser classes are
          PDFParser, DOCXParser, HTMLParser, MarkdownParser, TextParser, CSVParser, ExcelParser and JSONParser.
        </p>
      </DocSection>

      <DocSection id="watch-mode" num="06" title="Watch mode">
        <p className="text-base leading-relaxed text-brand-navy">
          With watch mode on, the ingester processes files that are added or changed in the watched paths. Call
          startWatching to begin and stopWatching to stop.
        </p>
        <CodeBlock
          lang="TS"
          code={`const ingester = createIngester({
  watchMode: {
    enabled: true,
    paths: ['./documents'],
    include: ['*.pdf', '*.md'],
    debounceDelay: 1000,
    processExisting: true,
  },
});

ingester.startWatching();`}
        />
      </DocSection>

      <DocSection id="events" num="07" title="Events">
        <p className="text-base leading-relaxed text-brand-navy">
          Pipeline.getEventEmitter returns an emitter. Subscribe with on and a document event type. The three events
          below are emitted for each document.
        </p>
        <CodeBlock
          lang="TS"
          code={`const emitter = pipeline.getEventEmitter();

emitter.on('document:loaded', (event) => console.log('Loaded:', event.documentId));
emitter.on('document:chunked', (event) => console.log('Chunks:', event.chunkCount));
emitter.on('document:completed', (event) => console.log('Completed:', event.document.id));`}
        />
      </DocSection>
    </PackagePage>
  );
}
