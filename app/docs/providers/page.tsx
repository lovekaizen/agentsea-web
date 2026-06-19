import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function ProvidersPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Provider Reference"
        titleGradient="warm"
        description="Complete guide to all 12+ LLM providers supported by AgentSea ADK. Mix and match providers for your needs."
      />

      <div className="prose max-w-none">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 my-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🔌 12+ Providers Supported
          </h3>
          <div className="text-blue-800 space-y-2">
            <p className="m-0">
              <strong>Cloud Providers (6):</strong> Anthropic, OpenAI, Google
              Gemini, Mistral AI, DeepSeek, xAI (Grok)
            </p>
            <p className="m-0">
              <strong>Local Providers (6):</strong> Ollama, LM Studio, LocalAI,
              Text Generation WebUI, vLLM, Jan
            </p>
            <p className="m-0">
              <strong>Voice Providers (7):</strong> OpenAI Whisper, LemonFox
              STT, Local Whisper, OpenAI TTS, LemonFox TTS, ElevenLabs, Piper
              TTS
            </p>
          </div>
        </div>

        <h2 id="overview">Provider Categories</h2>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">☁️</div>
            <h4 className="font-semibold mb-2">Cloud Providers</h4>
            <p className="text-sm m-0">
              Hosted APIs with best quality, easy to use, pay-per-token pricing.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">🏠</div>
            <h4 className="font-semibold mb-2">Local Providers</h4>
            <p className="text-sm m-0">
              Self-hosted models, complete privacy, no API costs, offline
              capability.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">🎙️</div>
            <h4 className="font-semibold mb-2">Voice Providers</h4>
            <p className="text-sm m-0">
              Speech-to-Text and Text-to-Speech for voice-enabled agents.
            </p>
          </div>
        </div>

        <h2 id="cloud-providers">Cloud Providers</h2>

        <h3>Anthropic (Claude)</h3>
        <p>
          Leading AI safety company known for Claude models with strong
          reasoning and long context windows.
        </p>

        <CodeBlock language="typescript">
          {`import { AnthropicProvider } from '@lov3kaizen/agentsea-core';

const provider = new AnthropicProvider(process.env.ANTHROPIC_API_KEY);

// Available models (selection):
// - claude-opus-4-6 (Most capable)
// - claude-sonnet-4-5-20250929 (Balanced, latest Sonnet)
// - claude-haiku-4-5 (Fastest, cheapest)
// - claude-3-7-sonnet-20250219 (Extended thinking)

const agent = new Agent(
  {
    model: 'claude-sonnet-4-5-20250929',
    provider: 'anthropic',
    temperature: 0.7,
    maxTokens: 4096,
  },
  provider,
  toolRegistry,
);`}
        </CodeBlock>

        <div className="grid md:grid-cols-2 gap-4 my-4">
          <div>
            <p className="font-semibold mb-2">Strengths:</p>
            <ul className="text-sm space-y-1 mb-0">
              <li>✅ Excellent reasoning and analysis</li>
              <li>✅ 200K context window</li>
              <li>✅ Strong safety features</li>
              <li>✅ Tool use (function calling)</li>
              <li>✅ Vision capabilities</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Best For:</p>
            <ul className="text-sm space-y-1 mb-0">
              <li>Complex reasoning tasks</li>
              <li>Code analysis</li>
              <li>Long document processing</li>
              <li>Safety-critical applications</li>
            </ul>
          </div>
        </div>

        <h3>OpenAI (GPT)</h3>
        <p>
          Pioneer in large language models, known for the GPT and o-series and a
          strong ecosystem. AgentSea ships with a registry of 60+ models across
          providers, including the latest OpenAI releases.
        </p>

        <CodeBlock language="typescript">
          {`import { OpenAIProvider } from '@lov3kaizen/agentsea-core';

const provider = new OpenAIProvider(process.env.OPENAI_API_KEY);

// Available models (selection):
// - gpt-5 (Most capable)
// - gpt-4.1 (Strong general-purpose)
// - gpt-4o (Multimodal, fast)
// - gpt-4o-mini (Fast, cost-effective)
// - o3 (Advanced reasoning)
// - o4-mini (Efficient reasoning)

const agent = new Agent(
  {
    model: 'gpt-4.1',
    provider: 'openai',
    temperature: 0.8,
    maxTokens: 2048,
  },
  provider,
  toolRegistry,
);`}
        </CodeBlock>

        <AlertBox type="info">
          <p className="m-0">
            Reasoning models such as <code>o3</code> and <code>o4-mini</code>{' '}
            have model-specific options. Use{' '}
            <Link href="/docs/per-model-type-safety">
              per-model type safety
            </Link>{' '}
            to get compile-time validation of which options each model supports.
          </p>
        </AlertBox>

        <div className="grid md:grid-cols-2 gap-4 my-4">
          <div>
            <p className="font-semibold mb-2">Strengths:</p>
            <ul className="text-sm space-y-1 mb-0">
              <li>✅ Broad knowledge base</li>
              <li>✅ Strong creative writing</li>
              <li>✅ Function calling</li>
              <li>✅ Large ecosystem</li>
              <li>✅ Reliable performance</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Best For:</p>
            <ul className="text-sm space-y-1 mb-0">
              <li>General-purpose tasks</li>
              <li>Creative content</li>
              <li>Customer service</li>
              <li>Content generation</li>
            </ul>
          </div>
        </div>

        <h3>Google (Gemini)</h3>
        <p>
          Google's multimodal AI models with strong reasoning and native tool
          integration.
        </p>

        <CodeBlock language="typescript">
          {`import { GeminiProvider } from '@lov3kaizen/agentsea-core';

const provider = new GeminiProvider(process.env.GOOGLE_AI_API_KEY);

// Available models:
// - gemini-2.5-pro (Most capable)
// - gemini-2.5-flash (Fast, affordable)
// - gemini-2.0-flash (Low latency)

const agent = new Agent(
  {
    model: 'gemini-2.5-flash',
    provider: 'gemini',
    temperature: 0.7,
  },
  provider,
  toolRegistry,
);`}
        </CodeBlock>

        <div className="grid md:grid-cols-2 gap-4 my-4">
          <div>
            <p className="font-semibold mb-2">Strengths:</p>
            <ul className="text-sm space-y-1 mb-0">
              <li>✅ Multimodal (text, image, video, audio)</li>
              <li>✅ 1M+ context window</li>
              <li>✅ Fast inference</li>
              <li>✅ Native function calling</li>
              <li>✅ Code execution</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Best For:</p>
            <ul className="text-sm space-y-1 mb-0">
              <li>Multimodal applications</li>
              <li>Long context tasks</li>
              <li>Video/audio analysis</li>
              <li>Scientific research</li>
            </ul>
          </div>
        </div>

        <h3>Mistral, DeepSeek &amp; xAI</h3>
        <p>
          Mistral AI, DeepSeek, and xAI (Grok) are first-class providers in the{' '}
          <code>Provider</code> registry. They are created with the same
          type-safe config builders as the other providers and run over an
          OpenAI-compatible transport under the hood — just set the matching API
          key environment variable.
        </p>

        <CodeBlock language="typescript">
          {`import {
  createProvider,
  mistral,
  deepseek,
  xai,
} from '@lov3kaizen/agentsea-core';

// Mistral AI — set MISTRAL_API_KEY
const mistralProvider = createProvider(
  mistral('mistral-large-latest', { tools: [myTool] }),
);

// DeepSeek — set DEEPSEEK_API_KEY
const deepseekProvider = createProvider(deepseek('deepseek-reasoner'));

// xAI (Grok) — set XAI_API_KEY
const grokProvider = createProvider(xai('grok-3'));`}
        </CodeBlock>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Mistral AI</h4>
            <p className="text-sm mb-2">
              European AI with strong open models and competitive pricing.
            </p>
            <code className="text-xs">
              mistral-large-latest, mistral-small-latest, codestral-latest
            </code>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">DeepSeek</h4>
            <p className="text-sm mb-2">
              Cost-efficient chat and reasoning models with strong coding
              ability.
            </p>
            <code className="text-xs">deepseek-chat, deepseek-reasoner</code>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">xAI (Grok)</h4>
            <p className="text-sm mb-2">
              Grok models with real-time knowledge and fast inference tiers.
            </p>
            <code className="text-xs">grok-3, grok-3-fast, grok-3-mini</code>
          </div>
        </div>

        <AlertBox type="info">
          <p className="m-0">
            All providers share the same config-builder API
            (<code>anthropic()</code>, <code>openai()</code>,{' '}
            <code>gemini()</code>, <code>mistral()</code>,{' '}
            <code>deepseek()</code>, <code>xai()</code>) so you get compile-time
            validation of which options each model supports. See{' '}
            <Link href="/docs/per-model-type-safety">per-model type safety</Link>
            .
          </p>
        </AlertBox>

        <h2 id="local-providers">Local Providers</h2>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
          <h4 className="text-lg font-semibold text-green-900 mb-2">
            🔒 Why Local?
          </h4>
          <div className="text-green-800">
            <p className="m-0">
              ✅ <strong>Privacy:</strong> Data never leaves your infrastructure
            </p>
            <p className="m-0">
              ✅ <strong>Cost:</strong> Zero API costs, unlimited usage
            </p>
            <p className="m-0">
              ✅ <strong>Control:</strong> Full control over models and versions
            </p>
            <p className="m-0">
              ✅ <strong>Offline:</strong> Works without internet connection
            </p>
          </div>
        </div>

        <h3>Ollama (Recommended)</h3>
        <p>
          The easiest way to run models locally. Simple CLI, automatic GPU
          support, growing model library.
        </p>

        <CodeBlock language="typescript">
          {`import { OllamaProvider } from '@lov3kaizen/agentsea-core';

const provider = new OllamaProvider({
  baseUrl: 'http://localhost:11434',
});

// Pull models
await provider.pullModel('llama3.2');
await provider.pullModel('mistral');

// List available models
const models = await provider.listModels();

const agent = new Agent(
  {
    model: 'llama3.2',
    provider: 'ollama',
  },
  provider,
  toolRegistry,
);`}
        </CodeBlock>

        <p className="text-sm">
          <strong>Popular Models:</strong> llama3.2 (8B), mistral (7B), qwen2.5
          (7B), gemma2 (9B), codellama (7B), phi3 (3.8B)
        </p>

        <h3>LM Studio</h3>
        <p>
          Desktop app with beautiful UI. Download models with one click,
          built-in OpenAI-compatible server.
        </p>

        <CodeBlock language="typescript">
          {`import { LMStudioProvider } from '@lov3kaizen/agentsea-core';

const provider = new LMStudioProvider({
  baseUrl: 'http://localhost:1234',
});

const agent = new Agent(
  {
    model: 'local-model', // Whatever you loaded in LM Studio
    provider: 'lm-studio',
  },
  provider,
  toolRegistry,
);`}
        </CodeBlock>

        <h3>LocalAI</h3>
        <p>
          Self-hosted OpenAI alternative. Supports LLMs, Stable Diffusion,
          voice, embeddings, more.
        </p>

        <CodeBlock language="typescript">
          {`import { LocalAIProvider } from '@lov3kaizen/agentsea-core';

const provider = new LocalAIProvider({
  baseUrl: 'http://localhost:8080',
});

const agent = new Agent(
  {
    model: 'llama-3.2-3b',
    provider: 'localai',
  },
  provider,
  toolRegistry,
);`}
        </CodeBlock>

        <h3>Text Generation WebUI</h3>
        <p>
          Feature-rich web interface for running models. Extensions, characters,
          multiple backends.
        </p>

        <CodeBlock language="typescript">
          {`import { TextGenerationWebUIProvider } from '@lov3kaizen/agentsea-core';

const provider = new TextGenerationWebUIProvider({
  baseUrl: 'http://localhost:5000',
});`}
        </CodeBlock>

        <h3>vLLM</h3>
        <p>
          High-throughput inference engine for production. Uses PagedAttention
          for efficiency.
        </p>

        <CodeBlock language="typescript">
          {`import { VLLMProvider } from '@lov3kaizen/agentsea-core';

const provider = new VLLMProvider({
  baseUrl: 'http://localhost:8000',
});

// Best for production with high request volume`}
        </CodeBlock>

        <h3>Jan</h3>
        <p>
          Open source ChatGPT alternative. Desktop app with local execution.
        </p>

        <CodeBlock language="typescript">
          {`import { OpenAICompatibleProvider } from '@lov3kaizen/agentsea-core';

// Jan uses OpenAI-compatible API
const provider = new OpenAICompatibleProvider({
  baseUrl: 'http://localhost:1337',
});`}
        </CodeBlock>

        <h2 id="provider-comparison">Provider Comparison</h2>

        <h3>Cloud Providers</h3>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Quality</th>
                <th className="px-4 py-2 text-left">Speed</th>
                <th className="px-4 py-2 text-left">Cost</th>
                <th className="px-4 py-2 text-left">Context</th>
                <th className="px-4 py-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>Anthropic</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">$$$</td>
                <td className="px-4 py-2">200K</td>
                <td className="px-4 py-2">Reasoning, safety</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>OpenAI</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">$$$</td>
                <td className="px-4 py-2">128K</td>
                <td className="px-4 py-2">General purpose</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>Google Gemini</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐⭐</td>
                <td className="px-4 py-2">$$</td>
                <td className="px-4 py-2">1M+</td>
                <td className="px-4 py-2">Multimodal, long context</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>Mistral AI</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">$$</td>
                <td className="px-4 py-2">128K</td>
                <td className="px-4 py-2">European compliance</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>DeepSeek</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">$</td>
                <td className="px-4 py-2">128K</td>
                <td className="px-4 py-2">Reasoning, coding (low cost)</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>xAI (Grok)</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">$$</td>
                <td className="px-4 py-2">128K</td>
                <td className="px-4 py-2">Real-time knowledge</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Local Providers</h3>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Ease of Use</th>
                <th className="px-4 py-2 text-left">Performance</th>
                <th className="px-4 py-2 text-left">Features</th>
                <th className="px-4 py-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>Ollama</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">Model mgmt, CLI</td>
                <td className="px-4 py-2">Getting started</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>LM Studio</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">GUI, easy setup</td>
                <td className="px-4 py-2">Non-technical users</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>LocalAI</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">Multi-modal, Docker</td>
                <td className="px-4 py-2">Self-hosted services</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>vLLM</strong>
                </td>
                <td className="px-4 py-2">⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐⭐⭐</td>
                <td className="px-4 py-2">PagedAttention</td>
                <td className="px-4 py-2">Production scale</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>Text Gen WebUI</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐</td>
                <td className="px-4 py-2">Web UI, extensions</td>
                <td className="px-4 py-2">Experimentation</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>Jan</strong>
                </td>
                <td className="px-4 py-2">⭐⭐⭐⭐⭐</td>
                <td className="px-4 py-2">⭐⭐⭐</td>
                <td className="px-4 py-2">Desktop app</td>
                <td className="px-4 py-2">ChatGPT alternative</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="choosing-provider">Choosing a Provider</h2>

        <div className="space-y-4 my-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 font-semibold mb-2">
              🎯 For Getting Started
            </h4>
            <p className="text-blue-800 text-sm m-0">
              <strong>Cloud:</strong> Start with Anthropic Claude or OpenAI GPT
              - easy setup, excellent quality
              <br />
              <strong>Local:</strong> Ollama with llama3.2 - simplest local
              setup
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-purple-900 font-semibold mb-2">
              💰 For Cost Savings
            </h4>
            <p className="text-purple-800 text-sm m-0">
              <strong>Development:</strong> Ollama (free, unlimited)
              <br />
              <strong>Production:</strong> Google Gemini Flash (lowest cost per
              token) or vLLM (self-hosted)
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-green-900 font-semibold mb-2">
              🔒 For Privacy
            </h4>
            <p className="text-green-800 text-sm m-0">
              <strong>Complete Privacy:</strong> Ollama + Local Whisper + Piper
              TTS
              <br />
              <strong>Production Scale:</strong> vLLM with self-hosted models
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-orange-900 font-semibold mb-2">
              ⚡ For Performance
            </h4>
            <p className="text-orange-800 text-sm m-0">
              <strong>Speed:</strong> Google Gemini Flash or Claude Haiku
              <br />
              <strong>Quality:</strong> Claude Opus 4.6 or GPT-5
              <br />
              <strong>Throughput:</strong> vLLM for production scale
            </p>
          </div>
        </div>

        <h2 id="multi-provider">Multi-Provider Setup</h2>
        <p>Use different providers for different tasks:</p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  AnthropicProvider,
  OllamaProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';

// Cloud provider for complex tasks
const claudeProvider = new AnthropicProvider(process.env.ANTHROPIC_API_KEY);

// Local provider for simple tasks
const ollamaProvider = new OllamaProvider();

const toolRegistry = new ToolRegistry();

// Complex reasoning agent (cloud)
const researchAgent = new Agent(
  {
    name: 'researcher',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: 'You are a research assistant.',
  },
  claudeProvider,
  toolRegistry,
);

// Simple task agent (local, free)
const helperAgent = new Agent(
  {
    name: 'helper',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful assistant.',
  },
  ollamaProvider,
  toolRegistry,
);

// Use the right agent for each task
const complexResult = await researchAgent.execute('Analyze this...', context);
const simpleResult = await helperAgent.execute('What is 2+2?', context);`}
        </CodeBlock>

        <h2 id="next-steps">Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/voice">Voice Providers</Link> - STT and TTS
            providers
          </li>
          <li>
            <Link href="/docs/local-models">Local Models Guide</Link> - Deep
            dive into local execution
          </li>
          <li>
            <Link href="/docs/cli">CLI Tool</Link> - Manage providers with CLI
          </li>
          <li>
            <Link href="/docs/agents">Agent Configuration</Link> - Configure
            agents with providers
          </li>
          <li>
            <Link href="/examples">View Examples</Link> - Provider usage
            examples
          </li>
        </ul>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Pro Tip
          </h3>
          <p className="text-blue-800 m-0">
            Start with a cloud provider to validate your idea, then migrate to
            local providers for cost savings at scale. Use the same AgentSea ADK
            code - just swap the provider! Many successful products save $75K+
            annually by running production workloads on self-hosted models.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
