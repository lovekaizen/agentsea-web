import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function DebuggerPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Agent Debugger"
        titleGradient="purple"
        description="Step-through execution, decision-tree visualization, checkpoint replay, and what-if scenario testing for AI agents."
      />

      <AlertBox type="info" gradient>
        <span>
          The debugger lets you pause agent execution at breakpoints, record
          complete sessions, replay them with modifications, and explore
          alternative paths without re-running the agent.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-debugger`}
        </CodeBlock>

        <h2>Quick Start</h2>
        <CodeBlock language="typescript">
          {`import {
  Debugger,
  BreakpointHelpers,
} from '@lov3kaizen/agentsea-debugger';

// Create debugger
const debug = new Debugger();

// Attach to agent
debug.attach(agent);

// Set breakpoints
debug.setBreakpoint(BreakpointHelpers.onTool('search'));
debug.setBreakpoint(BreakpointHelpers.onError());

// Start session
const session = await debug.startSession();

// Execute agent...
await agent.execute('Hello');

// Get recording
const recording = await debug.endSession();`}
        </CodeBlock>

        <h2>Step-Through Execution &amp; Breakpoints</h2>
        <p>
          The <code>Debugger</code> is the main entry point. Configure recording
          and step limits, then attach it to an agent to start debugging:
        </p>
        <CodeBlock language="typescript">
          {`import { Debugger } from '@lov3kaizen/agentsea-debugger';

const debug = new Debugger({
  maxSteps: 1000,
  recording: {
    enabled: true,
    includePrompts: true,
    includeResponses: true,
  },
});

// Attach to agent
debug.attach({
  id: 'my-agent',
  name: 'My Agent',
  model: 'gpt-5.5',
});

// Start debugging
const session = await debug.startSession();`}
        </CodeBlock>

        <p>
          Use <code>BreakpointHelpers</code> to pause execution at specific
          points such as tool calls, errors, decisions, or low-confidence steps:
        </p>
        <CodeBlock language="typescript">
          {`import { BreakpointHelpers } from '@lov3kaizen/agentsea-debugger';

// Break on specific tool
debug.setBreakpoint(BreakpointHelpers.onTool('search'));

// Break on any error
debug.setBreakpoint(BreakpointHelpers.onError());

// Break on decisions
debug.setBreakpoint(BreakpointHelpers.onDecision());

// Break on low confidence
debug.setBreakpoint(BreakpointHelpers.onLowConfidence(0.5));

// Custom breakpoint
debug.setBreakpoint(BreakpointHelpers.custom(
  (ctx) => ctx.step.type === 'tool-call' && ctx.step.toolCall?.name === 'delete',
  'Break on delete operations'
));`}
        </CodeBlock>

        <Divider />

        <h2>Recording &amp; Checkpoints</h2>
        <p>
          The <code>Recorder</code> captures complete agent sessions for later
          analysis. Auto-snapshots and manual checkpoints let you mark important
          points in execution:
        </p>
        <CodeBlock language="typescript">
          {`import { Recorder } from '@lov3kaizen/agentsea-debugger';

const recorder = new Recorder({
  includePrompts: true,
  includeResponses: true,
  autoSnapshot: true,
  snapshotInterval: 10,
});

// Start recording
recorder.start('my-agent', initialState);

// Record steps
recorder.recordStep(step, state);

// Create checkpoint
recorder.createCheckpoint('Before API call');

// Stop and get recording
const recording = recorder.stop();`}
        </CodeBlock>

        <h2>Replay</h2>
        <p>
          The <code>ReplayEngine</code> re-runs a recording, optionally applying
          modifications to explore alternatives. Control playback speed and
          listen to replay events as steps are processed:
        </p>
        <CodeBlock language="typescript">
          {`import { ReplayEngine } from '@lov3kaizen/agentsea-debugger';

const replay = new ReplayEngine();

// Start replay
const session = await replay.start(recording, {
  speed: 'normal',
  modifications: [
    { stepIndex: 5, type: 'modify', data: { output: 'alternative result' } },
  ],
});

// Listen to events
replay.on('step:replayed', (step, state) => {
  console.log(\`Replayed step \${step.index}\`);
});

// Control playback
replay.pause();
replay.resume();
replay.setSpeed('fast');`}
        </CodeBlock>

        <Divider />

        <h2>Failure Analysis</h2>
        <p>
          The <code>FailureAnalyzer</code> performs automatic root-cause analysis
          on failed recordings and returns recommendations:
        </p>
        <CodeBlock language="typescript">
          {`import { FailureAnalyzer } from '@lov3kaizen/agentsea-debugger';

const analyzer = new FailureAnalyzer();

// Analyze a failed recording
const analysis = analyzer.analyze(recording);

console.log('Root Cause:', analysis.rootCause);
console.log('Severity:', analysis.severity);
console.log('Recommendations:', analysis.recommendations);`}
        </CodeBlock>

        <h2>What-If Scenario Testing</h2>
        <p>
          The <code>WhatIfEngine</code> explores alternative execution paths
          without re-running the agent. Create a scenario with modifications,
          run it, and compare the result against the original:
        </p>
        <CodeBlock language="typescript">
          {`import { WhatIfEngine } from '@lov3kaizen/agentsea-debugger';

const whatIf = new WhatIfEngine();

// Create scenario
const scenario = whatIf.createScenario({
  name: 'What if search succeeded?',
  recordingId: recording.id,
  modifications: [
    {
      stepIndex: 3,
      type: 'modify',
      data: {
        toolCall: {
          id: 'tool_1',
          name: 'search',
          result: 'Success!',
          success: true,
        },
      },
    },
  ],
});

// Run scenario
const result = await whatIf.runScenario(scenario.id, recording);

// Compare with original
const comparison = whatIf.compare(recording, result);`}
        </CodeBlock>

        <Divider />

        <h2>Decision Tree &amp; Flow Graph Visualization</h2>
        <p>
          Visualize how an agent reached its conclusions. The{' '}
          <code>DecisionTreeBuilder</code> renders decision points as a tree, and
          the <code>FlowGraphBuilder</code> renders execution flow as a graph.
          Both export to standard formats:
        </p>
        <CodeBlock language="typescript">
          {`import {
  DecisionTreeBuilder,
  FlowGraphBuilder,
} from '@lov3kaizen/agentsea-debugger';

// Build decision tree
const treeBuilder = new DecisionTreeBuilder();
const tree = treeBuilder.build(recording);

// Export as Mermaid
console.log(treeBuilder.toMermaid());

// Build flow graph
const graphBuilder = new FlowGraphBuilder();
const graph = graphBuilder.build(recording);

// Export as DOT (Graphviz)
console.log(graphBuilder.toDOT());`}
        </CodeBlock>

        <h2>Storage</h2>
        <p>
          Persist and retrieve recordings with the file-based or in-memory
          storage adapters:
        </p>
        <CodeBlock language="typescript">
          {`import { FileStorage, MemoryStorage } from '@lov3kaizen/agentsea-debugger';

// File-based storage
const fileStorage = new FileStorage({
  basePath: './debug-sessions',
  fs: nodeFs, // Node.js fs/promises wrapper
});

// In-memory storage
const memoryStorage = new MemoryStorage({
  maxRecordings: 100,
  maxSizeBytes: 50 * 1024 * 1024, // 50MB
});

// Save recording
await storage.save(recording);

// Load recording
const loaded = await storage.load(recording.id);

// List recordings
const recordings = await storage.list();`}
        </CodeBlock>

        <Divider />

        <h2>AgentSea Integration</h2>
        <p>
          Use the high-level <code>AgentDebugger</code> for seamless integration.
          It bundles storage, breakpoints, and step-tracking middleware:
        </p>
        <CodeBlock language="typescript">
          {`import { AgentDebugger, MemoryStorage } from '@lov3kaizen/agentsea-debugger';

const debug = new AgentDebugger({
  storage: new MemoryStorage(),
  autoSave: true,
});

// Set breakpoints
debug.breakOnTool('search');
debug.breakOnError();

// Start session
await debug.startSession({
  agentId: 'my-agent',
  agentName: 'My Agent',
  model: 'gpt-5.5',
  messages: [],
  tools: ['search'],
});

// Get middleware for step tracking
const middleware = debug.getMiddleware();

// Track steps
middleware.onInput('User question');
middleware.onToolCall({ name: 'search', arguments: { query: 'test' } });
middleware.onToolResult({ id: 'tool_1', name: 'search', result: 'Found!', success: true });
middleware.onResponse('Here is the answer');

// End session
const recording = await debug.endSession();

// Analyze if failed
if (recording.status === 'failed') {
  const analysis = debug.analyzeFailure(recording);
  console.log(analysis.recommendations);
}`}
        </CodeBlock>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/observability">Monitor Agents in Production</Link>
          </li>
          <li>
            <Link href="/docs/evaluate">Evaluate LLM Quality</Link>
          </li>
          <li>
            <Link href="/docs/analytics">Analyze Agent Performance</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
