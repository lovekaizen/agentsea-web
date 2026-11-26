import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-admin-ui | AgentSea',
  description: 'Self-hosted web interface for creating and managing AI agents, workflows, tools and providers.',
};

const pkg: PackageDoc = {
  slug: 'admin-ui',
  name: '@lov3kaizen/agentsea-admin-ui',
  summary: 'Self-hosted web interface for creating and managing AI agents, workflows, tools and providers.',
  onNpm: false,
  install: `# From the root of the agentsea repository
cd packages/admin-ui
pnpm install`,
  installNote: 'Not published to npm. Run it from a clone of the agentsea repository.',
  example: {
    lang: 'BASH',
    code: `cd packages/admin-ui
pnpm install
pnpm dev        # then open http://localhost:3000`,
  },
  api: [
    {
      name: 'DATABASE_PATH',
      description: 'Sets the SQLite database path in .env.local; defaults to .agentsea/admin.db.',
    },
    {
      name: 'pnpm dev / pnpm build / pnpm start',
      description: 'Runs the app in development, builds it, or starts the built app.',
    },
    {
      name: 'pnpm db:generate / db:migrate / db:studio',
      description: 'Generates and runs database migrations, or opens the database studio.',
    },
    {
      name: 'app/workflows, app/agents, app/tools, app/providers',
      description: 'Routes for the workflow builder, agents, tools and provider settings.',
    },
    {
      name: 'app/playground',
      description: 'Route for testing agents with streaming output.',
    },
  ],
  caveats: [
    'Not published to npm. Run it from the repository.',
    'The package does not export AdminUI, and it has no main or exports field. The README shows an embedded import, but it cannot be used.',
    'Runs on Next.js 15, as set in package.json. The README says Next.js 14.',
    'Stores data in a local SQLite file by default (.agentsea/admin.db). No Dockerfile ships with the package, although the README shows a docker build step.',
  ],
};

export default function Page() {
  return <PackagePage pkg={pkg} />;
}
