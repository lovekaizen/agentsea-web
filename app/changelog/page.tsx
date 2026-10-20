import type { Metadata } from 'next';
import DocsShell from '../components/docs/DocsShell';
import BulletPanel from '../components/docs/BulletPanel';
import Callout from '../components/docs/Callout';

export const metadata: Metadata = {
  title: 'Changelog | AgentSea',
  description:
    'Changes in the v0.6.0 release notes, from agentic coding in the CLI to three new provider integrations.',
};

const toc = [{ id: 'v0-6-0', label: '0.6.0' }];

export default function ChangelogPage() {
  return (
    <DocsShell
      eyebrow="Changelog"
      title="Changelog"
      lead="Changes in the v0.6.0 release notes, from agentic coding in the CLI to three new provider integrations."
      active="changelog"
      toc={toc}
    >
      <p className="text-base leading-relaxed text-brand-navy">
        This page covers the v0.6.0 release notes. The current packages are at version 1.2.1.
      </p>

      <section id="v0-6-0" className="flex scroll-mt-8 flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-brand-tint px-3 py-[3px] font-mono text-xs font-semibold text-ink-eyebrow">
            0.6.0
          </span>
          <time dateTime="2026-02-09" className="text-sm text-ink-muted">
            2026-02-09
          </time>
        </div>

        <BulletPanel
          items={[
            'Agentic coding: the sea code command starts an interactive coding session with 13 built-in tools (file read, write and list; code_edit; glob; grep; shell_execute; and six git tools). It works with Anthropic, OpenAI, Gemini, Ollama, LM Studio and LocalAI.',
            'sea code accepts --agent, --provider, --model, --verbose and an iteration limit, set with --max-iterations.',
            'Model support: the types package adds Anthropic, OpenAI and Gemini model definitions, and the costs package adds pricing for 60+ models, including cache read and write prices.',
            'Three provider integrations: Mistral AI, DeepSeek and xAI, with config builders mistral(), deepseek() and xai().',
            'The core package exports the 13 coding tools. The release adds test suites for the new tools.',
          ]}
        />

        <Callout kind="warning">Breaking changes: None listed in the release notes.</Callout>
      </section>
    </DocsShell>
  );
}
