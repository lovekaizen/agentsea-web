import type { Metadata } from 'next';
import Link from 'next/link';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';
import { ApiList, ApiRow } from '../../components/docs/ApiList';

export const metadata: Metadata = {
  title: 'Conversation schemas | AgentSea',
  description:
    'Define structured conversation flows in AgentSea: steps, Zod schemas, validation, dynamic routing, state export and the ConversationManager that adds agent help.',
};

const toc = [
  { id: 'what-are-schemas', label: 'What are conversation schemas?' },
  { id: 'basic-example', label: 'Basic example' },
  { id: 'using-with-agents', label: 'Using with agents' },
  { id: 'builder', label: 'Builder pattern' },
  { id: 'dynamic-routing', label: 'Dynamic routing' },
  { id: 'schema-validation', label: 'Schema validation' },
  { id: 'state', label: 'State management' },
  { id: 'callbacks', label: 'Callbacks' },
  { id: 'error-handling', label: 'Error handling' },
  { id: 'best-practices', label: 'Best practices' },
  { id: 'complete-example', label: 'Complete example' },
  { id: 'next-steps', label: 'Next steps' },
];

export default function ConversationPage() {
  return (
    <DocsShell
      eyebrow="Concept"
      title="Conversation schemas"
      lead="Define structured conversation flows with steps, validation, state and conditional branching. Use them for forms, bookings, support flows and questionnaires."
      active="concepts"
      toc={toc}
    >
      <DocSection id="what-are-schemas" num="01" title="What are conversation schemas?">
        <p className="text-base leading-relaxed text-brand-navy">
          A conversation schema is a set of steps. Each step asks a question, optionally checks the
          answer, and names the next step. Typical uses:
        </p>
        <BulletPanel
          items={[
            'Multi-step forms and onboarding flows',
            'Booking and reservation systems',
            'Customer support workflows',
            'Survey and questionnaire bots',
            'Interactive tutorials',
          ]}
        />
      </DocSection>

      <DocSection id="basic-example" num="02" title="Basic example">
        <p className="text-base leading-relaxed text-brand-navy">
          A hotel booking flow. Each user answer is passed to <code>processResponse()</code> as a string.
          Structured answers are passed as JSON, so the schema can parse them:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { ConversationSchema } from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

const bookingSchema = new ConversationSchema({
  name: 'hotel-booking',
  description: 'Hotel reservation conversation',
  startStep: 'destination',
  steps: [
    {
      id: 'destination',
      prompt: 'Where would you like to stay?',
      schema: z.object({ city: z.string().min(2) }),
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
        const { checkIn, checkOut } = response as { checkIn: string; checkOut: string };
        return new Date(checkOut) > new Date(checkIn);
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
        console.log('Booking confirmed:', state.data);
      },
      // no next: the conversation ends here
    },
  ],
  onComplete: async (state) => {
    console.log('Conversation completed!', state);
  },
});

const first = await bookingSchema.processResponse(JSON.stringify({ city: 'San Francisco' }));
console.log(first.nextPrompt); // "What are your check-in and check-out dates?"

const second = await bookingSchema.processResponse(
  JSON.stringify({ checkIn: '2025-12-01', checkOut: '2025-12-05' }),
);
console.log(second.nextPrompt); // "How many guests?"`}
        />
        <Callout kind="warning">
          Schema checks are not enforced in this version. If the input is not valid JSON, or it does
          not match the schema, the raw string is stored as the step&apos;s data and the flow moves on.
          Your <code>validation</code> function still runs on the stored value. Check the stored values
          in your own code until this is fixed.
        </Callout>
      </DocSection>

      <DocSection id="using-with-agents" num="03" title="Using with agents">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>ConversationManager</code> wraps a schema and an agent. Each{' '}
          <code>processMessage()</code> call first runs the agent on the message, then passes the raw
          message to the schema. The agent&apos;s reply is returned as <code>aiResponse</code>, but it does
          not change the stored data.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { Agent, AnthropicProvider, ConversationManager, ToolRegistry } from '@lov3kaizen/agentsea-core';

const agent = new Agent(
  {
    name: 'booking-agent',
    description: 'Helps users book a hotel',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
    systemPrompt: 'You are a helpful hotel booking assistant.',
  },
  new AnthropicProvider(),
  new ToolRegistry(),
);

const manager = new ConversationManager(agent, bookingSchema, 'user-123');

// start() is synchronous
const start = manager.start();
console.log(start.prompt); // "Where would you like to stay?"

const reply = await manager.processMessage('I want to book a hotel in San Francisco');
console.log(reply.response);   // the next prompt, or "Conversation complete"
console.log(reply.isComplete);
console.log(reply.aiResponse); // the agent's reply to the message`}
        />
        <ApiList>
          <ApiRow name="start()">Returns the first prompt and the state. Synchronous.</ApiRow>
          <ApiRow name="processMessage(message)">
            Returns <code>response</code>, <code>isComplete</code>, <code>state</code> and{' '}
            <code>aiResponse</code>.
          </ApiRow>
          <ApiRow name="getState(), getHistory()">Read the current state and the turn history.</ApiRow>
          <ApiRow name="reset()">Return to the first step.</ApiRow>
          <ApiRow name="export(), import(json)">Save and restore the state as a JSON string.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="builder" num="04" title="Builder pattern">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>ConversationSchemaBuilder</code> sets up the same schema with chained calls:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { ConversationSchemaBuilder } from '@lov3kaizen/agentsea-core';

const schema = new ConversationSchemaBuilder()
  .name('support-flow')
  .description('Customer support conversation')
  .startAt('category')
  .addStep({
    id: 'category',
    prompt: 'What type of issue are you experiencing?',
    next: (response) => {
      if (String(response).includes('billing')) return 'billing';
      if (String(response).includes('technical')) return 'technical';
      return 'general';
    },
  })
  .addStep({ id: 'billing', prompt: 'Please describe your billing issue.', next: 'resolve' })
  .addStep({ id: 'technical', prompt: 'Please describe your technical issue.', next: 'resolve' })
  .addStep({ id: 'general', prompt: 'How can I help you today?', next: 'resolve' })
  .addStep({ id: 'resolve', prompt: 'Is there anything else I can help with?' })
  .onComplete(async (state) => {
    console.log('Support ticket created:', state.data);
  })
  .build();`}
        />
      </DocSection>

      <DocSection id="dynamic-routing" num="05" title="Dynamic routing">
        <p className="text-base leading-relaxed text-brand-navy">
          A step&apos;s <code>next</code> can be a function. It receives the parsed response and the state,
          and returns the ID of the next step:
        </p>
        <CodeBlock
          lang="TS"
          code={`const schema = new ConversationSchema({
  name: 'product-quiz',
  startStep: 'budget',
  steps: [
    {
      id: 'budget',
      prompt: 'What is your budget?',
      next: (response) => {
        const budget = Number.parseInt(String(response), 10);
        if (budget < 1000) return 'basic-options';
        if (budget < 3000) return 'mid-options';
        return 'premium-options';
      },
    },
    { id: 'basic-options', prompt: 'Here are our budget-friendly options...', next: 'finalize' },
    { id: 'mid-options', prompt: 'Here are our mid-range options...', next: 'finalize' },
    { id: 'premium-options', prompt: 'Here are our premium options...', next: 'finalize' },
    { id: 'finalize', prompt: 'Would you like to proceed?' },
  ],
});`}
        />
      </DocSection>

      <DocSection id="schema-validation" num="06" title="Schema validation">
        <p className="text-base leading-relaxed text-brand-navy">
          A step can set a Zod <code>schema</code>, a custom <code>validation</code> function and an{' '}
          <code>errorMessage</code>. <code>validation</code> may be async and must return a boolean:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { z } from 'zod';

const step = {
  id: 'user-info',
  prompt: 'Please provide your information.',
  schema: z.object({
    email: z.string().email('Invalid email format'),
    age: z.number().int().min(18, 'Must be 18 or older').max(120, 'Invalid age'),
    phone: z.string().regex(/^\\+?[1-9]\\d{1,14}$/, 'Invalid phone format'),
  }),
  validation: async (response) => {
    const { email } = response as { email: string };
    return !(await checkEmail(email)); // false when the email is already registered
  },
  errorMessage: 'Email already registered',
  next: 'confirm',
};`}
        />
      </DocSection>

      <DocSection id="state" num="07" title="State management">
        <p className="text-base leading-relaxed text-brand-navy">
          Read and manage the conversation state at any point:
        </p>
        <CodeBlock
          lang="TS"
          code={`// Current state
const state = schema.getState();
console.log(state.currentStep); // current step ID
console.log(state.data);        // collected data, keyed by step ID
console.log(state.history);     // conversation turns

// Formatted transcript
console.log(schema.getFormattedHistory());

// Go back to the first step
schema.reset();

// Save and restore the state as a JSON string
const exported = schema.exportState();
localStorage.setItem('conversation', exported); // browser example; use your own store on the server

const saved = localStorage.getItem('conversation');
if (saved) schema.importState(saved);`}
        />
      </DocSection>

      <DocSection id="callbacks" num="08" title="Callbacks">
        <p className="text-base leading-relaxed text-brand-navy">
          Run your own code at each stage:
        </p>
        <ApiList>
          <ApiRow name="step.onComplete(response, state)">Runs after the step&apos;s answer is stored.</ApiRow>
          <ApiRow name="config.onComplete(state)">Runs when the flow reaches a step with no next step.</ApiRow>
          <ApiRow name="config.onError(error, state)">Runs when processing the response throws.</ApiRow>
        </ApiList>
        <CodeBlock
          lang="TS"
          code={`const schema = new ConversationSchema({
  name: 'payment-flow',
  startStep: 'amount',
  steps: [
    {
      id: 'amount',
      prompt: 'How much would you like to pay?',
      onComplete: async (response) => {
        console.log('Amount entered:', response);
      },
      next: 'method',
    },
    {
      id: 'method',
      prompt: 'Choose a payment method.',
      onComplete: async (response) => {
        await validatePaymentMethod(response);
      },
      next: 'process',
    },
    {
      id: 'process',
      prompt: 'Processing payment...',
      onComplete: async (_response, state) => {
        await processPayment(state.data.amount, state.data.method);
      },
    },
  ],
  onComplete: async (state) => {
    await sendReceipt(state.data);
  },
  onError: async (error, state) => {
    console.error('Payment error:', error);
    await logError(error, state);
  },
});`}
        />
      </DocSection>

      <DocSection id="error-handling" num="09" title="Error handling">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>processResponse()</code> returns a result object. A failed validation sets{' '}
          <code>success</code> to false, with the step&apos;s <code>errorMessage</code>, and the same prompt
          comes back. Exceptions are caught and reported the same way, and <code>onError</code> runs.
        </p>
        <CodeBlock
          lang="TS"
          code={`const result = await schema.processResponse(userInput);

if (!result.success) {
  console.log(result.message); // error message to show the user
  console.log(result.nextPrompt); // the prompt to ask again
} else if (result.isComplete) {
  console.log('Conversation completed');
} else {
  console.log(result.nextPrompt);
}`}
        />
      </DocSection>

      <DocSection id="best-practices" num="10" title="Best practices">
        <BulletPanel
          items={[
            <>
              <strong>Clear prompts</strong>: say exactly what information each step needs.
            </>,
            <>
              <strong>Helpful errors</strong>: give an <code>errorMessage</code> that tells the user how to fix the answer.
            </>,
            <>
              <strong>Check the data yourself</strong>: until schema checks are enforced, validate the stored
              values in <code>onComplete</code> or before you act on them.
            </>,
            <>
              <strong>Save state</strong>: export the state after each turn so a user can resume.
            </>,
            <>
              <strong>Side effects in callbacks</strong>: put API calls and database writes in step or flow callbacks.
            </>,
            <>
              <strong>Test every path</strong>: run each branch and each error case.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="complete-example" num="11" title="Complete example">
        <p className="text-base leading-relaxed text-brand-navy">
          A restaurant reservation flow. Each answer is sent as JSON, so the step schemas parse it:
        </p>
        <CodeBlock
          lang="TS"
          code={`import { ConversationSchema, ConversationManager, Agent, AnthropicProvider, ToolRegistry } from '@lov3kaizen/agentsea-core';
import { z } from 'zod';

const reservationSchema = new ConversationSchema({
  name: 'restaurant-reservation',
  startStep: 'date',
  steps: [
    {
      id: 'date',
      prompt: 'What date would you like to reserve?',
      schema: z.object({ date: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/) }),
      validation: (response) => {
        const { date } = response as { date: string };
        return new Date(date) >= new Date();
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
      schema: z.object({ size: z.number().min(1).max(12) }),
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
          date: (state.data.date as { date: string }).date,
          time: (state.data.time as { time: string }).time,
          size: (state.data['party-size'] as { size: number }).size,
          notes: response,
        });
      },
    },
  ],
  onComplete: async (state) => {
    await sendConfirmationEmail(state.data);
  },
});

const agent = new Agent(
  {
    name: 'reservation-agent',
    description: 'Helps with restaurant reservations',
    model: 'claude-sonnet-4-6',
    provider: 'anthropic',
  },
  new AnthropicProvider(),
  new ToolRegistry(),
);

const manager = new ConversationManager(agent, reservationSchema);

async function handleMessage(userMessage: string) {
  const result = await manager.processMessage(userMessage);
  return result.response;
}`}
        />
      </DocSection>

      <DocSection id="next-steps" num="12" title="Next steps">
        <BulletPanel
          items={[
            <Link key="agents" href="/docs/agents" className="text-brand-ocean hover:underline">
              Learn about agents
            </Link>,
            <Link key="tools" href="/docs/tools" className="text-brand-ocean hover:underline">
              Explore tools
            </Link>,
            <Link key="memory" href="/docs/memory" className="text-brand-ocean hover:underline">
              Memory stores
            </Link>,
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
