import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  CodeBlock,
  AlertBox,
} from '../../components/Section';

export default function StructuredOutputPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Structured Output"
        titleGradient="purple"
        description="Type-safe structured outputs with JSON schema validation, Zod integration, and automatic retries for reliable LLM responses."
      />

      <AlertBox type="info" gradient>
        <span>
          Structured Output ensures your LLM responses conform to exact schemas
          with automatic validation, type inference, and retry logic for
          malformed responses.
        </span>
      </AlertBox>

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @lov3kaizen/agentsea-structured-output`}
        </CodeBlock>

        <h2>Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 not-prose mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <h2>Quick Start with Zod</h2>
        <p>
          Define your schema with Zod and get fully typed responses:
        </p>

        <CodeBlock language="typescript">
          {`import { structuredOutput } from '@lov3kaizen/agentsea-structured-output';
import { z } from 'zod';

// Define your schema
const ProductSchema = z.object({
  name: z.string().describe('Product name'),
  price: z.number().positive().describe('Price in USD'),
  category: z.enum(['electronics', 'clothing', 'food']),
  inStock: z.boolean(),
  tags: z.array(z.string()).optional(),
});

// Get typed response
const result = await structuredOutput({
  model: 'gpt-4o',
  schema: ProductSchema,
  prompt: 'Extract product info: iPhone 15 Pro, $999, electronics, available',
});

// result is fully typed as z.infer<typeof ProductSchema>
console.log(result.name);     // "iPhone 15 Pro"
console.log(result.price);    // 999
console.log(result.category); // "electronics"
console.log(result.inStock);  // true`}
        </CodeBlock>

        <h2>With AgentSea Agent</h2>
        <p>
          Use structured output with your existing agents:
        </p>

        <CodeBlock language="typescript">
          {`import { Agent } from '@lov3kaizen/agentsea-core';
import { withStructuredOutput } from '@lov3kaizen/agentsea-structured-output';
import { z } from 'zod';

const agent = new Agent({
  provider: 'openai',
  model: 'gpt-4o',
});

const SentimentSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

// Wrap agent with structured output
const structuredAgent = withStructuredOutput(agent, SentimentSchema);

const result = await structuredAgent.run(
  'Analyze: "This product exceeded my expectations!"'
);

console.log(result.sentiment);   // "positive"
console.log(result.confidence);  // 0.95
console.log(result.reasoning);   // "The phrase 'exceeded expectations'..."`}
        </CodeBlock>

        <h2>JSON Schema Support</h2>
        <p>
          Use standard JSON Schema if you prefer:
        </p>

        <CodeBlock language="typescript">
          {`import { structuredOutput } from '@lov3kaizen/agentsea-structured-output';

const schema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    author: { type: 'string' },
    year: { type: 'integer', minimum: 1900 },
    genres: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['title', 'author', 'year'],
} as const;

const result = await structuredOutput({
  model: 'gpt-4o',
  jsonSchema: schema,
  prompt: 'Extract book info: "1984 by George Orwell, published 1949, dystopian fiction"',
});`}
        </CodeBlock>

        <h2>Automatic Retries</h2>
        <p>
          Handle malformed responses with automatic retry logic:
        </p>

        <CodeBlock language="typescript">
          {`import { structuredOutput } from '@lov3kaizen/agentsea-structured-output';
import { z } from 'zod';

const StrictSchema = z.object({
  email: z.string().email(),
  age: z.number().int().positive().max(150),
  website: z.string().url().optional(),
});

const result = await structuredOutput({
  model: 'gpt-4o',
  schema: StrictSchema,
  prompt: 'Extract user info from: john.doe@email.com, 28 years old',
  retry: {
    maxAttempts: 3,
    onRetry: (error, attempt) => {
      console.log(\`Attempt \${attempt} failed: \${error.message}\`);
    },
  },
});`}
        </CodeBlock>

        <h2>Complex Nested Schemas</h2>
        <p>
          Handle deeply nested structures with full type safety:
        </p>

        <CodeBlock language="typescript">
          {`import { z } from 'zod';

const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string(),
});

const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

const OrderSchema = z.object({
  orderId: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    address: AddressSchema,
  }),
  items: z.array(OrderItemSchema),
  total: z.number().positive(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered']),
  createdAt: z.string().datetime(),
});

const result = await structuredOutput({
  model: 'gpt-4o',
  schema: OrderSchema,
  prompt: \`Extract order details from this email: ...order confirmation...\`,
});

// Full type inference for nested objects
console.log(result.customer.address.city);
console.log(result.items[0].quantity);`}
        </CodeBlock>

        <h2>Streaming Structured Output</h2>
        <p>
          Stream partial results as they become available:
        </p>

        <CodeBlock language="typescript">
          {`import { streamStructuredOutput } from '@lov3kaizen/agentsea-structured-output';
import { z } from 'zod';

const ArticleSchema = z.object({
  title: z.string(),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  wordCount: z.number(),
});

const stream = await streamStructuredOutput({
  model: 'gpt-4o',
  schema: ArticleSchema,
  prompt: 'Summarize this article...',
});

for await (const partial of stream) {
  // Receive partial results as fields are completed
  if (partial.title) console.log('Title:', partial.title);
  if (partial.keyPoints) console.log('Points so far:', partial.keyPoints.length);
}

// Final validated result
const result = await stream.finalResult();`}
        </CodeBlock>

        <h2>Provider Support</h2>
        <p>
          Works with all major providers, using native structured output when
          available:
        </p>

        <div className="overflow-x-auto not-prose mb-8">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Native Support</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OpenAI (GPT-4o)</td>
                <td>Yes</td>
                <td>response_format with json_schema</td>
              </tr>
              <tr>
                <td>Anthropic (Claude)</td>
                <td>Yes</td>
                <td>Tool use with schema</td>
              </tr>
              <tr>
                <td>Google (Gemini)</td>
                <td>Yes</td>
                <td>responseSchema parameter</td>
              </tr>
              <tr>
                <td>Ollama</td>
                <td>Partial</td>
                <td>JSON mode + validation</td>
              </tr>
              <tr>
                <td>Other</td>
                <td>Fallback</td>
                <td>Prompt engineering + validation</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Validation Modes</h2>
        <p>
          Choose how strictly to validate responses:
        </p>

        <CodeBlock language="typescript">
          {`import { structuredOutput } from '@lov3kaizen/agentsea-structured-output';

// Strict mode - fail on any validation error
const result = await structuredOutput({
  schema: MySchema,
  prompt: '...',
  validation: 'strict',
});

// Coerce mode - attempt to coerce types (e.g., "42" -> 42)
const result = await structuredOutput({
  schema: MySchema,
  prompt: '...',
  validation: 'coerce',
});

// Partial mode - return partial results even if incomplete
const result = await structuredOutput({
  schema: MySchema,
  prompt: '...',
  validation: 'partial',
});`}
        </CodeBlock>

        <h2>Error Handling</h2>
        <p>
          Handle validation errors gracefully:
        </p>

        <CodeBlock language="typescript">
          {`import {
  structuredOutput,
  StructuredOutputError,
  ValidationError,
  MaxRetriesError,
} from '@lov3kaizen/agentsea-structured-output';

try {
  const result = await structuredOutput({
    schema: MySchema,
    prompt: '...',
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Schema validation failed:', error.issues);
    console.log('Raw response:', error.rawResponse);
  } else if (error instanceof MaxRetriesError) {
    console.log('Max retries exceeded:', error.attempts);
    console.log('Last error:', error.lastError);
  } else if (error instanceof StructuredOutputError) {
    console.log('Structured output error:', error.message);
  }
}`}
        </CodeBlock>

        <h2>Configuration</h2>
        <CodeBlock language="typescript">
          {`interface StructuredOutputConfig {
  // The model to use
  model: string;

  // Zod schema for validation and type inference
  schema?: ZodSchema;

  // JSON Schema (alternative to Zod)
  jsonSchema?: JSONSchema;

  // The prompt/messages to send
  prompt: string | Message[];

  // Provider configuration
  provider?: ProviderConfig;

  // Validation mode
  validation?: 'strict' | 'coerce' | 'partial';

  // Retry configuration
  retry?: {
    maxAttempts: number;
    backoff?: 'linear' | 'exponential';
    onRetry?: (error: Error, attempt: number) => void;
  };

  // Temperature (lower = more deterministic)
  temperature?: number;
}`}
        </CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Use descriptive field names</strong> - LLMs understand
            semantic meaning from names
          </li>
          <li>
            <strong>Add .describe()</strong> - Provide hints for ambiguous
            fields
          </li>
          <li>
            <strong>Set reasonable constraints</strong> - Use min/max to guide
            valid ranges
          </li>
          <li>
            <strong>Use enums for categories</strong> - Limit options to valid
            choices
          </li>
          <li>
            <strong>Lower temperature for structured output</strong> -
            Recommended 0-0.3 for more deterministic results
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/agents">Learn about Agents</Link>
          </li>
          <li>
            <Link href="/docs/guardrails">Add Validation Guardrails</Link>
          </li>
          <li>
            <Link href="/docs/gateway">Use with Gateway</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

const features = [
  {
    icon: '📐',
    name: 'Zod Integration',
    description: 'First-class Zod support with full type inference',
  },
  {
    icon: '🔄',
    name: 'Auto Retries',
    description: 'Automatic retry on malformed responses',
  },
  {
    icon: '✅',
    name: 'Validation',
    description: 'JSON Schema validation with detailed errors',
  },
  {
    icon: '🔒',
    name: 'Type Safety',
    description: 'Full TypeScript inference from schemas',
  },
  {
    icon: '🌊',
    name: 'Streaming',
    description: 'Stream partial structured results',
  },
  {
    icon: '🔌',
    name: 'Multi-Provider',
    description: 'Works with OpenAI, Anthropic, Google, Ollama',
  },
];
