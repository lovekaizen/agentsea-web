import type { Metadata } from 'next';
import DocsShell from '../../components/docs/DocsShell';
import DocSection from '../../components/docs/DocSection';
import CodeBlock from '../../components/docs/CodeBlock';
import BulletPanel from '../../components/docs/BulletPanel';
import Callout from '../../components/docs/Callout';

export const metadata: Metadata = {
  title: 'ACP | AgentSea',
  description: 'Give an agent commerce tools that call an ACP-compliant backend through ACPClient.',
};

const toc = [
  { id: 'setup', label: 'Setup' },
  { id: 'tools', label: 'Tools' },
  { id: 'client-methods', label: 'Client methods' },
  { id: 'checkout', label: 'Checkout and payments' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
];

export default function AcpIntegrationPage() {
  return (
    <DocsShell
      eyebrow="Guide"
      title="ACP"
      lead="Give an agent commerce tools that call an ACP-compliant backend through ACPClient."
      active="guides"
      toc={toc}
    >
      <DocSection id="setup" num="01" title="Setup">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>ACPClient</code> takes a config with <code>baseUrl</code>, and optionally <code>apiKey</code>,{' '}
          <code>merchantId</code>, <code>timeout</code> (in milliseconds) and <code>headers</code>.{' '}
          <code>createACPTools(client)</code> returns tools that an agent can call.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { ACPClient, Agent, AnthropicProvider, ToolRegistry, createACPTools } from '@lov3kaizen/agentsea-core';

const acpClient = new ACPClient({
  baseUrl: 'https://api.yourcommerce.com/v1',
  apiKey: process.env.ACP_API_KEY,
  merchantId: process.env.ACP_MERCHANT_ID,
  timeout: 30000,
});

const acpTools = createACPTools(acpClient);
const toolRegistry = new ToolRegistry();
toolRegistry.registerMany(acpTools);

const agent = new Agent(
  { name: 'shopping-assistant', description: 'Shopping assistant', model: 'claude-sonnet-4-6', provider: 'anthropic', tools: acpTools },
  new AnthropicProvider(),
  toolRegistry,
);`}
        />
        <Callout kind="note">
          The example registers the ACP tools with <code>toolRegistry.registerMany(acpTools)</code>.
        </Callout>
      </DocSection>

      <DocSection id="tools" num="02" title="Tools">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>createACPTools</code> returns 14 tools. Their names are:
        </p>
        <BulletPanel
          items={[
            <>
              <code>acp_search_products</code>, <code>acp_get_product</code>
            </>,
            <>
              <code>acp_create_cart</code>, <code>acp_get_cart</code>, <code>acp_add_to_cart</code>,{' '}
              <code>acp_update_cart_item</code>, <code>acp_remove_from_cart</code>
            </>,
            <>
              <code>acp_create_checkout</code>, <code>acp_update_shipping_address</code>,{' '}
              <code>acp_update_payment_method</code>, <code>acp_complete_checkout</code>
            </>,
            <>
              <code>acp_get_order</code>, <code>acp_cancel_order</code>, <code>acp_get_order_tracking</code>
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="client-methods" num="03" title="Client methods">
        <p className="text-base leading-relaxed text-brand-navy">
          The tools call these <code>ACPClient</code> methods. Each returns an <code>ACPResponse</code>.
        </p>
        <BulletPanel
          items={[
            <>
              Products: <code>searchProducts</code>, <code>getProduct</code>, <code>getProducts</code>
            </>,
            <>
              Carts: <code>createCart</code>, <code>getCart</code>, <code>addToCart</code>,{' '}
              <code>updateCartItem</code>, <code>removeFromCart</code>, <code>clearCart</code>
            </>,
            <>
              Checkout: <code>createCheckoutSession</code>, <code>getCheckoutSession</code>,{' '}
              <code>updateShippingAddress</code>, <code>updateBillingAddress</code>, <code>updatePaymentMethod</code>,{' '}
              <code>completeCheckout</code>
            </>,
            <>
              Payments: <code>createDelegatedPayment</code>, <code>getPaymentIntent</code>,{' '}
              <code>confirmPayment</code>
            </>,
            <>
              Orders: <code>getOrder</code>, <code>getCustomerOrders</code>, <code>cancelOrder</code>,{' '}
              <code>getOrderTracking</code>
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="checkout" num="04" title="Checkout and payments">
        <p className="text-base leading-relaxed text-brand-navy">
          A checkout runs in this order: create a cart, add items, create a checkout session, set the shipping address
          and payment method, then call <code>completeCheckout</code>. Payment uses a delegated payment token. The
          agent should never ask for raw card numbers.
        </p>
        <CodeBlock
          lang="TS"
          code={`const systemPrompt = \`You are a shopping assistant.
Confirm prices and totals before adding items to a cart.
Ask the user to confirm before completing a purchase.
Never ask for raw credit card numbers.\`;`}
        />
        <Callout kind="warning">
          <code>acp_complete_checkout</code> finalizes a purchase. The prompt above asks the agent to confirm first.
          Nothing in the code enforces that step, so add your own confirmation before the tool runs.
        </Callout>
      </DocSection>

      <DocSection id="configuration" num="05" title="Configuration">
        <BulletPanel
          items={[
            <>
              <code>baseUrl</code>: required.
            </>,
            <>
              <code>apiKey</code> and <code>merchantId</code>: optional. Pass them from environment variables.
            </>,
            <>
              <code>timeout</code>: request timeout in milliseconds. The example uses 30000.
            </>,
            <>
              <code>headers</code>: extra request headers, as a string map.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="troubleshooting" num="06" title="Troubleshooting">
        <BulletPanel
          items={[
            'Tool not found: register the ACP tools with the ToolRegistry the agent was constructed with. The agent config alone is not enough.',
            <>
              Timeouts: raise <code>timeout</code> on <code>ACPClient</code>.
            </>,
            'Failed payments: check the payment token and the merchant account. Error codes are not listed here.',
          ]}
        />
      </DocSection>
    </DocsShell>
  );
}
