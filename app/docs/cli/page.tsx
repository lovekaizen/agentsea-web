import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function CLIPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="CLI Tool"
        titleGradient="cool"
        description="Interactive command-line interface for creating, managing, and testing AgentSea AI agents."
      />

      <div className="prose max-w-none">
        <AlertBox type="info">
          <h3 className="text-lg font-semibold mb-2">
            Built for Developer Productivity
          </h3>
          <div className="space-y-2">
            <p className="m-0">✅ Interactive setup wizard</p>
            <p className="m-0">✅ Real-time chat interface</p>
            <p className="m-0">✅ Agent management (CRUD operations)</p>
            <p className="m-0">✅ Model management (pull, list, info)</p>
            <p className="m-0">✅ Configuration persistence</p>
            <p className="m-0">✅ Voice support</p>
          </div>
        </AlertBox>

        <Section title="Installation" id="installation">
          <p>Install the AgentSea CLI globally with npm:</p>

          <CodeBlock language="bash">
            {`npm install -g @lov3kaizen/agentsea-cli
pnpm add -g @lov3kaizen/agentsea-cli
yarn global add @lov3kaizen/agentsea-cli
sea --version`}
          </CodeBlock>
        </Section>

        <Section title="Quick Start" id="quick-start">
          <p>Initialize AgentSea with the interactive setup wizard:</p>

          <CodeBlock language="bash">
            {`sea init
# The wizard will guide you through:
# 1. Choose your provider (Anthropic, OpenAI, Ollama, etc.)
# 2. Enter API key (if cloud provider)
# 3. Select default model
# 4. Configure voice providers (optional)
# 5. Save configuration`}
          </CodeBlock>

          <AlertBox type="success">
            <h4 className="text-lg font-semibold mb-2">Configuration</h4>
            <div className="space-y-2">
              <p className="m-0">Configuration is stored in:</p>
              <ul className="mt-2 mb-0 space-y-1">
                <li>
                  <strong>macOS:</strong>{' '}
                  <code>~/Library/Preferences/agentsea-cli</code>
                </li>
                <li>
                  <strong>Linux:</strong> <code>~/.config/agentsea-cli</code>
                </li>
                <li>
                  <strong>Windows:</strong> <code>%APPDATA%/agentsea-cli</code>
                </li>
              </ul>
            </div>
          </AlertBox>
        </Section>

        <Section title="Commands" id="commands">
          <h3>sea init</h3>
          <p>
            Interactive initialization wizard to set up AgentSea configuration.
          </p>

          <CodeBlock language="bash">
            {`sea init
Choose your provider: (Use arrow keys)
Anthropic (Claude)
OpenAI (GPT)
Google (Gemini)
Ollama (Local)
LM Studio (Local)
LocalAI (Local)
Enter your API key: ****
Choose default model: claude-sonnet-4-20250514
Configure voice? Yes
STT provider: openai-whisper
TTS provider: openai-tts
Configuration saved!`}
          </CodeBlock>

          <h3>sea chat</h3>
          <p>Start an interactive chat session with your agent.</p>

          <CodeBlock language="bash">
            {`sea chat
sea chat --agent my-assistant
sea chat --voice
sea chat --model llama3.2
AgentSea Chat (Type 'exit' to quit)
Hello! What can you help me with?
I'm a helpful AI assistant. I can help with:
- Answer questions
- Write code
- Analyze data
- Creative writing
- And much more!
Calculate 42 * 58
42 × 58 = 2,436`}
          </CodeBlock>

          <h3>sea agent</h3>
          <p>Manage your agents - create, list, get, delete, run.</p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Create an Agent</h4>
          <CodeBlock language="bash">
            {`sea agent create
sea agent create my-assistant \
  --provider anthropic \
  --model claude-sonnet-4-20250514 \
  --system-prompt "You are a helpful coding assistant" \
  --temperature 0.7 \
  --max-tokens 2048
sea agent create voice-assistant \
  --provider ollama \
  --model llama3.2 \
  --voice-stt openai-whisper \
  --voice-tts openai-tts`}
          </CodeBlock>

          <h4 className="text-lg font-semibold mt-6 mb-3">List Agents</h4>
          <CodeBlock language="bash">
            {`sea agent list
Available Agents:
================
my-assistant (default)
  Provider: anthropic
  Model: claude-sonnet-4-20250514
voice-assistant
  Provider: ollama
  Model: llama3.2
  Voice: OpenAI Whisper (STT) + OpenAI TTS (TTS)
code-reviewer
  Provider: openai
  Model: gpt-4-turbo-preview`}
          </CodeBlock>

          <h4 className="text-lg font-semibold mt-6 mb-3">Run an Agent</h4>
          <CodeBlock language="bash">
            {`sea agent run my-assistant "What is 42 * 58?"
sea agent run voice-assistant \
  --voice-input ./question.mp3 \
  --voice-output ./response.mp3
sea agent run my-assistant "Explain async/await" {'>'} explanation.txt`}
          </CodeBlock>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Other Agent Commands
          </h4>
          <CodeBlock language="bash">
            {`sea agent get my-assistant
sea agent delete my-assistant
sea agent default my-assistant`}
          </CodeBlock>

          <h3>sea model</h3>
          <p>Manage local models (works with Ollama).</p>

          <CodeBlock language="bash">
            {`sea model pull llama3.2
Pulling llama3.2...
████████████████████████████████ 100% (4.7 GB)
Model llama3.2 pulled successfully!
sea model list
Available Models:
================
llama3.2 (4.7 GB)
mistral (4.1 GB)
codellama (3.8 GB)
qwen2.5 (4.7 GB)
sea model info llama3.2
Model: llama3.2
Size: 4.7 GB
Parameters: 8B
Quantization: Q4_0
Family: LLaMA
License: Llama 3 Community License
sea model remove codellama`}
          </CodeBlock>

          <h3>sea provider</h3>
          <p>Manage provider configurations.</p>

          <CodeBlock language="bash">
            {`sea provider add anthropic --api-key sk-ant-...
sea provider list
Configured Providers:
====================
anthropic (Claude)
  API Key: sk-ant-****
  Default Model: claude-sonnet-4-20250514
ollama (Local)
  Base URL: http://localhost:11434
  Models: 4 installed
sea provider test anthropic
sea provider remove openai`}
          </CodeBlock>
        </Section>

        <Section title="Common Workflows" id="workflows">
          <h3>1. Quick Local Setup</h3>
          <CodeBlock language="bash">
            {`curl -fsSL https://ollama.com/install.sh | sh
sea init
# Select: Ollama (Local)
sea model pull llama3.2
sea chat
No API keys needed!
Complete privacy!
Zero costs!`}
          </CodeBlock>

          <h3>2. Create Voice-Enabled Assistant</h3>
          <CodeBlock language="bash">
            {`sea agent create voice-bot \
  --provider anthropic \
  --model claude-sonnet-4-20250514 \
  --voice-stt openai-whisper \
  --voice-tts openai-tts \
  --system-prompt "You are a voice assistant. Keep responses concise."
sea chat --agent voice-bot --voice
sea agent run voice-bot \
  --voice-input question.mp3 \
  --voice-output answer.mp3`}
          </CodeBlock>

          <h3>3. Multi-Agent Setup</h3>
          <CodeBlock language="bash">
            {`sea agent create researcher \
  --model claude-sonnet-4-20250514 \
  --system-prompt "Research and gather information"
sea agent create writer \
  --model gpt-4-turbo-preview \
  --system-prompt "Write clear, engaging content"
sea agent create coder \
  --provider ollama \
  --model codellama \
  --system-prompt "Write clean, efficient code"
sea agent run researcher "Latest AI trends"
sea agent run writer "Blog post about AI agents"
sea agent run coder "Python function for data validation"`}
          </CodeBlock>
        </Section>

        <Section title="Configuration File" id="configuration">
          <p>
            AgentSea stores configuration in JSON format. You can edit it
            directly if needed:
          </p>

          <CodeBlock language="json">
            {`{
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-****",
      "defaultModel": "claude-sonnet-4-20250514"
    },
    "ollama": {
      "baseUrl": "http://localhost:11434"
    }
  },
  "agents": {
    "my-assistant": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-20250514",
      "systemPrompt": "You are a helpful assistant.",
      "temperature": 0.7,
      "maxTokens": 2048
    },
    "local-agent": {
      "provider": "ollama",
      "model": "llama3.2",
      "temperature": 0.8
    }
  },
  "defaultAgent": "my-assistant",
  "voice": {
    "stt": {
      "provider": "openai-whisper",
      "apiKey": "sk-****"
    },
    "tts": {
      "provider": "openai-tts",
      "apiKey": "sk-****",
      "voice": "nova"
    }
  }
}`}
          </CodeBlock>
        </Section>

        <Section title="Tips & Best Practices" id="tips">
          <div className="space-y-4 my-6">
            <AlertBox type="info">
              <h4 className="font-semibold mb-2">Use Specialized Agents</h4>
              <p className="text-sm m-0">
                Create different agents for different tasks: code review,
                writing, data analysis, etc. Each can have optimized prompts and
                models.
              </p>
            </AlertBox>

            <AlertBox type="success">
              <h4 className="font-semibold mb-2">Mix Cloud & Local</h4>
              <p className="text-sm m-0">
                Use local models for development and simple tasks, cloud models
                for complex production work. Best of both worlds.
              </p>
            </AlertBox>

            <AlertBox type="warning">
              <h4 className="font-semibold mb-2">Keep Keys Secure</h4>
              <p className="text-sm m-0">
                The CLI stores API keys securely in your system config. Never
                commit them to version control.
              </p>
            </AlertBox>

            <AlertBox type="info">
              <h4 className="font-semibold mb-2">Voice Mode Tips</h4>
              <p className="text-sm m-0">
                Keep voice assistant prompts concise. Add "Respond in 2
                sentences max" for better voice UX. Users don't want to listen
                to long responses.
              </p>
            </AlertBox>
          </div>
        </Section>

        <Section title="Complete Examples" id="examples">
          <h3>Example 1: Local Development Setup</h3>
          <CodeBlock language="bash">
            {`curl -fsSL https://ollama.com/install.sh | sh
npm install -g @lov3kaizen/agentsea-cli
ollama pull llama3.2
sea init  # Choose Ollama
sea chat
# Start coding assistance with local AI
# No API costs, complete privacy!`}
          </CodeBlock>

          <h3>Example 2: Production Setup</h3>
          <CodeBlock>
            <pre data-prefix="$">
              <code>sea provider add anthropic --api-key sk-ant-***</code>
            </pre>
            <pre data-prefix="$">
              <code>sea provider add openai --api-key sk-***</code>
            </pre>
            <pre data-prefix=" ">
              <code></code>
            </pre>
            <pre data-prefix="$">
              <code>sea agent create prod-assistant \</code>
            </pre>
            <pre data-prefix=" ">
              <code> --provider anthropic \</code>
            </pre>
            <pre data-prefix=" ">
              <code> --model claude-sonnet-4-20250514 \</code>
            </pre>
            <pre data-prefix=" ">
              <code> --temperature 0.7 \</code>
            </pre>
            <pre data-prefix=" ">
              <code> --max-tokens 2048</code>
            </pre>
            <pre data-prefix=" ">
              <code></code>
            </pre>
            <pre data-prefix="$">
              <code>sea agent default prod-assistant</code>
            </pre>
            <pre data-prefix=" ">
              <code></code>
            </pre>
            <pre data-prefix="$">
              <code>
                sea agent run prod-assistant "Analyze this error log..."{' '}
                {'<'} error.log
              </code>
            </pre>
          </CodeBlock>

          <h3>Example 3: Voice Assistant</h3>
          <CodeBlock language="bash">
            {`sea init
# Configure voice providers when prompted
sea agent create jarvis \
  --provider anthropic \
  --voice-stt openai-whisper \
  --voice-tts openai-tts
sea chat --agent jarvis --voice
sea agent run jarvis \
  --voice-input ~/Desktop/question.mp3 \
  --voice-output ~/Desktop/answer.mp3`}
          </CodeBlock>
        </Section>

        <Section title="Next Steps" id="next-steps">
          <ul>
            <li>
              <Link href="/docs/voice">Voice Features</Link> - Learn more about
              voice capabilities
            </li>
            <li>
              <Link href="/docs/local-models">Local Models</Link> - Deep dive
              into local execution
            </li>
            <li>
              <Link href="/docs/agents">Agent Concepts</Link> - Understand agent
              architecture
            </li>
            <li>
              <Link href="/examples">View Examples</Link> - Complete CLI
              examples
            </li>
          </ul>

          <AlertBox type="success">
            <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
            <p className="m-0">
              Use <code>sea chat --voice</code> for a hands-free coding
              experience. Ask questions while looking at your code, get answers
              spoken back to you. Perfect for pair programming with AI!
            </p>
          </AlertBox>
        </Section>
      </div>
    </PageContainer>
  );
}
