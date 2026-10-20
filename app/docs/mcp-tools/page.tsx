import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'MCP tools | AgentSea',
  description: 'Pre-built Model Context Protocol tools for Figma and n8n integrations',
};

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'figma-tools', label: 'Figma tools' },
  { id: 'n8n-tools', label: 'n8n tools' },
  { id: 'combined-workflow', label: 'Combined workflow example' },
  { id: 'error-handling', label: 'Error handling and retries' },
  { id: 'best-practices', label: 'Best practices' },
  { id: 'use-cases', label: 'Common use cases' },
  { id: 'api-docs', label: 'API documentation' },
  { id: 'next-steps', label: 'Next steps' },
];

const linkClass = 'text-brand-ocean underline-offset-2 hover:underline';

const useCases = [
  {
    icon: '🎨',
    title: 'Design Review Automation',
    description: 'Automatically export designs, process them, and post feedback',
  },
  {
    icon: '📦',
    title: 'Asset Export Pipeline',
    description: 'Export design assets and trigger processing workflows',
  },
  {
    icon: '🔔',
    title: 'Design Change Notifications',
    description: 'Monitor Figma changes and notify stakeholders via n8n',
  },
  {
    icon: '🚀',
    title: 'Automated Deployment',
    description: 'Trigger deployment workflows based on design approvals',
  },
  {
    icon: '📊',
    title: 'Analytics & Reporting',
    description: 'Collect design metrics and generate reports automatically',
  },
  {
    icon: '🔄',
    title: 'Version Synchronization',
    description: 'Keep designs and documentation in sync across tools',
  },
];

export default function MCPToolsPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="MCP tools"
      lead="Pre-built Model Context Protocol tools for Figma and n8n integrations"
      active="guides"
      toc={toc}
    >
      <DocSection id="overview" num="01" title="Overview">
        <p className="text-base leading-relaxed text-brand-navy">
          AgentSea includes built-in MCP tools for popular services, allowing your agents to interact with Figma
          designs and n8n workflows out of the box. These tools are production-ready with built-in retry logic, error
          handling, and comprehensive validation.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border border-rule bg-surface-paper p-6">
            <h3 className="text-lg font-semibold text-brand-deep">🎨 Figma tools</h3>
            <p className="text-[15px] leading-[1.5] text-brand-navy">
              Interact with Figma files, nodes, images, and comments programmatically
            </p>
            <BulletPanel
              items={[
                'Get file information & structure',
                'Retrieve specific nodes by ID',
                'Export images (PNG, SVG, PDF)',
                'Read and post comments',
                'Version control access',
              ]}
            />
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-rule bg-surface-paper p-6">
            <h3 className="text-lg font-semibold text-brand-deep">⚡ n8n tools</h3>
            <p className="text-[15px] leading-[1.5] text-brand-navy">
              Execute and manage n8n workflows for powerful automation
            </p>
            <BulletPanel
              items={[
                'Execute workflows with data',
                'Monitor execution status',
                'List available workflows',
                'Trigger webhooks',
                'Get workflow details',
              ]}
            />
          </div>
        </div>
      </DocSection>

      <DocSection id="figma-tools" num="02" title="Figma tools">
        <p className="text-base leading-relaxed text-brand-navy">
          The Figma tools allow agents to interact with Figma&apos;s design files, components, and collaboration
          features.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">Setup</h3>
        <p className="text-base leading-relaxed text-brand-navy">
          First, obtain a Figma access token from your{' '}
          <a href="https://www.figma.com/settings" target="_blank" rel="noopener noreferrer" className={linkClass}>
            Figma account settings
          </a>
          : go to &quot;Personal Access Tokens&quot;, generate a new token, and set it as an environment variable.
        </p>
        <CodeBlock lang="BASH" code={`export FIGMA_ACCESS_TOKEN="your_figma_token_here"`} />

        <h3 className="text-lg font-semibold text-brand-deep">Available Figma tools</h3>
        <ApiList>
          <ApiRow name="figma_get_file">Get file info and structure. Parameters: fileKey, version?, depth?</ApiRow>
          <ApiRow name="figma_get_nodes">Get specific nodes by ID. Parameters: fileKey, nodeIds[]</ApiRow>
          <ApiRow name="figma_get_images">Export images. Parameters: fileKey, nodeIds[], format?, scale?</ApiRow>
          <ApiRow name="figma_get_comments">Get all comments. Parameters: fileKey</ApiRow>
          <ApiRow name="figma_post_comment">Post a new comment. Parameters: fileKey, message, clientMeta?</ApiRow>
        </ApiList>

        <h3 className="text-lg font-semibold text-brand-deep">Figma usage example</h3>
        <CodeBlock
          lang="TS"
          code={`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  figmaGetFileTool,
  figmaGetImagesTool,
  figmaPostCommentTool,
} from '@lov3kaizen/agentsea-core';

const figmaTools = [figmaGetFileTool, figmaGetImagesTool, figmaPostCommentTool];
const toolRegistry = new ToolRegistry();
toolRegistry.registerMany(figmaTools);

const agent = new Agent(
  {
    name: 'figma-agent',
    description: 'Agent with Figma integration',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    tools: figmaTools,
  },
  new AnthropicProvider(),
  toolRegistry,
);

// Agent can now interact with Figma
const response = await agent.execute(
  'Get the Figma file "abc123" and export all frames as PNG images at 2x scale',
  context,
);`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Figma workflow examples</h3>
        <BulletPanel
          items={[
            <>
              <strong>Design Review Automation</strong>: get latest designs, export screenshots, and post feedback
              comments automatically.
            </>,
            <>
              <strong>Asset Pipeline</strong>: export design assets, optimize images, and update documentation.
            </>,
            <>
              <strong>Version Tracking</strong>: monitor design changes, track versions, and notify team members.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="n8n-tools" num="03" title="n8n tools">
        <p className="text-base leading-relaxed text-brand-navy">
          The n8n tools allow agents to execute and manage automation workflows, making it easy to integrate complex
          business processes.
        </p>

        <h3 className="text-lg font-semibold text-brand-deep">Setup</h3>
        <p className="text-base leading-relaxed text-brand-navy">Configure your n8n connection:</p>
        <CodeBlock
          lang="BASH"
          code={`export N8N_API_KEY="your_n8n_api_key"\nexport N8N_BASE_URL="https://your-n8n-instance.com"`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">Available n8n tools</h3>
        <ApiList>
          <ApiRow name="n8n_execute_workflow">Run a workflow. Parameters: workflowId, data?, waitForCompletion?</ApiRow>
          <ApiRow name="n8n_get_execution">Check execution status. Parameters: executionId</ApiRow>
          <ApiRow name="n8n_list_workflows">List available workflows. Parameters: active?, tags?[], limit?</ApiRow>
          <ApiRow name="n8n_trigger_webhook">Trigger a webhook. Parameters: webhookPath, method?, data?</ApiRow>
          <ApiRow name="n8n_get_workflow">Get workflow details. Parameters: workflowId</ApiRow>
        </ApiList>

        <h3 className="text-lg font-semibold text-brand-deep">n8n usage example</h3>
        <CodeBlock
          lang="TS"
          code={`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  n8nExecuteWorkflowTool,
  n8nListWorkflowsTool,
  n8nTriggerWebhookTool,
} from '@lov3kaizen/agentsea-core';

const tools = [n8nExecuteWorkflowTool, n8nListWorkflowsTool, n8nTriggerWebhookTool];
const toolRegistry = new ToolRegistry();
toolRegistry.registerMany(tools);

const agent = new Agent(
  {
    name: 'automation-agent',
    description: 'Agent with n8n workflow automation',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    tools,
  },
  new AnthropicProvider(),
  toolRegistry,
);

// Agent can now execute workflows
const response = await agent.execute(
  'Execute the "Data Processing" workflow with this data: {"name": "John", "email": "john@example.com"}',
  context,
);`}
        />

        <h3 className="text-lg font-semibold text-brand-deep">n8n workflow examples</h3>
        <BulletPanel
          items={[
            <>
              <strong>Data Processing Pipeline</strong>: trigger workflows to process, transform, and store data
              automatically.
            </>,
            <>
              <strong>Customer Onboarding</strong>: execute multi-step onboarding workflows with dynamic data.
            </>,
            <>
              <strong>Notification System</strong>: trigger webhooks to send notifications across multiple channels.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="combined-workflow" num="04" title="Combined workflow example">
        <p className="text-base leading-relaxed text-brand-navy">
          Use both Figma and n8n tools together to create powerful automation pipelines:
        </p>
        <CodeBlock
          lang="TS"
          code={`import {
  Agent,
  AnthropicProvider,
  ToolRegistry,
  figmaGetFileTool,
  figmaGetImagesTool,
  figmaPostCommentTool,
  n8nTriggerWebhookTool,
} from '@lov3kaizen/agentsea-core';

const tools = [figmaGetFileTool, figmaGetImagesTool, figmaPostCommentTool, n8nTriggerWebhookTool];
const toolRegistry = new ToolRegistry();
toolRegistry.registerMany(tools);

const agent = new Agent(
  {
    name: 'design-automation',
    description: 'Automated design-to-production pipeline',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    tools,
  },
  new AnthropicProvider(),
  toolRegistry,
);

// Multi-step automation
const response = await agent.execute(
  \`
  1. Get the latest version of Figma file "design123"
  2. Export the main frame as a high-res PNG
  3. Trigger the n8n webhook at "webhook/process-design" with the image URL
  4. Post a comment on the Figma file: "Design exported and sent for processing"
  \`,
  context,
);`}
        />
      </DocSection>

      <DocSection id="error-handling" num="05" title="Error handling and retries">
        <p className="text-base leading-relaxed text-brand-navy">
          The MCP tools that set a retry policy make up to three attempts in total, including the first call, with
          exponential backoff. The Figma tools start at a 1000 ms delay and cap it at 10000 ms.
        </p>
        <BulletPanel
          items={[
            <>
              <strong>Max attempts:</strong> 3, including the first call
            </>,
            <>
              <strong>Backoff strategy:</strong> exponential
            </>,
            <>
              <strong>Initial delay:</strong> 1000 ms
            </>,
            <>
              <strong>Max delay:</strong> 10000 ms
            </>,
          ]}
        />
        <CodeBlock
          lang="TS"
          code={`// Tools automatically retry on failure
try {
  const result = await agent.execute(
    'Get Figma file and trigger n8n workflow',
    context
  );
} catch (error) {
  // Error after all retries exhausted
  console.error('Automation failed:', error.message);
}`}
        />
      </DocSection>

      <DocSection id="best-practices" num="06" title="Best practices">
        <BulletPanel
          items={[
            <>
              <strong>Environment variables:</strong> always use environment variables for API keys in production.
            </>,
            <>
              <strong>Rate limiting:</strong> be mindful of API rate limits for both Figma and n8n.
            </>,
            <>
              <strong>Webhook security:</strong> secure your n8n webhooks with authentication.
            </>,
            <>
              <strong>Data validation:</strong> validate workflow input data before execution.
            </>,
            <>
              <strong>Error monitoring:</strong> log and monitor errors for debugging.
            </>,
            <>
              <strong>Caching:</strong> cache Figma file data when possible to reduce API calls.
            </>,
            <>
              <strong>Testing:</strong> test n8n workflows independently before integrating with agents.
            </>,
          ]}
        />
        <Callout kind="note">
          The tool retry policy repeats failed calls. Make sure a repeated <code>figma_post_comment</code> or{' '}
          <code>n8n_trigger_webhook</code> call is safe to run twice before you rely on it.
        </Callout>
      </DocSection>

      <DocSection id="use-cases" num="07" title="Common use cases">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="flex flex-col gap-2 rounded-xl border border-rule bg-surface-paper p-6">
              <h3 className="text-lg font-semibold text-brand-deep">
                {useCase.icon} {useCase.title}
              </h3>
              <p className="text-[15px] leading-[1.5] text-brand-navy">{useCase.description}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="api-docs" num="08" title="API documentation">
        <p className="text-base leading-relaxed text-brand-navy">For detailed API references, see:</p>
        <BulletPanel
          items={[
            <>
              <a href="https://www.figma.com/developers/api" target="_blank" rel="noopener noreferrer" className={linkClass}>
                Figma API Documentation
              </a>
            </>,
            <>
              <a href="https://docs.n8n.io/api/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                n8n API Documentation
              </a>
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="next-steps" num="09" title="Next steps">
        <BulletPanel
          items={[
            <>
              <Link href="/docs/tools" className={linkClass}>
                Learn about the tool system
              </Link>
            </>,
            <>
              <Link href="/docs/mcp-overview" className={linkClass}>
                MCP integration overview
              </Link>
            </>,
            <>
              <Link href="/docs/workflows" className={linkClass}>
                Use tools in workflows
              </Link>
            </>,
            <>
              <Link href="/examples" className={linkClass}>
                View more examples
              </Link>
            </>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
