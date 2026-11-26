import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import BulletPanel from '../../../components/docs/BulletPanel';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-surf | AgentSea',
  description: 'A computer-use agent that controls a desktop, a browser, or a Docker desktop.',
};

const pkg: PackageDoc = {
  slug: 'surf',
  name: '@lov3kaizen/agentsea-surf',
  summary: 'A computer-use agent that controls a desktop, a browser, or a Docker desktop.',
  onNpm: true,
  install: 'npm install @lov3kaizen/agentsea-surf',
  installNote: 'Install from npm into your project. Add puppeteer-core or playwright if you use a browser backend.',
  example: {
    lang: 'TS',
    code: `import { SurfAgent, createNativeBackend } from '@lov3kaizen/agentsea-surf';

const backend = createNativeBackend();
await backend.connect();

const agent = new SurfAgent('session-1', backend, {
  maxSteps: 20,
  vision: { model: 'claude-sonnet-4-6', maxTokens: 4096, includeScreenshotInResponse: true },
});

const result = await agent.execute('Open Chrome and navigate to google.com');
console.log('Result:', result.response);
await backend.disconnect();`,
  },
  api: [
    {
      name: 'new SurfAgent(sessionId, backend, config?)',
      description: 'Methods: execute(task, context?), executeStream(task, context?), stop(), getState().',
    },
    {
      name: 'createNativeBackend(options?)',
      description: 'Backend for the local desktop. Supports macOS, Linux and Windows.',
    },
    {
      name: 'PuppeteerBackend and DockerBackend',
      description:
        'Browser backend (headless, viewport, initialUrl) and Docker desktop backend (image, resolution, removeOnDisconnect).',
    },
    {
      name: 'createSurfTools(backend)',
      description:
        'Returns the 8 computer-use tools for direct use: screenshot, click, typeText, scroll, drag, keyPress, cursorMove, wait.',
    },
    {
      name: 'SurfModule.forRoot({ backend, config, enableRestApi, enableWebSocket })',
      description: "NestJS module, imported from '@lov3kaizen/agentsea-surf/nestjs'. backend is a config such as { type: 'native' }.",
    },
  ],
  caveats: [
    'Browser backends need puppeteer-core or playwright. sharp is a regular dependency.',
    'The example needs a vision-capable Claude model such as claude-sonnet-4-6. How the API key is supplied is not described.',
    'A desktop agent needs OS permissions to capture the screen and send input. These are not listed.',
    'The Docker backend uses the image agentsea/desktop:ubuntu-22.04. Build and pull steps are not described. Do not rely on the sandbox options as a complete security control.',
  ],
};

const toc = [
  { id: 'streaming', label: 'Streaming execution' },
  { id: 'sandbox', label: 'Sandbox' },
  { id: 'nestjs', label: 'NestJS endpoints' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="streaming" num="05" title="Streaming execution">
        <p className="text-base leading-relaxed text-brand-navy">
          executeStream yields an event for each screenshot, each action and the final result. Use it to show progress
          while a task runs.
        </p>
        <CodeBlock
          lang="TS"
          code={`for await (const event of agent.executeStream('Search for weather')) {
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
        />
      </DocSection>

      <DocSection id="sandbox" num="06" title="Sandbox">
        <p className="text-base leading-relaxed text-brand-navy">
          The sandbox option limits what the agent may do. Each limit is optional.
        </p>
        <CodeBlock
          lang="TS"
          code={`const agent = new SurfAgent('session', backend, {
  sandbox: {
    enabled: true,
    maxActionsPerMinute: 60,
    blockedDomains: ['malicious-site.com'],
    blockedCommands: ['rm -rf', 'sudo'],
    blockedPaths: ['/etc', '/root'],
  },
});`}
        />
        <BulletPanel items={['These are guardrails, not a full security boundary. Run the agent in an isolated machine or container.']} />
      </DocSection>

      <DocSection id="nestjs" num="07" title="NestJS endpoints">
        <p className="text-base leading-relaxed text-brand-navy">
          With enableRestApi and enableWebSocket set, SurfModule exposes these routes under /surf. The routes are
          listed from the controller and gateway source.
        </p>
        <BulletPanel
          items={[
            'REST: POST /surf/execute, POST /surf/action, POST /surf/screenshot, GET /surf/screen, GET /surf/sessions, GET /surf/sessions/:sessionId, POST /surf/sessions/:sessionId/stop, GET /surf/status.',
            'WebSocket events: execute (emits stream, complete, error), action, screenshot, stop, getState and status.',
          ]}
        />
      </DocSection>
    </PackagePage>
  );
}
