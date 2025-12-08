import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function PerModelTypeSafetyPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Per-Model Type Safety"
        titleGradient="purple"
        description="Get compile-time TypeScript errors for invalid model options. Inspired by TanStack AI."
      />

      <div className="prose max-w-none">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 my-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            🎯 Why Per-Model Type Safety?
          </h3>
          <div className="text-purple-800 space-y-2">
            <p className="m-0">
              Different AI models have different capabilities. <strong>o1-mini</strong> doesn&apos;t support tools.
              <strong> o1</strong> doesn&apos;t support system prompts. <strong>Claude 3 Haiku</strong> doesn&apos;t support extended thinking.
            </p>
            <p className="m-0">
              Without type safety, you discover these issues at runtime. With per-model type safety,
              TypeScript catches them at compile time with helpful error messages.
            </p>
          </div>
        </div>

        <h2 id="quick-start">Quick Start</h2>

        <CodeBlock language="typescript">
          {`import { anthropic, openai, createProvider } from '@lov3kaizen/agentsea-core';

// ✅ Valid: Claude 3.5 Sonnet supports tools and extended thinking
const claudeConfig = anthropic('claude-3-5-sonnet-20241022', {
  tools: [myTool],
  systemPrompt: 'You are helpful',
  thinking: { type: 'enabled', budgetTokens: 10000 },
  temperature: 0.7,
});

// ✅ Valid: o1 supports tools but NOT system prompts
const o1Config = openai('o1', {
  tools: [myTool],
  reasoningEffort: 'high',
  // systemPrompt: '...' // ❌ TypeScript error!
});

// ❌ TypeScript error: o1-mini doesn't support tools
const o1MiniConfig = openai('o1-mini', {
  // tools: [myTool], // Error: 'tools' does not exist in type
  reasoningEffort: 'medium',
});

// Create type-safe providers
const provider = createProvider(claudeConfig);
console.log('Supports vision:', provider.supportsCapability('vision')); // true`}
        </CodeBlock>

        <Divider />

        <h2 id="config-builders">Config Builders</h2>
        <p>AgentSea provides type-safe config builder functions for each provider:</p>

        <h3>Anthropic</h3>

        <CodeBlock language="typescript">
          {`import { anthropic } from '@lov3kaizen/agentsea-core';

// Claude 3.5 Sonnet - supports EVERYTHING
const sonnetConfig = anthropic('claude-3-5-sonnet-20241022', {
  tools: [myTool],
  systemPrompt: 'You are a helpful assistant',
  thinking: { type: 'enabled', budgetTokens: 10000 }, // Extended thinking
  temperature: 0.7,
  maxTokens: 4096,
  providerOptions: {
    metadata: { userId: 'user-123' },
    betas: ['computer-use-2024-10-22'],
  },
});

// Claude 3 Haiku - NO extended thinking
const haikuConfig = anthropic('claude-3-haiku-20240307', {
  tools: [myTool],
  systemPrompt: 'You are fast',
  // thinking: { ... } // ❌ TypeScript error! Haiku doesn't support thinking
});`}
        </CodeBlock>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
          <p className="text-sm text-blue-800 m-0">
            <strong>Supported Anthropic Models:</strong> claude-3-5-sonnet-*, claude-3-5-haiku-*,
            claude-3-opus-*, claude-3-sonnet-*, claude-3-haiku-*, claude-opus-4-*, claude-sonnet-4-*
          </p>
        </div>

        <h3>OpenAI</h3>

        <CodeBlock language="typescript">
          {`import { openai } from '@lov3kaizen/agentsea-core';

// GPT-4o - supports tools, system prompts, structured output
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

// o1 - supports tools and reasoning, but NOT system prompts
const o1Config = openai('o1', {
  tools: [myTool],
  reasoningEffort: 'high',
  // systemPrompt: '...' // ❌ TypeScript error!
});

// o1-mini - NO tools, NO system prompts
const o1MiniConfig = openai('o1-mini', {
  reasoningEffort: 'medium',
  // tools: [...] // ❌ TypeScript error!
  // systemPrompt: '...' // ❌ TypeScript error!
});

// o3-mini - supports tools but NOT system prompts
const o3MiniConfig = openai('o3-mini', {
  tools: [myTool],
  reasoningEffort: 'high',
});`}
        </CodeBlock>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
          <p className="text-sm text-blue-800 m-0">
            <strong>Supported OpenAI Models:</strong> gpt-4o*, gpt-4-turbo*, gpt-4, gpt-3.5-turbo*,
            o1, o1-mini, o1-preview, o3-mini
          </p>
        </div>

        <h3>Gemini</h3>

        <CodeBlock language="typescript">
          {`import { gemini } from '@lov3kaizen/agentsea-core';

// Gemini 1.5 Pro - supports everything
const geminiConfig = gemini('gemini-1.5-pro', {
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
        </CodeBlock>

        <h3>Ollama (Local)</h3>

        <CodeBlock language="typescript">
          {`import { ollama } from '@lov3kaizen/agentsea-core';

// Ollama - dynamic models (less strict typing)
const ollamaConfig = ollama('llama3.2', {
  tools: [myTool],
  systemPrompt: 'You are helpful',
  temperature: 0.7,
  providerOptions: {
    numCtx: 4096,
    numGpu: 1,
  },
});`}
        </CodeBlock>

        <AlertBox type="info" gradient>
          <p>
            Ollama models are dynamic (user-defined), so type safety is less strict.
            Tool support depends on the specific model being used.
          </p>
        </AlertBox>

        <Divider />

        <h2 id="model-capabilities">Model Capabilities Reference</h2>

        <h3>Anthropic Models</h3>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Model</th>
                <th className="px-4 py-2 text-center">Tools</th>
                <th className="px-4 py-2 text-center">Vision</th>
                <th className="px-4 py-2 text-center">Thinking</th>
                <th className="px-4 py-2 text-center">Context</th>
                <th className="px-4 py-2 text-center">Max Output</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>claude-3-5-sonnet-*</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">200K</td>
                <td className="px-4 py-2 text-center">8,192</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>claude-3-5-haiku-*</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">200K</td>
                <td className="px-4 py-2 text-center">8,192</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>claude-3-opus-*</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">200K</td>
                <td className="px-4 py-2 text-center">4,096</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>claude-opus-4-5-*</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">200K</td>
                <td className="px-4 py-2 text-center">32,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>OpenAI Models</h3>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Model</th>
                <th className="px-4 py-2 text-center">Tools</th>
                <th className="px-4 py-2 text-center">System Prompt</th>
                <th className="px-4 py-2 text-center">Vision</th>
                <th className="px-4 py-2 text-center">Thinking</th>
                <th className="px-4 py-2 text-center">Context</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>gpt-4o*</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">128K</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>gpt-4-turbo</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">128K</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>o1</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">200K</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>o1-mini</strong></td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">128K</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>o3-mini</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">200K</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Gemini Models</h3>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Model</th>
                <th className="px-4 py-2 text-center">Tools</th>
                <th className="px-4 py-2 text-center">Vision</th>
                <th className="px-4 py-2 text-center">Thinking</th>
                <th className="px-4 py-2 text-center">Context</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>gemini-2.0-flash-exp</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">1M</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>gemini-2.0-flash-thinking</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">1M</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>gemini-1.5-pro</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">2M</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2"><strong>gemini-1.5-flash</strong></td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">✅</td>
                <td className="px-4 py-2 text-center">❌</td>
                <td className="px-4 py-2 text-center">1M</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Divider />

        <h2 id="runtime-checks">Runtime Capability Checks</h2>
        <p>Query model capabilities at runtime using the model registry:</p>

        <CodeBlock language="typescript">
          {`import {
  getModelInfo,
  modelSupportsCapability,
  getModelsForProvider,
  getModelsWithCapability,
} from '@lov3kaizen/agentsea-core';

// Get full model info
const info = getModelInfo('claude-3-5-sonnet-20241022');
console.log(info);
// {
//   provider: 'anthropic',
//   model: 'claude-3-5-sonnet-20241022',
//   displayName: 'Claude 3.5 Sonnet',
//   capabilities: {
//     tools: true,
//     streaming: true,
//     vision: true,
//     structuredOutput: true,
//     systemMessage: true,
//     extendedThinking: true,
//     contextWindow: 200000,
//     maxOutputTokens: 8192,
//     parallelToolCalls: true,
//   }
// }

// Check specific capability
const supportsTools = modelSupportsCapability('o1-mini', 'tools'); // false
const supportsVision = modelSupportsCapability('gpt-4o', 'vision'); // true

// Find models by provider
const anthropicModels = getModelsForProvider('anthropic');

// Find models with specific capabilities
const visionModels = getModelsWithCapability('vision', true);
const thinkingModels = getModelsWithCapability('extendedThinking', true);`}
        </CodeBlock>

        <Divider />

        <h2 id="type-safe-providers">Type-Safe Provider Creation</h2>

        <CodeBlock language="typescript">
          {`import {
  createProvider,
  createAnthropicProvider,
  createOpenAIProvider,
  anthropic,
  openai,
} from '@lov3kaizen/agentsea-core';

// Generic factory (works with any config)
const provider1 = createProvider(anthropic('claude-3-5-sonnet-20241022', { ... }));
const provider2 = createProvider(openai('gpt-4o', { ... }));

// Provider-specific factories (for explicit typing)
const claudeProvider = createAnthropicProvider(
  anthropic('claude-3-5-sonnet-20241022', { tools: [myTool] }),
  { apiKey: process.env.ANTHROPIC_API_KEY }
);

// Access typed config and capabilities
console.log(claudeProvider.config.model); // 'claude-3-5-sonnet-20241022'
console.log(claudeProvider.supportsCapability('vision')); // true
console.log(claudeProvider.getModelInfo()?.capabilities.contextWindow); // 200000`}
        </CodeBlock>

        <Divider />

        <h2 id="migration">Migration Guide</h2>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <h4 className="text-red-900 font-semibold mb-2">Before (No Type Safety)</h4>
          <CodeBlock language="typescript">
            {`// Runtime error: o1-mini doesn't support tools!
const agent = new Agent(
  {
    model: 'o1-mini',
    provider: 'openai',
    systemPrompt: 'Hello', // Also fails - no system prompt support
    tools: [myTool],
  },
  new OpenAIProvider(),
  toolRegistry
);`}
          </CodeBlock>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
          <h4 className="text-green-900 font-semibold mb-2">After (With Type Safety)</h4>
          <CodeBlock language="typescript">
            {`import { openai, createProvider } from '@lov3kaizen/agentsea-core';

// TypeScript catches all errors at compile time!
const config = openai('o1-mini', {
  // systemPrompt: 'Hello', // ❌ Compile error
  // tools: [myTool], // ❌ Compile error
  reasoningEffort: 'high', // ✅ Valid option
});

const provider = createProvider(config);`}
          </CodeBlock>
        </div>

        <Divider />

        <h2 id="benefits">Key Benefits</h2>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold mb-2">Zero Runtime Overhead</h4>
            <p className="text-sm m-0">
              All validation happens during TypeScript compilation. No performance impact at runtime.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">💡</div>
            <h4 className="font-semibold mb-2">IDE Autocomplete</h4>
            <p className="text-sm m-0">
              Only valid options appear in your IDE&apos;s autocomplete suggestions per model.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">🔍</div>
            <h4 className="font-semibold mb-2">Self-Documenting</h4>
            <p className="text-sm m-0">
              Model capabilities are explicit in type definitions. No guessing what&apos;s supported.
            </p>
          </div>
        </div>

        <h2 id="next-steps">Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/providers">Providers Reference</Link> - Full provider documentation
          </li>
          <li>
            <Link href="/docs/tools">Tools Guide</Link> - Creating and using tools
          </li>
          <li>
            <Link href="/docs/agents">Agents</Link> - Agent configuration options
          </li>
          <li>
            <a href="https://tanstack.com/ai/latest/docs/guides/per-model-type-safety" target="_blank" rel="noopener noreferrer">
              TanStack AI Docs
            </a> - Inspiration for this feature
          </li>
        </ul>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            💡 Pro Tip
          </h3>
          <p className="text-purple-800 m-0">
            Use per-model type safety from the start of your project. It&apos;s much easier than
            debugging runtime errors later. The TypeScript compiler becomes your best friend
            when switching between models or providers!
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
