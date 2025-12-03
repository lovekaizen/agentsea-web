import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function MCPToolsPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="MCP Tools"
        titleGradient="warm"
        description="Pre-built Model Context Protocol tools for Figma and n8n integrations"
      />

      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>
          AgentSea includes built-in MCP tools for popular services, allowing
          your agents to interact with Figma designs and n8n workflows out of
          the box. These tools are production-ready with built-in retry logic,
          error handling, and comprehensive validation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-8">
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-4xl">🎨</div>
                <h3 className="card-title text-2xl">Figma Tools</h3>
              </div>
              <p className="text-base-content/70">
                Interact with Figma files, nodes, images, and comments
                programmatically
              </p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Available Tools:</h4>
                <ul className="text-sm space-y-1 text-base-content/70">
                  <li>• Get file information & structure</li>
                  <li>• Retrieve specific nodes by ID</li>
                  <li>• Export images (PNG, SVG, PDF)</li>
                  <li>• Read and post comments</li>
                  <li>• Version control access</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-4xl">⚡</div>
                <h3 className="card-title text-2xl">n8n Tools</h3>
              </div>
              <p className="text-base-content/70">
                Execute and manage n8n workflows for powerful automation
              </p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Available Tools:</h4>
                <ul className="text-sm space-y-1 text-base-content/70">
                  <li>• Execute workflows with data</li>
                  <li>• Monitor execution status</li>
                  <li>• List available workflows</li>
                  <li>• Trigger webhooks</li>
                  <li>• Get workflow details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h2>Figma Tools</h2>
        <p>
          The Figma tools allow agents to interact with Figma&apos;s design
          files, components, and collaboration features.
        </p>

        <h3>Setup</h3>
        <p>First, obtain a Figma access token:</p>
        <ol>
          <li>
            Go to your{' '}
            <a
              href="https://www.figma.com/settings"
              target="_blank"
              rel="noopener noreferrer"
            >
              Figma account settings
            </a>
          </li>
          <li>Navigate to &quot;Personal Access Tokens&quot;</li>
          <li>Generate a new token</li>
          <li>Set it as an environment variable:</li>
        </ol>

        <CodeBlock language="bash">
          {`export FIGMA_ACCESS_TOKEN="your_figma_token_here"`}
        </CodeBlock>

        <h3>Available Figma Tools</h3>

        <div className="not-prose mb-6">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Tool Name</th>
                  <th>Description</th>
                  <th>Key Parameters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>figma_get_file</code>
                  </td>
                  <td>Get file info and structure</td>
                  <td>fileKey, version?, depth?</td>
                </tr>
                <tr>
                  <td>
                    <code>figma_get_nodes</code>
                  </td>
                  <td>Get specific nodes by ID</td>
                  <td>fileKey, nodeIds[]</td>
                </tr>
                <tr>
                  <td>
                    <code>figma_get_images</code>
                  </td>
                  <td>Export images</td>
                  <td>fileKey, nodeIds[], format?, scale?</td>
                </tr>
                <tr>
                  <td>
                    <code>figma_get_comments</code>
                  </td>
                  <td>Get all comments</td>
                  <td>fileKey</td>
                </tr>
                <tr>
                  <td>
                    <code>figma_post_comment</code>
                  </td>
                  <td>Post a new comment</td>
                  <td>fileKey, message, clientMeta?</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3>Figma Usage Example</h3>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  figmaGetFileTool,
  figmaGetImagesTool,
  figmaPostCommentTool,
} from '@lov3kaizen/agentsea-core';

const agent = new Agent({
  name: 'figma-agent',
  description: 'Agent with Figma integration',
  model: 'claude-sonnet-4-20250514',
  provider: 'anthropic',
  tools: [
    figmaGetFileTool,
    figmaGetImagesTool,
    figmaPostCommentTool,
  ],
});

// Agent can now interact with Figma
const response = await agent.execute(
  'Get the Figma file "abc123" and export all frames as PNG images at 2x scale',
  context,
);`}
        </CodeBlock>

        <h3>Figma Workflow Examples</h3>

        <div className="not-prose space-y-4 mb-8">
          <div className="alert alert-info">
            <div>
              <strong>Design Review Automation</strong>
              <p className="text-sm mt-1">
                Get latest designs, export screenshots, and post feedback
                comments automatically
              </p>
            </div>
          </div>
          <div className="alert alert-success">
            <div>
              <strong>Asset Pipeline</strong>
              <p className="text-sm mt-1">
                Export design assets, optimize images, and update documentation
              </p>
            </div>
          </div>
          <div className="alert alert-warning">
            <div>
              <strong>Version Tracking</strong>
              <p className="text-sm mt-1">
                Monitor design changes, track versions, and notify team members
              </p>
            </div>
          </div>
        </div>

        <h2>n8n Tools</h2>
        <p>
          The n8n tools allow agents to execute and manage automation workflows,
          making it easy to integrate complex business processes.
        </p>

        <h3>Setup</h3>
        <p>Configure your n8n connection:</p>

        <CodeBlock language="bash">
          {`export N8N_API_KEY="your_n8n_api_key"
export N8N_BASE_URL="https://your-n8n-instance.com"`}
        </CodeBlock>

        <h3>Available n8n Tools</h3>

        <div className="not-prose mb-6">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Tool Name</th>
                  <th>Description</th>
                  <th>Key Parameters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>n8n_execute_workflow</code>
                  </td>
                  <td>Run a workflow</td>
                  <td>workflowId, data?, waitForCompletion?</td>
                </tr>
                <tr>
                  <td>
                    <code>n8n_get_execution</code>
                  </td>
                  <td>Check execution status</td>
                  <td>executionId</td>
                </tr>
                <tr>
                  <td>
                    <code>n8n_list_workflows</code>
                  </td>
                  <td>List available workflows</td>
                  <td>active?, tags?[], limit?</td>
                </tr>
                <tr>
                  <td>
                    <code>n8n_trigger_webhook</code>
                  </td>
                  <td>Trigger a webhook</td>
                  <td>webhookPath, method?, data?</td>
                </tr>
                <tr>
                  <td>
                    <code>n8n_get_workflow</code>
                  </td>
                  <td>Get workflow details</td>
                  <td>workflowId</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3>n8n Usage Example</h3>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  n8nExecuteWorkflowTool,
  n8nListWorkflowsTool,
  n8nTriggerWebhookTool,
} from '@lov3kaizen/agentsea-core';

const agent = new Agent({
  name: 'automation-agent',
  description: 'Agent with n8n workflow automation',
  model: 'claude-sonnet-4-20250514',
  provider: 'anthropic',
  tools: [
    n8nExecuteWorkflowTool,
    n8nListWorkflowsTool,
    n8nTriggerWebhookTool,
  ],
});

// Agent can now execute workflows
const response = await agent.execute(
  'Execute the "Data Processing" workflow with this data: {"name": "John", "email": "john@example.com"}',
  context,
);`}
        </CodeBlock>

        <h3>n8n Workflow Examples</h3>

        <div className="not-prose space-y-4 mb-8">
          <div className="alert alert-info">
            <div>
              <strong>Data Processing Pipeline</strong>
              <p className="text-sm mt-1">
                Trigger workflows to process, transform, and store data
                automatically
              </p>
            </div>
          </div>
          <div className="alert alert-success">
            <div>
              <strong>Customer Onboarding</strong>
              <p className="text-sm mt-1">
                Execute multi-step onboarding workflows with dynamic data
              </p>
            </div>
          </div>
          <div className="alert alert-warning">
            <div>
              <strong>Notification System</strong>
              <p className="text-sm mt-1">
                Trigger webhooks to send notifications across multiple channels
              </p>
            </div>
          </div>
        </div>

        <h2>Combined Workflow Example</h2>
        <p>
          Use both Figma and n8n tools together to create powerful automation
          pipelines:
        </p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  figmaGetFileTool,
  figmaGetImagesTool,
  figmaPostCommentTool,
  n8nTriggerWebhookTool,
} from '@lov3kaizen/agentsea-core';

const agent = new Agent({
  name: 'design-automation',
  description: 'Automated design-to-production pipeline',
  model: 'claude-sonnet-4-20250514',
  provider: 'anthropic',
  tools: [
    figmaGetFileTool,
    figmaGetImagesTool,
    figmaPostCommentTool,
    n8nTriggerWebhookTool,
  ],
});

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
        </CodeBlock>

        <h2>Error Handling & Retries</h2>
        <p>All MCP tools include built-in error handling and retry logic:</p>

        <ul>
          <li>
            <strong>Max Attempts:</strong> 3 automatic retries
          </li>
          <li>
            <strong>Backoff Strategy:</strong> Exponential backoff
          </li>
          <li>
            <strong>Initial Delay:</strong> 1000ms
          </li>
          <li>
            <strong>Max Delay:</strong> 10000ms
          </li>
        </ul>

        <CodeBlock language="typescript">
          {`// Tools automatically retry on failure
try {
  const result = await agent.execute(
    'Get Figma file and trigger n8n workflow',
    context
  );
} catch (error) {
  // Error after all retries exhausted
  console.error('Automation failed:', error.message);
}`}
        </CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Environment Variables:</strong> Always use environment
            variables for API keys in production
          </li>
          <li>
            <strong>Rate Limiting:</strong> Be mindful of API rate limits for
            both Figma and n8n
          </li>
          <li>
            <strong>Webhook Security:</strong> Secure your n8n webhooks with
            authentication
          </li>
          <li>
            <strong>Data Validation:</strong> Validate workflow input data
            before execution
          </li>
          <li>
            <strong>Error Monitoring:</strong> Log and monitor errors for
            debugging
          </li>
          <li>
            <strong>Caching:</strong> Cache Figma file data when possible to
            reduce API calls
          </li>
          <li>
            <strong>Testing:</strong> Test n8n workflows independently before
            integrating with agents
          </li>
        </ul>

        <h2>Common Use Cases</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="card bg-base-100 border border-base-300"
            >
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title text-lg">
                    {useCase.icon} {useCase.title}
                  </h3>
                </div>
                <p className="text-sm text-base-content/70">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2>API Documentation</h2>
        <p>For detailed API references, see:</p>
        <ul>
          <li>
            <a
              href="https://www.figma.com/developers/api"
              target="_blank"
              rel="noopener noreferrer"
            >
              Figma API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://docs.n8n.io/api/"
              target="_blank"
              rel="noopener noreferrer"
            >
              n8n API Documentation
            </a>
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/tools">Learn about Tool System</Link>
          </li>
          <li>
            <Link href="/docs/mcp-overview">MCP Integration Overview</Link>
          </li>
          <li>
            <Link href="/docs/workflows">Use Tools in Workflows</Link>
          </li>
          <li>
            <Link href="/examples">View More Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const useCases = [
  {
    icon: '🎨',
    title: 'Design Review Automation',
    description:
      'Automatically export designs, process them, and post feedback',
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
