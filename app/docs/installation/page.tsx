import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Installation | AgentSea',
  description: 'Install the AgentSea packages, set the API keys your providers need, and check the install.',
};

const toc = [
  { id: 'requirements', label: 'Requirements' },
  { id: 'core-package', label: 'Core package' },
  { id: 'add-on-packages', label: 'Add-on packages' },
  { id: 'nestjs', label: 'NestJS integration' },
  { id: 'environment-variables', label: 'API keys and environment' },
  { id: 'verify', label: 'Verify the install' },
  { id: 'next-steps', label: 'Next steps' },
];

const link = 'font-semibold text-brand-deep hover:underline';

export default function InstallationPage() {
  return (
    <DocsShell
      eyebrow="Getting started"
      title="Installation"
      lead="Install the AgentSea packages in a Node.js project, then set the API keys your providers need."
      active="getting-started"
      toc={toc}
    >
      <DocSection id="requirements" num="01" title="Requirements">
        <BulletPanel
          items={[
            'Node.js 20 or later. Node 18 is no longer supported as of v1.0.1.',
            'TypeScript 5.0 or later (recommended).',
            'A package manager: pnpm, npm or yarn.',
          ]}
        />
      </DocSection>

      <DocSection id="core-package" num="02" title="Core package">
        <p className="text-base leading-relaxed text-brand-navy">
          The core package holds the Agent, provider, tool and memory classes. Install it with your package manager.
        </p>
        <CodeBlock
          lang="BASH"
          code={`# pnpm (recommended)
pnpm add @lov3kaizen/agentsea-core

# npm
npm install @lov3kaizen/agentsea-core

# yarn
yarn add @lov3kaizen/agentsea-core`}
        />
        <Callout kind="note">
          Types are re-exported from <code className="font-mono text-sm">@lov3kaizen/agentsea-core</code>. The
          dedicated types package is also available: <code className="font-mono text-sm">pnpm add @lov3kaizen/agentsea-types</code>.
        </Callout>
        <p className="text-base leading-relaxed text-brand-navy">
          For the terminal, install the CLI globally with{' '}
          <code className="font-mono text-sm">pnpm add -g @lov3kaizen/agentsea-cli</code>. It installs the{' '}
          <code className="font-mono text-sm">sea</code> command. Start an{' '}
          <Link href="/docs/cli" className="font-semibold text-brand-deep hover:underline">
            interactive coding session
          </Link>{' '}
          with <code className="font-mono text-sm">sea code</code>.
        </p>
      </DocSection>

      <DocSection id="add-on-packages" num="03" title="Add-on packages">
        <p className="text-base leading-relaxed text-brand-navy">
          AgentSea is a modular monorepo. Install only the packages you need. Each is published under the{' '}
          <code className="font-mono text-sm">@lov3kaizen/agentsea-*</code> scope and is framework-agnostic.
        </p>
        <CodeBlock
          lang="BASH"
          code={`# Orchestration and routing
pnpm add @lov3kaizen/agentsea-crews      # Multi-agent crews
pnpm add @lov3kaizen/agentsea-gateway    # LLM gateway and routing

# Data and retrieval
pnpm add @lov3kaizen/agentsea-memory     # Advanced memory stores
pnpm add @lov3kaizen/agentsea-embeddings # Vector embeddings
pnpm add @lov3kaizen/agentsea-cache      # Semantic response cache
pnpm add @lov3kaizen/agentsea-structured # Zod structured output
pnpm add @lov3kaizen/agentsea-ingest     # Document ingestion
pnpm add @lov3kaizen/agentsea-prompts    # Prompt management

# Safety and evaluation
pnpm add @lov3kaizen/agentsea-guardrails # Safety and validation
pnpm add @lov3kaizen/agentsea-evaluate   # LLM evaluation
pnpm add @lov3kaizen/agentsea-redteam    # Red teaming

# Observability and operations
pnpm add @lov3kaizen/agentsea-analytics  # Conversation analytics
pnpm add @lov3kaizen/agentsea-costs      # Cost tracking
pnpm add @lov3kaizen/agentsea-debugger   # Agent debugger

# Automation and UI
pnpm add @lov3kaizen/agentsea-surf       # Computer-use agent
pnpm add @lov3kaizen/agentsea-react      # React components`}
        />
      </DocSection>

      <DocSection id="nestjs" num="04" title="NestJS integration">
        <p className="text-base leading-relaxed text-brand-navy">
          For a NestJS app, install the NestJS integration with the core package. The integration needs{' '}
          <code className="font-mono text-sm">@nestjs/common</code> and{' '}
          <code className="font-mono text-sm">@nestjs/core</code> version 10 or 11.
        </p>
        <CodeBlock
          lang="BASH"
          code={`# Core and NestJS packages
pnpm add @lov3kaizen/agentsea-core @lov3kaizen/agentsea-nestjs

# Peer dependencies
pnpm add @nestjs/common @nestjs/core reflect-metadata rxjs`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          The{' '}
          <Link href="/docs/nestjs" className="font-semibold text-brand-deep hover:underline">
            NestJS guide
          </Link>{' '}
          covers the AgenticModule setup.
        </p>
      </DocSection>

      <DocSection id="environment-variables" num="05" title="API keys and environment">
        <p className="text-base leading-relaxed text-brand-navy">
          Each provider reads its key from the environment when no key is passed to its constructor. Create a{' '}
          <code className="font-mono text-sm">.env</code> file in your project root, or export the variables in your
          shell.
        </p>
        <ApiList>
          <ApiRow name="ANTHROPIC_API_KEY">Key for AnthropicProvider.</ApiRow>
          <ApiRow name="OPENAI_API_KEY">Key for OpenAIProvider.</ApiRow>
          <ApiRow name="GEMINI_API_KEY">Key for GeminiProvider. GOOGLE_API_KEY is also read.</ApiRow>
          <ApiRow name="OLLAMA_BASE_URL">Server for OllamaProvider. Defaults to http://localhost:11434.</ApiRow>
        </ApiList>
        <CodeBlock
          lang="ENV"
          code={`ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

# Optional, for local models
OLLAMA_BASE_URL=http://localhost:11434`}
        />
        <Callout kind="warning">
          Never commit API keys to version control. Add <code className="font-mono text-sm">.env</code> to your{' '}
          <code className="font-mono text-sm">.gitignore</code> file.
        </Callout>
      </DocSection>

      <DocSection id="verify" num="06" title="Verify the install">
        <p className="text-base leading-relaxed text-brand-navy">
          Save a short script that creates an agent and runs one prompt. Run it with{' '}
          <code className="font-mono text-sm">npx tsx</code>. The{' '}
          <Link href="/docs" className="font-semibold text-brand-deep hover:underline">
            Getting started
          </Link>{' '}
          page has complete examples for cloud and local models.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  { name: 'test-agent', description: 'Install check', model: 'claude-opus-4-8', provider: 'anthropic' },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  new ToolRegistry(),
);

const response = await agent.execute('Hello!', { conversationId: 'test-123', sessionData: {}, history: [] });
console.log(response.content);`}
        />
      </DocSection>

      <DocSection id="next-steps" num="07" title="Next steps">
        <BulletPanel
          items={[
            <>
              <Link href="/docs/quick-start" className={link}>
                Quick start
              </Link>
              : a walkthrough from a first agent to tools, MCP servers and workflows.
            </>,
            <>
              <Link href="/docs/agents" className={link}>
                Agents
              </Link>
              : how to create and configure agents.
            </>,
            <>
              <Link href="/examples" className={link}>
                Examples
              </Link>
              : runnable examples for each feature.
            </>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
