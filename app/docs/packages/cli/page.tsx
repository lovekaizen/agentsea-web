import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-cli | AgentSea',
  description:
    'Command-line interface for the AgentSea ADK to set up providers, create agents, and chat or run them from a terminal.',
};

const pkg: PackageDoc = {
  slug: 'cli',
  name: '@lov3kaizen/agentsea-cli',
  summary:
    'Command-line interface for the AgentSea ADK to set up providers, create agents, and chat or run them from a terminal.',
  onNpm: true,
  install: 'npm install -g @lov3kaizen/agentsea-cli',
  example: {
    lang: 'BASH',
    code: `npm install -g @lov3kaizen/agentsea-cli
sea init                                   # interactive provider and agent setup
sea chat                                   # interactive chat with the default agent
sea agent run default "What is the capital of France?"
sea code                                   # coding agent with file and git tools`,
  },
  api: [
    { name: 'sea init', description: 'Sets up provider and agent configuration with interactive prompts.' },
    { name: 'sea chat', description: 'Starts an interactive chat session.' },
    {
      name: 'sea agent create | list | get <name> | run <name> <message> | default <name> | delete <name>',
      description: 'Manages agents and runs one with a message.',
    },
    {
      name: 'sea provider list | get | add | default | delete',
      description: 'Manages model providers.',
    },
    {
      name: 'sea code',
      description: 'Runs the coding agent, which has 13 file, search, shell and git tools.',
    },
  ],
  caveats: [
    'The installed command is sea. Use sea in every command.',
    'The model commands (list, pull, popular) work with Ollama only. Run ollama serve first.',
    'Setup steps are documented for Anthropic and Ollama only.',
    'Config is stored per operating system, for example ~/.config/agentsea-cli/config.json on Linux. API keys can also come from ANTHROPIC_API_KEY, OPENAI_API_KEY or GEMINI_API_KEY.',
  ],
};

export default function Page() {
  return <PackagePage pkg={pkg} />;
}
