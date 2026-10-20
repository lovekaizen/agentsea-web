import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'Local models | AgentSea',
  description:
    'Run agents against models on your own machine or on a self-hosted server that speaks the OpenAI chat API.',
};

const toc = [
  { id: 'providers', label: 'Providers' },
  { id: 'ollama-run', label: 'Run a model with Ollama' },
  { id: 'ollama-setup', label: 'Ollama setup' },
  { id: 'streaming', label: 'Streaming' },
  { id: 'environment', label: 'Environment variables' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
];

export default function LocalModelsPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="Local models"
      lead="Run agents against models on your own machine or on a self-hosted server that speaks the OpenAI chat API."
      active="guides"
      toc={toc}
    >
      <DocSection id="providers" num="01" title="Providers">
        <p className="text-base leading-relaxed text-brand-navy">
          The core package exports one provider class for Ollama. The other local servers use the
          OpenAI-compatible provider class.
        </p>
        <BulletPanel
          items={[
            <>
              <code>OllamaProvider</code>: Ollama. The default base URL is <code>http://localhost:11434</code>,
              or the value of <code>OLLAMA_BASE_URL</code>.
            </>,
            <>
              <code>LMStudioProvider</code>: LM Studio's local server.
            </>,
            <>
              <code>LocalAIProvider</code>: LocalAI.
            </>,
            <>
              <code>VLLMProvider</code>: vLLM's OpenAI-compatible server.
            </>,
            <>
              <code>TextGenerationWebUIProvider</code>: Text Generation WebUI, with its OpenAI extension enabled.
            </>,
            <>
              <code>OpenAICompatibleProvider</code>: any server that implements the OpenAI chat API. Takes an
              optional <code>apiKey</code> and <code>defaultHeaders</code>.
            </>,
          ]}
        />
        <Callout kind="note">
          Default ports: LM Studio 1234, LocalAI 8080, vLLM 8000 and Text Generation WebUI 5000. Confirm these
          for your setup.
        </Callout>
      </DocSection>

      <DocSection id="ollama-run" num="02" title="Run a model with Ollama">
        <p className="text-base leading-relaxed text-brand-navy">
          Pass the provider to the Agent constructor with the agent config and a ToolRegistry. The config's
          provider field is the string <code>'ollama'</code>.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, OllamaProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';
const provider = new OllamaProvider({ baseUrl: 'http://localhost:11434', timeout: 60000 });
await provider.pullModel('llama3');
const agent = new Agent(
  { name: 'local-assistant', description: 'Local assistant', model: 'llama3', provider: 'ollama' },
  provider,
  new ToolRegistry(),
);
const response = await agent.execute('Hello!', {
  conversationId: 'conv-1',
  sessionData: {},
  history: [],
});
console.log(response.content);`}
        />
        <Callout kind="warning">
          Do not call <code>agent.registerProvider</code>. Pass the provider to the Agent constructor, as shown
          here.
        </Callout>
      </DocSection>

      <DocSection id="ollama-setup" num="03" title="Ollama setup">
        <p className="text-base leading-relaxed text-brand-navy">Install Ollama, start the server, and pull a model.</p>
        <p className="text-base leading-relaxed text-brand-navy">
          <code>OllamaProvider</code> has two helpers. <code>listModels()</code> returns the names of the installed
          models. <code>pullModel(name)</code> downloads a model.
        </p>
        <BulletPanel
          items={[
            'llama3, mistral and mixtral: general purpose.',
            'codellama and deepseek-coder: code.',
            'phi, gemma and tinyllama: smaller models.',
          ]}
        />
        <CodeBlock lang="BASH" code={`ollama serve\nollama pull llama3`} />
      </DocSection>

      <DocSection id="streaming" num="04" title="Streaming">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>Agent.executeStream</code> yields event objects. Content chunks have type <code>'content'</code> and
          a <code>content</code> string. The stream ends with a <code>'done'</code> event, or an{' '}
          <code>'error'</code> event if the run fails.
        </p>
        <CodeBlock
          lang="TS"
          code={`const context = { conversationId: 'conv-2', sessionData: {}, history: [] };

for await (const event of agent.executeStream('Tell me a short story', context)) {
  if (event.type === 'content') {
    process.stdout.write(event.content ?? '');
  }
}`}
        />
        <Callout kind="note">The streaming method is executeStream.</Callout>
      </DocSection>

      <DocSection id="environment" num="05" title="Environment variables">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>OllamaProvider</code> reads <code>OLLAMA_BASE_URL</code> when no <code>baseUrl</code> is passed.
          Other local providers take their base URL and key in the constructor. The core package does not read{' '}
          <code>LMSTUDIO_BASE_URL</code>, <code>LOCALAI_BASE_URL</code>, <code>CUSTOM_LLM_BASE_URL</code> or{' '}
          <code>CUSTOM_LLM_API_KEY</code>.
        </p>
        <CodeBlock lang="BASH" code="export OLLAMA_BASE_URL=http://localhost:11434" />
      </DocSection>

      <DocSection id="troubleshooting" num="06" title="Troubleshooting">
        <BulletPanel
          items={[
            'Timeouts on slow hardware: raise the timeout option. OllamaProvider defaults to 60000 ms.',
            'Model not found: pull the model first with pullModel() or ollama pull.',
            'Out of memory: use a smaller or quantized model and shorten maxTokens.',
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
