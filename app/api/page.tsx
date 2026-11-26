import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../components/docs/DocsShell';
import DocSection from '../components/docs/DocSection';
import CodeBlock from '../components/docs/CodeBlock';
import BulletPanel from '../components/docs/BulletPanel';
import Callout from '../components/docs/Callout';
import { ApiList, ApiRow } from '../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'API reference | AgentSea',
  description:
    'REST routes, Server-Sent Events, WebSocket events, authentication, rate limiting and error handling for the AgentSea NestJS integration.',
};

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'rest-endpoints', label: 'REST endpoints' },
  { id: 'list-agents', label: 'List agents' },
  { id: 'get-agent', label: 'Get an agent' },
  { id: 'execute-agent', label: 'Execute an agent' },
  { id: 'delete-conversation', label: 'Delete a conversation' },
  { id: 'server-sent-events', label: 'Server-Sent Events' },
  { id: 'sse-event-types', label: 'SSE event types' },
  { id: 'stream-route-method', label: 'Stream route method' },
  { id: 'websocket', label: 'WebSocket' },
  { id: 'client-events', label: 'Client events' },
  { id: 'server-events', label: 'Server events' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'rate-limiting', label: 'Rate limiting' },
  { id: 'error-handling', label: 'Error handling' },
  { id: 'request-validation', label: 'Request validation' },
];

const paragraph = 'text-base leading-relaxed text-brand-navy';
const inline = 'font-mono text-sm';

export default function ApiReferencePage() {
  return (
    <DocsShell
      eyebrow="Reference"
      title="AgentSea API reference"
      lead="REST routes, Server-Sent Events, WebSocket events, authentication, rate limiting and error handling for the NestJS integration."
      active="api"
      toc={toc}
    >
      <DocSection id="overview" num="01" title="Overview">
        <p className={paragraph}>
          This page covers the REST, Server-Sent Events and WebSocket routes served by the NestJS integration.
        </p>
        <p className={paragraph}>
          AgenticModule.forRoot registers the REST controller and the WebSocket gateway. Set{' '}
          <code className={inline}>enableRestApi: false</code> or <code className={inline}>enableWebSocket: false</code>{' '}
          to leave out either one.
        </p>
      </DocSection>

      <DocSection id="rest-endpoints" num="02" title="REST endpoints">
        <p className={paragraph}>
          The REST routes are enabled with <code className={inline}>enableRestApi</code>. Successful responses use the
          envelope <code className={inline}>{'{ success, data }'}</code>. The execute route also returns{' '}
          <code className={inline}>conversationId</code> beside <code className={inline}>data</code>, and the delete
          route returns <code className={inline}>message</code> in place of <code className={inline}>data</code>.
        </p>
        <ApiList>
          <ApiRow name="GET /agents">List the registered agents. See section 03.</ApiRow>
          <ApiRow name="GET /agents/:name">Get one agent&apos;s configuration. See section 04.</ApiRow>
          <ApiRow name="POST /agents/:name/execute">Run an agent on one input. See section 05.</ApiRow>
          <ApiRow name="DELETE /agents/:name/conversations/:conversationId">
            Report a conversation as deleted. See section 06.
          </ApiRow>
          <ApiRow name="GET /agents/:name/stream">Stream one run as Server-Sent Events. See section 09.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="list-agents" num="03" title="List agents">
        <BulletPanel
          items={[
            'Each item in data has name, description, model, provider and tools (the tool names).',
          ]}
        />
        <CodeBlock lang="HTTP" code={`GET /agents HTTP/1.1\nHost: localhost:3000`} />
      </DocSection>

      <DocSection id="get-agent" num="04" title="Get an agent">
        <BulletPanel
          items={[
            'data has name, description, model, provider, systemPrompt, tools (name and description for each), temperature, maxTokens and maxIterations.',
            <>
              An unknown name throws an error. See <a href="#error-handling" className="font-semibold text-brand-deep hover:underline">Error handling</a>.
            </>,
          ]}
        />
        <CodeBlock lang="HTTP" code={`GET /agents/customer-support HTTP/1.1\nHost: localhost:3000`} />
      </DocSection>

      <DocSection id="execute-agent" num="05" title="Execute an agent">
        <BulletPanel
          items={[
            'Body fields (ExecuteAgentDto): input (required), conversationId, userId, sessionData, history, metadata, outputFormat and formatOptions.',
            'data is the agent response: content, toolCalls, metadata (tokensUsed, latencyMs, iterations, cost) and finishReason.',
          ]}
        />
        <CodeBlock
          lang="HTTP"
          code={`POST /agents/customer-support/execute HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "input": "I need help with my order #12345",
  "conversationId": "conv-user-123",
  "userId": "user-123",
  "sessionData": { "orderNumber": "12345" },
  "outputFormat": "markdown"
}`}
        />
        <Callout kind="note">
          When conversationId is omitted, the controller uses conv-&lt;timestamp&gt;. outputFormat and formatOptions
          change the shared agent for later requests too. See{' '}
          <Link href="/docs/formatting" className="font-semibold text-brand-deep hover:underline">
            Formatting
          </Link>
          .
        </Callout>
      </DocSection>

      <DocSection id="delete-conversation" num="06" title="Delete a conversation">
        <p className={paragraph}>
          The response is <code className={inline}>{"{ success: true, message: 'Conversation conv-user-123 deleted' }"}</code>.
        </p>
        <CodeBlock
          lang="HTTP"
          code={`DELETE /agents/customer-support/conversations/conv-user-123 HTTP/1.1\nHost: localhost:3000`}
        />
        <Callout kind="warning">
          The handler does not touch any memory store. It reports success, and history stays in place. Do not rely on
          this route to delete data.
        </Callout>
      </DocSection>

      <DocSection id="server-sent-events" num="07" title="Server-Sent Events">
        <p className={paragraph}>
          The stream route sends each agent event as a message whose data is the event object as JSON. Events arrive in
          the order the agent produces them.
        </p>
        <CodeBlock
          lang="TEXT"
          code={`data: {"type":"iteration","iteration":1}

data: {"type":"content","content":"I'd be happy to","delta":true}

data: {"type":"done","metadata":{"tokensUsed":450,"iterations":1}}`}
        />
      </DocSection>

      <DocSection id="sse-event-types" num="08" title="SSE event types">
        <ApiList>
          <ApiRow name="iteration">iteration (number)</ApiRow>
          <ApiRow name="content">content (string), delta (true on streaming chunks)</ApiRow>
          <ApiRow name="tool_calls">toolCalls (array of id, tool, parameters)</ApiRow>
          <ApiRow name="tool_result">toolCall (id, tool, parameters, result)</ApiRow>
          <ApiRow name="done">metadata (tokensUsed, iterations)</ApiRow>
          <ApiRow name="error">error (string)</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="stream-route-method" num="09" title="Stream route method">
        <p className={paragraph}>
          The stream route is declared with <code className={inline}>@Sse</code>, which NestJS registers as GET. The
          handler reads input from the request body, but a browser EventSource cannot send a body. Check the method and
          body your client uses before you build on it.
        </p>
        <CodeBlock
          lang="HTTP"
          code={`GET /agents/customer-support/stream HTTP/1.1
Host: localhost:3000
Accept: text/event-stream
Content-Type: application/json

{"input": "Hello!"}`}
        />
        <Callout kind="note">
          The route is registered as GET only. No POST route streams events. Test the request with the client you plan to
          use before you publish a client.
        </Callout>
      </DocSection>

      <DocSection id="websocket" num="10" title="WebSocket">
        <p className={paragraph}>
          The gateway serves the <code className={inline}>/agents</code> namespace. Connect with Socket.IO. The gateway
          allows any origin (<code className={inline}>&apos;*&apos;</code>). Restrict it before deploying.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/agents');
let text = '';

socket.on('stream', (event) => {
  if (event.type === 'content') text += event.content;
});
socket.on('complete', ({ conversationId }) => console.log(conversationId, text));
socket.on('error', ({ message }) => console.error(message));
socket.emit('execute', { agentName: 'customer-support', input: 'I need help with my order' });`}
        />
      </DocSection>

      <DocSection id="client-events" num="11" title="Client events">
        <ApiList>
          <ApiRow name="execute">
            agentName, input (required); conversationId, userId, sessionData, history, metadata (optional)
          </ApiRow>
          <ApiRow name="getAgent">agentName</ApiRow>
          <ApiRow name="listAgents">none</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="server-events" num="12" title="Server events">
        <ApiList>
          <ApiRow name="stream">An agent event, with the same shapes as the SSE types</ApiRow>
          <ApiRow name="complete">{'{ conversationId }'}</ApiRow>
          <ApiRow name="agentInfo">
            {'{ name, description, model, provider, tools }'}. Here tools is a list of {'{ name, description }'}.
          </ApiRow>
          <ApiRow name="agentList">
            {'{ agents: [{ name, description, model, provider, tools }] }'}. Here tools is a list of names.
          </ApiRow>
          <ApiRow name="error">{'{ message }'}</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="authentication" num="13" title="Authentication">
        <p className={paragraph}>
          Neither the REST routes nor the WebSocket gateway apply a guard by default. Requests reach them without
          authentication unless your app adds guards.
        </p>
        <p className={paragraph}>
          The package includes TenantGuard, which reads the API key from <code className={inline}>x-api-key</code> and
          the tenant from <code className={inline}>x-tenant-id</code> by default. It needs a tenant setup, described in
          the{' '}
          <Link href="/docs/multi-tenancy" className="font-semibold text-brand-deep hover:underline">
            multi-tenancy guide
          </Link>
          .
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Controller, UseGuards } from '@nestjs/common';
import { TenantGuard } from '@lov3kaizen/agentsea-nestjs';

@Controller('agents')
@UseGuards(TenantGuard)
export class ProtectedAgentsController {}`}
        />
        <Callout kind="warning">
          The WebSocket handlers have no guards. Add guards to execute and the other handlers before exposing them.
        </Callout>
      </DocSection>

      <DocSection id="rate-limiting" num="14" title="Rate limiting">
        <p className={paragraph}>
          Use RateLimit on a route and RateLimitGuard on the class or method. RateLimit takes maxRequests, windowMs and
          an optional keyExtractor. The default key is the request IP. A request over the limit gets HTTP 429 with the
          message &apos;Rate limit exceeded&apos;. The built-in routes do not apply the guard.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RateLimit, RateLimitGuard } from '@lov3kaizen/agentsea-nestjs';

@Controller('custom-agents')
export class CustomAgentsController {
  @Post(':name/execute')
  @UseGuards(RateLimitGuard)
  @RateLimit({ maxRequests: 10, windowMs: 60000 })
  run(@Param('name') name: string) {
    return { name };
  }
}`}
        />
        <Callout kind="note">The rate limiter options are maxRequests and windowMs.</Callout>
      </DocSection>

      <DocSection id="error-handling" num="15" title="Error handling">
        <ApiList>
          <ApiRow name="Unknown agent">GET /agents/:name, POST /agents/:name/execute, the stream route</ApiRow>
          <ApiRow name="Rate limit exceeded">Routes with RateLimitGuard</ApiRow>
          <ApiRow name="Run fails, SSE">Stream route</ApiRow>
          <ApiRow name="Unknown agent, WebSocket">execute, getAgent</ApiRow>
          <ApiRow name="Run fails, WebSocket">execute</ApiRow>
        </ApiList>
        <Callout kind="warning">
          Errors are thrown as plain errors. Nest returns HTTP 500 unless the app adds an exception filter. Add a filter
          if you need a custom error body.
        </Callout>
      </DocSection>

      <DocSection id="request-validation" num="16" title="Request validation">
        <p className={paragraph}>
          The DTOs use class-validator decorators. Whether invalid bodies are rejected depends on a validation pipe in
          your app. The package does not set up a validation pipe. Confirm how your app handles invalid bodies.
        </p>
      </DocSection>
    </DocsShell>
  );
}
