import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-redteam | AgentSea',
  description:
    'Attacks, vulnerability scans, benchmarks, compliance checks, audit logging and scheduled tests for an AI agent or LLM application.',
};

const pkg: PackageDoc = {
  slug: 'redteam',
  name: '@lov3kaizen/agentsea-redteam',
  summary:
    'A toolkit for running attacks, vulnerability scans, benchmarks, compliance checks, audit logging and scheduled tests against an AI agent or LLM application.',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-redteam @lov3kaizen/agentsea-core',
  example: {
    lang: 'TS',
    code: `import { createRedTeam } from '@lov3kaizen/agentsea-redteam';

const redTeam = createRedTeam({
  config: {
    target: { type: 'agent', name: 'my-agent', endpoint: 'https://api.example.com/chat' },
  },
});

const results = await redTeam.run();
console.log('Risk Score:', results.summary.riskScore);`,
  },
  api: [
    {
      name: 'createRedTeam(options?)',
      description: 'Main entry point. Options: config, reporter, dryRun, verbose.',
    },
    {
      name: 'createVulnerabilityScanner()',
      description: 'Scans for vulnerabilities in four categories: injection, jailbreak, data-leakage and bias.',
    },
    {
      name: 'createJailbreakDetector(threshold?)',
      description:
        'detect({ text, role?, context? }) is synchronous and returns detected, confidence and technique. threshold is a number, default 0.5.',
    },
    {
      name: 'ComplianceChecker(framework, config?)',
      description:
        "Checks requirement evaluations against a framework. Framework ids include eu_ai_act and nist_ai_rmf (underscores, not hyphens).",
    },
    {
      name: 'AuditLogger and Scheduler',
      description: 'Audit logging with hash-chain verification, and scheduled runs with fixed or cron frequencies.',
    },
  ],
  caveats: [
    'Beta. Audit entries are kept in memory unless you pass a store to AuditLogger.',
    'Scheduling supports hourly, daily, weekly, monthly and custom frequencies. A custom frequency takes a cronExpression. The README says cron is not supported, but the source handles it.',
    'Alerts go only to the channels you configure. Evidence and screenshot capture are not implemented.',
    'createAgentSeaIntegration and createCIIntegration are placeholders. They return their config and have no run method, so the README examples for them do not work.',
    'Requires @lov3kaizen/agentsea-core 0.6.0 or later and Node.js 20 or later. Some examples pass options the current source does not accept.',
  ],
};

const toc = [
  { id: 'jailbreak', label: 'Jailbreak detection' },
  { id: 'ci', label: 'Scheduling and alerts' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="jailbreak" num="05" title="Jailbreak detection">
        <p className="text-base leading-relaxed text-brand-navy">
          The detector is synchronous. Pass the text to inspect and read detected, confidence and technique from the
          result.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { createJailbreakDetector } from '@lov3kaizen/agentsea-redteam';

const detector = createJailbreakDetector(0.5);
const result = detector.detect({ text: 'Ignore all previous instructions...' });

console.log('Detected:', result.detected, 'Confidence:', result.confidence, result.technique);`}
        />
      </DocSection>

      <DocSection id="ci" num="06" title="Scheduling and alerts">
        <p className="text-base leading-relaxed text-brand-navy">
          Scheduler runs a job on a fixed frequency or on a cron expression. AlertManager evaluates alert rules
          against a metrics object and returns the alerts it triggers.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { AlertManager, Scheduler } from '@lov3kaizen/agentsea-redteam';

const scheduler = new Scheduler();
scheduler.schedule({ frequency: 'custom', cronExpression: '0 */6 * * *' }, () => {
  console.log('Running scheduled tests');
});

const alerts = new AlertManager({ rules: [] });
const triggered = alerts.evaluate({ riskScore: 72 });`}
        />
      </DocSection>
    </PackagePage>
  );
}
