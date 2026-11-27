import type { Metadata } from 'next';
import DocsShell from '../components/docs/DocsShell';
import BulletPanel from '../components/docs/BulletPanel';
import Callout from '../components/docs/Callout';
import { packageVersion } from '../components/docs/packageVersion';

export const metadata: Metadata = {
  title: 'Changelog | AgentSea',
  description:
    'Release notes for AgentSea 2.0.0, including its breaking changes, and the 0.6.0 release notes.',
};

const toc = [
  { id: 'v2-0-0', label: '2.0.0' },
  { id: 'v0-6-0', label: '0.6.0' },
];

export default function ChangelogPage() {
  const current = packageVersion('@lov3kaizen/agentsea-core');

  return (
    <DocsShell
      eyebrow="Changelog"
      title="Changelog"
      lead="Release notes for AgentSea 2.0.0, with its breaking changes first, followed by the 0.6.0 release notes."
      active="changelog"
      toc={toc}
    >
      <p className="text-base leading-relaxed text-brand-navy">
        This page covers the 2.0.0 release notes and the 0.6.0 release notes. The current packages
        are at version {current}.
      </p>

      <section id="v2-0-0" className="flex scroll-mt-8 flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-brand-tint px-3 py-[3px] font-mono text-xs font-semibold text-ink-eyebrow">
            2.0.0
          </span>
          <time dateTime="2026-11-23" className="text-sm text-ink-muted">
            2026-11-23
          </time>
        </div>

        <Callout kind="warning">
          Three breaking changes and one behaviour change are listed below. Read them before you
          upgrade, and set every <code className="mx-1 font-mono">@lov3kaizen/agentsea-*</code>
          package you use to 2.0.0 together.
        </Callout>

        <BulletPanel
          items={[
            <>
              <strong>Breaking, MCP stdio environment.</strong> Stdio servers no longer inherit the
              whole parent environment. They get a default allow-list of variables such as{' '}
              <code>HOME</code>, <code>PATH</code> and the proxy settings, plus any name listed in{' '}
              <code>passEnv</code> and the explicit <code>env</code> map. Provider API keys in the
              parent environment are no longer visible to MCP servers. Name the variables a server
              needs in <code>passEnv</code>. <code>inheritFullEnv: true</code> restores the old
              behaviour for now, with a deprecation warning.
            </>,
            <>
              <strong>Breaking, Anthropic sampling parameters.</strong> The{' '}
              <code>AnthropicProvider</code> in <code>@lov3kaizen/agentsea-gateway</code> no longer
              sends <code>temperature</code> or <code>top_p</code>. Anthropic removes them, and its
              API returns a 400 error when they are sent. Remove them from your config and steer the
              model through the prompt. <code>top_k</code> was never sent and is unchanged. The{' '}
              <code>AnthropicProvider</code> in <code>@lov3kaizen/agentsea-core</code> still sends{' '}
              <code>temperature</code> to models that accept it, and leaves it out for the Opus 4.7+
              and Fable 5 families.
            </>,
            <>
              <strong>Breaking, retired OpenAI model IDs.</strong> The IDs that OpenAI has retired or
              is retiring are removed from the model registries, pricing tables, capability maps and
              the OpenAI provider&apos;s default list. Lookups for them return <code>undefined</code>,
              and they are no longer part of the <code>OpenAIModel</code> type. Removed IDs include{' '}
              <code>o1</code>, <code>o3-mini</code>, <code>o4-mini</code>, <code>gpt-4-turbo</code>,{' '}
              <code>gpt-3.5-turbo</code>, <code>gpt-5</code>, <code>gpt-5-mini</code>,{' '}
              <code>gpt-5-nano</code>, <code>gpt-5-pro</code>, <code>o3</code>, <code>o3-pro</code>,{' '}
              <code>gpt-image-1</code> and the dated <code>gpt-4o</code> snapshots. OpenAI names{' '}
              <code>gpt-6.1-sol</code> as the replacement for <code>gpt-5</code>,{' '}
              <code>gpt-5-pro</code>, <code>o3</code> and <code>o3-pro</code>, and{' '}
              <code>gpt-6-luna</code> for <code>gpt-5-nano</code>. <code>gpt-5.5</code> and{' '}
              <code>gpt-5.4-mini</code> are unchanged.
            </>,
            <>
              <strong>Behaviour change, default Anthropic model.</strong> The default is now{' '}
              <code>claude-opus-5-5</code>, which was <code>claude-opus-4-8</code>. Pin{' '}
              <code>claude-opus-4-8</code> explicitly if your agents relied on the old default.
            </>,
          ]}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Other changes in 2.0.0</h3>
        <BulletPanel
          items={[
            'New models: claude-opus-5-5, claude-sonnet-5-5 and claude-haiku-5-5 are added to the typed registries, with prices and context windows in the costs and cache packages. Retired models are flagged with deprecated: true and their retirement dates.',
            "MCP client: speaks protocol 2026-07-28. New transport option, transport: 'http' (Streamable HTTP), set with url. A tool result marked input_required rejects with MCPInputRequiredError. The multi-round request flow (MRTR) is not implemented yet.",
            'MCP errors and timeouts: JSON-RPC errors reject with MCPProtocolError, keeping the numeric code. A request that times out rejects with MCPTimeoutError and is cancelled. requestTimeoutMs sets the wait, which defaults to 30 seconds.',
            'MCP sessions: Streamable HTTP carries the Mcp-Session-Id a server assigns and sends a best-effort DELETE on disconnect. Re-initializing after a session expires is not implemented yet, so after a 404 the next request fails until you reconnect.',
            'Fixes: a connection that drops during the legacy initialize handshake fails connect() with a clear error, not a TypeError. Stdio stderr emits a stderr event instead of error, and request timers no longer keep the process alive.',
          ]}
        />
        <p className="text-sm leading-relaxed text-ink-muted">
          Per-package history is in each package&apos;s <code>CHANGELOG.md</code> in the{' '}
          <a
            href="https://github.com/lovekaizen/agentsea"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-deep hover:underline"
          >
            AgentSea repository
          </a>
          . The core and gateway changelogs describe the MCP and Anthropic changes in full.
        </p>
      </section>

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
