import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'CLI coding | AgentSea',
  description: 'Start an interactive coding session in a project directory with the sea code command.',
};

const toc = [
  { id: 'command-name', label: 'Command name' },
  { id: 'before-start', label: 'Before you start' },
  { id: 'start-session', label: 'Start a session' },
  { id: 'session-tools', label: 'Tools the session loads' },
  { id: 'guidelines', label: 'Guidelines the agent receives' },
  { id: 'agents-providers', label: 'Agents and providers' },
  { id: 'chat', label: 'Chat' },
];

export default function CliCodingPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="CLI coding"
      lead="Start an interactive coding session in a project directory with the sea code command."
      active="guides"
      toc={toc}
    >
      <DocSection id="command-name" num="01" title="Command name">
        <p className="text-base leading-relaxed text-brand-navy">
          The command is <code>sea</code>. The commands on this page use <code>sea</code>.
        </p>
        <Callout kind="note">Options are as defined in the CLI source.</Callout>
      </DocSection>

      <DocSection id="before-start" num="02" title="Before you start">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>sea code</code> needs a default agent, or an agent named with <code>--agent</code>.{' '}
          <code>sea init</code> sets up a provider, an API key and a default agent. Without one, <code>sea code</code>{' '}
          stops and prints a hint to run <code>sea init</code>.
        </p>
        <CodeBlock lang="BASH" code={`sea init\nsea agent list\nsea provider list`} />
      </DocSection>

      <DocSection id="start-session" num="03" title="Start a session">
        <p className="text-base leading-relaxed text-brand-navy">
          The session prints the working directory when it starts. It uses the directory where you ran the command.
        </p>
        <BulletPanel
          items={[
            <>
              <code>-a, --agent &lt;name&gt;</code>: the agent to use.
            </>,
            <>
              <code>-p, --provider &lt;name&gt;</code>: overrides the agent's provider.
            </>,
            <>
              <code>-m, --model &lt;name&gt;</code>: overrides the agent's model.
            </>,
            <>
              <code>-v, --verbose</code>: shows tool calls and metadata.
            </>,
            <>
              <code>--max-iterations &lt;number&gt;</code>: the cap on agent iterations. The default is 25.
            </>,
          ]}
        />
        <CodeBlock lang="BASH" code={`cd ~/Projects/my-app\nsea code --agent coder --verbose`} />
      </DocSection>

      <DocSection id="session-tools" num="04" title="Tools the session loads">
        <p className="text-base leading-relaxed text-brand-navy">
          The session registers these tools: <code>file_read</code>, <code>file_write</code>, <code>file_list</code>,{' '}
          <code>shell_execute</code>, <code>code_edit</code>, <code>glob</code>, <code>grep</code>,{' '}
          <code>git_status</code>, <code>git_diff</code>, <code>git_add</code>, <code>git_commit</code>,{' '}
          <code>git_log</code> and <code>git_branch</code>.
        </p>
        <Callout kind="warning">
          The agent can write files and run shell commands in the directory where the session started. The system
          prompt says <code>shell_execute</code> has safety checks. Review changes with <code>git_diff</code>, and
          start from a clean git state so you can revert.
        </Callout>
      </DocSection>

      <DocSection id="guidelines" num="05" title="Guidelines the agent receives">
        <p className="text-base leading-relaxed text-brand-navy">The session's system prompt asks the agent to:</p>
        <BulletPanel
          items={[
            'Read files before editing them.',
            'Use code_edit for precise changes instead of rewriting files.',
            'Use glob and grep to find code before changing it.',
            'Check each change with git_diff.',
            'Make small, focused edits.',
          ]}
        />
      </DocSection>

      <DocSection id="agents-providers" num="06" title="Agents and providers">
        <p className="text-base leading-relaxed text-brand-navy">
          Set up the agents and providers the session will use. These commands are in the CLI reference.
        </p>
        <CodeBlock
          lang="BASH"
          code={`sea provider add\nsea agent create\nsea model list -p ollama\nsea model pull codellama -p ollama\nsea agent run coder "Summarize the TODO comments in this project"`}
        />
      </DocSection>

      <DocSection id="chat" num="07" title="Chat">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>sea chat</code> starts a chat session. It accepts <code>--agent</code>, <code>--stream</code> and{' '}
          <code>--format</code> (<code>text</code>, <code>markdown</code> or <code>html</code>).
        </p>
        <CodeBlock lang="BASH" code="sea chat --agent coder --stream --format markdown" />
      </DocSection>
    </DocsShell>
  );
}
