import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function LocalModelsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Local Models & Open Source Providers"
        titleGradient="cool"
        description="Run AI agents completely locally with open source models - perfect for privacy, cost savings, and offline development."
      />

      <div className="prose max-w-none">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            🔒 Complete Privacy & Zero API Costs
          </h3>
          <div className="text-green-800 space-y-2">
            <p className="m-0">✅ Your data never leaves your machine</p>
            <p className="m-0">✅ No API keys required</p>
            <p className="m-0">✅ Works offline</p>
            <p className="m-0">✅ Unlimited usage - no per-token costs</p>
            <p className="m-0">
              ✅ 6 local providers supported: Ollama, LM Studio, LocalAI, Text
              Generation WebUI, vLLM, Jan
            </p>
          </div>
        </div>

        <h2 id="overview">Why Local Models?</h2>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="font-semibold mb-2">Privacy</h4>
            <p className="text-sm m-0">
              Sensitive data stays on your infrastructure. Perfect for
              healthcare, finance, legal.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-semibold mb-2">Cost Savings</h4>
            <p className="text-sm m-0">
              No per-token charges. Save $75K+ annually on API costs for
              production apps.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold mb-2">Control</h4>
            <p className="text-sm m-0">
              Full control over models, versions, and infrastructure. No rate
              limits.
            </p>
          </div>
        </div>

        <h2 id="ollama">Ollama (Recommended)</h2>
        <p>
          The easiest way to run local models. Ollama makes running LLMs as
          simple as <code>ollama pull llama3.2</code>.
        </p>

        <h3>Quick Start</h3>
        <CodeBlock language="bash">
          {`# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3.2

# Run a model
ollama run llama3.2`}
        </CodeBlock>

        <h3>Using with AgentSea ADK</h3>
        <CodeBlock language="typescript">
          {`import {
  Agent,
  OllamaProvider,
  ToolRegistry,
  BufferMemory,
  calculatorTool,
} from '@lov3kaizen/agentsea-core';

// Create Ollama provider - no API key needed!
const provider = new OllamaProvider({
  baseUrl: 'http://localhost:11434',
});

// Check available models
const models = await provider.listModels();
console.log('Available models:', models);

// Pull a new model if needed
if (!models.includes('llama3.2')) {
  console.log('Pulling llama3.2...');
  await provider.pullModel('llama3.2');
}

// Create agent
const agent = new Agent(
  {
    name: 'local-assistant',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful assistant running locally.',
    tools: [calculatorTool],
    temperature: 0.7,
    maxTokens: 2048,
  },
  provider,
  new ToolRegistry(),
  new BufferMemory(50),
);

// Use it - everything runs locally!
const response = await agent.execute('What is 42 * 58?', {
  conversationId: 'local-user',
  sessionData: {},
  history: [],
});

console.log(response.content);`}
        </CodeBlock>

        <h3>Popular Models for Ollama</h3>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Model</th>
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-left">RAM</th>
                <th className="px-4 py-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>llama3.2:3b</strong>
                </td>
                <td className="px-4 py-2">2GB</td>
                <td className="px-4 py-2">8GB</td>
                <td className="px-4 py-2">Fast, lightweight, good quality</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>llama3.2:latest</strong>
                </td>
                <td className="px-4 py-2">4.7GB</td>
                <td className="px-4 py-2">16GB</td>
                <td className="px-4 py-2">Best balance of quality & speed</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>mistral</strong>
                </td>
                <td className="px-4 py-2">4.1GB</td>
                <td className="px-4 py-2">16GB</td>
                <td className="px-4 py-2">Excellent instruction following</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>qwen2.5</strong>
                </td>
                <td className="px-4 py-2">4.7GB</td>
                <td className="px-4 py-2">16GB</td>
                <td className="px-4 py-2">Strong coding & reasoning</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>gemma2</strong>
                </td>
                <td className="px-4 py-2">5.4GB</td>
                <td className="px-4 py-2">16GB</td>
                <td className="px-4 py-2">Google's open model</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <strong>codellama</strong>
                </td>
                <td className="px-4 py-2">3.8GB</td>
                <td className="px-4 py-2">16GB</td>
                <td className="px-4 py-2">Code generation</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="other-providers">Other Local Providers</h2>

        <h3>LM Studio</h3>
        <p>
          Desktop app with beautiful UI for running local models.
          OpenAI-compatible API server included.
        </p>

        <CodeBlock language="typescript">
          {`import { LMStudioProvider } from '@lov3kaizen/agentsea-core';

const provider = new LMStudioProvider({
  baseUrl: 'http://localhost:1234',
});

// Use like any other provider
const agent = new Agent(
  {
    name: 'lm-studio-assistant',
    model: 'local-model', // Model loaded in LM Studio
    provider: 'lm-studio',
  },
  provider,
  toolRegistry,
);`}
        </CodeBlock>

        <h3>LocalAI</h3>
        <p>
          Self-hosted OpenAI alternative supporting LLMs, Stable Diffusion,
          voice, embeddings.
        </p>

        <CodeBlock language="typescript">
          {`import { LocalAIProvider } from '@lov3kaizen/agentsea-core';

const provider = new LocalAIProvider({
  baseUrl: 'http://localhost:8080',
});

const agent = new Agent(
  {
    name: 'localai-assistant',
    model: 'llama-3.2-3b',
    provider: 'localai',
  },
  provider,
  toolRegistry,
);`}
        </CodeBlock>

        <h3>Text Generation WebUI</h3>
        <p>Feature-rich web UI for running models with extensions ecosystem.</p>

        <CodeBlock language="typescript">
          {`import { TextGenerationWebUIProvider } from '@lov3kaizen/agentsea-core';

const provider = new TextGenerationWebUIProvider({
  baseUrl: 'http://localhost:5000',
});`}
        </CodeBlock>

        <h3>vLLM</h3>
        <p>
          High-throughput inference server for production deployments. Uses
          PagedAttention for efficiency.
        </p>

        <CodeBlock language="typescript">
          {`import { VLLMProvider } from '@lov3kaizen/agentsea-core';

const provider = new VLLMProvider({
  baseUrl: 'http://localhost:8000',
});`}
        </CodeBlock>

        <h2 id="model-management">Model Management</h2>
        <p>Ollama provider includes built-in model management:</p>

        <CodeBlock language="typescript">
          {`const provider = new OllamaProvider();

// List available models
const models = await provider.listModels();
console.log(models); // ['llama3.2', 'mistral', ...]

// Pull a new model
await provider.pullModel('codellama');

// Use the model
const agent = new Agent(
  {
    model: 'codellama',
    provider: 'ollama',
  },
  provider,
  toolRegistry,
);

// Model info
const info = await provider.getModelInfo('codellama');
console.log('Model size:', info.size);
console.log('Parameters:', info.parameters);`}
        </CodeBlock>

        <h2 id="streaming">Streaming Support</h2>
        <p>All local providers support streaming for real-time responses:</p>

        <CodeBlock language="typescript">
          {`import { Agent, OllamaProvider } from '@lov3kaizen/agentsea-core';

const provider = new OllamaProvider();
const agent = new Agent(
  {
    model: 'llama3.2',
    provider: 'ollama',
    stream: true, // Enable streaming
  },
  provider,
  toolRegistry,
);

// Stream response chunks
for await (const chunk of agent.stream('Write a story', context)) {
  process.stdout.write(chunk.content);
}`}
        </CodeBlock>

        <h2 id="complete-privacy">Complete Privacy Example</h2>
        <p>
          Build a fully private AI system - LLM, voice, and tools all running
          locally:
        </p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  OllamaProvider,
  VoiceAgent,
  LocalWhisperProvider,
  PiperTTSProvider,
  ToolRegistry,
  BufferMemory,
} from '@lov3kaizen/agentsea-core';

// Local LLM
const ollamaProvider = new OllamaProvider();

// Local voice
const sttProvider = new LocalWhisperProvider({
  whisperPath: '/usr/local/bin/whisper',
  modelPath: '/path/to/ggml-base.bin',
});

const ttsProvider = new PiperTTSProvider({
  piperPath: '/usr/local/bin/piper',
  modelPath: '/path/to/en_US-lessac-medium.onnx',
});

// Create agent
const agent = new Agent(
  {
    name: 'private-assistant',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a completely private AI assistant.',
  },
  ollamaProvider,
  new ToolRegistry(),
  new BufferMemory(100),
);

// Wrap with voice
const voiceAgent = new VoiceAgent(agent, {
  sttProvider,
  ttsProvider,
  autoSpeak: true,
});

// Everything runs locally - complete privacy!
const result = await voiceAgent.processVoice(audioInput, context);

// ✅ No data sent to cloud
// ✅ No API keys needed
// ✅ Works offline
// ✅ Zero API costs`}
        </CodeBlock>

        <h2 id="performance">Performance Tips</h2>

        <div className="space-y-4 my-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 font-semibold mb-2">
              🚀 GPU Acceleration
            </h4>
            <p className="text-blue-800 text-sm m-0">
              Ollama automatically uses GPU if available. Expect 10-50x faster
              inference with NVIDIA GPU.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-purple-900 font-semibold mb-2">
              💾 Model Size vs Quality
            </h4>
            <p className="text-purple-800 text-sm m-0">
              Start with 3B models (8GB RAM) for testing. Use 7B models (16GB
              RAM) for production quality.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-green-900 font-semibold mb-2">
              ⚡ Context Length
            </h4>
            <p className="text-green-800 text-sm m-0">
              Reduce max_tokens for faster responses. Most conversations work
              well with 1024-2048 tokens.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-orange-900 font-semibold mb-2">
              🔄 Keep Models Loaded
            </h4>
            <p className="text-orange-800 text-sm m-0">
              Ollama keeps models in memory for 5 minutes after use. First
              request loads model (slow), subsequent requests are fast.
            </p>
          </div>
        </div>

        <h2 id="provider-comparison">Provider Comparison</h2>

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
                <td className="px-4 py-2">Getting started, development</td>
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
                <td className="px-4 py-2">Production, high throughput</td>
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
            </tbody>
          </table>
        </div>

        <h2 id="use-cases">Use Cases</h2>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🏥 Healthcare</h4>
            <p className="text-sm m-0">
              Process patient data locally, maintain HIPAA compliance without
              cloud dependencies.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">💰 Finance</h4>
            <p className="text-sm m-0">
              Analyze financial data on-premise, meet regulatory requirements
              for data sovereignty.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">⚖️ Legal</h4>
            <p className="text-sm m-0">
              Review confidential documents locally, maintain attorney-client
              privilege.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🚀 Startups</h4>
            <p className="text-sm m-0">
              Build MVP without API costs, scale without per-token charges
              eating profits.
            </p>
          </div>
        </div>

        <h2 id="next-steps">Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/voice">Add Voice Features</Link> - Local voice
            with Whisper & Piper
          </li>
          <li>
            <Link href="/docs/cli">Use the CLI Tool</Link> - Interactive model
            management
          </li>
          <li>
            <Link href="/docs/providers">Explore All Providers</Link> - 12+
            providers total
          </li>
          <li>
            <Link href="/examples">View Examples</Link> - Complete local
            examples
          </li>
        </ul>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            💡 Recommended Setup
          </h3>
          <p className="text-green-800 m-0">
            <strong>Development:</strong> Start with Ollama + llama3.2:3b (fast,
            good quality)
            <br />
            <strong>Production:</strong> Use vLLM + mistral-7b (best throughput)
            <br />
            <strong>Privacy:</strong> Ollama + Local Whisper + Piper TTS (100%
            local)
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
