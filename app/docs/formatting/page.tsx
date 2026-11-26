import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'Formatting | AgentSea',
  description:
    'Ask an agent for text, Markdown, HTML or React output, and read the formatted field on the response.',
};

const toc = [
  { id: 'output-formats', label: 'Output formats' },
  { id: 'agent-format', label: 'Set the format on an agent' },
  { id: 'format-options', label: 'Format options' },
  { id: 'format-string', label: 'Format a string directly' },
  { id: 'per-request', label: 'Override the format per request' },
  { id: 'react-components', label: 'React components' },
  { id: 'styling', label: 'Styling' },
];

export default function FormattingPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="Formatting"
      lead="Ask an agent for text, Markdown, HTML or React output, and read the formatted field on the response."
      active="guides"
      toc={toc}
    >
      <DocSection id="output-formats" num="01" title="Output formats">
        <BulletPanel
          items={[
            <>
              <code>text</code>: plain text with no processing. This is the default.
            </>,
            <>
              <code>markdown</code>: keeps the Markdown and adds metadata about code blocks, tables, lists and links.
            </>,
            <>
              <code>html</code>: converts Markdown to HTML, with optional sanitizing, a code highlighting class and a
              theme wrapper.
            </>,
            <>
              <code>react</code>: HTML with <code>data-component</code> attributes, for hydration in React.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="agent-format" num="02" title="Set the format on an agent">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>outputFormat</code> and <code>formatOptions</code> are agent config fields. When the format is not{' '}
          <code>text</code>, the response carries a <code>formatted</code> object with <code>raw</code>,{' '}
          <code>format</code>, <code>rendered</code> and <code>metadata</code>. <code>content</code> still holds the
          raw text.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  { name: 'docs-writer', description: 'Writes docs', model: 'claude-sonnet-4-6', provider: 'anthropic', outputFormat: 'markdown', formatOptions: { includeMetadata: true } },
  new AnthropicProvider(),
  new ToolRegistry(),
);

const response = await agent.execute('Explain closures', { conversationId: 'conv-1', sessionData: {}, history: [] });
console.log(response.formatted?.rendered, response.formatted?.metadata);`}
        />
      </DocSection>

      <DocSection id="format-options" num="03" title="Format options">
        <BulletPanel
          items={[
            <>
              <code>includeMetadata</code>: adds <code>hasCodeBlocks</code>, <code>hasTables</code>,{' '}
              <code>hasLists</code> and <code>links</code>.
            </>,
            <>
              <code>sanitizeHtml</code> removes <code>&lt;script&gt;</code> tags and <code>javascript:</code> links in
              <code>href</code> attributes. It applies to <code>html</code> and <code>react</code> output.
            </>,
            <>
              <code>highlightCode</code>: adds the <code>hljs</code> class to code blocks, for highlight.js.
            </>,
            <>
              <code>theme</code>: <code>'light'</code>, <code>'dark'</code> or <code>'auto'</code>. Applies to{' '}
              <code>html</code> output and sets <code>data-theme</code> on the wrapper.
            </>,
          ]}
        />
        <Callout kind="note">
          <code>sanitizeHtml</code> is a pattern-based filter, not an HTML parser. It also strips quoted event handler
          attributes such as <code>onclick=&quot;...&quot;</code>, but it does not catch every form of unsafe markup.
          Turn <code>sanitizeHtml</code> on for any HTML users see, and treat it as a floor, not a complete defence.
        </Callout>
      </DocSection>

      <DocSection id="format-string" num="04" title="Format a string directly">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>ContentFormatter.format(content, format, options)</code> and{' '}
          <code>ContentFormatter.detectFormat(content)</code> work without an agent.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { ContentFormatter } from '@lov3kaizen/agentsea-core';

const formatted = ContentFormatter.format('# Title', 'html', {
  sanitizeHtml: true,
  highlightCode: true,
  theme: 'dark',
});
console.log(formatted.rendered);
console.log(ContentFormatter.detectFormat('<h1>Hello</h1>'));`}
        />
      </DocSection>

      <DocSection id="per-request" num="05" title="Override the format per request">
        <p className="text-base leading-relaxed text-brand-navy">
          The NestJS execute route accepts <code>outputFormat</code> and <code>formatOptions</code> in the request body.
        </p>
        <CodeBlock
          lang="BASH"
          code={`curl -X POST http://localhost:3000/agents/assistant/execute \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Explain async/await", "outputFormat": "html", "formatOptions": {"sanitizeHtml": true}}'`}
        />
        <Callout kind="warning">
          The controller writes the request's format to the shared agent object, so the change stays for later
          requests. Two requests with different formats can overwrite each other. Use a separate agent per format, or
          do not allow per-request formats.
        </Callout>
      </DocSection>

      <DocSection id="react-components" num="06" title="React components">
        <p className="text-base leading-relaxed text-brand-navy">
          The <code>@lov3kaizen/agentsea-react</code> package exports <code>AgentResponse</code>,{' '}
          <code>StreamingResponse</code>, <code>useFormattedContent</code> and <code>useStreamingContent</code>. The
          components ship without styles.
        </p>
        <Callout kind="note">Confirm the props and hook arguments against your react package version.</Callout>
      </DocSection>

      <DocSection id="styling" num="07" title="Styling">
        <p className="text-base leading-relaxed text-brand-navy">
          The sample CSS targets <code>.agentsea-response</code> and the <code>data-theme</code> attribute. Syntax
          highlighting needs highlight.js or a similar library, with its CSS imported in the app.
        </p>
      </DocSection>
    </DocsShell>
  );
}
