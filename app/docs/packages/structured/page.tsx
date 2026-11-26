import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import BulletPanel from '../../../components/docs/BulletPanel';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-structured | AgentSea',
  description: 'Extract LLM output validated against a Zod schema, with retries and optional streaming.',
};

const pkg: PackageDoc = {
  slug: 'structured',
  name: '@lov3kaizen/agentsea-structured',
  summary: 'Extracts LLM output validated against a Zod schema, with retries and optional streaming.',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-structured zod',
  installNote: 'Install the package and zod. Add the SDK for your provider, such as openai.',
  example: {
    lang: 'TS',
    code: `import { z } from 'zod';
import OpenAI from 'openai';
import { createStructuredClient, createOpenAIAdapter } from '@lov3kaizen/agentsea-structured';

const UserSchema = z.object({ name: z.string(), age: z.number().int().positive() });
const client = createStructuredClient(createOpenAIAdapter(new OpenAI()), { defaultMode: 'json', enableFixHints: true });

const result = await client.extract({
  model: 'gpt-5.5',
  messages: [{ role: 'user', content: 'John Doe, 30 years old' }],
  response_format: UserSchema,
});
if (result.success) console.log(result.data);`,
  },
  api: [
    {
      name: 'createStructuredClient(adapter, config)',
      description: 'Config: defaultMode, defaultRetry (maxAttempts, retryOn, backoffMultiplier, initialDelay, maxDelay), enableFixHints.',
    },
    {
      name: 'client.extract({ model, messages, response_format, mode })',
      description: "mode is 'json', 'tool', 'prompt', or { mode: 'hybrid', fallbackOrder }.",
    },
    {
      name: 'client.extractStream(options, streamingOptions)',
      description:
        'Streams partial results. Streaming options: yieldPartials, minFieldsBeforeYield, onFieldComplete, onPartial, onError.',
    },
    {
      name: 'createOpenAIAdapter, createAnthropicAdapter, createGoogleAdapter',
      description: 'Provider adapters for the client.',
    },
    {
      name: 'schemaToPrompt, validateSchema, getValidationHints',
      description: 'Schema helpers: convert a schema to a prompt, validate it, and get validation hints.',
    },
  ],
  caveats: [
    'JSON mode is used natively with OpenAI and Google models. Other providers use tool or prompt mode.',
    'Install only the SDK for the provider you use. openai, @anthropic-ai/sdk and @google/generative-ai are optional peers.',
    'Output is validated against your Zod schema and retried on failure. Retry limits beyond the config example\'s defaults are not documented.',
    'Requires Node.js 20 or later. ESM only.',
  ],
};

const toc = [
  { id: 'streaming', label: 'Streaming' },
  { id: 'retries', label: 'Retries and fix hints' },
  { id: 'extractors', label: 'Built-in extractors' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="streaming" num="05" title="Streaming">
        <p className="text-base leading-relaxed text-brand-navy">
          extractStream returns partial objects as fields arrive. Read them with partials() and wait for the complete
          result with final().
        </p>
        <CodeBlock
          lang="TS"
          code={`const stream = await client.extractStream(
  { model: 'gpt-5.5', messages, response_format: UserSchema },
  {
    yieldPartials: true,
    minFieldsBeforeYield: 2,
    onFieldComplete: (path, value) => console.log(\`Field \${path} completed:\`, value),
  },
);

for await (const partial of stream.partials()) {
  console.log('Partial:', partial);
}

const final = await stream.final();`}
        />
      </DocSection>

      <DocSection id="retries" num="06" title="Retries and fix hints">
        <p className="text-base leading-relaxed text-brand-navy">
          Set defaultRetry on the client. retryOn lists the failures that trigger a retry, such as validation_error and
          parse_error. With enableFixHints on, the validation problems are added to the retry prompt.
        </p>
        <CodeBlock
          lang="TS"
          code={`const client = createStructuredClient(adapter, {
  defaultRetry: {
    maxAttempts: 3,
    retryOn: ['validation_error', 'parse_error'],
    backoffMultiplier: 1.5,
    initialDelay: 1000,
    maxDelay: 10000,
  },
  enableFixHints: true,
});

client.on('extraction:retry', ({ attempt, reason, hints }) => {
  console.log(\`Retry \${attempt}: \${reason}\`, hints);
});`}
        />
        <BulletPanel items={['The event names are extraction:retry, extraction:error, extraction:success and validation:failed.']} />
      </DocSection>

      <DocSection id="extractors" num="07" title="Built-in extractors">
        <p className="text-base leading-relaxed text-brand-navy">
          Extractors is a set of ready-made schemas for common tasks. Pass one to the AgentSea structured provider, which you create with createStructuredProvider.
          Register a provider with registerProvider before you call extract.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { z } from 'zod';
import { Extractors, createStructuredProvider } from '@lov3kaizen/agentsea-structured';

const provider = createStructuredProvider({ defaultModel: 'gpt-5.5', enableFixHints: true });
// registerProvider(name, agentSeaClient, setAsDefault) must run before extract.

const sentiment = await provider.extract(Extractors.sentiment(), 'I love this product!');
const tags = Extractors.list(z.string(), { minItems: 1, maxItems: 10 });
const category = Extractors.classification(['spam', 'not_spam'], { confidence: true });`}
        />
      </DocSection>
    </PackagePage>
  );
}
