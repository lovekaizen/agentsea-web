import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-nestjs | AgentSea',
  description: 'A NestJS module that exposes AgentSea agents over REST and WebSocket endpoints.',
};

const pkg: PackageDoc = {
  slug: 'nestjs',
  name: '@lov3kaizen/agentsea-nestjs',
  summary: 'A NestJS module that exposes AgentSea agents over REST and WebSocket endpoints.',
  version: '1.2.1',
  onNpm: true,
  install: 'npm install @lov3kaizen/agentsea-nestjs @lov3kaizen/agentsea-core',
  example: {
    lang: 'TS',
    code: `import { Module } from '@nestjs/common';
import { AgenticModule } from '@lov3kaizen/agentsea-nestjs';
import { AnthropicProvider } from '@lov3kaizen/agentsea-core';

@Module({
  imports: [
    AgenticModule.forRoot({
      provider: new AnthropicProvider(),
      defaultAgentConfig: { model: 'claude-sonnet-4-6' },
      enableRestApi: true,
      enableWebSocket: true,
    }),
  ],
})
export class AppModule {}`,
  },
  api: [
    {
      name: 'AgenticModule.forRoot(options)',
      description:
        'Registers the module. Options: provider, apiKey, memory, defaultAgentConfig, enableRestApi, enableWebSocket. Both transports are on unless set to false.',
    },
    {
      name: '@AgentDecorator({ name, description, model, provider }) and @ToolDecorator({ name, description })',
      description:
        'Class decorator that declares an agent, and method decorator that exposes a method as a tool. Exported under these names; the package name Agent is the core class.',
    },
    {
      name: 'REST routes (enableRestApi)',
      description:
        'GET /agents, GET /agents/:name, POST /agents/:name/execute, GET /agents/:name/stream (SSE).',
    },
    {
      name: 'WebSocket events (enableWebSocket)',
      description: 'Subscribe to execute, listAgents and getAgent. execute emits stream events back to the client.',
    },
  ],
  caveats: [
    'Requires @lov3kaizen/agentsea-core, plus the NestJS peers @nestjs/common and @nestjs/core, version 10 or 11.',
    'Use defaultAgentConfig. The module reads this option name.',
    'The module does not mount the tenant controller. Tenant routes are not available through AgenticModule.forRoot.',
    'RateLimitGuard and the RateLimit decorator are exported. See section 06 for the options.',
  ],
};

const toc = [
  { id: 'decorators', label: 'Decorators' },
  { id: 'rate-limit', label: 'Rate limiting' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="decorators" num="05" title="Decorators">
        <p className="text-base leading-relaxed text-brand-navy">
          Declare an agent on an injectable class and mark its methods as tools. The decorators are exported as
          AgentDecorator and ToolDecorator.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Injectable } from '@nestjs/common';
import { AgentDecorator, ToolDecorator } from '@lov3kaizen/agentsea-nestjs';

@Injectable()
@AgentDecorator({
  name: 'assistant',
  description: 'A helpful assistant',
  model: 'claude-sonnet-4-6',
  provider: 'anthropic',
})
export class AssistantAgent {
  @ToolDecorator({ name: 'greet', description: 'Greet a user by name' })
  greet(params: { name: string }) {
    return \`Hello, \${params.name}!\`;
  }
}`}
        />
      </DocSection>

      <DocSection id="rate-limit" num="06" title="Rate limiting">
        <p className="text-base leading-relaxed text-brand-navy">
          RateLimit is a method decorator that sets the limit for one route. RateLimitGuard enforces it. Requests are
          counted per key within a time window. Pass keyExtractor to choose the key; without it the guard uses its
          default key.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { UseGuards } from '@nestjs/common';
import { RateLimit, RateLimitGuard } from '@lov3kaizen/agentsea-nestjs';

// maxRequests per windowMs; keyExtractor is optional
@UseGuards(RateLimitGuard)
export class ChatController {
  @RateLimit({ maxRequests: 10, windowMs: 60_000 })
  chat() {
    // route handler
  }
}`}
        />
      </DocSection>
    </PackagePage>
  );
}
