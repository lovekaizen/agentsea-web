import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function InstallationPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Installation"
        titleGradient="blue"
        description="Get started with AgentSea in your project"
      />

      <div className="prose max-w-none">
        <Section title="Prerequisites" id="prerequisites">
          <p>Before installing AgentSea, ensure you have the following:</p>
          <ul>
            <li>
              <strong>Node.js</strong>: Version 18.0.0 or higher
            </li>
            <li>
              <strong>Package Manager</strong>: npm, pnpm, or yarn
            </li>
            <li>
              <strong>TypeScript</strong>: Version 5.0.0 or higher (recommended)
            </li>
          </ul>
        </Section>

        <Section title="Core Package" id="core-package">
          <p>
            Install the core AgentSea package using your preferred package
            manager:
          </p>

          <CodeBlock language="bash">
            {`# Using pnpm (recommended)
pnpm add @lov3kaizen/agentsea-core

# Using npm
npm install @lov3kaizen/agentsea-core

# Using yarn
yarn add @lov3kaizen/agentsea-core`}
          </CodeBlock>

          <AlertBox type="info">
            <h3 className="text-lg font-semibold mb-2">Types Package</h3>
            <p className="m-0">
              Types are re-exported from <code>@lov3kaizen/agentsea-core</code>, but you can also
              install the dedicated types package for direct imports:{' '}
              <code>pnpm add @lov3kaizen/agentsea-types</code>
            </p>
          </AlertBox>
        </Section>

        <Section title="NestJS Integration" id="nestjs-integration">
          <p>If you're using NestJS, install the NestJS integration package:</p>

          <CodeBlock language="bash">
            {`# Install core and NestJS packages
pnpm add @lov3kaizen/agentsea-core @lov3kaizen/agentsea-nestjs

# Install peer dependencies
pnpm add @nestjs/common @nestjs/core reflect-metadata rxjs`}
          </CodeBlock>
        </Section>

        <Section title="API Keys" id="api-keys">
          <p>You'll need API keys from your chosen LLM provider:</p>

          <h3>Anthropic Claude</h3>
          <ol>
            <li>
              Sign up at{' '}
              <a
                href="https://console.anthropic.com"
                className="text-sky-600 hover:underline"
              >
                console.anthropic.com
              </a>
            </li>
            <li>Navigate to API Keys section</li>
            <li>Create a new API key</li>
            <li>Set the environment variable:</li>
          </ol>

          <CodeBlock language="bash">
            {`export ANTHROPIC_API_KEY=your_api_key_here`}
          </CodeBlock>

          <h3>OpenAI</h3>
          <ol>
            <li>
              Sign up at{' '}
              <a
                href="https://platform.openai.com"
                className="text-sky-600 hover:underline"
              >
                platform.openai.com
              </a>
            </li>
            <li>Navigate to API Keys section</li>
            <li>Create a new API key</li>
            <li>Set the environment variable:</li>
          </ol>

          <CodeBlock language="bash">
            {`export OPENAI_API_KEY=your_api_key_here`}
          </CodeBlock>
        </Section>

        <Section title="Environment Variables" id="environment-variables">
          <p>
            Create a <code>.env</code> file in your project root:
          </p>

          <CodeBlock language="env">
            {`# LLM Provider API Keys
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# Optional: Redis for persistent memory
REDIS_URL=redis://localhost:6379

# Optional: Observability
LOG_LEVEL=info
ENABLE_TRACING=true`}
          </CodeBlock>
        </Section>

        <Section title="Verify Installation" id="verify-installation">
          <p>Create a simple test file to verify your installation:</p>

          <CodeBlock language="typescript">
            {`import { Agent, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';
import type { AgentConfig, AgentContext } from '@lov3kaizen/agentsea-types';

const agent = new Agent(
  {
    name: 'test-agent',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: 'You are a helpful assistant.',
  },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  new ToolRegistry(),
);

const response = await agent.execute('Hello!', {
  conversationId: 'test-123',
  sessionData: {},
  history: [],
});

console.log(response.content);`}
          </CodeBlock>

          <p>Run the file:</p>

          <CodeBlock language="bash">
            {`# If using TypeScript
tsx test.ts

# If using Node.js with ES modules
node test.js`}
          </CodeBlock>
        </Section>

        <Section title="TypeScript Configuration" id="typescript-configuration">
          <p>
            For TypeScript projects, update your <code>tsconfig.json</code>:
          </p>

          <CodeBlock language="json">
            {`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}`}
          </CodeBlock>
        </Section>

        <Section title="Next Steps" id="next-steps">
          <ul>
            <li>
              <Link href="/docs/quick-start">Follow the Quick Start Guide</Link>
            </li>
            <li>
              <Link href="/docs/agents">Learn about Agents</Link>
            </li>
            <li>
              <Link href="/examples">Explore Examples</Link>
            </li>
          </ul>

          <AlertBox type="warning">
            <h3 className="text-lg font-semibold mb-2">Important</h3>
            <p className="m-0">
              Never commit API keys to version control. Always use environment
              variables and add <code>.env</code> to your{' '}
              <code>.gitignore</code> file.
            </p>
          </AlertBox>
        </Section>
      </div>
    </PageContainer>
  );
}
