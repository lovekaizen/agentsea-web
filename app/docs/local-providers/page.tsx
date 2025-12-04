import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function LocalProvidersPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Local & Open Source Providers"
        titleGradient="cool"
        description="Run AI agents completely locally or with open source models. Perfect for privacy-sensitive applications, offline deployments, cost optimization, and development."
      />

      <div className="prose prose-lg max-w-none">
        <div className="bg-sky-50 border-l-4 border-sky-500 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">
            Why Use Local Providers?
          </h3>
          <ul className="space-y-2">
            <li>
              🔒 <strong>Privacy & Security</strong> - Data never leaves your
              infrastructure
            </li>
            <li>
              💰 <strong>Cost Savings</strong> - No per-token API costs
            </li>
            <li>
              ⚡ <strong>Low Latency</strong> - No network round trips for
              inference
            </li>
            <li>
              🔌 <strong>Offline Capable</strong> - Works without internet
              connection
            </li>
            <li>
              🎛️ <strong>Full Control</strong> - Customize models, parameters,
              and deployment
            </li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4">
          Supported Local Providers
        </h2>

        {/* Ollama */}
        <div className="border rounded-lg p-6 mb-6 bg-slate-50 shadow-sm">
          <h3 className="text-2xl font-bold mb-3">🦙 Ollama</h3>
          <p className="mb-4">
            The easiest way to run local LLMs. Supports Llama 3, Mistral, Gemma,
            and 50+ other models with automatic model management and GPU
            acceleration.
          </p>

          <h4 className="text-lg font-semibold mb-2">Installation</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download

# Pull a model
ollama pull llama3.2
ollama pull mistral
ollama pull gemma2`}</code>
          </pre>

          <h4 className="text-lg font-semibold mb-2">Basic Usage</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`import { Agent, OllamaProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// Initialize Ollama provider
const provider = new OllamaProvider({
  baseUrl: 'http://localhost:11434',
  model: 'llama3.2' // or 'mistral', 'gemma2', etc.
});

// Create agent with local model
const agent = new Agent(
  {
    name: 'local-assistant',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful AI assistant running locally.',
    tools: [],
    temperature: 0.7
  },
  provider,
  new ToolRegistry()
);

// Execute locally
const response = await agent.execute(
  'What are the benefits of running AI models locally?'
);

console.log(response.content);`}</code>
          </pre>

          <h4 className="text-lg font-semibold mb-2">Recommended Models</h4>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>llama3.2:3b</strong> - Fast, efficient, great for chat
              (3GB RAM)
            </li>
            <li>
              <strong>llama3.1:8b</strong> - Balanced performance and quality
              (8GB RAM)
            </li>
            <li>
              <strong>mistral:7b</strong> - Excellent instruction following (7GB
              RAM)
            </li>
            <li>
              <strong>gemma2:9b</strong> - Google's efficient model (9GB RAM)
            </li>
            <li>
              <strong>qwen2.5:7b</strong> - Strong multilingual support (7GB
              RAM)
            </li>
          </ul>
        </div>

        {/* llama.cpp */}
        <div className="border rounded-lg p-6 mb-6 bg-slate-50 shadow-sm">
          <h3 className="text-2xl font-bold mb-3">🚀 llama.cpp</h3>
          <p className="mb-4">
            High-performance C++ inference engine with Metal (Mac), CUDA
            (NVIDIA), and CPU support. Provides the fastest local inference with
            quantized models.
          </p>

          <h4 className="text-lg font-semibold mb-2">Installation</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`# Build from source
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# macOS (with Metal acceleration)
make LLAMA_METAL=1

# Linux with CUDA
make LLAMA_CUDA=1

# Start server
./llama-server \\
  -m models/llama-3.2-3b-q4_k_m.gguf \\
  --port 8080 \\
  --n-gpu-layers 35`}</code>
          </pre>

          <h4 className="text-lg font-semibold mb-2">Basic Usage</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`import { Agent, LlamaCppProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// Initialize llama.cpp provider
const provider = new LlamaCppProvider({
  baseUrl: 'http://localhost:8080',
  model: 'llama-3.2-3b-q4_k_m'
});

const agent = new Agent(
  {
    name: 'fast-agent',
    model: 'llama-3.2-3b-q4_k_m',
    provider: 'llama-cpp',
    systemPrompt: 'You are a fast, efficient AI assistant.',
    tools: [],
    temperature: 0.7,
    maxTokens: 2048
  },
  provider,
  new ToolRegistry()
);

// Stream responses for real-time output
const stream = await agent.stream('Explain quantum computing');

for await (const chunk of stream) {
  if (chunk.type === 'content') {
    process.stdout.write(chunk.content);
  }
}`}</code>
          </pre>

          <h4 className="text-lg font-semibold mb-2">
            Download Quantized Models
          </h4>
          <p className="mb-2">
            Get pre-quantized GGUF models from HuggingFace:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              <a
                href="https://huggingface.co/bartowski"
                className="text-sky-600 hover:underline"
              >
                bartowski's collection
              </a>{' '}
              - Wide variety of quantized models
            </li>
            <li>
              <a
                href="https://huggingface.co/TheBloke"
                className="text-sky-600 hover:underline"
              >
                TheBloke's collection
              </a>{' '}
              - Popular GGUF conversions
            </li>
            <li>
              <a
                href="https://huggingface.co/QuantFactory"
                className="text-sky-600 hover:underline"
              >
                QuantFactory
              </a>{' '}
              - High-quality quantizations
            </li>
          </ul>
        </div>

        {/* GPT4All */}
        <div className="border rounded-lg p-6 mb-6 bg-slate-50 shadow-sm">
          <h3 className="text-2xl font-bold mb-3">🌐 GPT4All</h3>
          <p className="mb-4">
            Privacy-focused local LLM platform with easy-to-use desktop app and
            Python/TypeScript bindings. Great for beginners and non-technical
            users.
          </p>

          <h4 className="text-lg font-semibold mb-2">Installation</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`# Install GPT4All package
npm install gpt4all

# Or download desktop app
# https://gpt4all.io/`}</code>
          </pre>

          <h4 className="text-lg font-semibold mb-2">Basic Usage</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`import { Agent, GPT4AllProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// Initialize GPT4All provider
const provider = new GPT4AllProvider({
  model: 'orca-mini-3b-gguf2-q4_0',
  modelPath: './models/' // Optional: custom model directory
});

const agent = new Agent(
  {
    name: 'gpt4all-agent',
    model: 'orca-mini-3b-gguf2-q4_0',
    provider: 'gpt4all',
    systemPrompt: 'You are a helpful assistant.',
    tools: []
  },
  provider,
  new ToolRegistry()
);

const response = await agent.execute('What is machine learning?');
console.log(response.content);`}</code>
          </pre>
        </div>

        {/* HuggingFace */}
        <div className="border rounded-lg p-6 mb-6 bg-slate-50 shadow-sm">
          <h3 className="text-2xl font-bold mb-3">
            🤗 HuggingFace Transformers
          </h3>
          <p className="mb-4">
            Access thousands of open source models via HuggingFace Inference API
            or self-hosted endpoints. Supports both cloud and local deployment.
          </p>

          <h4 className="text-lg font-semibold mb-2">
            Using Inference API (Free)
          </h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`import { Agent, HuggingFaceProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// Free tier with rate limits
const provider = new HuggingFaceProvider({
  apiKey: process.env.HUGGINGFACE_API_KEY, // Get from hf.co
  model: 'meta-llama/Meta-Llama-3-8B-Instruct'
});

const agent = new Agent(
  {
    name: 'hf-agent',
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
    provider: 'huggingface',
    systemPrompt: 'You are a helpful AI assistant.',
    tools: []
  },
  provider,
  new ToolRegistry()
);

const response = await agent.execute('Explain neural networks');
console.log(response.content);`}</code>
          </pre>

          <h4 className="text-lg font-semibold mb-2">
            Self-Hosted with Text Generation Inference
          </h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`# Run TGI server locally
docker run -p 8080:80 \\
  -v ./models:/data \\
  ghcr.io/huggingface/text-generation-inference:latest \\
  --model-id meta-llama/Meta-Llama-3-8B-Instruct

# Connect to local endpoint
const provider = new HuggingFaceProvider({
  baseUrl: 'http://localhost:8080',
  model: 'meta-llama/Meta-Llama-3-8B-Instruct'
});`}</code>
          </pre>

          <h4 className="text-lg font-semibold mb-2">
            Popular Open Source Models
          </h4>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              <strong>meta-llama/Meta-Llama-3.1-8B-Instruct</strong> - Meta's
              latest
            </li>
            <li>
              <strong>mistralai/Mistral-7B-Instruct-v0.3</strong> - Efficient
              instruct model
            </li>
            <li>
              <strong>google/gemma-2-9b-it</strong> - Google's open model
            </li>
            <li>
              <strong>Qwen/Qwen2.5-7B-Instruct</strong> - Multilingual support
            </li>
            <li>
              <strong>microsoft/Phi-3-mini-4k-instruct</strong> - Small but
              capable (3.8B)
            </li>
          </ul>
        </div>

        {/* LM Studio */}
        <div className="border rounded-lg p-6 mb-6 bg-slate-50 shadow-sm">
          <h3 className="text-2xl font-bold mb-3">💻 LM Studio</h3>
          <p className="mb-4">
            User-friendly desktop app for running local LLMs with a beautiful
            UI. Includes model discovery, automatic quantization selection, and
            OpenAI-compatible API server.
          </p>

          <h4 className="text-lg font-semibold mb-2">Setup</h4>
          <ol className="list-decimal pl-6 mb-4 space-y-2">
            <li>
              Download LM Studio from{' '}
              <a
                href="https://lmstudio.ai"
                className="text-sky-600 hover:underline"
              >
                lmstudio.ai
              </a>
            </li>
            <li>Browse and download models from the UI</li>
            <li>Start the local server (OpenAI-compatible endpoint)</li>
            <li>Connect AgentSea to the server</li>
          </ol>

          <h4 className="text-lg font-semibold mb-2">Basic Usage</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`import { Agent, OpenAIProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';

// LM Studio uses OpenAI-compatible API
const provider = new OpenAIProvider({
  baseUrl: 'http://localhost:1234/v1',
  apiKey: 'lm-studio', // Any value works for local
  model: 'local-model'
});

const agent = new Agent(
  {
    name: 'lm-studio-agent',
    model: 'local-model',
    provider: 'openai', // Uses OpenAI interface
    systemPrompt: 'You are a helpful assistant.',
    tools: []
  },
  provider,
  new ToolRegistry()
);

const response = await agent.execute('Hello!');
console.log(response.content);`}</code>
          </pre>
        </div>

        {/* Mistral Self-Hosted */}
        <div className="border rounded-lg p-6 mb-6 bg-slate-50 shadow-sm">
          <h3 className="text-2xl font-bold mb-3">
            🌪️ Mistral AI (Self-Hosted)
          </h3>
          <p className="mb-4">
            Mistral offers open-weight models that can be self-hosted. Use their
            official Docker images or deploy via vLLM for production workloads.
          </p>

          <h4 className="text-lg font-semibold mb-2">
            Using vLLM (Recommended for Production)
          </h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{`# Deploy Mistral 7B with vLLM
docker run -p 8000:8000 \\
  --gpus all \\
  vllm/vllm-openai:latest \\
  --model mistralai/Mistral-7B-Instruct-v0.3 \\
  --dtype float16

# Connect AgentSea agent
const provider = new OpenAIProvider({
  baseUrl: 'http://localhost:8000/v1',
  apiKey: 'none',
  model: 'mistralai/Mistral-7B-Instruct-v0.3'
});`}</code>
          </pre>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4">Provider Comparison</h2>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-whblue-700 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                  Provider
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                  Ease of Use
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                  Performance
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                  GPU Required
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                  Best For
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm">Ollama</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">Optional</td>
                <td className="px-6 py-4 text-sm">Quick start, development</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm">llama.cpp</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">Optional</td>
                <td className="px-6 py-4 text-sm">Maximum performance</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm">GPT4All</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">No</td>
                <td className="px-6 py-4 text-sm">Beginners, desktop apps</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm">LM Studio</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">Optional</td>
                <td className="px-6 py-4 text-sm">GUI users, testing models</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm">HuggingFace TGI</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">Recommended</td>
                <td className="px-6 py-4 text-sm">Model variety</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm">vLLM</td>
                <td className="px-6 py-4 text-sm">⭐⭐</td>
                <td className="px-6 py-4 text-sm">⭐⭐⭐⭐⭐</td>
                <td className="px-6 py-4 text-sm">Yes</td>
                <td className="px-6 py-4 text-sm">
                  Production, high throughput
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4">
          Tool Calling with Local Models
        </h2>

        <p className="mb-4">
          Many local models don't natively support function calling like Claude
          or GPT-4. AgentSea provides automatic tool calling fallback using
          prompt engineering:
        </p>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`import { Agent, OllamaProvider, ToolRegistry, Calculator, HttpRequest } from '@lov3kaizen/agentsea-core';

const toolRegistry = new ToolRegistry();
toolRegistry.register(new Calculator());
toolRegistry.register(new HttpRequest());

const provider = new OllamaProvider({
  baseUrl: 'http://localhost:11434',
  model: 'llama3.2',
  // Enable tool calling adapter for models without native support
  useToolAdapter: true
});

const agent = new Agent(
  {
    name: 'tool-agent',
    model: 'llama3.2',
    provider: 'ollama',
    systemPrompt: 'You are a helpful assistant with access to tools.',
    tools: [
      { name: 'calculator', description: 'Perform mathematical calculations' },
      { name: 'http_request', description: 'Make HTTP requests to APIs' }
    ]
  },
  provider,
  toolRegistry
);

// Agent will automatically format tool calls in prompts
const response = await agent.execute(
  'What is 47 * 89 + 123?'
);

console.log(response.content);
// Uses calculator tool automatically`}</code>
        </pre>

        <h2 className="text-3xl font-bold mt-12 mb-4">Hardware Requirements</h2>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Minimum Requirements</h3>
          <ul className="space-y-2">
            <li>
              <strong>CPU Only:</strong> 8GB RAM, modern CPU (3B models)
            </li>
            <li>
              <strong>GPU Recommended:</strong> 16GB RAM, NVIDIA GPU with 6GB+
              VRAM (7B models)
            </li>
            <li>
              <strong>Optimal:</strong> 32GB RAM, NVIDIA GPU with 12GB+ VRAM
              (13B+ models)
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-whblue-700 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                  Model Size
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                  RAM (CPU)
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                  VRAM (GPU)
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm">3B (Q4)</td>
                <td className="px-6 py-4 text-sm">4GB</td>
                <td className="px-6 py-4 text-sm">3GB</td>
                <td className="px-6 py-4 text-sm">Fast, basic tasks</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm">7B (Q4)</td>
                <td className="px-6 py-4 text-sm">8GB</td>
                <td className="px-6 py-4 text-sm">6GB</td>
                <td className="px-6 py-4 text-sm">Good balance</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm">13B (Q4)</td>
                <td className="px-6 py-4 text-sm">16GB</td>
                <td className="px-6 py-4 text-sm">10GB</td>
                <td className="px-6 py-4 text-sm">High quality</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm">70B (Q4)</td>
                <td className="px-6 py-4 text-sm">48GB</td>
                <td className="px-6 py-4 text-sm">40GB</td>
                <td className="px-6 py-4 text-sm">Near GPT-4 level</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4">Troubleshooting</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-bold mb-2">
              Connection Refused / Cannot Connect
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Verify the server is running:{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  curl http://localhost:11434
                </code>
              </li>
              <li>Check firewall settings</li>
              <li>Ensure correct port in baseUrl</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-bold mb-2">Out of Memory (OOM)</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use a smaller model (3B instead of 7B)</li>
              <li>Try higher quantization (Q4 instead of Q8)</li>
              <li>Reduce context length (maxTokens)</li>
              <li>Enable GPU offloading if available</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-bold mb-2">Slow Response Times</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Enable GPU acceleration (Metal/CUDA)</li>
              <li>Use quantized models (Q4_K_M recommended)</li>
              <li>Reduce batch size or context length</li>
              <li>Consider switching to llama.cpp for faster inference</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-bold mb-2">Tool Calling Not Working</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Enable{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  useToolAdapter: true
                </code>{' '}
                in provider config
              </li>
              <li>Use models fine-tuned for instruction following</li>
              <li>Check system prompt includes tool descriptions</li>
              <li>Consider using cloud providers for complex tool use</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4">
          Performance Optimization Tips
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6 bg-whblue-700 shadow-sm">
            <h3 className="font-bold text-lg mb-3">🚀 Speed Optimization</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Use Q4_K_M quantization (best speed/quality)</li>
              <li>
                ✓ Enable GPU layers (<code>--n-gpu-layers 35</code>)
              </li>
              <li>✓ Increase batch size for throughput</li>
              <li>✓ Use smaller models (3B-7B) for simple tasks</li>
              <li>✓ Enable flash attention if available</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 bg-whblue-700 shadow-sm">
            <h3 className="font-bold text-lg mb-3">🎯 Quality Optimization</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Use Q5_K_M or Q8 quantization</li>
              <li>✓ Choose larger models (13B-70B)</li>
              <li>✓ Adjust temperature (0.7 for creative, 0.1 for factual)</li>
              <li>✓ Use instruct-tuned model variants</li>
              <li>✓ Provide clear system prompts</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4">Production Deployment</h2>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`version: '3.8'

services:
  # High-performance inference with vLLM
  vllm:
    image: vllm/vllm-openai:latest
    ports:
      - "8000:8000"
    volumes:
      - ./models:/root/.cache/huggingface
    environment:
      - CUDA_VISIBLE_DEVICES=0
    command: >
      --model mistralai/Mistral-7B-Instruct-v0.3
      --dtype float16
      --max-model-len 4096
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  # Your AgentSea application
  agentsea-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - LOCAL_LLM_URL=http://vllm:8000
    depends_on:
      - vllm`}</code>
        </pre>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">Ready to Get Started?</h3>
          <p className="mb-4">
            Start with Ollama for the easiest setup, then explore other
            providers based on your needs. All local providers work seamlessly
            with AgentSea's agent framework, tools, and workflows.
          </p>
          <div className="space-x-4">
            <a
              href="/docs/quick-start"
              className="text-sky-600 hover:underline font-semibold"
            >
              Quick Start Guide →
            </a>
            <a
              href="/docs/agents"
              className="text-sky-600 hover:underline font-semibold"
            >
              Agent Documentation →
            </a>
            <a
              href="/examples"
              className="text-sky-600 hover:underline font-semibold"
            >
              See Examples →
            </a>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-4">Next Steps</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li>
            <a href="/docs/tools" className="text-sky-600 hover:underline">
              Learn about Tool Integration
            </a>
          </li>
          <li>
            <a href="/docs/workflows" className="text-sky-600 hover:underline">
              Build Multi-Agent Workflows
            </a>
          </li>
          <li>
            <a href="/docs/memory" className="text-sky-600 hover:underline">
              Configure Memory Stores
            </a>
          </li>
          <li>
            <a
              href="/docs/observability"
              className="text-sky-600 hover:underline"
            >
              Monitor Performance
            </a>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
