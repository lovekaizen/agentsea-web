import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'NestJS | AgentSea',
  description:
    'Add AgentSea to a NestJS app with AgenticModule, optional REST and WebSocket routes, and decorator-based agents.',
};

const toc = [
  { id: 'install', label: 'Install' },
  { id: 'register-module', label: 'Register the module' },
  { id: 'rest-routes', label: 'REST routes' },
  { id: 'websocket', label: 'WebSocket gateway' },
  { id: 'decorators', label: 'Decorator-defined agents' },
  { id: 'rate-limiting', label: 'Rate limiting' },
  { id: 'tenants', label: 'Tenants' },
];

export default function NestjsGuidePage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="NestJS"
      lead="Add AgentSea to a NestJS app with AgenticModule, optional REST and WebSocket routes, and decorator-based agents."
      active="guides"
      toc={toc}
    >
      <DocSection id="install" num="01" title="Install">
        <p className="text-base leading-relaxed text-brand-navy">
          The NestJS package re-exports everything from the core package, so one import path covers both.
        </p>
        <CodeBlock lang="BASH" code="pnpm add @lov3kaizen/agentsea-nestjs @lov3kaizen/agentsea-core" />
      </DocSection>

      <DocSection id="register-module" num="02" title="Register the module">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>AgenticModule.forRoot</code> takes <code>provider</code> (<code>'anthropic'</code>,{' '}
          <code>'openai'</code> or an <code>LLMProvider</code> instance), <code>apiKey</code>, <code>memory</code>,{' '}
          <code>defaultAgentConfig</code>, <code>enableRestApi</code> and <code>enableWebSocket</code>.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Module } from '@nestjs/common';
import { AgenticModule } from '@lov3kaizen/agentsea-nestjs';

@Module({
  imports: [
    AgenticModule.forRoot({
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      defaultAgentConfig: { model: 'claude-sonnet-4-6', provider: 'anthropic' },
      enableRestApi: true,
      enableWebSocket: true,
    }),
  ],
})
export class AppModule {}`}
        />
        <Callout kind="note">
          Pass the option as <code>defaultAgentConfig</code>. The module accepts it, but nothing in the package reads
          it yet. The REST and WebSocket routes serve only agents registered with{' '}
          <code>AgentService.registerAgent(agent)</code>, so register your agents there.
        </Callout>
      </DocSection>

      <DocSection id="rest-routes" num="03" title="REST routes">
        <p className="text-base leading-relaxed text-brand-navy">
          With <code>enableRestApi</code> set, <code>AgentController</code> serves these routes under{' '}
          <code>/agents</code>:
        </p>
        <BulletPanel
          items={[
            <>
              <code>GET /agents</code>: lists agents.
            </>,
            <>
              <code>GET /agents/:name</code>: returns one agent, including its system prompt.
            </>,
            <>
              <code>POST /agents/:name/execute</code>: runs an agent and returns the full response.
            </>,
            <>
              <code>DELETE /agents/:name/conversations/:conversationId</code>: returns success. It does not delete
              any history yet.
            </>,
            <>
              <code>/agents/:name/stream</code>: streams agent events over Server-Sent Events. See the API reference.
            </>,
          ]}
        />
        <Callout kind="warning">
          The DELETE route returns success without deleting history. Do not rely on it to remove data yet.
        </Callout>
      </DocSection>

      <DocSection id="websocket" num="04" title="WebSocket gateway">
        <p className="text-base leading-relaxed text-brand-navy">
          With <code>enableWebSocket</code> set, <code>AgentGateway</code> serves the <code>/agents</code> Socket.IO
          namespace. Clients send <code>execute</code>, <code>getAgent</code> and <code>listAgents</code>. The server
          replies with <code>stream</code>, <code>complete</code>, <code>agentInfo</code>, <code>agentList</code> and{' '}
          <code>error</code>.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/agents');

socket.emit('listAgents');
socket.on('agentList', (data) => console.log(data.agents));

socket.emit('execute', { agentName: 'assistant', input: 'Hello!' });
socket.on('stream', (event) => {
  if (event.type === 'content') console.log(event.content);
});
socket.on('complete', (data) => console.log(data.conversationId));`}
        />
        <Callout kind="warning">The gateway sets cors origin to &apos;*&apos;. Restrict it before you deploy.</Callout>
      </DocSection>

      <DocSection id="decorators" num="05" title="Decorator-defined agents">
        <p className="text-base leading-relaxed text-brand-navy">
          The package exports <code>AgentDecorator</code> and <code>ToolDecorator</code>. The decorators are named this
          way because the core package already exports <code>Agent</code> and <code>Tool</code>.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Injectable } from '@nestjs/common';
import { AgentDecorator, ToolDecorator } from '@lov3kaizen/agentsea-nestjs';

@Injectable()
@AgentDecorator({ name: 'assistant', description: 'A helpful assistant', model: 'claude-sonnet-4-6', provider: 'anthropic' })
export class AssistantAgent {
  @ToolDecorator({ name: 'greet', description: 'Greet a user by name' })
  greet(params: { name: string }) {
    return \`Hello, \${params.name}!\`;
  }
}`}
        />
        <Callout kind="warning">
          The decorators only attach metadata. Nothing in the package reads it, so a class marked this way is not
          registered as an agent and its tool is not added to the agent. Build the agent in code and pass it to{' '}
          <code>AgentService.registerAgent</code>. The <code>@Tool</code> decorator takes <code>name</code> and{' '}
          <code>description</code> only.
        </Callout>
      </DocSection>

      <DocSection id="rate-limiting" num="06" title="Rate limiting">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>RateLimit</code> stores its options on a method. <code>RateLimitGuard</code> reads them and throws
          HTTP 429 with the message <code>&apos;Rate limit exceeded&apos;</code> when a key is over its limit. The
          default key is the request IP. The built-in routes do not use the guard, so add it to the routes you want
          limited.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RateLimit, RateLimitGuard } from '@lov3kaizen/agentsea-nestjs';

@Controller('custom-agents')
export class CustomAgentsController {
  @Post(':name/run')
  @UseGuards(RateLimitGuard)
  @RateLimit({ maxRequests: 10, windowMs: 60000 })
  run(@Param('name') name: string) {
    return { name };
  }
}`}
        />
      </DocSection>

      <DocSection id="tenants" num="07" title="Tenants">
        <p className="text-base leading-relaxed text-brand-navy">
          The package exports <code>TenantGuard</code>, <code>TenantId</code>, <code>Tenant</code> and{' '}
          <code>TenantController</code>. Setup is described in the multi-tenancy guide.
        </p>
        <Callout kind="warning">
          <code>TenantController</code> has no guard. Protect its routes before exposing them.
        </Callout>
      </DocSection>
    </DocsShell>
  );
}
