import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Per-model type safety | AgentSea',
  description:
    'Compile-time TypeScript errors for model options that a model does not support, using per-model config builders in AgentSea.',
};

const toc = [
  { id: 'why', label: 'Why per-model type safety' },
  { id: 'quick-start', label: 'Quick start' },
  { id: 'config-builders', label: 'Config builders' },
  { id: 'creating-providers', label: 'Creating providers' },
  { id: 'capability-reference', label: 'Capability reference' },
  { id: 'runtime-checks', label: 'Runtime capability checks' },
  { id: 'type-level-checks', label: 'Type-level checks' },
  { id: 'migration', label: 'Migration guide' },
  { id: 'next-steps', label: 'Next steps' },
];

const cell = 'border-t border-rule px-3 py-2 text-center';
const headCell = 'border-b border-rule px-3 py-2 text-center font-semibold text-brand-deep';

export default function PerModelTypeSafetyPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Per-model type safety"
      lead="Get compile-time TypeScript errors for model options that a model does not support. Inspired by TanStack AI."
      active="concepts"
      toc={toc}
    >
      <DocSection id="why" num="01" title="Why per-model type safety">
        <p className="text-base leading-relaxed text-brand-navy">
          Different models have different capabilities. <code>o1-mini</code> does not support
          tools. <code>o1</code> does not support system prompts. Claude Haiku 4.5 does not support
          extended thinking.
        </p>
        <p className="text-base leading-relaxed text-brand-navy">
          Without type safety, you find these mismatches at runtime. With per-model type safety,
          TypeScript reports them while you write the code.
        </p>
        <div className="overflow-x-auto rounded-xl border border-rule bg-surface-paper">
          <table className="min-w-full text-[15px] text-brand-navy">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-brand-deep">Model</th>
                <th className={headCell}>Tools</th>
                <th className={headCell}>System prompt</th>
                <th className={headCell}>Vision</th>
                <th className={headCell}>Extended thinking</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Claude 3.5 Sonnet', 'Yes', 'Yes', 'Yes', 'Yes'],
                ['Claude 3 Haiku', 'Yes', 'Yes', 'Yes', 'No'],
                ['GPT-4o', 'Yes', 'Yes', 'Yes', 'No'],
                ['o1', 'Yes', 'No', 'Yes', 'Yes'],
                ['o1-mini', 'No', 'No', 'No', 'Yes'],
                ['Gemini 1.5 Pro', 'Yes', 'Yes', 'Yes', 'No'],
              ].map((row) => (
                <tr key={row[0]}>
                  <td className="border-t border-rule px-3 py-2 font-semibold text-brand-deep">{row[0]}</td>
                  {row.slice(1).map((value, index) => (
                    <td key={index} className={cell}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="quick-start" num="02" title="Quick start">
        <CodeBlock
          lang="TS"
          code={`import { anthropic, openai, createProvider } from '@lov3kaizen/agentsea-core';

// Valid: Claude Sonnet 4.5 supports tools and extended thinking
const claudeConfig = anthropic('claude-sonnet-4-5-20250929', {
  tools: [myTool],
  systemPrompt: 'You are helpful',
  thinking: { type: 'enabled', budgetTokens: 10000 },
  temperature: 0.7,
});

// Valid: o1 supports tools but NOT system prompts
const o1Config = openai('o1', {
  tools: [myTool],
  reasoningEffort: 'high',
  // systemPrompt: '...' // Error: not allowed for o1
});

// Error: o1-mini does not support tools
const o1MiniConfig = openai('o1-mini', {
  // tools: [myTool], // Error: 'tools' does not exist in type
  reasoningEffort: 'medium',
});

const provider = createProvider(claudeConfig);
console.log(provider.supportsCapability('vision'));`}
        />
      </DocSection>

      <DocSection id="config-builders" num="03" title="Config builders">
        <p className="text-base leading-relaxed text-brand-navy">
          Each provider has a config builder. It takes a model ID and returns a config whose
          options match that model.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">anthropic(model, config?)</h3>
        <CodeBlock
          lang="TS"
          code={`import { anthropic } from '@lov3kaizen/agentsea-core';

// Claude Opus 4.8: tools and system prompts. Thinking is adaptive on 4.6+ models,
// so budgetTokens-style config is not part of the type for them.
const config = anthropic('claude-opus-4-8', {
  tools: [myTool],
  systemPrompt: 'You are a helpful assistant',
  temperature: 0.7,
  maxTokens: 4096,
  providerOptions: {
    metadata: { userId: 'user-123' },
  },
});

// Claude Sonnet 4.5: explicit extended thinking
const thinkingConfig = anthropic('claude-sonnet-4-5-20250929', {
  tools: [myTool],
  thinking: { type: 'enabled', budgetTokens: 10000 },
});

// Claude Haiku 4.5: no extended thinking
const haikuConfig = anthropic('claude-haiku-4-5-20251001', {
  tools: [myTool],
  systemPrompt: 'You are fast',
  // thinking: { ... } // Error: not allowed for Haiku 4.5
});`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Typed models include <code>claude-opus-4-8</code> (the default), <code>claude-opus-4-7</code>,{' '}
          <code>claude-opus-4-6</code>, <code>claude-sonnet-4-6</code>, <code>claude-haiku-4-5</code>,{' '}
          <code>claude-fable-5</code>, <code>claude-sonnet-4-5-20250929</code>,{' '}
          <code>claude-opus-4-5-20251101</code> and the Claude 3.x family.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">openai(model, config?)</h3>
        <CodeBlock
          lang="TS"
          code={`import { openai } from '@lov3kaizen/agentsea-core';

// GPT-4o: tools and system prompts
const gpt4oConfig = openai('gpt-4o', {
  tools: [myTool],
  systemPrompt: 'You are helpful',
  temperature: 0.8,
  providerOptions: {
    responseFormat: { type: 'json_object' },
    seed: 42,
    parallelToolCalls: true,
  },
});

// o1: tools and reasoning, but no system prompt
const o1Config = openai('o1', {
  tools: [myTool],
  reasoningEffort: 'high',
});

// o1-mini: reasoning only
const o1MiniConfig = openai('o1-mini', {
  reasoningEffort: 'medium',
});

// o3-mini: tools, but no system prompt
const o3MiniConfig = openai('o3-mini', {
  tools: [myTool],
  reasoningEffort: 'high',
});`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Typed models include <code>gpt-5.5</code>, <code>gpt-5.4-mini</code>, <code>gpt-5</code>,{' '}
          <code>gpt-4.1</code>, <code>gpt-4o</code>, <code>gpt-4o-mini</code>, <code>gpt-4-turbo</code>,{' '}
          <code>gpt-4</code>, <code>gpt-3.5-turbo</code> and the reasoning models <code>o3</code>,{' '}
          <code>o3-mini</code>, <code>o1</code> and <code>o1-mini</code>.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">gemini(model, config?)</h3>
        <CodeBlock
          lang="TS"
          code={`import { gemini } from '@lov3kaizen/agentsea-core';

const geminiConfig = gemini('gemini-2.5-pro', {
  tools: [myTool],
  systemPrompt: 'You are helpful',
  topK: 40,
  temperature: 0.9,
  providerOptions: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Typed models include <code>gemini-3.5-flash</code>, <code>gemini-3.1-pro-preview</code>,{' '}
          <code>gemini-2.5-pro</code>, <code>gemini-2.5-flash</code>, <code>gemini-2.0-flash</code>,{' '}
          <code>gemini-1.5-pro</code>, <code>gemini-1.5-flash</code> and <code>gemini-1.5-flash-8b</code>.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">ollama(model, config?)</h3>
        <CodeBlock
          lang="TS"
          code={`import { ollama } from '@lov3kaizen/agentsea-core';

// Ollama models are user-defined, so the model ID is not checked strictly
const ollamaConfig = ollama('llama3.2', {
  tools: [myTool],
  systemPrompt: 'You are helpful',
  temperature: 0.7,
  providerOptions: {
    numCtx: 4096,
    numGpu: 1,
  },
});`}
        />
        <Callout kind="note">
          Ollama model IDs are not a fixed list, so type checks are looser here. Whether a model
          supports tools depends on the model you pull.
        </Callout>

        <h3 className="text-lg font-semibold text-brand-deep">mistral(), deepseek(), xai()</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          Mistral, DeepSeek and xAI use the same builder shape. Each checks the model ID and the
          options that model supports. <code>createProvider</code> sets up the OpenAI-compatible
          transport and reads the matching key variable: <code>MISTRAL_API_KEY</code>,{' '}
          <code>DEEPSEEK_API_KEY</code> or <code>XAI_API_KEY</code>.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { mistral, deepseek, xai, createProvider } from '@lov3kaizen/agentsea-core';

const mistralConfig = mistral('mistral-large-latest', {
  tools: [myTool],
  systemPrompt: 'You are helpful',
  temperature: 0.7,
});

const deepseekConfig = deepseek('deepseek-reasoner', {
  systemPrompt: 'Think step by step',
});

const grokConfig = xai('grok-3', { tools: [myTool] });

const provider = createProvider(mistralConfig);`}
        />
      </DocSection>

      <DocSection id="creating-providers" num="04" title="Creating providers">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>createProvider()</code> takes any config builder result and returns a provider
          wrapper. Provider-specific factories also accept an explicit API key.
        </p>
        <CodeBlock
          lang="TS"
          code={`import {
  anthropic,
  openai,
  createProvider,
  createAnthropicProvider,
} from '@lov3kaizen/agentsea-core';

// Generic factory
const claudeProvider = createProvider(anthropic('claude-opus-4-8', { tools: [myTool] }));
const gptProvider = createProvider(openai('gpt-4o', { tools: [myTool] }));

// Provider-specific factory, with an explicit key
const claude = createAnthropicProvider(
  anthropic('claude-opus-4-8', { tools: [myTool] }),
  { apiKey: process.env.ANTHROPIC_API_KEY },
);

console.log(claude.config.model); // 'claude-opus-4-8'
console.log(claude.supportsCapability('vision'));
console.log(claude.getModelInfo()?.capabilities.contextWindow);`}
        />
      </DocSection>

      <DocSection id="capability-reference" num="05" title="Capability reference">
        <p className="text-base leading-relaxed text-brand-navy">
          The tables below are illustrative. The typed registry includes the latest Claude, GPT-5,
          o3 and Gemini 3 and 2.5 models. For exact capabilities, context window and maximum
          output of a specific model, call <code>getModelInfo(model)</code>.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">Anthropic</h3>
        <div className="overflow-x-auto rounded-xl border border-rule bg-surface-paper">
          <table className="min-w-full text-[15px] text-brand-navy">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-brand-deep">Model</th>
                <th className={headCell}>Tools</th>
                <th className={headCell}>Vision</th>
                <th className={headCell}>Thinking</th>
                <th className={headCell}>Context</th>
                <th className={headCell}>Max output</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['claude-3-5-sonnet-*', 'Yes', 'Yes', 'Yes', '200K', '8,192'],
                ['claude-3-5-haiku-*', 'Yes', 'Yes', 'No', '200K', '8,192'],
                ['claude-3-opus-*', 'Yes', 'Yes', 'No', '200K', '4,096'],
                ['claude-opus-4-5-*', 'Yes', 'Yes', 'Yes', '200K', '32,000'],
              ].map((row) => (
                <tr key={row[0]}>
                  <td className="border-t border-rule px-3 py-2 font-semibold text-brand-deep">{row[0]}</td>
                  {row.slice(1).map((value, index) => (
                    <td key={index} className={cell}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-brand-deep">OpenAI</h3>
        <div className="overflow-x-auto rounded-xl border border-rule bg-surface-paper">
          <table className="min-w-full text-[15px] text-brand-navy">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-brand-deep">Model</th>
                <th className={headCell}>Tools</th>
                <th className={headCell}>System</th>
                <th className={headCell}>Vision</th>
                <th className={headCell}>Thinking</th>
                <th className={headCell}>Context</th>
                <th className={headCell}>Max output</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['gpt-4o*', 'Yes', 'Yes', 'Yes', 'No', '128K', '16,384'],
                ['gpt-4-turbo', 'Yes', 'Yes', 'Yes', 'No', '128K', '4,096'],
                ['gpt-3.5-turbo', 'Yes', 'Yes', 'No', 'No', '16K', '4,096'],
                ['o1', 'Yes', 'No', 'Yes', 'Yes', '200K', '100,000'],
                ['o1-mini', 'No', 'No', 'No', 'Yes', '128K', '65,536'],
                ['o3-mini', 'Yes', 'No', 'No', 'Yes', '200K', '100,000'],
              ].map((row) => (
                <tr key={row[0]}>
                  <td className="border-t border-rule px-3 py-2 font-semibold text-brand-deep">{row[0]}</td>
                  {row.slice(1).map((value, index) => (
                    <td key={index} className={cell}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-brand-deep">Gemini</h3>
        <div className="overflow-x-auto rounded-xl border border-rule bg-surface-paper">
          <table className="min-w-full text-[15px] text-brand-navy">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-brand-deep">Model</th>
                <th className={headCell}>Tools</th>
                <th className={headCell}>Vision</th>
                <th className={headCell}>Thinking</th>
                <th className={headCell}>Context</th>
                <th className={headCell}>Max output</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['gemini-2.0-flash-exp', 'Yes', 'Yes', 'No', '1M', '8,192'],
                ['gemini-2.0-flash-thinking', 'Yes', 'Yes', 'Yes', '1M', '8,192'],
                ['gemini-1.5-pro', 'Yes', 'Yes', 'No', '2M', '8,192'],
                ['gemini-1.5-flash', 'Yes', 'Yes', 'No', '1M', '8,192'],
              ].map((row) => (
                <tr key={row[0]}>
                  <td className="border-t border-rule px-3 py-2 font-semibold text-brand-deep">{row[0]}</td>
                  {row.slice(1).map((value, index) => (
                    <td key={index} className={cell}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="runtime-checks" num="06" title="Runtime capability checks">
        <p className="text-base leading-relaxed text-brand-navy">
          Query the model registry at runtime:
        </p>
        <CodeBlock
          lang="TS"
          code={`import {
  getModelInfo,
  modelSupportsCapability,
  getModelsForProvider,
  getModelsWithCapability,
} from '@lov3kaizen/agentsea-core';

// Full model info, including capabilities
const info = getModelInfo('claude-3-5-sonnet-20241022');
console.log(info?.capabilities.contextWindow, info?.capabilities.maxOutputTokens);

// Check one capability
const supportsTools = modelSupportsCapability('o1-mini', 'tools'); // false
const supportsVision = modelSupportsCapability('gpt-4o', 'vision'); // true

// Find models by provider, or by capability
const anthropicModels = getModelsForProvider('anthropic');
const visionModels = getModelsWithCapability('vision', true);
const thinkingModels = getModelsWithCapability('extendedThinking', true);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          A provider wrapper exposes the same checks: <code>provider.supportsCapability(name)</code>{' '}
          and <code>provider.getModelInfo()</code>.
        </p>
      </DocSection>

      <DocSection id="type-level-checks" num="07" title="Type-level capability checks">
        <p className="text-base leading-relaxed text-brand-navy">
          For generic code, use the type utilities. They check a config at compile time without
          running it.
        </p>
        <ApiList>
          <ApiRow name="ConfigSupports<T, 'tools'>">Resolves to true or false for a config type.</ApiRow>
          <ApiRow name="RequireCapability<T, 'tools'>">
            Constrains a parameter to configs that support the capability.
          </ApiRow>
        </ApiList>
        <CodeBlock
          lang="TS"
          code={`import type { ConfigSupports, RequireCapability, ProviderModelConfig } from '@lov3kaizen/agentsea-core';

type SupportsTools = ConfigSupports<typeof myConfig, 'tools'>; // true | false

function withTools<T extends ProviderModelConfig>(config: RequireCapability<T, 'tools'>) {
  // config is known to support tools
}`}
        />
      </DocSection>

      <DocSection id="migration" num="08" title="Migration guide">
        <p className="text-base leading-relaxed text-brand-navy">
          Before, the mismatch surfaces when the agent runs:
        </p>
        <CodeBlock
          lang="TS"
          code={`// Fails at runtime: o1-mini does not support tools or system prompts
const agent = new Agent(
  {
    name: 'assistant',
    description: 'Reasoning assistant',
    model: 'o1-mini',
    provider: 'openai',
    systemPrompt: 'Hello',
    tools: [myTool],
  },
  new OpenAIProvider(),
  toolRegistry,
);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          After, the same mismatch is a compile error:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { openai, createProvider } from '@lov3kaizen/agentsea-core';

const config = openai('o1-mini', {
  // systemPrompt: 'Hello', // Compile error
  // tools: [myTool],       // Compile error
  reasoningEffort: 'high',  // Valid
});

const provider = createProvider(config);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          The builders check the config. The <code>Agent</code> constructor takes a provider
          instance, not the wrapper. Pass <code>provider.provider</code>, the underlying provider
          that <code>createProvider</code> creates, along with the tool registry.
        </p>
      </DocSection>

      <DocSection id="next-steps" num="09" title="Next steps">
        <BulletPanel
          items={[
            <Link key="providers" href="/docs/providers" className="text-brand-ocean hover:underline">
              Providers reference
            </Link>,
            <Link key="tools" href="/docs/tools" className="text-brand-ocean hover:underline">
              Tools guide
            </Link>,
            <Link key="agents" href="/docs/agents" className="text-brand-ocean hover:underline">
              Agents
            </Link>,
            <a
              key="tanstack"
              href="https://tanstack.com/ai/latest/docs/guides/per-model-type-safety"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-ocean hover:underline"
            >
              TanStack AI: per-model type safety (inspiration)
            </a>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
