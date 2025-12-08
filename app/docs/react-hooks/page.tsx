import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function ReactHooksPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="React Hooks"
        titleGradient="warm"
        description="Build powerful AI-powered React applications with our hooks for chat interfaces and agent execution."
      />

      <div className="prose max-w-none">
        <AlertBox type="info">
          The <code>@lov3kaizen/agentsea-react</code> package provides React
          hooks and components for building AI chat interfaces with streaming
          support, tool approval workflows, and thinking token visualization.
        </AlertBox>

        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`npm install @lov3kaizen/agentsea-react
# or
pnpm add @lov3kaizen/agentsea-react`}
        </CodeBlock>

        <h2>Available Hooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
          {hooks.map((hook, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{hook.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-mono">
                    {hook.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {hook.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        <h2 id="useChat">useChat</h2>
        <p>
          The <code>useChat</code> hook provides full-featured chat
          functionality with automatic message management, streaming support,
          tool approval workflows, and thinking token visualization.
        </p>

        <h3>Basic Usage</h3>
        <CodeBlock language="tsx">
          {`import { useChat } from '@lov3kaizen/agentsea-react';

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
        </CodeBlock>

        <h3>Configuration Options</h3>
        <CodeBlock language="typescript">
          {`interface UseChatConfig {
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
        </CodeBlock>

        <h3>Return Values</h3>
        <CodeBlock language="typescript">
          {`interface UseChatReturn {
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
        </CodeBlock>

        <h3>Tool Approval Workflow</h3>
        <p>
          Handle tool approvals to give users control over sensitive operations:
        </p>
        <CodeBlock language="tsx">
          {`import { useChat } from '@lov3kaizen/agentsea-react';

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
      console.log('Tool needs approval:', toolCall.name);
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
          <h4>Tool Request: {toolCall.name}</h4>
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
        </CodeBlock>

        <h3>Thinking Token Support</h3>
        <p>Display model reasoning (for Claude thinking tokens, o1-style models):</p>
        <CodeBlock language="tsx">
          {`const { thinkingContent, onThinking } = useChat({
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
        </CodeBlock>

        <Divider />

        <h2 id="useAgent">useAgent</h2>
        <p>
          The <code>useAgent</code> hook is designed for single-shot agent
          executions rather than maintaining conversation state. Ideal for
          one-off tasks, background operations, and agent-driven UI
          interactions.
        </p>

        <h3>Basic Usage</h3>
        <CodeBlock language="tsx">
          {`import { useAgent } from '@lov3kaizen/agentsea-react';

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
        </CodeBlock>

        <h3>Streaming Execution</h3>
        <p>Use the async generator for real-time streaming updates:</p>
        <CodeBlock language="tsx">
          {`import { useAgent } from '@lov3kaizen/agentsea-react';

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
        </CodeBlock>

        <h3>Configuration Options</h3>
        <CodeBlock language="typescript">
          {`interface UseAgentConfig {
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
        </CodeBlock>

        <h3>Return Values</h3>
        <CodeBlock language="typescript">
          {`interface UseAgentReturn {
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
        </CodeBlock>

        <Divider />

        <h2 id="components">Components</h2>

        <h3>AgentResponse</h3>
        <p>
          Renders agent responses with full Markdown support, code highlighting,
          and customizable styling:
        </p>
        <CodeBlock language="tsx">
          {`import { AgentResponse } from '@lov3kaizen/agentsea-react';

function ResponseDisplay({ content }: { content: string }) {
  return (
    <AgentResponse
      content={content}
      className="my-custom-styles"
      codeTheme="github-dark"
    />
  );
}`}
        </CodeBlock>

        <h3>StreamingResponse</h3>
        <p>Optimized for rendering streaming content with cursor animation:</p>
        <CodeBlock language="tsx">
          {`import { StreamingResponse } from '@lov3kaizen/agentsea-react';

function LiveResponse({ content, isStreaming }: Props) {
  return (
    <StreamingResponse
      content={content}
      isStreaming={isStreaming}
      showCursor={true}
    />
  );
}`}
        </CodeBlock>

        <Divider />

        <h2 id="adapters">Connection Adapters</h2>
        <p>
          The hooks support different connection adapters for various backend
          configurations:
        </p>

        <h3>Server-Sent Events (SSE)</h3>
        <CodeBlock language="tsx">
          {`// Default adapter - ideal for streaming
const { sendMessage } = useChat({
  endpoint: '/api/chat',
  adapter: 'sse', // default
});`}
        </CodeBlock>

        <h3>HTTP Stream (NDJSON)</h3>
        <CodeBlock language="tsx">
          {`// Better compatibility for some backends
const { sendMessage } = useChat({
  endpoint: '/api/chat',
  adapter: 'http',
});`}
        </CodeBlock>

        <h3>Custom Adapter</h3>
        <CodeBlock language="tsx">
          {`import { createSSEAdapter } from '@lov3kaizen/agentsea-react';

// Create and customize adapter
const myAdapter = createSSEAdapter();

const { sendMessage } = useChat({
  endpoint: '/api/chat',
  adapter: myAdapter,
});`}
        </CodeBlock>

        <Divider />

        <h2 id="tool-states">Tool Call States</h2>
        <p>Track tool execution through its lifecycle:</p>

        <CodeBlock language="typescript">
          {`type ToolCallState =
  | 'awaiting-input'      // Tool call received but no arguments yet
  | 'input-streaming'     // Partial arguments being received
  | 'input-complete'      // All arguments received, ready to execute
  | 'approval-requested'  // Awaiting user approval
  | 'approval-denied'     // User denied execution
  | 'executing'           // Tool is executing
  | 'result-streaming'    // Result is being streamed
  | 'complete'            // Tool execution complete
  | 'error';              // Tool execution failed`}
        </CodeBlock>

        <h3>Tracking Tool Calls</h3>
        <CodeBlock language="tsx">
          {`const { activeToolCalls } = useChat({ ... });

// Display tool status
{activeToolCalls.map((tool) => (
  <div key={tool.id} className={\`tool-status \${tool.state}\`}>
    <span>{tool.name}</span>
    <span className="state">{tool.state}</span>
    {tool.state === 'executing' && <Spinner />}
    {tool.state === 'complete' && <CheckIcon />}
    {tool.state === 'error' && <ErrorIcon />}
  </div>
))}`}
        </CodeBlock>

        <Divider />

        <h2>Server-Side Setup</h2>
        <p>
          Your API endpoint should return SSE or NDJSON formatted chunks. Here's
          an example NestJS setup:
        </p>

        <CodeBlock language="typescript">
          {`// NestJS controller example
import { AgentService } from '@lov3kaizen/agentsea-nestjs';

@Controller('api')
export class ChatController {
  constructor(private agentService: AgentService) {}

  @Post('chat')
  @Header('Content-Type', 'text/event-stream')
  async chat(@Body() body: ChatRequest, @Res() res: Response) {
    const agent = this.agentService.getAgent(body.agentId);

    for await (const chunk of agent.streamExecute(body.messages)) {
      res.write(\`data: \${JSON.stringify(chunk)}\\n\\n\`);
    }

    res.write('data: [DONE]\\n\\n');
    res.end();
  }
}`}
        </CodeBlock>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/tools">Learn about Isomorphic Tools</Link>
          </li>
          <li>
            <Link href="/docs/agents">Configure Agents</Link>
          </li>
          <li>
            <Link href="/docs/nestjs">NestJS Integration</Link>
          </li>
          <li>
            <Link href="/examples">View Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const hooks = [
  {
    icon: '💬',
    name: 'useChat',
    description:
      'Full-featured chat hook with message management, streaming, tool approval, and thinking token support.',
  },
  {
    icon: '🤖',
    name: 'useAgent',
    description:
      'Single-shot agent execution for one-off tasks and background operations.',
  },
  {
    icon: '📝',
    name: 'useFormattedContent',
    description:
      'Format agent responses with Markdown rendering and code highlighting.',
  },
  {
    icon: '🌊',
    name: 'useStreamingContent',
    description:
      'Optimized streaming content handling with cursor animation.',
  },
];
