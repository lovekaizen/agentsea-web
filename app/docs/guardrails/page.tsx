import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function GuardrailsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Guardrails"
        titleGradient="warm"
        description="Comprehensive safety and validation engine for AI applications. Content safety, prompt injection detection, output validation, and intelligent rate limiting."
      />

      <AlertBox type="info" gradient>
        <span>
          Guardrails provide input/output validation, content filtering, and
          safety checks to ensure responsible AI behavior in production.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-guardrails`}
        </CodeBlock>

        <h2>Guard Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
          {guardCategories.map((category, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {category.guards.map((guard, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {guard}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2>Quick Start</h2>
        <CodeBlock language="typescript">
          {`import {
  createGuardrailsEngine,
  ToxicityGuard,
  PIIGuard,
  PromptInjectionGuard,
} from '@lov3kaizen/agentsea-guardrails';

// Create the engine
const engine = createGuardrailsEngine({
  guards: [
    { name: 'toxicity', enabled: true, type: 'input', action: 'block' },
    { name: 'pii', enabled: true, type: 'both', action: 'transform' },
    { name: 'prompt-injection', enabled: true, type: 'input', action: 'block' },
  ],
  failureMode: 'fail-fast',
  defaultAction: 'allow',
});

// Register guards
engine.registerGuard(new ToxicityGuard({ sensitivity: 'medium' }));
engine.registerGuard(new PIIGuard({ types: ['email', 'phone'], maskingStrategy: 'redact' }));
engine.registerGuard(new PromptInjectionGuard({ sensitivity: 'high' }));

// Check input
const result = await engine.checkInput('What is the weather today?', {
  sessionId: 'session-1',
  userId: 'user-1',
});

if (result.passed) {
  console.log('Input is safe');
} else {
  console.log(\`Blocked: \${result.message}\`);
}`}
        </CodeBlock>

        <h2>Content Guards</h2>

        <h3>ToxicityGuard</h3>
        <p>Detects toxic, harmful, or inappropriate content:</p>
        <CodeBlock language="typescript">
          {`import { ToxicityGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new ToxicityGuard({
  sensitivity: 'medium', // 'low' | 'medium' | 'high'
  categories: ['hate', 'violence', 'harassment', 'sexual'],
});`}
        </CodeBlock>

        <h3>PIIGuard</h3>
        <p>Detects and optionally masks personally identifiable information:</p>
        <CodeBlock language="typescript">
          {`import { PIIGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new PIIGuard({
  types: ['email', 'phone', 'ssn', 'creditCard', 'address', 'name'],
  maskingStrategy: 'redact', // 'redact' | 'mask' | 'hash'
  customPatterns: [
    { name: 'employeeId', pattern: /EMP-\\d{6}/ },
  ],
});`}
        </CodeBlock>

        <h3>TopicGuard</h3>
        <p>Filters content based on allowed/blocked topics:</p>
        <CodeBlock language="typescript">
          {`import { TopicGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new TopicGuard({
  allowedTopics: ['technology', 'science', 'general'],
  blockedTopics: ['politics', 'religion'],
  confidenceThreshold: 0.7,
});`}
        </CodeBlock>

        <h3>BiasGuard</h3>
        <p>Detects biased language:</p>
        <CodeBlock language="typescript">
          {`import { BiasGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new BiasGuard({
  categories: ['gender', 'race', 'religion', 'political'],
  sensitivity: 'medium',
});`}
        </CodeBlock>

        <h2>Security Guards</h2>

        <h3>PromptInjectionGuard</h3>
        <p>Detects prompt injection attempts:</p>
        <CodeBlock language="typescript">
          {`import { PromptInjectionGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new PromptInjectionGuard({
  sensitivity: 'high',
  customPatterns: [
    /reveal.*system.*prompt/i,
    /ignore.*previous.*instructions/i,
  ],
});`}
        </CodeBlock>

        <h3>JailbreakGuard</h3>
        <p>Detects jailbreak attempts (DAN, roleplay attacks):</p>
        <CodeBlock language="typescript">
          {`import { JailbreakGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new JailbreakGuard({
  sensitivity: 'high',
});`}
        </CodeBlock>

        <h3>DataLeakageGuard</h3>
        <p>Prevents sensitive data from being exposed in outputs:</p>
        <CodeBlock language="typescript">
          {`import { DataLeakageGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new DataLeakageGuard({
  patterns: ['apiKey', 'password', 'secret', 'token'],
  customPatterns: [
    { name: 'internalUrl', pattern: /internal\\.company\\.com/ },
  ],
});`}
        </CodeBlock>

        <h2>Validation Guards</h2>

        <h3>SchemaGuard</h3>
        <p>Validates output against a Zod schema:</p>
        <CodeBlock language="typescript">
          {`import { SchemaGuard } from '@lov3kaizen/agentsea-guardrails';
import { z } from 'zod';

const ResponseSchema = z.object({
  answer: z.string(),
  confidence: z.number().min(0).max(1),
});

const guard = new SchemaGuard({
  schema: ResponseSchema,
});`}
        </CodeBlock>

        <h3>FormatGuard</h3>
        <p>Ensures output matches expected format:</p>
        <CodeBlock language="typescript">
          {`import { FormatGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new FormatGuard({
  format: 'json', // 'json' | 'xml' | 'markdown' | 'custom'
  customValidator: (content) => content.startsWith('{'),
});`}
        </CodeBlock>

        <h2>Operational Guards</h2>

        <h3>TokenBudgetGuard</h3>
        <p>Enforces token limits:</p>
        <CodeBlock language="typescript">
          {`import { TokenBudgetGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new TokenBudgetGuard({
  maxTokensPerRequest: 4096,
  maxTokensPerSession: 50000,
  maxTokensPerDay: 1000000,
  warningThreshold: 0.8,
});`}
        </CodeBlock>

        <h3>RateLimitGuard</h3>
        <p>Limits request rates:</p>
        <CodeBlock language="typescript">
          {`import { RateLimitGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new RateLimitGuard({
  requestsPerMinute: 60,
  requestsPerHour: 1000,
  requestsPerDay: 10000,
});`}
        </CodeBlock>

        <h3>CostGuard</h3>
        <p>Tracks and limits costs:</p>
        <CodeBlock language="typescript">
          {`import { CostGuard } from '@lov3kaizen/agentsea-guardrails';

const guard = new CostGuard({
  maxCostPerRequest: 0.10,
  maxCostPerSession: 5.00,
  maxCostPerDay: 100.00,
  currency: 'USD',
});`}
        </CodeBlock>

        <h2>Rules Engine</h2>
        <p>Define policies with JSON rules:</p>

        <CodeBlock language="typescript">
          {`import { createRulesEngine, type RuleSet } from '@lov3kaizen/agentsea-guardrails';

const rules: RuleSet = {
  id: 'content-policy',
  name: 'Content Policy',
  version: '1.0.0',
  rules: [
    {
      id: 'block-profanity',
      name: 'Block Profanity',
      conditions: [
        { field: 'input', operator: 'matches', value: '\\\\b(bad|word)\\\\b' },
      ],
      actions: [
        { type: 'block', params: { reason: 'Profanity detected' } },
      ],
      priority: 100,
      enabled: true,
    },
    {
      id: 'redact-emails',
      name: 'Redact Emails',
      conditions: [
        { field: 'input', operator: 'matches', value: '[a-z]+@[a-z]+\\\\.[a-z]+' },
      ],
      actions: [
        { type: 'transform', params: { pattern: '...', replacement: '[EMAIL]' } },
      ],
      priority: 80,
      enabled: true,
    },
  ],
};

const engine = createRulesEngine({ defaultAction: 'allow' });
engine.loadRuleSet(rules);

const result = await engine.evaluate({
  input: 'Contact me at user@example.com',
  type: 'input',
  metadata: {},
});`}
        </CodeBlock>

        <h2>NestJS Integration</h2>
        <CodeBlock language="typescript">
          {`import { Module, Controller, Post, Body } from '@nestjs/common';
import { GuardrailsModule, Guardrailed, BypassGuards } from '@lov3kaizen/agentsea-guardrails/nestjs';
import { z } from 'zod';

@Module({
  imports: [
    GuardrailsModule.forRoot({
      guards: [
        { name: 'toxicity', enabled: true, type: 'input', action: 'block' },
        { name: 'pii', enabled: true, type: 'both', action: 'transform' },
        { name: 'prompt-injection', enabled: true, type: 'input', action: 'block' },
      ],
      failureMode: 'fail-fast',
      defaultAction: 'allow',
    }),
  ],
})
export class AppModule {}

const ResponseSchema = z.object({
  answer: z.string(),
  confidence: z.number(),
});

@Controller('chat')
export class ChatController {
  @Post()
  @Guardrailed({
    input: ['toxicity', 'prompt-injection', 'pii'],
    output: ['pii', 'schema'],
    schema: ResponseSchema,
  })
  async chat(@Body() body: { message: string }) {
    return { answer: '...', confidence: 0.95 };
  }

  @Post('admin')
  @BypassGuards()
  async adminChat(@Body() body: { message: string }) {
    // Bypasses all guardrails
    return { answer: '...' };
  }
}`}
        </CodeBlock>

        <h2>AgentSea Integration</h2>
        <CodeBlock language="typescript">
          {`import { Agent } from '@lov3kaizen/agentsea-core';
import { GuardrailsMiddleware, GuardedAgent } from '@lov3kaizen/agentsea-guardrails/agentsea';

// Middleware approach
const agent = new Agent({ /* config */ });
agent.use(new GuardrailsMiddleware(guardrailsConfig));

// Wrapper approach
const guardedAgent = new GuardedAgent(agent, guardrailsEngine);
const response = await guardedAgent.run('User message');`}
        </CodeBlock>

        <h2>Configuration</h2>
        <CodeBlock language="typescript">
          {`interface GuardrailsConfig {
  // Array of guard configurations
  guards: GuardConfig[];

  // How to handle failures
  // - 'fail-fast': Stop on first failure
  // - 'fail-safe': Continue with warnings
  // - 'collect-all': Run all guards, collect results
  failureMode: 'fail-fast' | 'fail-safe' | 'collect-all';

  // Default action when no guard blocks
  defaultAction: 'allow' | 'block' | 'warn';

  // Telemetry settings
  telemetry?: {
    logging?: { enabled: boolean; level: string };
    metrics?: { enabled: boolean; prefix: string };
    tracing?: { enabled: boolean; serviceName: string };
  };
}`}
        </CodeBlock>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/evaluate">Evaluate LLM Quality</Link>
          </li>
          <li>
            <Link href="/docs/observability">Monitor Guardrails</Link>
          </li>
          <li>
            <Link href="/docs/gateway">Use with Gateway</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const guardCategories = [
  {
    icon: '🛡️',
    name: 'Content Safety',
    description: 'Protect against harmful content',
    guards: ['Toxicity', 'PII', 'Topic', 'Bias'],
  },
  {
    icon: '🔒',
    name: 'Security',
    description: 'Prevent attacks and data leakage',
    guards: ['Prompt Injection', 'Jailbreak', 'Data Leakage'],
  },
  {
    icon: '✅',
    name: 'Validation',
    description: 'Ensure output quality and format',
    guards: ['Schema', 'Format', 'Factuality'],
  },
  {
    icon: '⚙️',
    name: 'Operational',
    description: 'Manage resources and costs',
    guards: ['Token Budget', 'Rate Limit', 'Cost'],
  },
];
