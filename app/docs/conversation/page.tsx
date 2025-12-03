import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function ConversationPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Conversation Schemas"
        titleGradient="purple"
        description="Build structured conversational experiences with custom schemas, validation, and dynamic routing."
      />

      <div className="prose max-w-none">
        <h2>What are Conversation Schemas?</h2>
        <p>
          Conversation Schemas allow you to define structured conversation flows
          with validation, state management, and conditional branching. Perfect
          for building:
        </p>
        <ul>
          <li>Multi-step forms and onboarding flows</li>
          <li>Booking and reservation systems</li>
          <li>Customer support workflows</li>
          <li>Survey and questionnaire bots</li>
          <li>Interactive tutorials</li>
        </ul>

        <h2>Basic Example</h2>
        <p>Create a simple hotel booking conversation:</p>

        <CodeBlock language="typescript">
          {`import {
  ConversationSchema,
  ConversationSchemaBuilder,
  Agent,
  AnthropicProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

// Define conversation schema
const bookingSchema = new ConversationSchema({
  name: 'hotel-booking',
  description: 'Hotel reservation conversation',
  startStep: 'destination',
  steps: [
    {
      id: 'destination',
      prompt: 'Where would you like to stay?',
      schema: z.object({
        city: z.string().min(2),
      }),
      next: 'dates',
    },
    {
      id: 'dates',
      prompt: 'What are your check-in and check-out dates?',
      schema: z.object({
        checkIn: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
        checkOut: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
      }),
      validation: (response) => {
        const checkIn = new Date(response.checkIn);
        const checkOut = new Date(response.checkOut);
        return checkOut > checkIn;
      },
      errorMessage: 'Check-out must be after check-in',
      next: 'guests',
    },
    {
      id: 'guests',
      prompt: 'How many guests?',
      schema: z.object({
        adults: z.number().min(1).max(10),
        children: z.number().min(0).max(5),
      }),
      next: 'confirm',
    },
    {
      id: 'confirm',
      prompt: 'Please review your booking details and confirm.',
      onComplete: async (response, state) => {
        // Process booking
        console.log('Booking confirmed:', state.data);
      },
      next: null, // End conversation
    },
  ],
  onComplete: async (state) => {
    console.log('Conversation completed!', state);
  },
});

// Process user responses
const result1 = await bookingSchema.processResponse(
  JSON.stringify({ city: 'San Francisco' })
);
console.log(result1.nextPrompt); // "What are your check-in and check-out dates?"

const result2 = await bookingSchema.processResponse(
  JSON.stringify({ checkIn: '2025-12-01', checkOut: '2025-12-05' })
);
console.log(result2.nextPrompt); // "How many guests?"`}
        </CodeBlock>

        <h2>Using with Agents</h2>
        <p>
          Integrate conversation schemas with AI agents for intelligent,
          structured conversations:
        </p>

        <CodeBlock language="typescript">
          {`import {
  ConversationManager,
  Agent,
  AnthropicProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';

// Create agent
const agent = new Agent(
  {
    name: 'booking-agent',
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    systemPrompt: \`You are a helpful hotel booking assistant.
Extract information from user messages and format it appropriately.\`,
  },
  new AnthropicProvider(),
  new ToolRegistry(),
);

// Create conversation manager
const manager = new ConversationManager(
  agent,
  bookingSchema,
  'user-123',
);

// Start conversation
const start = await manager.start();
console.log(start.prompt); // "Where would you like to stay?"

// Process natural language
const response = await manager.processMessage(
  'I want to book a hotel in San Francisco'
);
console.log(response.response); // Next prompt
console.log(response.aiResponse); // AI-enhanced response`}
        </CodeBlock>

        <h2>Builder Pattern</h2>
        <p>Use the fluent builder API for cleaner schema definitions:</p>

        <CodeBlock language="typescript">
          {`const schema = new ConversationSchemaBuilder()
  .name('support-flow')
  .description('Customer support conversation')
  .startAt('category')
  .addStep({
    id: 'category',
    prompt: 'What type of issue are you experiencing?',
    next: (response) => {
      if (response.includes('billing')) return 'billing';
      if (response.includes('technical')) return 'technical';
      return 'general';
    },
  })
  .addStep({
    id: 'billing',
    prompt: 'Please describe your billing issue.',
    next: 'resolve',
  })
  .addStep({
    id: 'technical',
    prompt: 'Please describe your technical issue.',
    next: 'resolve',
  })
  .addStep({
    id: 'general',
    prompt: 'How can I help you today?',
    next: 'resolve',
  })
  .addStep({
    id: 'resolve',
    prompt: 'Is there anything else I can help with?',
    next: null,
  })
  .onComplete(async (state) => {
    console.log('Support ticket created:', state.data);
  })
  .build();`}
        </CodeBlock>

        <h2>Dynamic Routing</h2>
        <p>
          Route users to different conversation paths based on their responses:
        </p>

        <CodeBlock language="typescript">
          {`const schema = new ConversationSchema({
  name: 'product-quiz',
  startStep: 'budget',
  steps: [
    {
      id: 'budget',
      prompt: 'What is your budget?',
      next: (response, state) => {
        const budget = parseInt(response);
        if (budget < 1000) return 'basic-options';
        if (budget < 3000) return 'mid-options';
        return 'premium-options';
      },
    },
    {
      id: 'basic-options',
      prompt: 'Here are our budget-friendly options...',
      next: 'finalize',
    },
    {
      id: 'mid-options',
      prompt: 'Here are our mid-range options...',
      next: 'finalize',
    },
    {
      id: 'premium-options',
      prompt: 'Here are our premium options...',
      next: 'finalize',
    },
    {
      id: 'finalize',
      prompt: 'Would you like to proceed?',
      next: null,
    },
  ],
});`}
        </CodeBlock>

        <h2>Schema Validation</h2>
        <p>Use Zod schemas for robust input validation:</p>

        <CodeBlock language="typescript">
          {`import { z } from 'zod';

const step = {
  id: 'user-info',
  prompt: 'Please provide your information.',
  schema: z.object({
    email: z.string().email('Invalid email format'),
    age: z.number()
      .int()
      .min(18, 'Must be 18 or older')
      .max(120, 'Invalid age'),
    phone: z.string()
      .regex(/^\\+?[1-9]\\d{1,14}$/, 'Invalid phone format'),
  }),
  validation: async (response) => {
    // Additional async validation
    const emailExists = await checkEmail(response.email);
    return !emailExists;
  },
  errorMessage: 'Email already registered',
  next: 'confirm',
};`}
        </CodeBlock>

        <h2>State Management</h2>
        <p>Access and manage conversation state throughout the flow:</p>

        <CodeBlock language="typescript">
          {`// Get current state
const state = schema.getState();
console.log(state.currentStep); // Current step ID
console.log(state.data); // Collected data
console.log(state.history); // Conversation history

// Reset conversation
schema.reset();

// Export/import state for persistence
const exported = schema.exportState();
localStorage.setItem('conversation', exported);

// Later...
const saved = localStorage.getItem('conversation');
schema.importState(saved);`}
        </CodeBlock>

        <h2>Callbacks</h2>
        <p>Execute custom logic at different stages:</p>

        <CodeBlock language="typescript">
          {`const schema = new ConversationSchema({
  name: 'payment-flow',
  startStep: 'amount',
  steps: [
    {
      id: 'amount',
      prompt: 'How much would you like to pay?',
      onComplete: async (response, state) => {
        // Called after this step completes
        console.log('Amount entered:', response);
      },
      next: 'method',
    },
    {
      id: 'method',
      prompt: 'Choose payment method.',
      onComplete: async (response, state) => {
        // Validate payment method
        await validatePaymentMethod(response);
      },
      next: 'process',
    },
    {
      id: 'process',
      prompt: 'Processing payment...',
      onComplete: async (response, state) => {
        // Process payment
        await processPayment(
          state.data.amount,
          state.data.method
        );
      },
      next: null,
    },
  ],
  onComplete: async (state) => {
    // Called when entire conversation completes
    console.log('Payment completed:', state.data);
    await sendReceipt(state.data);
  },
  onError: async (error, state) => {
    // Handle errors
    console.error('Payment error:', error);
    await logError(error, state);
  },
});`}
        </CodeBlock>

        <h2>Error Handling</h2>
        <p>Handle validation errors and retries gracefully:</p>

        <CodeBlock language="typescript">
          {`const step = {
  id: 'verification-code',
  prompt: 'Enter the 6-digit verification code.',
  schema: z.object({
    code: z.string().length(6).regex(/^\\d{6}$/),
  }),
  validation: async (response) => {
    const isValid = await verifyCode(response.code);
    return isValid;
  },
  errorMessage: 'Invalid verification code. Please try again.',
  maxRetries: 3,
  next: 'success',
};

// Process with error handling
try {
  const result = await schema.processResponse(userInput);

  if (!result.success) {
    console.log(result.message); // Error message
    // Show error to user and retry
  } else if (result.isComplete) {
    console.log('Conversation completed!');
  } else {
    console.log(result.nextPrompt); // Next question
  }
} catch (error) {
  console.error('Critical error:', error);
}`}
        </CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Clear Prompts</strong>: Write clear, concise prompts that
            explain what information is needed
          </li>
          <li>
            <strong>Validation</strong>: Use Zod schemas for type safety and
            validation
          </li>
          <li>
            <strong>Error Messages</strong>: Provide helpful error messages that
            guide users
          </li>
          <li>
            <strong>State Persistence</strong>: Save conversation state to allow
            users to resume
          </li>
          <li>
            <strong>Callbacks</strong>: Use callbacks for side effects (API
            calls, database updates)
          </li>
          <li>
            <strong>Dynamic Routing</strong>: Create personalized flows based on
            user responses
          </li>
          <li>
            <strong>Testing</strong>: Test all conversation paths and edge cases
          </li>
        </ul>

        <h2>Complete Example</h2>
        <p>A full restaurant reservation system:</p>

        <CodeBlock language="typescript">
          {`import {
  ConversationSchema,
  ConversationManager,
  Agent,
  AnthropicProvider,
  ToolRegistry,
} from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

const reservationSchema = new ConversationSchema({
  name: 'restaurant-reservation',
  startStep: 'date',
  steps: [
    {
      id: 'date',
      prompt: 'What date would you like to reserve?',
      schema: z.object({
        date: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
      }),
      validation: (response) => {
        const date = new Date(response.date);
        return date >= new Date();
      },
      errorMessage: 'Please select a future date',
      next: 'time',
    },
    {
      id: 'time',
      prompt: 'What time would you prefer?',
      schema: z.object({
        time: z.enum(['11:00', '12:00', '13:00', '18:00', '19:00', '20:00']),
      }),
      next: 'party-size',
    },
    {
      id: 'party-size',
      prompt: 'How many people?',
      schema: z.object({
        size: z.number().min(1).max(12),
      }),
      next: 'special-requests',
    },
    {
      id: 'special-requests',
      prompt: 'Any special requests or dietary requirements?',
      next: 'confirm',
    },
    {
      id: 'confirm',
      prompt: 'Please confirm your reservation.',
      onComplete: async (response, state) => {
        await createReservation({
          date: state.data.date.date,
          time: state.data.time.time,
          size: state.data['party-size'].size,
          notes: response,
        });
      },
      next: null,
    },
  ],
  onComplete: async (state) => {
    await sendConfirmationEmail(state.data);
  },
});

// Use with agent
const agent = new Agent(/* config */);
const manager = new ConversationManager(agent, reservationSchema);

// Handle user messages
async function handleMessage(userMessage: string) {
  const result = await manager.processMessage(userMessage);
  return result.response;
}`}
        </CodeBlock>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/agents">Learn about Agents</Link>
          </li>
          <li>
            <Link href="/docs/tools">Explore Tools</Link>
          </li>
          <li>
            <Link href="/examples">View Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
