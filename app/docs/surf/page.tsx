import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function SurfPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Browser Automation (Surf)"
        titleGradient="blue"
        description="Computer-use agent for controlling desktop environments. Screen capture, mouse, keyboard actions using Claude's vision capabilities."
      />

      <AlertBox type="info" gradient>
        <span>
          Surf enables AI agents to interact with desktop applications and
          browsers through 8 computer-use tools with Claude vision integration.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-surf

# Optional dependencies
pnpm add puppeteer   # Browser automation (default engine)
pnpm add playwright  # Browser automation (chromium/firefox/webkit)
pnpm add sharp       # Image processing
pnpm add rfb2        # VNC remote-display backend`}
        </CodeBlock>

        <h2>Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 not-prose mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <h2>Computer-Use Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 not-prose mb-8">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="p-3 bg-white rounded-lg border border-gray-200 text-center"
            >
              <div className="text-2xl mb-1">{tool.icon}</div>
              <p className="text-sm font-medium">{tool.name}</p>
            </div>
          ))}
        </div>

        <h2>Quick Start</h2>
        <CodeBlock language="typescript">
          {`import {
  SurfAgent,
  createNativeBackend,
} from '@lov3kaizen/agentsea-surf';

async function main() {
  // Create a native backend for your platform
  const backend = createNativeBackend();
  await backend.connect();

  // Create the agent
  const agent = new SurfAgent('session-1', backend, {
    maxSteps: 20,
    vision: {
      model: 'claude-sonnet-4-20250514',
      maxTokens: 4096,
      includeScreenshotInResponse: true,
    },
  });

  // Execute a task
  const result = await agent.execute(
    'Open Chrome and navigate to google.com'
  );

  console.log('Result:', result.response);
  console.log('Steps taken:', result.state.actionHistory.length);

  await backend.disconnect();
}

main().catch(console.error);`}
        </CodeBlock>

        <h2>Backends</h2>
        <p>
          Surf ships with backends for native desktops, browsers (Puppeteer or
          Playwright), Docker, Kubernetes, and remote displays (VNC/RDP). Each
          can be constructed directly, or selected by type through the{' '}
          <code>createBackend(config)</code> factory:
        </p>
        <CodeBlock language="typescript">
          {`import { createBackend } from '@lov3kaizen/agentsea-surf';

// createBackend returns a Promise<DesktopBackend>
const backend = await createBackend({
  type: 'browser',
  options: { engine: 'playwright', browserType: 'chromium' },
});

await backend.connect();`}
        </CodeBlock>
        <p>
          Supported <code>type</code> values: <code>native</code>,{' '}
          <code>browser</code>, <code>docker</code>, <code>kubernetes</code>,{' '}
          <code>vnc</code>, and <code>rdp</code>.
        </p>

        <h3>Native Backend</h3>
        <p>
          Automatically selects the appropriate backend for your platform
          (macOS, Linux, Windows):
        </p>
        <CodeBlock language="typescript">
          {`import { createNativeBackend } from '@lov3kaizen/agentsea-surf';

const backend = createNativeBackend({ displayIndex: 0 });
await backend.connect();`}
        </CodeBlock>

        <h3>Browser Backend (Puppeteer or Playwright)</h3>
        <p>
          Automate web browsers with Puppeteer (the default engine) or
          Playwright:
        </p>
        <CodeBlock language="typescript">
          {`import { PuppeteerBackend } from '@lov3kaizen/agentsea-surf';

const backend = new PuppeteerBackend({
  headless: false,
  viewport: { width: 1920, height: 1080 },
  initialUrl: 'https://example.com',
});

await backend.connect();`}
        </CodeBlock>
        <p>
          Playwright adds Firefox and WebKit support via{' '}
          <code>browserType</code>. Select it through <code>createBackend</code>{' '}
          by setting <code>engine: &apos;playwright&apos;</code> (the default
          engine remains <code>&apos;puppeteer&apos;</code>):
        </p>
        <CodeBlock language="typescript">
          {`import { createBackend } from '@lov3kaizen/agentsea-surf';

const backend = await createBackend({
  type: 'browser',
  options: {
    engine: 'playwright',
    browserType: 'webkit', // 'chromium' | 'firefox' | 'webkit'
    headless: true,
    viewport: { width: 1920, height: 1080 },
    initialUrl: 'https://example.com',
  },
});

await backend.connect();`}
        </CodeBlock>

        <h3>Docker Backend</h3>
        <p>Run in an isolated Docker container:</p>
        <CodeBlock language="typescript">
          {`import { DockerBackend } from '@lov3kaizen/agentsea-surf';

const backend = new DockerBackend({
  image: 'agentsea/desktop:ubuntu-22.04',
  resolution: { width: 1920, height: 1080, scaleFactor: 1 },
  removeOnDisconnect: true,
});

await backend.connect();`}
        </CodeBlock>

        <h3>Kubernetes Backend</h3>
        <p>
          Run a desktop pod in a Kubernetes cluster, driven via{' '}
          <code>kubectl exec</code>. Requires <code>kubectl</code> on PATH and an
          image that ships an X server plus <code>xdotool</code>/
          <code>scrot</code> (the same desktop image used for Docker works):
        </p>
        <CodeBlock language="typescript">
          {`import { createBackend } from '@lov3kaizen/agentsea-surf';

const backend = await createBackend({
  type: 'kubernetes',
  options: {
    namespace: 'agentsea',
    image: 'agentsea/desktop:ubuntu-22.04',
    resolution: { width: 1920, height: 1080, scaleFactor: 1 },
    resources: {
      requests: { cpu: '500m', memory: '1Gi' },
      limits: { cpu: '2', memory: '4Gi' },
    },
    deleteOnDisconnect: true,
  },
});

await backend.connect();`}
        </CodeBlock>

        <h3>Remote-Display Backends (VNC / RDP)</h3>
        <p>
          Drive an existing remote desktop over the VNC (RFB) or RDP protocol.
          Both translate Surf actions into pointer/key events:
        </p>
        <CodeBlock language="typescript">
          {`import { createBackend } from '@lov3kaizen/agentsea-surf';

// VNC
const vnc = await createBackend({
  type: 'vnc',
  options: { host: '127.0.0.1', port: 5900, password: 'secret' },
});

// RDP
const rdp = await createBackend({
  type: 'rdp',
  options: {
    host: '127.0.0.1',
    port: 3389,
    username: 'user',
    password: 'secret',
    domain: 'WORKGROUP',
  },
});

await vnc.connect();`}
        </CodeBlock>
        <AlertBox type="warning">
          <span>
            Pointer/key/input translation is fully implemented and unit-tested,
            but <strong>frame capture</strong> (screenshots) and the{' '}
            <strong>RDP transport</strong> are experimental. The optional{' '}
            <code>rfb2</code> (VNC) and RDP client packages cannot assemble
            framebuffers into PNGs on their own. For production, inject a custom{' '}
            <code>RemoteDisplayClient</code> via the backend&apos;s{' '}
            <code>{`{ client }`}</code> dependency.
          </span>
        </AlertBox>
        <CodeBlock language="typescript">
          {`import {
  VNCBackend,
  type RemoteDisplayClient,
} from '@lov3kaizen/agentsea-surf';

// Inject your own client for reliable frame capture + transport
const client: RemoteDisplayClient = createMyRemoteDisplayClient();

const backend = new VNCBackend(
  { host: '127.0.0.1', port: 5900 },
  { client },
);

await backend.connect();`}
        </CodeBlock>

        <h2>Streaming Execution</h2>
        <p>Stream events as the agent executes:</p>
        <CodeBlock language="typescript">
          {`const agent = new SurfAgent('session-1', backend, config);

for await (const event of agent.executeStream('Search for weather')) {
  switch (event.type) {
    case 'screenshot':
      console.log('Screenshot taken');
      break;
    case 'action':
      console.log(\`Executing: \${event.action.description}\`);
      break;
    case 'complete':
      console.log('Task completed:', event.response);
      break;
  }
}`}
        </CodeBlock>

        <h2>Using Individual Tools</h2>
        <p>Use tools independently for fine-grained control:</p>
        <CodeBlock language="typescript">
          {`import {
  createSurfTools,
  createNativeBackend,
} from '@lov3kaizen/agentsea-surf';

const backend = createNativeBackend();
await backend.connect();

const tools = createSurfTools(backend);

// Use individual tools
await tools.screenshot.execute({});
await tools.click.execute({ x: 100, y: 200 });
await tools.typeText.execute({ text: 'Hello World' });
await tools.scroll.execute({ direction: 'down', amount: 200 });
await tools.keyPress.execute({ key: 'Enter' });
await tools.drag.execute({ startX: 0, startY: 0, endX: 100, endY: 100 });
await tools.cursorMove.execute({ x: 500, y: 300 });
await tools.wait.execute({ duration: 1000 });`}
        </CodeBlock>

        <h2>Security Sandboxing</h2>
        <p>Restrict agent capabilities for safety:</p>
        <CodeBlock language="typescript">
          {`const agent = new SurfAgent('session', backend, {
  sandbox: {
    enabled: true,
    maxActionsPerMinute: 60,
    blockedDomains: ['malicious-site.com'],
    blockedCommands: ['rm -rf', 'sudo'],
    blockedPaths: ['/etc', '/root'],
  },
});`}
        </CodeBlock>

        <h2>NestJS Integration</h2>
        <CodeBlock language="typescript">
          {`import { Module } from '@nestjs/common';
import { SurfModule } from '@lov3kaizen/agentsea-surf/nestjs';

@Module({
  imports: [
    SurfModule.forRoot({
      backend: { type: 'native' },
      config: {
        maxSteps: 50,
        sandbox: { enabled: true },
      },
      enableRestApi: true,
      enableWebSocket: true,
    }),
  ],
})
export class AppModule {}`}
        </CodeBlock>

        <h2>REST API Endpoints</h2>
        <p>When using NestJS integration:</p>
        <div className="overflow-x-auto not-prose mb-8">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>POST</td>
                <td>
                  <code>/surf/execute</code>
                </td>
                <td>Execute a task</td>
              </tr>
              <tr>
                <td>POST</td>
                <td>
                  <code>/surf/action</code>
                </td>
                <td>Execute single action</td>
              </tr>
              <tr>
                <td>POST</td>
                <td>
                  <code>/surf/screenshot</code>
                </td>
                <td>Take a screenshot</td>
              </tr>
              <tr>
                <td>GET</td>
                <td>
                  <code>/surf/screen</code>
                </td>
                <td>Get screen state</td>
              </tr>
              <tr>
                <td>GET</td>
                <td>
                  <code>/surf/sessions</code>
                </td>
                <td>List active sessions</td>
              </tr>
              <tr>
                <td>GET</td>
                <td>
                  <code>/surf/status</code>
                </td>
                <td>Get backend status</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>WebSocket Events</h2>
        <div className="overflow-x-auto not-prose mb-8">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Event</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>execute</code>
                </td>
                <td>
                  Start task execution (emits <code>stream</code>,{' '}
                  <code>complete</code>, <code>error</code>)
                </td>
              </tr>
              <tr>
                <td>
                  <code>action</code>
                </td>
                <td>
                  Execute single action (emits <code>actionResult</code>)
                </td>
              </tr>
              <tr>
                <td>
                  <code>screenshot</code>
                </td>
                <td>
                  Take screenshot (emits <code>screenshotResult</code>)
                </td>
              </tr>
              <tr>
                <td>
                  <code>stop</code>
                </td>
                <td>Stop current execution</td>
              </tr>
              <tr>
                <td>
                  <code>status</code>
                </td>
                <td>Get backend status</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>API Reference</h2>

        <h3>SurfAgent</h3>
        <CodeBlock language="typescript">
          {`// Constructor
new SurfAgent(
  sessionId: string,
  backend: DesktopBackend,
  config?: Partial<SurfConfig>
)

// Methods
agent.execute(task: string, context?: AgentContext)  // Execute a task
agent.executeStream(task: string, context?: AgentContext)  // Execute with streaming
agent.stop()  // Stop the current execution
agent.getState()  // Get current agent state`}
        </CodeBlock>

        <h3>SurfConfig</h3>
        <CodeBlock language="typescript">
          {`interface SurfConfig {
  maxSteps: number;  // Maximum steps before stopping
  vision: {
    model: string;  // Claude model to use
    maxTokens: number;
    includeScreenshotInResponse: boolean;
  };
  sandbox?: {
    enabled: boolean;
    maxActionsPerMinute?: number;
    blockedDomains?: string[];
    blockedCommands?: string[];
    blockedPaths?: string[];
  };
}`}
        </CodeBlock>

        <h2>Use Cases</h2>
        <ul>
          <li>
            <strong>Web Automation</strong> - Fill forms, navigate sites, scrape
            data
          </li>
          <li>
            <strong>Desktop Automation</strong> - Control native applications
          </li>
          <li>
            <strong>Testing</strong> - Automated UI testing with AI
          </li>
          <li>
            <strong>Data Entry</strong> - Automate repetitive data entry tasks
          </li>
          <li>
            <strong>Research</strong> - Gather information from multiple sources
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/agents">Learn about Agents</Link>
          </li>
          <li>
            <Link href="/docs/tools">Explore Built-in Tools</Link>
          </li>
          <li>
            <Link href="/docs/guardrails">Add Safety Guardrails</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const features = [
  {
    icon: '🖥️',
    name: '8 Computer-Use Tools',
    description:
      'Screenshot, click, type, scroll, drag, key press, cursor move, wait',
  },
  {
    icon: '🔌',
    name: 'Multiple Backends',
    description:
      'Native, Puppeteer, Playwright, Docker, Kubernetes, VNC, RDP',
  },
  {
    icon: '👁️',
    name: 'Claude Vision',
    description: 'Automatic screen analysis and action determination',
  },
  {
    icon: '🔄',
    name: 'Streaming',
    description: 'Real-time event streaming during execution',
  },
  {
    icon: '🛡️',
    name: 'Security Sandbox',
    description: 'Rate limiting, command blocking, domain restrictions',
  },
  {
    icon: '🎯',
    name: 'NestJS Integration',
    description: 'REST API and WebSocket support',
  },
];

const tools = [
  { icon: '📷', name: 'Screenshot' },
  { icon: '🖱️', name: 'Click' },
  { icon: '⌨️', name: 'Type' },
  { icon: '📜', name: 'Scroll' },
  { icon: '🎯', name: 'Drag' },
  { icon: '⏎', name: 'Key Press' },
  { icon: '➡️', name: 'Cursor Move' },
  { icon: '⏱️', name: 'Wait' },
];
