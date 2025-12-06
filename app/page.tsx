import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-base-100">
      {/* Hero Section with Gradient Mesh Background */}
      <div className="hero min-h-screen bg-gradient-mesh relative overflow-hidden">
        {/* Floating orbs for atmosphere */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        <div className="hero-content text-center max-w-5xl relative z-10">
          <div className="space-y-8 flex flex-col items-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm text-white/80">
                Production-Ready ADK
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight text-white text-center">
              Unite and Orchestrate
              <br />
              <span className="text-gradient-animated">AI Agents</span> with
            </h1>

            <Image
              src={'/svg/agentsea-adk-logo-plain.svg'}
              width={528}
              height={145}
              alt="AgentSea Logo"
              className="center"
            />

            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              The complete framework for building agentic AI applications with
              <span className="text-gradient-blue font-semibold">
                {' '}
                built-in voice
              </span>
              ,
              <span className="text-gradient-purple font-semibold">
                {' '}
                commerce capabilities
              </span>
              ,
              <span className="text-gradient-cool font-semibold">
                {' '}
                local models
              </span>
              , and complete privacy.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 py-2">
              <div className="text-center">
                <div className="stat-gradient">12+</div>
                <div className="text-sm text-white/60 mt-1">LLM Providers</div>
              </div>
              <div className="text-center">
                <div className="stat-gradient">5</div>
                <div className="text-sm text-white/60 mt-1">
                  Voice Providers
                </div>
              </div>
              <div className="text-center">
                <div className="stat-gradient">14</div>
                <div className="text-sm text-white/60 mt-1">Commerce Tools</div>
              </div>
              <div className="text-center">
                <div className="stat-gradient">100%</div>
                <div className="text-sm text-white/60 mt-1">TypeScript</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/docs/quick-start"
                className="btn btn-gradient btn-lg gap-2 px-8"
              >
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Get Started
                </span>
              </Link>
              <a
                href="https://github.com/lovekaizen/agentsea"
                className="btn btn-lg gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Divider */}
      <div className="divider-gradient"></div>

      {/* Key Features */}
      <section className="py-24 px-4 bg-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-gradient px-4 py-3 mb-4">01</span>
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-gradient">Key Features</span>
            </h2>
            <p className="text-lg text-base-content/70">
              Everything you need to build production-ready AI agents
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => (
              <Link
                key={index}
                href={feature.link || '#'}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-300 cursor-pointer hover:scale-105 card-gradient-hover group"
              >
                <div className="card-body items-center text-center relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-2xl group-hover:text-gradient transition-all">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Example */}
      <section className="bg-gradient-mesh py-24 px-4 relative overflow-hidden">
        <div className="orb orb-2"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="badge badge-gradient px-4 py-3 mb-4">02</span>
            <h2 className="text-5xl font-bold mb-6 text-white">
              Voice-Enabled AI in{' '}
              <span className="text-gradient-purple">5 Lines</span>
            </h2>
            <p className="text-xl text-white/70">
              AgentSea is the only framework with built-in voice support. Add
              STT/TTS to your agents instantly.
            </p>
          </div>
          <div className="flex justify-center mb-8">
            <div className="mockup-code shadow-2xl max-w-3xl w-full glow-purple">
              <pre data-prefix="1">
                <code>{`import { VoiceAgent, OpenAIWhisperProvider, OpenAITTSProvider } from '@lov3kaizen/agentsea-core';`}</code>
              </pre>
              <pre data-prefix="2">
                <code></code>
              </pre>
              <pre data-prefix="3">
                <code>{`const voiceAgent = new VoiceAgent(agent, {`}</code>
              </pre>
              <pre data-prefix="4">
                <code>{`  sttProvider: new OpenAIWhisperProvider(),`}</code>
              </pre>
              <pre data-prefix="5">
                <code>{`  ttsProvider: new OpenAITTSProvider({ voice: 'nova' }),`}</code>
              </pre>
              <pre data-prefix="6">
                <code>{`});`}</code>
              </pre>
              <pre data-prefix="7">
                <code></code>
              </pre>
              <pre data-prefix="8" className="text-success">
                <code>{`// Voice in → Voice out`}</code>
              </pre>
              <pre data-prefix="9">
                <code>{`const result = await voiceAgent.processVoice(audioFile, context);`}</code>
              </pre>
            </div>
          </div>
          <div className="text-center">
            <Link href="/docs/voice" className="btn btn-gradient btn-lg gap-2">
              <span className="flex items-center gap-2">
                Explore Voice Features
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="divider-gradient"></div>

      {/* All Features Grid */}
      <section className="py-24 px-4 bg-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-gradient px-4 py-3 mb-4">03</span>
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-gradient-blue">Everything</span> You Need
            </h2>
            <p className="text-lg text-base-content/70">
              A comprehensive ADK with batteries included
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-base-200 hover:bg-base-300 transition-all border border-base-300 card-gradient-hover group hover:scale-[1.02]"
              >
                <div className="card-body relative z-10">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-xl">{feature.title}</h3>
                  <p className="text-base-content/70 text-sm">
                    {feature.description}
                  </p>
                  {feature.link && (
                    <div className="card-actions mt-2">
                      <Link
                        href={feature.link}
                        className="link text-gradient-purple text-sm font-semibold hover:opacity-80"
                      >
                        Learn more →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Models Example */}
      <section className="bg-gradient-mesh py-24 px-4 relative overflow-hidden">
        <div className="orb orb-1"></div>
        <div className="orb orb-3"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="badge badge-gradient px-4 py-3 mb-4">04</span>
            <h2 className="text-5xl font-bold mb-6 text-white">
              Run <span className="text-gradient-cool">Everything</span> Locally
            </h2>
            <div className="text-xl text-white/70">
              Run LLMs and voice processing completely on your hardware. No
              cloud, no API costs, complete data control.
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <div className="mockup-code shadow-2xl max-w-3xl w-full glow-blue">
              <pre data-prefix="$">
                <code>{`npm install @lov3kaizen/agentsea-core`}</code>
              </pre>
              <pre data-prefix=">" className="text-success">
                <code>{`Everything runs locally - complete privacy`}</code>
              </pre>
              <pre data-prefix="1">
                <code>{`const privateAgent = new VoiceAgent(`}</code>
              </pre>
              <pre data-prefix="2">
                <code>{`  new Agent({ model: 'llama2', provider: 'ollama' }),`}</code>
              </pre>
              <pre data-prefix="3">
                <code>{`  { sttProvider: new LocalWhisperProvider() }`}</code>
              </pre>
              <pre data-prefix="4">
                <code>{`);`}</code>
              </pre>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/docs/local-models"
              className="btn btn-gradient btn-lg gap-2"
            >
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Run Locally
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="divider-gradient"></div>

      {/* Comparison */}
      <section className="py-24 px-4 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-gradient px-4 py-3 mb-4">05</span>
            <h2 className="text-5xl font-bold mb-4">
              Why Choose{' '}
              <span className="text-gradient-animated">AgentSea</span>?
            </h2>
            <p className="text-lg text-base-content/70">
              Built for developers who value simplicity and completeness
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-base-200 shadow-xl border-gradient rounded-2xl overflow-hidden">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-6">
                  <span className="text-gradient-blue">vs LangChain</span>
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="badge badge-gradient gap-2 px-3">+</span>
                    <span>Voice built-in (5 providers)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="badge badge-gradient gap-2 px-3">+</span>
                    <span>TypeScript-first (not a port)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="badge badge-gradient gap-2 px-3">+</span>
                    <span>CLI tool included</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="badge badge-gradient gap-2 px-3">+</span>
                    <span>Local models prioritised</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl border-gradient rounded-2xl overflow-hidden">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-6">
                  <span className="text-gradient-purple">
                    vs Building from Scratch
                  </span>
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="badge badge-gradient gap-2 px-3">+</span>
                    <span>Setup in 15 minutes (vs 1-2 days)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="badge badge-gradient gap-2 px-3">+</span>
                    <span>Save $75K-150K in Year 1</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="badge badge-gradient gap-2 px-3">+</span>
                    <span>Production ready Day 1</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="badge badge-gradient gap-2 px-3">+</span>
                    <span>Comprehensive docs included</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-mesh py-32 px-4 relative overflow-hidden">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="hero-content text-center max-w-4xl mx-auto relative z-10">
          <div className="space-y-8">
            <h2 className="text-6xl font-bold text-white">
              Ready to <span className="text-gradient-animated">Build</span>?
            </h2>
            <p className="text-2xl text-white/80">
              Start creating powerful voice-enabled AI agents today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/docs/quick-start"
                className="btn btn-gradient btn-lg gap-2 px-8"
              >
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Read the Documentation
                </span>
              </Link>
              <a
                href="https://github.com/lovekaizen/agentsea"
                className="btn btn-lg gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const keyFeatures = [
  {
    icon: '🎙️',
    title: 'Voice-First',
    description: 'Only framework with built-in TTS/STT',
    link: '/docs/voice',
  },
  {
    icon: '📘',
    title: 'TypeScript',
    description: 'Built from ground up in TypeScript',
    link: '/docs/quick-start',
  },
  {
    icon: '🛒',
    title: 'Commerce Ready',
    description: 'E-commerce with ACP protocol',
    link: '/docs/acp-integration',
  },
  {
    icon: '🌐',
    title: 'REST API',
    description: 'HTTP, SSE, and WebSocket',
    link: '/api',
  },
  {
    icon: '🏠',
    title: 'Complete Privacy',
    description: 'Run everything locally',
    link: '/docs/local-models',
  },
  {
    icon: '🛠️',
    title: 'CLI Tool',
    description: 'Get started in 60 seconds',
    link: '/docs/cli',
  },
];

const features = [
  {
    icon: '🎙️',
    title: 'Voice Support (TTS/STT)',
    description:
      '5 voice providers built-in: OpenAI Whisper, Local Whisper, OpenAI TTS, ElevenLabs, Piper TTS',
    link: '/docs/voice',
  },
  {
    icon: '🏠',
    title: 'Local Models',
    description:
      '6 local providers: Ollama, LM Studio, LocalAI, Text Generation WebUI, vLLM, and more',
    link: '/docs/local-models',
  },
  {
    icon: '🛠️',
    title: 'CLI Tool',
    description:
      'Interactive setup, chat, agent management, and model management in one command',
    link: '/docs/cli',
  },
  {
    icon: '🤖',
    title: 'Multi-Agent System',
    description:
      'Orchestrate multiple agents with sequential, parallel, and supervisor workflows',
    link: '/docs/workflows',
  },
  {
    icon: '⚡',
    title: '12+ Providers',
    description:
      'Support for Anthropic Claude, OpenAI GPT, Google Gemini, and 9 more providers',
    link: '/docs/providers',
  },
  {
    icon: '🔌',
    title: 'MCP Protocol',
    description:
      'First-class Model Context Protocol support with built-in Figma & n8n tools',
    link: '/docs/mcp-tools',
  },
  {
    icon: '🎨',
    title: 'Figma & n8n Integration',
    description:
      'Built-in tools for Figma designs and n8n workflow automation with retry logic',
    link: '/docs/mcp-tools',
  },
  {
    icon: '🛒',
    title: 'ACP Commerce Protocol',
    description:
      '14 commerce tools for product search, cart management, checkout, and secure payments',
    link: '/docs/acp-integration',
  },
  {
    icon: '✨',
    title: 'Content Formatting',
    description:
      'Format responses as text, with syntax highlighting and theming',
    link: '/docs/formatting',
  },
  {
    icon: '💾',
    title: 'Advanced Memory',
    description:
      'Buffer, Redis, and summary memory stores for context management',
    link: '/docs/memory',
  },
  {
    icon: '📊',
    title: 'Full Observability',
    description: 'Built-in logging, metrics, and distributed tracing',
    link: '/docs/observability',
  },
  {
    icon: '🌐',
    title: 'REST API & Streaming',
    description:
      'Built-in HTTP endpoints, Server-Sent Events (SSE), and WebSocket support',
    link: '/api',
  },
  {
    icon: '🏗️',
    title: 'NestJS Ready',
    description: 'First-class NestJS integration with decorators and modules',
    link: '/docs/nestjs',
  },
  {
    icon: '🚀',
    title: 'Production Ready',
    description: 'Rate limiting, caching, error handling, and retry logic',
  },
  {
    icon: '🔒',
    title: 'Complete Privacy',
    description:
      'Run everything locally - LLM, voice processing, and data storage',
  },
  {
    icon: '🏢',
    title: 'Multi-Tenancy',
    description:
      'Enterprise-grade tenant isolation, API key auth, quota management',
    link: '/docs/multi-tenancy',
  },
];
