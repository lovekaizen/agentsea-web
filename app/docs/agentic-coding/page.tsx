import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function AgenticCodingPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Agentic Coding"
        titleGradient="blue"
        description="Launch an interactive AI coding session with 13 built-in tools — file operations, code editing, search, shell, and git."
      />

      <AlertBox type="info" gradient>
        <span>
          The <code>sea code</code> command starts an interactive agentic coding
          session. The coding agent follows best practices: it reads files
          before editing, uses precise edits over rewrites, and verifies changes
          with git diff.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Getting Started</h2>
        <p>Install the AgentSea CLI globally, then start a coding session:</p>
        <CodeBlock language="bash">
          {`npm install -g @lov3kaizen/agentsea-cli

# Start an interactive agentic coding session
sea code`}
        </CodeBlock>

        <h2>Command Options</h2>
        <p>
          Override the provider or model, enable verbose output, or limit the
          number of tool iterations:
        </p>
        <CodeBlock language="bash">
          {`# Start an agentic coding session with the default agent
sea code

# Use a specific provider/model
sea code --provider anthropic --model claude-sonnet-4-20250514

# Verbose mode with tool calls, token usage, and latency
sea code --verbose

# Limit tool iterations (default: 25)
sea code --maxIterations 50`}
        </CodeBlock>

        <h2>Built-in Tools</h2>
        <p>
          The coding agent has access to 13 built-in tools, grouped into five
          categories:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
          {toolCategories.map((category, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {category.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 px-2 py-1 rounded font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h3>File Operations</h3>
        <ul>
          <li>
            <code>file_read</code> — Read file contents
          </li>
          <li>
            <code>file_write</code> — Write content to files
          </li>
          <li>
            <code>file_list</code> — List directory contents
          </li>
        </ul>

        <h3>Code Editing</h3>
        <ul>
          <li>
            <code>code_edit</code> — Precise search-and-replace editing
          </li>
        </ul>

        <h3>Search</h3>
        <ul>
          <li>
            <code>glob</code> — Find files matching glob patterns
          </li>
          <li>
            <code>grep</code> — Search file contents with regex
          </li>
        </ul>

        <h3>Shell</h3>
        <ul>
          <li>
            <code>shell_execute</code> — Run shell commands (with safety checks)
          </li>
        </ul>

        <h3>Git</h3>
        <ul>
          <li>
            <code>git_status</code> — Show working tree status
          </li>
          <li>
            <code>git_diff</code> — Show changes between commits
          </li>
          <li>
            <code>git_add</code> — Stage files for commit
          </li>
          <li>
            <code>git_commit</code> — Create a commit
          </li>
          <li>
            <code>git_log</code> — Show commit history
          </li>
          <li>
            <code>git_branch</code> — List or create branches
          </li>
        </ul>

        <Divider />

        <h2>Provider Support</h2>
        <p>
          Agentic coding works with any provider. Use a cloud provider such as
          Anthropic, OpenAI, or Gemini, or run entirely locally with Ollama, LM
          Studio, or LocalAI.
        </p>
        <CodeBlock language="bash">
          {`# Anthropic (Claude)
sea code --provider anthropic --model claude-sonnet-4-20250514

# OpenAI (GPT)
sea code --provider openai

# Google (Gemini)
sea code --provider gemini

# Local (Ollama)
sea code --provider local`}
        </CodeBlock>

        <AlertBox type="success">
          <span>
            Mix cloud and local providers across sessions — use local models for
            quick iterations and cloud models for complex production work.
          </span>
        </AlertBox>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/cli">CLI Tool</Link> — Full command reference for
            the AgentSea CLI
          </li>
          <li>
            <Link href="/docs/tools">Tools</Link> — Learn more about built-in
            and custom tools
          </li>
          <li>
            <Link href="/docs/providers">Providers</Link> — Configure cloud and
            local providers
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const toolCategories = [
  {
    icon: '📁',
    name: 'File Operations',
    description: 'Read, write, and list files',
    tools: ['file_read', 'file_write', 'file_list'],
  },
  {
    icon: '✏️',
    name: 'Code Editing',
    description: 'Precise search-and-replace editing',
    tools: ['code_edit'],
  },
  {
    icon: '🔍',
    name: 'Search',
    description: 'Find files and search contents',
    tools: ['glob', 'grep'],
  },
  {
    icon: '⌨️',
    name: 'Shell',
    description: 'Run shell commands with safety checks',
    tools: ['shell_execute'],
  },
  {
    icon: '🔀',
    name: 'Git',
    description: 'Inspect and manage version control',
    tools: [
      'git_status',
      'git_diff',
      'git_add',
      'git_commit',
      'git_log',
      'git_branch',
    ],
  },
];
