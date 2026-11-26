import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-types | AgentSea',
  description: 'Shared TypeScript type definitions for the AgentSea ADK.',
};

const pkg: PackageDoc = {
  slug: 'types',
  name: '@lov3kaizen/agentsea-types',
  summary: 'Shared TypeScript type definitions for the AgentSea ADK.',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-types',
  example: {
    lang: 'TS',
    code: `import type { Message, Tool, LLMProvider, Tenant } from '@lov3kaizen/agentsea-types';

const greeting: Message = { role: 'user', content: 'Hello' };`,
  },
  api: [
    {
      name: 'Message',
      description:
        "A chat message: role ('system', 'user', 'assistant' or 'tool'), content, optional name and toolCallId.",
    },
    {
      name: 'Tool',
      description: 'A tool with name, description, zod parameters and an execute function.',
    },
    {
      name: 'LLMProvider',
      description: 'Provider contract: generateResponse, optional streamResponse, parseToolCalls.',
    },
    {
      name: 'Tenant and TenantContext',
      description:
        'Multi-tenant types: Tenant, TenantStatus, TenantSettings, TenantContext, TenantApiKey, TenantQuota.',
    },
    {
      name: 'STTProvider and TTSProvider',
      description: 'Speech-to-text and text-to-speech provider types, with STTConfig, TTSConfig and VoiceAgentConfig.',
    },
  ],
  caveats: [
    'The package has no README. Its exports are listed from its entry file.',
    'No install instructions are documented. The install command follows the package name.',
    'Voice types use Buffer and NodeJS.ReadableStream, so Node type definitions are needed.',
    'ProviderConfig.thinking and effort are ignored by providers that do not support them.',
  ],
};

export default function Page() {
  return <PackagePage pkg={pkg} />;
}
