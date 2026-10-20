import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Agentic coding | AgentSea',
  description:
    'Launch an interactive AI coding session with 13 built-in tools: file operations, code editing, search, shell, and git.',
};

const toc = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'command-options', label: 'Command options' },
  { id: 'built-in-tools', label: 'Built-in tools' },
  { id: 'provider-support', label: 'Provider support' },
  { id: 'next-steps', label: 'Next steps' },
];

const linkClass = 'text-brand-ocean underline-offset-2 hover:underline';

export default function AgenticCodingPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="Agentic coding"
      lead="Launch an interactive AI coding session with 13 built-in tools: file operations, code editing, search, shell, and git."
      active="guides"
      toc={toc}
    >
      <DocSection id="getting-started" num="01" title="Getting started">
        <p className="text-base leading-relaxed text-brand-navy">
          Install the AgentSea CLI globally, then start a coding session:
        </p>
        <CodeBlock lang="BASH" code={`npm install -g @lov3kaizen/agentsea-cli\n\n# Start an interactive agentic coding session\nsea code`} />
        <Callout kind="note">
          The <code>sea code</code> command starts an interactive agentic coding session. The coding agent follows
          best practices: it reads files before editing, uses precise edits over rewrites, and verifies changes with
          git diff.
        </Callout>
      </DocSection>

      <DocSection id="command-options" num="02" title="Command options">
        <p className="text-base leading-relaxed text-brand-navy">
          Override the provider or model, enable verbose output, or limit the number of tool iterations:
        </p>
        <CodeBlock
          lang="BASH"
          code={`# Start an agentic coding session with the default agent
sea code

# Use a specific provider/model
sea code --provider anthropic --model claude-sonnet-4-6

# Verbose mode with tool calls and metadata
sea code --verbose

# Limit tool iterations (default: 25)
sea code --max-iterations 50`}
        />
      </DocSection>

      <DocSection id="built-in-tools" num="03" title="Built-in tools">
        <p className="text-base leading-relaxed text-brand-navy">
          The coding agent has access to 13 built-in tools, grouped into five categories:
        </p>
        <ApiList>
          <ApiRow name="file_read">File operations: read file contents.</ApiRow>
          <ApiRow name="file_write">File operations: write content to files.</ApiRow>
          <ApiRow name="file_list">File operations: list directory contents.</ApiRow>
          <ApiRow name="code_edit">Code editing: precise search-and-replace editing.</ApiRow>
          <ApiRow name="glob">Search: find files matching glob patterns.</ApiRow>
          <ApiRow name="grep">Search: search file contents with regex.</ApiRow>
          <ApiRow name="shell_execute">Shell: run shell commands, with safety checks.</ApiRow>
          <ApiRow name="git_status">Git: show working tree status.</ApiRow>
          <ApiRow name="git_diff">Git: show changes between commits.</ApiRow>
          <ApiRow name="git_add">Git: stage files for commit.</ApiRow>
          <ApiRow name="git_commit">Git: create a commit.</ApiRow>
          <ApiRow name="git_log">Git: show commit history.</ApiRow>
          <ApiRow name="git_branch">Git: list or create branches.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="provider-support" num="04" title="Provider support">
        <p className="text-base leading-relaxed text-brand-navy">
          Agentic coding works with any provider. Use a cloud provider such as Anthropic, OpenAI, or Gemini, or run
          entirely locally with Ollama, LM Studio, or LocalAI.
        </p>
        <CodeBlock
          lang="BASH"
          code={`# Anthropic (Claude)
sea code --provider anthropic --model claude-sonnet-4-6

# OpenAI (GPT)
sea code --provider openai

# Google (Gemini)
sea code --provider gemini

# Local (Ollama)
sea code --provider ollama`}
        />
        <Callout kind="note">
          Mix cloud and local providers across sessions: use local models for quick iterations and cloud models for
          complex production work.
        </Callout>
      </DocSection>

      <DocSection id="next-steps" num="05" title="Next steps">
        <BulletPanel
          items={[
            <>
              <Link href="/docs/cli" className={linkClass}>
                CLI tool
              </Link>{' '}
              : full command reference for the AgentSea CLI
            </>,
            <>
              <Link href="/docs/tools" className={linkClass}>
                Tools
              </Link>{' '}
              : learn more about built-in and custom tools
            </>,
            <>
              <Link href="/docs/providers" className={linkClass}>
                Providers
              </Link>{' '}
              : configure cloud and local providers
            </>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
