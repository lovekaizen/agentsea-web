import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function CrewsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Multi-Agent Crews"
        titleGradient="purple"
        description="Build powerful AI agent teams with role-based coordination, delegation strategies, and workflow orchestration. Inspired by CrewAI and AutoGen."
      />

      <AlertBox type="info" gradient>
        <span>
          Crews enable multi-agent orchestration with role-based agents,
          delegation strategies, and pre-built templates for common use cases.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-crews`}
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

        <h2>Quick Start</h2>
        <p>Create a crew with role-based agents:</p>

        <CodeBlock language="typescript">
          {`import { createCrew, type CrewConfig, type RoleConfig } from '@lov3kaizen/agentsea-crews';

// Define a role
const researcherRole: RoleConfig = {
  name: 'Researcher',
  description: 'Expert at finding and synthesizing information',
  capabilities: [
    { name: 'web-search', proficiency: 'expert' },
    { name: 'analysis', proficiency: 'advanced' },
  ],
  systemPrompt: 'You are a skilled researcher...',
  goals: ['Find accurate information'],
};

// Create crew configuration
const config: CrewConfig = {
  name: 'my-crew',
  agents: [
    {
      name: 'researcher',
      role: researcherRole,
      model: 'claude-sonnet-4-20250514',
      provider: 'anthropic',
    },
  ],
  delegationStrategy: 'best-match',
};

// Create and run the crew
const crew = createCrew(config);

crew.addTask({
  description: 'Research AI trends',
  expectedOutput: 'Summary of AI trends',
  priority: 'high',
});

const result = await crew.kickoff();
console.log(result.finalOutput);`}
        </CodeBlock>

        <h2>Delegation Strategies</h2>
        <p>Choose how tasks are assigned to agents:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
          {delegationStrategies.map((strategy, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {strategy.name}
              </h3>
              <p className="text-sm text-gray-600">{strategy.description}</p>
            </div>
          ))}
        </div>

        <CodeBlock language="typescript">
          {`const crew = createCrew({
  name: 'my-crew',
  agents: [...],
  delegationStrategy: 'consensus', // or 'round-robin', 'best-match', 'auction', 'hierarchical'
});`}
        </CodeBlock>

        <h2>Roles & Capabilities</h2>
        <p>
          Roles define what an agent is and what it can do. Capabilities enable
          intelligent task matching.
        </p>

        <CodeBlock language="typescript">
          {`const role: RoleConfig = {
  name: 'Security Analyst',
  description: 'Expert at identifying security vulnerabilities',
  capabilities: [
    { name: 'vulnerability-detection', proficiency: 'expert' },
    { name: 'secure-coding', proficiency: 'advanced' },
  ],
  systemPrompt: 'You are a security expert...',
  goals: ['Identify vulnerabilities', 'Ensure secure code'],
  constraints: ['Flag all security concerns'],
};`}
        </CodeBlock>

        <h2>Pre-built Templates</h2>
        <p>
          Get started quickly with pre-configured crew templates for common use
          cases.
        </p>

        <h3>Research Crew</h3>
        <CodeBlock language="typescript">
          {`import { createResearchCrew, ResearchTasks } from '@lov3kaizen/agentsea-crews';

const crew = createResearchCrew({
  depth: 'deep', // 'shallow' | 'standard' | 'deep'
  includeWriter: true,
});

crew.addTask(ResearchTasks.research('electric vehicles', 'deep'));
crew.addTask(ResearchTasks.writeReport('EV Market Analysis', 'executive'));

const result = await crew.kickoff();`}
        </CodeBlock>

        <h3>Code Review Crew</h3>
        <CodeBlock language="typescript">
          {`import { createCodeReviewCrew, CodeReviewTasks } from '@lov3kaizen/agentsea-crews';

const crew = createCodeReviewCrew({
  languages: ['typescript', 'python'],
  strictness: 'strict',
});`}
        </CodeBlock>

        <h3>Customer Support Crew</h3>
        <CodeBlock language="typescript">
          {`import { createCustomerSupportCrew } from '@lov3kaizen/agentsea-crews';

const crew = createCustomerSupportCrew({
  productName: 'MyApp',
  supportStyle: 'friendly',
});`}
        </CodeBlock>

        <h2>Workflow Builder</h2>
        <p>
          Build complex workflows with the fluent API for DAG (Directed Acyclic
          Graph) execution:
        </p>

        <CodeBlock language="typescript">
          {`import { workflow, createDAGExecutor, createDAGFromSteps } from '@lov3kaizen/agentsea-crews';

const workflowDef = workflow('data-pipeline')
  .addStep('fetch', async (ctx) => {
    // Fetch data
    return { output: 'data', success: true };
  })
  .parallel(
    { name: 'validate', handler: validateFn },
    { name: 'transform', handler: transformFn }
  )
  .when((ctx) => ctx.getVariable('needsReview'))
    .then((b) => b.addStep('review', reviewFn))
    .otherwise((b) => b.addStep('auto-approve', approveFn))
  .endBranch()
  .build();

const dag = createDAGFromSteps(workflowDef.steps, workflowDef.handlers);
const executor = createDAGExecutor(dag, workflowDef.handlers);
const result = await executor.execute(context);`}
        </CodeBlock>

        <h2>Memory Systems</h2>
        <p>Share state and knowledge across agents:</p>

        <CodeBlock language="typescript">
          {`import { createSharedMemory, createKnowledgeBase } from '@lov3kaizen/agentsea-crews';

// Shared memory for crew-wide state
const memory = createSharedMemory();
memory.setShared('key', 'value');

// Knowledge base for persistent knowledge
const kb = createKnowledgeBase();
kb.addFact('title', 'content', ['tag1', 'tag2']);
const results = kb.search('query');`}
        </CodeBlock>

        <h2>Monitoring & Debugging</h2>
        <p>Monitor crew execution in real-time:</p>

        <CodeBlock language="typescript">
          {`import { createDashboard, createDebugMode } from '@lov3kaizen/agentsea-crews';

// Dashboard for monitoring
const dashboard = createDashboard(crew);
dashboard.subscribe((update) => {
  console.log('Progress:', dashboard.getProgress());
});

// Debug mode for step-through debugging
const debug = createDebugMode(crew);
debug.setBreakpoint('task:completed');
debug.enable();

const stepResult = await debug.step();`}
        </CodeBlock>

        <h2>NestJS Integration</h2>
        <CodeBlock language="typescript">
          {`import { Module, Injectable } from '@nestjs/common';
import { CrewsModule, CrewsService, InjectCrew, OnCrewEvent } from '@lov3kaizen/agentsea-crews/nestjs';

@Module({
  imports: [
    CrewsModule.forRoot({
      crews: [myCrewConfig],
      enableMonitoring: true,
    }),
  ],
})
export class AppModule {}

@Injectable()
export class MyService {
  constructor(
    private readonly crewsService: CrewsService,
    @InjectCrew('my-crew') private readonly myCrew: Crew,
  ) {}

  @OnCrewEvent('task:completed')
  handleTaskCompleted(event: CrewEvent) {
    console.log('Task completed:', event);
  }
}`}
        </CodeBlock>

        <h2>API Reference</h2>

        <h3>Core Classes</h3>
        <ul>
          <li>
            <code>Crew</code> - Main orchestrator for multi-agent crews
          </li>
          <li>
            <code>Role</code> - Agent role definitions
          </li>
          <li>
            <code>Task</code> - Task lifecycle management
          </li>
          <li>
            <code>TaskQueue</code> - Priority-based task queue
          </li>
          <li>
            <code>ExecutionContext</code> - Shared execution context
          </li>
        </ul>

        <h3>Coordination</h3>
        <ul>
          <li>
            <code>DelegationCoordinator</code> - Manages delegation strategies
          </li>
          <li>
            <code>CollaborationManager</code> - Agent-to-agent communication
          </li>
          <li>
            <code>ConflictResolver</code> - Handles disagreements
          </li>
        </ul>

        <h3>Workflows</h3>
        <ul>
          <li>
            <code>WorkflowBuilder</code> - Fluent API for workflows
          </li>
          <li>
            <code>DAGExecutor</code> - DAG execution engine
          </li>
          <li>
            <code>ParallelExecutor</code> - Concurrent task execution
          </li>
          <li>
            <code>CheckpointManager</code> - Workflow state persistence
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/workflows">
              Learn about basic Workflows
            </Link>
          </li>
          <li>
            <Link href="/docs/memory">
              Explore Memory Systems
            </Link>
          </li>
          <li>
            <Link href="/docs/observability">
              Monitor Crew Performance
            </Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const features = [
  {
    icon: '👥',
    name: 'Role-Based Agents',
    description: 'Define agents with specific roles, capabilities, and goals',
  },
  {
    icon: '🎯',
    name: 'Delegation Strategies',
    description:
      'Round-robin, best-match, auction, hierarchical, and consensus',
  },
  {
    icon: '🔄',
    name: 'Workflow Builder',
    description: 'Fluent API for building complex workflows with DAG execution',
  },
  {
    icon: '🧠',
    name: 'Memory Systems',
    description: 'Shared memory, conversation history, and knowledge base',
  },
  {
    icon: '📊',
    name: 'Monitoring',
    description: 'Real-time dashboard and step-through debugging',
  },
  {
    icon: '📦',
    name: 'Pre-built Templates',
    description: 'Research, writing, code review, and customer support crews',
  },
];

const delegationStrategies = [
  {
    name: 'round-robin',
    description: 'Cycle through agents sequentially',
  },
  {
    name: 'best-match',
    description: 'Match tasks to agents by capabilities',
  },
  {
    name: 'auction',
    description: 'Agents bid on tasks based on confidence',
  },
  {
    name: 'hierarchical',
    description: 'Manager delegates to workers',
  },
  {
    name: 'consensus',
    description: 'Multi-agent voting for task assignment',
  },
];
