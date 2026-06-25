import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function RedteamPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Red Teaming"
        titleGradient="warm"
        description="AI safety & red-teaming toolkit for proactive security testing of AI agents — adversarial attacks, vulnerability scanning, jailbreak detection, and compliance checking."
      />

      <AlertBox type="info" gradient>
        <span>
          The red-teaming toolkit lets you proactively probe AI agents and LLM
          applications for vulnerabilities — generating adversarial attacks,
          scanning for prompt injection and data leakage, detecting jailbreaks,
          and verifying regulatory compliance before they reach production.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-redteam`}
        </CodeBlock>

        <h2>Quick Start</h2>
        <p>
          Create a red team instance, point it at your target, and run the full
          suite of security tests:
        </p>
        <CodeBlock language="typescript">
          {`import {
  createRedTeam,
  createAttackLibrary,
  createVulnerabilityScanner,
} from '@lov3kaizen/agentsea-redteam';

// Create a red team instance
const redTeam = createRedTeam({
  config: {
    target: {
      type: 'agent',
      name: 'my-agent',
      endpoint: 'https://api.example.com/chat',
    },
  },
});

// Run security tests
const results = await redTeam.run();
console.log('Risk Score:', results.summary.riskScore);
console.log('Vulnerabilities:', results.summary.vulnerabilities);`}
        </CodeBlock>

        <h2>Attack Library</h2>
        <p>Generate and manage adversarial attacks:</p>
        <CodeBlock language="typescript">
          {`import {
  createAttackLibrary,
  createAttackRegistry,
  createMutationGenerator,
  createCombinationGenerator,
  createAdversarialGenerator,
} from '@lov3kaizen/agentsea-redteam';

// Use the default attack library
const library = createAttackLibrary();

// Create mutation-based attacks
const mutator = createMutationGenerator({
  strategies: ['character-swap', 'encoding', 'obfuscation'],
});

// Combine attack strategies
const combiner = createCombinationGenerator({
  strategies: ['sequential', 'nested', 'layered'],
});

// Generate adversarial inputs
const adversarial = createAdversarialGenerator({
  strategies: ['roleplay', 'hypothetical', 'translation'],
});`}
        </CodeBlock>

        <h2>Vulnerability Scanning</h2>
        <p>Scan your agents for common vulnerabilities:</p>
        <CodeBlock language="typescript">
          {`import {
  createVulnerabilityScanner,
  createPromptAnalyzer,
  createSystemPromptAudit,
} from '@lov3kaizen/agentsea-redteam';

// Comprehensive vulnerability scan
const scanner = createVulnerabilityScanner({
  target: myAgent,
  categories: ['injection', 'jailbreak', 'data-leakage', 'bias'],
});

const scanResults = await scanner.scan();

// Analyze prompt safety
const analyzer = createPromptAnalyzer();
const analysis = await analyzer.analyze('Your system prompt here');

// Audit system prompt
const audit = createSystemPromptAudit();
const auditResults = await audit.audit(systemPrompt);`}
        </CodeBlock>

        <h2>Jailbreak Detection</h2>
        <p>Detect jailbreak attempts in real-time:</p>
        <CodeBlock language="typescript">
          {`import { createJailbreakDetector } from '@lov3kaizen/agentsea-redteam';

const detector = createJailbreakDetector({
  sensitivity: 'high',
});

const result = await detector.detect('Ignore all previous instructions...');
console.log('Is jailbreak:', result.isJailbreak);
console.log('Confidence:', result.confidence);
console.log('Category:', result.category);`}
        </CodeBlock>

        <h2>Compliance Checking</h2>
        <p>Verify compliance with AI regulations:</p>
        <CodeBlock language="typescript">
          {`import { ComplianceChecker } from '@lov3kaizen/agentsea-redteam';

const checker = new ComplianceChecker({
  frameworks: ['eu-ai-act', 'nist-ai-rmf'],
});

const compliance = await checker.check(myAgent);
console.log('Compliant:', compliance.isCompliant);
console.log('Findings:', compliance.findings);`}
        </CodeBlock>

        <h2>Audit & Evidence</h2>
        <p>
          The <code>AuditLogger</code> keeps an append-only, hash-chained trail:
          every entry stores the hash of the previous one, so any later mutation
          is detectable via <code>verifyIntegrity()</code>. Collect evidence and
          maintain audit trails:
        </p>
        <CodeBlock language="typescript">
          {`import { AuditLogger, EvidenceCollector } from '@lov3kaizen/agentsea-redteam';

const auditLogger = new AuditLogger();
const evidenceCollector = new EvidenceCollector();

// Log a security event (id, timestamp, and hashes are filled in for you)
auditLogger.log({
  eventType: 'finding_created',
  action: 'vulnerability-found',
  actor: { id: 'scanner', type: 'system' },
  resource: { id: 'my-agent', type: 'agent' },
  outcome: 'success',
  severity: 'high',
  details: { type: 'prompt-injection', category: 'direct' },
});

// Collect evidence and bundle it into a hashed package
evidenceCollector.collect({
  type: 'transcript',
  content: JSON.stringify({ input: attackInput, output: agentResponse }),
});
const pkg = evidenceCollector.createPackage('case-001');

// Verify the chain has not been tampered with
const integrity = auditLogger.verifyIntegrity();
console.log('Audit status:', integrity.status); // 'valid' | 'tampered'`}
        </CodeBlock>

        <h2>Persistent Audit Logging</h2>
        <p>
          By default the hash chain lives in memory. Attach an{' '}
          <code>AuditStore</code> to make it survive process restarts. The
          built-in <code>FileAuditStore</code> is an append-only JSONL backend —
          each entry is one JSON line, so writes are O(1) appends and the whole
          tamper-evident chain can be replayed (and re-verified) on load with{' '}
          <code>loadFromStore()</code>.
        </p>
        <CodeBlock language="typescript">
          {`import {
  AuditLogger,
  createFileAuditStore,
} from '@lov3kaizen/agentsea-redteam';

// Append-only JSONL store, durable on every log() call
const store = createFileAuditStore('./audit/redteam.jsonl');
const auditLogger = new AuditLogger({ store });

// On startup, replay the persisted chain to resume the existing trail
const loaded = await auditLogger.loadFromStore();
console.log(\`Resumed \${loaded} audit entries\`);

// New entries link onto the restored chain and are persisted as they happen
auditLogger.log({
  eventType: 'scan_completed',
  action: 'scheduled-scan',
  actor: { id: 'ci', type: 'system' },
  resource: { id: 'my-agent', type: 'agent' },
  outcome: 'success',
});

// The replayed-plus-new chain still verifies end to end
console.log(auditLogger.verifyIntegrity().status); // 'valid'`}
        </CodeBlock>
        <AlertBox type="info">
          <span>
            Writes use synchronous file appends, so an entry is durable the
            moment <code>log()</code> returns — losing the most recent entries on
            a crash would otherwise break the chain. Implement the{' '}
            <code>AuditStore</code> interface (<code>append</code>,{' '}
            <code>loadAll</code>, <code>clear</code>) to back the trail with your
            own datastore.
          </span>
        </AlertBox>

        <h2>Continuous Testing</h2>
        <p>
          <code>ContinuousTesting</code> runs a test function on demand or on a
          schedule, records each run, and feeds the resulting metrics into an{' '}
          <code>AlertManager</code>. Provide a <code>runner</code> that returns a
          summary plus the metrics you want to alert on:
        </p>
        <CodeBlock language="typescript">
          {`import {
  ContinuousTesting,
  AlertManager,
} from '@lov3kaizen/agentsea-redteam';

const alerts = new AlertManager({
  channels: [
    {
      id: 'sec-slack',
      type: 'slack',
      name: 'Security Slack',
      enabled: true,
      config: { webhookUrl: process.env.SLACK_WEBHOOK_URL },
      severities: ['warning', 'critical'],
    },
  ],
  rules: [
    {
      id: 'risk-high',
      name: 'Risk score too high',
      enabled: true,
      severity: 'critical',
      condition: { type: 'threshold', metric: 'riskScore', operator: 'greater', value: 70 },
      channelIds: ['sec-slack'],
    },
  ],
});

const continuous = new ContinuousTesting({
  runner: async () => {
    const results = await redTeam.run();
    return {
      summary: { /* RunSummary */ },
      metrics: { riskScore: results.summary.riskScore },
    };
  },
  alerts,
});

// Run once on demand (also evaluates rules and delivers any alerts)
const run = await continuous.runOnce('manual');
console.log('Triggered alerts:', run.alerts.length);`}
        </CodeBlock>

        <h2>Cron-Driven Schedules</h2>
        <p>
          Schedule recurring runs with <code>scheduleRuns()</code>. The built-in
          frequencies (<code>hourly</code>, <code>daily</code>,{' '}
          <code>weekly</code>, <code>monthly</code>) cover the common cases, and{' '}
          <code>frequency: 'custom'</code> lets you supply a standard{' '}
          <code>cronExpression</code> (parsed with <code>cron-parser</code>) plus
          an optional <code>timezone</code>:
        </p>
        <CodeBlock language="typescript">
          {`// Run every 6 hours via a cron expression
continuous.scheduleRuns({
  frequency: 'custom',
  cronExpression: '0 */6 * * *',
  timezone: 'America/New_York',
});

// Start the wall-clock loop (ticks every minute by default)
continuous.scheduler.start();

// ...or drive it deterministically in tests
await continuous.scheduler.tick(Date.now());`}
        </CodeBlock>
        <p>
          You can also compute the next fire time directly with the{' '}
          <code>nextCronAt</code> helper:
        </p>
        <CodeBlock language="typescript">
          {`import { nextCronAt } from '@lov3kaizen/agentsea-redteam';

// Next fire time (epoch ms) strictly after \`from\`; null for an invalid expression
const next = nextCronAt('0 9 * * 1', Date.now(), 'UTC'); // Mondays at 09:00 UTC`}
        </CodeBlock>

        <h2>Alert Delivery</h2>
        <p>
          <code>AlertManager</code> evaluates threshold/change rules against a
          metrics snapshot and delivers a notification to each configured
          channel. <code>deliver()</code> actually contacts the channels —
          webhook, Slack, Teams, and Discord post via <code>fetch</code>,
          PagerDuty uses the Events API v2 (the channel&apos;s{' '}
          <code>config.apiKey</code> is the routing key), and email goes through
          the optional <code>nodemailer</code> dependency. Per-channel{' '}
          <code>severities</code> route alerts, and each attempt — including
          failures — is recorded on the alert&apos;s{' '}
          <code>notificationHistory</code> so one bad channel never blocks the
          others.
        </p>
        <CodeBlock language="typescript">
          {`import { AlertManager } from '@lov3kaizen/agentsea-redteam';

const manager = new AlertManager({
  channels: [
    {
      id: 'oncall',
      type: 'pagerduty',
      name: 'On-call',
      enabled: true,
      config: { apiKey: process.env.PAGERDUTY_ROUTING_KEY }, // Events API v2 routing key
      severities: ['critical'],
    },
    {
      id: 'team-email',
      type: 'email',
      name: 'Security Team',
      enabled: true,
      config: {
        emails: ['security@example.com'],
        settings: { smtp: { host: 'smtp.example.com', port: 587 } },
      },
      severities: ['warning', 'critical'],
    },
  ],
  rules: [
    {
      id: 'vulns-found',
      name: 'Vulnerabilities found',
      enabled: true,
      severity: 'critical',
      condition: { type: 'threshold', metric: 'vulnerabilities', operator: 'greater', value: 0 },
      channelIds: ['oncall', 'team-email'],
    },
  ],
});

// Evaluate rules against metrics and deliver to matching channels
const triggered = await manager.evaluateAndDeliver({ vulnerabilities: 3 });
for (const alert of triggered) {
  console.log(alert.title, alert.notificationHistory); // per-channel sent/failed records
}`}
        </CodeBlock>
        <AlertBox type="info">
          <span>
            Email alerts require the optional <code>nodemailer</code> package —
            install it (or use a different channel type) and provide{' '}
            <code>config.settings.smtp.host</code>. All other channel types work
            out of the box using <code>fetch</code>.
          </span>
        </AlertBox>

        <h2>CI/CD Integration</h2>
        <p>Run security tests in your CI pipeline:</p>
        <CodeBlock language="typescript">
          {`import { createCIIntegration } from '@lov3kaizen/agentsea-redteam';

const ci = createCIIntegration({
  failOnHighSeverity: true,
  reportFormat: 'junit',
  outputPath: './security-report.xml',
});

const results = await ci.run();
process.exit(results.passed ? 0 : 1);`}
        </CodeBlock>

        <h2>AgentSea Integration</h2>
        <p>Run security tests directly against an AgentSea agent:</p>
        <CodeBlock language="typescript">
          {`import { createAgentSeaIntegration } from '@lov3kaizen/agentsea-redteam';
import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  { name: 'my-agent', model: 'claude-sonnet-4-6', provider: 'anthropic' },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  new ToolRegistry(),
);

const integration = createAgentSeaIntegration({
  agent,
  testCategories: ['injection', 'jailbreak', 'data-leakage'],
});

const results = await integration.run();`}
        </CodeBlock>

        <h2>Test Suites</h2>
        <p>Build custom test suites:</p>
        <CodeBlock language="typescript">
          {`import {
  createTestSuite,
  TestSuiteBuilder,
} from '@lov3kaizen/agentsea-redteam';

const suite = new TestSuiteBuilder()
  .addAttack('prompt-injection')
  .addAttack('jailbreak')
  .addScan('system-prompt')
  .addBenchmark('safety')
  .build();

const results = await suite.run({ target: myAgent });`}
        </CodeBlock>

        <h2>Report Generation</h2>
        <p>Generate detailed security reports:</p>
        <CodeBlock language="typescript">
          {`import { createReportGenerator } from '@lov3kaizen/agentsea-redteam';

const reporter = createReportGenerator({
  format: 'html',
  branding: { logo: './logo.png', company: 'Acme Corp' },
  sections: ['executive-summary', 'methodology', 'findings', 'recommendations'],
});

const report = await reporter.generate(results);`}
        </CodeBlock>

        <h2>Sub-Package Imports</h2>
        <p>Import specific modules directly for smaller bundles:</p>
        <CodeBlock language="typescript">
          {`// Import specific modules
import { RedTeam } from '@lov3kaizen/agentsea-redteam/core';
import { AttackLibrary } from '@lov3kaizen/agentsea-redteam/attacks';
import { VulnerabilityScanner } from '@lov3kaizen/agentsea-redteam/scanning';
import { SafetyBenchmark } from '@lov3kaizen/agentsea-redteam/benchmarks';
import { JailbreakDetector } from '@lov3kaizen/agentsea-redteam/detection';
import { ComplianceChecker } from '@lov3kaizen/agentsea-redteam/compliance';
import { AuditLogger } from '@lov3kaizen/agentsea-redteam/audit';
import { ContinuousTesting } from '@lov3kaizen/agentsea-redteam/continuous';`}
        </CodeBlock>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/guardrails">Add Runtime Guardrails</Link>
          </li>
          <li>
            <Link href="/docs/evaluate">Evaluate LLM Quality</Link>
          </li>
          <li>
            <Link href="/docs/observability">Monitor Security Events</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
