import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'Voice | AgentSea',
  description:
    'Speech-to-text and text-to-speech providers, and a VoiceAgent that places an agent between them.',
};

const toc = [
  { id: 'stt-providers', label: 'Speech-to-text providers' },
  { id: 'tts-providers', label: 'Text-to-speech providers' },
  { id: 'synthesize', label: 'Synthesize speech' },
  { id: 'streaming-speech', label: 'Streaming speech' },
  { id: 'voice-agent', label: 'VoiceAgent' },
  { id: 'voice-agent-methods', label: 'VoiceAgent methods' },
  { id: 'audio-input', label: 'Audio input' },
];

export default function VoicePage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="Voice"
      lead="Speech-to-text and text-to-speech providers, and a VoiceAgent that places an agent between them."
      active="guides"
      toc={toc}
    >
      <DocSection id="stt-providers" num="01" title="Speech-to-text providers">
        <p className="text-base leading-relaxed text-brand-navy">
          Each provider has a <code>transcribe</code> method. The OpenAI classes accept an API key as a string, or a
          config object with <code>apiKey</code> and <code>baseURL</code>.
        </p>
        <BulletPanel
          items={[
            <>
              <code>OpenAIWhisperProvider</code>: the OpenAI Whisper API.
            </>,
            <>
              <code>LemonFoxSTTProvider</code>: LemonFox transcription, which uses the OpenAI-compatible API.
            </>,
            <>
              <code>LocalWhisperProvider</code>: runs a whisper binary on your machine. Takes <code>whisperPath</code>{' '}
              and <code>modelPath</code>. <code>whisperPath</code> defaults to <code>whisper</code>.
            </>,
          ]}
        />
        <CodeBlock
          lang="TS"
          code={`import { OpenAIWhisperProvider } from '@lov3kaizen/agentsea-core';

const stt = new OpenAIWhisperProvider(process.env.OPENAI_API_KEY);

const result = await stt.transcribe('./audio.mp3', {
  model: 'whisper-1',
  language: 'en',
});
console.log(result.text);`}
        />
        <Callout kind="note">
          <code>transcribe()</code> takes a file path and options such as <code>model</code> and{' '}
          <code>language</code>.
        </Callout>
      </DocSection>

      <DocSection id="tts-providers" num="02" title="Text-to-speech providers">
        <BulletPanel
          items={[
            <>
              <code>OpenAITTSProvider</code>: OpenAI speech. Accepts an API key string or an{' '}
              <code>OpenAITTSConfig</code> object.
            </>,
            <>
              <code>LemonFoxTTSProvider</code>: LemonFox speech, using the OpenAI-compatible API.
            </>,
            <>
              <code>ElevenLabsTTSProvider</code>: ElevenLabs. Takes an <code>apiKey</code>.{' '}
              <code>getVoices()</code> lists the voices.
            </>,
            <>
              <code>PiperTTSProvider</code>: runs a piper binary with a local <code>.onnx</code> voice model. Takes{' '}
              <code>piperPath</code>, <code>modelPath</code> and <code>configPath</code>.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="synthesize" num="03" title="Synthesize speech">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>synthesize(text, config?)</code> returns a result that holds the audio. Write the audio to a file or
          send it to a client.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { writeFileSync } from 'node:fs';
import { OpenAITTSProvider } from '@lov3kaizen/agentsea-core';

const tts = new OpenAITTSProvider(process.env.OPENAI_API_KEY);

const result = await tts.synthesize('Hello, world!', { voice: 'nova', format: 'mp3' });
writeFileSync('./output.mp3', result.audio);`}
        />
        <Callout kind="note">Audio comes back as <code>result.audio</code>. Use <code>format</code> to choose the file type.</Callout>
      </DocSection>

      <DocSection id="streaming-speech" num="04" title="Streaming speech">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>OpenAITTSProvider.synthesizeStream(text, config?)</code> is an async generator that yields audio
          chunks. Send each chunk as it arrives.
        </p>
        <CodeBlock
          lang="TS"
          code={`for await (const chunk of tts.synthesizeStream('A longer passage to read aloud.')) {
  // Each chunk is a Buffer of audio.
  console.log('chunk size:', chunk.length);
}`}
        />
      </DocSection>

      <DocSection id="voice-agent" num="05" title="VoiceAgent">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>VoiceAgent</code> wraps an <code>Agent</code> with an STT provider and a TTS provider. The constructor
          takes the agent and a config with <code>sttProvider</code>, <code>ttsProvider</code>,{' '}
          <code>ttsConfig</code>, <code>sttConfig</code> and <code>autoSpeak</code>. The agent and the context are
          built as in the other guides, and <code>audioBuffer</code> is a Buffer of recorded audio.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { OpenAITTSProvider, OpenAIWhisperProvider, VoiceAgent } from '@lov3kaizen/agentsea-core';

const voiceAgent = new VoiceAgent(agent, {
  sttProvider: new OpenAIWhisperProvider(process.env.OPENAI_API_KEY),
  ttsProvider: new OpenAITTSProvider(process.env.OPENAI_API_KEY),
  ttsConfig: { voice: 'nova' },
  autoSpeak: true,
});

const result = await voiceAgent.processVoice(audioBuffer, context);
console.log(result.text, result.response.content);`}
        />
        <Callout kind="note">
          <code>processVoice</code> returns <code>text</code>, <code>response</code> and <code>audio</code>.
        </Callout>
      </DocSection>

      <DocSection id="voice-agent-methods" num="06" title="VoiceAgent methods">
        <BulletPanel
          items={[
            <>
              <code>processVoice(audio, context)</code>: transcribes the audio, runs the agent, and speaks the reply
              when <code>autoSpeak</code> is on.
            </>,
            <>
              <code>speak(text, context)</code>: runs the agent on text and returns the spoken reply.
            </>,
            <>
              <code>transcribe(audio)</code>: returns text without running the agent.
            </>,
            <>
              <code>synthesize(text)</code> and <code>synthesizeStream(text)</code>: speech from text.
            </>,
            <>
              <code>setTTSConfig()</code> and <code>setSTTConfig()</code> change settings after construction.{' '}
              <code>setAutoSpeak()</code> changes the auto-speak setting.
            </>,
            <>
              <code>getHistory()</code>, <code>clearHistory()</code> and <code>exportConversation(outputDir)</code>:
              read, clear or export the conversation.
            </>,
            <>
              <code>supportsStreaming()</code>: reports which parts can stream.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="audio-input" num="07" title="Audio input">
        <p className="text-base leading-relaxed text-brand-navy">
          Unsupported audio formats fail. Convert the file first, for example with ffmpeg.
        </p>
        <CodeBlock lang="BASH" code="ffmpeg -i input.m4a -ar 16000 output.wav" />
      </DocSection>
    </DocsShell>
  );
}
