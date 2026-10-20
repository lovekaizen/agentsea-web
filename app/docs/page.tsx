import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../components/docs/DocsShell';
import DocSection from '../components/docs/DocSection';
import CodeBlock from '../components/docs/CodeBlock';
import BulletPanel from '../components/docs/BulletPanel';
import Callout from '../components/docs/Callout';

export const metadata: Metadata = {
  title: 'Getting started | AgentSea',
  description:
    'Install the AgentSea packages, then run an agent against a cloud model or a local model served by Ollama.',
};

const toc = [
  { id: 'install', label: 'Install' },
  { id: 'cloud-quick-start', label: 'Cloud quick start (Anthropic)' },
  { id: 'local-quick-start', label: 'Local quick start (Ollama)' },
  { id: 'local-agent', label: 'Local agent' },
  { id: 'first-agent-tool', label: 'First agent with a tool' },
  { id: 'next-steps', label: 'Next steps' },
];

export default function GettingStartedPage() {
  return (
    <DocsShell
      eyebrow="Getting started"
      title="Getting started"
      lead="Install the AgentSea packages, then run an agent against a cloud model or a local model served by Ollama."
      active="getting-started"
      toc={toc}
    >
      <DocSection id="install" num="01" title="Install">
        <p className="text-base leading-relaxed text-brand-navy">
          The core package holds the Agent, provider, tool and memory classes. The CLI package installs a command
          named sea.
        </p>
        <p className="text-base leading-relaxed text-brand-navy">
          AgentSea needs Node.js 20 or later. TypeScript 5.0 or later is recommended.
        </p>
        <CodeBlock lang="BASH" code={`pnpm add @lov3kaizen/agentsea-core\npnpm add -g @lov3kaizen/agentsea-cli`} />
        <Callout kind="note">The installed command is sea. Use sea in every command.</Callout>
      </DocSection>

      <DocSection id="cloud-quick-start" num="02" title="Cloud quick start (Anthropic)">
        <p className="text-base leading-relaxed text-brand-navy">
          Set <code className="font-mono text-sm">ANTHROPIC_API_KEY</code> in your environment. AnthropicProvider uses
          it when no key is passed to the constructor.
        </p>
        <p className="text-base leading-relaxed text-brand-navy">
          Save the file as <code className="font-mono text-sm">hello.ts</code> and run it with{' '}
          <code className="font-mono text-sm">npx tsx hello.ts</code>.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  { name: 'assistant', description: 'General assistant', model: 'claude-opus-4-8', provider: 'anthropic' },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  new ToolRegistry(),
);

const response = await agent.execute('Hello!', { conversationId: 'user-123', sessionData: {}, history: [] });
console.log(response.content);`}
        />
      </DocSection>

      <DocSection id="local-quick-start" num="03" title="Local quick start (Ollama)">
        <p className="text-base leading-relaxed text-brand-navy">
          Install Ollama, start its server, and pull a model. The sea CLI can also pull models with{' '}
          <code className="font-mono text-sm">sea model pull llama2</code>.
        </p>
        <p className="text-base leading-relaxed text-brand-navy">
          OllamaProvider reads <code className="font-mono text-sm">OLLAMA_BASE_URL</code>. When that variable is not
          set, it uses <code className="font-mono text-sm">http://localhost:11434</code>.
        </p>
        <CodeBlock lang="BASH" code={`# Terminal 1\nollama serve\n\n# Terminal 2\nollama pull llama2`} />
      </DocSection>

      <DocSection id="local-agent" num="04" title="Local agent">
        <p className="text-base leading-relaxed text-brand-navy">
          Pass the provider to the Agent constructor. The model name must match a model that Ollama has pulled.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, OllamaProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  { name: 'local-assistant', description: 'Local assistant', model: 'llama2', provider: 'ollama' },
  new OllamaProvider({ baseUrl: 'http://localhost:11434' }),
  new ToolRegistry(),
);

const response = await agent.execute('What are three benefits of running models locally?', { conversationId: 'conv-1', sessionData: {}, history: [] });
console.log(response.content);`}
        />
        <Callout kind="warning">
          Do not call agent.registerProvider. Pass the provider to the Agent constructor, as shown here.
        </Callout>
      </DocSection>

      <DocSection id="first-agent-tool" num="05" title="First agent with a tool">
        <p className="text-base leading-relaxed text-brand-navy">
          A tool has a name, a description, a Zod schema for its parameters, and an execute function.
        </p>
        <p className="text-base leading-relaxed text-brand-navy">
          Register the tool in a ToolRegistry so the agent can run it. List the tool in config.tools so the model is
          told that it exists.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, ToolRegistry, calculatorTool } from '@lov3kaizen/agentsea-core';

const tools = new ToolRegistry();
tools.register(calculatorTool);

const agent = new Agent(
  { name: 'math', description: 'Arithmetic helper', model: 'claude-opus-4-8', provider: 'anthropic', tools: [calculatorTool] },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  tools,
);

const response = await agent.execute('What is 42 * 58?', { conversationId: 'math-1', sessionData: {}, history: [] });
console.log(response.content);`}
        />
      </DocSection>

      <DocSection id="next-steps" num="06" title="Next steps">
        <p className="text-base leading-relaxed text-brand-navy">
          Run <code className="font-mono text-sm">sea code</code> for an interactive coding session. It uses 13
          built-in coding tools and accepts <code className="font-mono text-sm">--provider</code>,{' '}
          <code className="font-mono text-sm">--model</code> and <code className="font-mono text-sm">--verbose</code>.
        </p>
        <BulletPanel
          items={[
            <>
              <Link href="/docs/concepts" className="font-semibold text-brand-deep hover:underline">
                Concepts
              </Link>
              : agents, providers, tools, memory, crews, guardrails and observability.
            </>,
            <>
              <Link href="/changelog" className="font-semibold text-brand-deep hover:underline">
                Changelog
              </Link>
              : the v0.6.0 release notes.
            </>,
            <>
              <Link href="/docs/providers" className="font-semibold text-brand-deep hover:underline">
                Providers
              </Link>
              : setup for each supported provider.
            </>,
            <>
              <Link href="/docs/local-models" className="font-semibold text-brand-deep hover:underline">
                Local models
              </Link>
              : running agents on Ollama and other local servers.
            </>,
            <>
              <Link href="/docs/cli" className="font-semibold text-brand-deep hover:underline">
                CLI reference
              </Link>
              : all sea commands and options.
            </>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
