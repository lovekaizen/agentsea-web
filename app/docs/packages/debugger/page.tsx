import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-debugger | AgentSea',
  description: 'Records agent runs, sets breakpoints, replays recordings with changes, and runs what-if scenarios.',
};

const pkg: PackageDoc = {
  slug: 'debugger',
  name: '@lov3kaizen/agentsea-debugger',
  summary: 'Records agent runs, sets breakpoints, replays recordings with changes, and runs what-if scenarios.',
  version: '1.2.1',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-debugger',
  example: {
    lang: 'TS',
    code: `import { Debugger, BreakpointHelpers } from '@lov3kaizen/agentsea-debugger';

const dbg = new Debugger(); // const debugger is reserved, so the name is dbg
dbg.attach(agent);          // agent is an existing agent instance

dbg.setBreakpoint(BreakpointHelpers.onTool('search'));
dbg.setBreakpoint(BreakpointHelpers.onError());

const session = dbg.startSession();
await agent.execute('Hello');
const recording = dbg.endSession();`,
  },
  api: [
    {
      name: 'Debugger.attach(agent) / startSession() / endSession()',
      description: 'Attaches to an agent and records a session. startSession and endSession are synchronous.',
    },
    {
      name: 'Debugger.setBreakpoint(breakpoint)',
      description: 'Adds a breakpoint to the session.',
    },
    {
      name: 'BreakpointHelpers.onTool / onError / onDecision / onLowConfidence / custom',
      description: 'Builds breakpoints for tools, errors, decisions and low confidence.',
    },
    {
      name: 'ReplayEngine.start(recording, { speed, modifications })',
      description: 'Replays a recording with optional changes.',
    },
    {
      name: 'FailureAnalyzer.analyze(recording)',
      description: 'Returns a root cause, severity and recommendations.',
    },
  ],
  caveats: [
    'const debugger is a reserved word in JavaScript. Use another name such as dbg.',
    'attach records steps only from an agent that provides onStep. The core Agent class does not, so for AgentSea agents use AgentDebugger and getMiddleware() (see section 07).',
    'Diagrams are output as Mermaid (toMermaid on the decision tree and flow graph builders) or Graphviz DOT (toDOT on the flow graph builder).',
    'How root-cause analysis works is not described.',
  ],
};

const toc = [
  { id: 'replay', label: 'Replay and what-if' },
  { id: 'storage', label: 'Storage' },
  { id: 'agentsea', label: 'AgentSea integration' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="replay" num="05" title="Replay and what-if">
        <p className="text-base leading-relaxed text-brand-navy">
          ReplayEngine plays a recording back with changes to chosen steps. WhatIfEngine creates a scenario from a
          recording, runs it, and compares the result with the original.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { ReplayEngine, WhatIfEngine } from '@lov3kaizen/agentsea-debugger';

const replay = new ReplayEngine();
replay.start(recording, {
  speed: 'normal',
  modifications: [{ stepIndex: 5, type: 'modify', data: { output: 'alternative result' } }],
});

const whatIf = new WhatIfEngine();
const scenario = whatIf.createScenario({
  name: 'What if search succeeded?',
  recordingId: recording.id,
  modifications: [],
});
const result = await whatIf.runScenario(scenario.id, recording);
const comparison = whatIf.compare(recording, result);`}
        />
      </DocSection>

      <DocSection id="storage" num="06" title="Storage">
        <p className="text-base leading-relaxed text-brand-navy">
          FileStorage keeps recordings in a directory set by basePath. MemoryStorage keeps them in process, with limits
          on count and size. Both have save, load and list methods.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { FileStorage, MemoryStorage } from '@lov3kaizen/agentsea-debugger';

const files = new FileStorage({ basePath: './debug-sessions' });
const memory = new MemoryStorage({ maxRecordings: 100, maxSizeBytes: 50 * 1024 * 1024 });

await files.save(recording);
const loaded = await files.load(recording.id);
const recordings = await files.list();`}
        />
      </DocSection>

      <DocSection id="agentsea" num="07" title="AgentSea integration">
        <p className="text-base leading-relaxed text-brand-navy">
          AgentDebugger wraps the debugger for AgentSea agents. Call its middleware from your own code to feed in each
          input, tool call, tool result and response. This is how steps reach the recording.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { AgentDebugger, MemoryStorage } from '@lov3kaizen/agentsea-debugger';

const agentDebugger = new AgentDebugger({ storage: new MemoryStorage(), autoSave: true });
agentDebugger.breakOnTool('search');
agentDebugger.breakOnError();

agentDebugger.startSession({
  agentId: 'my-agent',
  agentName: 'My Agent',
  model: 'gpt-5.5',
  messages: [],
  tools: ['search'],
});

const middleware = agentDebugger.getMiddleware();
middleware.onInput('User question');
middleware.onToolCall({ name: 'search', arguments: { query: 'test' } });
middleware.onToolResult({ id: 'tool_1', name: 'search', result: 'Found!', success: true });
middleware.onResponse('Here is the answer');

const recording = agentDebugger.endSession();
if (recording && recording.status === 'failed') {
  console.log(agentDebugger.analyzeFailure(recording).recommendations);
}`}
        />
      </DocSection>
    </PackagePage>
  );
}
