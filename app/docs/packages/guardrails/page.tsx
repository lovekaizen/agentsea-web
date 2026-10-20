import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import BulletPanel from '../../../components/docs/BulletPanel';
import { ApiList, ApiRow } from '../../../components/docs/ApiList';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-guardrails | AgentSea',
  description:
    'A guard engine that checks text for toxicity, PII, prompt injection, schema and budget limits, and applies a block, transform or warn action.',
};

const pkg: PackageDoc = {
  slug: 'guardrails',
  name: '@lov3kaizen/agentsea-guardrails',
  summary:
    'A guard engine that checks text for toxicity, PII, prompt injection, schema and budget limits, and applies a block, transform or warn action.',
  version: '1.2.1',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-guardrails',
  example: {
    lang: 'TS',
    code: `import { createGuardrailsEngine, ToxicityGuard, PIIGuard, PromptInjectionGuard } from '@lov3kaizen/agentsea-guardrails';

const engine = createGuardrailsEngine({
  guards: [
    { name: 'toxicity', enabled: true, onFailure: 'block' },
    { name: 'pii', enabled: true, onFailure: 'transform' },
    { name: 'prompt-injection', enabled: true, onFailure: 'block' },
  ], failureMode: 'fail-fast', defaultAction: 'allow',
});
engine.registerGuard(new ToxicityGuard({ sensitivity: 'medium' }));
engine.registerGuard(new PIIGuard({ types: ['email', 'phone'], enableMasking: true, maskFormat: '[REDACTED]' }));
engine.registerGuard(new PromptInjectionGuard({ sensitivity: 'high' }));
const result = await engine.checkInput('What is the weather today?', { sessionId: 'session-1', userId: 'user-1' });
if (result.passed) console.log('Input is safe');`,
  },
  api: [
    {
      name: 'createGuardrailsEngine({ guards, failureMode, defaultAction })',
      description: 'Builds the engine. failureMode is fail-fast, fail-safe or collect-all.',
    },
    {
      name: 'engine.checkInput(text, context)',
      description: 'Returns passed, message and transformedContent.',
    },
    {
      name: 'PIIGuard({ types, customPatterns, maskFormat, enableMasking })',
      description: 'Detects PII such as email and phone. With enableMasking, it replaces each match with maskFormat.',
    },
    {
      name: 'TokenBudgetGuard / CostGuard',
      description:
        'Token limits per request and per session (TokenBudgetGuard). Cost limits per request, per session and per day (CostGuard).',
    },
    {
      name: 'createRulesEngine({ ruleSets })',
      description: 'Runs JSON rule sets with conditions, actions and priorities.',
    },
  ],
  caveats: [
    'FactualityGuard needs a verifier function you supply. The example uses a fixed result.',
    'The docs do not explain the detection method for each guard, or how sensitivity changes detection.',
    'Framework adapters live under subpaths: /nestjs, /agentsea, /langchain and /vercel-ai.',
    'The Vercel AI SDK example uses experimental_transform. Check it against your SDK version.',
  ],
};

const toc = [
  { id: 'built-in-guards', label: 'Built-in guards' },
  { id: 'rules', label: 'Rules engine' },
  { id: 'adapters', label: 'Framework adapters' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="built-in-guards" num="05" title="Built-in guards">
        <p className="text-base leading-relaxed text-brand-navy">
          Each guard is a class you register on the engine. The options below are the ones the guard classes accept.
        </p>
        <ApiList>
          <ApiRow name="ToxicityGuard({ sensitivity, categories, categoryThresholds })">
            Flags toxic content by category, with a threshold per category.
          </ApiRow>
          <ApiRow name="PIIGuard({ types, customPatterns, maskFormat, enableMasking })">
            Detects PII. Pass your own patterns in customPatterns.
          </ApiRow>
          <ApiRow name="TopicGuard({ allowedTopics, blockedTopics, topicKeywords, minConfidence })">
            Filters content by allowed and blocked topics.
          </ApiRow>
          <ApiRow name="BiasGuard({ categories, customPatterns })">Detects biased language by category.</ApiRow>
          <ApiRow name="PromptInjectionGuard({ sensitivity, customPatterns, useHeuristics, checkDelimiters })">
            Detects prompt injection attempts.
          </ApiRow>
          <ApiRow name="JailbreakGuard({ checkDAN, checkRoleplay, checkHypothetical, customPatterns })">
            Detects jailbreak attempts such as DAN prompts and roleplay framing.
          </ApiRow>
          <ApiRow name="DataLeakageGuard({ blockApiKeys, blockPasswords, blockPrivateKeys, blockConnectionStrings, customPatterns, enableMasking })">
            Stops secrets from leaving in outputs.
          </ApiRow>
          <ApiRow name="SchemaGuard({ schema, strict, parseJson, errorMessages })">
            Validates output against a Zod schema.
          </ApiRow>
          <ApiRow name="FormatGuard({ format, customValidator, allowEmpty })">
            Checks that output matches an expected format, or a custom validator.
          </ApiRow>
          <ApiRow name="RateLimitGuard({ maxRequests, windowMs, keyBy, keyExtractor, skipSuccessfulRequests })">
            Limits requests in a time window, keyed by user, session, IP or globally.
          </ApiRow>
        </ApiList>
        <CodeBlock
          lang="TS"
          code={`import { SchemaGuard } from '@lov3kaizen/agentsea-guardrails';
import { z } from 'zod';

const ResponseSchema = z.object({
  answer: z.string(),
  confidence: z.number().min(0).max(1),
});
const guard = new SchemaGuard({ schema: ResponseSchema, parseJson: true });`}
        />
      </DocSection>

      <DocSection id="rules" num="06" title="Rules engine">
        <p className="text-base leading-relaxed text-brand-navy">
          Write policies as JSON rule sets and load them into the rules engine. Each rule has a priority and can be disabled.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { createRulesEngine, type RuleSet } from '@lov3kaizen/agentsea-guardrails';

const rules: RuleSet = {
  id: 'content-policy',
  name: 'Content Policy',
  version: '1.0.0',
  rules: [
    {
      id: 'block-profanity',
      name: 'Block Profanity',
      conditions: { field: 'input', operator: 'matches', value: '\\\\b(bad|word)\\\\b' },
      actions: [{ type: 'block', params: { reason: 'Profanity detected' } }],
      priority: 100,
      enabled: true,
    },
  ],
};

const engine = createRulesEngine({ ruleSets: [rules] });
const result = await engine.evaluate('Contact me at user@example.com');`}
        />
      </DocSection>

      <DocSection id="adapters" num="07" title="Framework adapters">
        <BulletPanel
          items={[
            <>
              <code>@lov3kaizen/agentsea-guardrails/nestjs</code> for NestJS modules, guards and decorators.
            </>,
            <>
              <code>@lov3kaizen/agentsea-guardrails/agentsea</code> for the AgentSea integration.
            </>,
            <>
              <code>@lov3kaizen/agentsea-guardrails/langchain</code> and <code>/vercel-ai</code> for the LangChain and Vercel AI SDK integrations.
            </>,
          ]}
        />
      </DocSection>
    </PackagePage>
  );
}
