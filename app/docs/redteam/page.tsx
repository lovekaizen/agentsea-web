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
        <p>Collect evidence and maintain audit trails:</p>
        <CodeBlock language="typescript">
          {`import { AuditLogger, EvidenceCollector } from '@lov3kaizen/agentsea-redteam';

const auditLogger = new AuditLogger({ storage: 'sqlite' });
const evidenceCollector = new EvidenceCollector();

// Log security events
auditLogger.log({
  event: 'vulnerability-found',
  severity: 'high',
  details: { type: 'prompt-injection', category: 'direct' },
});

// Collect evidence
evidenceCollector.capture({
  input: attackInput,
  output: agentResponse,
  timestamp: Date.now(),
});`}
        </CodeBlock>

        <h2>Continuous Testing</h2>
        <p>Schedule automated security tests with alerting:</p>
        <CodeBlock language="typescript">
          {`import {
  ContinuousTesting,
  Scheduler,
  AlertManager,
} from '@lov3kaizen/agentsea-redteam';

const continuous = new ContinuousTesting({
  scheduler: new Scheduler({ cron: '0 */6 * * *' }), // Every 6 hours
  alertManager: new AlertManager({
    channels: ['slack', 'email'],
    threshold: 'medium',
  }),
});

continuous.start();`}
        </CodeBlock>

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
