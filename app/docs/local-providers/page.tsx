import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Local and open source providers | AgentSea',
  description:
    'Run AgentSea agents against local model servers: Ollama, LM Studio, LocalAI, Text Generation WebUI, vLLM and any OpenAI-compatible endpoint.',
};

const toc = [
  { id: 'why-local', label: 'Why local providers' },
  { id: 'ollama', label: 'Ollama' },
  { id: 'lm-studio', label: 'LM Studio' },
  { id: 'localai', label: 'LocalAI' },
  { id: 'text-generation-webui', label: 'Text Generation WebUI' },
  { id: 'vllm', label: 'vLLM' },
  { id: 'openai-compatible', label: 'Other OpenAI-compatible servers' },
  { id: 'reference', label: 'Provider reference' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'next-steps', label: 'Next steps' },
];

export default function LocalProvidersPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Local and open source providers"
      lead="Run AgentSea agents against models on your own machine or server, for privacy, cost control, offline use or development."
      active="concepts"
      toc={toc}
    >
      <DocSection id="why-local" num="01" title="Why local providers">
        <BulletPanel
          items={[
            <>
              <strong>Privacy</strong>: data stays on your infrastructure.
            </>,
            <>
              <strong>Cost</strong>: no per-token API charges.
            </>,
            <>
              <strong>Latency</strong>: no network round trip to a hosted API.
            </>,
            <>
              <strong>Offline use</strong>: works without an internet connection once the model is
              installed.
            </>,
            <>
              <strong>Control</strong>: choose the model, the version and where it runs.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="ollama" num="02" title="Ollama">
        <p className="text-base leading-relaxed text-brand-navy">
          The simplest way to run local models. Install Ollama, start the server and pull a model:
        </p>
        <CodeBlock
          lang="BASH"
          code={`# Start the server
ollama serve

# Pull a model
ollama pull llama3.2`}
        />
        <CodeBlock
          lang="TS"
          code={`import { Agent, OllamaProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const provider = new OllamaProvider({
  baseUrl: 'http://localhost:11434', // default, or set OLLAMA_BASE_URL
  timeout: 60000, // default
});

const toolRegistry = new ToolRegistry();

const agent = new Agent(
  {
    name: 'local-assistant',
    description: 'Runs locally on Ollama',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful AI assistant running locally.',
    temperature: 0.7,
  },
  provider,
  toolRegistry,
);

const response = await agent.execute('What are the benefits of running AI models locally?', {
  conversationId: 'local-demo',
  sessionData: {},
  history: [],
});

console.log(response.content);`}
        />
        <p className="text-base leading-relaxed text-brand-navy">
          Popular models include <code>llama3.2</code>, <code>llama3</code>, <code>mistral</code>,{' '}
          <code>gemma2</code>, <code>qwen2.5</code>, <code>codellama</code> and <code>phi3</code>.
        </p>
        <p className="text-base leading-relaxed text-brand-navy">
          The provider also exposes <code>listModels()</code> and <code>pullModel(name)</code>.
        </p>
      </DocSection>

      <DocSection id="lm-studio" num="03" title="LM Studio">
        <p className="text-base leading-relaxed text-brand-navy">
          A desktop app with a model browser and a built-in OpenAI-compatible server. Download a
          model in the app, start the local server, then point AgentSea at it.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, LMStudioProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

const provider = new LMStudioProvider({
  baseUrl: 'http://localhost:1234/v1', // default
});

const agent = new Agent(
  {
    name: 'lm-studio-agent',
    description: 'Runs on LM Studio',
    model: 'local-model', // the model you loaded in LM Studio
    provider: 'openai-compatible',
    systemPrompt: 'You are a helpful assistant.',
  },
  provider,
  new ToolRegistry(),
);`}
        />
      </DocSection>

      <DocSection id="localai" num="04" title="LocalAI">
        <p className="text-base leading-relaxed text-brand-navy">
          A self-hosted, OpenAI-compatible server.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { LocalAIProvider } from '@lov3kaizen/agentsea-core';

const provider = new LocalAIProvider({
  baseUrl: 'http://localhost:8080/v1', // default
});`}
        />
      </DocSection>

      <DocSection id="text-generation-webui" num="05" title="Text Generation WebUI">
        <p className="text-base leading-relaxed text-brand-navy">
          A web interface for running models, with an OpenAI-compatible API.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { TextGenerationWebUIProvider } from '@lov3kaizen/agentsea-core';

const provider = new TextGenerationWebUIProvider({
  baseUrl: 'http://localhost:5000/v1', // default
});`}
        />
      </DocSection>

      <DocSection id="vllm" num="06" title="vLLM">
        <p className="text-base leading-relaxed text-brand-navy">
          An inference engine for serving models at higher request volume. Start a vLLM
          OpenAI-compatible server by following the vLLM documentation, then connect to it:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { VLLMProvider } from '@lov3kaizen/agentsea-core';

const provider = new VLLMProvider({
  baseUrl: 'http://localhost:8000/v1', // default
});`}
        />
      </DocSection>

      <DocSection id="openai-compatible" num="07" title="Other OpenAI-compatible servers">
        <p className="text-base leading-relaxed text-brand-navy">
          Any server that implements the OpenAI chat API can be used through{' '}
          <code>OpenAICompatibleProvider</code>. This includes Jan. <code>baseUrl</code> is
          required, and <code>apiKey</code> is optional.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { OpenAICompatibleProvider } from '@lov3kaizen/agentsea-core';

const provider = new OpenAICompatibleProvider({
  baseUrl: 'http://localhost:1337/v1', // your server's base URL
  apiKey: process.env.LOCAL_API_KEY, // only if the server requires one
});`}
        />
      </DocSection>

      <DocSection id="reference" num="08" title="Provider reference">
        <ApiList>
          <ApiRow name="OllamaProvider({ baseUrl?, timeout? })">
            Default <code>http://localhost:11434</code>. Reads <code>OLLAMA_BASE_URL</code> when
            no base URL is passed.
          </ApiRow>
          <ApiRow name="LMStudioProvider({ baseUrl? })">Default <code>http://localhost:1234/v1</code>.</ApiRow>
          <ApiRow name="LocalAIProvider({ baseUrl? })">Default <code>http://localhost:8080/v1</code>.</ApiRow>
          <ApiRow name="TextGenerationWebUIProvider({ baseUrl? })">
            Default <code>http://localhost:5000/v1</code>.
          </ApiRow>
          <ApiRow name="VLLMProvider({ baseUrl? })">Default <code>http://localhost:8000/v1</code>.</ApiRow>
          <ApiRow name="OpenAICompatibleProvider({ baseUrl, apiKey? })">
            Any OpenAI-compatible server. <code>baseUrl</code> is required.
          </ApiRow>
        </ApiList>
        <Callout kind="note">
          The other providers take their base URL from the constructor only. Pass{' '}
          <code>baseUrl</code> explicitly so the target is clear in your code.
        </Callout>
      </DocSection>

      <DocSection id="troubleshooting" num="09" title="Troubleshooting">
        <BulletPanel
          items={[
            <>
              <strong>Connection refused</strong>: check that the server is running and that the port
              in <code>baseUrl</code> matches it. For Ollama, run <code>curl http://localhost:11434</code>.
            </>,
            <>
              <strong>Model not found</strong>: the <code>model</code> field must match a model the
              server has loaded or pulled.
            </>,
            <>
              <strong>Slow responses</strong>: try a smaller or more heavily quantized model, and
              check that the server is using your GPU.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="next-steps" num="10" title="Next steps">
        <BulletPanel
          items={[
            <Link key="providers" href="/docs/providers" className="text-brand-ocean hover:underline">
              Provider reference
            </Link>,
            <Link key="agents" href="/docs/agents" className="text-brand-ocean hover:underline">
              Agent documentation
            </Link>,
            <Link key="tools" href="/docs/tools" className="text-brand-ocean hover:underline">
              Tool integration
            </Link>,
            <Link key="observability" href="/docs/observability" className="text-brand-ocean hover:underline">
              Monitor performance
            </Link>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
