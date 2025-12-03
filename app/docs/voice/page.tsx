import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function VoicePage() {
  return (
    <PageContainer maxWidth="5xl">
      {/* Header */}
      <PageHeader
        title="Voice Features (TTS/STT)"
        titleGradient="purple"
        description="Complete guide to building voice-enabled AI agents with Text-to-Speech
          (TTS) and Speech-to-Text (STT)."
      />

      {/* Overview */}
      <Section title="Overview" id="overview">
        <p className="text-base-content/70">
          AgentSea ADK includes comprehensive voice support for building
          voice-enabled AI agents:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base-content/70">
          <li>
            <strong>Speech-to-Text (STT)</strong> - Transcribe audio to text
          </li>
          <li>
            <strong>Text-to-Speech (TTS)</strong> - Synthesize speech from text
          </li>
          <li>
            <strong>Voice Agent</strong> - Wrapper that combines both for voice
            conversations
          </li>
          <li>
            <strong>Multiple Providers</strong> - Cloud and local options
          </li>
          <li>
            <strong>Streaming</strong> - Real-time audio streaming
          </li>
          <li>
            <strong>Multiple Languages</strong> - Support for 99+ languages
          </li>
        </ul>

        <AlertBox type="info">
          <div>
            <h3 className="font-bold text-lg mb-2">
              5 Voice Providers Included
            </h3>
            <p className="mb-2">
              <strong>STT Providers:</strong> OpenAI Whisper (cloud), Local
              Whisper (privacy)
            </p>
            <p>
              <strong>TTS Providers:</strong> OpenAI TTS, ElevenLabs, Piper TTS
              (local)
            </p>
          </div>
        </AlertBox>
      </Section>

      {/* Speech-to-Text */}
      <Section title="Speech-to-Text (STT)" id="speech-to-text">
        <h3 className="text-2xl font-semibold mb-4">OpenAI Whisper (Cloud)</h3>
        <p className="text-base-content/70 mb-4">
          High-quality transcription with OpenAI's Whisper model - supports 99+
          languages with word-level timestamps.
        </p>

        <CodeBlock language="typescript">
          {`import { OpenAIWhisperProvider } from '@lov3kaizen/agentsea-core';

const sttProvider = new OpenAIWhisperProvider(process.env.OPENAI_API_KEY);

// Transcribe audio file
const result = await sttProvider.transcribe('./audio.mp3', {
  model: 'whisper-1',
  language: 'en',
  responseFormat: 'verbose_json',
});

console.log('Text:', result.text);
console.log('Language:', result.language);
console.log('Duration:', result.duration);`}
        </CodeBlock>

        <h3 className="text-2xl font-semibold mb-4 mt-8">
          Local Whisper (Privacy)
        </h3>
        <p className="text-base-content/70 mb-4">
          Run Whisper locally for complete privacy - your audio never leaves
          your machine.
        </p>

        <CodeBlock language="typescript">
          {`import { LocalWhisperProvider } from '@lov3kaizen/agentsea-core';

const sttProvider = new LocalWhisperProvider({
  whisperPath: '/usr/local/bin/whisper',
  modelPath: '/path/to/ggml-base.bin',
});

// Check if installed
if (!(await sttProvider.isInstalled())) {
  console.log(sttProvider.getInstallInstructions());
  return;
}

const result = await sttProvider.transcribe('./audio.wav', {
  model: 'base',
  language: 'en',
});`}
        </CodeBlock>
      </Section>

      {/* Text-to-Speech */}
      <Section title="Text-to-Speech (TTS)" id="text-to-speech">
        <h3 className="text-2xl font-semibold mb-4">OpenAI TTS</h3>
        <p className="text-base-content/70 mb-4">
          High-quality voices with streaming support - 6 voices available.
        </p>

        <CodeBlock language="typescript">
          {`import { OpenAITTSProvider } from '@lov3kaizen/agentsea-core';
import { writeFileSync } from 'fs';

const ttsProvider = new OpenAITTSProvider(process.env.OPENAI_API_KEY);

// Synthesize speech
const result = await ttsProvider.synthesize('Hello, world!', {
  model: 'tts-1-hd',
  voice: 'nova',
  speed: 1.0,
  format: 'mp3',
});

// Save audio
writeFileSync('./output.mp3', result.audio);`}
        </CodeBlock>

        <h3 className="text-2xl font-semibold mb-4 mt-8">
          ElevenLabs (Premium)
        </h3>
        <p className="text-base-content/70 mb-4">
          Studio-quality synthesis with voice cloning and 100+ premium voices.
        </p>

        <CodeBlock language="typescript">
          {`import { ElevenLabsTTSProvider } from '@lov3kaizen/agentsea-core';

const ttsProvider = new ElevenLabsTTSProvider(process.env.ELEVENLABS_API_KEY);

// List available voices
const voices = await ttsProvider.getVoices();
console.log('Available voices:', voices.length);

// Use a specific voice
const result = await ttsProvider.synthesize('Hello, world!', {
  voice: 'EXAVITQu4vr4xnSDxMaL', // Sarah voice ID
  model: 'eleven_multilingual_v2',
  stability: 0.5,
  similarityBoost: 0.75,
});`}
        </CodeBlock>

        <h3 className="text-2xl font-semibold mb-4 mt-8">Piper TTS (Local)</h3>
        <p className="text-base-content/70 mb-4">
          Fast neural synthesis running locally - complete privacy with no API
          costs.
        </p>

        <CodeBlock language="typescript">
          {`import { PiperTTSProvider } from '@lov3kaizen/agentsea-core';

const ttsProvider = new PiperTTSProvider({
  piperPath: '/usr/local/bin/piper',
  modelPath: '/path/to/en_US-lessac-medium.onnx',
});

// Check installation
if (!(await ttsProvider.isInstalled())) {
  console.log(ttsProvider.getInstallInstructions());
  return;
}

const result = await ttsProvider.synthesize('Hello, world!', {
  voice: 'lessac',
  speakerId: 0,
});`}
        </CodeBlock>
      </Section>

      {/* Voice Agent */}
      <Section title="Voice Agent" id="voice-agent">
        <p className="text-base-content/70 mb-4">
          The <code>VoiceAgent</code> class wraps a regular Agent with STT and
          TTS providers for complete voice interactions. It handles the full
          pipeline: audio input → transcription → agent processing → speech
          synthesis → audio output.
        </p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  AnthropicProvider,
  VoiceAgent,
  OpenAIWhisperProvider,
  OpenAITTSProvider,
  ToolRegistry,
  BufferMemory,
} from '@lov3kaizen/agentsea-core';

// Create base agent
const agent = new Agent(
  {
    name: 'voice-assistant',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: 'You are a helpful voice assistant. Keep responses concise.',
  },
  new AnthropicProvider(),
  new ToolRegistry(),
  new BufferMemory(50)
);

// Wrap with voice capabilities
const voiceAgent = new VoiceAgent(agent, {
  sttProvider: new OpenAIWhisperProvider(process.env.OPENAI_API_KEY),
  ttsProvider: new OpenAITTSProvider(process.env.OPENAI_API_KEY),
  ttsConfig: { voice: 'nova', model: 'tts-1' },
  autoSpeak: true, // Automatically synthesize responses
});`}
        </CodeBlock>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices" id="best-practices">
        <div className="space-y-4">
          <AlertBox type="info">
            <div>
              <h4 className="font-semibold mb-2">Voice-Optimized Prompts</h4>
              <p>
                Keep responses concise for voice. Add "Keep responses under 2
                sentences" to your system prompt.
              </p>
            </div>
          </AlertBox>

          <AlertBox type="warning">
            <div>
              <h4 className="font-semibold mb-2">Audio Format</h4>
              <p>
                Use MP3 for storage (smaller), WAV for processing (better
                quality). Most providers accept both.
              </p>
            </div>
          </AlertBox>

          <AlertBox type="success">
            <div>
              <h4 className="font-semibold mb-2">Privacy First</h4>
              <p>
                Use local providers (Local Whisper + Piper TTS + Ollama) for
                sensitive data. No data leaves your machine.
              </p>
            </div>
          </AlertBox>
        </div>
      </Section>

      {/* Next Steps */}
      <Section title="Next Steps" id="next-steps">
        <ul className="list-disc list-inside space-y-2">
          <li>
            <Link href="/docs/local-models" className="link link-primary">
              Learn about Local Models
            </Link>{' '}
            - Run everything locally
          </li>
          <li>
            <Link href="/docs/cli" className="link link-primary">
              Try the CLI Tool
            </Link>{' '}
            - Interactive voice setup
          </li>
          <li>
            <Link href="/docs/providers" className="link link-primary">
              Explore All Providers
            </Link>{' '}
            - 12+ LLM providers
          </li>
          <li>
            <Link href="/examples" className="link link-primary">
              View Examples
            </Link>{' '}
            - Complete voice examples
          </li>
        </ul>
      </Section>
    </PageContainer>
  );
}
