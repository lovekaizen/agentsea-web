import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function FormattingPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Content Formatting"
        titleGradient="warm"
        description="Transform agent responses into multiple formats including text, markdown, HTML, and React-compatible output with built-in syntax highlighting, theming, and security features."
      />

      <div className="prose max-w-none">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
          <p className="text-sm text-blue-900 font-semibold mb-2">
            ✨ New Feature
          </p>
          <p className="text-sm text-blue-800">
            Content formatting is now available in @lov3kaizen/agentsea-core
            0.1.0+. It provides automatic conversion of agent responses into
            various formats suitable for web apps, APIs, and user interfaces.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          What is Content Formatting?
        </h2>
        <p className="text-gray-700">
          Content formatting automatically transforms agent responses into
          structured formats optimized for different use cases. Whether you're
          building a web application, REST API, or chat interface, AgentSea can
          format responses with rich content like code blocks, tables, and
          lists.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Supported Output Formats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              📝 Text
            </h3>
            <p className="text-sm text-gray-600">
              Plain text output with no processing. Best for CLI tools and
              simple text interfaces.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              📄 Markdown
            </h3>
            <p className="text-sm text-gray-600">
              Preserves markdown formatting with metadata extraction. Ideal for
              documentation and markdown editors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              🌐 HTML
            </h3>
            <p className="text-sm text-gray-600">
              Fully rendered HTML with syntax highlighting, theming, and
              sanitization. Perfect for web applications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              ⚛️ React
            </h3>
            <p className="text-sm text-gray-600">
              React-compatible HTML with data attributes for component
              hydration. Optimized for React apps.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Quick Start
        </h2>
        <p className="text-gray-700 mb-4">
          Enable formatting by setting the{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">outputFormat</code> in
          your agent configuration:
        </p>

        <CodeBlock language="typescript">
          {`import { Agent, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const provider = new AnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const agent = new Agent(
  {
    name: 'my-agent',
    description: 'Agent with formatting support',
    model: 'claude-3-5-sonnet-20241022',
    provider: 'anthropic',
    outputFormat: 'html', // 'text' | 'markdown' | 'html' | 'react'
    formatOptions: {
      includeMetadata: true,
      sanitizeHtml: true,
      highlightCode: true,
      theme: 'dark',
    },
  },
  provider,
  new ToolRegistry(),
);

const response = await agent.execute('Explain async/await', {
  conversationId: 'conv-1',
  sessionData: {},
  history: [],
});

console.log(response.formatted?.rendered); // HTML output
console.log(response.formatted?.metadata); // Content structure info`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Format Options
        </h2>
        <p className="text-gray-700 mb-4">
          Customize formatting behavior with these options:
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Option
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  includeMetadata
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  boolean
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Extract metadata about content structure (code blocks, tables,
                  lists, links)
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  sanitizeHtml
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  boolean
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Remove potentially dangerous HTML (script tags, event
                  handlers, javascript: protocol)
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  highlightCode
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  boolean
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Add syntax highlighting classes to code blocks (works with
                  highlight.js)
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  theme
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  string
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Apply theme wrapper: 'light', 'dark', or 'auto'
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Response Structure
        </h2>
        <p className="text-gray-700 mb-4">
          When formatting is enabled, the response includes a{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">formatted</code>{' '}
          field:
        </p>

        <CodeBlock language="json">
          {`{
  content: "# Title\\n\\n**Bold text**...",
  formatted: {
    raw: "# Title\\n\\n**Bold text**...",
    format: "html",
    rendered: "<div class=\\"agentsea-content\\" data-theme=\\"dark\\">...</div>",
    metadata: {
      hasCodeBlocks: true,
      hasTables: false,
      hasLists: true,
      links: [{ text: "Link", url: "https://..." }]
    }
  },
  metadata: {
    tokensUsed: 1234,
    latencyMs: 2000,
    iterations: 1
  }
}`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Using with React
        </h2>
        <p className="text-gray-700 mb-4">
          The{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">
            @lov3kaizen/agentsea-react
          </code>{' '}
          package provides ready-to-use components:
        </p>

        <CodeBlock language="typescript">
          {`import { AgentResponse } from '@lov3kaizen/agentsea-react';

function MyComponent({ response }) {
  return (
    <AgentResponse
      response={response}
      showMetadata={true}
      theme="dark"
      components={{
        // Custom component overrides
        code: ({ className, children }) => (
          <MyCustomCode className={className}>
            {children}
          </MyCustomCode>
        ),
      }}
    />
  );
}`}
        </CodeBlock>

        <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">
          Streaming Responses
        </h3>
        <p className="text-gray-700 mb-4">
          Render responses as they stream with the{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">
            StreamingResponse
          </code>{' '}
          component:
        </p>

        <CodeBlock language="typescript">
          {`import { StreamingResponse } from '@lov3kaizen/agentsea-react';

function MyStreamingComponent() {
  const [stream, setStream] = useState(null);

  const startStream = async () => {
    const streamGenerator = agent.executeStream(input, context);
    setStream(streamGenerator);
  };

  return (
    <StreamingResponse
      stream={stream}
      showMetadata={true}
      theme="dark"
      onComplete={(content) => console.log('Done:', content)}
    />
  );
}`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Using with NestJS
        </h2>
        <p className="text-gray-700 mb-4">
          Configure formatting in your agent decorator:
        </p>

        <CodeBlock language="typescript">
          {`import { AgentDecorator } from '@lov3kaizen/agentsea-nestjs';

@AgentDecorator({
  name: 'documentation-agent',
  description: 'Agent that generates formatted documentation',
  model: 'claude-3-5-sonnet-20241022',
  provider: 'anthropic',
  outputFormat: 'html',
  formatOptions: {
    includeMetadata: true,
    sanitizeHtml: true,
    highlightCode: true,
    theme: 'dark',
  },
})
class DocumentationAgent {}`}
        </CodeBlock>

        <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">
          Runtime Format Override
        </h3>
        <p className="text-gray-700 mb-4">
          Override the format in API requests:
        </p>

        <CodeBlock language="typescript">
          {`// POST /api/agent/execute
{
  "input": "Explain async/await with code examples",
  "outputFormat": "html",
  "formatOptions": {
    "includeMetadata": true,
    "sanitizeHtml": true,
    "highlightCode": true,
    "theme": "dark"
  }
}`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Manual Formatting
        </h2>
        <p className="text-gray-700 mb-4">
          Use the{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">
            ContentFormatter
          </code>{' '}
          utility for manual formatting:
        </p>

        <CodeBlock language="typescript">
          {`import { ContentFormatter } from '@lov3kaizen/agentsea-core';

// Format content
const formatted = ContentFormatter.format(
  '# Title\\n\\nSome **markdown** content',
  'html',
  {
    includeMetadata: true,
    sanitizeHtml: true,
    highlightCode: true,
    theme: 'dark',
  }
);

console.log(formatted.rendered); // HTML output
console.log(formatted.metadata); // Content structure info

// Detect format
const detectedFormat = ContentFormatter.detectFormat('<h1>Hello</h1>');
console.log(detectedFormat); // 'html'`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Security Features
        </h2>
        <p className="text-gray-700 mb-4">
          When{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">sanitizeHtml</code> is
          enabled, the formatter removes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8">
          <li>
            <code className="bg-gray-100 px-2 py-1 rounded">
              &lt;script&gt;
            </code>{' '}
            tags and inline scripts
          </li>
          <li>
            Event handlers like{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">onclick</code>,{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">onload</code>, etc.
          </li>
          <li>
            <code className="bg-gray-100 px-2 py-1 rounded">javascript:</code>{' '}
            protocol in links
          </li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-8">
          <p className="text-sm text-yellow-900 font-semibold mb-2">
            ⚠️ Security Best Practice
          </p>
          <p className="text-sm text-yellow-800">
            Always enable{' '}
            <code className="bg-yellow-100 px-2 py-1 rounded">
              sanitizeHtml: true
            </code>{' '}
            when displaying HTML content to users to prevent XSS attacks.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Content Metadata
        </h2>
        <p className="text-gray-700 mb-4">
          When{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">includeMetadata</code>{' '}
          is enabled, you get information about the content structure:
        </p>

        <CodeBlock language="typescript">
          {`const response = await agent.execute(input, context);

if (response.formatted?.metadata?.hasCodeBlocks) {
  // Load syntax highlighting library
  import('highlight.js/styles/github-dark.css');
}

if (response.formatted?.metadata?.hasTables) {
  // Enable table styling
  enableTableStyles();
}

// Access extracted links
response.formatted?.metadata?.links?.forEach(link => {
  console.log(\`Found link: \${link.text} -> \${link.url}\`);
});`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Use Cases
        </h2>

        <div className="space-y-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              📱 Chat Applications
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Use markdown or HTML format for rich chat messages with code
              blocks and formatting.
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              outputFormat: 'markdown'
            </code>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              🌐 Web Applications
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Use HTML format with theming and syntax highlighting for web
              display.
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              outputFormat: 'html'
            </code>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              ⚛️ React Apps
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Use React format with @lov3kaizen/agentsea-react components for
              seamless integration.
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              outputFormat: 'react'
            </code>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              📝 Documentation Generation
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Use markdown format to generate documentation that can be
              committed to repositories.
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              outputFormat: 'markdown'
            </code>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              🔌 REST APIs
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Let API consumers choose their preferred format via request
              parameters.
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              Runtime override supported
            </code>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Best Practices
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8">
          <li>
            Enable{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">sanitizeHtml</code>{' '}
            for user-facing HTML to prevent XSS attacks
          </li>
          <li>
            Use{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">
              includeMetadata
            </code>{' '}
            to conditionally load resources based on content (e.g., syntax
            highlighters)
          </li>
          <li>
            Choose the right format for your use case: text for CLI, HTML for
            web, React for React apps
          </li>
          <li>
            Use{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">theme: 'auto'</code>{' '}
            to respect user's system preferences
          </li>
          <li>Allow runtime format override in APIs for maximum flexibility</li>
          <li>
            Cache formatted content to avoid reprocessing the same content
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Installation
        </h2>
        <p className="text-gray-700 mb-4">
          Formatting is included in the core package. For React components,
          install the React package:
        </p>

        <CodeBlock language="bash">
          {`# Core package (includes formatting)
pnpm add @lov3kaizen/agentsea-core

# React components (optional)
pnpm add @lov3kaizen/agentsea-react

# For syntax highlighting in HTML
pnpm add highlight.js`}
        </CodeBlock>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">
          Next Steps
        </h2>
        <ul className="space-y-2">
          <li>
            <Link href="/docs/agents" className="text-blue-600 hover:underline">
              → Learn about Agents
            </Link>
          </li>
          <li>
            <Link href="/docs/nestjs" className="text-blue-600 hover:underline">
              → NestJS Integration
            </Link>
          </li>
          <li>
            <Link href="/examples" className="text-blue-600 hover:underline">
              → View Examples
            </Link>
          </li>
          <li>
            <a
              href="https://github.com/lov3kaizen/agentsea/tree/main/examples"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              → Formatting Examples on GitHub
            </a>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
