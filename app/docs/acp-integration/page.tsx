import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function ACPIntegrationPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="ACP Commerce Protocol"
        titleGradient="warm"
        description="Build commerce-enabled AI agents with product discovery, cart management, checkout flows, and secure payment processing using the Agentic Commerce Protocol (ACP)."
      />

      <div className="prose max-w-none">
        <h2 id="overview">Overview</h2>
        <p>
          The Agentic Commerce Protocol (ACP) integration enables AI agents to
          handle complete e-commerce workflows:
        </p>
        <ul>
          <li>
            <strong>Product Discovery</strong> - Search and browse product
            catalogs
          </li>
          <li>
            <strong>Cart Management</strong> - Add, update, and remove items
          </li>
          <li>
            <strong>Checkout Processing</strong> - Handle checkout flows and
            validations
          </li>
          <li>
            <strong>Payment Processing</strong> - Secure payments via delegated
            providers (Stripe, PayPal)
          </li>
          <li>
            <strong>Order Management</strong> - Track orders and view history
          </li>
          <li>
            <strong>Inventory Tracking</strong> - Real-time availability checks
          </li>
        </ul>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 my-8">
          <h3 className="text-lg font-semibold text-emerald-900 mb-2">
            🛒 14 Commerce Tools Included
          </h3>
          <div className="text-emerald-800 space-y-1">
            <p className="m-0">
              <strong>Product Tools:</strong> search, browse, details,
              recommendations
            </p>
            <p className="m-0">
              <strong>Cart Tools:</strong> add, update, remove, view
            </p>
            <p className="m-0">
              <strong>Checkout Tools:</strong> initiate, validate, complete
            </p>
            <p className="m-0">
              <strong>Order Tools:</strong> track, history, details
            </p>
          </div>
        </div>

        <h2 id="quick-start">Quick Start</h2>
        <p>Get started with ACP in just a few lines of code:</p>

        <CodeBlock language="typescript">
          {`import { Agent, ACPClient, createACPTools } from '@lov3kaizen/agentsea-core';

// Initialize ACP client
const acpClient = new ACPClient({
  baseUrl: 'https://api.yourcommerce.com/v1',
  apiKey: process.env.ACP_API_KEY,
  merchantId: process.env.MERCHANT_ID,
});

// Create commerce agent with 14 tools
const shoppingAgent = new Agent({
  name: 'shopping-assistant',
  model: 'claude-sonnet-4-20250514',
  systemPrompt: 'You are a helpful shopping assistant. Help customers find products and complete purchases.',
  tools: createACPTools(acpClient),
}, provider, toolRegistry);

// Use the agent
const result = await shoppingAgent.execute(
  'I need wireless headphones under $100',
  context
);`}
        </CodeBlock>

        <h2 id="setup">Setup and Configuration</h2>

        <h3>Installation</h3>
        <CodeBlock language="bash">
          {`npm install @lov3kaizen/agentsea-core

# Or with yarn
yarn add @lov3kaizen/agentsea-core

# Or with pnpm
pnpm add @lov3kaizen/agentsea-core`}
        </CodeBlock>

        <h3>Environment Variables</h3>
        <p>Configure your ACP credentials:</p>
        <CodeBlock language="bash">
          {`# .env
ACP_API_KEY=your_acp_api_key
MERCHANT_ID=your_merchant_id
ACP_BASE_URL=https://api.yourcommerce.com/v1  # Optional`}
        </CodeBlock>

        <h3>Client Configuration</h3>
        <CodeBlock language="typescript">
          {`import { ACPClient } from '@lov3kaizen/agentsea-core';

const acpClient = new ACPClient({
  baseUrl: process.env.ACP_BASE_URL,
  apiKey: process.env.ACP_API_KEY,
  merchantId: process.env.MERCHANT_ID,

  // Optional configuration
  timeout: 30000, // Request timeout (ms)
  retryAttempts: 3, // Retry failed requests
  enableCaching: true, // Cache product data
  cacheDuration: 300000, // Cache for 5 minutes
});

// Verify connection
const isConnected = await acpClient.healthCheck();
console.log('ACP connected:', isConnected);`}
        </CodeBlock>

        <h2 id="available-tools">Available Tools</h2>

        <h3>Product Discovery Tools</h3>
        <div className="space-y-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">
              searchProducts(query, filters)
            </code>
            <p className="text-sm mt-2 mb-0">
              Search product catalog with advanced filters (category, price
              range, brand, ratings).
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">browseCategories()</code>
            <p className="text-sm mt-2 mb-0">
              List all available product categories and subcategories.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">
              getProductDetails(productId)
            </code>
            <p className="text-sm mt-2 mb-0">
              Get detailed information about a specific product including specs,
              reviews, and availability.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">
              getRecommendations(productId, userId)
            </code>
            <p className="text-sm mt-2 mb-0">
              Get personalized product recommendations based on browsing and
              purchase history.
            </p>
          </div>
        </div>

        <h3>Cart Management Tools</h3>
        <div className="space-y-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">
              addToCart(productId, quantity)
            </code>
            <p className="text-sm mt-2 mb-0">
              Add items to the shopping cart with quantity validation.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">
              updateCartItem(itemId, quantity)
            </code>
            <p className="text-sm mt-2 mb-0">
              Update quantity or remove items from cart.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">viewCart()</code>
            <p className="text-sm mt-2 mb-0">
              View current cart contents with pricing and availability.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">clearCart()</code>
            <p className="text-sm mt-2 mb-0">
              Remove all items from the shopping cart.
            </p>
          </div>
        </div>

        <h3>Checkout Tools</h3>
        <div className="space-y-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">initiateCheckout(cartId)</code>
            <p className="text-sm mt-2 mb-0">
              Begin checkout process and validate cart items.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">validateAddress(address)</code>
            <p className="text-sm mt-2 mb-0">
              Validate shipping address and suggest corrections.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">
              calculateShipping(address, items)
            </code>
            <p className="text-sm mt-2 mb-0">
              Calculate shipping costs and delivery estimates.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">
              completeCheckout(paymentDetails)
            </code>
            <p className="text-sm mt-2 mb-0">
              Complete purchase with secure payment processing.
            </p>
          </div>
        </div>

        <h3>Order Management Tools</h3>
        <div className="space-y-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">trackOrder(orderId)</code>
            <p className="text-sm mt-2 mb-0">
              Get real-time order tracking and delivery status.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-emerald-600">getOrderHistory(userId)</code>
            <p className="text-sm mt-2 mb-0">
              View complete order history with filtering options.
            </p>
          </div>
        </div>

        <h2 id="complete-example">Complete Shopping Flow Example</h2>
        <p>
          Here's a complete example showing a customer journey from product
          search to checkout:
        </p>

        <CodeBlock language="typescript">
          {`import {
  Agent,
  AnthropicProvider,
  ACPClient,
  createACPTools,
  ToolRegistry,
  BufferMemory,
} from '@lov3kaizen/agentsea-core';

// Initialize ACP client
const acpClient = new ACPClient({
  baseUrl: process.env.ACP_BASE_URL,
  apiKey: process.env.ACP_API_KEY,
  merchantId: process.env.MERCHANT_ID,
  enableCaching: true,
});

// Create commerce agent
const shoppingAgent = new Agent(
  {
    name: 'shopping-assistant',
    model: 'claude-sonnet-4-20250514',
    systemPrompt: \`You are a helpful shopping assistant.

Your capabilities:
- Search products and provide recommendations
- Help customers find what they need
- Manage shopping carts
- Process checkouts securely
- Track orders and provide updates

Always:
- Be helpful and conversational
- Confirm actions before proceeding
- Provide clear product information
- Explain shipping costs and delivery times\`,
    tools: createACPTools(acpClient),
  },
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
  new ToolRegistry(),
  new BufferMemory(50),
);

// Customer conversation flow
const context = {
  conversationId: 'customer-123',
  userId: 'user-456',
  sessionData: {},
  history: [],
};

// Step 1: Product search
let result = await shoppingAgent.execute(
  'I need wireless headphones under $100 with good battery life',
  context
);
console.log('Agent:', result.content);

// Step 2: Product details
result = await shoppingAgent.execute(
  'Tell me more about the Sony WH-1000XM4',
  context
);
console.log('Agent:', result.content);

// Step 3: Add to cart
result = await shoppingAgent.execute(
  'Add those Sony headphones to my cart',
  context
);
console.log('Agent:', result.content);

// Step 4: View cart and proceed
result = await shoppingAgent.execute(
  'What\\'s in my cart? How much is shipping to New York?',
  context
);
console.log('Agent:', result.content);

// Step 5: Checkout
result = await shoppingAgent.execute(
  'Proceed to checkout with my saved payment method',
  context
);
console.log('Agent:', result.content);

// Step 6: Order tracking
result = await shoppingAgent.execute(
  'Track my order',
  context
);
console.log('Agent:', result.content);`}
        </CodeBlock>

        <h2 id="payment-processing">Payment Processing</h2>
        <p>
          ACP uses delegated payment providers for secure transaction
          processing:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🔒 Stripe Integration</h4>
            <p className="text-sm text-gray-600">
              Industry-standard payment processing with PCI compliance, fraud
              detection, and support for 135+ currencies.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">💳 PayPal Integration</h4>
            <p className="text-sm text-gray-600">
              Trusted payment platform with buyer protection, one-click
              checkout, and global coverage.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
          <h4 className="text-lg font-semibold text-yellow-900 mb-2">
            🔐 Security Best Practices
          </h4>
          <ul className="text-yellow-800 text-sm space-y-1 m-0">
            <li>✓ PCI DSS compliant - no card data touches your servers</li>
            <li>✓ Tokenized payments - secure payment method storage</li>
            <li>✓ 3D Secure support - additional fraud protection</li>
            <li>✓ Webhook verification - validate all payment events</li>
            <li>✓ HTTPS only - all communications encrypted</li>
          </ul>
        </div>

        <h2 id="use-cases">Use Cases</h2>

        <div className="space-y-4 my-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 font-semibold mb-2">
              🛍️ Voice Shopping Assistant
            </h4>
            <p className="text-blue-800 text-sm m-0">
              Combine ACP with Voice capabilities to create hands-free shopping
              experiences. "Alexa, find me running shoes under $80."
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-purple-900 font-semibold mb-2">
              💬 Chat Commerce
            </h4>
            <p className="text-purple-800 text-sm m-0">
              Integrate shopping into messaging platforms. Let customers browse
              and buy without leaving the conversation.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-green-900 font-semibold mb-2">
              🤖 Personal Shopping Agent
            </h4>
            <p className="text-green-800 text-sm m-0">
              Build AI agents that learn customer preferences and proactively
              suggest products based on history and behavior.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-orange-900 font-semibold mb-2">
              📱 Multi-Channel Commerce
            </h4>
            <p className="text-orange-800 text-sm m-0">
              Deploy the same commerce agent across web, mobile, voice
              assistants, and messaging platforms.
            </p>
          </div>
        </div>

        <h2 id="advanced-features">Advanced Features</h2>

        <h3>Custom Tool Configuration</h3>
        <CodeBlock language="typescript">
          {`import { createACPTools } from '@lov3kaizen/agentsea-core';

// Select specific tools
const tools = createACPTools(acpClient, {
  includeTools: [
    'searchProducts',
    'getProductDetails',
    'addToCart',
    'viewCart',
  ],
  // Or exclude specific tools
  excludeTools: ['clearCart'],
});

// Configure tool behavior
const tools = createACPTools(acpClient, {
  maxResults: 10, // Limit search results
  enableRecommendations: true, // Show related products
  autoValidate: true, // Validate addresses automatically
  currencyCode: 'USD', // Default currency
});`}
        </CodeBlock>

        <h3>Error Handling</h3>
        <CodeBlock language="typescript">
          {`try {
  const result = await shoppingAgent.execute(input, context);
  console.log(result.content);
} catch (error) {
  if (error.code === 'INSUFFICIENT_INVENTORY') {
    console.log('Product is out of stock');
  } else if (error.code === 'PAYMENT_FAILED') {
    console.log('Payment was declined');
  } else if (error.code === 'INVALID_ADDRESS') {
    console.log('Shipping address is invalid');
  } else {
    console.error('Unexpected error:', error);
  }
}`}
        </CodeBlock>

        <h3>Webhooks and Events</h3>
        <CodeBlock language="typescript">
          {`// Listen to commerce events
acpClient.on('order.created', (order) => {
  console.log('New order:', order.id);
  // Send confirmation email
  // Update inventory
  // Trigger fulfillment
});

acpClient.on('payment.succeeded', (payment) => {
  console.log('Payment received:', payment.amount);
});

acpClient.on('order.shipped', (order) => {
  console.log('Order shipped:', order.trackingNumber);
  // Send tracking notification
});`}
        </CodeBlock>

        <h2 id="nestjs-integration">NestJS Integration</h2>
        <p>Use ACP commerce in your NestJS applications:</p>

        <CodeBlock language="typescript">
          {`import { Module } from '@nestjs/common';
import { AgenticModule } from '@lov3kaizen/agentsea-nestjs';

@Module({
  imports: [
    AgenticModule.forRoot({
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      acp: {
        baseUrl: process.env.ACP_BASE_URL,
        apiKey: process.env.ACP_API_KEY,
        merchantId: process.env.MERCHANT_ID,
      },
    }),
  ],
})
export class AppModule {}

// Use in a service
import { Injectable } from '@nestjs/common';
import { AgentService } from '@lov3kaizen/agentsea-nestjs';

@Injectable()
export class ShoppingService {
  constructor(private agentService: AgentService) {}

  async processCustomerRequest(input: string, userId: string) {
    const agent = this.agentService.getAgent('shopping-assistant');
    return agent.execute(input, { userId });
  }
}`}
        </CodeBlock>

        <h2 id="best-practices">Best Practices</h2>

        <div className="space-y-4 my-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 font-semibold mb-2">
              🎯 Clear System Prompts
            </h4>
            <p className="text-blue-800 text-sm m-0">
              Define agent behavior clearly. Specify when to recommend products,
              how to handle price ranges, and when to ask for clarification.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-purple-900 font-semibold mb-2">
              💰 Price Transparency
            </h4>
            <p className="text-purple-800 text-sm m-0">
              Always show total costs including shipping and taxes. Confirm
              prices before checkout to avoid surprises.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-green-900 font-semibold mb-2">
              🔒 Secure Payments
            </h4>
            <p className="text-green-800 text-sm m-0">
              Never store payment details directly. Use tokenized payment
              methods and let delegated providers handle sensitive data.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-orange-900 font-semibold mb-2">
              📱 Mobile-First
            </h4>
            <p className="text-orange-800 text-sm m-0">
              Optimize for mobile shopping. Keep interactions concise and make
              checkout flows seamless on small screens.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-900 font-semibold mb-2">
              ⚠️ Inventory Checks
            </h4>
            <p className="text-red-800 text-sm m-0">
              Validate inventory before adding to cart. Show availability status
              and estimated delivery times upfront.
            </p>
          </div>
        </div>

        <h2 id="performance">Performance Optimization</h2>

        <CodeBlock language="typescript">
          {`const acpClient = new ACPClient({
  baseUrl: process.env.ACP_BASE_URL,
  apiKey: process.env.ACP_API_KEY,
  merchantId: process.env.MERCHANT_ID,

  // Performance optimization
  enableCaching: true, // Cache product data
  cacheDuration: 300000, // 5 minutes
  connectionPoolSize: 10, // HTTP connection pool
  timeout: 30000, // 30 second timeout
  retryAttempts: 3, // Retry failed requests

  // Rate limiting
  rateLimitPerSecond: 100, // Max 100 requests/sec
  rateLimitBurst: 10, // Allow bursts of 10
});`}
        </CodeBlock>

        <h2 id="troubleshooting">Troubleshooting</h2>

        <div className="space-y-4 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Connection Errors</h4>
            <p className="text-sm text-gray-600 mb-2">
              If you see "Failed to connect to ACP API":
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Verify ACP_BASE_URL is correct</li>
              <li>✓ Check API key is valid</li>
              <li>✓ Ensure network allows outbound HTTPS</li>
              <li>✓ Run healthCheck() to test connection</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Payment Failures</h4>
            <p className="text-sm text-gray-600 mb-2">
              Common payment issues and solutions:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Verify payment provider credentials</li>
              <li>✓ Check webhook endpoints are accessible</li>
              <li>✓ Ensure 3D Secure is properly configured</li>
              <li>✓ Review error logs for specific decline codes</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Tool Execution Issues</h4>
            <p className="text-sm text-gray-600 mb-2">
              If tools aren't being called correctly:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Check system prompt includes commerce instructions</li>
              <li>✓ Verify tools are properly registered</li>
              <li>✓ Enable debug logging to see tool calls</li>
              <li>✓ Ensure model supports function calling</li>
            </ul>
          </div>
        </div>

        <h2 id="next-steps">Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/agents">Learn about Agent Configuration</Link> -
            Customize your commerce agents
          </li>
          <li>
            <Link href="/docs/voice">Add Voice Capabilities</Link> - Build voice
            shopping experiences
          </li>
          <li>
            <Link href="/docs/nestjs">NestJS Integration</Link> - Use ACP in
            NestJS apps
          </li>
          <li>
            <Link href="/examples">View Examples</Link> - Complete commerce
            examples
          </li>
          <li>
            <Link href="/docs/mcp-overview">MCP Protocol</Link> - Combine with
            MCP tools
          </li>
        </ul>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-emerald-900 mb-2">
            💡 Pro Tip
          </h3>
          <p className="text-emerald-800 m-0">
            Start with a simple product search agent, then gradually add cart
            management and checkout capabilities. Test thoroughly in sandbox
            mode before going to production. Combine with Voice features for
            truly unique shopping experiences.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
