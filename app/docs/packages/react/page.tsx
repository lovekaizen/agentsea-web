import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-react | AgentSea',
  description: 'React components that render agent response text as formatted markdown.',
};

const pkg: PackageDoc = {
  slug: 'react',
  name: '@lov3kaizen/agentsea-react',
  summary: 'React components that render agent response text as formatted markdown.',
  onNpm: true,
  install: 'npm install @lov3kaizen/agentsea-react @lov3kaizen/agentsea-core react react-dom',
  installNote: 'Install the package with its core peer and React. The package also works with pnpm and yarn.',
  example: {
    lang: 'TSX',
    code: `import type { AgentResponse as AgentResponseType } from '@lov3kaizen/agentsea-core';
import { AgentResponse } from '@lov3kaizen/agentsea-react';

function ChatMessage({ message }: { message: AgentResponseType }) {
  return <AgentResponse response={message} />;
}`,
  },
  api: [
    {
      name: 'AgentResponse',
      description:
        'Renders a core AgentResponse as markdown. Props: response (required), className, showMetadata, theme, components.',
    },
    {
      name: 'StreamingResponse',
      description: 'Renders a stream of events as it arrives. Props: stream (AsyncIterable of StreamEvent), className, showMetadata, theme, onComplete.',
    },
    {
      name: 'useFormattedContent(content, format?)',
      description: "Hook exported alongside AgentResponse. Returns the formatted content, or null while it is computed.",
    },
    {
      name: 'useStreamingContent()',
      description: 'Hook exported alongside StreamingResponse. Returns content, isStreaming, metadata and consumeStream(stream).',
    },
  ],
  caveats: [
    'Peer dependencies: react and react-dom, versions 18 or 19.',
    'Requires Node.js 20 or later (engines field). The theme prop accepts light, dark or auto.',
    'Markdown rendering passes raw HTML through (rehype-raw). Sanitise untrusted model output before rendering. Formatted html content is set with dangerouslySetInnerHTML.',
    'The package also exports the useChat and useAgent hooks and connection adapters. They are covered in the React hooks guide.',
  ],
};

const toc = [
  { id: 'streaming', label: 'Streaming' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="streaming" num="05" title="Streaming">
        <p className="text-base leading-relaxed text-brand-navy">
          StreamingResponse takes an async iterable of stream events from the core package. It shows the text as it
          arrives and calls onComplete with the final content.
        </p>
        <CodeBlock
          lang="TSX"
          code={`import { StreamingResponse } from '@lov3kaizen/agentsea-react';

<StreamingResponse
  stream={eventStream}
  showMetadata
  onComplete={(content) => console.log('Done', content.length)}
/>;`}
        />
      </DocSection>
    </PackagePage>
  );
}
