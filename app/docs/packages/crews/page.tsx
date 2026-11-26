import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import Callout from '../../../components/docs/Callout';
import { ApiList, ApiRow } from '../../../components/docs/ApiList';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-crews | AgentSea',
  description:
    'Multi-agent orchestration for building teams of AI agents that work through a shared list of tasks.',
};

const pkg: PackageDoc = {
  slug: 'crews',
  name: '@lov3kaizen/agentsea-crews',
  summary: 'Multi-agent orchestration for building teams of AI agents that work through a shared list of tasks.',
  onNpm: true,
  install: 'npm install @lov3kaizen/agentsea-crews',
  example: {
    lang: 'TS',
    code: `import { createCrew, type CrewConfig, type RoleConfig } from '@lov3kaizen/agentsea-crews';

const researcherRole: RoleConfig = {
  name: 'Researcher', description: 'Expert at finding and synthesizing information',
  capabilities: [{ name: 'web-search', description: 'Searches the web for sources', proficiency: 'expert' }],
  goals: ['Find accurate information'],
  systemPrompt: 'You are a skilled researcher...',
};
const config: CrewConfig = {
  name: 'my-crew',
  agents: [{ name: 'researcher', role: researcherRole, model: 'claude-sonnet-4-6', provider: 'anthropic' }],
  delegationStrategy: 'best-match',
};
const crew = createCrew(config);
crew.addTask({ description: 'Research AI trends', expectedOutput: 'Summary of AI trends', priority: 'high' });
console.log((await crew.kickoff()).finalOutput);`,
  },
  api: [
    { name: 'createCrew(config)', description: 'Creates a crew from roles and agents.' },
    { name: 'crew.addTask({ description, expectedOutput, priority })', description: 'Adds a task for the crew to work on.' },
    { name: 'crew.kickoff(options?)', description: 'Runs the tasks and returns the final output.' },
    {
      name: 'CrewConfig.delegationStrategy',
      description: 'One of round-robin, best-match, auction, hierarchical or consensus.',
    },
    {
      name: 'createResearchCrew / createWritingCrew / createCodeReviewCrew / createCustomerSupportCrew',
      description: 'Prebuilt crew templates.',
    },
  ],
  caveats: [
    'Default execution calls real models through @lov3kaizen/agentsea-core. Set a provider key such as ANTHROPIC_API_KEY.',
    'mock: true returns fixed responses with no network calls, which suits tests.',
    'With maxConcurrentTasks above 1, events from different tasks interleave. A task that fails after retries stops new tasks from starting.',
    '@lov3kaizen/agentsea-core is a required peer dependency.',
  ],
};

const toc = [
  { id: 'execution', label: 'Execution model' },
  { id: 'delegation', label: 'Delegation strategies' },
  { id: 'roles', label: 'Roles and capabilities' },
  { id: 'templates', label: 'Prebuilt templates' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="execution" num="05" title="Execution model">
        <p className="text-base leading-relaxed text-brand-navy">
          Crew agents run against a real LLM by default. The default executor loads <code>@lov3kaizen/agentsea-core</code>{' '}
          on first use and calls the provider named in each agent config. Three options change that.
        </p>
        <ApiList>
          <ApiRow name="mock: true">Deterministic output with no provider SDK, network access or API key. Use it in tests.</ApiRow>
          <ApiRow name="provider">
            A pre-built <code>CoreLLMProvider</code>, for dependency injection or a test double. Ignored when <code>execute</code> or <code>mock</code> is set.
          </ApiRow>
          <ApiRow name="execute">
            A custom function that receives the task input and the agent&apos;s system prompt. It takes precedence over the default executor.
          </ApiRow>
        </ApiList>
        <CodeBlock
          lang="TS"
          code={`import { createCrew, type CoreLLMProvider } from '@lov3kaizen/agentsea-crews';

const testProvider: CoreLLMProvider = {
  async generateResponse(messages, config) {
    return { content: 'deterministic response', usage: { inputTokens: 10, outputTokens: 5 } };
  },
};

const crew = createCrew({
  name: 'my-crew',
  agents: [/* ... */],
  delegationStrategy: 'best-match',
  provider: testProvider,
});`}
        />
        <Callout kind="note">
          The default executor covers <code>anthropic</code>, <code>openai</code>, <code>gemini</code> and <code>ollama</code>. Any other provider needs a custom <code>execute</code> function.
        </Callout>
      </DocSection>

      <DocSection id="delegation" num="06" title="Delegation strategies">
        <ApiList>
          <ApiRow name="round-robin">Cycle through agents in turn.</ApiRow>
          <ApiRow name="best-match">Match each task to the agent whose capabilities fit best.</ApiRow>
          <ApiRow name="auction">Agents bid on tasks based on their confidence.</ApiRow>
          <ApiRow name="hierarchical">A manager delegates to workers.</ApiRow>
          <ApiRow name="consensus">Agents vote on which one takes a task.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="roles" num="07" title="Roles and capabilities">
        <p className="text-base leading-relaxed text-brand-navy">
          A role says what an agent is and what it can do. Each capability has a name, a description and a proficiency of novice, intermediate, expert or master.
        </p>
        <CodeBlock
          lang="TS"
          code={`import type { RoleConfig } from '@lov3kaizen/agentsea-crews';

const role: RoleConfig = {
  name: 'Security Analyst',
  description: 'Expert at identifying security vulnerabilities',
  capabilities: [
    { name: 'vulnerability-detection', description: 'Finds security flaws in code', proficiency: 'expert' },
    { name: 'secure-coding', description: 'Writes code that avoids common flaws', proficiency: 'intermediate' },
  ],
  systemPrompt: 'You are a security expert...',
  goals: ['Identify vulnerabilities', 'Ensure secure code'],
  constraints: ['Flag all security concerns'],
};`}
        />
      </DocSection>

      <DocSection id="templates" num="08" title="Prebuilt templates">
        <p className="text-base leading-relaxed text-brand-navy">
          Each template returns a configured crew. Pass options to tune it.
        </p>
        <ApiList>
          <ApiRow name="createResearchCrew({ depth, includeWriter })">
            A research crew. <code>depth</code> is shallow, standard or deep. <code>ResearchTasks.research(topic, depth)</code> builds its task.
          </ApiRow>
          <ApiRow name="createWritingCrew(options)">A crew for drafting written output.</ApiRow>
          <ApiRow name="createCodeReviewCrew({ languages, includeSecurity })">A code review crew for the listed languages.</ApiRow>
          <ApiRow name="createCustomerSupportCrew({ productName, companyName })">A support crew for a named product.</ApiRow>
        </ApiList>
        <CodeBlock
          lang="TS"
          code={`import { createResearchCrew, ResearchTasks } from '@lov3kaizen/agentsea-crews';

const crew = createResearchCrew({ depth: 'deep', includeWriter: true });
crew.addTask(ResearchTasks.research('electric vehicles', 'deep'));
const result = await crew.kickoff();`}
        />
      </DocSection>
    </PackagePage>
  );
}
