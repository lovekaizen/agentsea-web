import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'React hooks | AgentSea',
  description:
    'Build AI-powered React applications with the hooks for chat interfaces and agent execution.',
};

const toc = [
  { id: 'installation', label: 'Installation' },
  { id: 'available-hooks', label: 'Available hooks' },
  { id: 'useChat', label: 'useChat' },
  { id: 'useAgent', label: 'useAgent' },
  { id: 'components', label: 'Components' },
  { id: 'adapters', label: 'Connection adapters' },
  { id: 'tool-states', label: 'Tool call states' },
  { id: 'server-setup', label: 'Server-side setup' },
  { id: 'next-steps', label: 'Next steps' },
];

const linkClass = 'text-brand-ocean underline-offset-2 hover:underline';

export default function ReactHooksPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="React hooks"
      lead="Build AI-powered React applications with the hooks for chat interfaces and agent execution."
      active="guides"
      toc={toc}
    >
      <DocSection id="installation" num="01" title="Installation">
        <p className="text-base leading-relaxed text-brand-navy">
          The <code>@lov3kaizen/agentsea-react</code> package provides React hooks and components for building AI chat
          interfaces with streaming support, tool approval workflows, and thinking token visualization.
        </p>
        <CodeBlock lang="BASH" code={`npm install @lov3kaizen/agentsea-react\n# or\npnpm add @lov3kaizen/agentsea-react`} />
      </DocSection>

      <DocSection id="available-hooks" num="02" title="Available hooks">
        <ApiList>
          <ApiRow name="useChat">
            Full-featured chat hook with message management, streaming, tool approval, and thinking token support.
          </ApiRow>
          <ApiRow name="useAgent">Single-shot agent execution for one-off tasks and background operations.</ApiRow>
          <ApiRow name="useFormattedContent">Format agent responses with Markdown rendering and code highlighting.</ApiRow>
          <ApiRow name="useStreamingContent">Optimized streaming content handling with cursor animation.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="useChat" num="03" title="useChat">
        <p className="text-base leading-relaxed text-brand-navy">
          The <code>useChat</code> hook provides full-featured chat functionality with automatic message management,
          streaming support, tool approval workflows, and thinking token visualization.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">Basic usage</h3>
        <CodeBlock
          lang="TSX"
          code={`import { useChat } from '@lov3kaizen/agentsea-react';

function ChatInterface() {
  const {
    messages,
    sendMessage,
    isLoading,
    isStreaming,
    streamingContent,
    error,
  } = useChat({
    endpoint: '/api/chat',
    agentId: 'my-agent',
  });

  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      {/* Message History */}
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={\`message \${msg.role}\`}>
            {msg.content}
          </div>
        ))}

        {/* Streaming Response */}
        {isStreaming && (
          <div className="message assistant streaming">
            {streamingContent}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>

      {error && <div className="error">{error.message}</div>}
    </div>
  );
}`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Configuration options</h3>
        <CodeBlock
          lang="TS"
          code={`interface UseChatConfig {
  /** API endpoint for chat requests */
  endpoint: string;

  /** Unique conversation ID */
  conversationId?: string;

  /** Agent ID to use */
  agentId?: string;

  /** Initial messages to populate the chat */
  initialMessages?: ChatMessage[];

  /** Connection adapter: 'sse' | 'http' | custom adapter */
  adapter?: 'sse' | 'http' | ConnectionAdapter;

  /** Additional headers for requests */
  headers?: Record<string, string>;

  /** Called when a message is received */
  onMessage?: (message: ChatMessage) => void;

  /** Called when streaming content updates */
  onContentUpdate?: (content: string) => void;

  /** Called when a tool needs approval */
  onToolApproval?: (toolCall: TrackedToolCall) => void;

  /** Called on error */
  onError?: (error: Error) => void;

  /** Called when chat completes */
  onComplete?: (response: ChatMessage) => void;

  /** Called when thinking tokens are received */
  onThinking?: (thinking: ThinkingPart) => void;

  /** Enable automatic tool approval (default: false) */
  autoApprove?: boolean;

  /** Maximum retry attempts on failure */
  maxRetries?: number;
}`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Return values</h3>
        <CodeBlock
          lang="TS"
          code={`interface UseChatReturn {
  /** All messages in the conversation */
  messages: ChatMessage[];

  /** Current streaming content (before message is complete) */
  streamingContent: string;

  /** Current thinking content */
  thinkingContent: string;

  /** Active tool calls with their states */
  activeToolCalls: TrackedToolCall[];

  /** Whether a request is in progress */
  isLoading: boolean;

  /** Whether currently streaming */
  isStreaming: boolean;

  /** Current error if any */
  error: Error | null;

  /** Send a message */
  sendMessage: (content: string) => Promise<void>;

  /** Approve a tool call */
  approveToolCall: (toolCallId: string) => void;

  /** Deny a tool call */
  denyToolCall: (toolCallId: string, reason?: string) => void;

  /** Stop the current stream */
  stop: () => void;

  /** Clear all messages */
  clear: () => void;

  /** Reload/regenerate the last response */
  reload: () => Promise<void>;

  /** Set messages directly */
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Tool approval workflow</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          Handle tool approvals to give users control over sensitive operations:
        </p>
        <CodeBlock
          lang="TSX"
          code={`import { useChat } from '@lov3kaizen/agentsea-react';

function ChatWithApproval() {
  const {
    messages,
    sendMessage,
    activeToolCalls,
    approveToolCall,
    denyToolCall,
    isLoading,
  } = useChat({
    endpoint: '/api/chat',
    agentId: 'my-agent',
    onToolApproval: (toolCall) => {
      console.log('Tool needs approval:', toolCall.tool);
    },
  });

  // Find tools awaiting approval
  const pendingApprovals = activeToolCalls.filter(
    (tc) => tc.state === 'approval-requested'
  );

  return (
    <div>
      {/* Messages... */}

      {/* Tool Approval UI */}
      {pendingApprovals.map((toolCall) => (
        <div key={toolCall.id} className="approval-dialog">
          <h4>Tool Request: {toolCall.tool}</h4>
          <p>{toolCall.approvalMessage || 'This tool needs your approval.'}</p>
          <pre>{JSON.stringify(toolCall.parameters, null, 2)}</pre>
          <div className="actions">
            <button onClick={() => approveToolCall(toolCall.id)}>
              Approve
            </button>
            <button onClick={() => denyToolCall(toolCall.id, 'User denied')}>
              Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Thinking token support</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          Display model reasoning (for Claude thinking tokens, o1-style models):
        </p>
        <CodeBlock
          lang="TSX"
          code={`const { thinkingContent } = useChat({
  endpoint: '/api/chat',
  agentId: 'reasoning-agent',
  onThinking: (thinking) => {
    console.log('Model thinking:', thinking.content);
  },
});

// Render thinking content
{thinkingContent && (
  <div className="thinking-bubble">
    <span className="label">Thinking...</span>
    <p>{thinkingContent}</p>
  </div>
)}`}
        />
      </DocSection>

      <DocSection id="useAgent" num="04" title="useAgent">
        <p className="text-base leading-relaxed text-brand-navy">
          The <code>useAgent</code> hook is designed for single-shot agent executions rather than maintaining
          conversation state. Ideal for one-off tasks, background operations, and agent-driven UI interactions.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">Basic usage</h3>
        <CodeBlock
          lang="TSX"
          code={`import { useAgent } from '@lov3kaizen/agentsea-react';

function TaskRunner() {
  const {
    execute,
    executeStream,
    content,
    isLoading,
    error,
    reset,
  } = useAgent({
    endpoint: '/api/agent',
    agentId: 'task-agent',
  });

  const handleAnalyze = async () => {
    const result = await execute('Analyze the sales data from Q4');
    console.log('Analysis complete:', result);
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze Data'}
      </button>

      {content && (
        <div className="result">
          <h3>Analysis Result</h3>
          <p>{content}</p>
        </div>
      )}

      {error && <div className="error">{error.message}</div>}

      <button onClick={reset}>Clear</button>
    </div>
  );
}`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Streaming execution</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          Use the async generator for real-time streaming updates:
        </p>
        <CodeBlock
          lang="TSX"
          code={`import { useAgent } from '@lov3kaizen/agentsea-react';

function StreamingTask() {
  const {
    executeStream,
    content,
    isStreaming,
    stop,
  } = useAgent({
    endpoint: '/api/agent',
    agentId: 'writer-agent',
  });

  const handleGenerate = async () => {
    // executeStream returns an async generator
    for await (const chunk of executeStream('Write a blog post about AI')) {
      // Process each chunk as it arrives
      if (chunk.type === 'content') {
        console.log('New content:', chunk.content);
      }
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isStreaming}>
        Generate
      </button>

      {isStreaming && (
        <button onClick={stop}>Stop</button>
      )}

      <div className="output">{content}</div>
    </div>
  );
}`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Configuration options</h3>
        <CodeBlock
          lang="TS"
          code={`interface UseAgentConfig {
  /** API endpoint for agent requests */
  endpoint: string;

  /** Agent ID to use */
  agentId: string;

  /** Additional headers for requests */
  headers?: Record<string, string>;

  /** Called when agent execution starts */
  onStart?: () => void;

  /** Called when streaming content updates */
  onContentUpdate?: (content: string) => void;

  /** Called when a tool needs approval */
  onToolApproval?: (toolCall: TrackedToolCall) => void;

  /** Called on error */
  onError?: (error: Error) => void;

  /** Called when agent completes */
  onComplete?: (response: AgentResponse) => void;

  /** Called when thinking tokens are received */
  onThinking?: (thinking: ThinkingPart) => void;
}`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Return values</h3>
        <CodeBlock
          lang="TS"
          code={`interface UseAgentReturn {
  /** Execute the agent with input */
  execute: (
    input: string,
    context?: Record<string, unknown>
  ) => Promise<AgentResponse | null>;

  /** Execute the agent with streaming */
  executeStream: (
    input: string,
    context?: Record<string, unknown>
  ) => AsyncGenerator<ChatStreamChunk, void, unknown>;

  /** Current response content */
  content: string;

  /** Current thinking content */
  thinkingContent: string;

  /** Active tool calls with their states */
  activeToolCalls: TrackedToolCall[];

  /** Whether a request is in progress */
  isLoading: boolean;

  /** Whether currently streaming */
  isStreaming: boolean;

  /** Current error if any */
  error: Error | null;

  /** Response metadata */
  metadata: ChatMessage['metadata'] | null;

  /** Approve a tool call */
  approveToolCall: (toolCallId: string) => void;

  /** Deny a tool call */
  denyToolCall: (toolCallId: string, reason?: string) => void;

  /** Stop the current execution */
  stop: () => void;

  /** Reset state */
  reset: () => void;
}`}
        />
      </DocSection>

      <DocSection id="components" num="05" title="Components">
        <h3 className="text-lg font-semibold text-brand-deep">AgentResponse</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          Renders agent responses with full Markdown support, code highlighting, and customizable styling. It takes the
          agent's response object as <code>response</code>.
        </p>
        <CodeBlock
          lang="TSX"
          code={`import { AgentResponse } from '@lov3kaizen/agentsea-react';
import type { AgentResponse as AgentResult } from '@lov3kaizen/agentsea-core';

function ResponseDisplay({ result }: { result: AgentResult }) {
  return (
    <AgentResponse
      response={result}
      className="my-custom-styles"
      showMetadata
      theme="auto"
    />
  );
}`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">StreamingResponse</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          Renders an async stream of agent events as they arrive, with a cursor until the stream completes. It takes
          the stream as <code>stream</code>.
        </p>
        <CodeBlock
          lang="TSX"
          code={`import { StreamingResponse } from '@lov3kaizen/agentsea-react';
import type { StreamEvent } from '@lov3kaizen/agentsea-core';

function LiveResponse({ stream }: { stream: AsyncIterable<StreamEvent> }) {
  return (
    <StreamingResponse
      stream={stream}
      theme="auto"
      onComplete={(content) => console.log('Done:', content.length)}
    />
  );
}`}
        />
      </DocSection>

      <DocSection id="adapters" num="06" title="Connection adapters">
        <p className="text-base leading-relaxed text-brand-navy">
          The hooks support different connection adapters for various backend configurations:
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">Server-Sent Events (SSE)</h3>
        <CodeBlock
          lang="TSX"
          code={`// Default adapter - ideal for streaming
const { sendMessage } = useChat({
  endpoint: '/api/chat',
  adapter: 'sse', // default
});`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">HTTP stream (NDJSON)</h3>
        <CodeBlock
          lang="TSX"
          code={`// Better compatibility for some backends
const { sendMessage } = useChat({
  endpoint: '/api/chat',
  adapter: 'http',
});`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Custom adapter</h3>
        <CodeBlock
          lang="TSX"
          code={`import { createSSEAdapter } from '@lov3kaizen/agentsea-react';

// Create and customize adapter
const myAdapter = createSSEAdapter();

const { sendMessage } = useChat({
  endpoint: '/api/chat',
  adapter: myAdapter,
});`}
        />
      </DocSection>

      <DocSection id="tool-states" num="07" title="Tool call states">
        <p className="text-base leading-relaxed text-brand-navy">Track tool execution through its lifecycle:</p>
        <CodeBlock
          lang="TS"
          code={`type ToolCallState =
  | 'awaiting-input'      // Tool call received but no arguments yet
  | 'input-streaming'     // Partial arguments being received
  | 'input-complete'      // All arguments received, ready to execute
  | 'approval-requested'  // Awaiting user approval
  | 'approval-denied'     // User denied execution
  | 'executing'           // Tool is executing
  | 'result-streaming'    // Result is being streamed
  | 'complete'            // Tool execution complete
  | 'error';              // Tool execution failed`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Tracking tool calls</h3>
        <CodeBlock
          lang="TSX"
          code={`const { activeToolCalls } = useChat({ ... });

// Display tool status
{activeToolCalls.map((tool) => (
  <div key={tool.id} className={\`tool-status \${tool.state}\`}>
    <span>{tool.tool}</span>
    <span className="state">{tool.state}</span>
    {tool.state === 'executing' && <Spinner />}
    {tool.state === 'complete' && <CheckIcon />}
    {tool.state === 'error' && <ErrorIcon />}
  </div>
))}`}
        />
        <Callout kind="note">
          A tracked tool call names its tool in the <code>tool</code> field, the same field as the core{' '}
          <code>ToolCall</code> type.
        </Callout>
      </DocSection>

      <DocSection id="server-setup" num="08" title="Server-side setup">
        <p className="text-base leading-relaxed text-brand-navy">
          Your API endpoint should return SSE or NDJSON formatted chunks. Here is an example NestJS setup:
        </p>
        <CodeBlock
          lang="TS"
          code={`// NestJS controller example
import { AgentService } from '@lov3kaizen/agentsea-nestjs';

@Controller('api')
export class ChatController {
  constructor(private agentService: AgentService) {}

  @Post('chat')
  @Header('Content-Type', 'text/event-stream')
  async chat(@Body() body: ChatRequest, @Res() res: Response) {
    const agent = this.agentService.getAgent(body.agentId);
    const input = body.messages[body.messages.length - 1].content;

    for await (const event of agent.executeStream(input, {
      conversationId: body.conversationId,
      sessionData: {},
      history: [],
    })) {
      res.write(\`data: \${JSON.stringify(event)}\\n\\n\`);
    }

    res.write('data: [DONE]\\n\\n');
    res.end();
  }
}`}
        />
        <Callout kind="warning">
          The example writes the core <code>StreamEvent</code> objects as they are. The hook expects{' '}
          <code>ChatStreamChunk</code> objects, so check the event shapes against your setup before you rely on it.
        </Callout>
      </DocSection>

      <DocSection id="next-steps" num="09" title="Next steps">
        <BulletPanel
          items={[
            <>
              <Link href="/docs/tools" className={linkClass}>
                Learn about isomorphic tools
              </Link>
            </>,
            <>
              <Link href="/docs/agents" className={linkClass}>
                Configure agents
              </Link>
            </>,
            <>
              <Link href="/docs/nestjs" className={linkClass}>
                NestJS integration
              </Link>
            </>,
            <>
              <Link href="/docs/packages/react" className={linkClass}>
                React package reference
              </Link>
            </>,
            <>
              <Link href="/examples" className={linkClass}>
                View examples
              </Link>
            </>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
