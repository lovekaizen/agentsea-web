import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Providers | AgentSea',
  description:
    'The LLM providers AgentSea supports: cloud APIs, local model servers and voice providers, with setup code and environment variables.',
};

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'cloud-providers', label: 'Cloud providers' },
  { id: 'local-providers', label: 'Local providers' },
  { id: 'voice-providers', label: 'Voice providers' },
  { id: 'reference', label: 'Provider reference' },
  { id: 'choosing-provider', label: 'Choosing a provider' },
  { id: 'multi-provider', label: 'Multi-provider setup' },
  { id: 'next-steps', label: 'Next steps' },
];

export default function ProvidersPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Providers"
      lead="AgentSea talks to cloud APIs and local model servers through one provider interface. Mix and match providers per agent."
      active="concepts"
      toc={toc}
      badges={['v1.2.1']}
    >
      <DocSection id="overview" num="01" title="Overview">
        <p className="text-base leading-relaxed text-brand-navy">
          A provider is the object an agent calls to generate a response. You create it once and
          pass it to the <code>Agent</code> constructor. The agent&apos;s <code>provider</code>{' '}
          config field names the provider it uses.
        </p>
        <BulletPanel
          items={[
            <>
              <strong>Cloud providers</strong>: hosted APIs with pay-per-token pricing. Anthropic,
              OpenAI, Google Gemini, Mistral, DeepSeek and xAI.
            </>,
            <>
              <strong>Local providers</strong>: self-hosted model servers. Ollama, LM Studio,
              LocalAI, Text Generation WebUI, vLLM, or any OpenAI-compatible endpoint. Data stays on
              your infrastructure and there are no API costs.
            </>,
            <>
              <strong>Voice providers</strong>: speech-to-text and text-to-speech for voice agents.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="cloud-providers" num="02" title="Cloud providers">
        <h3 className="text-lg font-semibold text-brand-deep">Anthropic (Claude)</h3>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const provider = new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
const toolRegistry = new ToolRegistry();

const agent = new Agent(
  {
    name: 'claude-agent',
    description: 'Claude-backed assistant',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    temperature: 0.7,
    maxTokens: 4096,
  },
  provider,
  toolRegistry,
);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Models include <code>claude-opus-4-8</code>, <code>claude-opus-4-7</code>,{' '}
          <code>claude-opus-4-6</code>, <code>claude-sonnet-4-6</code>, <code>claude-haiku-4-5</code>{' '}
          and <code>claude-fable-5</code>. Older generations remain supported. Environment
          variable: <code>ANTHROPIC_API_KEY</code>.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">OpenAI (GPT)</h3>
        <CodeBlock
          lang="TS"
          code={`import { Agent, OpenAIProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const provider = new OpenAIProvider(process.env.OPENAI_API_KEY);
const toolRegistry = new ToolRegistry();

const agent = new Agent(
  {
    name: 'gpt-agent',
    description: 'OpenAI-backed assistant',
    model: 'gpt-4.1',
    provider: 'openai',
    temperature: 0.8,
    maxTokens: 2048,
  },
  provider,
  toolRegistry,
);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Models include <code>gpt-5</code>, <code>gpt-4.1</code>, <code>gpt-4o</code>,{' '}
          <code>gpt-4o-mini</code>, <code>o3</code> and <code>o4-mini</code>. Environment variable:{' '}
          <code>OPENAI_API_KEY</code>.
        </p>
        <Callout kind="note">
          Reasoning models such as <code>o3</code> and <code>o4-mini</code> accept different
          options. <Link href="/docs/per-model-type-safety" className="font-semibold text-brand-ocean hover:underline">Per-model type safety</Link>{' '}
          checks at compile time which options each model supports.
        </Callout>

        <h3 className="text-lg font-semibold text-brand-deep">Google (Gemini)</h3>
        <CodeBlock
          lang="TS"
          code={`import { Agent, GeminiProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const provider = new GeminiProvider(process.env.GEMINI_API_KEY);
const toolRegistry = new ToolRegistry();

const agent = new Agent(
  {
    name: 'gemini-agent',
    description: 'Gemini-backed assistant',
    model: 'gemini-2.5-flash',
    provider: 'gemini',
    temperature: 0.7,
  },
  provider,
  toolRegistry,
);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Models include <code>gemini-2.5-pro</code>, <code>gemini-2.5-flash</code>,{' '}
          <code>gemini-2.0-flash</code>, <code>gemini-3.5-flash</code> and{' '}
          <code>gemini-3.1-pro-preview</code>. The provider reads <code>GEMINI_API_KEY</code>, or{' '}
          <code>GOOGLE_API_KEY</code> if that is unset, and throws if neither is set.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">Mistral, DeepSeek and xAI</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          Mistral, DeepSeek and xAI (Grok) are part of the provider registry. Each one is created
          with a config builder and runs over the OpenAI-compatible transport, using its own API
          key variable.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { createProvider, mistral, deepseek, xai } from '@lov3kaizen/agentsea-core';

// Mistral: reads MISTRAL_API_KEY
const mistralProvider = createProvider(
  mistral('mistral-large-latest', { tools: [myTool] }),
);

// DeepSeek: reads DEEPSEEK_API_KEY
const deepseekProvider = createProvider(deepseek('deepseek-reasoner'));

// xAI (Grok): reads XAI_API_KEY
const grokProvider = createProvider(xai('grok-3'));`}
        />
        <ApiList>
          <ApiRow name="mistral-*">
            <code>mistral-large-latest</code>, <code>mistral-small-latest</code>,{' '}
            <code>codestral-latest</code>
          </ApiRow>
          <ApiRow name="deepseek-*">
            <code>deepseek-chat</code>, <code>deepseek-reasoner</code>
          </ApiRow>
          <ApiRow name="grok-*">
            <code>grok-3</code>, <code>grok-3-fast</code>, <code>grok-3-mini</code>
          </ApiRow>
        </ApiList>
        <p className="text-base leading-relaxed text-brand-navy">
          The config builders are <code>anthropic()</code>, <code>openai()</code>,{' '}
          <code>gemini()</code>, <code>mistral()</code>, <code>deepseek()</code> and{' '}
          <code>xai()</code>. They share one shape, so options are checked against the model
          you pick. See <Link href="/docs/per-model-type-safety" className="font-semibold text-brand-ocean hover:underline">per-model type safety</Link>.
        </p>
      </DocSection>

      <DocSection id="local-providers" num="03" title="Local providers">
        <p className="text-base leading-relaxed text-brand-navy">
          Local providers run models on your own machine or server. They keep data private, have
          no per-token cost and work offline.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">Ollama (recommended)</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          The simplest way to run models locally. Ollama exposes model listing and pulling
          through the provider.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, OllamaProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const provider = new OllamaProvider({
  baseUrl: 'http://localhost:11434', // default
  timeout: 60000, // default
});

// Pull a model, then list what is available
await provider.pullModel('llama3.2');
const models = await provider.listModels();

const toolRegistry = new ToolRegistry();
const agent = new Agent(
  {
    name: 'local-agent',
    description: 'Runs on a local Ollama server',
    model: 'llama3.2',
    provider: 'ollama',
  },
  provider,
  toolRegistry,
);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          The base URL can also come from <code>OLLAMA_BASE_URL</code>.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">LM Studio</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          A desktop app with a model browser and a built-in OpenAI-compatible server.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, LMStudioProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const provider = new LMStudioProvider({
  baseUrl: 'http://localhost:1234/v1', // default
});

const toolRegistry = new ToolRegistry();
const agent = new Agent(
  {
    name: 'lmstudio-agent',
    description: 'Runs on LM Studio',
    model: 'local-model', // the model you loaded in LM Studio
    provider: 'openai-compatible',
  },
  provider,
  toolRegistry,
);`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">LocalAI</h3>
        <CodeBlock
          lang="TS"
          code={`import { LocalAIProvider } from '@lov3kaizen/agentsea-core';

const provider = new LocalAIProvider({
  baseUrl: 'http://localhost:8080/v1', // default
});`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Text Generation WebUI</h3>
        <CodeBlock
          lang="TS"
          code={`import { TextGenerationWebUIProvider } from '@lov3kaizen/agentsea-core';

const provider = new TextGenerationWebUIProvider({
  baseUrl: 'http://localhost:5000/v1', // default
});`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">vLLM</h3>
        <CodeBlock
          lang="TS"
          code={`import { VLLMProvider } from '@lov3kaizen/agentsea-core';

const provider = new VLLMProvider({
  baseUrl: 'http://localhost:8000/v1', // default
});`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Jan and other OpenAI-compatible servers</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          Any server that speaks the OpenAI chat API can be used through{' '}
          <code>OpenAICompatibleProvider</code>. <code>baseUrl</code> is required.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { OpenAICompatibleProvider } from '@lov3kaizen/agentsea-core';

// Jan serves an OpenAI-compatible API. Point baseUrl at your Jan server.
const provider = new OpenAICompatibleProvider({
  baseUrl: 'http://localhost:1337/v1',
});`}
        />
        <Callout kind="note">
          Jan has no dedicated provider class in AgentSea. Use <code>OpenAICompatibleProvider</code>{' '}
          with the server&apos;s base URL.
        </Callout>
      </DocSection>

      <DocSection id="voice-providers" num="04" title="Voice providers">
        <p className="text-base leading-relaxed text-brand-navy">
          Speech-to-text and text-to-speech providers for voice-enabled agents:
        </p>
        <BulletPanel
          items={[
            'Speech-to-text: OpenAI Whisper, LemonFox STT, Local Whisper',
            'Text-to-speech: OpenAI TTS, LemonFox TTS, ElevenLabs, Piper TTS',
          ]}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          See the <Link href="/docs/voice" className="font-semibold text-brand-ocean hover:underline">voice guide</Link>{' '}
          for setup.
        </p>
      </DocSection>

      <DocSection id="reference" num="05" title="Provider reference">
        <ApiList>
          <ApiRow name="AnthropicProvider(apiKey?)">
            Claude. Reads <code>ANTHROPIC_API_KEY</code> when no key is passed.
          </ApiRow>
          <ApiRow name="OpenAIProvider(apiKey?)">GPT and o-series. Reads <code>OPENAI_API_KEY</code>.</ApiRow>
          <ApiRow name="GeminiProvider(apiKey?)">
            Gemini. Reads <code>GEMINI_API_KEY</code> or <code>GOOGLE_API_KEY</code>.
          </ApiRow>
          <ApiRow name="OllamaProvider({ baseUrl?, timeout? })">
            Ollama. Default <code>http://localhost:11434</code>. Also <code>listModels()</code> and{' '}
            <code>pullModel(name)</code>.
          </ApiRow>
          <ApiRow name="LMStudioProvider({ baseUrl? })">
            LM Studio. Default <code>http://localhost:1234/v1</code>.
          </ApiRow>
          <ApiRow name="LocalAIProvider({ baseUrl? })">LocalAI. Default <code>http://localhost:8080/v1</code>.</ApiRow>
          <ApiRow name="TextGenerationWebUIProvider({ baseUrl? })">
            Text Generation WebUI. Default <code>http://localhost:5000/v1</code>.
          </ApiRow>
          <ApiRow name="VLLMProvider({ baseUrl? })">vLLM. Default <code>http://localhost:8000/v1</code>.</ApiRow>
          <ApiRow name="OpenAICompatibleProvider({ baseUrl, apiKey?, timeout? })">
            Any OpenAI-compatible server. <code>baseUrl</code> is required.
          </ApiRow>
          <ApiRow name="createProvider(config)">
            Builds a provider from a config builder such as <code>mistral()</code> or <code>xai()</code>.
          </ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="choosing-provider" num="06" title="Choosing a provider">
        <BulletPanel
          items={[
            <>
              <strong>Getting started</strong>: start with a cloud provider such as Anthropic or
              OpenAI for quality and easy setup. Use Ollama with <code>llama3.2</code> for the
              simplest local setup.
            </>,
            <>
              <strong>Privacy</strong>: keep data on your infrastructure with a local provider.
            </>,
            <>
              <strong>Production scale</strong>: vLLM serves self-hosted models at high request
              volume.
            </>,
          ]}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Because every provider implements the same interface, you can start on a cloud provider
          and move to a local one later without changing agent code. Swap the provider instance and
          the model name.
        </p>
      </DocSection>

      <DocSection id="multi-provider" num="07" title="Multi-provider setup">
        <p className="text-base leading-relaxed text-brand-navy">
          Use different providers for different tasks:
        </p>
        <CodeBlock
          lang="TS"
          code={`import {
  Agent,
  AnthropicProvider,
  OllamaProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';

const toolRegistry = new ToolRegistry();
const context = { conversationId: 'demo', sessionData: {}, history: [] };

// Cloud provider for complex tasks
const researchAgent = new Agent(
  {
    name: 'researcher',
    description: 'Research assistant',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    systemPrompt: 'You are a research assistant.',
  },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  toolRegistry,
);

// Local provider for simple tasks
const helperAgent = new Agent(
  {
    name: 'helper',
    description: 'Simple local helper',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful assistant.',
  },
  new OllamaProvider(),
  toolRegistry,
);

const complexResult = await researchAgent.execute('Analyze this...', context);
const simpleResult = await helperAgent.execute('What is 2+2?', context);`}
        />
      </DocSection>

      <DocSection id="next-steps" num="08" title="Next steps">
        <BulletPanel
          items={[
            <Link key="voice" href="/docs/voice" className="text-brand-ocean hover:underline">
              Voice providers
            </Link>,
            <Link key="local" href="/docs/local-models" className="text-brand-ocean hover:underline">
              Local models guide
            </Link>,
            <Link key="cli" href="/docs/cli" className="text-brand-ocean hover:underline">
              CLI tool
            </Link>,
            <Link key="agents" href="/docs/agents" className="text-brand-ocean hover:underline">
              Agent configuration
            </Link>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
